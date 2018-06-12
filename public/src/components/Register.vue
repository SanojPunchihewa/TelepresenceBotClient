<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md8>
            <v-card class="elevation-5" align-center justify-center>
              <v-card-text text-xs-center>
                <v-flex class="text-xs-center">
                   <h3>Create your Account</h3>
                </v-flex>               
                <v-form ref="form" v-model="valid" lazy-validation align-center justify-center>
                  <v-layout row wrap align-center justify-center>
                    <v-flex class="pad" md5 sm5 xs12>
                        <v-text-field md4 v-model="first_name" :rules="firstNameRules" :counter="15" label="First Name" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                       <v-text-field md4 v-model="last_name" :rules="lastNameRules" :counter="15" label="Last Name" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md10 sm5 xs12>
                      <v-text-field
                        name="input-7-3"
                        label="Small description about your self"
                        value=""
                        multi-line
                      ></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                        <v-text-field md4 v-model="user_name" :rules="userNameRules" :counter="15" label="User Name" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                       <v-text-field md4 v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12>
                       <v-text-field
                          v-model="password"
                          :rules="passwordRules"
                          :append-icon="e1 ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (e1 = !e1)"
                          :type="e1 ? 'password' : 'text'"
                          name="input-10-1"
                          label="Enter your password"
                          hint="At least 8 characters"
                          min="8"
                          :counter="15"
                          required
                        ></v-text-field>
                    </v-flex>
                    <v-flex class="pad" md5 sm5 xs12 text-xs-center>
                      <v-btn color="success" :disabled="!valid" @click="submit">Register</v-btn>
                    </v-flex>
                   
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

  export default {
    data: () => ({
      e1: false,
      valid: true,
      password: "",
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length > 7 || 'Password must be atleast 8 characters'
      ],
      first_name: '',
      firstNameRules: [
        v => !!v || 'First Name is required'
      ],
      last_name: '',
      lastNameRules: [
        v => !!v || 'Last Name is required'
      ],
      user_name: '',
      userNameRules: [
        v => !!v || 'User Name is required'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      select: null
    }),

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
        //   axios.post('/api/submit', {
        //     name: this.name,
        //     email: this.email,
        //     select: this.select,
        //     checkbox: this.checkbox
        //   })
        }
      }
    }
  }
</script>

<style>
  .pad {
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
