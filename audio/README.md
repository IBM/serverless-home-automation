## Raspberry Pi powered Audio Interface
*Read this in other languages: [한국어](README-ko.md).*

### Requirements
- Raspberry Pi 3 with Raspbian OS
- Generic USB Microphone

### Configure Hotword using Snowboy service
Let's start with creating custom wakeword in order to trigger speec to text transcription. For example, we can create a hotword engine that would listen on wake word such as **Hey Watson** or **Hello Watson** or **Hi Watson** once it detects the wake word through audio interface, we can then use the subsequent audio for transcription.

We used Snowboy for this purpose. First create a hotword from their official [website](https://snowboy.kitt.ai/).

Once you create a hotword with three audio samples, you can now download the model which we will use in the later section.

### Configure Microphone
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

Press Ctrl+C to quit the `rec` process

### Running a demo
Now we will run the sample script that will capture the audio after the hotword is detected and use Watson Speech to Text with the captured audio.
To do so, run the following to clone the associated "snowboy" submodule.
```
git submodule init
git submodule update
```

Test end-to-end sequence with the following command
```
python demo_arecord.py Hey_Watson_PI.pmdl
```

When the wakeword is detected, the `wsk_transcribe_audio` method defined [here](https://github.com/kkbankol-ibm/snowboy/blob/26f49a6a12088f2c2797d68db5ef7eda88798deb/examples/Python/snowboydecoder.py#L61:L77) will record audio for 3 seconds, convert the wav result to a smaller, lossless flac audio file, and then forward the flac audio to the openwhisk sequence. The `whisk_namespace`, `whisk_action`, and `auth` values in the method will all need to be updated with your personal account. These values can be found by running `wsk property get` and `wsk action list`.

### Troubleshooting
```
# jack server is not running or cannot be started

DISPLAY=:0 jack_control start
pulseaudio --start
```

Suppress false errors
https://github.com/Kitt-AI/snowboy/issues/9
