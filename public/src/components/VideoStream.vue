<template>
    <v-layout child-flex fill-height>
        <div class="robot-video-streaming" fill-height>   
            <video autoplay="autoplay" ref="callerVideo" id="callerVideo"></video>
            <video class="easyrtcMirror" ref="selfVideo" autoplay="autoplay" id="selfVideo" muted="true" volume="0" ></video>
            <div id='statusContainer'>
                <div id="time"><label ref="minutes" id="minutes">00</label>:<label ref="seconds" id="seconds">00</label></div>
                <div id='status' ref='status'>Connecting</div>
            </div>
            <div id="btnContainer">
                <v-btn fab dark color="red" @click="endStreaming">
                    <v-icon dark>call_end</v-icon>
                </v-btn>
                <v-btn fab dark color="teal" @click.stop="isVideoEnabled = !isVideoEnabled" @click="toggleCamera">
                    <v-icon dark v-if="isVideoEnabled">videocam_off</v-icon>
                    <v-icon dark v-else>videocam</v-icon>
                </v-btn>
                <v-btn fab dark color="teal" @click.stop="isAudioEnabled = !isAudioEnabled" @click="toggleMic">
                    <v-icon dark v-if="isAudioEnabled">mic_off</v-icon>
                    <v-icon dark v-else>mic</v-icon>
                </v-btn>
            </div>
        </div>
    </v-layout>    
</template>

<style>
    .hidden {
        display: none;
    }
    .robot-video-streaming {
        text-align: center;
        max-height: 535px;        
        background-color: blueviolet;
    }
    #statusContainer {
        position: relative;
        display: flex;        
        justify-content: center;
        flex-direction: column;
        bottom: 140px;
    }
    #btnContainer {        
        position: relative;
        display: flex;        
        justify-content: center;
        bottom: 130px;
    }
    #time {
        font-size: 1.3em;
        font-weight: bold;
    }
    #btnCall {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: green;
        float: left;
    }
    #selfVideo {
        volume: 0;
        position: absolute;       
        top: 80px;
        right: 10px;
        z-index: 2;
        opacity: 0.8;
        height:180px;
        width:250px;        
    }
    #callerVideo {
        height:100%;
        width:100%;
        background: cadetblue;
    }
</style>

<script>
  export default {
    data: () => ({
      drawer: false,
      time: 0,
      isVideoEnabled: true,
      isAudioEnabled: true,
      robotId: ""
    }),
    methods: {
        connect() {
            easyrtc.setUsername("sanoj95");
            easyrtc.setVideoDims();
            easyrtc.enableDebug(false);
            easyrtc.enableDataChannels(true);
            //easyrtc.setDataChannelOpenListener(openListener);
            //easyrtc.setDataChannelCloseListener(closeListener);
            easyrtc.setPeerListener(this.saddToConversation);
            easyrtc.setPeerClosedListener(this.peerLost);
            easyrtc.setRoomOccupantListener(this.convertListToButtons);
            easyrtc.easyApp("easyrtc.videoChatHd", this.$refs.selfVideo.id, [this.$refs.callerVideo.id], this.loginSuccess, this.loginFailure);
        },
        peerLost(easyrtcid){
            console.log('Lost Connection to ' + easyrtcid);
            var path = '/dashboard';
            this.$router.push(path);
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
                this.robotId = easyrtcid;
                console.log(easyrtc.idToName(easyrtcid));

                // var button = document.getElementById('btnStart');
                // button.className = "callButton";
                // button.disabled = false;

                // button.onclick = function(easyrtcid) {
                //     return function() {
                //         if(button.innerHTML == "Start"){
                //             context.performCall(easyrtcid);
                //         }
                //     };
                // }(easyrtcid);

                context.performCall(easyrtcid);

                //var buttonSendData = document.getElementById('btnSendMsg');

                // buttonSendData.onclick = function(easyrtcid) {
                //     return function() {
                //         this.sendStuffP2P(easyrtcid);
                //     };
                // }(easyrtcid);
                }
            }
        },
        performCall(otherEasyrtcid) {

            var context = this;

            easyrtc.hangupAll();
            var acceptedCB = function(accepted, caller) {
                if( !accepted ) {
                    easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(caller) + " was rejected");
                }
            };            

            var successCB = function(caller, media) {
                //context.$refs.status.toggle();
                context.$refs.status.innerHTML = "Connected";
                context.startTimer();
                if (media === 'datachannel') {
                    console.log("Data Channel succesful");
                }
            };
            var failureCB = function() {};
            easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
        },
        sendStuffP2P(message) {
            var otherEasyrtcid = this.robotId;
            if (message.replace(/\s/g, "").length === 0) { // Don't send just whitespace
                return;
            }
            if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
                console.log(message);
                easyrtc.sendDataP2P(otherEasyrtcid, 'msg', message);
            }
            else {
                easyrtc.showError("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
            }

            //addToConversation(selfEasyrtcid, "msgtype", message);
            //document.getElementById('sendMessageText').value = "";
        },
        loginSuccess(easyrtcid) {
            //selfEasyrtcid = easyrtcid;
            //document.getElementById("iam").innerHTML = "Connection Successful</b>";
        },
        loginFailure(errorCode, message) {
            easyrtc.showError(errorCode, message);
        },
        toggleCamera(){            
            console.log('Cam:' + this.isVideoEnabled);
            easyrtc.enableVideo(this.isVideoEnabled);
        },
        endStreaming(){
            console.log('Video-Stream End by User !');  
            easyrtc.closeLocalMediaStream();
            easyrtc.disconnect();
            var path = '/dashboard';
            this.$router.push(path);
        },
        toggleMic(){
            console.log('Mic:' + this.isVideoEnabled);
            easyrtc.enableMicrophone(this.isAudioEnabled);
        },
        setTime() {
            ++(this.time);
            this.$refs.seconds.innerHTML = this.pad(this.time % 60);
            this.$refs.minutes.innerHTML = this.pad(parseInt(this.time / 60));
        },
        pad(val) {
            var valString = val + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        },
        startTimer() {
            this.interval = setInterval(this.setTime, 1000);
        },
        leftKeyPressed(){
            console.log('Left');
            this.sendStuffP2P('Left');
        },
        rightKeyPressed(){
            console.log('Right');
        },
        upKeyPressed(){
            console.log('Up');
        },
        downKeyPressed(){
            console.log('Down');
        },
        moveSelection(evt) {
            switch (evt.keyCode) {
                case 37:
                this.leftKeyPressed();
                break;
                case 39:
                this.rightKeyPressed();
                break;
                case 38:
                this.upKeyPressed();
                break;
                case 40:
                this.downKeyPressed();
                break;
            }
        }
    },
    props: {
        botId: {
            type: String,
            default: 'My-Bot'
        }
    },
    mounted: function(){
        console.log('Video-Stream created ! ' + this.botId);  
        this.connect();
        window.addEventListener('keydown', this.moveSelection);
    },
    beforeDestroy: function(){
        console.log('Video-Stream destroyed !');  
        easyrtc.closeLocalMediaStream();
        easyrtc.disconnect();
    }
  }
</script>