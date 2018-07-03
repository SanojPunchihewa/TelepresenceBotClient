<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm7 md5>
            <v-card class="elevation-5">
              <v-card-text>
                  <v-toolbar color="light-blue accent-3" dark>
                    <v-toolbar-title>Forgot Password</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                      Please type the email address you used when signing up to send a password reset link
                      <v-form ref="form" lazy-validation>
                      <v-text-field prepend-icon="email" :rules="emailRules" name="email" label="Email" type="text" v-model="email" required></v-text-field>
                      <v-alert :value="alert" :type="alert_color" transition="scale-transition">
                        {{alert_msg}}
                      </v-alert>
                      <v-flex md12 class="text-xs-center">
                        <v-btn color="indigo" dark @click="login">Reset Password</v-btn>
                      </v-flex>       
                      </v-form>     
                  </v-card-text>
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
  export default {    
    data: () => ({
      alert_text: '',
      alert_color: '',
      drawer: null,
      email: "",
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      alert_msg:"",
      alert: false,     
    }),
    methods: {
      login(){    
        if (this.$refs.form.validate()) {         
           this.alert_color = 'success'
           this.alert_msg = 'Password Reset Instructions sent, Check your mail'  
           this.alert = true
        }
      }
    },
    props: {
      source: String
    }
  }
</script>