//
//Copyright (c) 2016, Skedans Systems, Inc.
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
//LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//POSSIBILITY OF SUCH DAMAGE.
//
var selfEasyrtcid = "";

function connect() {

    easyrtc.setUsername("robot-one");
    //easyrtc.enableDataChannels(true);
    //easyrtc.setDataChannelOpenListener(openListener);
    //easyrtc.setDataChannelCloseListener(closeListener);
    easyrtc.setVideoDims(1280,720);
    easyrtc.enableDebug(false);
    //easyrtc.setPeerListener(addToConversation);
    easyrtc.setRoomOccupantListener(convertListToButtons);
    easyrtc.easyApp("easyrtc.videoChatHd", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);

}

function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    content = content.replace(/\n/g, '<br />');
    console.log(who + " - " + content);
}

function convertListToButtons (roomName, data, isPrimary) {
    //var otherClientDiv = document.getElementById('otherClients');
    for(var easyrtcid in data) {
      console.log(easyrtc.idToName(easyrtcid));
      return function () {
        performCall(easyrtcid);
      };

        //button = document.getElementById('btnStart');

        //button.style.visibility = "visible";
        //button = document.createElement('button');
        //button.innerHTML = "Start";
        // button.onc=lick = function(easyrtcid) {
        //
        //   // return function() {
        //   //   performCall(easyrtcid);
        //   // };
        //
        //   if(button.innerHTML == 'Start'){
        //     return function() {
        //         performCall(easyrtcid);
        //     };
        //   }else {
        //      endCall();
        //      button.innerHTML = 'Start';
        //    }
        // }(easyrtcid);
        // var label = document.createTextNode(easyrtc.idToName(easyrtcid));
        // button.appendChild(label);
        //button.className = "callButton";
        //otherClientDiv.appendChild(button);
    }
}


function performCall(otherEasyrtcid) {
    easyrtc.hangupAll();
    var acceptedCB = function(accepted, caller) {
        if( !accepted ) {
            easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(caller) + " was rejected");
        }
    };
    //button.innerHTML.value = 'endCall';
    //button.innerHTML = 'End';
    //button.className = "endButton";
    var successCB = function() {};
    var failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
}


function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    //document.getElementById("iam").innerHTML = "Connection Successful</b>";
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

function endCall() {

  console.log('END');
  location.href='dashBoard.html';
    easyrtc.hangupAll();
    // button.innerHTML = 'Start';
    // button.className = "startButton";
}

// Sets calls so they are automatically accepted (this is default behaviour)
easyrtc.setAcceptChecker(function(caller, cb) {
    cb(true);
} );

// easyrtc.setDisconnectListener(function(){
//     console.log("Disconnected");
//     window.history.back();
// });
