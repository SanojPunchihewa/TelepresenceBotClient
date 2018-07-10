<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-5">
              <v-card-text>
                <v-layout align-center justify-center>
                  <v-flex class="text-xs-center">
                    <span class="grey--text"><h2>Telepresence Robot</h2>
                    <h3>Department of Computer Engineering</h3>
                    <h3>Faculty of Engineering</h3></span>
                  </v-flex>
                </v-layout>
                <v-form ref="form" lazy-validation>
                  <v-text-field prepend-icon="email" :rules="emailRules" name="email" label="Email" type="text" v-model="email" required></v-text-field>
                  <v-text-field id="password" :rules="passwordRules" prepend-icon="lock" name="password" label="Password" v-model="password" type="password" required></v-text-field>
                  <v-flex md12 class="text-xs-right">                  
                    <router-link  
                    :class="$style.link"
                    :to="'forgotPassword'">Forgot your password?</router-link>
                  </v-flex>
                  <v-alert :value="alert" type="error" transition="scale-transition">
                    {{error_msg}}
                  </v-alert>
                  <v-flex md12 class="text-xs-center">
                    <v-btn 
                      style="width:50%" 
                      :loading="loading"
                      :disabled="loading" 
                      color="light-blue accent-2" 
                      dark 
                      @click="login">Login</v-btn>
                  </v-flex>       
                </v-form>                         
                <v-flex style="margin-top:5px" md12 class="text-xs-center">
                  Don't have an account?
                  <router-link  
                  :class="$style.link"
                  :to="'registerCompany'"> Sign up now</router-link>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios';
  import functions from './functions'
  export default {    
    data: () => ({
      loading: false,
      drawer: null,
      email: "",
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      password: "",
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      error_msg:"",
      alert: false,     
    }),
    methods: {
      login(){
        this.error_msg = ""
        this.alert = false
        if (this.$refs.form.validate()) {
          this.loading = true;
          let uri = functions.getApiPath() + 'login';
          var user = {"email":this.email, "password":this.password};
          axios.post(uri, user).then((response) => {  
            this.loading = false;         
            if(response.data.success){
              this.$store.dispatch("login", {
                token: response.data.token
              }).then(res => {
                this.$router.push('/dashboard');
              })              
            }else if(response.data == 'Password_Error'){
              this.error_msg = "Incorrect Password"
              this.alert = true;
            }else if(response.data == 'No_User_Found'){
              this.error_msg = "No account found. Check your email or Sign Up"
              this.alert = true;
            }else if(response.data == 'Not_Approved'){
              this.error_msg = "Sorry, your account is not approved yet!"
              this.alert = true;
            }
          });
        }
      }
    },
    props: {
      source: String
    }
  }
</script>

<style module>
  .link {
    text-decoration: none;
    color: rgb(0, 132, 255);
  }
</style>