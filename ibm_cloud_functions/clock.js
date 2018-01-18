/**
  *
  * main() will be invoked when you Run This Action.
  *
  * @param Cloud Functions actions accept a single parameter,
  *        which must be a JSON object.
  *
  * In this case, the params variable will look like:
  *     { "message": "xxxx" }
  *
  * @return which must be a JSON object.
  *         It will be the output of this action.
  *
  */

// Beforehand run both
// wsk trigger create timer
// wsk trigger create alarm
function main(params) {
  return new Promise(function(resolve, reject) {

    var openwhisk = require('openwhisk');
    const options = {apihost: 'openwhisk.ng.bluemix.net', api_key: '<redacted>'};
    const ow = openwhisk(options);

    // expecting following in params
    // params['sys-time'] = "00:05:00"
    // params['sys-date'] = "2017-11-13" 
    // params['type'] = "timer" // (optional, used to tell difference between 5 minute timer and alarm at 5:00 am, both read as 05:00:00)
    // # ┌───────────── minute (0 - 59)
    // # │ ┌───────────── hour (0 - 23)
    // # │ │ ┌───────────── day of month (1 - 31)
    // # │ │ │ ┌───────────── month (0 - 11)
    // # │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
    // # │ │ │ │ │
    // # │ │ │ │ │
    // # 0 0 1 0 *
    // first value is optional, references seconds
    // */20 * * * * * // every 20 seconds

    // var params = {'sys-time': '00:00:05', 'sys-date': '2017-11-13', 'clock': 'timer'} // 5 second timer, for testing
    var time = inputParams['sys-time'].split(':')
    var date = inputParams['sys-date'].split('-')

    var zero = function(num) {
        return ((Boolean(Number(num))) ? ("*/" + Number(num)) : "*")
    }

    var genCron = function() {
        if (params.clock.includes("timer")) {
            var cron = (Boolean(Number(time[2])) ? (zero(time[2])) : "") + " " + zero(time[1]) + " " + zero(time[0]) + " " + "* * *"
        }
        else if (params.clock.includes("alarm")) {
            var cron = time[1] + " " + time[0] + " " + date[2] + " " + date[1] + " " + "* *"
        }
        return cron
    }

    // ow.actions.invoke({actionName: params.intents[0]['intent'], params: {entites: "params.entities"}}).then(
    //     console.log("alarm set")
    // )
    //var feedParams = {cron: genCron(), maxTriggers: 1, trigger_payload: {message: params['type'] + " set for " + params['sys-time'] }}

    var feedParams = {
        cron: genCron(),
        trigger_payload: {message: params['clock'] + " set for " + params['sys-time'] },
        maxTriggers: 1
    }
    var name = '/whisk.system/alarms/alarm'
    var trigger = params.clock + '_' + time.join("") + '_' + date.join("")
    ow.triggers.create({name:  trigger, params: {maxTriggers: 1 }})
    ow.feeds.create({name, trigger, params: feedParams }).then(package => {
      console.log('alarm trigger feed created', package)
      return {"payload": "alarm for " + JSON.stringify(params) + " set"}
    }).catch(err => {
      console.error('failed to create alarm trigger', err)
    })

    // ow.triggers.create({
    //     name: "alarm1",
    //     feed: "/whisk.system/alarms/alarm"
    // })


    // return Promise.all(actions).then(function (results) {
    //     console.log(results);
    //     return resolve({payload: "All OK"});
    // });
  });
}
