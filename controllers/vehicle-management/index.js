
const vehicleManagementModel = require('../../models/vehicle-management');
module.exports = {
	getAllVehicle:async function (req,res,next) {
        const data = await vehicleManagementModel.getVehicleData();
		res.send(data)

	}
}