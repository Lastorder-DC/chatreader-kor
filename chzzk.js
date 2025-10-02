/**
 * @file CHZZK chat integration helper
 * Provides a lightweight client for connecting to CHZZK chat WebSocket and
 * emitting simplified chat events that the existing TTS pipeline can consume.
 */
(function(global) {
    const DEFAULT_RETRY_MS = 5000;

    const CMD = {
        PING: 0,
        PONG: 10000,
        CONNECT: 100,
        CONNECTED: 10100,
        REQUEST_RECENT_CHAT: 5101,
        RECENT_CHAT: 15101,
        CHAT: 93101,
        DONATION: 93102,
        NOTICE: 94010,
        BLIND: 94006
    };

    const CHAT_TYPE = {
        TEXT: 1,
        IMAGE: 2,
        STICKER: 3,
        VIDEO: 4,
        RICH: 5,
        DONATION: 10,
        SUBSCRIPTION: 11,
        SYSTEM_MESSAGE: 30
    };

    /**
     * Lightweight CHZZK chat client.
     */
    class ChzzkChatClient {
        constructor(channelId, handlers = {}) {
            this.channelId = channelId;
            this.chatChannelId = null;
            this.channelName = null;
            this.accessToken = null;
            this.extraToken = null;
            this.ws = null;
            this.sid = null;
            this.connected = false;
            this.handlers = handlers;
            this.retryTimer = null;
            this.pingTimer = null;
        }

        async start() {
            await this.stop();
            await this.establish();
        }

        async establish() {
            try {
                await this.refreshMetadata();
                this.openSocket();
            } catch (error) {
                this.emit('error', error);
                this.scheduleRetry();
            }
        }

        async refreshMetadata() {
            const liveDetailUrl = `https://api.chzzk.naver.com/service/v2/channels/${this.channelId}/live-detail`;
            const liveResponse = await fetch(liveDetailUrl, { credentials: 'omit' });
            if (!liveResponse.ok) {
                throw new Error('라이브 정보를 불러오지 못했습니다.');
            }

            const liveJson = await liveResponse.json();
            const content = liveJson?.content || {};

            if (!content.chatChannelId) {
                throw new Error('현재 라이브가 진행 중이 아니거나 채팅을 사용할 수 없습니다.');
            }

            this.chatChannelId = content.chatChannelId;
            this.channelName = content?.channel?.channelName || '';

            const tokenUrl = `https://comm-api.game.naver.com/nng_main/v1/chats/access-token?channelId=${this.chatChannelId}&chatType=STREAMING`;
            const tokenResponse = await fetch(tokenUrl, { credentials: 'omit' });
            if (!tokenResponse.ok) {
                throw new Error('채팅 토큰을 가져오지 못했습니다.');
            }

            const tokenJson = await tokenResponse.json();
            this.accessToken = tokenJson?.content?.accessToken || null;
            this.extraToken = tokenJson?.content?.extraToken || null;

            if (!this.accessToken) {
                throw new Error('유효한 채팅 토큰이 없습니다.');
            }
        }

        openSocket() {
            const serverIndex = Math.abs(Array.from(this.chatChannelId).map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0)) % 9 + 1;
            const wsUrl = `wss://kr-ss${serverIndex}.chat.naver.com/chat`;

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                this.send({
                    ver: '2',
                    cmd: CMD.CONNECT,
                    svcid: 'game',
                    cid: this.chatChannelId,
                    tid: 1,
                    bdy: {
                        uid: null,
                        devType: 2001,
                        accTkn: this.accessToken,
                        auth: 'READ'
                    }
                });
            };

            this.ws.onmessage = (event) => this.handleMessage(event);

            this.ws.onerror = (event) => {
                this.emit('error', new Error('치지직 채팅 연결 오류가 발생했습니다.'));
            };

            this.ws.onclose = () => {
                if (this.connected) {
                    this.emit('disconnect', this.chatChannelId);
                }

                this.connected = false;
                this.ws = null;
                this.stopPingTimer();
                this.scheduleRetry();
            };
        }

        send(payload) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(payload));
            }
        }

        requestRecent(count = 50) {
            if (!this.sid) return;
            this.send({
                ver: '2',
                cmd: CMD.REQUEST_RECENT_CHAT,
                svcid: 'game',
                cid: this.chatChannelId,
                sid: this.sid,
                tid: 2,
                bdy: { recentMessageCount: count }
            });
        }

        async stop() {
            if (this.retryTimer) {
                clearTimeout(this.retryTimer);
                this.retryTimer = null;
            }

            this.stopPingTimer();

            if (this.ws) {
                try {
                    this.ws.close();
                } catch (error) {
                    // ignore close errors
                }
            }

            this.ws = null;
            this.connected = false;
            this.sid = null;
        }

        scheduleRetry() {
            if (this.retryTimer) return;

            this.retryTimer = setTimeout(async () => {
                this.retryTimer = null;
                await this.establish();
            }, DEFAULT_RETRY_MS);
        }

        startPingTimer() {
            this.stopPingTimer();
            this.pingTimer = setTimeout(() => this.sendPing(), 20000);
        }

        stopPingTimer() {
            if (this.pingTimer) {
                clearTimeout(this.pingTimer);
            }
            this.pingTimer = null;
        }

        sendPing() {
            if (!this.ws) return;
            this.send({
                ver: '2',
                cmd: CMD.PING
            });
            this.startPingTimer();
        }

        handleMessage(event) {
            let json;
            try {
                json = JSON.parse(event.data);
            } catch (error) {
                this.emit('error', error);
                return;
            }

            const body = json?.bdy || {};

            switch (json.cmd) {
                case CMD.CONNECTED:
                    this.connected = true;
                    this.sid = body.sid;
                    this.emit('connect', { channelId: this.channelId, channelName: this.channelName });
                    this.requestRecent();
                    break;

                case CMD.PING:
                    this.send({
                        ver: '2',
                        cmd: CMD.PONG
                    });
                    break;

                case CMD.CHAT:
                case CMD.RECENT_CHAT:
                case CMD.DONATION: {
                    const isRecent = json.cmd === CMD.RECENT_CHAT;
                    const notice = body.notice;
                    const messages = Array.isArray(body.messageList) ? body.messageList : (Array.isArray(body) ? body : [body]);

                    if (notice) {
                        this.emit('notice', this.parseChat(notice, isRecent));
                    }

                    messages.forEach((chat) => {
                        const type = chat.msgTypeCode || chat.messageTypeCode || '';
                        const parsed = this.parseChat(chat, isRecent);

                        switch (type) {
                            case CHAT_TYPE.TEXT:
                                this.emit('chat', parsed);
                                break;
                            case CHAT_TYPE.DONATION:
                                this.emit('donation', parsed);
                                break;
                            case CHAT_TYPE.SUBSCRIPTION:
                                this.emit('subscription', parsed);
                                break;
                            case CHAT_TYPE.SYSTEM_MESSAGE:
                                this.emit('systemMessage', parsed);
                                break;
                            default:
                                break;
                        }
                    });
                    break;
                }

                case CMD.NOTICE:
                    if (body && Object.keys(body).length !== 0) {
                        this.emit('notice', this.parseChat(body));
                    }
                    break;

                case CMD.BLIND:
                    this.emit('blind', body);
                    break;
                default:
                    break;
            }

            if (json.cmd !== CMD.PONG) {
                this.startPingTimer();
            }
        }

        parseChat(chat, isRecent = false) {
            let profile = {};
            let extras = null;

            try {
                profile = chat.profile ? JSON.parse(chat.profile) : {};
            } catch (error) {
                profile = {};
            }

            try {
                extras = chat.extras ? (typeof chat.extras === 'string' ? JSON.parse(chat.extras) : chat.extras) : null;
            } catch (error) {
                extras = null;
            }

            if (extras?.params) {
                const params = extras.params;
                if (params.registerChatProfileJson && !params.registerChatProfile) {
                    try {
                        params.registerChatProfile = JSON.parse(params.registerChatProfileJson);
                    } catch (error) {
                        params.registerChatProfile = null;
                    }
                }

                if (params.targetChatProfileJson && !params.targetChatProfile) {
                    try {
                        params.targetChatProfile = JSON.parse(params.targetChatProfileJson);
                    } catch (error) {
                        params.targetChatProfile = null;
                    }
                }
            }

            const message = chat.msg || chat.message || chat.content || '';
            const memberCount = chat.mbrCnt || chat.memberCount || 0;
            const time = chat.msgTime || chat.messageTime || Date.now();
            const hidden = (chat.msgStatusType || chat.messageStatusType) === 'HIDDEN';

            return {
                profile,
                extras,
                message,
                memberCount,
                time,
                hidden,
                isRecent
            };
        }

        emit(type, payload) {
            if (typeof this.handlers[type] === 'function') {
                this.handlers[type](payload);
            }
        }
    }

    global.ChzzkChatClient = ChzzkChatClient;
})(window);
