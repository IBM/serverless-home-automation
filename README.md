## Natural Language Interface based Home Automation
Over the past few years, we’ve seen a significant rise in popularity for intelligent personal assistants, such as Apple’s Siri, Amazon Alexa, and Google Assistant. Though they initially appeared to be little more than a novelty, they’ve evolved to become rather useful as a convenient interface to interact with service APIs and IoT connected devices. This developer journey will guide users through setting up their own starter home automation hub by using a Raspberry PI to turn power outlets off and on. Once the circuit and software dependencies are installed and configured properly, users will also be able to leverage Watson’s language services to control the power outlets via voice and/or text commands. Furthermore, we’ll show how Openwhisk serverless functions can be leveraged to trigger these sockets based on a timed schedule, changes to the weather, motion sensors being activated, etc.

### Architecture
![Architecture](/images/Architecturev2.jpg "Architecture")

## Hardware Components
Setting up the RF circuit requires the following components:
- [Raspberry PI 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
- [GPIO Ribbon cable + Breakout Board](https://www.adafruit.com/product/914)
- [433MHz RF transmitter and receiver](https://www.amazon.com/SMAKN%C2%AE-433Mhz-Transmitter-Receiver-Arduino/dp/B00M2CUALS)
- [Etekcity 433 MHz Outlets](https://www.amazon.com/Etekcity%C2%AE-Wireless-Control-Switches-included/dp/B00DQELHAE/)
- [Electronic Breadboard](https://www.adafruit.com/product/239)
- USB Microphone

<Ultimately what we want to do here is to arrange the components in the following circuit>

### Audio Interface
Once the Raspberry is setup, we'll need to configure it to recognize audio input from the USB microphone. To ensure that audio is recorded and transcribed only as needed, we'll leverage a "Hotword" detection service named [Snowboy](https://snowboy.kitt.ai/), which listens for a specific speech pattern (**Hello Watson**, in this case), and begins recording once the hotword pattern is detected. The steps required to create a voice model can be found [here](http://docs.kitt.ai/snowboy/)

## Provision and Configure Platform Services
- Conversation
- Speech to Text
- Watson IoT Platform
- Openwhisk
- Twilio

A Bluemix Account is required to provision these services. Each can be found by going to the [Bluemix Service Catalog](https://console.ng.bluemix.net/catalog), searching for the name of the service, and then clicking the "Create" button on the lower right corner.

Find Service
![Find Service](/images/service_find.png "Find Service")
Create Service
![Create Service](/images/service_create.png "Create Service")


### Conversation
The [Conversation](https://www.ibm.com/watson/developercloud/conversation.html) service is used to analyze natural language and determine which action(s) to take based on the user input. There are two main concepts to understand here. The first are referred to as "Intents", which determine what the user would like the application to do. Next, we have "Entities", which provide context of where the intent should be applied. To keep things simple, we have two intents, one is titled "turnoff", the other "turnon". Next, we have 3 entities, which are household devices that we'd like to turn off and on in this case. This pre-trained data model can be uploaded to the provisioned Conversation service through the UI. To initiate the upload, login to the Bluemix console. Next select the conversation service, and then the button titled "Launch Tool".

### Watson IoT Platform
The Watson IoT Platform will be utilized as a MQTT messaging broker. This is a lightweight publish/subscribe messaging protocol that'll allow for various devices such as a Phone, Laptop, and Microphone to communicate with the Raspberry Pi. Once this service has been provisioned, we'll need to generate a set of credentials to securely access the MQTT broker. These steps are listed [here](#iot-gateway/)

### Openwhisk
Rather than writing and executing pipelines and complex automation logic on the Raspberry Pi, we’ll utilize a serverless, event driven platform called Openwhisk. In this implementation, Openwhisk actions communicate with the Raspberry Pi via MQTT messages. [Openwhisk](https://console.ng.bluemix.net/openwhisk) is a serverless framework which has the ability to bind snippets of code to REST API endpoints. Once these have been created, they can be executed directly from any internet connected device, or they can respond to events such as a database change or a message coming in to a specific MQTT channel. Once these snippets, or "Actions" have been created, they may be chained together as a sequence, as seen above in the architecture diagram.

To get started, we will create a sequence that consists of three actions. The first action will transcribe an audio payload to text. The second action will analyze the transcribed text result using the Conversation service. This analysis will extract the intent behind the spoken message, and determine what the user would like the Raspberry Pi to do. So, for example, if the user says something along the line of “Turn on the light” or “Flip the switch”, the NLC service will be able to interpret that. Finally, the third action will send a MQTT message that’ll notify the Raspberry Pi to switch the socket on/off.

The speech to text action is already built in to Openwhisk as a public package, so we’ll just need to supply our credentials for that service. Moving forward, we can create the additional actions with the following commands.


### Twilio
