// when a seat is selected check if any other seats at table are occupied (and check if seat is occupied)

// if not then prompt the user to enter a hangouts url

// if so then provide the user with the hangout url
// $( document ).ready(function() {

var fb = new Firebase('https://kitchen-cooks.firebaseio.com/');

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
