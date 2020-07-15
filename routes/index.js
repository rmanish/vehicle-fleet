const express = require("express");
const routers = express.Router();
const resources = require('./../resources/test');
const vehicleManagement = require("./vehicle-management");

const test = resources.test;
routers.get("/v1/test", test.getTest);
routers.use("/v1/vehicles",vehicleManagement)
module.exports = routers;