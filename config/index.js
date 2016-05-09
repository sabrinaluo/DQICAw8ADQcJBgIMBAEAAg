'use strict';

const fs = require('fs');
const nconf = require('nconf');

nconf.argv().env();
const NODE_ENV = nconf.get('NODE_ENV');
let file_name = __dirname + '/' + getEnv(NODE_ENV) + '.json';
nconf.file(file_name);

module.exports = nconf;

/**
 * get config file prefix, support alias for environment variable
 * @param {string} [node_env] - environment variable NODE_ENV
 * @return {string} - env file prefix, e.g. dev.json returns dev
 */
function getEnv(node_env) {
	node_env = node_env && node_env.toLowerCase();
	let files = fs.readdirSync(__dirname).filter(file => /.+\.json$/.test(file));

	if (files.length < 1) {
		throw new Error('can not read config file');
	}

	for (let i = 0; i < files.length; i++) {
		let env = files[i].split('.')[0];
		let alias = require(`./${env}.json`).alias || [];
		if (node_env === env || alias.indexOf(node_env) !== -1) {
			return env;
		}
	}

	return 'dev';
}
