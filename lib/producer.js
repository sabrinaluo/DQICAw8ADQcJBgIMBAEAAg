'use strict';

const bluebird = require('bluebird');
const co = require('co');
const fivebeans = bluebird.promisifyAll(require('fivebeans'));
const log = require('./logger');
const config = require('../config').get('beanstalkd');

const TIME_TO_RUN = 60; // seconds
const PRIORITY = 0; // 0 ~ 2^32-1, small number for high priority

class Producer {
	/**
	 * create a producer
	 * @param {string} tube_name -  which tube should producer work with
	 */
	constructor(tube_name) {
		this.tube_name = tube_name;
		this.config = config;
	}

	/**
	 * put job into tube
	 * @param {string} payload - job payload
	 * @param {number} [delay=0] - delay in seconds
	 * @return {Promise.<string|Error>} resolve with job_id, reject with error
	 */
	put(payload, delay) {
		log.debug('Producer.put');
		delay = delay || 0;
		let client = new fivebeans.client(this.config.host, this.config.port);
		let _this = this;

		return new Promise((resolve, reject) => {
			co(function* () {
				client.connect();
				client.on('error', err => {
					log.error('beanstalkd connect error, exit', {error: err});
					process.exit(1);
				});

				try {
					yield client.onAsync('connect');
					yield client.useAsync(_this.tube_name);
					let job_id = yield client.putAsync(PRIORITY, delay, TIME_TO_RUN, payload);
					client.end();
					resolve(job_id);
					log.info('put job success', {
						payload: payload,
						job_id: job_id
					});
				} catch (e) {
					reject(e);
					log.error('put job error', {error: e});
				}
			});
		});
	}
}

module.exports = Producer;
