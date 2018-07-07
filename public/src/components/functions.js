import axios from 'axios';

export default {
    getApiPath(){
      return 'http://localhost:8080/api/'; //https://tbot-web-rtc.herokuapp.com/api/';
    },
    getTimeInfo(context, time_stamp) {
        var today = context.$moment();
        var last_used_time;
        if(today.diff(time_stamp, 'seconds') > 60){
          if(today.diff(time_stamp, 'minutes') > 60){
            if(today.diff(time_stamp, 'hours') > 24){
              last_used_time = today.diff(time_stamp, 'days') + " days ago"
            }else{
              last_used_time = today.diff(time_stamp, 'hours') + " hours ago"
            }
          }else{
            last_used_time = today.diff(time_stamp, 'minutes') + " minutes ago"
          }
        }else{
          last_used_time = today.diff(time_stamp, 'seconds') + " seconds ago"
        }
        return last_used_time; 
    },
    fetchUser(token) {
        let uri = 'http://localhost:8080/api/getUser'; //https://tbot-web-rtc.herokuapp.com/api/getUser' //'http://localhost:8080/api/getUser';
        //var authHeader = 'Bearer ' + token;        
        return new Promise(function(resolve){
            axios({ method: 'post', url: uri, headers: { Authorization: token}}).then((response) => {
                resolve(response.data);            
            })
        })
    }
}
