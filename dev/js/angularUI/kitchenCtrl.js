window.userName = 'Loading';

// var fbHangouts = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/hangouts');
// if so then provide the user with the hangout url

var appControllers = angular.module('appControllers', ['ngCookies', 'firebase']);


//this controller handles the kitchen view and designates which seats are available
//It uses functions stored in tableHelpers.js
appControllers.controller('kitchenCtrl', ['$scope', '$cookies', '$firebase', 'TableHelpers',
  function ($scope, $cookies, $firebase, TableHelpers) {

    var user  = {};
    if ($cookies.user) {
      window.userName = $cookies.user;
    } else {
      window.userName = "Anonymous";
    }

    $scope.satDown = false;
    $scope.currentSeat = "standing";
    $scope.currentURL = "No current hangout url";
    // $scope.seats = {};
    // $scope.seats.array = [];
    $scope.hangouts = {};
    $scope.example = [1,2,3,4,5];

    // Services
    $scope.handleClick = TableHelpers.handleClick;
    $scope.clearRoom = function(){
      $scope.seats = TableHelpers.clearRoom();
      // console.log('seating from callback', seating);
      // $scope.seats = seating;
    };
    // not in use
    // $scope.viewThumbs = viewThumbVideos;

    $scope.doClick = function(seat, $event) {
      $scope.handleClick(seat, $event, $scope);
    };

    var ref = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/seating');
    var sync = $firebase(ref);

    // if ref points to a data collection
    $scope.seats = sync.$asArray();
    console.log('seats', $scope.seats);

    // if ref points to a single record
    // $scope.rec = sync.$asObject();


    // Gets the inital values from Firebase and updates the local seating data
    // fbSeating.once("value", function(snapshot) {
    //   $scope.$apply(function(){
    //     var seats = snapshot.val();
    //     $scope.seats.array = [];
    //     console.log('seats on value', seats);
    //     for (var i = 0, l = Object.keys(seats).length; i < l; i++){
    //       $scope.seats.array[i] = seats['table' + (i + 1)];
    //     }
    //     console.log('seats as array', $scope.seats.array);
    //     // // $scope.seats = snapshot.val();
    //     // console.log('fbSeating on value', $scope.seats);
    //     // fbSeating.set($scope.seats);
    //   });
    // });



    // //Updates the hangout urls- currently not used as the app now uses appear.in instead of google hangouts
    // fbHangouts.on("value", function(snapshot) {

    //   // $scope.$apply(function(){
    //     $scope.hangouts = snapshot.val();
    //   // });

    // });

    

    

  }]

);

