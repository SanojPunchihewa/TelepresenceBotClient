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
                    <h3 color="teal">Department of Computer Engineering</h3>
                    <h3 color="pink">Faculty of Engineering</h3></span>
                  </v-flex>
                </v-layout>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                </v-form>
                <v-flex md12 class="text-xs-center">
                  <v-btn color="indigo" dark>Login</v-btn>
                </v-flex>
                <v-flex md12 class="text-xs-center">
                  Don't have an account ?
                </v-flex>
                <v-flex md12 class="text-xs-center">
                  <v-btn outline color="indigo">Sign Up Now</v-btn>
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
  export default {
    data: () => ({
      drawer: null
    }),
    props: {
      source: String
    }
  }
</script>