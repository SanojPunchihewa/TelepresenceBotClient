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
var channelIsActive = {}; // tracks which channels are active
var button;

function connect() {
    easyrtc.setUsername("sanoj95");
    easyrtc.setVideoDims();
    easyrtc.enableDebug(false);
    easyrtc.enableDataChannels(true);
    easyrtc.setDataChannelOpenListener(openListener);
    easyrtc.setDataChannelCloseListener(closeListener);
    easyrtc.setPeerListener(addToConversation);
    easyrtc.setRoomOccupantListener(convertListToButtons);
    easyrtc.easyApp("easyrtc.videoChatHd", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);

}

function addToConversation(who, msgType, content) {
  // Escape html special characters, then add linefeeds.
  content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  content = content.replace(/\n/g, '<br />');
  who = easyrtc.idToName(who)
  console.log(who + " - " + content)
}


function openListener(otherParty) {
    channelIsActive[otherParty] = true;
    //updateButtonState(otherParty);
}


function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
    //updateButtonState(otherParty);
}

function convertListToButtons (roomName, data, isPrimary) {

    for(var easyrtcid in data) {

        if(easyrtc.idToName(easyrtcid) == "robot-one"){
          console.log(easyrtc.idToName(easyrtcid));

          button = document.getElementById('btnStart');
          button.className = "callButton";
          button.disabled = false;

          button.onclick = function(easyrtcid) {
              return function() {
                  if(button.innerHTML == "Start"){
                      performCall(easyrtcid);
                  }
              };
          }(easyrtcid);

          var buttonSendData = document.getElementById('btnSendMsg');

          buttonSendData.onclick = function(easyrtcid) {
              return function() {
                  sendStuffP2P(easyrtcid);
              };
          }(easyrtcid);
        }

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

    var successCB = function(caller, media) {
        button.innerHTML = 'End';
        button.className = "endButton";
        if (media === 'datachannel') {
          console.log("Data Channel succesful");
        }
    };
    var failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
}

function sendStuffP2P(otherEasyrtcid) {
    var text = document.getElementById('sendMessageText').value;
    if (text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }
    if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
        easyrtc.sendDataP2P(otherEasyrtcid, 'msg', text);
    }
    else {
        easyrtc.showError("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
    }

    addToConversation(selfEasyrtcid, "msgtype", text);
    document.getElementById('sendMessageText').value = "";
}

function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "Connection Successful</b>";
}

function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

// Sets calls so they are automatically accepted (this is default behaviour)
easyrtc.setAcceptChecker(function(caller, cb) {
    cb(true);
} );
