/* eslint-env mocha */
'use strict';

const should = require('chai').should(); // eslint-disable-line no-unused-vars
const rewire = require('rewire');

const getEnv = rewire('../config').__get__('getEnv');

describe('config module', () => {
	describe('private: getEnv', () => {
		const DEV = 'dev';
		const PROD = 'prod';
		it('should return dev, when env: dev | develop | DEV | DEVELOP', () => {
			getEnv('dev').should.equal(DEV);
			getEnv('develop').should.equal(DEV);
			getEnv('DEV').should.equal(DEV);
			getEnv('DEVELOP').should.equal(DEV);
		});

		it('should return dev, when no env', () => {
			getEnv().should.equal(DEV);
		});

		it('should return dev, when env is not in alias list', () => {
			getEnv('abc').should.equal(DEV);
		});

		it('should return prod, when env: prod | production | PROD | PRODUCTION', () => {
			getEnv('prod').should.equal(PROD);
			getEnv('production').should.equal(PROD);
			getEnv('PROD').should.equal(PROD);
			getEnv('PRODUCTION').should.equal(PROD);
		});
	});
});
