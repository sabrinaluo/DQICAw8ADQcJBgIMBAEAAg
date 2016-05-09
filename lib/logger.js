'use strict';
const bunyan = require('bunyan');
const config = require('../config').get('logger');

module.exports = bunyan.createLogger(config);
