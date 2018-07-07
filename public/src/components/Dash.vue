<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
      dark>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.display_name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" :to="item.path == '#' ? '' : item.path" active-class="cyan--text">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"      
      dark
      app
      fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>        
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon large to='/notifications'>
        <v-badge overlap color="red">
        <span slot="badge" v-if="notification_count > 0">{{ notification_count }}</span>      
        <v-icon dark>notifications</v-icon>      
        </v-badge>
      </v-btn>      
      <v-menu offset-y :nudge-width="200" style="right:5px">
        <v-btn icon large slot="activator">
        <v-avatar size="32px">
          <img
            src="https://randomuser.me/api/portraits/men/85.jpg"
            alt="Vuetify"
          >
        </v-avatar>
        </v-btn>        
        <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://vuetifyjs.com/static/doc-images/john.jpg" alt="John">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title> {{full_name}} </v-list-tile-title>
              <v-list-tile-sub-title> {{ organization_name }} </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>         
          <v-btn color="red accent-3" flat @click="menu = false , dialog = true">Logout</v-btn>          
        </v-card-actions>
      </v-card>
      </v-menu>
    </v-toolbar>
    <v-content>
      <div>
        <v-dialog v-model="dialog" max-width="500px">      
          <v-card>
            <v-card-title>
              <span class="headline">Sign Out</span>
            </v-card-title>
            <v-card-text>
              <v-span v-if="isLoggedIn">Are you sure ?</v-span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.native="dialog = false">No</v-btn>
              <v-btn color="red accent-3" flat @click.native="logout">Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      <v-container fluid>
        <!-- Content Header (Page header) -->
        <!-- <section>
          <h1>
            {{$route.name.toUpperCase() }}
            <small>{{ $route.meta.description }}</small>
          </h1>          
        </section> -->
        <router-view></router-view>
      </v-container>
      </div>
    </v-content>    
  </v-app>
</template>

<script>
  import axios from 'axios';
  import functions from './functions'
  export default {
    data: () => ({           
      notification_count: 0,
      organization_name: '',
      organization_id: '',
      user: {},
      dialog: false, 
      drawer: true,
      items: [],
      right: null,
      token: ''
    }),
    methods: {
      logout () {
        this.dialog = false
        this.$store.dispatch('logout');
        window.location.href = "/login";
      },
      fetchOrganization() {
        let uri = functions.getApiPath() + 'getOrganization';        
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.organization_id}}).then((response) => {
            this.organization_name = response.data.organization_name;
        })
      },
      fetchNotificationCount() {
        let uri = functions.getApiPath() + 'getNotificationCount';       
        let data = {};
        if(this.user.account_type == 'admin'){
          data = {'organization_id' : this.organization_id}
        }else{
          data = {'user_id' : this.user._id}          
        }
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: data}).then((response) => {
            this.notification_count = response.data
        })
      },
      populateNavDrawer(){
        this.items = [
          { title: 'Dashboard', icon: 'dashboard', path: '/dashboard'},
          { title: 'Profile', icon: 'person', path: '/profile' },
          { title: 'Notifications', icon: 'notifications', path: '/notifications' }
        ];
        if(this.user.account_type == 'admin'){
          this.items.push({ title: 'Users', icon: 'people', path: '/users' })
          this.items.push({ title: 'Organization', icon: 'group_work', path: '/organization' })
        }
      },
      destroy() {
        //this.$store.dispatch('logout');
      }
    },
    
    created: function() {       
      this.token = 'Bearer ' + this.getToken;
      functions.fetchUser(this.token).then((response) => {
        this.user = response;
        this.organization_id = this.user.organization_id;
        this.fetchNotificationCount()           
        this.populateNavDrawer();
        this.fetchOrganization();
      });
      window.addEventListener('beforeunload', this.destroy)
    },

    beforeDestroy: function(){
      // alert('Log Out')
      // if(this.isLoggedIn){
        
      //   this.$store.dispatch('logout');
      // }      
    },

    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      getToken() {
        return this.$store.getters.getToken;
      },
      full_name() {
        return (this.user.first_name + " " + this.user.last_name)
      }
    },
    props: {
      source: String
    }
  }
</script>
