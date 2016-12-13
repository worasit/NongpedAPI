const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  zip_code: {
    type: String
  }
}, {
  collection: 'customers',
  versionKey: false
});

module.exports = mongoose.model('Customer', CustomerSchema);
