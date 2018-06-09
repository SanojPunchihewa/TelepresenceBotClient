<template>
    <v-layout child-flex>
        <v-data-table
        :headers="headers"
        :items="robots"
        hide-actions
        class="elevation-1"
        >
        <template slot="items" slot-scope="props">
        <td>{{ props.item.robot_name }}</td>
        <td class="text-xs-center">{{ props.item.robot_status }}</td>
        <td class="text-xs-center">{{ props.item.battery_level }}</td>
        <td class="text-xs-center">
          <v-btn v-if="props.item.robot_status == 'Available'" outline color="indigo" to='/video-stream/abcd1234'>Connect</v-btn>
          <v-btn v-else disabled>Busy</v-btn>
        </td>
        <td class="text-xs-center">
          <v-tooltip bottom>
            <v-btn slot="activator" flat icon color="gray">
            <v-icon>info</v-icon>
            </v-btn>        
            <span>More Info</span>
          </v-tooltip>          
        </td>
        </template>
        </v-data-table>
    </v-layout>  
</template>

<script>
  import axios from 'axios';
  export default {
    data () {
      return {
        headers: [
          {
            text: 'Robot Name',
            align: 'left',
            value: 'robot_name'
          },
          { text: 'Status', value: 'robot_status', align: 'center'},
          { text: 'Battery Level', value: 'battery_level', align: 'center' },
          { text: ' ', value: '', align: 'center'},
          { text: ' ', value: '', align: 'center'}
        ],
        robots: [
          // {
          //   name: 'Robot Floor-1',
          //   status: 'Available',
          //   battery: '60%',
          // },
          // {
          //   name: 'Robot Floor-2',
          //   status: 'Busy',
          //   battery: '80%'
          // },
          // {
          //   name: 'Robot Floor-3',
          //   status: 'Locked',
          //   battery: '40%'
          // },
          // {
          //   name: 'Robot Floor-4',
          //   status: 'Charging',
          //   battery: '5%'
          // }
        ]
      }
    },
    created: function() { // get Robots and start listening to events once component is created
      this.fetchRobots();
      //this.listenToEvents();
    },
    methods: {
      fetchRobots() {
        let uri = 'http://localhost:8080/api/allRobots';
        axios.get(uri).then((response) => {
            this.robots = response.data;
            console.log(response.data);
        });
      }
      // updateTodo(todo) {
      //     let id = todo._id;
      //     let uri = 'http://localhost:3000/api/update/' + id;
      //     todo.editing = false;
      //     axios.post(uri, todo).then((response) => {
      //         console.log(response);
      //     }).catch((error) => {
      //         console.log(error);
      //     })
      // },
      // deleteTodo(id) { //delete todo item
      //     let uri = 'http://localhost:3000/api/delete/' + id;
      //     axios.get(uri);
      //     this.fetchTodo();
      // },
      // listenToEvents() {
      //     bus.$on('refreshTodo', ($event) => {
      //         this.fetchTodo(); // referesh or update todo list on the page
      //     })
      // }
    }
  }
</script>