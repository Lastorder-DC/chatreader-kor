# 채팅 읽어주는 로봇
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor?ref=badge_shield)

트위치용 TTS 봇입니다. 시청자들의 채팅을 TTS로 읽어 줍니다.

## 사용법
데모 사이트에 접속해 트위치 계정으로 로그인해 주세요. 스트리머 계정이 아닌 다른 계정을 새로 파서 로그인하시는게 좋습니다.TTS

## 명령어 모음
모든 명령어는 `!!tts`로 시작합니다.

| 명령어    | 인수              | 설명                                                                                                  | 예제                   |
|-----------|-------------------|-------------------------------------------------------------------------------------------------------|------------------------|
| add       | 추가할 단어       | 단어를 TTS 금지 단어에 추가합니다. TTS 금지 단어가 포함된 채팅은 읽지 않습니다.                       | !!tts add 단어1        |
| del       | 삭제할 단어       | 단어를 TTS 금지 단어에서 제외합니다.                                                                  | !!tts del 단어1        |
| ban       | 차단할 시청자     | 시청자를 TTS 금지 목록에 추가합니다. TTS 금지 목록 시청자의 채팅은 읽지 않습니다.                     | !!tts ban 나쁜시청자   |
| unban     | 차단해제할 시청자 | 시청자를 TTS 금지 목록에서 제외합니다.                                                                | !!tts unban 나쁜시청자 |
| maxlength | 최대 채팅 길이    | 읽어줄 최대 채팅 길이를 지정합니다. 이보다 긴 채팅은 읽지 않습니다.                                   | !!tts maxlength 80     |
| subonly   | on, off           | 구독자 전용 채팅 모드를 활성화/비활성화 합니다. 활성화시 구독하지 않은 시청자의 채팅은 읽지 않습니다. | !!tts subonly on       |
| uniq   | on, off           | TTS 보이스 개인화 설정을 활성화/비활성화 합니다. 활성화시 닉네임에 따라 피치/속도가 바뀝니다. (기본 활성화) | !!tts uniq off       |

## 데모 사이트
https://lastorder.xyz/chatreader-kor/speech.html


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FLastorder-DC%2Fchatreader-kor?ref=badge_large)