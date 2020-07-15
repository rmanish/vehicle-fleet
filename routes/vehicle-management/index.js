const express = require("express");
const routers = express.Router();
const vehicleManagementCtrl = require('../../controllers/vehicle-management');

routers.get("/getVehicleLists",vehicleManagementCtrl.getAllVehicle)

routers.get("/getVehicleListsByUser",(req,res)=>{
    res.json([
        {
            "vehicleId": 123,
            "vehicleBrand":"Toyota",
            "vehicleModel":"Innova",
            "vehicleYearOfMfc":"2018",
            "vehicleCapacity": 5,
            "vehicleType":"SUV",
            "vehicleTankCapacity": 35,
            "vehicleStatus": "Active",
            "onBoardingDate": "24-Apr-2019",
            "OffBoardingDate":"24-Apr-2019",
            "createdAt":"24-Apr-2019",
            "updatedAt":"24-Apr-2019"
        }    
    ])
})
routers.get("/getVehicleById/:id",(req,res)=>{
    res.json({
            "vehicleId": 123,
            "vehicleBrand":"Toyota",
            "vehicleModel":"Innova",
            "vehicleYearOfMfc":"2018",
            "vehicleCapacity": 5,
            "vehicleType":"SUV",
            "vehicleTankCapacity": 35,
            "vehicleStatus": "Active",
            "onBoardingDate": "24-Apr-2019",
            "OffBoardingDate":"24-Apr-2019",
            "createdAt":"24-Apr-2019",
            "updatedAt":"24-Apr-2019"
        })
})
module.exports = routers;