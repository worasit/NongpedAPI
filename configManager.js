'use strict';

const config = require('config');
const mongodbUri = require('mongodb-uri');

let configInfo = config.get('config');

configInfo.dbConnectionString = mongodbUri.format(configInfo.db);

module.exports = configInfo;
