<template>
  <v-container>
    <v-dialog v-model="dialogUpdate" max-width="500px">      
      <v-card>
        <v-card-title>
          <span v-if="updateInfo" class="headline">Update Info</span>
          <span v-else class="headline">Remove Account</span>
        </v-card-title>
        <v-card-text v-if="updateInfo">
          <v-span>Are you sure to update your profile?</v-span>          
        </v-card-text>
        <v-card-text v-else>
          <v-span style="color:red">Once you have removed your account you cannot use our service</v-span>
          <v-form ref="form" lazy-validation>
            <v-text-field prepend-icon="person" :rules="userNameRules" name="userName" label="Username" type="text" v-model="rev_username" required></v-text-field>
            <v-text-field :rules="passwordRules" prepend-icon="lock" name="password" label="Password" v-model="rev_password" type="password" required></v-text-field>
            <v-alert :value="alert" type="error" transition="scale-transition">
              {{error_msg}}
            </v-alert>    
          </v-form>  
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialogUpdate = false">No</v-btn>
          <v-btn v-if="updateInfo" color="red accent-3" flat @click.native="update">Update</v-btn>
          <v-btn v-else color="red accent-3" flat @click.native="deleteUser">Remove Account</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdatePass" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">Change Password</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field :rules="passwordRules" prepend-icon="lock" name="password" label="Current Password" v-model="passwordOld" type="password" required></v-text-field>
            <v-text-field :rules="passwordRules" prepend-icon="lock" name="password" label="New Password" v-model="passwordNew" type="password" required></v-text-field>
            <v-alert :value="alert" type="error" transition="scale-transition">
              {{error_msg}}
            </v-alert>
            <v-flex md12 class="text-xs-center">
              <v-btn color="blue" dark @click="updatePassword">Change Password</v-btn>
            </v-flex>       
          </v-form>   
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 class="text-xs-center">
                 <v-avatar
                :tile="User"
                :size="150">
                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="avatar">
                </v-avatar>
                <br>
                <br>
                <h2>{{ full_name }}</h2>
                <h4>@{{ organization }}</h4>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field disabled v-model="first" box label="First Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field disabled v-model="last" box label="Last Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                disabled
                :rules="emailRules"
                v-model="email"
                box
                label="Email Address"
                persistent-hint
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field disabled v-model="username" box label="UserName"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="officenumber" box label="Office Phone"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="mobilenumber" box label="Mobile Phone"></v-text-field>
              </v-flex>
              <v-flex mb-4 xs12 class="text-xs-center">
                <v-btn outline color="warning" @click="dialogUpdate = true, updateInfo = true">Update Profile</v-btn>
                <v-divider></v-divider>
              </v-flex>              
              <v-flex sm6 xs12 class="text-xs-center">
                <v-btn dark outline color="blue" @click="dialogUpdatePass = true">Change Password</v-btn>
              </v-flex>  
              <v-flex sm6 xs12 class="text-xs-center">
                <v-btn outline color="error" @click="dialogUpdate = true, updateInfo = false">Remove Account</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
    data: () => ({
      snackbar: false,
      snackbar_text: '',
      snackbar_color: '',
      user: {},
      dialogUpdate: false,
      updateInfo: true,
      dialogUpdatePass: false,
      first: '',
      last: '',
      email: '',
      username: '',
      bio: '',
      officenumber: '',
      mobilenumber: '',
      organization_id: '',
      organization: '',
      rev_username: '',
      userNameRules: [
        v => {
          return !!v || 'Username is required'
        }
      ],
      rev_password: '',
      emailRules: [
        v => {
          return !!v || 'E-mail is required'
        },
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordOld: "",
      passwordNew: "",
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      error_msg:"",
      alert: false,
      token: '',
    }),
    methods: {
      update(){
        let uri = functions.getApiPath() + 'updateUser'; 
         var data = {
            'id': this.user._id,
            'office_phone': this.officenumber,
            'mobile_phone': this.mobilenumber
          }      
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: data}).then((response) => {
          if(response.data == 'OK'){
            this.snackbar_text = 'Profile Updated'
            this.snackbar_color = 'success'
          }else{
            this.snackbar_text = 'Someting went wrong'
            this.snackbar_color = 'error'
          }
          this.dialogUpdate = false
          this.snackbar = true;
        })
      },
      updatePassword(){       
        if (this.$refs.form.validate()) {
          let uri = functions.getApiPath() + 'updatePassword';       
          var data = {
            'id': this.user._id,
            'old_password': this.passwordOld,
            'new_password': this.passwordNew
          }
          axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: data}).then((response) => {
            if(response.data == 'Password_Error'){
              this.error_msg = "Password won't match"
              this.alert = true
            }else{
              if(response.data == 'OK'){
                this.snackbar_text = 'Password Updated'
                this.snackbar_color = 'success'
              }else{
                this.snackbar_text = 'Someting went wrong'
                this.snackbar_color = 'error'
              }
              this.dialogUpdatePass = false
              this.snackbar = true;
            }
          })
        }
      },
      deleteUser() {
        if (this.$refs.form.validate()) {
          let uri = functions.getApiPath() + 'deleteUser';     
           var data = {
            'id': this.user._id,
            'password': this.rev_password,
            'username': this.rev_username
          }  
          axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: data}).then((response) => {
            if(response.data == 'No_User_Found'){
              this.error_msg = "Incorrect Username"
              this.alert = true
            }else if(response.data == 'Password_Error'){
              this.error_msg = "Incorrect Password"
              this.alert = true
            }else{
              if(response.data == 'OK'){
                this.$store.dispatch('logout');
                window.location.href = "/login";
              }else{
                this.snackbar_text = 'Someting went wrong'
                this.snackbar_color = 'error'
              }
              this.dialogUpdate = false
              this.snackbar = true;
            }
          })   
        }       
      },
      fetchOrganization() {
        let uri = functions.getApiPath() + 'getOrganization';       
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
      },
      full_name() {
        return (this.user.first_name + " " + this.user.last_name)
      }
    }
  }
</script>