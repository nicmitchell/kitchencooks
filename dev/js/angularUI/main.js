var fb = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/');
var fbSeating = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/seating');
var fbChats = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/chats');
var fbHangouts = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/hangouts');

// var fbSeating = new Firebase('https://hrr-kitchen-legacy.firebaseio.com/seating');

/* App Module */

var kitchenApp = angular.module('kitchenApp', [
  'ui.bootstrap',
  'ngRoute',
  'appControllers',
  'kitchenApp.services'
  ],
  function($interpolateProvider) {
    $interpolateProvider.startSymbol('{%');
    $interpolateProvider.endSymbol('%}');
  }
)
.config(['$routeProvider',
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