const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

module.exports.getMockedApp = () =>
  mockgoose(mongoose)
    .then(() => mongoose.connect('mongodb://localhost/testDb'))
    .then(() => require('../app')); // eslint-disable-line global-require

