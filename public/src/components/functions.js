import axios from 'axios';

export default {
    getApiPath(){
      return 'https://tbot-web-rtc.herokuapp.com/api/' //'http://localhost:8080/api/'
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
        let uri =  'https://tbot-web-rtc.herokuapp.com/api/getUser' //'http://localhost:8080/api/getUser';
        return new Promise(function(resolve){
            axios({ method: 'post', url: uri, headers: { Authorization: token}}).then((response) => {
                resolve(response.data);            
            })
        })
    }
}
