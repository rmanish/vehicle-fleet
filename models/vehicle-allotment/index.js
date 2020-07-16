const _ = require('lodash'),
Sequelize = require('sequelize');
const functions = require('./../../functions'),
	sequelize = functions.sequelize;
    promisify = functions.promisify.promisify;
	
const get = {
	
	getAllotmentGraphForVehicle: async function (query) {
        try {

            let data = []
            const { vehicleId } = query || {}
            var queryTag = `select * from vehicles where vehicleId = ${vehicleId}`;
            const vehicleDetails = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });

            var queryTag = `select driverId, userId from drivers where userId in (select userId from vehicleUserMappings where vehicleId = ${vehicleId})`
            const driverList = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
            console.log(driverList);

            var queryTag = `select * from users where userId = ${driverList[0].userId}`;
            const driverDetails = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });

            data.push({
                type : "DRIVER",
                text : driverDetails[0].firstName + ' ' + driverDetails[0].lastName
            })
            data.push({
                type : 'VEHICLE',
                text : vehicleDetails[0].registrationNumber,
                vehicleType : vehicleDetails[0].vehicleType
            });

            var queryTag = `select * from usersMapping where userId = ${driverDetails[0].userId}`;
            const divisionDetails = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });

            // Recursive query to generate hierarchy
            var queryTag = `with recursive cte (divisionId, divisionName, parentDivisionId) as (
                select     divisionId,
                        divisionName,
                        parentDivisionId
                from       divisons
                where      divisionId = ${divisionDetails[0].DivisionId}
                union all
                select     p.divisionId,
                        p.divisionName,
                        p.parentDivisionId
                from       divisons p
                inner join cte on p.divisionId = cte.parentDivisionId )
            select * from cte;`;
            const divisions = await sequelize.query(queryTag, {type: Sequelize.QueryTypes.SELECT });
            divisions.forEach( division => {
                data.push({
                    type : "DIVISION",
                    text : division.divisionName
                })
            })
            
            return new Promise( (resolve, reject) => resolve(data));
		
		} catch (ex) {
			return promisify(ex, '')
		}
    },
}

module.exports = get;