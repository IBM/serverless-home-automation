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

module.paths.push('/usr/lib/node_modules')
var mqtt = require('mqtt');
var exec = require('child_process').exec;
// var _ = require('underscore')
var mqttBroker = 'mqtts://' + process.env.IOT_ORG + '.messaging.internetofthings.ibmcloud.com'
var mqttOptions = {
  username: process.env.IOT_API_KEY,
  password: process.env.IOT_AUTH_TOKEN,
  clientId: 'a:' + process.env.IOT_ORG + ':server1'
}
var mqttChannel = 'iot-2/type/' + process.env.IOT_DEVICE_TYPE + '/id/' + process.env.IOT_DEVICE_ID + '/evt/query/fmt/json'

var mqttClient = mqtt.connect(mqttBroker, mqttOptions);
mqttClient.on('connect', function () {
  mqttClient.subscribe(mqttChannel);
  console.log("connected");
});

mqttClient.on('subscribe', function () {
  console.log("subscribed to " + mqttChannel);
});
function getEntity(entities, entity){
   for(var ent in entities) {
        if (entities[ent].value == entity) {
            return true;
        }
   }
   return false
}
function getIntent(intents, intent){
   for (var intnt in intents) {
        if (intents[intnt].intent == undefined)
           continue
        if (intents[intnt].intent == intent) {
            return true;
        }
   }
   return false
}

mqttClient.on('message', function (topic, message) {
  console.log(message.toString('utf8'))
  var result = JSON.parse(message.toString('utf8')).d
  if (getIntent(result.intents, "turnon") && getEntity(result.entities, "light")){
    console.log("Turning on light")
    exec("/opt/433Utils/RPi_utils/codesend " + process.env.RF_LIGHT_ON + " -l 174 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if ( getIntent(result.intents, "turnoff") && getEntity(result.entities, "light")) {
    console.log("Turning off light")
    exec("/opt/433Utils/RPi_utils/codesend " + process.env.RF_LIGHT_OFF +" -l 172 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if ( getIntent(result.intents, "turnon") && getEntity(result.entities, "fan"))  {
    console.log("Turning on fan")
    exec("/opt/433Utils/RPi_utils/codesend "+process.env.RF_FAN_ON +" -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if ( getIntent(result.intents, "turnoff") && getEntity(result.entities, "fan"))  {
    console.log("Turning off fan")
    exec("/opt/433Utils/RPi_utils/codesend " + process.env.RF_FAN_OFF + " -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if ( getIntent(result.intents, "turnon") && getEntity(result.entities, "radio"))  {
    console.log("Turning on clock")
    exec("/opt/433Utils/RPi_utils/codesend "+ process.env.RF_FAN_ON + " -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if ( getIntent(result.intents, "turnoff") && getEntity(result.entities, "radio"))  {
    console.log("Turning off clock")
    exec("/opt/433Utils/RPi_utils/codesend " + process.env.RF_FAN_OFF + " -l 190 -p 0", function (error, stdout, stderr) {
      console.log(' ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else {
    console.log("Message received but no matches found")
  }
})
