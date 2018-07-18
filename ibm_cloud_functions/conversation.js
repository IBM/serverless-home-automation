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
   var iamApiKey  = params.iamApiKey
   var workspace_id = params.workspace_id
   var auth = {"user": username,"pass":password}
   var url = "https://gateway.watsonplatform.net/assistant/api/v1/workspaces/" + workspace_id + "/message?version=2018-07-10"
   if(iamApiKey){
    auth = {"user": "apikey","pass":iamApiKey}
    url = "https://gateway-wdc.watsonplatform.net/assistant/api/v1/workspaces/" + workspace_id + "/message?version=2018-07-10"
   }   
   var input_text = params.data
   var body = {"input": {"text": input_text}}
   return new Promise(function(resolve, reject) {
       request( {
           url: url,
           method: 'POST',
           auth: auth,
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

