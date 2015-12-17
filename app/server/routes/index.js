var express = require('express');
var path = require('path');

var indexController = require(path.join(__dirname, '../controllers/indexController'));


var router = express.Router();

/* GET home page. */
router.get('/', indexController.getIndex);

router.get('/check', indexController.isLoggedIn);

router.get('/info', indexController.getInfo);

router.get('/favs', indexController.getFavs);



module.exports = router;
