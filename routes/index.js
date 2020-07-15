const express = require("express");
const routers = express.Router();
const resources = require('./../resources/test');

const test = resources.test;
routers.get("/v1/test", test.getTest);
module.exports = routers;