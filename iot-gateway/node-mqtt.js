var mqtt = require('mqtt');
var exec = require('child_process').exec;
var _ = require('underscore')
var mqttBroker = 'mqtt://' + process.env.IOT_ORG + '.messaging.internetofthings.ibmcloud.com'
var mqttOptions = {
  username: process.env.IOT_API_KEY,
  password: process.env.IOT_AUTH_TOKEN
  clientId: 'a:' + process.env.IOT_ORG + ':server'
}
var mqttClient = mqtt.connect(mqttBroker, mqttOptions);
var mqttChannel = 'iot-2/type/' + process.env.IOT_DEVICE_TYPE + '/id/' + process.env.IOT_DEVICE_ID '/evt/query/fmt/json'

var config = JSON.parse('./devices.json')
var libs = {
  ir: '/usr/bin/irsend',
  rf: '/var/www/rfoutlet/codesend'
  // /var/www/rfoutlet/codesend " + process.env.RF_PLUG_ON_1 + " -l " + process.env.RF_PLUG_ON_PULSE_1 + " -p 0"
}

var lirc_values = {
  "on":
}

var args = {
  "":
}


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
// _.where( devices, {location: "kitchen", type: "light"})
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



function genCmds(device, desiredState) {
    // determine required commands, return as array

    // to determine required commands, we need to look at
      // parent device state (if exists)
      // var parentDevice = _.where( config['devices'], {name: device[0]['belongs_to']})[0]
        // adjust if parent device state isn't on
      // current device state

    // loop through array, execute commands with .2 second delay between each
    var cmds = []
    // check for parentDevice
    async.series([
      function(){

      },
      function(){

      }
    ])
    var parentDevice = _.where( config['devices'], {name: device[0]['belongs_to']} )[0]
    if ( parentDevice.states.power == 'off' ) {
      cmds.push(
        // rf
        libs[parentDevice.protocol] + parentDevice.config.on + '-l' + parentDevice.config.pulse + '-p 0'

        libs[parentDevice.protocol] + "SEND_ONCE" + " KEY_POWER" +  parentDevice.config.lirc
      )

    if ( device.states.power == 'off' ) {
      cmds.push(
        // rf
        libs[device.protocol] + device.config.on + '-l' + device.config.pulse + '-p 0'

        libs[device.protocol] + "SEND_ONCE" + " KEY_POWER" +  device.config.lirc
      )

    if ( desiredState == channel ) {

    }
// /var/www/rfoutlet/codesend " + process.env.RF_PLUG_ON_1 + " -l " + process.env.RF_PLUG_ON_PULSE_1 + " -p 0"
// irsend SEND_ONCE KEY_POWER /home/pi/remotes/vanness_cable.conf


      // _.where( config['devices'], {name:
      // parentDevice.states.power == "on"
    }


    libs[type] +
    return []
}

mqttClient.on('connect', function () {
  mqttClient.subscribe(mqttChannel)
  console.log("connected to mqtt broker, waiting for requests")
});

mqttClient.on('message', function (topic, message) {
  // parse message
  var msgPayload = JSON.parse(messageStr)
  // select device(s) from config
  // _.where( devices, {location: "kitchen", type: "light"})

  // // testing
  // var msgPayload = {}
  // msgPayload['entities'] = {location: "livingroom", class: "media_player", type: "chromecast"}

  var device = _.where( config['devices'], msgPayload['entities'] )
  var desiredState = msgPayload['state']
  for cmd in (genCmds(device, desiredState)) {
      exec(cmd, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);)
    }
  }
})
