var events = require('events');
var eventEmitter = new events.EventEmitter();
var User = require('../models/user');
var request = require('superagent');

// =========================================================================
// Loading User Favs=============================================================
// =========================================================================
// Purpose of this file is to pre-load all the venues currently in the user's
// favorites and all of his group favorites.  This could be many requests so it
// should get started as soon as a user logs in and not wait until the user wishes
// to see it.

var length;

function getUserFavInfo(userId) {
  console.log("emit me ", userId)
};

function getGroupFavInfo(userId) {
  console.log("in group fav emitter ", userId)
};

eventEmitter.addListener('getFavInfo', getUserFavInfo);

module.exports = eventEmitter;

