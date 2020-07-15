
const vehicleManagementModel = require('../../models/vehicle-management');
module.exports = {
	getAllVehicle: async function (req,res,next) {
        const data = await vehicleManagementModel.getVehicleData(req.query||{});
		res.send(data)

    },
    getVehicleByRegNumber: async function (req,res,next) {
        const regNumber = req.params.regNumber;
        const data = await vehicleManagementModel.getVehicleByRegNumber(regNumber);
		    res.send(data)

    },
    getVehicleDataByUser:async function (req,res,next) {
        const user = req.params.user;
        const data = await vehicleManagementModel.getVehicleDataByUser(user);
		res.send(data)

    }
}