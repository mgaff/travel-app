var request = require('superagent');
var Dest    = require('../models/destination');

request.get('http://api.tripexpert.com/v1/destinations?api_key=5d8756782b4f32d2004e811695ced8b')
       .end(function (err, res) {
          if (err){
            console.log(err);
            return;
          }
          console.log(results.destinations);
       })();

module.exports = dests;