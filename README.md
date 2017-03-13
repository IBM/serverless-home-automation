## Natural Language Interface based Home Automation

This project highlights the architecture and technical recipes to build the voice controlled home automation system leveraging IBM Watson platforms in conjunction with open technologies. 

### Architecture
![Architecture](/images/Architecture.jpg?raw=true "Architecture")

### Components
- [Raspberry Pi powered Audio Interface](#raspberry-pi-powered-audio-interface)
- [Service](#service)
- [Cloudant DB](#cloudant-db)
- [Watson IoT Platform](#watson-iot-platform)
- [Raspberry Pi as IoT Gateway](#raspberry-pi-as-iot-gateway)

### Raspberry Pi powered Audio Interface
The Audio Interface comprises of a microphone and speaker attached to a Raspberry Pi that records speech and applies the recorded speech to Watson Speech to Text for transcription. It also leverages [Snowboy](https://snowboy.kitt.ai/) to detect hotword such as **Hello Watson** to trigger transcription. The instructions for building Raspberry Pi powered Audio Interface with hotword detection is available [here](speech-recorder/README.md).

### Service

### Cloudant DB

### Watson IoT Platform

### Raspberry Pi as IoT Gateway
