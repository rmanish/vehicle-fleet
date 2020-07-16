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
            console.log(vehicles)
            var vehicleArray = [];
            vehicles.forEach(element => {
                vehicleArray.push(element.id)
            });
            const tripQuery = `select * from trip_details where vehicle_id IN (${vehicleArray.join(",")})`;
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
            var queryTag = `select * from vehicles having reg_number = '${String(registrationNumber)}'`;
           
            const vehiclesData = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
            const resposeData = vehiclesData[0];
            var tripQuery = `select * from trip_details where vehicle_id = ${resposeData.id} ORDER BY updated_date DESC`;
            var tripDetails = await sequelize.query(tripQuery, {type: Sequelize.QueryTypes.SELECT });
            resposeData.tripDetails = {
                tripInfo:tripDetails[0],
                tripCount:tripDetails.length
            }
            var vehicleInfoQuery = `SELECT *
                                    FROM ((((vehicle_permits
                                    INNER JOIN vehicle_insurance ON vehicle_permits.vehicle_id = vehicle_insurance.vehicle_id)
                                    INNER JOIN vehicle_detail ON vehicle_permits.vehicle_id = vehicle_detail.vehicle_id)
                                    INNER JOIN vehicle_maintainence ON vehicle_permits.vehicle_id = vehicle_maintainence.vehicle_id)
                                    INNER JOIN vehicle_allotment ON vehicle_permits.vehicle_id = vehicle_allotment.vehicle_id);`
            resposeData.vehicleInfo = await sequelize.query(vehicleInfoQuery, {type: Sequelize.QueryTypes.SELECT });
			return resposeData
		} catch (ex) {
			return promisify(ex, '')
		}
    },
}

module.exports = get;