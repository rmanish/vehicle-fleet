var log = require('metalogger')();

var common = {	
	sendResponse: function (req, res, next) {
		log.debug('in sendResponse res.res_data is'); 
		
		if (res.res_data && !res.res_data.status) {
			res.res_data.status = true;
			if(!res.res_data.statusCode){
				res.res_data.statusCode = 200;
			}
			Object.keys(res.res_data).forEach(function(key) {
				if (!(key == 'status' || key == 'statusCode')) {
					var val = res.res_data[key];
					delete res.res_data[key];
					res.res_data[key] = val;
				}
			})
		}
		res.jsonp(res.res_data);
	},

	sendErrorResponse: function(err, req, res, next) {

		log.debug('in sendErrorResponse');
		log.debug('env => ' + process.env.NODE_ENV);

		// log.debug('err =>');
		// log.debug(err);

		if(res.res_data)
			res.res_data.status = false;
		else {
			res.res_data = {
				status: false
			};

		}
		if (process.env.NODE_ENV == 'development') {

			//res.res_data.error = err;
			if (err.message) {
				res.res_data.error = err.message;
			}
			//res.res_data.error = JSON.stringify(err);
		} else {
			if (err.message) {
				res.res_data.error = err.message;
			}
		}

		//console.log(res.res_data);
		res.jsonp(res.res_data);
	}
};

module.exports = common;