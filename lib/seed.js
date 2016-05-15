'use strict';

class Seed {
	/**
	 * create a exchange rate seed
	 * @param {string} from - currency code
	 * @param {string} to - currency code
	 * @param {number} [success_times=0] - how many times the job succeed already
	 * @param {number} [fail_times=0] - how many times the job failed already
	 */
	constructor(from, to, success_times, fail_times) {
		this.type = 'exchange_rate';
		this.payload = {
			from: from,
			to: to,
			success_times: success_times || 0,
			fail_times: fail_times || 0
		};
	}

	/**
	 * convert Seed object attributes to string
	 * @return {string} - job payload for producer
	 */
	toJSONString(){
		return JSON.stringify(this);
	}
}

module.exports = Seed;
