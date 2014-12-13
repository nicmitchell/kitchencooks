var fb = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/');
var fbSeating = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/seating');
var fbChats = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/chats');
var fbHangouts = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/hangouts');

// var fbSeating = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/seating');

/* App Module */

var kitchenApp = angular.module('kitchenApp', [
  'ui.bootstrap',
  'ngRoute',
  'appControllers'
  ],

  function($interpolateProvider) {
    $interpolateProvider.startSymbol('{%');
    $interpolateProvider.endSymbol('%}');
  }
);

kitchenApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: '/partials/kitchenView.html',
        controller: 'kitchenCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
  }]);


easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
        var video = document.getElementById('caller');
        easyrtc.setVideoObjectSrc(video, stream);
    });

     easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
        easyrtc.setVideoObjectSrc(document.getElementById('caller'), "");
    });




var success = function(){
  console.log('initMediaStream success');
};

var failure = function(){
  console.log('initMediaStream failure');
};

// easyrtc.initMediaStream( success, failure, "timesSquareCamera");


var easyRTCInit = function() {
   easyrtc.setRoomOccupantListener(roomListener);
           var connectSuccess = function(myId) {
               console.log("My easyrtcid is " + myId);
           }
           var connectFailure = function(errorCode, errText) {
               console.log(errText);
           }
           easyrtc.initMediaSource(
                 function(){        // success callback
                     var selfVideo = document.getElementById("self");
                     easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                     easyrtc.connect("Company_Chat_Line", connectSuccess, connectFailure);
                 },
                 connectFailure,
                 "timesSquareCamera"
           );
 };

 var roomListener = function(roomName, otherPeers) {
  var otherClientDiv = document.getElementById('otherClients');
  while (otherClientDiv.hasChildNodes()) {
      otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
  for(var i in otherPeers) {
    var button = document.createElement('button');
    button.onclick = function(easyrtcid) {
        return function() {
            performCall(easyrtcid);
        };
    }(i);

    label = document.createTextNode(i);
    button.appendChild(label);
    otherClientDiv.appendChild(button);
  }
};

var performCall = function(easyrtcid) {
  easyrtc.call(
   easyrtcid,
   function(easyrtcid) { 
    console.log("completed call to " + easyrtcid);
  },
  function(errorMessage){ 
    console.log("err:" + errorMessage); 
  },
  function(accepted, bywho) {
      console.log((accepted?"accepted":"rejected")+ " by " + bywho);
   }
  );
};
var joinBallroom = function(){
  easyrtc.joinRoom("ballroom", null,
    function(roomName) {
         console.log("I'm now in room " + roomName);
    },
    function(errorCode, errorText, roomName) {
        console.log("had problems joining " + roomName);
  });
};