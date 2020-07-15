
'use strict'

const _ =require('lodash');

const customException = {
	customException: function (req, res, message, statusCode) {		
		if (!_.isString(message)) {
			message = JSON.stringify(message)
		}
		let errJSON = {
			status: false,
			data: [],
			message: message
		}
		res.status(statusCode).send(errJSON)		
	},
	unhandledException: function (req, res, err) {
		let errJSON = {
			status: false,
			data: [],
			message: err
		},
		status = err.statusCode == 'undefined'? 400: err.statusCode
		res.status(status).send(errJSON)
	}
}

module.exports = customException;