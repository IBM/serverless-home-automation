import sys
import signal

import snowboydecoder

import record_audio


interrupted = False


def signal_handler(signal, frame):
    global interrupted
    interrupted = True


def interrupt_callback():
    global interrupted
    return interrupted


def detected_callback():
    print("Hotword Detected...")
    print("record and submit sbsequent audio to watson speech to text")
    detector.terminate()
    record_audio.listen_for_speech()


if len(sys.argv) == 1:
    print("Error: need to specify model name")
    print("Usage: python demo.py your.model")
    sys.exit(-1)


model = sys.argv[1]

# capture SIGINT signal, e.g., Ctrl+C
signal.signal(signal.SIGINT, signal_handler)

# main loop
detector = snowboydecoder.HotwordDetector(model, sensitivity=0.5)
print('Listening... Press Ctrl+C to exit')
detector.start(detected_callback=detected_callback, interrupt_check=interrupt_callback, sleep_time=0.03)
