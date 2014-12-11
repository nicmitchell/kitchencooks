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

