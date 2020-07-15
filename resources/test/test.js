

var _ = require('lodash')
var controllers = require('./../../controllers/test');
var testController = controllers.test;
var getTestData = testController.getTestData;

module.exports = {

	getTest: async function (req, res, next) {

        try{
            const data= await getTestData();
            res.send(data);
        }catch(err){
            res.send(err);
        }
	}
}