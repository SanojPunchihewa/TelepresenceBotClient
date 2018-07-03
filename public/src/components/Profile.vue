<template>
  <v-container grid-list-md text-xs-center>
    <v-dialog v-model="dialog" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">Change Password</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field id="passwordOld" :rules="passwordRules" prepend-icon="lock" name="password" label="Current Password" v-model="passwordOld" type="password" required></v-text-field>
            <v-text-field id="passwordNew" :rules="passwordRules" prepend-icon="lock" name="password" label="New Password" v-model="passwordNew" type="password" required></v-text-field>
            <v-alert :value="alert" type="error" transition="scale-transition">
              {{error_msg}}
            </v-alert>
            <v-flex md12 class="text-xs-center">
              <v-btn color="blue" dark @click="dialog = false">Change Password</v-btn>
            </v-flex>       
          </v-form>   
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout row wrap>      
      <v-flex xs12 sm4>
        <v-card>
          <v-card-text class="px-0">
            <v-avatar
            :tile="User"
            :size="150">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="avatar">
            </v-avatar>
            <br>
            <br>
            <h2>John Leider</h2>
            <h4>@{{ organization }}</h4>
          </v-card-text>
        </v-card>
      </v-flex>      
      <v-flex xs12 sm8>
        <v-card align-center>
          <v-card-text class="px-0">              
              <v-container grid-list-md>
                <v-layout row wrap align-center>
                <v-flex xs12 sm6>
                    <v-text-field v-model="first" box label="First Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-text-field v-model="last" box label="Last Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-text-field
                    :rules="emailRules"
                    v-model="email"
                    box
                    label="Email address"
                    hint="Enter your email!"
                    persistent-hint
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-text-field v-model="username" box label="User Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-text-field v-model="officenumber" box label="Office Phone"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-text-field v-model="mobilenumber" box label="Mobile Phone"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field v-model="bio" box multi-line label="Bio"></v-text-field>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <v-btn round color="warning" @click="print">Update Profile</v-btn>
                </v-flex>                
                </v-layout>
              </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-layout row wrap>
            <v-flex sm6 xs12 class="text-xs-center">
              <v-btn dark round color="blue" @click="showDialog">Change Password</v-btn>
            </v-flex>  
            <v-flex sm6 xs12 class="text-xs-center">
              <v-btn round color="error">Remove Account</v-btn>
            </v-flex>
          </v-layout>          
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
      user: {},
      dialog: false,
      first: '',
      last: '',
      email: '',
      username: '',
      bio: '',
      officenumber: '',
      mobilenumber: '',
      organization_id: '',
      organization: '',
      emailRules: [
        v => {
          return !!v || 'E-mail is required'
        },
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      password: "",
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      error_msg:"",
      alert: false,
      token: '',
    }),
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      print(){
        console.log(this.first);
      },
      showDialog(){        
        this.dialog = true
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          
        }, 300)
      },
      fetchOrganization() {
        let uri = functions.getApiPath() + 'getOrganization';
        //var token = 'Bearer ' + this.getToken;        
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.organization_id}}).then((response) => {
            this.organization = response.data.organization_name;
        })
      }
    },
    created: function() {       
      this.token = 'Bearer ' + this.getToken;
      functions.fetchUser(this.token).then((response) => {
        this.user = response
        this.first = this.user.first_name;
        this.last = this.user.last_name;
        this.username = this.user.display_name;
        this.email = this.user.email;
        this.organization_id = this.user.organization_id,
        this.user.office_phone ? this.officenumber = this.user.office_phone : this.officenumber = 'Not Given'
        this.user.mobile_phone ? this.mobilenumber = this.user.mobile_phone : this.mobilenumber = 'Not Given'      
        this.fetchOrganization();
      })
    },
    computed: {
      getToken() {
        return this.$store.getters.getToken;
      }
    }
  }
</script>