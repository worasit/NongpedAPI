const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('winston');
const mongoose = require('mongoose');
const config = require('./configManager');

const app = express();
const port = process.env.PORT || config.apiPort;
const healthcheckRouter = require('./app/routes/healthcheck');
const customerRouter = require('./app/routes/customer');

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

app.listen(port, () => {
  logger.info(`The NongPed API is now running at port:${port}`);
  logger.info(`Using configuration for ${config.environment} enviroment`);
  logger.info(JSON.stringify(config));
});

module.exports = app;
