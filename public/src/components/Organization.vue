<template>
    <v-container>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md8>
            <v-card class="elevation-5">
              <v-card-text>
                <v-layout row wrap>
                  <v-flex md6 class="text-xs-center">                   
                    <v-text-field v-model="organization_name" box label="Organization Name"></v-text-field>
                  </v-flex>
                  <v-flex md6 class="text-xs-center">                   
                    <v-text-field v-model="organization_name" box label="Organization Name"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
  <!-- <v-container grid-list-md text-xs-center>    
    <v-layout row wrap text-xs-center>      
        <v-flex text-xs-center>
            <v-card>
                <v-card-text>
                <v-layout row wrap align-center>
                    <v-flex xs12 sm6>
                        <v-text-field v-model="organization_name" box label="First Name"></v-text-field>
                    </v-flex>
                    <v-flex>
                        <v-btn outline color="light-blue accent-2" dark>Update</v-btn>
                    </v-flex>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex text-xs-center>
            <v-card>
                <v-card-text>
                    Number of Users : {{ user_count }}
                </v-card-text>
            </v-card>
        </v-flex>
         <v-flex text-xs-center>
            <v-card>
                <v-card-text>
                    Number of Robots : {{ bot_count}}
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
  </v-container> -->
</template>

<script>
  import axios from 'axios';
  import functions from './functions'
  export default {
    data: () => ({
        organization_name : 'Home',
        bot_count : '1',
        user_count : '5'
    }),
    methods: {
      fetchOrganization() {
        let uri = functions.getApiPath() + 'getOrganization';
        //var token = 'Bearer ' + this.getToken;        
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.organization_id}}).then((response) => {
            this.organization = response.data.organization_name;
        })
      }
    },
    created: function() {       
    //   this.token = 'Bearer ' + this.getToken;
    //   functions.fetchUser(this.token).then((response) => {
    //     this.user = response
    //     this.first = this.user.first_name;
    //     this.last = this.user.last_name;
    //     this.username = this.user.display_name;
    //     this.email = this.user.email;
    //     this.organization_id = this.user.organization_id,
    //     this.user.office_phone ? this.officenumber = this.user.office_phone : this.officenumber = 'Not Given'
    //     this.user.mobile_phone ? this.mobilenumber = this.user.mobile_phone : this.mobilenumber = 'Not Given'      
    //     this.fetchOrganization();
    //   })
    },
    computed: {
      getToken() {
        return this.$store.getters.getToken;
      }
    }
  }
</script>