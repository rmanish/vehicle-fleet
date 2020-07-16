
'use strict'

var _ = require('lodash'),
	Promise = require('bluebird'),
	moment = require('moment'),
	fs = require('fs');

var crypto = require('crypto');

var utils = {
	throwError: function (){
		if (arguments.length < 1) {
			throw {
				message: "error message creation failure",
				statusCode: 500
			}
		}
		throw {
			message: arguments[0].message,
			statusCode: arguments[0].statusCode
		}
	},
	getDayNumber: function (day) {
		var dayNumber = 0;

		switch (day.toLowerCase()) {
			case "monday":
				dayNumber = 1;
				break;
			case "tuesday":
				dayNumber = 2;
				break;
			case "wednesday":
				dayNumber = 3;
				break;
			case "thursday":
				dayNumber = 4;
				break;
			case "friday":
				dayNumber = 5;
				break;
			case "saturday":
				dayNumber = 6;
				break;
			case "sunday":
				dayNumber = 0;
				break;
		}
		return dayNumber;
	},
	getDayFromNumber: function (dayNumber) {
		var day = "";

		var dayNumber = dayNumber % 7;

		switch (dayNumber) {
			case 1:
				day = "Monday";
				break;
			case 2:
				day = "Tuesday";
				break;
			case 3:
				day = "Wednesday";
				break;
			case 4:
				day = "Thursday";
				break;
			case 5:
				day = "Friday";
				break;
			case 6:
				day = "Saturday";
				break;
			case 0:
				day = "Sunday";
				break;
		}
		return day;
	},
	getTimeInSeconds: function (date) {
		var hour = 0, minute = 0, seconds = 0;
		if (_.isString(date) && date.length > 8) {
			hour = Number(date.substring(11,13));
			minute = Number(date.substring(14, 16));
			seconds = Number(date.substring(17, 19));
		}	else if (_.isString(date) && date.length < 9) {
			hour = Number(date.substring(0,2));
			minute = Number(date.substring(3, 5));
			seconds = Number(date.substring(6, 8));
		} else if (_.isDate(date)) {
			hour = date.getHours();
			minute = date.getMinutes();
			seconds = date.getSeconds();
		} else {
			throw "error converting random date"
		}
		return hour * 3600 + minute * 60 + seconds;
	},
	getYYYYMMDD: function (date, separator) {
		var yyyy = date.getFullYear().toString();
		var mm = (date.getMonth() + 1).toString();
		var dd  = date.getDate().toString();
		return yyyy + separator + (mm[1] ? mm : "0" + mm[0]) + separator + (dd[1] ? dd : "0" + dd[0]); 
	},
	getTimeInAMPM: function (args, minutes) {
		if (!_.isUndefined(args)) {
			if (!minutes) {
				var timeArr = _.toString(args).split(':'),
				hour = timeArr[0],
				minute = timeArr[1];
				if (hour >= 0 && hour < 12) {
					return timeArr[0] + ':' + timeArr[1]+ " AM";
				} else {
					hour = (hour == 12) ? "12" :  String(Math.floor(hour%12));
					return (hour[1] ? hour : "0" + hour[0]) + ':' + timeArr[1]+ " PM";
				}
			} else {
				var hour = Math.floor((args/60)%24),
				minute = Math.floor(args%60);
				if (minute == 0) {
					minute = "00"
				}
				if (hour >= 0 && hour < 12) {
					hour = String(hour)
					return "" + (hour[1] ? hour : "0" + hour[0]) + ":" + minute + " AM";
				} else {
					hour = (hour == 12) ? "12" :  String(Math.floor(hour%12));
					return "" + (hour[1] ? hour : "0" + hour[0]) + ":" + minute+ " PM";
				}
			}
		} else {
			return ""
		}
	},
	generateRandomString: function (length) {
		var text = "",
  		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 		for (var i=0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
 		}
 		return text;
	},
  responseGenerator: function (data, error) {
  	//console.log('function:utits REACHED responseGenerator normal one');
  	return new Promise(function (resolve, reject) {
			var response = {};
			if (!_.isNull(data)) {
				response.status = (_.has(data, 'status')) ? data.status : true;
				response.data = data;
				response.error = '';
			} else {
				response.status = (_.has(data, 'status')) ? data.status : false;
				response.data = null;
				if(_.isError(error)) {
					response.error = error.message;
				}	else {
					response.error = error;
				}				
			}
			resolve(response);
  	})
  },
  dateComparison: function (date1, date2) {
  	var result = 0;
  	var date1 = new Date(moment(date1).format('DD MMM YYYY')),
  		date2 = new Date(moment(date2).format('DD MMM YYYY'));
  		
  	if (Number(date1.getDate()) == Number(date2.getDate()) && Number(date1.getMonth()) == Number(date2.getMonth()) && Number(date1.getYear()) == Number(date2.getYear())) result = 0;
  	else result = Number(moment(date1).diff(date2, 'days'));
  	return result;
  },
  fileResponse: function (res, file) {
  	var readStream = fs.createReadStream(file.path);

  	res.writeHead(200, {
  		'Content-Type': file.mimetype,
  		'Content-Length': file.size
  	});
  	console.log(file.mimetype, file.size);
  	readStream.pipe(res);
  },
  getNextRoundedTime: function (dateTime, time) { 	
		if(_.isNull(dateTime)) {
			dateTime = new Date().getTime();
		}
		var coeff = 1000 * 60 * time;
		var rounded = Math.round(dateTime / coeff) * coeff;
		if(rounded != dateTime ) {
			dateTime = dateTime + (time * 60 *1000)/2;
		}		
		return Math.round(dateTime / coeff) * coeff;
  },
  calculateNextRoundedTime: function (openingTime, dateTime, booking_buffer) {  	
  	var result = this.getBookingStartTime(openingTime, dateTime, booking_buffer);
  	var roundedResult = this.getNextRoundedTime(result, 15);
  	if(result != roundedResult) {
  		result = this.getBookingStartTime(openingTime, roundedResult, booking_buffer);
  	}  	
  	return this.getNextRoundedTime(result, 15);
  },
  
  filterEmptyKey: function (object) {
  	Object.keys(object).forEach(function (key) {
  		if (_.isUndefined(object[key]) || _.isNull(object[key])) {
  			delete object[key];
  		}
  	});

  	return object;
  },
  snakeCaseToCamelCase: function (myString) {
  	return myString.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
  },
  getNoOfMinutes: function(timestamp){
  	if (_.isUndefined(timestamp)) {
  		return false;
  	}
  	var hour = parseInt(moment(timestamp).format('HH')),
		minute = parseInt(moment(timestamp).format('mm'));
		return (hour * 60 + minute);
  },
 
	convertToTime: function (minutes, format) {
		var format = format || "hh:mm A";
		let time = moment().startOf('day').add(minutes, 'minutes').format(format);
		return time;
	},
	removeDuplicatesFromArray: function (array) {
		var array = array.filter(el => {
			if(el !=null, el!==undefined, el!="")
				return el;
		}); 
		return _.uniq(array);
	},
	encrypt: (str, alogrithm, password) => {
		var cipher = crypto.createCipher(alogrithm, password);
		var crypted = cipher.update(str, 'utf8', 'hex')
		crypted += cipher.final('hex');
		return crypted;
	},

	decrypt: (str, alogrithm, password) => {
		var decipher = crypto.createDecipher(alogrithm, password);
		var decrypted = decipher.update(str, 'utf8', 'hex')
		decrypted += decipher.final('utf8');
		return decrypted;
	}
} 

module.exports = utils;