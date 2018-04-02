var mqtt = require('mqtt');
var exec = require('child_process').exec;
// var _ = require('underscore')

/*
For this script to work, the following env variables will need to be defined beforehand

Watson IoT Credentials, which can be found in the dashboard "Devices" and "Apps" sections
- IOT_API_KEY
- IOT_AUTH_TOKEN
- IOT_ORG
- IOT_DEVICE_TYPE

On/Off RF codes for each devices we'd like to control, in the following format
- RF_FAN_OFF
- RF_FAN_ON
*/

var mqttBroker = 'mqtt://' + process.env.IOT_ORG + '.messaging.internetofthings.ibmcloud.com'
var mqttOptions = {
  username: process.env.IOT_API_KEY,
  password: process.env.IOT_AUTH_TOKEN,
  clientId: 'a:' + process.env.IOT_ORG + ':server'
}
var mqttChannel = 'iot-2/type/' + process.env.IOT_DEVICE_TYPE + '/id/' + process.env.IOT_DEVICE_ID + '/evt/query/fmt/json'


// var config = JSON.parse('devices.json')

// var libs = {
//   ir: '/usr/bin/irsend',
//   rf: '/opt/433Utils/RPi_utils/codesend'
//   // /opt/433Utils/RPi_utils/codesend " + process.env.RF_PLUG_ON_1 + " -l " + process.env.RF_PLUG_ON_PULSE_1 + " -p 0"
// }

// var lirc_values = {
//   "on":
// }
//
// var args = {
//   "":
// }


// var lirc_values = ["POWER", "VIDEOMODE", "CHANNELUP", "CHANNELDOWN", "VOLUMEUP", "VOLUMEDOWN", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// play video at <url> from <platform> on <tv>

// wsk sequence determines intent and generic entities describing what the user wants, and which devices should be affected
//
// ultimately need wsk to return an array of one or more commands
// multiple commands are needed when setting a mode or controlling a device that has a parent device (chromecast)

// owned devices are linked to one another

// if intent is "control device", mqtt sends entities with location, type, and requested state

// if intent is "watch_media"
// use whisk to lookup url, mqtt sends url, select media_player, cast to media_player


// var _ = require("underscore");
// _.where( devices, {location: "kitchen", class: "light"})
// _.where( devices, {location: "livingroom", class: "media_player"})
// if _.where( devices['devices'], {location: "livingroom", class: "media_player"})[0]['belongs_to']['current_state'] == "off"
// turn on
// wait
// change state of originally requested device

// flow
// select device from config
// select parent device from config
// check state of parent device, if off, turn on
// update state of both devices in redis or

// persist state in memory?

var mqttClient = mqtt.connect(mqttBroker, mqttOptions);
mqttClient.on('connect', function () {
  mqttClient.subscribe(mqttChannel);
  console.log("connected");
});

mqttClient.on('message', function (topic, message) {
  console.log(message.toString('utf8'))
  //console.log(topic)
  var result = JSON.parse(message.toString('utf8')).d
  // if ((result.intent == 'turnon') && (result.entity == 'light')) {
  if ((result.intents.filter(function(value){ return value.intent=="turnon"})) && (result.entities.filter(function(value){ return value.value=="light"}))) {
    console.log("Turning on light")
    exec("/opt/433Utils/RPi_utils/codesend process.env.RF_LIGHT_ON -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      // console.log('stderr: ' + stderr);
    });
  }
  else if ((result.intents.filter(function(value){ return value.intent=="turnoff"})) && (result.entities.filter(function(value){ return value.value=="light"}))) {
    console.log("Turning off light")
    exec("/opt/433Utils/RPi_utils/codesend process.env.RF_LIGHT_OFF -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      // console.log('stderr: ' + stderr);
    });
  }
  else if ((result.intents.filter(function(value){ return value.intent=="turnon"})) && (result.entities.filter(function(value){ return value.value=="fan"}))) {
    console.log("Turning on fan")
    exec("/opt/433Utils/RPi_utils/codesend process.env.RF_FAN_ON -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      // console.log('stderr: ' + stderr);
    });
  }
  else if ((result.intents.filter(function(value){ return value.intent=="turnoff"})) && (result.entities.filter(function(value){ return value.value=="fan"}))) {
    console.log("Turning off fan")
    exec("/opt/433Utils/RPi_utils/codesend process.env.RF_FAN_OFF -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      // console.log('stderr: ' + stderr);
    });
  }
  else if ((result.intents.filter(function(value){ return value.intent=="turnon"})) && (result.entities.filter(function(value){ return value.value=="clock"}))) {
    console.log("Turning on clock")
    exec("/opt/433Utils/RPi_utils/codesend process.env.RF_FAN_ON -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      // console.log('stderr: ' + stderr);
    });
  }
  else if ((result.intents.filter(function(value){ return value.intent=="turnoff"})) && (result.entities.filter(function(value){ return value.value=="clock"}))) {
    console.log("Turning off clock")
    exec("/opt/433Utils/RPi_utils/codesend process.env.RF_FAN_OFF -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      // console.log('stderr: ' + stderr);
    });
  }
})
//
//   else if ((result.intent == 'turnoff') && (result.entity == 'light')) {
//       console.log("Turning off light")
//       exec("/opt/433Utils/RPi_utils/codesend process.env.RF_LIGHT_OFF -l 190 -p 0", function (error, stdout, stderr) {
//       console.log(' ' + stdout);
//       // console.log('stderr: ' + stderr);
//     });
//   }
//   else if ((result.intent == 'turnon') && (result.entity == 'fan')) {
//       console.log("Turning on fan")
//       exec("/opt/433Utils/RPi_utils/codesend process.env.RF_FAN_ON -l 190 -p 0", function (error, stdout, stderr) {
//       console.log(' ' + stdout);
//       // console.log('stderr: ' + stderr);
//     });
//   }
//   else if ((result.intent == 'turnoff') && (result.entity == 'fan')) {
//       console.log("Turning off fan")
//       exec("/opt/433Utils/RPi_utils/codesend process.env.RF_FAN_OFF -l 191 -p 0", function (error, stdout, stderr) {
//       console.log(' ' + stdout);
//       // console.log('stderr: ' + stderr);
//     });
//   }
//   else if ((result.intent == 'turnon') && (result.entity == 'clock')) {
//       console.log("Turning on clock")
//       exec("/opt/433Utils/RPi_utils/codesend process.env.RF_CLOCK_ON -l 190 -p 0", function (error, stdout, stderr) {
//       console.log(' ' + stdout);
//       // console.log('stderr: ' + stderr);
//     });
//   }
//   else if ((result.intent == 'turnoff') && (result.entity == 'clock')) {
//       console.log("Turning off fan")
//       exec("/opt/433Utils/RPi_utils/codesend process.env.RF_CLOCK_OFF -l 190 -p 0", function (error, stdout, stderr) {
//       console.log(' ' + stdout);
//       // console.log('stderr: ' + stderr);
//     });
//   }
// });
// )
