<template>
  <div>
    <v-dialog v-model="dialog_1" max-width="500px">      
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
                  <v-text-field v-model="editedItem.type" label="First Name" disabled></v-text-field>
                  <v-text-field v-model="editedItem.type" label="Last Name" disabled></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>                
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.type" label="User Name" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.type" label="Email Address" disabled></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="pink darken-1" flat @click.native="close">Reject</v-btn>
          <v-btn color="teal darken-1" flat @click.native="save">Accept</v-btn>
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
        :items="desserts"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td v-bind:class="{ unread: props.item.isUnread }" @click="editItem(props.item)">{{ props.item.type }}</td>
          <td class="text-xs-right" @click="editItem(props.item)">{{ props.item.desc }}</td>
          <td class="text-xs-right" @click="editItem(props.item)">{{ props.item.date }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        headers: [
          {
            text: 'Notification',
            align: 'left',
            sortable: false,
            value: 'type',
            width: '25%'
          },
          { text: 'Description', value: 'desc' , align: 'center', width: '51%'},
          { text: 'Date', value: 'date' , align: 'center', width: '12%'},
          { text: 'Actions', value: '' , align: 'center' , width: '12%'}
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
          type: '',
          desc: 0,
          dates: 0
        },
        defaultItem: {
          type: '',
          desc: 0,
          dates: 0
        }
      }
    },
    computed: {
      formTitle () {
        return 'User Request'
      }
    },
    watch: {
      dialog_1 (val) {
        val || this.close()
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.desserts = [
          {
            value: false,
            isUnread: true,
            type: 'New User Request',
            desc: 'User Bruce Wayne wants to connect',
            date: '8.00pm'
          },
          {
            value: false,
            isUnread: true,
            type: 'Bot Error',
            desc: 'Bot one has shutdown',
            date: '1.00pm'
          },
          {
            value: false,
            isUnread: true,
            type: 'Eclair',
            desc: 262,
            date: '8.00am'
          },
          {
            value: false,
            isUnread: false,
            type: 'Cupcake',
            desc: 305,
            date: '24.05.2018'
          },
          {
            value: false,
            isUnread: false,
            type: 'Gingerbread',
            desc: 356,
            date: '24.05.2018'
          },
          {
            value: false,
            isUnread: false,
            type: 'Jelly bean',
            desc: 375,
            date: '24.05.2018'
          },
          {
            value: false,
            isUnread: false,
            type: 'Lollipop',
            desc: 392,
            date: '24.05.2018'
          },
          {
            value: false,
            isUnread: false,
            type: 'Honeycomb',
            desc: 408,
            date: '24.05.2018'
          },
          {
            value: false,
            isUnread: false,
            type: 'Donut',
            desc: 452,
            date: '24.05.2018'
          },
          {
            value: false,
            isUnread: false,
            type: 'KitKat',
            desc: 518,
            date: '24.05.2018'
          }
        ]
      },
      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog_1 = true
      },
      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },
      close () {
        this.dialog_1 = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>

<style>
  .unread {    
    color: darkcyan;
  }
</style>
