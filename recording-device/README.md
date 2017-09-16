### Speech Recorder
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


