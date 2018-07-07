<template>
  <div>
    <v-dialog v-model="dialog_noti_action" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">Notifications</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md text-xs-center>
            <v-layout wrap>
              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <v-avatar
                  :tile="User"
                  :size="100">
                  <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="avatar">
                  </v-avatar>                
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.first_name" label="First Name" disabled></v-text-field>
                  <v-text-field v-model="editedItem.last_name" label="Last Name" disabled></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>                
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.display_name" label="Username" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.email" label="Email Address" disabled></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>                
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.office_phone" label="Office Phone" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.mobile_phone" label="Mobile Phone" disabled></v-text-field>
                </v-flex>
              </v-layout> 
              <v-layout row wrap v-if="editedItem.account_status == 'Approved'">
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.account_type" label="Account Type" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.account_status" label="Account Status" disabled></v-text-field>
                </v-flex>
              </v-layout> 
              <v-form v-else ref="form" v-model="valid" lazy-validation>
                <v-flex xs12>
                <v-radio-group style="padding:0;margin:0" :rules="account_typeRules" label="Choose an account type" v-model="account_type" required row wrap>
                  <v-radio label="User" value="user"></v-radio>
                  <v-radio label="Admin" value="admin"></v-radio>
                </v-radio-group>
                </v-flex>         
              </v-form>    
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions v-if="editedItem.account_status == 'pending'">
          <v-spacer></v-spacer>
          <v-btn color="pink darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="teal darken-1" flat @click.native="approve(editedItem._id)">Accept</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn color="teal darken-1" flat @click.native="dialog_noti_action = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>      
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="notifications"
        :search="search">
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{ read: (props.item.is_read == 'true') }">
          <td @click="editItem(props.item)">{{ props.item.notification }}</td>
          <td class="text-xs-right" @click="editItem(props.item)">{{ props.item.notification_desc }}</td>
          <td class="text-xs-right" @click="editItem(props.item)">{{ props.item.date }}</td>
          <td class="justify-center layout px-0">
            <v-tooltip bottom>
              <v-btn slot="activator" flat icon color="gray" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
              </v-btn>        
              <span>Delete</span>
            </v-tooltip>  
            <v-tooltip bottom>
              <v-btn slot="activator" flat icon color="gray" @click="markAsRead(props.item)">
              <v-icon v-if="props.item.is_read == 'true'" color="green">undo</v-icon>
              <v-icon v-else color="green">done</v-icon>
              </v-btn>        
              <span v-if="props.item.is_read == 'true'">Mark As Unread</span>
              <span v-else>Mark As Read</span>
            </v-tooltip>  
          </td>
          </tr>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      bottom
      :timeout="4000">
      {{ snackbar_text }}
      <v-btn
        v-if="show_snackBar_btn"
        color="pink"
        flat
        @click="snackbar = false">
        Undo
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios';
  import functions from './functions'
  export default {
    data () {
      return {
        show_snackBar_btn:false,
        snackbar: false,
        snackbar_text: '',
        user: {},
        dialog_noti_action: false,
        account_type: '',
        account_typeRules: [
          v => !!v || 'Account type is required'
        ],
        search: '',
        headers: [
          {
            text: 'Notification',
            align: 'left',
            sortable: false,
            value: 'notification',
            width: '20%'
          },
          { text: 'Description', sortable: false, value: 'notification_desc' , align: 'center', width: '47%'},
          { text: 'Date', sortable: false, value: 'date' , align: 'center', width: '17%'},
          { text: 'Actions', sortable: false, value: '' , align: 'center' , width: '16%'}
        ],
        notifications: [],       
        editedIndex: -1,
        editedItem: {
          _id: '',
          notification: '',
          notification_meta: '',
          full_date: '',
          is_read: ''
        },
        defaultItem: {
          _id: '',
          notification: '',
          notification_meta: '',
          full_date: '',
          is_read: ''
        },
        token : '',
      }
    },    
    computed: {
      getToken() {
        return this.$store.getters.getToken;
      },
      formTitle () {
        return 'User Request'
      }
    },
    created () {
      this.token = 'Bearer ' + this.getToken;
      functions.fetchUser(this.token).then((response) => {
          this.user = response;
          if(this.user.account_type == 'admin'){
            this.fetchAdminNotifications()
          }else{
            this.fetchUserNotifications()
          }
      })
    },
    methods: {
      fetchUserById (id){
        let uri = functions.getApiPath() + 'getUserById';             
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'user_id' : id}}).then((response) => {
            let new_user = response.data;
            this.editedItem = Object.assign({}, new_user)
            this.dialog_noti_action = true
        })
      },
      addToArray(data) {
        data.forEach(element => {
          var time_stamp = new Date(parseInt( element._id.toString().substring(0,8), 16 ) * 1000 )
          var full_date = this.$moment(time_stamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
          var last_used_time = functions.getTimeInfo(this, time_stamp)
          var user = element.user_name;
          this.notifications.push({
            _id: element._id,
            notification: element.notification_type,
            notification_desc: element.notification,
            notification_meta: element.notification_meta,
            is_read: element.is_read,
            date: last_used_time,
            full_date: full_date
          })
        })
      },
      fetchAdminNotifications() {
        let uri = functions.getApiPath() + 'getAdminNotification';       
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.user.organization_id}}).then((response) => {
            this.addToArray(response.data)          
        })
      },
      fetchUserNotifications() {
        let uri = functions.getApiPath() + 'getUserNotification'; 
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'user_id' : this.user._id}}).then((response) => {          
            this.addToArray(response.data)
        })
      },
      markAsRead(item) {
        let read;
        if(item.is_read == 'true'){
          read = 'false'
          this.snackbar_text = 'Marked as unread'
        }else{
          read = 'true'
          this.snackbar_text = 'Marked as read'
        }       
        let uri = functions.getApiPath() + 'updateNotification';       
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'notification_id': item._id, 'is_read' : read}}).then((response) => {
            console.log(response.data)
            if(response.data == 'ERR'){
              this.snackbar_text = 'Something went wrong'
            }
            this.snackbar = true
        })
      },
      approve (id) {
        if (this.$refs.form.validate()) {         
          let uri = functions.getApiPath() + 'approveUser';             
          axios({ method: 'post', url: uri, headers: { Authorization: this.token}, 
                data: {'id' : id, 'account_status' :'Approved', 'account_type' : this.account_type}
          }).then((response) => {
            this.dialog_edit = false
            if(response.data == 'OK'){
              this.snackbar_text = 'Account Approved'  
              uri = functions.getApiPath() + 'updateNotification';       
              axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'notification_id': item._id, 'is_read' : 'true'}})
              this.fetchUsers();         
              // Sent an email notification
              let uri = functions.getApiPath() + 'sendEmail'; 
              axios({ method: 'post', url: uri, data: {
                'email' : this.editedItem.email, 
                'subject' : 'Account Approved', 
                'text': 'Hello,\n\n' +'Please note that your account has been successfully approved!'}
              }).then((response) => {  
                if(response.data == 'OK'){  
                  this.snackbar_color = 'success'
                  this.snackbar_text = 'Email notification sent'
                  this.snackbar = true
                }
              });   
            }else{
              this.snackbar_text = 'Something went wrong!'   
            }
            this.snackbar = true                    
          })
        }
      },
      editItem (item) {
        if(item.notification == "New User Request"){
          this.fetchUserById(item.notification_meta)          
        }
      },
      deleteItem (item) {
        const index = this.notifications.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },
      close () {
        this.dialog_noti_action = false       
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      }      
    }
  }
</script>

<style>
  .read {
    color: rgb(80, 80, 80);
    background:#F2F4F4
  }
</style>
