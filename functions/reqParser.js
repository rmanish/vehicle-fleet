
'use strict'

var _ = require('lodash')
var exception = require('./exception')
var paramterMissingMessage = ' parameter missing in ';
var defaultErrorMessage = ' does not exists in default parameter list';
var typeFailMessage = ' is not of right datatype';
var keyMissingMessage = '$path is missing $listOfKeys key/s';
var extraKeyMessage = '$path has these $listOfKeys unexpected keys';

module.exports = {
	/**
     *
     * example [ if (!reqParser.keyCheckJSON(req, res, 'body', 'mediaDelete', ['ID'])) return; ]
     */
	keyCheckJSON: function (req, res, location, path, defaultList, nonMendateList) {
		var message = null,
			flag = false,
			flagExtra = false,
			flagMissing = false,
			missingKeys = [],
			extraKeys = [];

		nonMendateList = _.isUndefined(nonMendateList) ? defaultList : _.concat(defaultList, nonMendateList);

		try {
			if (_.isArray(req[location][path])) {
				req[location][path].forEach(function (pathObject) {
					var keyList = Object.keys(pathObject);
					defaultList.forEach(function (item) {
						var internalFlag = (_.indexOf(keyList, item) >= 0) ? false : true;

						if (internalFlag) missingKeys.push(item);

						flagMissing = (!flagMissing && !internalFlag) ? false : true;
					});
					keyList.forEach(function(item) {
						var internalFlag = (_.indexOf(nonMendateList, item) >= 0) ? false : true;

						if (internalFlag) extraKeys.push(item);
						flagExtra = (!flagExtra && !internalFlag) ? false : true;
					})
				})
			} else if (_.isObject(req[location][path])) {
				var keyList = Object.keys(req[location][path]);
				defaultList.forEach(function (item) {
					var internalFlag = (_.indexOf(keyList, item) >= 0) ? false : true;

					if (internalFlag) missingKeys.push(item);
					flagMissing = (!flagMissing && !internalFlag) ? false : true;
				})
				keyList.forEach(function(item) {
					var internalFlag = (_.indexOf(nonMendateList, item) >= 0) ? false : true;

					if (internalFlag) extraKeys.push(item);
					flagExtra = (!flagExtra && !internalFlag) ? false : true;
				})
			} else {
				flag = true;
			}

			if (!flag && !flagMissing && !flagExtra) {
				return true;
			} else if (flagExtra) {
				message = extraKeyMessage.replace('$path', path).replace('$listOfKeys', _.join(extraKeys, ', '));
			} else if (flagMissing) {
				message = keyMissingMessage.replace('$path', path).replace('$listOfKeys', _.join(missingKeys, ', '));
			} else {
				message = path + typeFailMessage;
			}

			if (message === null) {
				return true;
			} else {
				exception.customException(req, res, message, 400);
				return false;
			}
		} catch (ex) {
			exception.customException(req, res, ex.message, 500)
		}
    },
    /**
     * example [ if (!reqParser.defaultCheck(req, res, 'query', 'responseType', ['view','all'], 'all')) return; ]
     */
	defaultCheck: function (req, res, location, path, default_list, defaultValue) {
		var message = null;
		var exists = false;
		if (_.has(req[location], path)) {
			exists = _.indexOf(default_list, req[location][path]) >= 0 ? true: false;
		} else {
			if (!_.isUndefined(defaultValue)) {
				req[location][path] = defaultValue;
				exists = true;
			} else {
				message = path + paramterMissingMessage + location;
			}
		}
		if (!exists) {
			message = path + defaultErrorMessage;
		}

		if (message === null) {
			return true;
		} else {
			exception.customException(req, res, message, 400);
			return false;
		}
    },
    /**
     * example [if (!reqParser.typeCheck(req, res, 'query', 'city_name', 'String', true)) return;]
     */
	typeCheck: function (req, res, location, path, type, mandatory, defaultValue) {
		var message = null;
		var flag = false
		if (_.has(req[location], path)) {
			switch (type) {
				case ('AoS')://Array of String

					// console.log('location = '+location);
					// console.log('path = '+ path);
					// console.log('lolz = ' + req[location][path]);
					// console.log(req[location][path]);
					// console.log(JSON.stringify(req[location][path]));

					var lolz = req[location][path];
					flag = true;
					//var lolz = req[location][path].trim().split(',');
					
					var ar = [];
					lolz.forEach(function(val){
						if(!_.isEmpty(val)){
							ar.push(val);
						}
					})
					
					req[location][path] = ar;

					break;
				// case ('AoS')://Array of String
				// 	try {
				// 		req[location][path] = String(req[location][path]);
				// 		flag = _.isString(req[location][path]);
				// 	} catch (ex) {
				// 		flag = true;
				// 	}
				// 	var lolz = req[location][path].trim().split(',');
					
				// 	var ar = [];
				// 	lolz.forEach(function(val){
				// 		if(!_.isEmpty(val)){
				// 			ar.push(val);
				// 		}
				// 	})
					
				// 	req[location][path] = ar;
				// 	break;
				case ('String'):
					try {
						req[location][path] = String(req[location][path]);
						flag = _.isString(req[location][path]);
					} catch (ex) {
						flag = true;
					}
					break;
				case ('NonEmptyString'):
					try {
						req[location][path] = String(req[location][path]);
						flag = _.isString(req[location][path]) && req[location][path];
					} catch (ex) {
						flag = true;
					}
					break;
					
				case ('Number'):
					try {
						req[location][path] = Number(req[location][path]);
						flag = _.isNumber(req[location][path])
						flag = !_.isNaN(req[location][path])
					} catch (ex) {
						flag = true;
					}
					break;
				case ('Boolean'):
					flag = _.isBoolean(req[location][path])
					break;
				case ('Date'):
					var dateParam = new Date(req[location][path]);
					req[location][path] = dateParam;
					flag = !_.isNaN(dateParam.valueOf())
					break;
				case ('Array'):
					try {
						var queryJSON = [];
						if (!_.isObject(req[location])) {
							flag = true;
						} else {
							queryJSON = JSON.parse(req[location][path]);
							req[location][path] = queryJSON;
							flag = _.isArray(queryJSON);
						}
					} catch (ex) {
						exception.customException(req, res, ex.message, 500);
						return false;
					}
					break;
				case ('JSON'):
					try {
						var queryJSON = {};
						if (_.isObject(req[location])) {
							flag = true;
						} else {
							queryJSON = JSON.parse(req[location][path]);
							req[location][path] = queryJSON;
							flag = _.isObject(queryJSON);
						}
					} catch (ex) {
						exception.customException(req, res, ex.message, 500);
						return false;
					}
					break;
				default:
					flag = false;
			} 

			if (!flag) {
				message = path + typeFailMessage;
			}
		} else {
			message = path + paramterMissingMessage + location;
		}
		if (message !== null && mandatory) {
			exception.customException(req, res, message, 400);
			return false;
		} else if (!mandatory && message !== null) {
			req[location][path] = (_.isUndefined(defaultValue)) ? null : defaultValue
			return true;
		} else {
			return true;
		}
    },
    /**
     * example[	if (!reqParser.parameterMissingCheck(req, res, 'query', 'city_name')) return;]
     */
	parameterMissingCheck: function (req, res, location, path, defaultValue) {
		var message = null;
		// console.log(_.has(req.query, path), req.query, path, defaultValue, !_.isUndefined(defaultValue) && !_.isNull(defaultValue))
		if (_.has(req[location], path)) {
		} else if (!_.isUndefined(defaultValue) && !_.isNull(defaultValue)) {
			req[location][path] = defaultValue;
		} else {
			message = path + paramterMissingMessage + location;
		}

		if (message === null) {
			return true;
		} else {
			exception.customException(req, res, message, 400);
			return false;
		}
	},

}