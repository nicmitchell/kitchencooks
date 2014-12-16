var express        = require('express'),
    path           = require('path'),
    logger         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    http           = require("http");                     // http server core modul,
    io             = require("socket.io");                // web socket external modul,
    easyrtc        = require("easyrtc");                  // EasyRTC external modul,
    methodOverride = require('method-override');          // method-override core modul,
    passport       = require('passport');                 // passport core module for authenticatio,
    GitHubStrategy = require('passport-github').Strategy; // passport-github module for authenticatio,
    session        = require('express-session');          // express-session for session saving

if(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET){
  var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  console.log('Using Github ENV vars');
} else {
  var githubKeys = require('./github-keys');
  var GITHUB_CLIENT_ID = githubKeys.client.clientId;
  var GITHUB_CLIENT_SECRET = githubKeys.client.clientSecret;
  console.log('Using github-keys module');
}


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

// app.use('/', routes);

// GitHub config, this callback should match callback in api
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID, // githubKeys.client.clientId,
    clientSecret:  GITHUB_CLIENT_SECRET, // githubKeys.client.clientSecret,
    callbackURL: "/auth/github/callback"
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
  if (req.user) {
    console.log(req.user);
    res.render('index', { user: req.user, title: 'Kitchen' });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res){
  res.render('login');
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
    console.log('Callback: ', req.user);
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
