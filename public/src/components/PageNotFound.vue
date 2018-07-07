<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm7 md5>
            <v-card class="elevation-5">
              <v-card-text>                  
                  <v-card-text>
                      <v-flex class="text-xs-center">
                        <span class="display-4">404</span><br>
                        <span>Page you're looking for doesn't exist</span>
                      </v-flex>
                      <v-flex md12 class="text-xs-center">
                        <v-btn style="width:50%" outline color="light-blue accent-2" dark to="/login">Take me to Home</v-btn>
                      </v-flex> 
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
      
    }),
    methods: {
      
    },
    props: {
      source: String
    }
  }
</script>