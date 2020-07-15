const _ = require('lodash'),
Sequelize = require('sequelize');
const functions = require('./../../functions'),
	sequelize = functions.sequelize;
	promisify = functions.promisify.promisify;
	
const get = {
	
	getVehicleData: async function () {
		try {
            var queryTag = "select * from vehicles ";
            console.log("I am here")
			return sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
		} catch (ex) {
			return promisify(ex, '')
		}
    }
}

module.exports = get;