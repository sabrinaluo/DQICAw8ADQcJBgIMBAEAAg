'use strict';

class ExchangeRateHandler {
	/**
	 * create an exchange handler for consumer
	 * @param {Consumer} owner - which consumer owns the job
	 */
	constructor(owner) {
		this.tube_name = owner.tube_name;
		this.type = 'exchange_rate';
	}
}

module.exports = ExchangeRateHandler;
