'use strict';
const $ = require('cheerio');
const bluebird = require('bluebird');
const request = bluebird.promisify(require('request'));
const ExchangeRate = require('../model').ExchangeRate;
const log = require('../logger');

/**
 * a collection of helper functions
 * @module handler/helper
 */
module.exports = {
	getExchangeRate,
	saveToDB
};

/**
 * request xe.com to get currency code
 * @param {string} from - currency code
 * @param {string} to - currency code
 * @return {Promise.<string|Error>} - exchange rate
 */
function getExchangeRate(from, to) {
	return new Promise((resolve, reject) => {
		let url = `http://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`;
		log.debug('send request to xe.com', {from: from, to: to});
		request(url).then((response) => {
			if (response.statusCode !== 200) {
				throw new Error('response error')
			}

			let rate = formatRate(response.body);
			if (!rate) {
				throw new Error('html parse error');
			}

			resolve(rate);
			log.info('request success', {rate: rate})
		}).catch(e => {
			reject(e);
			log.warn('request fail', {error: e})
		});
	});
}

/**
 * formatting rate to required format
 * @private
 * @param {string} html - rate with currency code
 * @return {string|null} - a number with 2 digits after decimal, e.g. 7.75
 */
function formatRate(html) {
	let rate_text = $(html).find('.uccRes').find('.rightCol').text(); // e.g. 7.75456 HKD

	if (!rate_text) {
		return null;
	}

	// if text contains 0.00 ---, it means no result in xe.com
	if ((/0\.00\s---/).test(rate_text)) {
		return null;
	}

	let rate_match = rate_text.match(/\d+.\d+/);
	if (rate_match) {
		return Number(rate_match[0]).toFixed(2).toString(); // e.g. 7.75
	}

	return null;
}

/**
 * save exchange rate to mongodb
 * @param {String} from - currency code
 * @param {String} to - currency code
 * @param {String} rate - exchange rate, 2 digits after decimal, e.g. 7.76
 * @return {Promise.<{object}, Error>}
 */
function saveToDB(from, to, rate) {
	let exchange_rate = new ExchangeRate({
		from: from,
		to: to,
		rate: rate
	});

	return exchange_rate.save();
}
