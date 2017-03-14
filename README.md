## Natural Language Interface based Home Automation
Over the past few years, we’ve seen a significant rise in popularity for intelligent personal assistants, such as Apple’s Siri, Amazon Alexa, and Google Assistant. Though they initially appeared to be little more than a novelty, they’ve evolved to become rather useful as a convenient interface to interact with service APIs and IoT connected devices. This developer journey will guide users through setting up their own starter home automation hub by using a Raspberry PI to turn power outlets off and on. Once the circuit and software dependencies are installed and configured properly, users will also be able to leverage Watson’s language services to control the power outlets via voice and/or text commands. Furthermore, we’ll show how Openwhisk serverless functions can be leveraged to trigger these sockets based on a timed schedule, changes to the weather, motion sensors being activated, etc.

### Architecture
![Architecture](/images/Architecturev2.jpg "Architecture")

## Provision and Configure Platform Services
- Conversation
- Speech to Text
- Watson IoT Platform
- Openwhisk
- Twilio

A Bluemix Account is required to provision these services. Each can be found by going to the (Bluemix Service Catalog)[https://console.ng.bluemix.net/catalog], searching for the name of the service, and then clicking the "Create" button on the lower right corner.
<Insert gif>

## Hardware Components
Setting up the RF circuit will require the following components:
- [Raspberry PI 3](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
- [GPIO Ribbon cable + Breakout Board](https://www.adafruit.com/product/914)
- [433MHz RF transmitter and receiver](https://www.amazon.com/SMAKN%C2%AE-433Mhz-Transmitter-Receiver-Arduino/dp/B00M2CUALS)
- [Etekcity 433 MHz Outlets](https://www.amazon.com/Etekcity%C2%AE-Wireless-Control-Switches-included/dp/B00DQELHAE/)
- [Electronic Breadboard](https://www.adafruit.com/product/239)
- [USB Microphone]()

Ultimately what we want to do here is to arrange the components in the following circuit
<circuit diagram>



### Audio Interface
Once the Raspberry is
The Audio Interface comprises of a USB microphone attached to a Raspberry Pi which records audio and transcribes it via Watson's Speech to Text service. To ensure that audio is recorded and transcribed only as needed, we've leveraged a "Hotword" detection service named [Snowboy](https://snowboy.kitt.ai/), which listens for a specific speech pattern (**Hello Watson**, in this case), and begins recording once the hotword pattern is detected. The steps required to create a voice model can be found [here](http://docs.kitt.ai/snowboy/)

### Provision Services


### Watson IoT Platform
The Watson IoT Platform serves as a MQTT messaging broker. This is a lightweight publish/subscribe messaging protocol that'll allow for various devices such as a Phone, Laptop, and Microphone to
to forward user commands to control the Raspberry Pi. [Watson IoT Platform](#iot-gateway/)

Once this service has been provisioned, we'll need to generate a set of credentials to securely access the MQTT broker.

### Configure Openwhisk Actions
Openwhisk is a serverless framework which has the ability to bind snippets of code to REST API endpoints. Once these have been created, they can be called

Once these snippets, or "Actions" have been created, they may be chained together as a sequence, as seen above in the architecture diagram.


TODO
