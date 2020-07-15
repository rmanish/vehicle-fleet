const express = require("express");
const routers = express.Router();
const vehicleManagementCtrl = require('../../controllers/vehicle-management');

routers.get("/getVehicleLists",vehicleManagementCtrl.getAllVehicle)
routers.get("/getVehicleListsByUser",vehicleManagementCtrl.getVehicleDataByUser)
routers.get("/getVehicleById/:regNumber",vehicleManagementCtrl.getVehicleByRegNumber)
module.exports = routers;