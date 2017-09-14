## 자연어 인터페이스 기반의 홈오토메이션

*다른 언어로 보기: [English](README.md).*

지난 몇 년 동안 Apple Siri, Amazon Alexa 및 Google Assistant 등의 지능형 개인 비서의 인기가 크게 증가했습니다. 이러한 앱들은 초창기에는 신기한 장난감 정도로 인식되었지만, 이제는 서비스 API 및 IoT 연결 디바이스와 상호작용하는 편리한 인터페이스로 발전했습니다. 이 개발 과정은 Raspberry Pi를 사용하여 전원 콘센트를 껐다가 켜서 사용자가 자체 홈 허브를 설정하는 방법을 배우게됩니다. 회로 및 소프트웨어 의존성이 올바르게 설치되고 구성되면 IBM Watson의 언어 서비스를 사용하여 음성 또는 텍스트 명령으로 전원 콘센트를 제어할 수 있게 됩니다. 또한 OpenWisk 서버리스 기능을 사용하여 예정된 스케줄, 기상 변화, 동작 센서 활성화 등을 기반으로 이러한 소켓을 트리거하는 방법을 보여줍니다. 

### 아키텍처
![Architecture](/images/serverless_flow.png "Architecture")

*아키텍처 구성도*
1.	사용자는 마이크에 대고 명령을 말하거나 Twilio SMS 번호로 텍스트를 보냅니다
2.	해당 명령이 캡처되어 OpenWhisk 시퀀스를 트리거하는 HTTP POST 요청에 임베드됩니다
3.	OpenWhisk 액션 1은 오디오를 Bluemix Speech to Text 서비스로 전달하고 응답을 기다립니다
4.	텍스트화된 명령은 OpenWhisk 액션 2로 전달됩니다
5.	OpenWhisk 액션 2는 Conversation 서비스를 호출하여 사용자의 텍스트 명령을 분석한 다음 응답을 기다립니다
6.	Conversation 서비스 결과는 최종 OpenWhisk 액션으로 전달됩니다
7.	Openwhisk 액션은 IoT MQTT 브로커에 엔티티 / 인텐트 페어(예 : "fan / turnon")를 게시합니다
8.	MQTT 브로커에 등록된 Raspberry Pi는 결과를 수신합니다
9.	Raspberry Pi는 RF 신호를 전송하여 콘센트를 켜거나 끕니다

<!-- TODO, test all links -->
### 설정 단계
- [하드웨어 연결 및 구성](#하드웨어-부품-설정하기)
  * RF 회로 조립
  * 소프트웨어 의존성 + 라이브러리 설치
  * 무선 소켓에 해당하는 RF 코드 캡처
- [Bluemix 서비스 제공하기](#플랫폼-서비스-제공-및-설정하기)
- [서버리스 기능 생성하기](#openwhisk)
- [Bluemix에 배포하기](#bluemix)

## 하드웨어 부품 설정하기

RF 회로를 조립하고 구성부터 시작하겠습니다. 이 회로에는 다음 구성 요소가 필요합니다
- [Raspberry Pi 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
- [GPIO 리본 케이블 + 브레이크아웃 보드](https://www.adafruit.com/product/914)
- [433MHz RF 송신기 및 수신기](https://www.amazon.com/SMAKN%C2%AE-433Mhz-Transmitter-Receiver-Arduino/dp/B00M2CUALS)
- [Etekcity 433 MHz 아웃렛](https://www.amazon.com/Etekcity%C2%AE-Wireless-Control-Switches-included/dp/B00DQELHAE/)
- [브레드보드](https://www.adafruit.com/product/239)
- [USB 마이크](https://www.amazon.com/eBerry-Adjustable-Microphone-Compatible-Recording/dp/B00UZY2YQE/ref=sr_1_9?ie=UTF8&qid=1497828013&sr=8-9&keywords=usb+microphone)

모든 부품을 준비하신 후 조립하여 아래 회로를 구성하십시오. 이 회로에는 GPIO 리본 / 브레이크아웃 보드를 통해 브레드보드에 연결된 Raspberry Pi가 포함됩니다.

![회로](/images/home_automation_labeled.png "CircuitFritzing")

<!-- Transmitter/Receiver datasheet http://www.mantech.co.za/Datasheets/Products/433Mhz_RF-TX&RX.pdf -->

<!-- <p align="center">
<img src="/images/home_automation_bb.svg" data-canonical-src="/images/home_automation_bb.svg" width="600" height="400" style="margin-left: auto; margin-right: auto;" />
</p> -->

브레이크아웃 보드의 왼쪽에 있는 빨간색 와이어는 Raspberry Pi에서 브레드보드의 전원 레일 중 하나로의 5 볼트 전류 브리징을 합니다. 다이어그램의 오른쪽 하단에 있는 추가 빨간색 와이어는 파워 레일에서 RF 수신기 및 송신기로 5 볼트를 공급합니다. 흰색 와이어도 유사한 개념이지만, 이것은 일반적으로 "접지"로 불리는 음전하를 제공합니다. 다음으로, 초록색 와이어는 Raspberry Pi의 GPIO 핀 17을 트랜스미터의 데이터 핀에 연결하고 검은색 와이어는 GPIO 핀 27을 수신기의 데이터 핀에 연결합니다. 그 이유는 아래 이미지 `gpio readall` 출력에서 볼 수 있듯이, BCM 17에 매핑되는 송신기가 [wiringPi pin 0] (https://github.com/ninjablocks/433Utils/blob/master/RPi_utils/codesend.cpp#L27)을 기본값으로하기 때문에 BCM 27에 매핑되는 수신기는 [wiringPi pin 2] (https://github.com/ninjablocks/433Utils/blob/master/RPi_utils/RFSniffer.cpp#L25)로 기본 설정됩니다. 이러한 기본 핀은 433Utils 라이브러리의 링크된 파일 중 하나를 수정하고 라이브러리를 다시 컴파일하여 변경할 수 있습니다.

일단 Raspberry Pi가 회로에 연결되면 RF 송신기 및 수신기와 상호 작용할 수 있도록 종속적인 소프트웨어를 설치해야합니다. 이는 [install_deps.sh] (./iot- gateway / install_deps.sh) 스크립트를 실행하여 수행할 수 있습니다.

The open source libaries that are being installed here are [wiringPi](http://wiringpi.com/) and [433Utils](https://github.com/ninjablocks/433Utils). wiringPi enables applications to read/control the Raspberry Pi’s GPIO pins. 433Utils calls the wiringPi library to transmit and receive messages via the 433MHz frequency. In our case, each outlet has a unique RF code to turn power on and off. We’ll use one of the wiringPi utilities, titled “RFSniffer” to essentially register each of these unique codes. The 433MHz frequency is standard among many common devices such as garage door openers, thermostats, window/door sensors, car keys, etc. So this initial setup is not limited to only controlling power outlets.
여기에 설치되는 오픈소스 라이브러리는 [wiringPi] (http://wiringpi.com/) 및 [433Utils] (https://github.com/ninjablocks/433Utils)입니다. wiringPi를 사용하면 응용 프로그램에서 Raspberry Pi의 GPIO 핀을 읽고 제어할 수 있습니다. 433Utils는 433MHz 주파수로 메시지를 송수신하기 위해 wiringPi 라이브러리를 호출합니다. 이 예제의 경우, 각 콘센트에는 전원을 켜고 끌 수 있는 고유한 RF 코드가 있습니다. 각각의 고유 코드를 필수적으로 등록하기 위해 "RFSniffer"라는 wiringPi 유틸리티 중 하나를 사용합니다. 433MHz 주파수는 온도 조절기, 창문/문 센서, 자동차 키 등과 같은 많은 일반 디바이스에서 표준으로 쓰입니다. 따라서 이 초기 설정은 전원 콘센트 제어에만 국한되는 것은 아닙니다.
The open source libaries that are being installed here are [wiringPi](http://wiringpi.com/) and [433Utils](https://github.com/ninjablocks/433Utils). wiringPi enables applications to read/control the Raspberry Pi’s GPIO pins. 433Utils calls the wiringPi library to transmit and receive messages via the 433MHz frequency. In our case, each outlet has a unique RF code to turn power on and off. We’ll use one of the wiringPi utilities, titled “RFSniffer” to essentially register each of these unique codes. The 433MHz frequency is standard among many common devices such as garage door openers, thermostats, window/door sensors, car keys, etc. So this initial setup is not limited to only controlling power outlet.

Once the script completes run `gpio readall` to ensure that wiringPi installed successfully. The following chart should be displayed.
<p align="center">
<img src="/images/gpio_output.png" data-canonical-src="/images/gpio_output.png" width="600" height="400" style="margin-left: auto; margin-right: auto;" />
</p>

Now we can determine which RF codes correspond with the Etekcity outlets. Start by executing
```
sudo /var/www/rfoutlet/RFSniffer
```

This will listen on the RF receiver for incoming signals, and write them to stdout. As the on/off buttons are pressed on the Etekcity remote, the Raspberry Pi should show the following output if the circuit is wired correctly.
```
pi@raspberrypi:~ $ sudo /var/www/rfoutlet/RFSniffer
Received 5528835
Received pulse 190
Received 5528844
Received pulse 191
```

After determining the on/off signal for the RF sockets, place the captured signals into the /etc/environment file like so.
```
RF_PLUG_ON_1=5528835
RF_PLUG_ON_PULSE_1=190
RF_PLUG_OFF_1=5528844
RF_PLUG_OFF_PULSE_1=191
```

Now, plug in the associated socket, and run the following command to ensure the Raspberry Pi can turn the socket on and off. This command simply sends the RF code at the requested pulse length, which is to be provided as the -l parameter.

```
source /etc/environment
/var/www/rfoutlet/codesend ${RF_PLUG_ON_1} -l ${RF_PLUG_ON_PULSE_1}
/var/www/rfoutlet/codesend ${RF_PLUG_OFF_1} -l ${RF_PLUG_OFF_PULSE_1}
```

Now that we can control the sockets manually via cli, we’ll move forward and experiment with different ways to control them in an automated fashion. Rather than writing and executing pipelines and complex automation logic on the Raspberry Pi, we’ll utilize a serverless, event driven platform called Openwhisk. In this implementation, Openwhisk actions communicate with the Raspberry Pi via MQTT messages.

### Audio Interface
Once the Raspberry Pi is setup, we'll need to configure it to recognize audio input from the USB microphone. To ensure that audio is recorded and transcribed only as needed, we'll leverage a "Hotword" detection service named [Snowboy](https://snowboy.kitt.ai/), which listens for a specific speech pattern (**Hello Watson**, in this case), and begins recording once the hotword pattern is detected. The steps required to create a voice model can be found [here](http://docs.kitt.ai/snowboy/).

Troubleshooting to


## 플랫폼 서비스 제공 및 설정하기
- [Conversation](https://console.bluemix.net/catalog/services/conversation)
- [Speech to Text](https://console.bluemix.net/catalog/services/speech-to-text)
- [Watson IoT Platform](https://console.bluemix.net/catalog/services/internet-of-things-platform)
- [Twilio](https://console.bluemix.net/catalog/services/twilio)
<!-- - [Openwhisk](https://console.bluemix.net/openwhisk) -->

A Bluemix Account is required to provision these services. After logging in, simply navigate to each of the links above, and select the "Create Service" button.

*Create Service*
<p align="center">
<img src="/images/service_create.png" data-canonical-src="/images/service_create.png" width="700" height="450" style="margin-left: auto; margin-right: auto;" />
</p>

### Conversation
The [Conversation](https://www.ibm.com/watson/developercloud/conversation.html) service is used to analyze natural language and determine which action(s) to take based on the user input. There are two main concepts to understand here. The first are referred to as "Intents", which determine what the user would like the application to do. Next, we have "Entities", which provide context of where the intent should be applied. To keep things simple, we have two intents, one is titled "turnoff", the other "turnon". Next, we have 3 entities, which are household devices that we'd like to turn off and on in this case. This pre-trained data model can be uploaded to the provisioned Conversation service through the UI. To initiate the upload, login to the Bluemix console. Next select the conversation service, and then the button titled "Launch Tool".

### Watson IoT Platform
The Watson IoT Platform will be utilized as a MQTT messaging broker. This is a lightweight publish/subscribe messaging protocol that'll allow for various devices such as a Phone, Laptop, and Microphone to communicate with the Raspberry Pi. Once this service has been provisioned, we'll need to generate a set of credentials to securely access the MQTT broker. These steps are listed [here](./iot-gateway/)

### Openwhisk
Rather than writing and executing pipelines and complex automation logic on the Raspberry Pi, we’ll utilize a serverless, event driven platform called [Openwhisk](https://console.ng.bluemix.net/openwhisk). In this implementation, Openwhisk actions forward their results  to the Raspberry Pi as MQTT messages. Openwhisk is a serverless framework which has the ability to bind snippets of code to REST API endpoints. Once these have been created, they can be executed directly from any internet connected device, or they can respond to events such as a database change or a message coming in to a specific MQTT channel. Once these snippets, or "Actions" have been created, they may be chained together as a sequence, as seen above in the architecture diagram.

To get started, we will create a sequence that consists of three actions. The first action will transcribe an audio payload to text. The second action will analyze the transcribed text result using the Conversation service. This analysis will extract the intent behind the spoken message, and determine what the user would like the Raspberry Pi to do. So, for example, if the user says something along the line of “Turn on the light” or “Flip the switch”, the NLC service will be able to interpret that. Finally, the third action will send a MQTT message that’ll notify the Raspberry Pi to switch the socket on/off.

The speech to text action is already built in to Openwhisk as a public package, so we’ll just need to supply our credentials for that service. Moving forward, we can create the additional actions with the following commands.

```
cd serverless-home-automation/iot_gateway/whisk_actions
wsk action create conversation conversation.js
wsk action create parser-python parser-python.py
```

Once the actions are successfully created, we can set default service credentials for each of the actions. Otherwise we’d have to pass in the service credentials every time we’d like our actions to call the Watson services. To obtain these credentials, click each provisioned service in the Bluemix dashboard, and then select the “View credentials” dropdown.

<p align="center">
<img src="/images/stt_creds.png" data-canonical-src="/images/stt_creds.png" width="600" height="400" style="margin-left: auto; margin-right: auto;" />
</p>

Then insert the corresponding credentials when running the commands below.

```
wsk action update conversation -p username ${conversation_username} -p password ${conversation_password} -p workspace_id ${conversation_workspace_id}
wsk action update parser-python -p org ${iot_org_id} -p device_id ${device_id} -p api_token ${api_token}
wsk package bind /whisk.system/watson-speechToText myWatsonSpeechToText -p username ${stt_username} -p password ${stt_password}
```

Next, we can arrange the actions into a sequence
```
wsk action create homeSequence --sequence /myWatsonSpeechToText/speechToText,conversation,parser-python
```

<!-- TODO, update node server with multi devices from Pi -->
For the sequence to be able to return the result to the Raspberry Pi, a MQTT client will need to be listening to the Watson IoT service. If the proper values have been set in the /etc/environment file, you should just have to run the following commands to create and enable a systemd service, which will automatically start on boot. This will start the [node server](./iot-gateway/node-mqtt.js), which subscribes to the Watson IoT Platform's MQTT broker and listens for intent entity pairs.

```
sudo cp serverless-home-automation/iot-gateway/node-mqtt.service /etc/systemd/system/
sudo systemctl enable node-mqtt
sudo systemctl start node-mqtt
sudo systemctl status node-mqtt
```

### Twilio
Twilio is a service that enables developers to integrate VoIP and SMS capabilities into their platform. This works by allowing developers to choose a phone number to register. Once registered, Twilio exposes an API endpoint to allow calls and texts to be made programmatically from the number. Also, the number can be configured to respond to incoming calls/texts by either triggering a webhook or following a [Twiml](https://www.twilio.com/docs/api/twiml) document. In this case, we'll configure the Twilio number to respond to incoming texts by triggering a webhook bound to the "homeSequence" Openwhisk action we created in the previous step. We can find the url to the webhook by navigating to the [Openwhisk console](https://console.bluemix.net/openwhisk/editor), selecting the homeSequence sequence, and then selecting the "View Action Details" button. Finally, check the "Enable as Web Action" button, and copy the generated Web Action URL.

To get started, please visit Twilio's registration [page](https://www.twilio.com/try-twilio). After signing up, log in and select the # icon in the menu, which will direct the browser to the [Phone Numbers](https://www.twilio.com/console/phone-numbers/incoming) configuration. Now, select the circular + button to select and register a number. After registration, click the number to configure it. Scrolling down will reveal a "Messaging" section. In the form titled "A Message Comes in", paste the webhook associated with the "homeSequence" Openwhisk action, as seen below.

<p align="center">
<img src="./images/configure_messaging_generic.png" data-canonical-src="./images/createdevicetype.png" width="600" height="400" style="margin-left: auto; margin-right: auto;" />
</p>

### Node Red
As an alternative to creating sequences in Openwhisk, the home automation logic can be arranged using [Node Red](https://github.com/node-red/node-red). Node Red is a visual editor capable of assembling "flows", which is done by allowing users to drag, drop and connect "blocks" of code or service calls. It's worth noting that this deplyment scheme won't follow a fully serverless model, as it'll be running constantly as a node server. Since the backend logic is all in the Openwhisk serverless action pool, the devices should be able to be controlled via SMS or voice without having to set up a long running server. However, in use cases where it's preferable to use node red, we can do so by installing the package via `npm install node-red`, booting up the editor via `node-red`, and creating a flow like what we have in the diagram below. After assembling the flow, be sure to populate the authentication credentials and endpoint for each block.

![Node Red](/images/noderedscreen.png "Architecture")
<!-- <p align="center">
<img src="/images/noderedscreen.png" data-canonical-src="/images/service_create.png" height="450" style="margin-left: auto; margin-right: auto;" />
</p> -->

To deploy a node red instance to Bluemix, click the button below

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/kkbankol-ibm/node-red-bluemix-starter.git)

[Sample Bluemix Instance](http://serverless-home-automation.mybluemix.net/red/#flow/e711dbd4.4e7d18)


### Troubleshooting

RC Circuit:
After checking each of the wires to ensure they are lined up correctly, use a [multimeter](https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter) to check each of the connection nodes starting from the power source. For example, to ensure that RF components are being powered properly, touch the negative/grounded end of the multimeter to the grounded power rail, and touch the positive end of the multimeter to the RF components 5V pin.

Bluemix Services:
Whenever any of the Bluemix components (Speech to Text, Conversation, etc) seem to be unresponsive, check the [Bluemix Status page](https://status.ng.bluemix.net/) to see if the service is down or under maintenence. If not, try running a sample request using curl and ensure that a 200 HTTP response is returned. A sample request against the speech-to-text service would look like so.
```
curl -v -u ${username}:${password} https://stream.watsonplatform.net/speech-to-text/api/v1/models
```

Openwhisk:
Add -vv to any wsk command `wsk -vvv action list` to view the
Also, check the activity log in the [Openwhisk dashboard](https://console.bluemix.net/openwhisk/dashboard)

Raspberry Pi:
Run `journalctl -ru node-mqtt` to view the stdout and stderr output of the Raspberry Pi's node server

Twilio:
Visit the [Twilio logging](https://www.twilio.com/console/sms/logs) url to view output for incoming and outgoing SMS messages

# License
[Apache 2.0](LICENSE)
