var mongoose = require('mongoose')

// Define schema for Robot

var robot = new mongoose.Schema({
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
}
)

module.exports = mongoose.model('Robot', robot)