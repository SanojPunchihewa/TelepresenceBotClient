<template>
  <div>
    <v-dialog v-model="dialog_info" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">User Information</span>
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
              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.account_type" label="Account Type" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.account_status" label="Account Status" disabled></v-text-field>
                </v-flex>
              </v-layout>        
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog_info = false">Close</v-btn>     
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_invite" max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline">Invite Users</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
          <v-flex>
            <v-text-field name="email" label="Email Address" type="text" v-model="email" required></v-text-field>
            <small>*Indicates a required field</small>
          </v-flex>
          <v-flex class="text-xs-center">
            <v-btn color="blue" outline @click="sendEmailInvitation">Send Invitation</v-btn>
          </v-flex>    
          <v-divider style="margin-top:15px">
          </v-divider>
          <v-layout row wrap>
            <v-flex sm10 class="text-xs-center">
              <v-text-field id="link" v-model="this.invitation_link" disabled></v-text-field>
            </v-flex>   
            <v-flex class="text-xs-center">
              <v-tooltip right>
                <v-btn slot="activator" @click="copyLink()" flat icon color="gray">
                <v-icon>file_copy</v-icon>
                </v-btn>        
                <span>Copy Link</span>
              </v-tooltip>
            </v-flex>
          </v-layout>  
          </v-form>           
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_edit" persistent max-width="500px">      
      <v-card>
        <v-card-title>
          <span class="headline" v-if="block_user">Block User</span>
          <span class="headline" v-else-if="un_block_user">Unblock User</span>
          <span class="headline" v-else-if="approve_user">Approve User</span>
        </v-card-title>
        <v-card-text v-if="block_user">
          <v-span>Are you sure you want to block {{ editedItem.display_name }}?</v-span>
        </v-card-text>
        <v-card-text v-else-if="un_block_user">
          <v-span>Are you sure you want to unblock {{ editedItem.display_name }}?</v-span>
        </v-card-text>
        <v-card-text v-else-if="approve_user">         
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-flex xs12>
            <v-radio-group style="padding:0;margin:0" :rules="account_typeRules" label="Choose an account type" v-model="account_type" required row wrap>
              <v-radio label="User" value="user"></v-radio>
              <v-radio label="Admin" value="admin"></v-radio>
            </v-radio-group>
            </v-flex>         
          </v-form> 
          <small>*Indicates required fields</small>
        </v-card-text>
        <v-card-actions v-if="block_user">
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog_edit = false">No</v-btn>
          <v-btn color="red accent-3" flat @click.native="changeStatus(editedItem._id, 'Blocked')">Block</v-btn>
        </v-card-actions>
        <v-card-actions v-else-if="un_block_user">
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog_edit = false">No</v-btn>
          <v-btn color="red accent-3" flat @click.native="changeStatus(editedItem._id, 'Approved')">Unblock</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog_edit = false">No</v-btn>
          <v-btn color="red accent-3" flat @click.native="approve(editedItem._id)">Approve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>      
        <span class="headline">All Users</span>
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
        :items="users"
        :search="search"
      >
        <template slot="items" slot-scope="props">          
          <td class="text-xs-center" >{{ props.item.first_name }}</td>
          <td class="text-xs-center" >{{ props.item.last_name }}</td>
          <td class="text-xs-center" >{{ props.item.display_name }}</td>
          <td class="text-xs-center" >{{ props.item.account_status }}</td>
          <td class="justify-center layout px-0">
            <v-tooltip bottom>
                <v-btn slot="activator" flat icon color="gray" @click="moreInfo(props.item)">
                <v-icon>info</v-icon>
                </v-btn>        
                <span>More Info</span>
            </v-tooltip>    
            <v-tooltip bottom>
                <v-btn slot="activator" flat icon color="green" @click="editItem(props.item)">
                <v-icon>edit</v-icon>
                </v-btn>        
                <span>Edit</span>
            </v-tooltip>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
    <v-btn
        absolute
        dark
        fab
        bottom
        right
        style="bottom:30px"
        color="green"
        @click.native="dialog_invite = true">
        <v-icon>add</v-icon>
    </v-btn>
    <v-snackbar
      v-model="snackbar"
      bottom     
      :color="snackbar_color"
      :timeout="3000">
      {{ snackbar_text }}
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'
  import functions from './functions'
  export default {
    data () {
      return {       
        snackbar: false,
        snackbar_text: '',
        snackbar_color: '',
        approve_user: false,
        block_user: false,
        un_block_user: false,
        organization_id: '',
        dialog_info: false,
        dialog_edit: false,
        dialog_invite: false,
        account_type: '',
        account_typeRules: [
          v => !!v || 'Account type is required'
        ],
        search: '',
        headers: [
          { text: 'First Name', align: 'center', value: 'first_name', width: '20%'},
          { text: 'Last Name', align: 'center', value: 'last_name', width: '20%'},
          { text: 'Username', align: 'center', value: 'display_name', width: '25%'},
          { text: 'Status' , align: 'center', value: 'account_status', width: '15%'},
          { text: 'Actions', value: '' , align: 'center' , width: '20%'}
        ],
        users: [],
        editedIndex: -1,
        editedItem: {      
          _id: '',   
          first_name: '',
          last_name: '',
          display_name: '',
          account_status: '',
          office_phone: '',
          mobile_phone: '',
          email: '',
          account_type: ''
        },
        defaultItem: {   
          _id: '',         
          first_name: '',
          last_name: '',
          display_name: '',
          account_status: '',
          office_phone: '',
          mobile_phone: '',
          email: '',
          account_type: ''
        },
        token: ''
      }
    },    
    computed: {
      invitation_link () {        
        return 'https://tbot-web-rtc.herokuapp.com/register?organizationId=' + this.organization_id;
      },
      getToken() {
        return this.$store.getters.getToken;
      }
    },
    created () {
      this.token = 'Bearer ' + this.getToken;
      functions.fetchUser(this.token).then((response) => {
        this.organization_id = response.organization_id;
        this.fetchUsers()
      });      
    },
    methods: {
      fetchUsers() {
        let uri = functions.getApiPath() + 'allUsers';      
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, data: {'organization_id' : this.organization_id}}).then((response) => {
            this.users = response.data;            
        })
      },
      editItem (item) {        
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        if(this.editedItem.account_status == 'Approved'){
          this.block_user = true;
          this.un_block_user = false;
          this.approve_user = false;
        }else if(this.editedItem.account_status == 'Blocked'){
          this.un_block_user = true;
          this.block_user = false;
          this.approve_user = false;
        }else{
          this.approve_user = true;
          this.block_user = false;
          this.un_block_user = false;
        }
        this.dialog_edit = true        
      },
      moreInfo (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog_info = true
      },
      approve (id) {
        if (this.$refs.form.validate()) {         
          let uri = functions.getApiPath() + 'approveUser';             
          axios({ method: 'post', url: uri, headers: { Authorization: this.token}, 
                data: {'id' : id, 'account_status' :'Approved', 'account_type' : this.account_type}
          }).then((response) => {
            this.dialog_edit = false
            this.addNotification(id, 'Welcome', 'Your account has been approved. You can use the bots now. Enjoy!')
            if(response.data == 'OK'){
              this.snackbar_color = 'success'
              this.snackbar_text = 'Account Approved'  
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
              this.snackbar_color = 'error'
              this.snackbar_text = 'Something went wrong!'   
            }
            this.snackbar = true                    
          })
        }
      },
      changeStatus(id, status) {
        let uri = functions.getApiPath() + 'updateUserStatus';             
        axios({ method: 'post', url: uri, headers: { Authorization: this.token}, 
              data: {'id' : id, 'account_status' : status}
        }).then((response) => {
          let type, desc;          
          status == 'Blocked' ? 
                    (type = 'Account Blocked', desc = 'Admin of the system has blocked your account') : 
                    (type = 'Welcome Back!', desc = 'Admin of the system has unblocked your account')          
          this.addNotification(id, type, desc)
          this.dialog_edit = false
          if(response.data == 'OK'){
            this.snackbar_color = 'success'
            this.snackbar_text = 'Account status changed'  
            this.fetchUsers();           
          }else{
            this.snackbar_color = 'error'
            this.snackbar_text = 'Something went wrong!'   
          }
          this.snackbar = true                    
        })
      },
      addNotification(id, type, desc) {
        let uri = functions.getApiPath() + 'addNotification';       
        let data = {
          user_id: id,
          organization_id: 'N/A',
          notification_type: type,
          notification: desc
        }            
        axios({ method: 'post', url: uri, data: data})
      },
      sendEmailInvitation() {
        if (this.$refs.form.validate()) {
          let uri = functions.getApiPath() + 'sendEmail'; 
          axios({ method: 'post', url: uri, data: {
            'email' : this.email, 
            'subject' : 'Invitation to use the Telepresence Robot Service', 
            'text': 'Hi,\n\n' +'We would like to invite you to become a user of the Telepresence Robot service. Register now to start collaborating!'}
          }).then((response) => {  
            if(response.data == 'OK'){  
              this.snackbar_color = 'success'
              this.snackbar_text = 'Email invitation sent'
              this.snackbar = true
              this.dialog_invite = false
            }
          }); 
        } 
      },
      copyLink () {
        const el = document.createElement('textarea');
        el.value = this.invitation_link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);       
        this.snackbar_color = 'success'
        this.snackbar_text = 'Link Copied'
        this.snackbar = true
        this.dialog_invite = false
      }
    }
  }
</script>
