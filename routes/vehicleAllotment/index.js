const express = require("express");
const routers = express.Router();
const vehicleAllotment = require('../../resources/vehicleAllotment');
const allotment =vehicleAllotment.allotment;

routers.post("/vehicleAlotment",allotment.allotmentVehicle);
module.exports = routers;