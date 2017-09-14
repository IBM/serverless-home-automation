## Raspberry Pi를 이용하는 오디오 인터페이스

*다른 언어로 : [English](readme.md)*

### 준비 사항
- Raspbian OS 기반의 Raspberry Pi 3
- 일반 USB Microphone

### Hotword 생성하기
Speech to text를 통해 글로 옮긴 내용을 트리거하기 위해 맞춤 웨이크워드(wakeword, 깨우는 말)를 만들어 보겠습니다. 예를 들어 ** Hey Watson ** 또는 ** Hello Watson ** 또는 ** Hi Watson **과 같은 웨이크워드를 듣는 핫워드 엔진을 만들 수 있습니다. 일단 오디오 인터페이스를 통해 웨이크 워드를 감지하면 후속 오디오를 사용하여 텍스트화할 수 있습니다.

이러한 목적으로 Snowboy를 사용했습니다. 먼저 [Snowboy 웹사이트](https://snowboy.kitt.ai/) 에서 hotword를 생성합니다. Hotword를 만들려면 Github, Google 또는 Facebook으로 로그인해야합니다.

세 가지 오디오 샘플로 된 hotword를 만들었으면 이제 다음 섹션에서 사용할 모델을 다운로드 할 수 있습니다

### 마이크 설정하기
여러분의 마이크를 raspberry Pi에 설정하시려면 다음의 [링크](http://docs.kitt.ai/snowboy/#running-on-raspberry-pi)를 이용하십시오.


### 데모 실행하기
이제 hotword가 감지된 후 오디오를 캡처하고 캡처된 오디오와 함께 Watson Speech to Text를 사용하는 샘플 스크립트를 실행해 봅니다.

먼저, [Raspbian 8.0이 포함된 Raspberry Pi](https://s3-us-west-2.amazonaws.com/snowboy/snowboy-releases/rpi-arm-raspbian-8.0-1.1.0.tar.bz2) 를 위해 미리 패키지 된 Snowboy 바이너리와 Python wrapper를 다운로드하여 압축을 풉니다.

압축을 푼 폴더에 [detect_hotword.py](audio-interface/detect_hotword.py) & [record_audio.py](audio-interface/record_audio.py) 를 복사하십시오.


