const express = require("express");
const routers = express.Router();
const resources = require('./../resources/test');
const vehicleAllotmentCtrl = require('../controllers/vehicle-allotment');

const test = resources.test;
routers.get("/v1/test", test.getTest);
routers.get("/getAllotmentGraphForVehicle",vehicleAllotmentCtrl.getAllotmentGraphForVehicle)
module.exports = routers;