import pyaudio
import httplib
import wave
import audioop
from collections import deque
import os
import requests
import math
from os.path import join, dirname

from watson_developer_cloud import SpeechToTextV1 as SpeechToText

LANG_CODE = 'en-US'  # Language to use


# Microphone stream config.
CHUNK = 1024  # CHUNKS of bytes to read each time from mic
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
THRESHOLD = 2500  # The threshold intensity that defines silence
                  # and noise signal (an int. lower than THRESHOLD is silence).

SILENCE_LIMIT = 2  # Silence limit in seconds. The max ammount of seconds where
                   # only silence is recorded. When this time passes the
                   # recording finishes and the file is delivered.

PREV_AUDIO = 0.5  # Previous audio (in seconds) to prepend. When noise
                  # is detected, how much of previously recorded audio is
                  # prepended. This helps to prevent chopping the beggining
                  # of the phrase.


def audio_int(num_samples=50):
    """ Gets average audio intensity of your mic sound. You can use it to get
        average intensities while you're talking and/or silent. The average
        is the avg of the 20% largest intensities recorded.
    """

    print "Getting intensity values from mic."
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    values = [math.sqrt(abs(audioop.avg(stream.read(CHUNK), 4))) 
              for x in range(num_samples)] 
    values = sorted(values, reverse=True)
    r = sum(values[:int(num_samples * 0.2)]) / int(num_samples * 0.2)
    print " Finished "
    print " Average audio intensity is ", r
    stream.close()
    p.terminate()
    return r


def listen_for_speech(threshold=THRESHOLD, num_phrases=1):
    """
    Listens to Microphone, extracts phrases from it and sends it to 
    Google's TTS service and returns response. a "phrase" is sound 
    surrounded by silence (according to threshold). num_phrases controls
    how many phrases to process before finishing the listening process 
    (-1 for infinite). 
    """

    #Open stream
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print "* Listening mic. "
    audio2send = []
    cur_data = ''  # current chunk  of audio data
    rel = RATE/CHUNK
    slid_win = deque(maxlen=SILENCE_LIMIT * rel)
    #Prepend audio from 0.5 seconds before noise was detected
    prev_audio = deque(maxlen=PREV_AUDIO * rel) 
    started = False
    n = num_phrases
    response = []
    #conn = http.client.HTTPSConnection("api.ibm.com")
    conn =  httplib.HTTPSConnection("openwhisk.ng.bluemix.net")
    headers = {
        'accept': "application/json",
        'content-type': "application/json",
        "Authorization": "Basic ZDE2ZjAwN2YtZDQxMi00NTExLTg3ZDktY2EzNGQ0MGM2Y2NlOk9Xb3NmZzBFSEhnVHc0RlBSeEZhUERXUzFJcU5naWhYOE9hekFaOVhPNzVWdGJOUUgxazV5Zng3Q1hEZGpyNWE="
        }
    while (num_phrases == -1 or n > 0):
        cur_data = stream.read(CHUNK)
        slid_win.append(math.sqrt(abs(audioop.avg(cur_data, 4))))
        if(sum([x > THRESHOLD for x in slid_win]) > 0):
            if(not started):
                print "Starting record of phrase"
                started = True
            audio2send.append(cur_data)
        elif (started is True):
            print "Finished"
            # The limit was reached, finish capture and deliver.
            filename = save_speech(list(prev_audio) + audio2send, p)
            result = transcribe_audio('speech.wav')
            print result
            text = result['data']
            print("Text: " + text + "\n")
            started = False
            slid_win = deque(maxlen=SILENCE_LIMIT * rel)
            prev_audio = deque(maxlen=0.5 * rel)
            audio2send = []
            n -= 1
    print "* Done recording"
    stream.close()
    p.terminate()

def transcribe_audio(path_to_audio_file):
    encoded_audio = open('speech.wav', 'r').read().encode("base64")
    r = requests.post("https://openwhisk.ng.bluemix.net/api/v1/namespaces/kkbankol@us.ibm.com_dev/actions/sequenceAction?blocking=true&result=true", json={"content_type":"audio/wav","encoding":"base64","payload": encoded_audio ,"username":"11afe700-5c9b-4bf0-81b9-6e630a303933","password":"c3XekWOLRuP4"}, auth=("d16f007f-d412-4511-87d9-ca34d40c6cce", "OWosfg0EHHgTw4FPRxFaPDWS1IqNgihX8OazAZ9XO75VtbNQH1k5yfx7CXDdjr5a"))
    return r.json()

def save_speech(data, p):
    """ Saves mic data to temporary WAV file. Returns filename of saved 
        file """

    filename = 'speech'
    # writes data to WAV file
    data = ''.join(data)
    wf = wave.open(filename + '.wav', 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
    wf.setframerate(16000)  # TODO make this value a function parameter?
    wf.writeframes(data)
    wf.close()
    return filename + '.wav'

if(__name__ == '__main__'):
    listen_for_speech()  # listen to mic.
    #print stt_google_wav('hello.flac')  # translate audio file
    #audio_int()  # To measure your mic levels
