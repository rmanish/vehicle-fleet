const vehicleAllotmentModel = require('../../models/vehicle-allotment');
module.exports = {
	getAllotmentGraphForVehicle: async function (req, res, next) {
        const data = await vehicleAllotmentModel.getAllotmentGraphForVehicle(req.query||{});
		res.send(data);
    },
}