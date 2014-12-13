var express = require('express');
var router = express.Router();

//DOM element that renders chat form
var chat = "<div class = 'chat-div'><div class='chat'></div><input type='text' id='nameInput' placeholder='Name'><input type='text' id='messageInput' placeholder='Message'></div>";
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Kitchen', chat: chat, user: req.session.passport.user });
});

module.exports = router;


  // if (user: req.session.passport.user) {
  //     res.render('index', { title: 'Kitchen', chat: chat, user: req.session.passport.user, avatar: req.session.passport.user._json.avatar_url });
  // } else {
  //   res.render('index', { title: 'Kitchen', chat: chat, user: req.session.passport.user);
  // }
  