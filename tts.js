/**
 * @file TTS Helper script
 * @copyright Lastorder-DC 2017-2021
 */
 
window.success = window.createNotification({
    closeOnClick: false,
    displayCloseButton: true,
    positionClass: 'nfc-top-left',
    showDuration: 3000,
    theme: 'success'
});

window.warning = window.createNotification({
    closeOnClick: false,
    displayCloseButton: true,
    positionClass: 'nfc-top-left',
    showDuration: 3000,
    theme: 'warning'
});

window.error = window.createNotification({
    closeOnClick: false,
    displayCloseButton: true,
    positionClass: 'nfc-top-left',
    showDuration: 3000,
    theme: 'error'
});

window.plain = window.createNotification({
    closeOnClick: false,
    displayCloseButton: true,
    positionClass: 'nfc-top-left',
    showDuration: 3000,
    theme: 'none'
});

/**
 * 채널 변경 함수
 */
function change_channel() {
    bootbox.prompt("채널 아이디를 입력해주세요.", function(result){ 
        if (result === "" || result == null) {
            location.reload()
        } else {
            window.channelname = result;
            location.href = url.origin + url.pathname + "?channel=" + result;
        }
    });
}

/**
 * 새로운 채팅이 올라오면 자동 스크롤하는 함수
 */
function scrollBottom() {
    const objDiv = document.getElementById("last_read");
    objDiv.scrollTop = objDiv.scrollHeight;
    if(!window.stopScroll) setTimeout(scrollBottom, 100);
}

/**
 * 브라우저에서 명령 실행시 콜백 실행
 * @param {Boolean} result 성공 여부
 * @param {String} msg 표시할 메세지
 * @param {Boolean} usecoloredchat 색챗 사용여부(미사용)
 */
function displayResultFromUI(result, msg, usecoloredchat = true) {
    if(result) window.success({ 
        title: '작업 성공',
        message: msg 
    });
    else window.error({ 
        title: '작업 실패',
        message: msg 
    });
}

/**
 * 채팅창에서 명령 실행시 콜백 실행
 * @param {Boolean} result 성공 여부
 * @param {String} msg 표시할 메세지
 * @param {Boolean} usecoloredchat 색챗 사용여부
 */
function displayResultFromChat(result, msg, usecoloredchat = true) {
    const header = usecoloredchat ? "/me [TTSBOT] " : "[TTSBOT] ";
    
    client.say(window.channelname, header + msg);
}

/**
 * 시청자 TTS 차단
 * @param {String} username 시청자 이름
 * @param {Function} callback 실행 결과 콜백
 */
function banUser(username, callback) {
    if(username != "") {
        let index = window.banlist.indexOf(username);
        if (index === -1) {
            window.banlist.push(username);
            localStorage.setItem("tts_banlist_" + window.channelname, window.banlist.join("|"));
            callback(true, "시청자 " + username + " 를 차단했습니다.");
        } else {
            callback(false, "시청자 " + username + " 은 이미 차단되어 있습니다.");
        }
    } else {
        callback(false, "시청자 이름은 비어 있을수 없습니다.");
    }
}

/**
 * 시청자 TTS 차단 해제
 * @param {String} username 시청자 이름
 * @param {Function} callback 실행 결과 콜백
 */
function unbanUser(username, callback) {
    if(username != "") {
        let index = window.banlist.indexOf(username);
        if (index !== -1) {
            window.banlist.splice(index, 1);
            localStorage.setItem("tts_banlist_" + window.channelname, window.banlist.join("|"));
            callback(true, "시청자 " + username + " 를 차단 해제했습니다.");
        } else {
            callback(false, "시청자 " + username + " 는 차단되어 있지 않습니다.");
        }
    } else {
        callback(false, "시청자 이름은 비어 있을수 없습니다.");
    }
}

/**
 * 시청자 TTS 설정
 * @param {String} voicename 설정할 TTS(default or polly)
 * @param {Function} callback 실행 결과 콜백
 */
function setVoice(voicename, callback) {
    if (["default", "polly"].indexOf(voicename) !== -1) {
        window.def_voice = voicename;
        localStorage.setItem("def_voice", voicename);
        callback(true, "기본 보이스가 변경되었습니다 - " + voicename);
    } else {
        callback(false, "잘못된 보이스입니다 - " + voicename);
    }
}

/**
 * 구독자 전용 모드 설정
 * @param {String} mode 켜기/끄기 여부
 * @param {Function} callback 실행 결과 콜백
 */
function setSubOnly(mode, callback) {
    if (mode === "on" || mode === "true" || mode === "enable") {
        window.tts_subonly = true;
        localStorage.setItem("tts_subonly", "true");
        callback(true, "구독자 전용 TTS 모드가 활성화되었습니다.");
    }
    if (mode === "off" || mode === "false" || mode === "disable") {
        window.tts_subonly = false;
        localStorage.setItem("tts_subonly", "false");
        callback(true, "구독자 전용 TTS 모드가 비활성화되었습니다.");
    }
}

/**
 * 개설자 전용 모드 설정
 * @param {String} mode 켜기/끄기 여부
 * @param {Function} callback 실행 결과 콜백
 */
function setFounderOnly(mode, callback) {
    if (mode === "on" || mode === "true" || mode === "enable") {
        window.tts_founderonly = true;
        localStorage.setItem("tts_founderonly", "true");
        callback(true, "개설자 전용 TTS 모드가 활성화되었습니다.");
    }
    if (mode === "off" || mode === "false" || mode === "disable") {
        window.tts_founderonly = false;
        localStorage.setItem("tts_founderonly", "false");
        callback(true, "개설자 전용 TTS 모드가 비활성화되었습니다.");
    }
}

/**
 * 시청자 전용 모드 설정
 * @param {String} mode 켜기/끄기 여부
 * @param {Function} callback 실행 결과 콜백
 */
function setViewerOnly(mode, callback) {
    if (mode === "on" || mode === "true" || mode === "enable") {
        window.tts_vieweronly = true;
        localStorage.setItem("tts_vieweronly", "true");
        callback(true, "시청자 전용 TTS 모드가 활성화되었습니다.");
    }
    if (mode === "off" || mode === "false" || mode === "disable") {
        window.tts_vieweronly = false;
        localStorage.setItem("tts_vieweronly", "false");
        callback(true, "시청자 전용 TTS 모드가 비활성화되었습니다.");
    }
}

/**
 * TTS 개인화 활성화 여부 설정
 * @param {String} mode 켜기/끄기 여부
 * @param {Function} callback 실행 결과 콜백
 */
function setUniq(mode, callback) {
    if (mode === "on" || mode === "true" || mode === "enable") {
        window.uniq_voice = true;
        localStorage.setItem("uniq_voice", "true");
        callback(true, "TTS 보이스 개인화가 활성화되었습니다.");
    }
    if (mode === "off" || mode === "false" || mode === "disable") {
        window.uniq_voice = false;
        localStorage.setItem("uniq_voice", "false");
        callback(true, "TTS 보이스 개인화가 비활성화되었습니다.");
    }
}

/**
 * TTS 최대 길이 설정
 * @param {String|Number} length 최대 길이(최대 120)
 * @param {Function} callback 실행 결과 콜백
 */
function setMaxLength(length, callback) {
    if (parseInt(length) > 0) {
        window.maxlength = parseInt(length);
        if (window.maxlength > 120) window.maxlength = 120;
        localStorage.setItem("tts_maxlength", window.maxlength.toString());
        callback(true, "최대 TTS 글자수가 " + window.maxlength.toString() + "글자로 바뀌었습니다.");
    } else {
        callback(false, "잘못된 숫자 " + length + "가 입력되었습니다.");
    }
}

/**
 * TTS 볼륨 설정
 * @param {String|Number} volume 볼륨(0 - 100)
 * @param {Function} callback 실행 결과 콜백
 */
function setVolume(volume, callback) {
    if (parseInt(volume) > 0) {
        window.volume = parseInt(volume);
        if (window.volume > 100) window.volume = 100;
        localStorage.setItem("tts_volume", window.volume.toString());
        callback(true, "TTS 볼륨이 " + window.volume.toString() + "로 바뀌었습니다.");
    } else {
        callback(false, "잘못된 숫자 " + volume + "가 입력되었습니다.");
    }
}

/**
 * 차단 목록 초기화
 */
function clearBan(callback) {
    window.banlist = ['Nightbot', '싹둑'];
    localStorage.setItem("tts_banlist_" + window.channelname, window.banlist.join("|"));
    callback(true, "차단 목록을 초기화했습니다.");
}

/**
 * 허용 목록 초기화
 */
function clearList(callback) {
    window.whitelist = [];
    localStorage.setItem("tts_whitelist_" + window.channelname, window.whitelist.join("|"));
    callback(true, "허용 목록을 초기화했습니다.");
}

/**
 * 허용 목록에서 제외
 * @param {String} username 시청자 이름
 * @param {Function} callback 실행 결과 콜백
 */
function removeList(username, callback) {
    if (username !== "") {
        let index = window.whitelist.indexOf(username);
        if (index !== -1) {
            window.whitelist.splice(index, 1);
            localStorage.setItem("tts_whitelist_" + window.channelname, window.whitelist.join("|"));
            callback(true, "시청자 " + username + " 를 허용 목록에서 삭제했습니다.");
            if(window.whitelist.length < 1) {
                callback(true, "허용 목록이 비었으므로 비활성화됩니다.");
            }
        } else {
            callback(false, "시청자 " + username + " 는 허용 목록에 없습니다.");
        }
    }
}

/**
 * 허용 목록에 추가
 * @param {String} username 시청자 이름
 * @param {Function} callback 실행 결과 콜백
 */
function addList(username, callback) {
    if (username !== "") {
        const old_length = window.whitelist.length;
        let index = window.whitelist.indexOf(username);
        if (index === -1) {
            window.whitelist.push(username);
            localStorage.setItem("tts_whitelist_" + window.channelname, window.whitelist.join("|"));
            callback(true, "시청자 " + username + " 를 허용 목록에 추가했습니다.");
            if(old_length == 0) {
                callback(true, "이제부터 허용 목록을 사용합니다.");
            }
        } else {
            callback(false, "시청자 " + username + " 는 이미 허용 목록에 있습니다.");
        }
    }
}

/**
 * 단어 TTS 차단 해제
 * @param {String} keyword 차단해제할 단어
 * @param {Function} callback 실행 결과 콜백
 */
function delKeyword(keyword, callback) {
    if (keyword !== "") {
        let index = window.bankeyword.indexOf(escapeRegExp(keyword));
        if (index !== -1) {
            window.bankeyword.splice(index, 1);
            localStorage.setItem("tts_bankeyword_" + window.channelname, window.bankeyword.join("|"));
            callback(true, "키워드 " + keyword + " 를 차단 해제했습니다.");
        } else {
            callback(false, "키워드 " + keyword + " 는 차단되어 있지 않습니다.");
        }
    }
}

/**
 * 단어 TTS 차단
 * @param {String} keyword 차단할 단어
 * @param {Function} callback 실행 결과 콜백
 */
function addKeyword(keyword, callback) {
    if (keyword !== "") {
        let index = window.bankeyword.indexOf(escapeRegExp(keyword));
        if (index === -1) {
            window.bankeyword.push(escapeRegExp(keyword));
            localStorage.setItem("tts_bankeyword_" + window.channelname, window.bankeyword.join("|"));
            callback(true, "키워드 " + keyword + " 를 차단했습니다.");
        } else {
            callback(false, "키워드 " + keyword + " 은 이미 차단되어 있습니다.");
        }
    }
}

/**
 * TTS 체크하여 사용 가능 여부 설정
 */
function checkTTS() {
    if ('speechSynthesis' in window) {
        window.utterances = [];

        const msg = new SpeechSynthesisUtterance(window.channelname + " 채널에 연결되었습니다.");
        msg.rate = 1.3;
        speechSynthesis.cancel();

        msg.onerror = function (event) {
            console.debug("onerror event - " + JSON.stringify(event));
            if (speechSynthesis.getVoices().length === 0) {
                document.getElementById("last_read").innerHTML = "사용 가능한 TTS 보이스가 없습니다.";
            } else {
                document.getElementById("last_read").innerHTML = "알 수 없는 오류가 발생했습니다. 브라우저 콘솔창을 참조하세요.";

            }
        };

        msg.onend = function (event) {
            console.debug("onend event - " + JSON.stringify(event));
            const voices = speechSynthesis.getVoices();

            if (voices.length === 0) {
                alert("사용 가능한 TTS DB 없음");
            } else {
                window.initok = true;
            }

            document.getElementById("btn-cancel").disabled = false;
            document.getElementById("btn-cancel").innerHTML = "큐 비우기";
            document.getElementById("btn-logout").disabled = false;
        };

        utterances.push(msg);
        window.speechSynthesis.speak(msg);
    } else {
        alert("TTS API 미지원으로 사용 불가능");
    }
}

/**
 * 채팅으로 친 !!tts 명령 해석
 * @param {Object} e 채팅 오브젝트
 */
function parseCmd(e) {
    let command = e.text.replace("!!tts ", "");
    if (command !== "") {
        if (command.indexOf("voice ") !== -1) {
            command = command.replace("voice ", "");
            setVoice(command, displayResultFromChat);
        }

        if (command.indexOf("subonly ") !== -1) {
            command = command.replace("subonly ", "");
            setSubOnly(command, displayResultFromChat);
        }

        if (command.indexOf("founderonly ") !== -1) {
            command = command.replace("founderonly ", "");
            setFounderOnly(command, displayResultFromChat);
        }

        if (command.indexOf("vieweronly ") !== -1) {
            command = command.replace("vieweronly ", "");
            setViewerOnly(command, displayResultFromChat);
        }

        if (command.indexOf("uniq ") !== -1) {
            command = command.replace("uniq ", "");
            setUniq(command, displayResultFromChat);
        }

        if (command.indexOf("maxlength ") !== -1) {
            command = command.replace("maxlength ", "");
            setMaxLength(command, displayResultFromChat);
        }

        if (command.indexOf("volume ") !== -1) {
            command = command.replace("volume ", "");
            setVolume(command, displayResultFromChat);
        }

        if (command.indexOf("unban ") !== -1) {
            command = command.replace("unban ", "");
            unbanUser(command, displayResultFromChat);
        } else {
            if (command.indexOf("ban ") !== -1) {
                command = command.replace("ban ", "");
                banUser(command, displayResultFromChat);
            }
        }
        
        if (command.indexOf("clearban") !== -1) {
            clearBan(displayResultFromChat);
        }
        
        if (command.indexOf("clearlist") !== -1) {
            clearList(displayResultFromChat);
        }
        
        if (command.indexOf("removelist ") !== -1) {
            command = command.replace("removelist ", "");
            removeList(command, displayResultFromChat);
        }
        
        if (command.indexOf("addlist ") !== -1) {
            command = command.replace("addlist ", "");
            addList(command, displayResultFromChat);
        }

        if (command.indexOf("del ") !== -1) {
            command = command.replace("del ", "");
            delKeyword(command, displayResultFromChat);
        }
        
        if (command.indexOf("add ") !== -1) {
            command = command.replace("add ", "");
            addKeyword(command, displayResultFromChat);
        }
    }
}

/**
 * 일반 채팅 해석
 * @param {Object} e 채팅 오브젝트
 */
function parseChat(e) {
    let personality_pitch;
    let personality_speed;
    
    // 초기화 후에만 읽음
    if (window.initok) {
        const index = window.banlist.indexOf(e.from);
        const index_whitelist = window.whitelist.length != 0 ? window.whitelist.indexOf(e.from) : 0;
        let message = e.text;
        const keyword_test = new RegExp("(" + window.bankeyword.join("|") + ")", "g");
        let voicename = window.def_voice;

        // Personality 적용
        const personality_range1 = [1, 1.4];
        const personality_range2 = [0.9, 1.2];

        let personality_int1 = 0, personality_int2 = 0;

        // 금지단어 포함 메세지 전체 읽지 않음
        if (keyword_test.test(message)) return;

        if (window.uniq_voice) {
            for (let i = 0; i < e.from.length; i++) {
                personality_int1 += e.from.charCodeAt(i);
                personality_int2 |= e.from.charCodeAt(i);
            }
            personality_int1 %= ((personality_range1[1] * 10 - personality_range1[0] * 10) + 1);
            personality_int2 %= ((personality_range2[1] * 10 - personality_range2[0] * 10) + 1);

            personality_speed = 1 + (personality_int1 / 10) - (1 - personality_range1[0]);
            if (personality_speed < 0.8) personality_speed = window.nonmod_speed;
            personality_speed = Math.min(personality_speed, personality_range1[1]);

            personality_pitch = 1 + (personality_int2 / 10) - (1 - personality_range2[0]);
            if (personality_pitch < 0.8) personality_pitch = window.nonmod_speed;
            personality_pitch = Math.min(personality_pitch, personality_range2[1]);
        } else {
            personality_speed = 1;
            personality_pitch = 1;
        }

        // 메세지 필터링
        // 클립 링크는 "클립"으로 읽음
        message = message.replace(/https:\/\/clips.twitch.tv\/[^ ]+/g, "클립");
        
        // 210229 신규 클립링크(twitch.tv/(bid)/clip/(cid)도 바꿈
        message = message.replace(/https:\/\/www.twitch.tv\/[^\/]+\/clip\/[^ ]+/g, "클립");

        // 링크는 "링크"로 읽음
        message = message.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g, "링크");

        // ? [ ] { } ( )는 읽지 않음
        message = message.replace(/[\[\](){}]/g, "");

        // &~~~;와 같은 엔티티 문자는 읽지 않음
        message = message.replace(/&(.*?);/g, "");

        // 이모지는 읽지 않음
        message = message.replace(/\ud83d[\ude00-\ude4f]/g, "");

        // ?는 한번만 읽음
        message = message.replace(/\?{2,}/g, "?");

        // 물결표는 한번만 읽음
        message = message.replace(/~{2,}/g, "~");

        // ㅋ이 3번 이상 있으면 3번만 읽음
        message = message.replace(/ㅋ{3,}/g, "ㅋㅋㅋ");

        // 이외 모든 글자가 5번 이상 연속으로 있으면 삭제(읽지 않음)
        message = message.replace(/(.)\1{5,}/g, "");

        // !sy = polly
        if (message.indexOf("!sy") === 0) {
            voicename = "polly";
            message = message.replace("!sy", "").trim();
        }

        // !def = default
        if (message.indexOf("!def") === 0) {
            voicename = "default";
            message = message.replace("!def", "").trim();
        }

        // !로 시작하는 메세지는 읽지 않음
        message = message.replace(/^!.*/g, "");

        // /me 명령어 입력시 나타나는 맨 마지막 \x01 제거
        if (message.charCodeAt(message.length - 1) === 1) message = message.substr(0, message.length - 1);

        // 트위치 이모티콘은 읽지 않음
        message = replaceTwitchEmoticon(message, e.emotes);
        if (message !== "") {
            // 모더레이터/스트리머는 설정 무관 최대 120글자 읽기 가능
            if (((e.mod && index === -1) || e.streamer || e.badges.indexOf("broadcaster/1") !== -1) && message.length < 120) {
                playText(message, personality_speed, personality_pitch, false, e.from, voicename, (!e.streamer && e.badges.indexOf("broadcaster/1") === -1));
            } else {
                // 화이트리스트 사용시 화이트리스트에 있는 아이디 + 밴리스트에 없는 아이디 + 채팅 길이가 지정된 길이 미만
                if (index_whitelist !== -1 && index === -1 && message.length < window.maxlength) {
                    if (window.tts_subonly) {
                        if (e.sub || e.founder) playText(message, personality_speed, personality_pitch, false, e.from, voicename, true);
                    } else if (window.tts_founderonly) {
                        if (e.founder) playText(message, personality_speed, personality_pitch, false, e.from, voicename, true);
                    } else if (window.tts_vieweronly) {
                        if (!e.streamer) playText(message, personality_speed, personality_pitch, false, e.from, voicename, true);
                    } else {
                        playText(message, personality_speed, personality_pitch, false, e.from, voicename, true);
                    }
                } else {
                    document.getElementById("last_read").innerHTML += "<i class='xi-ban' style='cursor: pointer;' onclick='unbanUser(\"" + e.from + "\", displayResultFromUI)'></i>&nbsp;<s><b>" + e.from + "</b>:" + message + "</s><br />\n";
                }
            }
        }
    }
}

/**
 * 채팅 해석후 명령/채팅 여부에 따라 다른 함수 실행
 * @param {Object} e 채팅 오브젝트
 */
function parseMessage(e) {
    if ((e.mod || e.streamer || e.badges.indexOf("broadcaster/1") !== -1) && e.text.match(/!!tts /) !== null) {
        parseCmd(e);
    } else {
        parseChat(e);
    }
}

/**
 * 실제 TTS에 요청을 보내는 함수
 * @param {String} string 읽을 문자열
 * @param {Number} speed 읽는 속도
 * @param {Number} pitch 읽는 피치
 * @param {Boolean} ignoreKor 한글 강제 무시 여부
 * @param {String} string 시청자 이름
 * @param {String} voicename 사용할 보이스명
 * @param {Boolean} banable 차단 가능 여부(내부 메세지의 경우 false)
 */
function playText(string, speed, pitch, ignoreKor, nickname, voicename, banable = false) {
    string = string.trim();
    if (string === "") {
        parseQueue();
        return;
    }

    if ('speechSynthesis' in window) {
        let i = 0;
        let voiceIdx = -1;
        let voiceLang = "en-US";
        let detectedLanguage = "none";
        const check = [];
        check['kor'] = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        check['jpn'] = /[\u3040-\u30ff\u31f0-\u31ff]/;
        check['chn'] = /\p{Script=Han}/u;
        
        for(idx in window.languagelist) {
            if(window.languagelist[idx] == "kor" && check["kor"].test(string)) {
                detectedLanguage = "kor";
                break;
            } else if(window.languagelist[idx] == "jpn" && (check["jpn"].test(string) || check["chn"].test(string))) {
                detectedLanguage = "jpn";
                break;
            } else if(window.languagelist[idx] == "chn" && check["chn"].test(string)) {
                detectedLanguage = "chn";
                break;
            }
        }

        if (typeof voicename === 'undefined') voicename = "default";

        if (voicename === "default") {
            speechSynthesis.getVoices().forEach(function (voice) {
                if (detectedLanguage == "kor") {
                    if (voice.lang === "ko-KR" && voice.name.indexOf("Google") !== -1) {
                        voiceLang = "ko-KR";
                        voiceIdx = i;
                    }
                } else if (detectedLanguage == "jpn") {
                    if (voice.lang === "ja-JP" && voice.name.indexOf("Google") !== -1) {
                        voiceLang = "ja-JP";
                        voiceIdx = i;
                    }
                } else if (detectedLanguage == "chn") {
                    if (voice.lang === "zh-CN" && voice.name.indexOf("Google") !== -1) {
                        voiceLang = "zh-CN";
                        voiceIdx = i;
                    }
                } else {
                    if (voice.lang === "en-US" && voice.name.indexOf("Google") !== -1) {
                        voiceIdx = i;
                    }
                }

                i++;
            });
            
            // TTS를 위한 객체 초기화(언어, 목소리 등 정보 포함)
            const msg = new SpeechSynthesisUtterance(string);
            
            // 인식된 언어로 설정한다
            if (voiceLang != "en-US") msg.lang = voiceLang;
            if (voiceIdx !== -1) msg.voice = speechSynthesis.getVoices()[voiceIdx];
            
            // 이외 나머지 값 설정
            msg.from = nickname;
            msg.rate = speed;
            msg.pitch = pitch;
            
            // 읽기 시작시 채팅 로그에 추가
            msg.onstart = function (event) {
                if (typeof event.utterance.from == "undefined" || event.utterance.from === "") event.utterance.from = "Unknown";
                if (banable && event.utterance.from !== "SYSTEM") document.getElementById("last_read").innerHTML += "<i class='xi-ban' style='cursor: pointer;' onclick='banUser(\"" + event.utterance.from + "\", displayResultFromUI)'></i>&nbsp;<b>" + event.utterance.from + "</b>:" + event.utterance.text + "<br />\n";
                else document.getElementById("last_read").innerHTML += "<i class='xi-ban' style='color: #666' onclick='return false;'></i>&nbsp;<b>" + event.utterance.from + "</b>:" + event.utterance.text + "<br />\n";
            };
            
            // 읽기 종료(일단은 로그 이외 아무것도 하지 않는다)
            msg.onend = function (event) {
                if (window.debugmode) console.log("msg read event");
                if (window.debugmode) console.log(event);
            };

            msg.volume = window.volume / 100;

            // 구글 보이스 미사용시 초성 변환
            if (voiceIdx === -1) msg.text = replaceChosung(msg.text);

            let obj = {};
            obj.type = "default";
            obj.msg = msg;
            window.speechQueue.push(obj);
        } else if (voicename === "polly") {
            string = replaceChosung(string);
            const obj = {};
            obj.type = "polly";
            obj.msg = '<speak><prosody rate="' + parseInt(speed * 100) + '%" pitch="' + parseInt(pitch * 100 - 100) + '%">' + string + '</prosody></speak>';
            obj.volume = window.volume / 100;
            window.speechQueue.push(obj);
            
            if (typeof nickname == "undefined" || nickname === "") nickname = "Unknown";
            if (banable && nickname !== "SYSTEM") document.getElementById("last_read").innerHTML += "<i class='xi-ban' style='cursor: pointer;' onclick='banUser(\"" + nickname + "\", displayResultFromUI)'></i>&nbsp;<b>" + nickname + "</b>:" + string + "<br />\n";
            else document.getElementById("last_read").innerHTML += "<i class='xi-ban' style='color: #666' onclick='return false;'></i>&nbsp;<b>" + nickname + "</b>:" + string + "<br />\n";
        }

        parseQueue();
    }
}

function replaceChosung(str) {
    str = str.replace(/ㄱ/g, "기역");
    str = str.replace(/ㄴ/g, "니은");
    str = str.replace(/ㄷ/g, "디귿");
    str = str.replace(/ㄹ/g, "리을");
    str = str.replace(/ㅁ/g, "미음");
    str = str.replace(/ㅂ/g, "비읍");
    str = str.replace(/ㅅ/g, "시옷");
    str = str.replace(/ㅇ/g, "이응");
    str = str.replace(/ㅈ/g, "지읒");
    str = str.replace(/ㅊ/g, "치읓");
    str = str.replace(/ㅋ/g, "키읔");
    str = str.replace(/ㅌ/g, "티읕");
    str = str.replace(/ㅍ/g, "피읖");
    str = str.replace(/ㅎ/g, "히읗");
    
    return str;
}

/**
 * 정규식 특수문자 이스케이프 함수
 * @param {String} str
 * @returns {String}
 */
function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * 트위치 이모티콘을 공백으로 치환
 * @returns {String} message without twitch emoticon
 * @param message {String} message to replace
 * @param emotes {String} emote list to replace
 */
function replaceTwitchEmoticon(message, emotes) {
    let ranges, id, emote_id, regExp;
    const replace_list = {};

    if (typeof emotes != 'undefined') {
        const emote_list = emotes.split("/");
        emote_list.forEach(function (emote_replace) {
            ranges = emote_replace.split(":");
            id = ranges[0];
            if (typeof ranges[1] == 'undefined') return;
            ranges = ranges[1].split(",");
            if (typeof ranges[0] != 'undefined') {
                ranges = ranges[0].split("-");
                emote_id = message.substring(parseInt(ranges[0]), parseInt(ranges[1]) + 1);
                replace_list[emote_id] = id;
            }
        });

        for (const replace_id in replace_list) {
            regExp = new RegExp(escapeRegExp(replace_id), "g");
            message = message.replace(regExp, "");
        }
    }

    return message;
}

/**
 * 주소의 GET 인자를 가져오는 함수
 * @param {String} name 가져올 GET인자 이름
 * @param {String} address (OPTIONAL) GET인자를 추출할 주소
 * @returns {String} GET인자 값
 */
function getParams(name, address = window.location.href) {
    let url;
    let results = "";

    url = new URL(address);
    if (typeof url.searchParams === 'undefined') {
        results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(address);
        if (results == null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    } else {
        return url.searchParams.get(name);
    }
}

/**
 * TTS 큐 파싱 함수
 */
function parseQueue() {
    var queue = window.speechQueue;

    if (window.speechSynthesis.speaking || window.kathy.IsSpeaking()) {
        setTimeout(parseQueue, 100);
        return;
    }

    var obj = queue.shift();
    if (typeof obj === 'undefined') {
        setTimeout(parseQueue, 100);
        return;
    }

    if (obj.type === "default") {
        console.debug("Default TTS - " + obj.msg.text);
        window.speechSynthesis.speak(obj.msg);
    } else if (obj.type === "polly") {
        console.debug("Amazon Polly - " + obj.msg);
        window.kathy.SetVolume(obj.volume);
        window.kathy.Speak(obj.msg);
    } else {
        console.warn("ERROR - Type " + obj.type + " is not supported.");
    }

    setTimeout(parseQueue, 100);
}

/**
 * 언어 선택 함수
 */
function setLanguage(language, status) {
    if(window.languagelist.indexOf(language) === -1) {
        window.languagelist.push(language);
        document.getElementById("chk-enable-" + language).checked = true;
        document.getElementById("ord-" + language).innerText = window.curOrd++;
    } else {
        window.languagelist.splice(window.languagelist.indexOf(language), 1);
        document.getElementById("chk-enable-" + language).checked = false;
        document.getElementById("ord-" + language).innerText = '비활성화';
        window.curOrd = 1;
        for(idx in window.languagelist) {
            document.getElementById("chk-enable-" + window.languagelist[idx]).checked = true;
            document.getElementById("ord-" + window.languagelist[idx]).innerText = window.curOrd++;
        }
    }
    
    localStorage.setItem("languagelist", JSON.stringify(window.languagelist));
}
