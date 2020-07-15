
'use strict'
var _ = require('lodash'),
	utils = require('./utils.js');
var log = require('metalogger')();

var filter = {

	headerParserLayer: function(req, res, next){
		log.debug('in headerParserLayer');

		if(!req.performance)
			req.performance  = {
				firstRoute: 'headerParserLayer',
				start: new Date()
			}

		var apiVersion = utils.getApiVersion(req);
		var headers = req.headers;
		
		// log.debug('apiVersion = ' + apiVersion);

		// log.debug('headers before => ');
		// log.debug(headers);

		var newHeaders = {};

		if(apiVersion && apiVersion >= 11){	//this takes into effect node_api version 11 and onwards

			var map = {
				'app-version': 'app_version',
				'gps-enabled': 'gps_enabled',

			}

			Object.keys(headers).forEach(function(header){
				if(header && map[header]){
					newHeaders[map[header]] = headers[header];
				} else {
					newHeaders[header] = headers[header];
				}
			})

			log.debug('overriding with new headers');
			// log.debug(newHeaders);

			req.headers = newHeaders;
		}


		// log.debug('headers after => ' );
		// log.debug(req.headers);

		return next();
	},

}
module.exports = filter;