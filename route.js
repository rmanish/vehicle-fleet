

const _ = require('lodash');
const app = module.exports = require('express')();
const flagerr = false;
const  functions = require('./functions');
const  exceptions = functions.exception;
const  routeErrorMessage = 'sorry our chefs are busy cooking some dessert!';

  // load routes after categories have been cached
require('./intialize/index').load(function (err) {
  if (err) {
    flagerr = true;
    // bugsnag.notify(err, { context: "Api Server Error" });
  }

  //IMPORTANT
  // cross origin request allowed to be removed on live
  app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Content-Type", "application/json");
   res.header("Server-Time-Stamp", new Date().getTime()/1000);
   next();
  });

  /* Sample how to mount a middleware across all routes */
  //app.use(functions.filter.externalAuthPassFilter);
  //app.use(functions.filter.authPassCheck);
  app.use(functions.filter.headerParserLayer);
  /**
   * Now that all the necessary middlewares are in place,
   * mount various apps
   */
  require(__dirname + '/routes/').forEach(function (a) {
      console.log(a);
    app.use(a.prefix, a.app);
  });

  // initial app load check
  if ( !flagerr ) {
    console.log('routes mounted');
    /**
     * will hit this part if no error is there and no route is matched
    **/
    app.use( function (req, res) {
      res.send({
        status: "error",
        data: {},
        error: {
          status: 404,
          message: 'refer API doc!!!! cause there is no such route.'
        }
      });
    });
  } else {
    app.use(function (req, res) {
      exceptions.customException(req, res, routeErrorMessage, 500);
    })
    console.log('mar gaye re!!!');
  }
});