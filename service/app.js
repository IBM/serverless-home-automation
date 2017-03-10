require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

const natural_language_classifier = new NaturalLanguageClassifierV1({
    username: process.env.NLC_USER,
    password: process.env.NLC_PASSWORD
});

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/sms', function(request, response) { 
    const message = req.body.Body
    console.log(message)
    parse(message)
        .then(response => {

        })
        .catch(error => {

        });
})

app.post('/parse', function(request, response) {
	var message = request.body.text
    console.log(message)
    parse(message)
        .then(result => {
        	response.json(result);
        })
        .catch(error => {

        });
})

function parse(message) {
    return new Promise(
        function(resolve, reject) {
            natural_language_classifier.classify({
                    text: message,
                    classifier_id: process.env.NLC_CLASSIFIER_ID
                },
                function(err, response) {
                	if (err) {
                		reject(err);
                	} else {
                		resolve(response.classes)
                	}
                });
        });
}

app.listen(8000, function(err) { 
    if (err) {  
        throw err 
    }
     
    console.log('Service started on port 8000')
})
