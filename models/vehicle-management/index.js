const _ = require('lodash'),
Sequelize = require('sequelize');
const functions = require('./../../functions'),
	sequelize = functions.sequelize;
	promisify = functions.promisify.promisify;
	
const get = {
	
	getVehicleData: async function (query) {
        var queryTag = "select * from vehicles ";
        if(query.assigned=="true"){
            queryTag = `select * from vehicles where status = 1`;
        }else if(query.assigned=="false"){
            queryTag = `select * from vehicles where status = 0`;
        }
		try {
			return sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
		} catch (ex) {
			return promisify(ex, '')
		}
    },
    getVehicleDataByUser: async function (user) {
		try {
            var queryTag = "select * from vehicles having  ";
			return sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
		} catch (ex) {
			return promisify(ex, '')
		}
    },
    getVehicleByRegNumber: async function (registrationNumber) {
		try {
            var queryTag = `select * from vehicles having registrationNumber = '${String(registrationNumber)}'`;
           
            const vehiclesData = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
            console.log("vehiclesData",vehiclesData)
            const resposeData = vehiclesData[0];
            var tripQuery = `select * from tripTrackers where VehicleId = ${resposeData.vehicleId}`;
            
            resposeData.tripDetails = await sequelize.query(tripQuery, {type: Sequelize.QueryTypes.SELECT });
            console.log("queryTag===>",resposeData)
			return resposeData
		} catch (ex) {
			return promisify(ex, '')
		}
    },
}

module.exports = get;