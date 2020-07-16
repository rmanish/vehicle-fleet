
const vehicleManagementModel = require('../../models/vehicle-management');
module.exports = {
	getAllVehicle: async function (req,res,next) {
        const data = await vehicleManagementModel.getVehicleData(req.query||{});
        res.res_data=data;
		return next() ;
    },
    getVehicleByRegNumber: async function (req,res,next) {
        const regNumber = req.params.regNumber;
        const data = await vehicleManagementModel.getVehicleByRegNumber(regNumber);
        res.res_data=data;
		return next() ;

    },
    getVehicleDataByUser:async function (req,res,next) {
        const user = req.params.user;
        const data = await vehicleManagementModel.getVehicleDataByUser(user);
		res.res_data=data;
		return next() ;

    }
}