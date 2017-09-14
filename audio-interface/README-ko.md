## Raspberry Pi powered Audio Interface

### Requirements
- Raspberry Pi 3 with Raspbian OS
- Generic USB Microphone

### Create Hotword
Let's start with creating custom wakeword in order to trigger speec to text transcription. For example, we can create a hotword engine that would listen on wake word such as **Hey Watson** or **Hello Watson** or **Hi Watson** once it detects the wake word through audio interface, we can then use the subsequent audio for transcription. 

We used Snowboy for this purpose. First create a hotword from their [website](https://snowboy.kitt.ai/). You will need to login with Github, Google or Facebook in order to create hotword.

Once you create a hotword with three audio samples, you can now download the model which we will use in the later section.

### Setup Microphone
You can use following [link](http://docs.kitt.ai/snowboy/#running-on-raspberry-pi) to setup microphone in your raspberry Pi.


### Running a demo
Now we will run the sample script that will capture the audio after the hotword is detected and use Watson Speech to Text with the captured audio.

First, we will need to download the pre-packaged Snowboy binaries and their Python wrappers for [Raspberry Pi with Raspbian 8.0](https://s3-us-west-2.amazonaws.com/snowboy/snowboy-releases/rpi-arm-raspbian-8.0-1.1.0.tar.bz2) and unpack it.

Now copy [detect_hotword.py](audio-interface/detect_hotword.py) & [record_audio.py](audio-interface/record_audio.py) into the unpacked folder.



