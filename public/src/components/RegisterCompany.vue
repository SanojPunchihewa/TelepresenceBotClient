<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-dialog v-model="dialog" persistent max-width="290">            
            <v-card>
              <v-card-title class="headline">Registration Complete</v-card-title>
              <v-card-text>Thanks for registering for our service, Please use the Sign In Option to use the service</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click.native="close">Take me to Sign In</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-flex xs12 sm10 md8>
            <v-stepper v-model="step_pos">
                <v-stepper-header>
                <v-stepper-step :complete="step_pos > 1" step="1">Personal Details</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="step_pos > 2" step="2">Organization Details</v-stepper-step>                
                </v-stepper-header>
                <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card class="mb-5">
                        <v-form ref="form1" v-model="valid1" lazy-validation align-center justify-center>
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
                            <v-alert :value="alert" type="error" transition="scale-transition">
                            {{error_msg}}
                            </v-alert>
                            <small>*indicates required field</small>
                        </v-layout>                  
                            <!-- <v-checkbox
                            v-model="checkbox"
                            :rules="[v => !!v || 'You must agree to continue!']"
                            label="Do you agree?"
                            required
                            ></v-checkbox> -->                    
                        </v-form>
                    </v-card>                
                    <v-btn color="primary" @click.native="submitPersonalAccount">Continue</v-btn>
                    <v-btn flat to="/login">Cancel</v-btn>                               
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-card class="mb-5">                       
                        <v-form ref="form2" v-model="valid2" lazy-validation align-center justify-center>
                            <v-layout row wrap align-center justify-center>
                            <v-flex md5 sm5 xs12>
                            <v-text-field prepend-icon="person" :rules="organizationNameRules" label="Organization Name" type="text" v-model="organizationName" required></v-text-field>
                            <!-- <v-text-field prepend-icon="person" :rules="robotIdRules" label="Robot Id" type="text" v-model="robotId" required></v-text-field>
                            <v-text-field prepend-icon="person" :rules="robotNameRules" label="Robot Name" type="text" v-model="robotName" required></v-text-field> -->
                            <v-alert :value="alert" type="error" transition="scale-transition">
                                {{error_msg}}
                            </v-alert>     
                            </v-flex>
                            </v-layout>
                        </v-form>           
                        <small>*indicates required field</small>                                                            
                    </v-card>
                    <v-btn color="primary" @click.native="submitOrganizationAccount">Continue</v-btn>
                </v-stepper-content>               
                </v-stepper-items>
            </v-stepper>
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
      dialog: false,
      userId: '',
      step_pos: 0,
      e1: true,
      valid1: true,
      valid2: true,
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
      error_msg:"",
      alert: false,
      organizationName: '',
      organizationNameRules: [
        v => !!v || 'Orgaization Name is required'
      ],
      robotId: '',
      robotIdRules: [
        v => !!v || 'Robot Id is required'
      ],
      robotName: '',
      robotNameRules: [
        v => !!v || 'Robot Name is required'
      ],
    }),

    methods: {
      submitOrganizationAccount () {
        if(this.$refs.form2.validate()) {
          let uri = functions.getApiPath() + 'addOrganization'
          axios.post(uri, {
            organization_name: this.organizationName,
            organization_owner_id: this.userId
          }).then((response) => {
            console.log(response)
            var organization_id = response.data._id;
            uri = functions.getApiPath() + 'updateUserOrganization'
            axios.post(uri, {
              id: this.userId,
              organization_id: organization_id
            }).then((response) => {
              this.dialog = true;
            })
          })
        }
      },
      submitPersonalAccount () {
        if (this.$refs.form1.validate()) {
          let uri = functions.getApiPath() + 'register'
          axios.post(uri, {
            email: this.email,
            display_name: this.username,
            first_name: this.firstname,
            last_name: this.lastname,
            mobile_phone: this.mobilephone,
            office_phone: this.officephone,
            account_type: 'admin',
            account_status: 'approved',
            password: this.password,
            organization_id: '0000'
          }).then((response) => {   
            if(response.data.Status == 'Reg_OK'){
              this.step_pos = 2;
              this.userId = response.data.userId;              
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
      close () {
        this.dialog = false;
        window.location.href = "/login";
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