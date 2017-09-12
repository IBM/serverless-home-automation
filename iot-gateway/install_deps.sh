#!/bin/bash
sudo apt-get -y update
sudo apt-get -y install git-core
git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin master
./build
cd ~
sudo apt-get install build-essential
git clone git://github.com/ninjablocks/433Utils.git
cd 433Utils/RPi_utils
make
