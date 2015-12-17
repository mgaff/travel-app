var User   = require('../models/user');
var Venue  = require('../models/venue');
var Group  = require('../models/group');
var Rating = require('../models/rating');

// Mock Data Load
var venues = require("../../../mock-data/venues.json");
var venue  = venues.Results;

module.exports = {
  
  createGroup: function(req, res, next){

    //console.log(req.body);

    var title  = req.body.groupName;
    var dest   = req.body.destination;
    var userId = req.body.userId;

    User.findById(userId._id, function (err, user) {
      console.log(user);
      if (err){
        console.log(err);
        return res.status(500).send();
      }

      var newGroup = new Group({
        title: title,
        destination: dest,
        host: user
      });

      newGroup.members.push(user);
      newGroup.save(function (err, group){
        if (err) { 
          console.log(err);
          return res.status(500).send();
        }
      });

      user.groupId.push(newGroup);
      user.save();
      res.status(200).send(newGroup);
    });
  },

  getGroupByTitle: function(req, res, next){ //account for two groups with same name but with different hosts
    Group.findOne({title: title}, function (err, group){
      if (err){
        console.log(err);
        return res.status(500).send();
      }
      res.status(200).send(group);
    });
  },

  setDest: function(req, res, next){
    var dest    = req.body.dest;
    var groupId = req.body.groupId;

    Group.findById(groupId, function (err, group){
      if (err) {
        console.log(err);
        return res.status(500).send();
      }

      group.destination = dest;
      group.save();
      res.status(200).send(group);
    });
  },

  addMember: function(req, res, next){ //username, groupId
    //Member may or may not already be in User - for that reason we need a username to
    //either match or create a new User with. After that we can add user to group and group to user
    var groupId = req.body.groupId;

    User.find({username: req.body.username}, function (err, user){
      if (err){
        console.log(err);
        return res.status(500).send();
      }
        Group.findById(groupId, function (err, group){
          if (err) {
            console.log(err);
            return res.status(500).send();
          }
          if (user){ //user already signed up
            group.members.push(user);
            user.groupId.push(group);
            return res.status(200).send(group);
          
          } else { //create new user  TODO send email here as well

          var newUser = new User ({
            username: req.body.username
          });

          newUser.groupId.push(group);
          newUser.save(function (err, user){
            if (err) { 
              console.log(err);
              return res.status(500).send();
            }
          });
  
          group.members.push(newUser);
          group.save();
          return res.status(200).send(group);
        }
      });
    });   
  },

  removeMember: function(req, res, next){
    var userId = req.query.userId;
    var groupId = req.query.groupId;

    Group.update({_id: groupId}, {$pull : {members: userId}}, function(err, group){
      if (err){
        console.log(err);
      }
      res.status(200).send(group);
    });
    //TODO: also remove user ratings
  },

  getMembers: function(req, res, next){
    var groupId = req.query.groupId;

    Group.findById(groupId, function(err, group){
      if (err){
        console.log(err);
        return res.status(500).send();
      }   

      return res.status(200).send(group.members);
    });

  },

  getFavs: function (req, res, next){
    var groupId = req.params.groupId;

    Group.findById(groupId, function(err, group){
      if (err){
        console.log(err);
        return res.status(500).send();
      }
      // TODO populate and add ratings.
      return res.status(200).send(group.favorites);
    });
  },

  getGroups: function (req, res, next){
    console.log("in get groups ", req.query);
    var userId = req.query.userId;

    User.findById(userId, function (err, user){
      if (err){
        console.log(err);
        res.status(500).send();
      }

      if (user){
        res.status(200).send(user.groupId);
      } else {
        res.status(200).send();
      }
    });
  },

  getInfo: function(title){
    var groupId = req.query.groupId;

    Group.findById(groupId)
    .populate('favorites')
    .populate('members')
    .lean() // returns plain JS object
    .exec(function (err, group){
      var groupId = group._id;
      
      (function(){ // the following is done for synchronous purposes
        var index = 0;

        function assignRatings(){
          if (index < group.favorites.length){
            venueId = group.favorites[index]._id;

            Rating.findOne({venue: venueId, group: groupId}, function (err, rating){
              if (rating) {
                group.favorites[index].ratings = rating.ratings;
              }
              index++;
              assignRatings();
            });
          } else{
            return res.status(200).send(group);
          }
        }
        assignRatings();
      })();
    });
  }
};

