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

// get a github api client_id and client_secret
// can find them here: https://github.com/organizations/Kitchencooks/settings/applications/150833
var GITHUB_CLIENT_ID = "9fc53664e3f5cda07061";
var GITHUB_CLIENT_SECRET = "a6549bd7252dc4405d50f908a7c170f53ddaf0fa";

var routes = require('./routes/index');

var app = express();

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
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://hrr-kitchen.azurewebsites.net/auth/github/callback"
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

var webServer = app.listen('3000');

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);

module.exports = app;
