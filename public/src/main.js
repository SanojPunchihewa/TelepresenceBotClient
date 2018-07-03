// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'
import PhotoUpload from 'vue-photo-upload'  

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import { store } from './store/store';

// Import Views - Top level
import AppView from './components/App.vue'
import RegisterCompany from './components/RegisterCompany'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import PendingApproval from './components/PendingApproval'
import Dash from './components/Dash.vue'
import DashBoardView from './components/Dashboard.vue'
import ProfileView from './components/Profile.vue'
import BotInfoView from './components/BotInfo'
import VideoStreamView from './components/VideoStream.vue'
import NotificationsView from './components/Notifications'
import UsersView from './components/Users'
import OrganizationView from './components/Organization'
import Upload from './components/Upload'
import ForgotPassword from './components/ForgotPassword'

Vue.use(Vuetify, {
  theme: {
    primary: '#00B0FF', //
    secondary: "#00E5FF",
    accent: "#FFC107"
  }
})

Vue.use(PhotoUpload)
Vue.use(VueMoment)
Vue.use(VueRouter)

const requireAuth = function(to, from, next) {
  // check for valid auth token
  if(store.getters.isLoggedIn){
    next();
  }else{
    window.location.href = "/login";
  }
};

const routes = [
  {path: '/register', component: Register, props: true},
  {path: '/upload', component:Upload},
  {path: '/forgotPassword', component:ForgotPassword},
  {path: '/pendingApproval', component: PendingApproval, props: true},
  {path: '/registerCompany', component: RegisterCompany},
  {path: '/login', component: Login},
  {path: '/', component: Login},
  {path: '/', component: Dash,
    children: [
      {
        path: 'dashboard',
        component: DashBoardView,
        name: 'Dashboard',
        meta: {description: 'Overview of the Robots'},
        beforeEnter: requireAuth
      },
      {
        path: 'profile',
        component: ProfileView,
        name: 'Profile',
        meta: {description: 'Edit Your Profile Settings'},
        beforeEnter: requireAuth
      },
      {
        path: 'video-stream/:botId',
        component: VideoStreamView,
        name: 'Video Streaming',
        meta: {description: 'p2p video streaming with the robot'},
        props: true,
        beforeEnter: requireAuth
      },
      {
        path: 'bot-info/:botId',
        component: BotInfoView,
        name: 'Bot Info',
        meta: {description: 'Details about the Bot'},
        props: true,
        beforeEnter: requireAuth        
      },
      {
        path: 'notifications',
        component: NotificationsView,
        name: 'Notifications',
        meta: {description: 'All your messages are here'},
        beforeEnter: requireAuth
      },
      {
        path: 'users',
        component: UsersView,
        name: 'Users',
        meta: {description: 'Show all the registered users'},
        beforeEnter: requireAuth
      },
      {
        path: 'organization',
        component: OrganizationView,
        name: 'Organization',
        meta: {description: 'Show all info about the Organization'},
        beforeEnter: requireAuth
      }
    ]
  }
];

// Routing logic
var router = new VueRouter({  
  routes: routes,
  mode: 'history'
  // linkExactActiveClass: 'active',
  // scrollBehavior: function(to, from, savedPosition) {
  //   return savedPosition || { x: 0, y: 0 }
  // }
})

new Vue({
  el: '#root',
  store,
  router: router,
  render: h => h(AppView)
})
