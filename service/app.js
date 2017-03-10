const express = require('express')
const bodyParser = require('body-parser')
const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

const natural_language_classifier = new NaturalLanguageClassifierV1({
  username: '<username>',
  password: '<password>'
});

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sms', function (request, response) {
  const message = req.body.Body
  console.log(message)
  // TODO: run through natural language classifier
})

app.post('/parse', function(request, response)) {
	natural_language_classifier.classify({
	  text: '<sample text>',
	  classifier_id: '<classifier-id>' },
	  function(err, response) {
	    
	});
})

app.listen(8000, function (err) {
  if (err) {
    throw err
  }

  console.log('Service started on port 8000')
})