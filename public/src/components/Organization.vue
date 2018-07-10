<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm4 md4>
      <v-card height="180px">
          <v-card-text>
            <h3>Organization Name</h3>
            <h2>{{ organization_name }}</h2>
          </v-card-text>
      </v-card>
      </v-flex>
      <v-flex xs12 sm4 md4>
      <v-card height="180px">
          <v-card-text>
            <h3>Number of Users</h3>
            <h2>{{ user_count }}</h2>
          </v-card-text>
      </v-card>
      </v-flex>
      <v-flex xs12 sm4 md4>
      <v-card height="180px">
          <v-card-text>
            <h3>Number of Robots</h3>
            <h2>{{ bot_count }}</h2>
          </v-card-text>
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
        organization_name : '',
        bot_count : '',
        user_count : '',
        token: ''
    }),
    methods: {
      fetchOrganization() {
        let uri = functions.getApiPath() + 'getOrganization';       
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.organization_id}}).then((response) => {
            this.organization_name = response.data.organization_name;
            this.user_count =  response.data.number_of_users;
            this.bot_count = response.data. number_of_bots;
        })
      }
    },
    created: function() {       
      this.token = 'Bearer ' + this.getToken;
      functions.fetchUser(this.token).then((response) => {       
        this.organization_id = response.organization_id
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