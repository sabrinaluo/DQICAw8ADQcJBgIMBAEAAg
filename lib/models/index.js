'use strict';

const mongoose = require('mongoose');
const log = require('../logger');
const config = require('../../config').get('mongo');

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = require('bluebird');

mongoose.connect(config.url, function (err) {
	if (err) {
		log.error('mongodb connection error', err);
		process.exit(1);
	}
});

require('./exchange_rate');

module.exports.ExchangeRate = mongoose.model('ExchangeRate');
