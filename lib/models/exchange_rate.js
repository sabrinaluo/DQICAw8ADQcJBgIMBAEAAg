'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ExchangeRateSchema = new Schema({
	from: String,
	to: String,
	created_at: {type: Date, default: Date.now},
	rate: String
}, {
	versionKey: false
});

module.exports = mongoose.model('ExchangeRate', ExchangeRateSchema);
