'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))

// Route that receives a POST request to /sms
app.post('/sms', function (req, res) {
  const message = req.body.Body
  console.log(message)
  var username = "d16f007f-d412-4511-87d9-ca34d40c6cce",
      password = "OWosfg0EHHgTw4FPRxFaPDWS1IqNgihX8OazAZ9XO75VtbNQH1k5yfx7CXDdjr5a";
  request.post(
    'https://openwhisk.ng.bluemix.net/api/v1/namespaces/kkbankol@us.ibm.com_dev/actions/textSequence?blocking=true&result=false',
    { 
    	json: { data: message }, 
    	auth: {
	    	user: username,
	    	pass: password
  		}
    },
    function (error, response, body) {
        console.log(body)
        res.set('Content-Type', 'text/plain')
  		res.send(`You sent: ${message} to Express`)
    }
  );
})

// Tell our app to listen on port 3000
app.listen(3000, function (err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 3000')
})