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
              <v-list-tile-title>John Leider</v-list-tile-title>
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
        <span slot="badge">3</span>      
        <v-icon dark>notifications</v-icon>      
        </v-badge>
      </v-btn>      
      <v-tooltip bottom>
      <v-btn icon large slot="activator" @click.native.stop="dialog = true">
        <v-avatar size="32px" tile>
          <img
            src="https://vuetifyjs.com/static/doc-images/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
      <span>Sign out</span>
      </v-tooltip>
      <!-- <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://vuetifyjs.com/static/doc-images/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn> -->
    </v-toolbar>
    <v-content>
      <div>
        <v-dialog v-model="dialog" max-width="500px">      
          <v-card>
            <v-card-title>
              <span class="headline">Sign Out</span>
            </v-card-title>
            <v-card-text>
              <v-span v-if="isLoggedIn">You curent logged In</v-span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.native="dialog = false">No</v-btn>
              <v-btn color="green darken-1" flat @click.native="logout">Logout</v-btn>
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
  export default {
    data: () => ({
      dialog: false, 
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'dashboard', path: '/dashboard'},
        { title: 'Profile', icon: 'person', path: '/profile' },
        { title: 'Notifications', icon: 'notifications', path: '/notifications' }
      ],
      right: null
    }),
    methods: {
      logout () {
        this.dialog = false
        this.$store.dispatch('logout');
        this.$router.push('login') 
      },
      populateNavDrawer(){
        items = [
          { title: 'Dashboard', icon: 'dashboard', path: '/dashboard'},
          { title: 'Profile', icon: 'person', path: '/profile' },
          { title: 'Notifications', icon: 'notifications', path: '/notifications' }
        ];
        if(user == 'Admin'){
          items.push({ title: 'Users', icon: 'people', path: '/users' })
        }
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      }
    },
    props: {
      source: String
    }
  }
</script>
