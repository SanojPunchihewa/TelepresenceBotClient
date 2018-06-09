var mongoose = require('mongoose')

// Define schema for User

var user = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  office_phone: {
    type: String
  },
  mobile_phone: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  diplay_name: {
    type: String,
    required: true
  },
  account_type: {
    type: String,
    required: true
  },
}
)

module.exports = mongoose.model('User', user)