const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('winston');
const mongoose = require('mongoose');
const config = require('./configManager');

const app = express();
const port = process.env.PORT || config.port;
const healthcheckRouter = require('./app/routes/healthcheck');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/healthcheck', healthcheckRouter);

mongoose.connect('mongodb://192.168.99.100/nongped', (err) => {
  if (err) logger.error(err);
  logger.info('Open connection to mongodb://192.168.99.100/nongped');
});

app.listen(port, () => {
  logger.info(`The NongPed API is now running at port:${port}`);
  logger.info(`Using configuration for ${config.environment} enviroment`);
  logger.info(JSON.stringify(config));
});

module.exports = app;