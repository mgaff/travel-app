var request = require('superagent');
var Dest    = require('../models/destination');

var Venue = require('../models/venue');
var User = require('../models/user');
var Group = require('../models/group');

var venues = require("../../../mock-data/venues.json");
var dests = require("../../../mock-data/destinations.json");

var venue = venues.Results;
var oldDest = dests.Results;

function loadDests(){

function StupidJSHint(err, dest){
  if (err) console.log(err);
}

  request.get('http://api.tripexpert.com/v1/destinations?api_key=5d8756782b4f32d2004e811695ced8b6')
       .end(function (err, res) {
          if (err){
            console.log(err);
            return;
          }
          var text = JSON.parse(res.text);
          list = text.response.destinations;
          for (var i = 0; i < list.length; i++){
            Dest.findOrCreate({id: list[i].id}, {perm: list[i].permalink, destId: list[i].id}, StupidJSHint);
          }
       });
}

 loadDests();


module.exports = {

  getDestination: function (req, res, next){
    for (var x = 0; x < oldDest.length; x++){
      if (oldDest[x].permalink === req.query.name){
        return res.status(200).send(oldDest[x]);
      }
    }
    res.status(404).send();
  },

  getVenues: function (req, res, next){
    var permalink = req.query.permalink;
    console.log(permalink);
    Dest.findOne({perm: permalink}, function (err, dest) {
      if (err){
        console.log(err);
        return res.status(500).send();
      }

      if (!dest){
        return res.status(400).send();
      }
      request.get('http://api.tripexpert.com/v1/venues?')
         .query({
          destination_id: dest.destId,
          api_key: '5d8756782b4f32d2004e811695ced8b6'
        })
         .end(function (err, response) {
            if (err){
              console.log(err);
              return res.status(500).send();
            }
            var text = JSON.parse(response.text);
            return res.status(200).send(text.response.venues);
         });
    });
  }
};
