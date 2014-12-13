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
    // $scope.$apply(function(){
      console.log('SEAT', seat, table);
      $scope.currentURL = table.url;
      $scope.currentSeat = seat.tableNumber + ' - ' + seat.seatNumber;
    // });

    //call function to start video and store link to it here
    //should probably be changed so that it is called when "OK" is clicked on the bootbox modal
    // window.open('https://appear.in/hrr-kitchen-'+ seat.tableNumber);

    //updates the firebase
    fbHangouts.set($scope.hangouts);

  }else{

    // window.open('https://appear.in/hrr-kitchen-'+ seat.tableNumber);

    //modal alert box
    bootbox.alert('Joining a video chat! Allow the kitchen app to access your camera.');
    $(".modal-backdrop").css("z-index", "0");

    //updates model and view with the new seating arrangment
    // $scope.$apply(function(){
      $scope.currentURL = table.url;
      $scope.currentSeat = seat.tableNumber + ' - ' + seat.seatNumber;
    // });

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
  fbSeating.set(seating);
};
