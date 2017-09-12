#!/bin/bash
sudo apt-get -y update
sudo apt-get -y install git-core build-essential
cd ~/
rm -rf wiringPi
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin master
./build
cd ~/
rm -rf 433Utils
git clone --recursive git://github.com/ninjablocks/433Utils.git
cd 433Utils/RPi_utils
make
