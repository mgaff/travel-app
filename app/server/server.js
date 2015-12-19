var bodyParser   = require('body-parser');
var express      = require('express');
var http         = require('http');
var path         = require('path');
var cookieParser = require('cookie-parser');
var passport     = require('passport');
var flash        = require('connect-flash');
var session      = require('express-session');
var MongoStore   = require('connect-mongo/es5')(session);
var mongoose     = require('mongoose'); 
var morgan       = require('morgan');
var cors         = require('cors');
<<<<<<< 576f4a4c6e0a67d85f74d4db7253cc7c443705d0
<<<<<<< 857d2558ab9150c299bc21862c76fc3bd4240642

=======
<<<<<<< 4d9e392f19819ac1e37fc962770ea2a9fd388350
=======
>>>>>>> (feat) switched over from mock data to trip expert
var MongoStore   = require('connect-mongo/es5')(session);
var mongoose     = require('mongoose');

<<<<<<< 576f4a4c6e0a67d85f74d4db7253cc7c443705d0
>>>>>>> (fix) committing minor changes before rebase
>>>>>>> (fix) committing minor changes before rebase
=======
>>>>>>> (feat) switched over from mock data to trip expert

// Server routers:
var index  = require(path.join(__dirname, 'routes/index'));
var dest   = require(path.join(__dirname, 'routes/dest'));
var group  = require(path.join(__dirname, 'routes/group'));
var fav    = require(path.join(__dirname, 'routes/fav'));
var rating = require(path.join(__dirname, 'routes/rating'));


var app = express();

// Log requests:
app.use(morgan('dev'));

//Client Route
app.use(express.static(path.join(__dirname, '../client')));


// App config:
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded:
app.use(bodyParser.urlencoded({ extended: false }));
// needed for auth
app.use(cookieParser());
// required for passport
app.use(session({
  secret: 'tripAppIsAmazing', 
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 3600000}}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
 // pass passport for configuration

// Server routing:
app.use('/api', index);
app.use('/api/dest', dest);
app.use('/api/group', group);
app.use('/api/fav', fav);
app.use('/api/rating', rating);
app.use(cors());

//Authentication Routing
app.post('/login', function (req, res, next) {
  passport.authenticate('local-login',
    function (err, user, info) {
        if (err || !user){
          res.status(200).send({message: info.message});
        } else {
          req.login(user, function (err){
            if (err) {
              console.log(err);
              res.status(500).send({message: err});
            } else {
              res.status(200).send({status: true, user: user});
            }
          });
        }
    }) (req, res, next);
});


app.post('/signup', function (req, res, next) {
  passport.authenticate('local-signup',
    function (err, user, info) {
      if (err || !user){
        res.status(200).send({message: info.message});
      } else {
        req.login(user, function (err){
          if (err) {
            console.log(err);
            res.status(500).send({message: err});
          } else {
            res.status(200).send({status: true, user: user});
          }
        });
      }
    }) (req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.status(200).send({msg: 'bye'});
});

app.get('/auth/google', passport.authenticate('google', { scope: [  'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read']}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/auth/facebook',
  passport.authenticate('facebook', {scope: ['email']}),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

 app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });
module.exports = app;
