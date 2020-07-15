const Promise = require('bluebird');

const Promisify = module.exports = {
	promisify: function (err, val) {
		return new Promise(function( resolve, reject) {
			if (err) {
				reject(err);
			} else {
				resolve(val);
			}
		})
	}
}