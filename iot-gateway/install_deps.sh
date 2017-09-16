#!/bin/bash

sudo apt-get -y update
sudo apt-get -y install git-core build-essential python-pyaudio python3-pyaudio sox make pulseaudio alsa-utils
sudo easy_install pip
touch ~/.asoundrc
cp ~/.asoundrc ~/.asoundrc.bak
cp ../recording-device/.asoundrc ~/.asoundrc

## Swig
sudo apt-get -y install libpcre3 libpcre3-dev autoconf
#sudo apt-get -y install swig3.0 # apt-get version outdated, have to build from source
#TODO, add validated swig url
#wget http://ufpr.dl.sourceforge.net/project/swig/swig/swig-3.0.12/swig-3.0.12.tar.gz
git clone https://github.com/swig/swig
#tar -xzf swig-3.0.12.tar.gz
#cd swig-3.0.12/
#./configure
#make
#make install

## Snowboy
cd ~/
sudo apt-get -y install libatlas-base-dev
sudo pip install pyaudio
git clone https://github.com/Kitt-AI/snowboy/
cd snowboy/swig/Python
make

## wiringPi
cd ~/
rm -rf wiringPi
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin master
./build

## 433Utils
cd ~/
rm -rf 433Utils
git clone --recursive git://github.com/ninjablocks/433Utils.git
cd 433Utils/RPi_utils
make
