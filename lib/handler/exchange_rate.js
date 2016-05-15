'use strict';

const co = require('co');
const Producer = require('../producer');
const Seed = require('../seed');
const helper = require('./helper');
const log = require('../logger');
const config = require('../../config').get('handler:exchange_rate');

const SUCCESS_LIMIT = config.success_limit;
const SUCCESS_DELAY = config.success_delay;
const FAIL_LIMIT = config.fail_limit;
const FAIL_DELAY = config.fail_delay;


class ExchangeRateHandler {
	/**
	 * create an exchange handler for consumer
	 * @param {Consumer} owner - which consumer owns the job
	 */
	constructor(owner) {
		this.tube_name = owner.tube_name;
		this.type = 'exchange_rate';
	}

	/**
	 * main function of handler, how this handler will handle the job
	 * @param {Seed} payload - payload from tube
	 * @param {function} callback - when job finishes, call it to notify beanstalkd to take an action
	 */
	work(payload, callback) {
		let _this = this;
		co(function* () {
			log.debug('ExchangeRateHandler.work');
			let from = payload.from;
			let to = payload.to;
			let success_times = payload.success_times;
			let fail_times = payload.fail_times;
			let next_job_delay;
			let current_job_action;

			try {
				let exchange_rate = yield helper.getExchangeRate(from, to);
				success_times++;
				next_job_delay = SUCCESS_DELAY;
				current_job_action = 'success';
				yield helper.saveToDB(from, to, exchange_rate);
				log.info('get exchange rate success', {rate: exchange_rate});
			} catch (e) {
				fail_times++;
				next_job_delay = FAIL_DELAY;
				current_job_action = 'bury';
				log.warn('get exchange rate fail', {error: e});
			}

			callback(current_job_action);
			if (success_times < SUCCESS_LIMIT && fail_times < FAIL_LIMIT) {
				let producer = new Producer(_this.tube_name);
				let seed = new Seed(from, to, success_times, fail_times);
				let producer_payload = seed.toJSONString();
				yield producer.put(producer_payload, next_job_delay);
				log.info('exchange rate handler put job success');
			} else {
				log.info('all jobs done, exit');
				process.exit(0);
			}
		});
	}
}

module.exports = ExchangeRateHandler;
