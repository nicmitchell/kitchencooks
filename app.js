var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http    = require("http");              // http server core module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module
var methodOverride = require('method-override'); // method-override core module
var passport = require('passport'); // passport core module for authentication
var GitHubStrategy = require('passport-github').Strategy; // passport-github module for authentication
var session = require('express-session'); // express-session for session saving
var githubKeys = require('./github-keys');

console.log('key', githubKeys.githubKeys.clientId);

// // get a github api client_id and client_secret
// var GITHUB_CLIENT_ID = "3e2385be8d385086dcba";
// var GITHUB_CLIENT_SECRET = "b5f2a464b6331642a30375e0f917603fd6ef1019";

var routes = require('./routes/index');

var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  secret: 'secret HRR Kitchen k00ks App',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

// GitHub config, this callback should match callback in api
passport.use(new GitHubStrategy({
    clientID: githubKeys.githubKeys.clientId, //GITHUB_CLIENT_ID,
    clientSecret: githubKeys.githubKeys.clientSecret, //GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// serialize and deserialize the user
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication,
    // so this function will not be called.
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    console.log('req.session.passport.user: ', req.user);
     res.cookie('user', req.user.displayName);
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var webServer = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + webServer.address().port);
});

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);


// module.exports = app;
