/* eslint-env mocha */
'use strict';

const chai = require('chai');
chai.use(require('sinon-chai')).should();
const sinon = require('sinon');
const fivebeans = require('fivebeans');
const Consumer = require('../lib/consumer');

describe('Consumer module', () => {
	describe('start()', () => {
		let sandbox;
		beforeEach(() => {
			sandbox = sinon.sandbox.create();
		});
		afterEach(() => {
			sandbox.restore();
		});

		it('should invoke worker.start with correct tube name', () => {
			let start_fn = sandbox.spy();
			sandbox.stub(fivebeans, 'worker').returns({
				start: start_fn
			});
			let tube_name = 'test_tube';
			let consumer = new Consumer(tube_name);
			consumer.start();
			start_fn.should.have.been.calledWith([tube_name]);
		});
	});
});
