/***********************************************************************
 *   Author: Tyler Roussos
 *   Filename: app.js
 *   Date Created: October 2, 2012
 *   Last Modified: April 22, 2013
 *   Description:
 *
 *     This node.js app will give a simple interface for
 *     uploading a file. It will store it on the server and the send it
 *     to iSpeech's recognition services.
 *
 * *********************************************************************/

var param = new require('./vars.js');
var locale;                         //The acoustic library locale
var ttsSpeakerType;                 //The ttsSpeaker Voice for the response
var jslog = 0;                      //Holds if logging will occur or not
var appname;                        //Holds the application name
var homeid;
var var1, var2;



exports.voiceAnalyticsUser = function( app, routes, http, path, crypto, applogger, logger, sanitize ) {
    console.log('loading user voiceAnalyticsUser function');

    app.post('/apiv1/voiceAnalyticsUser', function(req, response) {
        var mysql = require('mysql');                               //Including the MySQL Libraries
        var connection = mysql.createConnection({                   //Declare DB Connection Properties
            host     : param.dbhost,
            user     : param.dbuser,
            password : param.dbpass,
            database : param.db,
        });
        var connection2 = mysql.createConnection({                  //Selectiont the 1st value to execute
            host     : param.dbhost,
            user     : param.dbuser,
            password : param.dbpass,
            database : param.db,
        });
        var connection3 = mysql.createConnection({                  //Update the State
            host     : param.dbhost,
            user     : param.dbuser,
            password : param.dbpass,
            database : param.db,
        });
        //THIS SECTION NEEDS TO BE REFACTORED


        // ===================================================
        // @sagar create own parameters and create error messages below
        // ===================================================
        if (!(sanitize(req.body.appkey).xss())){
            var body = '51 - Missing Application Key';                  //Outputting that we are missing the appkey
            response.writeHead(406, {                                   //Writting the Headers of the Response
                'Content-Length': body.length,
                'Content-Type': 'text/plain' });
            response.write(body);                                       //Writting the Body of the Response
            response.end();                                             //Sending the Response
        }
        else if (!(sanitize(req.body.appsecret).xss())){
            var body = '52 - Missing Application Secret';               //Outputting that we are missing the appsecret
            response.writeHead(406, {                                   //Writting the Headers of the Response
                'Content-Length': body.length,
                'Content-Type': 'text/plain' });
            response.write(body);                                       //Writting the Body of the Response
            response.end();                                             //Sending the Response
        }
        else if (!(sanitize(req.body.conkey).xss())){
            var body = '53 - Missing Consumer Key';                     //Outputting that we are missing the conkey
            response.writeHead(406, {                                   //Writting the Headers of the Response
                'Content-Length': body.length,
                'Content-Type': 'text/plain' });
            response.write(body);                                       //Writting the Body of the Response
            response.end();                                             //Sending the Response
        }
        else if (!(sanitize(req.body.consecret).xss())){
            var body = '54 - Missing Consumer Secret';                  //Outputting that we are missing the consecret
            response.writeHead(406, {                                   //Writting the Headers of the Response
                'Content-Length': body.length,
                'Content-Type': 'text/plain' });
            response.write(body);                                       //Writting the Body of the Response
            response.end();                                             //Sending the Response
        }
        else{

            var valid_credentials = 1;           //Initalizing a variable to track the validation of the credentials
            connection.connect(function(err){
                if(err && jslog == 1){
                    logger.debug('Connection Error:' + err);
                }
            });
            //Connecting to the database
            // |  Checking the database to see if the submitted Application Key Exists
            // V  Also escaping all of the input to prevent SQL injection
            connection.query('SELECT appkey FROM APPLICATION_KEYS WHERE appkey=' +
                connection.escape(req.body.appkey) + ' AND appsecret=' +
                connection.escape(req.body.appsecret), function(app_err, app_rows, app_fields) {
                if (app_err) throw app_err;            //Throwing an error if one occured
                if(app_rows[0] != undefined){          //Checking if a row was returned (will indicate if the Application Key is in the Database)
                    if(jslog == 1){
                        logger.debug('APPLICATION KEY: ', app_rows[0]);
                    }
                }
                else{
                    if(jslog == 1){
                        logger.error("BAD APPLICATION KEY");
                    }
                    valid_credentials = 0;     //Devalidating the Request
                }
            });
// |  Checking the database to see if the submitted Consumer Key Exists
// V  Also escaping all of the input to prevent SQL injection
            connection.query('SELECT conkey FROM CONSUMER_KEYS WHERE conkey=' + connection.escape(req.body.conkey) + ' AND consecret=' + connection.escape(req.body.consecret), function(cons_err, cons_rows, cons_fields) {
                if (cons_err) throw cons_err;                             //Throwing an error if one occured
                if(cons_rows[0] != undefined){                            //Checking if a row was returned (will indicate if the Consumer Key is in the Database)
                    if(jslog == 1){
                        logger.debug('CONSUMER KEY: ', cons_rows[0]);          //!!DEBUG - THE CONSUMER KEY IF WE GOT ONE BACK
                    }
                }
                else{
                    if(jslog == 1){
                        logger.error("BAD CONSUMER KEY");                      //!!DEBUG - ERROR IF THE CONSUMER KEY DOSE NOT COME BACK
                    }
                    valid_credentials = 0;                                  //Devalidating the Request
                }
            });
            // |  Checking the database to see if the submitted Consumer Key matches an Application Key
            // V  Also escaping all of the input to prevent SQL injection
            connection.query('SELECT conkey FROM APP_CONSUMER_LOOKUP WHERE conkey=' + connection.escape(req.body.conkey) + ' AND appkey=' + connection.escape(req.body.appkey), function(match_err, match_rows, match_fields) {
                if (match_err) throw match_err;                           //Throwing an error if one occured
                if(match_rows[0] != undefined){                           //Checking if a row was returned (will indicate if the keys are matched in the Database)
                    if(jslog == 1){
                        logger.debug('MATCHED CONSUMER KEY: ', match_rows[0]);
                    }
                }
                else{
                    if(jslog == 1){
                        logger.error("KEY MISMATCH");                          //!!DEBUG - ERROR IF THE KEY DOSE NOT COME BACK
                    }
                    valid_credentials = 0;                                  //Devalidating the Request
                }
            });

            if(1 == valid_credentials){
                connection.query('SELECT appname FROM APPLICATION_KEYS WHERE appkey=' +
                    connection.escape(req.body.appkey), function(match_err, match_rows, match_fields) {
                    if (match_err) throw match_err;                           //Throwing an error if one occured
                    if(match_rows[0] != undefined){
                        appname = match_rows[0].appname;                        //Setting the appname from the query
                        applogger.info('Application: ' + appname + ' Consumer Key: ' + sanitize(req.body.conkey).xss());
                        if(jslog == 1){
                            logger.debug('APPLICATION NAME: ', match_rows[0].appname);        //!!DEBUG - THE CONSUMER KEY IF WE GOT ONE BACK
                        }

                        //var sqlQueryCommand = 'SELECT TOP 1 * FROM `_MOBILE_SAAS`.`VHACommands` ' +
                        //  'WHERE type=0 AND state=0 ORDER BY time_created ASCENDING';

                        // ===================================================
                        // @Sagar any additional mysql queries should be done below
                        // ===================================================
                        var sqlQueryCommand = "SELECT id, time_created, command as voice_command, conkey, homeprofileID FROM `_MOBILE_SAAS`.`VoiceAnalytics`  WHERE conkey = '"+req.body.conkey+"' ORDER BY time_created";
                        applogger.info('sqlQueryCommand: ' + sqlQueryCommand);
                        connection2.connect(function(err){
                            if(err && jslog == 1){
                                logger.debug('Connection 2 Error:' + err);
                            }
                        });

                        connection2.query(sqlQueryCommand, [var1, var2], function(match_err_QC, match_rows_QC, match_fields_QC) {   //Try to make the update on the database
                            if (match_err_QC) throw match_err_QC;                              //Throwing an error if one occured
                            if(match_rows_QC[0] != undefined){
                                var arrayLen = match_rows_QC.length;
                                var arrCount = 0;
                                var doneFlag = false;
                                //var v_command = match_rows_QC[0].voice_command;
                                //var time_stamp = match_rows_QC[0].time_created;


                                while ( arrCount < arrayLen && !doneFlag ){

                                    if(match_rows_QC[arrCount].state == 0){
                                        command = match_rows_QC[arrCount].command;                                //Setting the appname from the query
                                        applogger.info('Command: ' + command );
                                        if(jslog == 1){
                                            logger.debug('Command: ' + command );
                                        }

                                        // ===================================================
                                        // @Sagar always have the below attributes for response
                                        // ===================================================
                                        var response_json = {
                                            "app": appname,
                                            "response": command,
                                            "response_code": "0"
                                        };
                                        var response_text = JSON.stringify(response_json);
                                        response.writeHead(200, {
                                            'Content-Length': response_text.length,
                                            'Content-Type': 'text/plain' });
                                        response.write(response_text);
                                        response.end();

                                        // Stop the while loop - trigger
                                        doneFlag = true;

                                        // Update the SQL to state it is in process
                                        var sqlid = match_rows_QC[arrCount].id;
                                        applogger.info('id: ' + sqlid );
                                        if(jslog == 1){
                                            logger.debug('id: ' + sqlid );
                                        }

                                        var sql = 'UPDATE `_MOBILE_SAAS`.`VHACommands` SET `state`=1 where id=' + sqlid;

                                        connection3.connect(function(err){
                                            if(err && jslog == 1){
                                                logger.debug('Connection 2 Error:' + err);
                                            }
                                        });

                                        connection3.query(sql, function(err, res) {
                                            if (err) throw err;
                                            if(err){
                                                logger.debug('SQL Update Error:' + err);
                                            }
                                        }); // SQL Connection 3

                                    }
                                    else if(match_rows_QC[arrCount].state == 1){
                                        // Update the DB to state it is completed
                                        var sqlComplete = 'UPDATE `_MOBILE_SAAS`.`VHACommands` SET `state`=2' +  ' where id=' + match_rows_QC[arrCount].id;

                                        connection3.connect(function(err){
                                            if(err && jslog == 1){
                                                logger.debug('Connection 2 Error:' + err);
                                            }
                                        });

                                        connection3.query(sqlComplete, function(err, res) {
                                            if (err) throw err;
                                            if(err){
                                                logger.debug('SQL Update complete Error:' + err);
                                            }
                                        }); // SQL Connection 3

                                    }

                                    else if(match_rows_QC[arrCount].state == 2){
                                        // Remove completed items
                                        var sqlComplete = 'DELETE FROM `_MOBILE_SAAS`.`VHACommands`  where id=' + match_rows_QC[arrCount].id;

                                        connection3.connect(function(err){
                                            if(err && jslog == 1){
                                                logger.debug('Connection 2 Error:' + err);
                                            }
                                        });

                                        connection3.query(sqlComplete, function(err, res) {
                                            if (err) throw err;
                                            if(err){
                                                logger.debug('SQL DELETE Error:' + err);
                                            }
                                        }); // SQL Connection 3

                                    }

                                    arrCount++;


                                }  // while

                                // When the doneflag is not hit send back that there is no new command to invoke
                                if ( !doneFlag ){
                                    arrCount = 0
                                    var jsonResult = {};
                                    var time = [];
                                    // loop through database result and put into json object (timestamp and commmand)
                                    while ( arrCount < arrayLen ){
                                        var v_command = match_rows_QC[arrCount].voice_command;
                                        var time_stamp = String(match_rows_QC[arrCount].time_created);
                                        time.push(v_command);
                                        var r = "Z"+Math.random()*100000+"T";
                                        jsonResult[time_stamp+r] = v_command;
                                        arrCount++;
                                    }
                                    var response_json = {
                                        "response_code": "2",
                                        "total_results": arrayLen,
                                        "app": appname,
                                        "result": jsonResult,
                                        "time": time
                                    };
                                    var response_text = JSON.stringify(response_json);
                                    response.writeHead(200, {
                                        'Content-Length': response_text.length,
                                        'Content-Type': 'text/plain' });
                                    response.write(response_text);
                                    response.end();

                                    //arrCount++;
                                    //}
                                }
                            } // array not empty
                            else
                            if(jslog == 1){
                                logger.debug('ERROR:  Array empty');
                            }
                            else{
                                // Pass back the data attained from the selection to the VHA
                                // return was an error (1), but still made contact
                                var response_json = {
                                    "app": appname,
                                    "response": "EMPTY",
                                    "response_code" : "1"

                                };
                                var response_text = JSON.stringify(response_json);
                                response.writeHead(200, {
                                    'Content-Length': response_text.length,
                                    'Content-Type': 'text/plain' });
                                response.write(response_text);
                                response.end();
                            }

                        });  // SELECT TOP 1 * FROM `_MOBILE_SAAS`.`VHACommands
                    }

                });
            }

            connection.end(function(err){                                                 //Closing the Database Connection
                if(jslog == 1){
                    logger.debug('Valid: ' + valid_credentials);                          //!!DEBUG - ECHOING IF THE CREDENTIALS ARE VALID
                }
            });
        }
    });
}
