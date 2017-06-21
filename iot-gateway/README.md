### TODO
This guide provides a step by step tutorial to equip users to control power outlets using a Raspberry PI. The voice/text commands to trigger the outlets will be processed by IBM Watson's natural language services.

## Create credentials for Watson IoT Platform (MQTT Broker)
Login to [IBM Bluemix](https://console.ng.bluemix.net)

Select the service [Catalog](https://console.ng.bluemix.net/catalog/) icon in the upper right

Select and create the "Watson IoT Platform" service

![Watson IoT Image](http://i.imgur.com/ymdlMIf.png?1)

Once the Watson IoT Platform has been successfully created, click the "Launch" button to access the Dashboard

![Watson IoT Dashboard](../images/iotwelcome.png)

Register your Raspberry PI with the Watson IoT Platform. This can be done by navigating to the Devices tab in the dashboard, and selecting "Add Device"
![IoT Add Device Menu](../images/adddevice_menu.png)

Select "Create a device type"
![IoT Create Device](../images/adddevice.png)

Enter a name for the device type. We used "homeAutomation". Continue pressing "Next" to create the device type and to Add a device. Enter a unique string of numbers and letters as the Device ID.
![IoT Create Device Type](../images/createdevicetype.png)

Next, we'll need to generate an API key to serve as credentials for the MQTT broker. Select the "Apps" option in the sidebar, and click "Generate API Key".
![IoT Create Device Type](../images/generateapikey_menu.png)

Take note of the API Key and Authentication Token, as they will be required to access the secure MQTT broker from Openwhisk and the Raspberry Pi.
![IoT Create Device Type](../images/devicecreds.png)

<!-- ![](https://www.ibm.com/developerworks/cloud/library/cl-mqtt-bluemix-iot-node-red-app/image004.jpg)

![](https://www.ibm.com/developerworks/cloud/library/cl-mqtt-bluemix-iot-node-red-app/image005.jpg)

Next, create an api key. This key will be used to authenticate to the MQTT broker provided by the Watson IoT platform. This can be done by navigating to the API Keys tab, and selecting "New API Key"

![](https://www.ibm.com/developerworks/cloud/library/cl-mqtt-bluemix-iot-node-red-app/image006.jpg)

Be sure to take note of the resulting apikey/token, as it will only be shown in the dashboard once

![](https://www.ibm.com/developerworks/cloud/library/cl-mqtt-bluemix-iot-node-red-app/image007.jpg)

Place the credentials in the [node_mqtt.js](node_mqtt.js) file

[Device Registration Steps](https://www.ibm.com/developerworks/cloud/library/cl-mqtt-bluemix-iot-node-red-app/)

Credit:
https://www.ibm.com/developerworks/en/cloud/library/cl-mqtt-bluemix-iot-node-red-app/index.html -->
<!-- TODO, find and mention source for steps -->

<!--
## Install Raspberry Pi dependencies
Login to Raspberry PI and install prerequisites for wiringPi library. This library allows a user to monitor and control the Raspberry Pi's GPIO pins.
```
sudo apt-get update
sudo apt-get install git-core
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin
# Ensure wiringPi library is installed by running the following command. (https://projects.drogon.net/raspberry-pi/wiringpi/the-gpio-utility/)
gpio readall  
```
Install 433Utils, which will call the wiringPi library to transmit and receive messages via the 433MHz frequency
```
git clone git://github.com/ninjablocks/433Utils.git
cd 433Utils/RPi_utils
make   
```
Arrange the transmitter, receiver, and breakout board into breadboard to complete the following circuit https://wi-images.condecdn.net/image/PxqdnRzYBzq/crop/810
Now we will determine which RF codes correspond with the Etekcity outlets. This can be done by simply running
```
sudo /var/www/rfoutlet/RFSniffer
```
Press the button on the Etekcity remote that corresponds with the outlet you'd like to control, if the receiver is wired correctly, you should see the following output.
```
pi@raspberrypi:~ $ sudo /var/www/rfoutlet/RFSniffer
Received 5527308
Received pulse 190
Received 5527308
Received pulse 191
```

## Run Script

Modify lines 41 and 46 to use the RF code that was detected by RFSniffer.

Next, run the node_mqtt.js file, which will listen on the proper mqtt channel for incoming messages from the nlc service. If the message matches a certain registered device and state, the "sendcode" command will be invoked to control the registered Etekcity outlet
```
sudo node node_mqtt.js
``` -->
