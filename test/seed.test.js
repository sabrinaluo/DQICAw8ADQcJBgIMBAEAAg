/* eslint-env mocha */
'use strict';

const should = require('chai').should(); // eslint-disable-line no-unused-vars
const Seed = require('../lib/seed');

describe('Seed module', () => {
	describe('constructor', () => {
		it('should have expected properties when all params given', () => {
			let seed = new Seed('HKD', 'USD', 1, 2);
			let payload = seed.payload;
			seed.should.have.ownProperty('type', 'exchange_rate');
			seed.should.have.ownProperty('payload');
			payload.should.have.ownProperty('from', 'HKD');
			payload.should.have.ownProperty('to', 'USD');
			payload.should.have.ownProperty('success_times', 1);
			payload.should.have.ownProperty('fail_times', 2);
		});
		it('should have success_times and fail_times = 0, if related params are not given', () => {
			let seed = new Seed('CNY', 'JPY');
			let payload = seed.payload;
			seed.should.have.ownProperty('type', 'exchange_rate');
			seed.should.have.ownProperty('payload');
			payload.should.have.ownProperty('from', 'CNY');
			payload.should.have.ownProperty('to', 'JPY');
			payload.should.have.ownProperty('success_times', 0);
			payload.should.have.ownProperty('fail_times', 0);
		});
	});

	describe('toJSONString()', () => {
		let seed = new Seed('HKD', 'USD', 1, 2);
		it('should return a json string, can be parsed as json', () => {
			seed.toJSONString().should.be.a('string');
			(() => JSON.parse(seed.toJSONString())).should.not.throw();
		});

		it('string parsed json should have expected properties', () => {
			let json = JSON.parse(seed.toJSONString());
			let payload = json.payload;
			json.should.have.ownProperty('type', 'exchange_rate');
			json.should.have.ownProperty('payload');
			payload.should.have.ownProperty('from', 'CNY');
			payload.should.have.ownProperty('to', 'JPY');
			payload.should.have.ownProperty('success_times', 0);
			payload.should.have.ownProperty('fail_times', 0);
		});
	});
});
