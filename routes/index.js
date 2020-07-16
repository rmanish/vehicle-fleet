const express = require("express");
const routers = express.Router();
const testResources = require('./../resources/test');
const vehicleManagement = require("./vehicle-management");
// const vehicleAllotment = require("./vehicleAllotment");
const vehicleAllotment = require('../resources/vehicleAllotment');
const commonResources = require('./../resources/common');
var common = commonResources.version1;
const allotment=vehicleAllotment.allotment;

const test = testResources.test;
routers.get("/v1/test", test.getTest,common.sendResponse,common.sendErrorResponse);
routers.use("/v1/vehicles",vehicleManagement,common.sendResponse,common.sendErrorResponse)
routers.post("/v1/vehicleAllotment",allotment.allotmentVehicle,common.sendResponse,common.sendErrorResponse)

module.exports = routers;