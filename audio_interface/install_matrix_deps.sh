# Install dependencies
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y install build-essential git-core sox alsa-utils curl cmake wget

# Update .asoundrc file
cp ~/.asoundrc ~/.asoundrc.bak
wget https://raw.githubusercontent.com/IBM/serverless-home-automation/master/audio_interface/.asoundrc.matrix -P ~/.asoundrc

# Clone matrix repository
git clone https://github.com/matrix-io/matrix-creator-hal.git

# Build matrix demos
cd matrix-creator-hal
mkdir build && cd build
cmake ..
make

# Test mic array demo
echo "Recording voice"
~/matrix-creator-hal/build/demos/micarray_recorder
echo "Voice recording complete"

# Convert beamformed result
sox -r 16000 -c 1 -e signed -c 1 -e signed -b 16 mic_16000_s16le_channel_8.raw beamforming_result.wav 

# Transcribe result using Watson
curl -u "{username}":"{password}" --header "Content-Type: audio/wav" --data-binary "@beamforming_result.wav" "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize
