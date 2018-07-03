<template>
  <v-container grid-list-md text-xs-center>    
    <v-layout row wrap>      
        <v-flex xs12 sm6 md6>
          <v-card>
            <v-card-text>
              <span style="font-weight:300" class="title">Bot Name : {{ robot.robot_name }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md6>
          <v-card>
            <v-card-text>
              <span style="font-weight:300" class="title">Bot Id : {{ botId }}</span>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 md4>
          <v-card height="180px">
            <v-card-text>
              <h3>Battery Level</h3>       
                 <v-progress-circular
                  :size="100"
                  :width="15"
                  :rotate="270"
                  :value="robot.battery_level"
                  color="teal">
                  {{ robot.battery_level }}
                </v-progress-circular>                        
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm4 md4>
        <v-card height="180px">
            <v-card-text>
              <h3>UpTime</h3>                           
              <h2>5 hours</h2>      
            </v-card-text>
        </v-card>
        </v-flex>
        <v-flex xs12 sm4 md4>
        <v-card height="180px">
            <v-card-text>
              <h3>Status</h3>              
              <h2>{{ robot.robot_status }}</h2>                       
            </v-card-text>
        </v-card>
        </v-flex>
        <v-flex xs12 sm6 md6>
        <v-card>
        <v-card-title>      
          <span class="headline">Last Used</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table         
          hide-headers
          :items="last_used"
          item-key="display_name">
          <template slot="items" slot-scope="props">          
            <tr @click="props.expanded = !props.expanded">
              <td>{{ props.item.display_name }}</td>
              <td class="text-xs-right" >{{ props.item.date }}</td>    
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text>{{ props.item.full_date }}</v-card-text>
            </v-card>
          </template>
        </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md6>
      <v-card>
      <v-card-title>      
        <span class="headline">Log</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table         
        hide-headers
        :items="logs">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left" >{{ props.item.log_message }}</td>     
          <td class="text-xs-right" >{{ props.item.date }}</td>              
        </template>      
      </v-data-table>
      </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import axios from 'axios';
  import functions from './functions'
  export default {
    data: () => ({         
      robot: {},
      logs: [],
      last_used: [],
      token: ''
    }), 
    methods: {      
      fetchBot() {
        let uri = functions.getApiPath() + 'getRobot';
        //var token = 'Bearer ' + this.getToken;        
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'bot_id' : this.botId}}).then((response) => {
            this.robot = response.data;            
        })
      },
      fetchLogs() {
        let uri = functions.getApiPath() + 'getRobotLog';
        //var token = 'Bearer ' + this.getToken;        
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'bot_id' : this.botId}}).then((response) => {
            response.data.forEach(element => {
              var time_stamp = new Date(parseInt( element._id.toString().substring(0,8), 16 ) * 1000 )
              var full_date = this.$moment(time_stamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
              var last_used_time = functions.getTimeInfo(this, time_stamp)
              this.logs.push({
                date: last_used_time,
                full_date: full_date,
                log_message: element.log_message,
                log_data: element.log_data
              })
            })
        })
      },
      fetchLastUsed() {
        let uri = functions.getApiPath() + 'getRobotLastUsed';
        //var token = 'Bearer ' + this.getToken;        
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'bot_id' : this.botId}}).then((response) => {
            response.data.forEach(element => {                          
              var time_stamp = new Date(parseInt( element._id.toString().substring(0,8), 16 ) * 1000 )
              var full_date = this.$moment(time_stamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
              var last_used_time = functions.getTimeInfo(this, time_stamp)
              var user = element.user_name;
              this.last_used.push({
                display_name: user,
                date: last_used_time,
                full_date: full_date
              })
            });            
        })
      }
    },
    created: function() {       
      this.token = 'Bearer ' + this.getToken;
      this.fetchBot();
      this.fetchLastUsed();
      this.fetchLogs();
    },
    computed: {
      botId () {
        return this.$route.params.botId
      },
      getToken() {
        return this.$store.getters.getToken;
      }
    },
  }
</script>

<style scoped>
  h3 {
    font-weight: 400
  }
</style>
