/***********************************************************************
*   Author: Sagar Sood
*   Filename: appAdmin.js
*   Description: 
* 
*     This node.js app will give a simple interface for
*     uploading a file. It will store it on the server and the send it
*     to iSpeech's recognition services.
* 
* *********************************************************************/

var param = new require('./includes/vars.js'); 
var voiceAnalyticsUser = new require('./includes/voiceAnalyticsUser.js');
var voiceAnalyticsHomeProfile = new require('./includes/voiceAnalyticsHomeProfile.js');
var voiceAnalyticsAverage = new require('./includes/voiceAnalyticsAverage.js');
var queryCommandWOWdemo = new require('./includes/queryCommandWOWdemo.js');
var queryGuiWOWdemo = new require('./includes/queryGuiWOWdemo.js');

var jslog = 1;                                                                  //Holds if logging will occur or not
var appname;                                                                    //Holds the application name 

var express = require('express')                                                //Require the base framework for the express interface                
  , routes = require('./routes')                                                //Require the routes for routing paths
  , user = require('./routes/user')
  , http = require('http')                                                      //Require the http library
  , path = require('path')
  , crypto = require('crypto')
  , log4js = require('log4js')                                                  //Require the logger package
  , sanitize = require('validator').sanitize;                                   //This module is used to sanitize entered data to prevent XSS

if(param.debug == 1 && param.logging == 1){                                     //This block will setup the logging
  log4js.configure({                                                            //As well as the console debug output
    appenders: [
      { 
        type: 'file', 
        filename: param.logpath,
        category: ['OMMS_MOBILE_API', 'console'] 
      },
      { type: 'console'}
    ],
    replaceConsole: true
  });
  jslog = 1;
}
else if (param.debug == 1){
  log4js.configure({
    appenders: [
      { type: 'console'}
    ]
  });
  jslog = 1;
}
else if (param.logging == 1){
  log4js.configure({
    appenders: [
      { type: 'file', filename: param.logpath, category: 'OMMS_MOBILE_API' }
    ]
  });
  jslog = 1;
}

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(param.applogpath), 'App Usage');

var logger = log4js.getLogger('OMMS_MOBILE_ADMIN_API'); 
var applogger = log4js.getLogger('Admin App Usage');

var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || param.portnumber);                        //Setup the app to listen on port 26900
//  app.set('port', process.env.PORT || 3000 );                        //Setup the app to listen on port 26900
  app.set('views', __dirname + '/views');                                       //Define the views directory
  app.set('view engine', 'jade');                                               //Define Jade as the views engine
  app.use(express.favicon());
  app.use(express.logger('dev'));                                               //Set logging to development
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// Launch the Query Command API - with WOW DB
queryCommandWOWdemo.queryCommandWOWdemo( app, routes, http, path, crypto, applogger, logger, sanitize );

// Launch the Query Gui API - with WOW DB
queryGuiWOWdemo.queryGuiWOWdemo( app, routes, http, path, crypto, applogger, logger, sanitize );

// Launch the voiceAnalyticsUser API Call
voiceAnalyticsUser.voiceAnalyticsUser( app, routes, http, path, crypto, applogger, logger, sanitize );
// Launch the voiceAnalyticsHomeProfile API Call
voiceAnalyticsHomeProfile.voiceAnalyticsHomeProfile( app, routes, http, path, crypto, applogger, logger, sanitize );
// Launch the voiceAnalyticsAverage API Call
voiceAnalyticsAverage.voiceAnalyticsAverage( app, routes, http, path, crypto, applogger, logger, sanitize );


http.createServer(app).listen(app.get('port'), function(){                      //Create the HTTP Server
  logger.info("Express server listening on port " + app.get('port'));           //Print confirmation that the server is up and its port number
})
