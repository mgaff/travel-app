var express = require('express');
var router = express.Router();

var groupController = require('../controllers/groupController');

//router.get('/', groupController.getUserGroups);
router.get('/', groupController.getGroups);

router.get('/users', groupController.getMembers);

router.get('/fav', groupController.getFavs);

router.get('/all', groupController.getInfo);

router.post('/', groupController.createGroup);

router.post('/set', groupController.setDest);

router.post('/add', groupController.addMember);

router.delete('/user', groupController.removeMember);

module.exports = router;

