const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  name: {
    type: String
  },
  items: {
    type: Array
  },
  deliveredTime: {
    type: Date
  }
}, {
  collection: 'orders',
  versionKey: false
});

module.exports = mongoose.model('Order', OrderSchema);
