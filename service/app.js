const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sms', function (request, response) {
  const message = req.body.Body
  console.log(message)
  // TODO: run through natural language classifier
})

app.post('/parse', function(request, response)) {
	// TODO: NLC
})

app.listen(8000, function (err) {
  if (err) {
    throw err
  }

  console.log('Service started on port 8000')
})