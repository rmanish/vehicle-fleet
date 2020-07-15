
var _ = require('lodash')
var reqParser = require('./../../functions/reqParser');
    
module.exports = {

	allotmentVehicle: async function (req, res, next) {
        console.log(req.body);
        if (!reqParser.typeCheck(req, res, 'body', 'vehicleId','Number', true)) return;
        if (!reqParser.typeCheck(req, res, 'body', 'userId', 'Number', true)) return;

        try{
             const data= {
                 message:"lo ji post ho gyaaaaa"
             };
             res.res_data=data;
          return next() ;
        }catch(err){
            res.send(err);
        }
	}
}