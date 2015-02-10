window.userName = 'Loading';

// var fbHangouts = new Firebase('https://hrr-kitchen-cooks.firebaseio.com/hangouts');
// if so then provide the user with the hangout url

var appControllers = angular.module('appControllers', ['ngCookies', 'firebase']);


//this controller handles the kitchen view and designates which seats are available
//It uses functions stored in tableHelpers.js
appControllers.controller('kitchenCtrl', ['$scope', '$cookies', '$firebase', 'TableHelpers',
  function ($scope, $cookies, $firebase, TableHelpers) {

    var user  = {};
    var ref = new Firebase('https://hrr-kitchen-cooks.firebaseio.com/seating');
    var sync = $firebase(ref);

    // if ref points to a data collection
    $scope.seats = sync.$asArray();
    $scope.seatsObj = sync.$asObject();
    console.log('seats', $scope.seats);

    if ($cookies.user) {
      window.userName = $cookies.user;
    } else {
      window.userName = "Anonymous";
    }

    $scope.satDown = false;
    $scope.currentSeat = "standing";
    $scope.hangouts = {};
    $scope.example = [1,2,3,4,5];

    // Services
    $scope.handleClick = TableHelpers.handleClick;
    $scope.clearRoom = function(){
      $scope.seats = TableHelpers.clearRoom();
      // console.log('seating from callback', seating);
      // $scope.seats = seating;
    };

    $scope.doClick = function(seat, table, $event) {
      $scope.handleClick(seat, table, $event, $scope);
    };

  }]

);
