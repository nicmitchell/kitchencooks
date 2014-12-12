// when a seat is selected check if any other seats at table are occupied (and check if seat is occupied)

// if not then prompt the user to enter a hangouts url

// if so then provide the user with the hangout url
// $( document ).ready(function() {

var fb = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/');

var seating = fb.child("seating");

var seatClick = function(seatInfo){

  var name = 'Rory';
  var table = seatInfo.table;
  var seat = seatInfo.seat;

  var clickedSeat = seating.child(table).child(seat);

  clickedSeat.set({taken: true, name: name});

  //seating.set(seatInfo);
};




// });

// This file controls the thumb videos
// It currently only shows users who are sat at the same table
// It should be factored so that anyone can view the thumbs (possibly by clicking the table)

var activeBox = -1;  // nothing selected
var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS+1;
var layout;


easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
    return "box" + boxNum;
}

//join the thumb videos and view others
function callEverybodyElse(roomName, otherPeople) {

    console.log('otherPeople', otherPeople);
    console.log('roomName', roomName);

    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    for(var easyrtcid in otherPeople ) {
        list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
        function callSuccess() {
            connectCount++;
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        easyrtc.call(list[position], callSuccess, callFailure);

    }
    if( list.length > 0) {
        establishConnection(list.length-1);
    }
}


function loginSuccess() {
    //expandThumb(0);  // expand the mirror image initially.
    console.log('Login Success')
}

var boxUsed = [true, false, false, false];
var connectCount = 0;

function joinThumbVideos(table) {

    easyrtc.joinRoom(table, null, null, null);


    easyrtc.enableAudio(false);

    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], loginSuccess); //sets up multiparty video links
    easyrtc.setDisconnectListener( function() {
    easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        boxUsed[slot+1] = true;

        document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
    });


    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;

        setTimeout(function() {
            document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";
        },20);
    });
}

//  Currently unfinished functions (mostly a copy of joinThumbVideos)
//  When complete it should show video thumbs without adding the user to the thumbs
function viewThumbVideos (table) {

    maxCALLERS ++;
    numVideoOBJS = maxCALLERS+1;


    easyrtc.joinRoom(table, null, null, null);


    easyrtc.enableVideo(false);

    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], loginSuccess);
    easyrtc.setDisconnectListener( function() {
    easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        boxUsed[slot+1] = true;

        document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
    });


    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;

        setTimeout(function() {
            document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";
        },20);
    });
}


var fbChats = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/chats');

var appControllers = angular.module('appControllers');

//this controller handles the chat view
appControllers.controller('chatCtrl', ['$scope', '$cookies',
  function ($scope, $cookies) {

  var user  = {};
  if ($cookies.user) {

    user.name = $cookies.user;
  } else {
    user.name = "Anonymous";
  }

  //collects input from user, sends it to firebase server
  $('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      var text = $('#messageInput').val();
      fbChats.push({name: user.name, text: text});
      $('#messageInput').val('');
    }
  });

  //collects any firebase data that is added
  fbChats.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
  });

  //jquery function to append dom elements to page
  function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<strong/>').text(name+': ')).appendTo($('.chat'));
    $('.chat')[0].scrollTop = $('.chat')[0].scrollHeight;
  }

  }]

);


window.userName = 'Loading';

var fbHangouts = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/hangouts');
// if so then provide the user with the hangout url

var appControllers = angular.module('appControllers', ['ngCookies']);


//this controller handles the kitchen view and designates which seats are available
//It uses functions stored in tableHelpers.js
appControllers.controller('kitchenCtrl', ['$scope', '$cookies',
  function ($scope, $cookies) {

    var user  = {};
    if ($cookies.user) {
      window.userName = $cookies.user;
    } else {
      window.userName = "Anonymous";
    }

    $scope.satDown = false;
    $scope.currentSeat = "standing";
    $scope.currentURL = "No current hangout url";

    $scope.seats = {};
    $scope.hangouts = {};

    //Updates the local seating data when the firebase updates
    fbSeating.on("value", function(snapshot) {
      $scope.$apply(function(){
        $scope.seats = snapshot.val();
      });
    });


    //Updates the hangout urls- currently not used as the app now uses appear.in instead of google hangouts
    fbHangouts.on("value", function(snapshot) {

      $scope.$apply(function(){
        $scope.hangouts = snapshot.val();
      });

    });

    $scope.viewThumbs = viewThumbVideos;

    $scope.doClick = function(seat, $event) {
      handleClick(seat, $event, $scope);
    };

    $scope.clearRoom = clearRoom;

  }]

);


var fbSeating = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/seating');

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




//This function decides the outcome when a user "sits down"
var startOrJoinVideo = function(seat, $scope){

  var table = $scope.hangouts[seat.tableNumber];

  //This funcitons is in videoConderence/videoFaces.js
  //It will generate a
  joinThumbVideos(seat.tableNumber);

  if (table.users === 0){

    table.users++;

    //modal alert box
    bootbox.alert("Creating a video group chat! Allow the kitchen app to access your camera.");
    $(".modal-backdrop").css("z-index", "0");

    //updates model and view with the new seating arrangment
    $scope.$apply(function(){
      console.log('SEAT', seat, table);
      $scope.currentURL = table.url;
      $scope.currentSeat = seat.tableNumber + ' - ' + seat.seatNumber;
    });

    //call function to start video and store link to it here
    //should probably be changed so that it is called when "OK" is clicked on the bootbox modal
    window.open('https://appear.in/hrr-kitchen-'+ seat.tableNumber);

    //updates the firebase
    fbHangouts.set($scope.hangouts);

  }else{

    window.open('https://appear.in/hrr-kitchen-'+ seat.tableNumber);

    //modal alert box
    bootbox.alert('Joining a video chat! Allow the kitchen app to access your camera.');
    $(".modal-backdrop").css("z-index", "0");

    //updates model and view with the new seating arrangment
    $scope.$apply(function(){
      $scope.currentURL = table.url;
      $scope.currentSeat = seat.tableNumber + ' - ' + seat.seatNumber;
    });

    fbHangouts.set($scope.hangouts);

  }

};

//This functions decides the outcome when a user clicks on a seat
var handleClick = function(seat, $event, $scope) {

  $event.preventDefault();

  if (!$scope.satDown){

    if (!seat.taken){

      $scope.currentSeat = seat.seatNumber;

      seat.name = userName;
      seat.taken = true;
      $scope.satDown = true;

      fbSeating.set($scope.seats);

      //calls above function
      startOrJoinVideo(seat, $scope);

    }else{

      //modal alert
      bootbox.alert("Seat already occupied");
      $(".modal-backdrop").css("z-index", "0");

    }

  }else{

    if (seat.name === userName){

      seat.name = 'empty';
      seat.taken = false;
      $scope.satDown = false;

      $scope.currentSeat = "standing";
      $scope.currentURL = "No current hangout url";

      //updates firebase
      fbSeating.set($scope.seats);

      var table = $scope.hangouts[seat.tableNumber];

      table.users--;

      $scope.currentSeat = 'Standing';

    }else{
      //modal alert
      bootbox.alert("You're already sat down");
      $(".modal-backdrop").css("z-index", "0");

    }
  }
};

// This function clears the seats of all users by setting the firebase database to all empty seats
// It is called when the clear room button is clicked
// It has been implemented to aid development but probably should not be included in the final product
var clearRoom = function(){

  var hangouts = {
    "table1" : {
      "users": 0,
      "message": 0,
      "url": 0
    },
    "table2" : {
      "users": 0,
      "message": 0,
      "url": 0
    },
    "table3" : {
      "users": 0,
      "message": 0,
      "url": 0
    },
    "table4" : {
      "users": 0,
      "message": 0,
      "url": 0
    }
  };

  var seating = {
    "table1" : {
      "seat1" : {
        "name" : "empty",
        "seatNumber" : "seat1",
        "tableNumber" : "table1",
        "taken" : false
      },
      "seat2" : {
        "name" : "empty",
        "seatNumber" : "seat2",
        "tableNumber" : "table1",
        "taken" : false
      },
      "seat3" : {
        "name" : "empty",
        "seatNumber" : "seat3",
        "tableNumber" : "table1",
        "taken" : false
      },
      "seat4" : {
        "name" : "empty",
        "seatNumber" : "seat4",
        "tableNumber" : "table1",
        "taken" : false
      },
      "tableNumber" : "table1"
    },
    "table2" : {
      "seat1" : {
        "name" : "empty",
        "seatNumber" : "seat1",
        "tableNumber" : "table2",
        "taken" : false
      },
      "seat2" : {
        "name" : "empty",
        "seatNumber" : "seat2",
        "tableNumber" : "table2",
        "taken" : false
      },
      "seat3" : {
        "name" : "empty",
        "seatNumber" : "seat3",
        "tableNumber" : "table2",
        "taken" : false
      },
      "seat4" : {
        "name" : "empty",
        "seatNumber" : "seat4",
        "tableNumber" : "table2",
        "taken" : false
      },
      "tableNumber" : "table2"
    },
    "table3" : {
      "seat1" : {
        "name" : "empty",
        "seatNumber" : "seat1",
        "tableNumber" : "table3",
        "taken" : false
      },
      "seat2" : {
        "name" : "empty",
        "seatNumber" : "seat2",
        "tableNumber" : "table3",
        "taken" : false
      },
      "seat3" : {
        "name" : "empty",
        "seatNumber" : "seat3",
        "tableNumber" : "table3",
        "taken" : false
      },
      "seat4" : {
        "name" : "empty",
        "seatNumber" : "seat4",
        "tableNumber" : "table3",
        "taken" : false
      },
      "tableNumber" : "table2"
    },
    "table4" : {
      "seat1" : {
        "name" : "empty",
        "seatNumber" : "seat1",
        "tableNumber" : "table4",
        "taken" : false
      },
      "seat2" : {
        "name" : "empty",
        "seatNumber" : "seat2",
        "tableNumber" : "table4",
        "taken" : false
      },
      "seat3" : {
        "name" : "empty",
        "seatNumber" : "seat3",
        "tableNumber" : "table4",
        "taken" : false
      },
      "seat4" : {
        "name" : "empty",
        "seatNumber" : "seat4",
        "tableNumber" : "table4",
        "taken" : false
      },
      "tableNumber" : "table2"
    }
  };

  fbHangouts.set(hangouts);
  fbSeating.set(seating);
};
