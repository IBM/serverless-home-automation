### Voice-controlled Home Automation Using IBM Watson, Docker, IFTTT, and Serverless

This guide provides a step by step tutorial to equip users to control power outlets using a Raspberry PI. The voice/text commands to trigger the outlets will be processed by IBM Watson's natural language services.

- Micro SD Card
- Raspberry PI
- Wemo Outlet (WiFi)
- GPIO Ribbon cable + Breakout Board
- 433MHz RF transmitter and receiver
- Etekcity plugs (RF)
- Electronic Breadboard

Install a supported OS for the Raspberry PI onto the SD card. Raspbian is recommended
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
Modify lines 41 and 46 to use the RF code that was detected by RFSniffer.
Next, run the node_mqtt.js file, which will listen on the proper mqtt channel for incoming messages from the nlc service. If the message matches a certain registered device and state, the "sendcode" command will be invoked to control the registered Etekcity outlet
```
sudo node node_mqtt.js
```

