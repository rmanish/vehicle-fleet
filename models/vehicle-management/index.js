const _ = require('lodash'),
Sequelize = require('sequelize');
const functions = require('./../../functions'),
	sequelize = functions.sequelize;
    promisify = functions.promisify.promisify;
    
function sortObject(obj,keyName){
    return obj.sort((a, b) => parseFloat(b[keyName]) - parseFloat(a[keyName]));
}

function getTripObject(trips){
    const obj = sortObject(trips,"mobilityTrackerId")
    return {
        tripCount:trips.length,
        lastTrip:obj[0]
    }
}
	
const get = {
	
	getVehicleData: async function (query) {
        var queryTag = "select * from vehicles ";
        if(query.assigned=="true"){
            queryTag = `select * from vehicles where status = 1`;
        }else if(query.assigned=="false"){
            queryTag = `select * from vehicles where status = 0`;
        }
		try {
            var vehicles = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
            var vehicleArray = [];
            vehicles.forEach(element => {
                vehicleArray.push(element.vehicleId)
            });
            const tripQuery = `select * from tripTrackers where VehicleId IN (${vehicleArray.join(",")})`;
            var tripData = await sequelize.query(tripQuery, {type: Sequelize.QueryTypes.SELECT });
            var tripObj = {};
            tripData.forEach(trip=>{
                if(tripObj[trip.VehicleId]){
                    tripObj[trip.VehicleId].push(trip);
                }else{
                    tripObj[trip.VehicleId] = [trip]
                }
            })
            const tripMapping = {};
            for(trips in tripObj){
                tripMapping[trips] = getTripObject(tripObj[trips])
            }
			return {
                vehicles,
                tripMapping
            };
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
            const resposeData = vehiclesData[0];
            var tripQuery = `select * from tripTrackers where VehicleId = ${resposeData.vehicleId} ORDER BY updatedAt DESC`;
            var tripDetails = await sequelize.query(tripQuery, {type: Sequelize.QueryTypes.SELECT });
            resposeData.tripDetails = {
                tripInfo:tripDetails[0],
                tripCount:tripDetails.length
            }
            var vehicleInfoQuery = `SELECT *
                                    FROM (((vehiclePermits
                                    INNER JOIN vehicleInsurances ON vehiclePermits.VehicleId = vehicleInsurances.VehicleId)
                                    INNER JOIN vehicleFitnesses ON vehiclePermits.VehicleId = vehicleFitnesses.VehicleId)
                                    INNER JOIN vehicleFeatures ON vehiclePermits.VehicleId = vehicleFeatures.VehicleId);`
            resposeData.vehicleInfo = await sequelize.query(vehicleInfoQuery, {type: Sequelize.QueryTypes.SELECT });
			return resposeData
		} catch (ex) {
			return promisify(ex, '')
		}
    },
}

module.exports = get;