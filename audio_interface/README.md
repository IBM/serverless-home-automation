## Raspberry Pi powered Audio Interface
*Read this in other languages: [한국어](README-ko.md).*

### Requirements
- Raspberry Pi 3 with Raspbian OS
- Generic USB Microphone

### Create Hotword
Let's start with creating custom wakeword in order to trigger speec to text transcription. For example, we can create a hotword engine that would listen on wake word such as **Hey Watson** or **Hello Watson** or **Hi Watson** once it detects the wake word through audio interface, we can then use the subsequent audio for transcription.

We used Snowboy for this purpose. First create a hotword from their [website](https://snowboy.kitt.ai/). You will need to login with Github, Google or Facebook in order to create hotword.

Once you create a hotword with three audio samples, you can now download the model which we will use in the later section.

### Setup Microphone
After plugging in the microphone, obtain the sound card number with the following command
```
pi@raspberrypi2:/tmp $ cat /proc/asound/cards
 0 [ALSA           ]: bcm2835 - bcm2835 ALSA
                      bcm2835 ALSA
 1 [Dummy          ]: Dummy - Dummy
                      Dummy 1
 2 [Device         ]: USB-Audio - USB PnP Sound Device
                      C-Media Electronics Inc. USB PnP Sound Device at usb-3f980000.usb-1.3, full spe
```

We see that our USB-Audio is card 2, so we'll need to reflect that in our ~/.asoundrc file
```
pi@raspberrypi2:/tmp $ cat ~/.asoundrc
pcm.!default  {
 type hw card 2
}
ctl.!default {
 type hw card 2
}
```


Check if audio can be recorded via microphone using
`rec /tmp/temp.wav`


Troubleshooting
```
# jack server is not running or cannot be started

DISPLAY=:0 jack_control start
pulseaudio --start
```

Suppress false errors
https://github.com/Kitt-AI/snowboy/issues/9




### Running a demo
Now we will run the sample script that will capture the audio after the hotword is detected and use Watson Speech to Text with the captured audio.

First, we will need to download the pre-packaged Snowboy binaries and their Python wrappers for [Raspberry Pi with Raspbian 8.0](https://s3-us-west-2.amazonaws.com/snowboy/snowboy-releases/rpi-arm-raspbian-8.0-1.1.0.tar.bz2) and unpack it.

Now copy [detect_hotword.py](audio_interface/detect_hotword.py) & [record_audio.py](audio_interface/record_audio.py) into the unpacked folder.
