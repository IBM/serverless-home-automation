/**
  *
  * main() will be invoked when you Run This Action.
  * 
  * @param OpenWhisk actions accept a single parameter,
  *        which must be a JSON object.
  *
  * In this case, the params variable will look like:
  *     { "message": "xxxx" }
  *
  * @return which must be a JSON object.
  *         It will be the output of this action.
  *
  */
var request = require('request');

function main(params) {
   var username = params.username
   var password = params.password
   var workspace_id = params.workspace_id
   var input_text = params.data
   var url = "https://gateway.watsonplatform.net/conversation/api/v1/workspaces/" + workspace_id + "/message?version=2017-04-21"
   var body = {"input": {"text": input_text}}
   return new Promise(function(resolve, reject) {
       request( {
           url: url,
           method: 'POST',
           auth: {
                   'user': username,
                   'pass': password
                 },
           headers: {
              "content-type": "application/json",
           },
           body: JSON.stringify({"input": {
                "text": input_text
                }})
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

