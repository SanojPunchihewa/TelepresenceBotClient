<template>
  <v-app id="inspire">
    <v-content v-if="this.link_ok">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md8>
            <v-card class="elevation-5" align-center justify-center>
              <v-card-text text-xs-center>
                <v-flex xs12>
                  <v-card-text >
                  <v-toolbar color="light-blue accent-3" dark>
                    <v-toolbar-title>REGISTRATION</v-toolbar-title>
                  </v-toolbar>
                  </v-card-text>
                </v-flex>              
                <v-form ref="form" v-model="valid" lazy-validation align-center justify-center>
                  <v-layout row wrap align-center justify-center>
                    <v-flex class="pad" md10 sm5 xs12>
                      <h3>Personal Information</h3>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                        <v-text-field md4 v-model="firstname" :rules="firstNameRules" :counter="15" label="First Name" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                       <v-text-field md4 v-model="lastname" :rules="lastNameRules" :counter="15" label="Last Name" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                        <v-text-field md4 v-model="officephone" label="Office Phone"></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                       <v-text-field md4 v-model="mobilephone" label="Mobile Phone"></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md10 sm5 xs12>
                      <v-text-field
                        name="input-7-3"
                        label="Add a small description about yourself..."
                        value=""
                        multi-line
                      ></v-text-field>
                    </v-flex>
                    
                    <v-flex class="pad"  md10 sm5 xs12>
                      <h3>Account</h3>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                        <v-text-field md4 v-model="username" :rules="userNameRules" :counter="15" label="Username" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                       <v-text-field md4 v-model="email" :rules="emailRules" label="Email Address" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md10 sm5 xs12>
                       <v-text-field
                          v-model="password"
                          :rules="passwordRules"
                          :append-icon="e1 ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (e1 = !e1)"
                          :type="e1 ? 'password' : 'text'"
                          name="input-10-1"
                          label="Password"
                          hint="At least 8 characters"
                          min="8"
                          :counter="15"
                          required
                        ></v-text-field>
                   
                    <!-- <v-flex class="pad" md10 sm5 xs12>
                      <h3>Choose an account type</h3>
                      <v-radio-group v-model="accounttype" :mandatory="false">
                        <v-radio label="User" value="user"></v-radio>
                        <v-radio label="Admin" value="admin"></v-radio>
                      </v-radio-group>
                    </v-flex> -->

                    <v-alert :value="alert" type="error" transition="scale-transition">
                    {{error_msg}}
                    </v-alert> 
                   <small>*indicates required field</small>
                   <v-card-text>
                    <v-flex xs10 offset-xs1>
                      <v-btn block color="success" @click="submit">Register</v-btn>
                    </v-flex>
                   </v-card-text>
                  </v-layout>                  
                    <!-- <v-checkbox
                    v-model="checkbox"
                    :rules="[v => !!v || 'You must agree to continue!']"
                    label="Do you agree?"
                    required
                    ></v-checkbox> -->                                    
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>      
  </v-app>
</template>

<script>
  import axios from 'axios'
  import functions from './functions'
  export default {
    data: () => ({
      link_ok: false,
      organization_id: '',
      e1: true,
      valid: true,
      password: "",
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length > 7 || 'Password must be at least 8 characters.'
      ],
      firstname: '',
      firstNameRules: [
        v => !!v || 'First name is required'
      ],
      lastname: '',
      lastNameRules: [
        v => !!v || 'Last name is required'
      ],
      username: '',
      userNameRules: [
        v => !!v || 'Username is required'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      accounttype: 'pending',
      error_msg:"",
      alert: false,
    }),

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          if(!this.mobilephone){
            this.mobilephone = 'N/A'
          }
          if(!this.officephone){
            this.officephone = 'N/A'
          }
          let uri = functions.getApiPath() + 'register'
          axios.post(uri, {
            email: this.email,
            display_name: this.username,
            first_name: this.firstname,
            last_name: this.lastname,
            mobile_phone: this.mobilephone,
            office_phone: this.officephone,
            account_type: this.accounttype,
            account_status: 'pending',
            password: this.password,
            organization_id: this.organization_id
          }).then((response) => {          
            if(response.data.Status == 'Reg_OK'){
              this.addNotification(response.data.userId)
            }else if(response.data == 'User_Name_Exists'){
              this.error_msg = "This username is already taken. Please choose another one."
              this.alert = true;
            }else if(response.data == 'Email_Exists'){
              this.error_msg = "This email is already in use. Please choose another one."
              this.alert = true;
            }
          });
        }
      },
      addNotification(userId) {
        let uri = functions.getApiPath() + 'addNotification';       
        let data = {
          user_id: 'N/A',
          organization_id: this.organization_id,
          notification_type: 'New User Request',
          notification: this.full_name + ' wants to connect',
          notification_meta: userId
        }            
        axios({ method: 'post', url: uri, data: data}).then((response) => {
          this.$router.push('/pendingApproval');
        })
      }
    },
    computed: {
      full_name() {
        return (this.firstname + " " + this.lastname)
      }
    },
    beforeMount() {
      if(this.$router.app._route.query.organizationId){
        this.organization_id = this.$router.app._route.query.organizationId;  
        this.link_ok = true      
      }else{
        window.location.href = "/notfound";
      }
    },  
    props: {
      source: String
    }
  }
</script>

<style>
  .pad {
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
