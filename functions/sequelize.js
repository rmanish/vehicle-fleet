
var Sequelize = require('sequelize');
var config = require('../config/config');

var sequelize = new Sequelize(
   
	config.db_name /*database*/, 
	null, // config.database.MYSQLDBWsername /*username*/, 
	null, // config.database.MYSQLDBPassword /*password*/, 
	{
	  // host: config.database.MYSQLDBHostname,
	  dialect: 'mysql',
	  // pool: {
	  //   max: config.constants.maxConnectionSequelize,
	  //   min: config.constants.minConnectionsSequelize,
	  //   idle: config.constants.idleTimeSequelize
	  // },
	  replication: {
	  	read: [{
	  		host: config.db_host,
	  		username: config.db_user,
	  		password: config.db_password,
				pool: {
				  max: config.maxConnectionSequelize,
				  min: config.minConnectionsSequelize,
				  idle: config.idleTimeSequelize
				}
			}],
	  	write: {
            host: config.db_host,
            username: config.db_user,
            password: config.db_password,
	  		pool: {
	  		  max: config.maxConnectionSequelize,
	  		  min: config.minConnectionsSequelize,
	  		  idle: config.idleTimeSequelize
	  		}
	  	}
	  },
	  define: {
	  	timestamps: false
	  },
	  timezone: '+05:30' 
    }
    );

module.exports = sequelize;