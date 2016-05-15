'use strict';
const Consumer = require('./lib/consumer');
const Producer = require('./lib/producer');
const Seed = require('./lib/seed');

const TUBE_NAME = 'sabrinaluo';
let producer = new Producer(TUBE_NAME);
let payload = new Seed('USD', 'HKD').toJSONString();
let worker = new Consumer(TUBE_NAME);

worker.start(); // consumer start watch the tube
producer.put(payload); // seed the job
