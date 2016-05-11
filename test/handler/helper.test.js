/* eslint-env mocha */
'use strict';

const should = require('chai').use(require('chai-as-promised')).should();
const rewire = require('rewire');
const bluebird = require('bluebird');
const request = bluebird.promisify(require('request'));
const helper = require('../../lib/handler/helper');
const formatRate = rewire('../../lib/handler/helper').__get__('formatRate');

describe('handler/helper', () => {
	describe('getExchangeRate', () => {
		it('should be resolved with a non empty string, when input correct', () => {
			return helper.getExchangeRate('HKD', 'USD').should.eventually.not.equal('');
		});
		it('should be rejected, when input incorrect', () => {
			return helper.getExchangeRate('HK', 'US').should.be.rejected;
		});
	});

	describe('private: formatRate', () => {
		it('should return a string, which is a number with 2 digits after decimal', () => {
			formatRate(getHtml(7.75456, 'HKD')).should.equal('7.75');
			formatRate(getHtml(0.00123, 'HKD')).should.equal('0.00');
			formatRate(getHtml(0.00567, 'HKD')).should.equal('0.01');
		});

		it('should return null, if input is an empty string', () => {
			should.not.exist(formatRate(''));
		});

		it('should return null, if input contains "0.00 ---"', () => {
			should.equal(formatRate(getHtml('0.00', '---')), null);
		});
	});
});

/**
 * mock xe.com html
 * @param {String|Number} amount -
 * @param {String} currency - currency code
 * @return {String} - mock html
 */
function getHtml(amount, currency) {
	return `<table><tr class="uccRes">
		<td width="47%" align="right" class="leftCol">1.00&nbsp;<span class="uccResCde">USD</span>
		<!-- WARNING: Automated extraction of rates is prohibited under the Terms of Use. --></td>
		<td width="6%" valign="middle" align="center">=</td>
		<td width="47%" align="left" class="rightCol">${amount}&nbsp;<span class="uccResCde">${currency}</span>
		<!-- WARNING: Automated extraction of rates is prohibited under the Terms of Use. --></td></tr></table>`;
}
