# 채팅 읽어주는 로봇
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor?ref=badge_shield)

트위치용 TTS 봇입니다. 시청자들의 채팅을 TTS로 읽어 줍니다.

<a href="https://donaricano.com/mypage/1686218426_TaDxJ6" target="_blank"><img src="https://d1u4yishnma8v5.cloudfront.net/donarincano_gift.png" alt="donaricano-btn" style="height: 70px !important;width: 200px !important;" /></a>

## 사용하는 권한 알림
- 채팅 보내기 : TTSBOT 명령어 피드백에 사용합니다.
- 후원 열차 데이터 보기 : 후원 열차 관련 TTS 알림시 사용 예정입니다.
- 채널 포인트 및 보상 확인 : 포인트 보상 관련 TTS 알림시 사용 예정입니다.
- 구독자 목록 및 구독 여부 확인 : 구독자 전용 TTS 모드 설정시 구독여부 체크에 사용합니다.
- 비트 정보 읽기 : 비트 관련 TTS 설정에 사용 예정입니다.
- 생방송 채팅 및 사랑방 메세지 읽기 : (당연히) 채팅을 읽는 데 사용합니다.

## 사용법
아래 사이트 주소로 접속해 트위치 계정으로 로그인해 주세요. 스트리머 계정이 아닌 다른 계정을 새로 파서 로그인하시는게 좋습니다.

https://lastorder.xyz/chatreader-kor/speech.html

![image](https://user-images.githubusercontent.com/18280396/67158564-79feac00-f374-11e9-8e5f-d645038f7d33.png)

(19/10/20 추가) 관리 기능을 이용할수 있습니다. 채팅 목록에서 차단 아이콘을 눌러 해당 시청자의 TTS를 바로 차단할수 있습니다. 차단된 시청자는 이후 취소선으로 목록에 표시되며 읽지 않습니다. 차단된 시청자 옆 차단 아이콘을 누르면 차단 해제를 할수 있습니다.

(21/02/09 추가) 허용 목록 기능이 추가되었습니다. 화이트리스트 사용시 특정 시청자 채팅만 읽어줍니다. 허용 목록 사용시 목록에 없는 시청자가 차단된 것으로 뜰 수 있으나, 허용 목록을 비우면 정상화됩니다.

## 명령어 모음
모든 명령어는 `!!tts`로 시작합니다.

| 명령어      | 인수              | 설명                                                                                                       | 예제                       |
|-------------|-------------------|-----------------------------------------------------------------------------------------------------------|---------------------------|
| add         | 추가할 단어       | 단어를 TTS 금지 단어에 추가합니다. TTS 금지 단어가 포함된 채팅은 읽지 않습니다.                                 | !!tts add 단어1            |
| del         | 삭제할 단어       | 단어를 TTS 금지 단어에서 제외합니다.                                                                         | !!tts del 단어1            |
| ban         | 차단할 시청자     | 시청자를 TTS 금지 목록에 추가합니다. TTS 금지 목록 시청자의 채팅은 읽지 않습니다.                               | !!tts ban 나쁜시청자        |
| unban       | 차단해제할 시청자 | 시청자를 TTS 금지 목록에서 제외합니다.                                                                        | !!tts unban 나쁜시청자     |
| addlist     | 허용할 시청자     | 시청자를 TTS 허용 목록에 추가합니다. 허용 목록 사용시 이외 시청자의 채팅은 읽지 않습니다.                        | !!tts addlist 좋은시청자    |
| removelist  | 허용해제할 시청자 | 시청자를 TTS 허용 목록에서 제외합니다. 목록을 비면 허용 목록을 사용하지 않습니다.                                | !!tts removelist 좋은시청자 |
| clearban    | (없음)           | TTS 금지 목록을 비웁니다.                                                                                    | !!tts clearban            |
| clearlist   | (없음)           | TTS 허용 목록을 비웁니다.                                                                                    | !!tts clearlist           |
| maxlength   | 최대 채팅 길이    | 읽어줄 최대 채팅 길이를 지정합니다. 이보다 긴 채팅은 읽지 않습니다.                                             | !!tts maxlength 80        |
| volume      | 최대 볼륨        | TTS 볼륨을 설정합니다. 1에서 100사이 값으로 지정하실수 있습니다.                                                | !!tts volume 80           |
| subonly     | on, off         | 구독자 전용 채팅 모드를 활성화/비활성화 합니다. 활성화시 구독하지 않은 시청자의 채팅은 읽지 않습니다.               | !!tts subonly on          |
| founderonly | on, off         | 개설자 전용 채팅 모드를 활성화/비활성화 합니다. 활성화시 구독자 중 개설자 뱃지가 없는 시청자의 채팅은 읽지 않습니다. | !!tts founderonly on      |
| uniq        | on, off         | TTS 보이스 개인화 설정을 활성화/비활성화 합니다. 활성화시 닉네임에 따라 피치/속도가 바뀝니다. (기본 활성화)         | !!tts uniq off            |
| voice       | default, polly  | 기본 TTS 설정을 변경합니다. polly의 경우 설정이 되어 있지 않을시 동작하지 않습니다.                               | !!tts voice polly         |


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor?ref=badge_large)

### notifications.js / notifications.css
MIT License

See https://github.com/JamieLivingstone/styled-notifications/blob/master/LICENSE.md for details.
