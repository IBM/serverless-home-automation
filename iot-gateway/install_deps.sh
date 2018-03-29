#!/bin/bash

sudo apt-get -y update
sudo apt-get -y install git-core build-essential python-setuptools python-pyaudio python3-pyaudio sox make pulseaudio alsa-utils
sudo easy_install pip

if [ -f ~/.asoundrc ] ; then
  echo "Backing up .asoundrc"
  cp ~/.asoundrc "~/.asoundrc.bak.$(date +%s)"
fi
cp ../audio_interface/.asoundrc ~/.asoundrc

libs_dir="/opt/home_libs"
sudo mkdir -p $libs_dir
sudo chown pi:pi $libs_dir


## Swig
#sudo apt-get -y install swig3.0 # apt-get version outdated, have to build from source
#TODO, add validated swig url or use git
# git clone https://github.com/swig/swig
sudo apt-get -y install libpcre3 libpcre3-dev autoconf
cd $libs_dir
wget http://ufpr.dl.sourceforge.net/project/swig/swig/swig-3.0.12/swig-3.0.12.tar.gz
tar -xzf swig-3.0.12.tar.gz
cd swig-3.0.12/
./configure
make
sudo make install

## Snowboy Wakeword
cd $libs_dir
sudo apt-get -y install libatlas-base-dev
sudo pip install pyaudio
git clone https://github.com/Kitt-AI/snowboy/
cd snowboy/swig/Python
make

## wiringPi
cd $libs_dir
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin master
./build

## 433Utils
cd $libs_dir
git clone --recursive git://github.com/ninjablocks/433Utils.git
cd 433Utils/RPi_utils
make

# Install node / npm if needed
if [[ ! "$(command -v npm)" || ! "$(command -v node)" ]] ; then
  echo "Node / npm is not installed, running install script"
  curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
  sudo apt-get install -y build-essential
  sudo apt-get install -y nodejs
fi
npm install mqtt
