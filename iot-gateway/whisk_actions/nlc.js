var request = require('request');

function main(params) {
   var username = params.username
   var password = params.password
   var classifier_id = params.classifier_id
   var input_text = params.data
 
   var url = "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/" + classifier_id + "/classify"


   return new Promise(function(resolve, reject) {
       request.get( {
           'url': url,
           'auth': {
                   'user': username,
                   'pass': password
                 },
            'qs': {
              "text": input_text}
         },
           function(error, response, body) {
           if (error) {
               reject(error);
           }
           else {
               var output = JSON.parse(body)
               resolve({msg: output});
           }
       });
   }
   );
  
}

