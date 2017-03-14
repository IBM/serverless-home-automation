var mqtt_broker = 'mqtt://' + process.env.IOT_ORG + '.messaging.internetofthings.ibmcloud.com'
var mqtt = require('mqtt');
var exec = require('child_process').exec;

var mqtt_options = {
  username: process.env.IOT_API_KEY,
  password: process.env.IOT_AUTH_TOKEN
  clientId: 'a:' + process.env.IOT_ORG + ':server'
}
var mqtt_client = mqtt.connect(mqtt_broker, mqtt_options);
var channel = 'iot-2/type/' + process.env.IOT_DEVICE_TYPE + '/id/' + process.env.IOT_DEVICE_ID '/evt/query/fmt/json'

mqtt_client.on('connect', function () {
  mqtt_client.subscribe(channel);
  console.log("connected");
});

mqtt_client.on('message', function (topic, message) {
  var classes = JSON.parse(messageStr)
  var result = {}
    for (var i = 0; i < classes.length; i++) {
    	var nlc_class = classes[i];
    	if (nlc_class.class_name == 'on' || nlc_class.class_name == 'off') {
    		result.command = nlc_class.class_name;
    	}
    }
  if (result.command == 'on') {
    exec("/var/www/rfoutlet/codesend " + process.env.RF_PLUG_ON_1 + " -l " + process.env.RF_PLUG_ON_PULSE_1 + " -p 0", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if (result.command == 'off') {
      exec("/var/www/rfoutlet/codesend " + process.env.RF_PLUG_OFF_1 + " -l " + process.env.RF_PLUG_OFF_PULSE_1 + " -p 0", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    });
  }
});

