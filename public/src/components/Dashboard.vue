<template>
  <v-container fluid fill-height>
    <v-alert
      :value="blocked"
      type="error">
      Account Blocked! You cannot use any Bot.
    </v-alert>
    <v-layout child-flex v-if="!blocked">
        <v-data-table
        :headers="headers"
        :items="robots"
        hide-actions
        class="elevation-1"
        >
        <template slot="items" slot-scope="props">
        <td>{{ props.item.robot_name }}</td>
        <td class="text-xs-center">{{ props.item.robot_status }}</td>
        <td class="text-xs-center">{{ props.item.battery_level }}</td>
        <td class="text-xs-center">     <!--//props.item._id-->
          <v-btn v-if="props.item.robot_status == 'Available'" outline color="indigo" @click="loadVideoStreaming('CE_GROUND_FLOOR')">Connect</v-btn>
          <v-btn v-else disabled>Cannot Connect</v-btn>
        </td>
        <td class="text-xs-center" v-if="admin">
          <v-tooltip bottom>
            <v-btn slot="activator" flat icon color="gray" @click="moreInfo(props.item._id)">
            <v-icon>info</v-icon>
            </v-btn>        
            <span>More Info</span>
          </v-tooltip>          
        </td>
        </template>
        </v-data-table>
        <v-btn
          v-if="admin"
          absolute
          dark
          fab
          bottom
          right
          style="bottom:30px"
          color="green"
          @click.native="dialog_add_bot = true">
          <v-icon>add</v-icon>
        </v-btn>
    </v-layout>
    <v-dialog v-model="dialog_add_bot" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">Add new Robot</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field id="botId" :rules="idRules" v-model="bot_id" name="bot_id" label="Bot Id (Check the User Manual)" required></v-text-field>
            <v-text-field id="botName" :rules="nameRules" v-model="bot_name" name="bot_name" label="Bot Name (Name given while setting up the Bot)" required></v-text-field>
            <v-alert :value="alert" type="error" transition="scale-transition">
              {{error_msg}}
            </v-alert>
            <v-flex md12 class="text-xs-center">
              <v-btn color="blue" outline @click.native="addNewRobot">Add Robot</v-btn>
            </v-flex>       
          </v-form>         
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      bottom     
      :color="snackbar_color"
      :timeout="3000">
      {{ snackbar_text }}
    </v-snackbar>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import functions from './functions'
  export default {
    data () {
      return {        
        blocked: false,
        snackbar: false,
        snackbar_text: '',
        snackbar_color: '',
        error_msg:"",
        alert: false,     
        bot_id: '',
        idRules: [
          v => !!v || 'Bot ID is required'
        ],
        bot_name: '',
        nameRules: [
          v => !!v || 'Bot Name is required'
        ],
        organization_id: '',
        admin: false,
        user: {},
        invitation_link: 'https://telepresence.com/register/companyABC',
        dialog_add_bot: false, 
        headers: [
          {
            text: 'Robot Name',
            align: 'left',
            value: 'robot_name'
          },
          { text: 'Status', value: 'robot_status', align: 'center'},
          { text: 'Battery Level', value: 'battery_level', align: 'center' },
          { text: ' ', value: '', align: 'center'},
          { text: ' ', value: '', align: 'center'}
        ],
        robots: [],
        token: ''
      }
    },
    
    created: function() {      
      this.token = 'Bearer ' + this.getToken;
      functions.fetchUser(this.token).then((response) => {
          this.user = response;
          this.user.account_type == 'admin' ? this.admin = true : this.admin = false;            
          this.organization_id = this.user.organization_id;
          if(this.user.account_status == 'Blocked'){
            this.blocked = true;
          }else{            
            this.fetchRobots();
          }          
      })
    },
    methods: {
      fetchRobots() {
        let uri = functions.getApiPath() + 'allRobots';                   
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.organization_id}}).then((response) => {
            this.robots = response.data;            
        })
      },
      moreInfo(bot_id){
        var path = '/bot-info/' + bot_id;
        this.$router.push(path)
      },
      loadVideoStreaming(bot_id){
        var path = '/video-stream/' + bot_id;
        this.$router.push(path);
      },
      addNewRobot() {
        if (this.$refs.form.validate()) {
          let uri = functions.getApiPath() + 'updateRobotInfo';          
          var data = {
            id: this.bot_id,
            organization_id : this.organization_id,
            robot_name: this.bot_name,
            robot_status: 'Available'
          }          
          axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: data}).then((response) => {
              if(response.data == 'Name Mismatch'){
                this.error_msg = "Bot Name doesn\'t match with the one given when setting up the bot"
                this.alert = true
              }else if(response.data == 'OK'){
                this.dialog_add_bot = false;
                this.snackbar_color = 'success'
                this.snackbar_text = 'Bot ' + this.bot_name + 'was added successfully'
                this.snackbar = true
                this.fetchRobots();
              }else{
                this.dialog_add_bot = false;
                this.snackbar_color = 'error'
                this.snackbar_text = 'Something went wrong'
                this.snackbar = true
              }
          })
        }
      }
    },
    computed: {
      getToken() {
        return this.$store.getters.getToken;
      }
    }
  }
</script>