// var mqtt_broker = 'mqtt://mqtt-host'
// var mqtt_broker = 'mqtt://agf5n9.messaging.internetofthings.ibmcloud.com'
var mqtt_broker = 'mqtt://uycwmh.messaging.internetofthings.ibmcloud.com'
var mqtt = require('mqtt');
var exec = require('child_process').exec;

//var mqtt_options = {
//  username: 'a-agf5n9-ysppbltpx0',
//  password: '9W1x8syMb-AOku(H_3',
//  clientId: 'a:agf5n9:server'
//}
var mqtt_options = {
  username: 'a-uycwmh-tegkxgay2j',
  password: 'HgIScZ4bciBxWWK20L',
  clientId: 'a:uycwmh:server'
}
var mqtt_client = mqtt.connect(mqtt_broker, mqtt_options);

//var channel = 'iot-2/type/MQTTDevice/id/965d11de/evt/msgin/fmt/json'
var channel = 'iot-2/type/RaspberryPI/id/6ae26747/evt/query/fmt/json'

mqtt_client.on('connect', function () {
  mqtt_client.subscribe(channel);
  console.log("connected");
});

mqtt_client.on('message', function (topic, message) {
  console.log('topic')
  console.log(topic)
  var messageStr = message.toString('utf8')
  console.log(messageStr)
  var classes = JSON.parse(messageStr)
  var result = {}
    for (var i = 0; i < classes.length; i++) {
    	var nlc_class = classes[i];
    	if (nlc_class.class_name == 'on' || nlc_class.class_name == 'off') {
    		result.command = nlc_class.class_name;
    	}
    }
  if (result.command == 'on') {
    exec("/var/www/rfoutlet/codesend 5527299 -l 186 -p 0", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    });
  } else if (result.command == 'off') {
      exec("/var/www/rfoutlet/codesend 5527308 -l 186 -p 0", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    });
  }
});

