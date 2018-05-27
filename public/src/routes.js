import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
// import NotFoundView from './components/404.vue'

// // Import Views - Dash
// import DashboardView from './components/views/Dashboard.vue'
import TablesView from './components/Tables.vue'
// import TasksView from './components/views/Tasks.vue'
// import SettingView from './components/views/Setting.vue'
// import AccessView from './components/views/Access.vue'
// import ServerView from './components/views/Server.vue'
// import ReposView from './components/views/Repos.vue'

// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: DashView,
    children: [
      // {
      //   path: 'dashboard',
      //   alias: '',
      //   component: DashboardView,
      //   name: 'Dashboard',
      //   meta: {description: 'Overview of environment'}
      // }, 
      {
        path: 'dashboard',
        component: TablesView,
        name: 'Tables',
        meta: {description: 'Simple and advance table in CoPilot'}
      }
    ]
  }, {
    // not found handler    
    path: '*',
    component: LoginView
  }
]

export default routes
