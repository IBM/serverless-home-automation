## Natural Language Interface based Home Automation

This tutorial highlights the architecture and technical recipes involved to build the voice controlled home automation system leveraging IBM Watson platforms in conjunction with open technologies. 

### Architecture
![Architecture](/images/Architecture.jpg?raw=true "Architecture")

### Steps
- [Setup Raspberry Pi powered Audio Interface](#setup-raspberry-pi-powered-audio-interface)
- [Setup Service](#setup-service)
- [Setup Cloudant DB](#setup-cloudant-db)
- [Setup Watson IoT Platform](#setup-watson-iot-platform)
- [Raspberry Pi as IoT Gateway](#raspberry-pi-as-iot-gateway)

### Setup Raspberry Pi powered Audio Interface
The Audio Interface comprises of a microphone and speaker attached to a Raspberry Pi that records speech and applies the recorded speech to Watson Speech to Text for transcription. It also leverages [Snowboy](https://snowboy.kitt.ai/) to detect hotword such as **Hello Watson** to trigger transcription. The instructions for building Raspberry Pi powered Audio Interface with hotword detection is available [here](speech-recorder/README.md).

### Setup Service

### Setup Cloudant DB

### Setup Watson IoT Platform

### Setup Raspberry Pi as IoT Gateway
