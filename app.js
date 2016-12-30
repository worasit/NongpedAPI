'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('winston');
const mongoose = require('mongoose');
const config = require('./configManager');
const fs = require('fs');
const path = require('path');
// const https = require('https');
const healthcheckRouter = require('./app/routes/healthcheck');
const customerRouter = require('./app/routes/customer');

const app = express();
const port = process.env.PORT || config.apiPort;
// const options = {
//   key: fs.readFileSync('./keys/client-key.pem'),
//   cert: fs.readFileSync('./keys/client-cert.pem')
// };

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/healthcheck', healthcheckRouter);
app.use('/customers', customerRouter);
mongoose.Promise = global.Promise;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(config.dbConnectionString, (err) => {
    if (err) logger.error(err);
    logger.info(`Open database connection to ${config.dbConnectionString}`);
  });
}
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(express.static(path.join(__dirname, '/swagger')));
app.get('/api-docs(/:api)?', (req, res) => {
  let f = req.params.api || 'swagger';
  if (!/\.json$/i.test(f)) {
    f += '.json';
  }
  fs.readFile(path.join(__dirname, '/api-docs/', f), { encoding: 'UTF-8' }, (error, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  });
});

// https.createServer(options, app).listen(port, () => {
//   logger.info(`The NongPed API is now running at port: ${port}`);
//   logger.info(`Using configuration for ${config.environment} enviroment`);
//   logger.info(JSON.stringify(config));
// });

app.listen(port, () => {
  logger.info(`The NongPed API is now running at port: ${port}`);
  logger.info(`Using configuration for ${config.environment} enviroment`);
  logger.info(JSON.stringify(config));
});

module.exports = app;
