## Natural Language Interface based Home Automation
Over the past few years, we’ve seen a significant rise in popularity for intelligent personal assistants, such as Apple’s Siri, Amazon Alexa, and Google Assistant. Though they initially appeared to be little more than a novelty, they’ve evolved to become rather useful as a convenient interface to interact with service APIs and IoT connected devices. This developer journey will guide users through setting up their own starter home automation hub by using a Raspberry PI to turn power outlets off and on. Once the circuit and software dependencies are installed and configured properly, users will also be able to leverage Watson’s language services to control the power outlets via voice and/or text commands. Furthermore, we’ll show how Openwhisk serverless functions can be leveraged to trigger these sockets based on a timed schedule, changes to the weather, motion sensors being activated, etc.

### Architecture
<!-- ![Architecture](/images/Architecturev2.jpg "Architecture") -->
![Architecture](/images/home_automation.png "Architecture")

Architecture flow
1.	User says a command into the microphone, or sends a text to the Twilio SMS number
2.	User input is captured and embedded in an HTTP POST request to trigger an Openwhisk sequence
3.	The first Openwhisk action in the sequence forwards the audio to Speech to Text service, and waits for the response
4.	Transcription is forwarded to the second Openwhisk action
5.	Openwhisk action 2 calls the Conversation service to analyze the user's text input, again waits for the response
6.	Conversation service result is forwarded to final Openwhisk action
7.	Final openwhisk action publishes a entity/intent pair (fan/turnon for example) to the IoT MQTT broker
8.	Raspberry Pi, which is subscribed to the MQTT broker receives result
9.	Raspberry Pi transmits corresponding RF signal to adjust outlet state

### Setup Steps
- [Configure Additional Hardware](#hardware-components)
- [Provision Bluemix Services](#provision-and-configure-platform-services)
- [Create Serverless Functions](#openwhisk)
- [Integration/Testing]()

## Configure Hardware Components
We can get started by assembling and configuring the RF circuit. This circuit requires the following components
- [Raspberry PI 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
- [GPIO Ribbon cable + Breakout Board](https://www.adafruit.com/product/914)
- [433MHz RF transmitter and receiver](https://www.amazon.com/SMAKN%C2%AE-433Mhz-Transmitter-Receiver-Arduino/dp/B00M2CUALS)
- [Etekcity 433 MHz Outlets](https://www.amazon.com/Etekcity%C2%AE-Wireless-Control-Switches-included/dp/B00DQELHAE/)
- [Electronic Breadboard](https://www.adafruit.com/product/239)
- USB Microphone

Ultimately what we want to do here is to arrange the components to form the circuit below

![Circuit](/images/home_automation_bb.jpg "CircuitFritzing")
<!-- <p align="center">
<img src="/images/home_automation_bb.svg" data-canonical-src="/images/home_automation_bb.svg" width="600" height="400" style="margin-left: auto; margin-right: auto;" />
</p> -->

Once the Raspberry Pi is connected to the circuit, we'll need to install dependencies to allow us to interact with the RF transmitter and receiver. This can be done by running the [install_deps.sh](#iot-gateway/install_deps.sh) script.

The open source libaries that are being installed here are [wiringPi](http://wiringpi.com/) and [433Utils](https://github.com/ninjablocks/433Utils). wiringPi enables applications to read/control the Raspberry Pi’s GPIO pins. 433Utils, calls the wiringPi library to transmit and receive messages via the 433MHz frequency. In our case, each outlet has a unique RF code to turn power on and off. We’ll use one of the wiringPi utilities, titled “RFSniffer” to essentially register each of these unique codes. The 433MHz frequency is standard among many common devices such as garage door openers, thermostats, window/door sensors, car keys, etc. So this initial setup is not limited to only controlling power outlets.

Once the script completes run `gpio readall` to ensure that wiringPi installed successfully.
<p align="center">
<img src="/images/gpio_output.png" data-canonical-src="/images/gpio_output.png" width="600" height="400" style="margin-left: auto; margin-right: auto;" />
</p>

### Audio Interface
Once the Raspberry Pi is setup, we'll need to configure it to recognize audio input from the USB microphone. To ensure that audio is recorded and transcribed only as needed, we'll leverage a "Hotword" detection service named [Snowboy](https://snowboy.kitt.ai/), which listens for a specific speech pattern (**Hello Watson**, in this case), and begins recording once the hotword pattern is detected. The steps required to create a voice model can be found [here](http://docs.kitt.ai/snowboy/)

## Provision and Configure Platform Services
- Conversation
- Speech to Text
- Watson IoT Platform
- Openwhisk
- Twilio

A Bluemix Account is required to provision these services. Each can be found by going to the [Bluemix Service Catalog](https://console.ng.bluemix.net/catalog), searching for the name of the service, and then clicking the "Create" button on the lower right corner.

*Find Service*
<p align="center">
<img src="/images/service_find.png" data-canonical-src="/images/service_find.png" width="700" height="400" style="margin-left: auto; margin-right: auto;" />
</p>


*Create Service*
<p align="center">
<img src="/images/service_create.png" data-canonical-src="/images/service_create.png" width="700" height="400" style="margin-left: auto; margin-right: auto;" />
</p>


### Conversation
The [Conversation](https://www.ibm.com/watson/developercloud/conversation.html) service is used to analyze natural language and determine which action(s) to take based on the user input. There are two main concepts to understand here. The first are referred to as "Intents", which determine what the user would like the application to do. Next, we have "Entities", which provide context of where the intent should be applied. To keep things simple, we have two intents, one is titled "turnoff", the other "turnon". Next, we have 3 entities, which are household devices that we'd like to turn off and on in this case. This pre-trained data model can be uploaded to the provisioned Conversation service through the UI. To initiate the upload, login to the Bluemix console. Next select the conversation service, and then the button titled "Launch Tool".

### Watson IoT Platform
The Watson IoT Platform will be utilized as a MQTT messaging broker. This is a lightweight publish/subscribe messaging protocol that'll allow for various devices such as a Phone, Laptop, and Microphone to communicate with the Raspberry Pi. Once this service has been provisioned, we'll need to generate a set of credentials to securely access the MQTT broker. These steps are listed [here](#iot-gateway/)

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

For the sequence to be able to return the result to the Raspberry Pi, a MQTT client will need to be listening to the Watson IoT service. If the proper values have been set in the /etc/environment file, you should just have to run the following commands to create and enable a systemd service, which will automatically start on boot.

```
sudo cp serverless-home-automation/iot-gateway/node-mqtt.service /etc/systemd/system/
sudo systemctl enable node-mqtt
sudo systemctl start node-mqtt
sudo systemctl status node-mqtt
```

### Twilio
Twilio is a
