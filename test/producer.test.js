/* eslint-env mocha */
'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
chai.should();
const sinon = require('sinon');
const bluebird = require('bluebird');
const fivebeans = bluebird.promisifyAll(require('fivebeans'));
const Producer = require('../lib/producer');


describe('Producer module', () => {
	describe('put()', () => {
		let sandbox;
		let use_fn;
		let put_fn;
		beforeEach(() => {
			sandbox = sinon.sandbox.create();
			use_fn = sandbox.spy();
			put_fn = sandbox.spy();
			sandbox.stub(fivebeans, 'client').returns({
				connect() {
				},
				on() {
				},
				onAsync() {
					return Promise.resolve();
				},
				useAsync(tube) {
					use_fn(tube);
					return Promise.resolve();
				},
				putAsync(priority, delay, ttr, payload) {
					put_fn(priority, delay, ttr, payload);
					return Promise.resolve('test_job_id');
				},
				end() {
				}
			});
		});
		afterEach(() => {
			sandbox.restore();
		});

		it('should invoke client.put with correct params', () => {
			let tube_name = 'test_tube';
			let test_payload = {};
			let producer = new Producer(tube_name);
			return producer.put(test_payload, 3)
				.then(() => {
					use_fn.should.have.been.calledWith(tube_name);
					put_fn.should.have.been.calledWith(0, 3, 60, test_payload);
				});
		});

		it('should invoke client.put with delay=0, if delay is omitted', () => {
			let tube_name = 'test_tube';
			let test_payload = {};
			let producer = new Producer(tube_name);
			return producer.put(test_payload)
				.then(() => {
					use_fn.should.have.been.calledWith(tube_name);
					put_fn.should.have.been.calledWith(0, 0, 60, test_payload);
				});
		});
	});
});
