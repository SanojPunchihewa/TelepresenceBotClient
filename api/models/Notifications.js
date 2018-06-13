var mongoose = require('mongoose')

// Define schema for Notification

var notification = new mongoose.Schema({
  notification_type: {
    type: String,
    required: true
  },
  robot_name: {
    type: String,
    required: true
  },
  battery_level: {
    type: String,
    required: true
  },
  robot_status: {
    type: String,
    required: true
  }
},
{
  collection: 'notifications'
}
)

module.exports = mongoose.model('Notification', notification)