'use strict';

const fivebeans = require('fivebeans');
const shortid = require('shortid');
const config = require('../config').get('beanstalkd');

const handler = require('./handler');
const log = require('./logger');

class Consumer {
	/**
	 * create a consumer
	 * @param {string} tube_name -  which tube should the consumer watch
	 */
	constructor(tube_name) {
		this.id = shortid.generate();
		this.tube_name = tube_name;
	}

	/**
	 * start consuming jobs in tube, handle job by the specified job handler
	 */
	start() {
		let options = {
			id: this.id, // worker id
			host: config.host,
			port: config.port,
			handlers: {
				exchange_rate: new handler.ExchangeRateHandler(this)
			},
			ignoreDefault: true
		};
		let worker = new fivebeans.worker(options);
		worker.start([this.tube_name]); // consumer watches tubes in the list
		log.info(this, 'consumer starts');
	}
}

module.exports = Consumer;
