angular.module('kitchenApp.services', [])

.factory('TableHelpers', function($firebase){
  var startOrJoinVideo = function(seat, table, $scope){

    // var table = $scope.hangouts[seat.tableNumber];
    // var table = $scope.seats[seat.tableNumber];

    console.log('scope.seats',$scope.seats);

    //This funcitons is in videoConderence/videoFaces.js
    //It will generate a room based on the table number
    joinThumbVideos(table);

    // I don't think this is being used any more without appear.in
    // if (table.users === 0){

    //   table.users++;

    //   //modal alert box
    //   bootbox.alert("Creating a video group chat! Allow the kitchen app to access your camera.");
    //   $(".modal-backdrop").css("z-index", "0");

    //   //updates model and view with the new seating arrangment
    //   // $scope.$apply(function(){
    //     console.log('SEAT', seat, table);
    //     $scope.currentURL = table.url;
    //     $scope.currentSeat = seat.tableNumber + ' - ' + seat.seatNumber;
    //   // });

    //   //call function to start video and store link to it here
    //   //should probably be changed so that it is called when "OK" is clicked on the bootbox modal
    //   // window.open('https://appear.in/hrr-kitchen-'+ seat.tableNumber);

    //   //updates the firebase
    //   // fbHangouts.set($scope.hangouts);

    // }else{

      // window.open('https://appear.in/hrr-kitchen-'+ seat.tableNumber);

      //modal alert box
      bootbox.alert('Joining a video chat! Allow the kitchen app to access your camera.');
      $(".modal-backdrop").css("z-index", "0");

      //updates model and view with the new seating arrangment
      // $scope.$apply(function(){
        // $scope.currentURL = table.url;
        // $scope.currentSeat = seat.tableNumber + ' - ' + seat.seatNumber;
      // });

      // fbHangouts.set($scope.hangouts);

    // }

  };

  //This functions decides the outcome when a user clicks on a seat
  var handleClick = function(seat, table, $event, $scope) {
    console.log('handleClick seat', seat);
    // if($event){
    //     $event.preventDefault();
    // }
    // var seats = $scope.seats.$asObject();
    // console.log('seats on click', $scope.seats[0]);
    // console.log('seats on click', seats);
    
    var ref = new Firebase('https://hrr-kitchen-cooks.firebaseio.com/seating');
    var sync = $firebase(ref);

    // if ref points to a data collection
    // table = table.slice(-1);
    console.log('seats on click', $scope.seatsObj);
    console.log('table', table);
    // console.log('seats', $scope.seats.table);

    seat = $scope.seatsObj[table][seat];

    if (!$scope || !$scope.satDown){

      if (seat && !seat.taken){
        console.log('seat', seat);

        $scope.currentSeat = seat.seatNumber;

        // seat.name = userName;
        // seat.avatar = avatar || '';
        // seat.taken = true;
        $scope.satDown = true;

        fbSeating.child(table).child(seat.seatNumber).set({ taken: true, name: userName, avatar: avatar, seatNumber: seat.seatNumber, tableNumber: table });

        //calls above function
        startOrJoinVideo(seat, table, $scope);

      }else{
        //modal alert
        console.log('name', $scope.seatsObj[table]);
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

        var table = $scope.seats[seat.tableNumber];

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
  var clearRoom = function($scope){
    // console.log('scope in clear room', $scope.seats);
    

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
      },
      "table5" : {
        "users": 0,
        "message": 0,
        "url": 0
      },
      "table6" : {
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
        "tableNumber" : "table3"
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
        "tableNumber" : "table4"
      },
      "table5" : {
        "seat1" : {
          "name" : "empty",
          "seatNumber" : "seat1",
          "tableNumber" : "table5",
          "taken" : false
        },
        "seat2" : {
          "name" : "empty",
          "seatNumber" : "seat2",
          "tableNumber" : "table5",
          "taken" : false
        },
        "seat3" : {
          "name" : "empty",
          "seatNumber" : "seat3",
          "tableNumber" : "table5",
          "taken" : false
        },
        "seat4" : {
          "name" : "empty",
          "seatNumber" : "seat4",
          "tableNumber" : "table5",
          "taken" : false
        },
        "tableNumber" : "table5"
      },
      "table6" : {
        "seat1" : {
          "name" : "empty",
          "seatNumber" : "seat1",
          "tableNumber" : "table6",
          "taken" : false
        },
        "seat2" : {
          "name" : "empty",
          "seatNumber" : "seat2",
          "tableNumber" : "table6",
          "taken" : false
        },
        "seat3" : {
          "name" : "empty",
          "seatNumber" : "seat3",
          "tableNumber" : "table6",
          "taken" : false
        },
        "seat4" : {
          "name" : "empty",
          "seatNumber" : "seat4",
          "tableNumber" : "table6",
          "taken" : false
        },
        "tableNumber" : "table6"
      }
    };

    fbHangouts.set(hangouts);
    return fbSeating.set(seating, function($scope){
      console.log('room cleared');
      return seating;
    });
  };

  return {
    startOrJoinVideo: startOrJoinVideo,
    handleClick: handleClick,
    clearRoom: clearRoom
  };
})
.factory('topicsStorage', function(){
  var fbTopics = new Firebase('https://hrr-kitchen-cooks.firebaseio.com/topics');
  var fbTopic = new Firebase('https://hrr-kitchen-cooks.firebaseio.com/topic');

  // create an AngularFire reference to the data
  // var sync = $firebase(ref);

 // download the data into a local object
  // $scope.data = sync.$asObject();

  var topics = [
    {text: "Why do you hate CoffeeScript?"},
    {text: "Why do you love Angular?"}
  ];

  return {
    getTopics: function(){
      fbTopics.on('child_added', function(snapshot) {
        var topic = snapshot.val();
        topics.push(topic);
      });
      return topics;
    },
    addTopics: function(topic){
      fbTopics.push({text: topic});
      // topics.push(topic);
    },
    setTopic: function(topic){
      console.log('set topic', topic);
      fbTopic.set({topic: topic});
    },
    topic: function(){
      var currentTopic = '';
      return fbTopic.on('value', function(snapshot){
        currentTopic = snapshot.val() ? snapshot.val().topic : "Why is the mascot for Ember an ugly hamster?";
        console.log('topic',currentTopic);
        return currentTopic;
      });
    }
  };
});