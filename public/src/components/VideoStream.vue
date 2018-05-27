<template>
    <v-layout child-flex>
        <div class="robot-control-panel">
          <div class="robot-info-bar">
              <div class="battery-info">
                  <i class="fa fa-battery-full" style="margin-right: 5px"></i><p>50%</p>
              </div>
          </div>
          <div class="robot-controller">
              <div class="robot-control-bar">
                <input type="range" min="1" max="100" value="50" class="slider" orient="vertical" id="myRange">
                <br>
                <div id="iam">Not yet connected...</div>
                <div id="otherClients">
                </div>
                <button id="btnStart" class="disabledButton" disabled>Start</button>
                <textarea id="sendMessageText"></textarea>
                <button id="btnSendMsg" class="callButton">Send</button>
              </div>
              <div class="robot-video-streaming">
                <div id="videos">
                  <div>
                      <video autoplay="autoplay" ref="callerVideo" id="callerVideo"></video>
                      <video class="easyrtcMirror" ref="selfVideo" autoplay="autoplay" id="selfVideo" muted="true" volume="0" ></video>
                  </div>
                </div>
              </div>
          </div>
        </div>
    </v-layout>  
</template>

<script>
  export default {
    data: () => ({
      drawer: false
    }),
    methods: {
        connect() {
            easyrtc.setUsername("sanoj95");
            easyrtc.setVideoDims();
            easyrtc.enableDebug(false);
            //easyrtc.enableDataChannels(true);
            //easyrtc.setDataChannelOpenListener(openListener);
            //easyrtc.setDataChannelCloseListener(closeListener);
            //easyrtc.setPeerListener(addToConversation);
            easyrtc.setRoomOccupantListener(this.convertListToButtons);
            easyrtc.easyApp("easyrtc.videoChatHd", this.$refs.selfVideo.id, [this.$refs.callerVideo.id], this.loginSuccess, this.loginFailure);
        },
        addToConversation(who, msgType, content) {
            // Escape html special characters, then add linefeeds.
            content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            content = content.replace(/\n/g, '<br />');
            who = easyrtc.idToName(who)
            console.log(who + " - " + content)
        },
        convertListToButtons (roomName, data, isPrimary) {

            var context = this;

            for(var easyrtcid in data) {

                if(easyrtc.idToName(easyrtcid)){//== "robot-one"
                console.log(easyrtc.idToName(easyrtcid));

                var button = document.getElementById('btnStart');
                button.className = "callButton";
                button.disabled = false;

                button.onclick = function(easyrtcid) {
                    return function() {
                        if(button.innerHTML == "Start"){
                            context.performCall(easyrtcid);
                        }
                    };
                }(easyrtcid);

                var buttonSendData = document.getElementById('btnSendMsg');

                buttonSendData.onclick = function(easyrtcid) {
                    return function() {
                        this.sendStuffP2P(easyrtcid);
                    };
                }(easyrtcid);
                }
            }
        },
        performCall(otherEasyrtcid) {
            easyrtc.hangupAll();
            var acceptedCB = function(accepted, caller) {
                if( !accepted ) {
                    easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(caller) + " was rejected");
                }
            };
            //button.innerHTML.value = 'endCall';

            var successCB = function(caller, media) {
                var button = document.getElementById('btnStart');
                button.innerHTML = 'End';
                button.className = "endButton";
                if (media === 'datachannel') {
                console.log("Data Channel succesful");
                }
            };
            var failureCB = function() {};
            easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
        },
        loginSuccess(easyrtcid) {
            //selfEasyrtcid = easyrtcid;
            document.getElementById("iam").innerHTML = "Connection Successful</b>";
        },
        loginFailure(errorCode, message) {
            easyrtc.showError(errorCode, message);
        }
    },
    mounted: function(){
      console.log('Video-Stream created !');  
      this.connect();    
    }
  }
</script>