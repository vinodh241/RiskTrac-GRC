const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config-notification.js');

var utilityAppObject = new UTILITY_APP();

try {
    var clearTextPassword   = utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password);
    // console.log("clearTextPassword :: "+clearTextPassword);
    if(clearTextPassword === null){
        logger.log('error', 'dbConnection.js : Password for database connection is null in dbConnection class.');
        // console.log("Password for Notification database connection is null in dbConnection class. Please check dbConfig file into './config/' path");
        process.exit(0);
    }
    dbConfigObject.password = clearTextPassword;

    var poolConnectionObjectNotification = new MSSQL.ConnectionPool(dbConfigObject).connect().then(poolConnectionObjectNotification => {
        console.log("Notification Database Connected......");
        logger.log('info', 'Notification Database Connected......');
        return poolConnectionObjectNotification;
    })
    .catch(error => {
        /**
         * poolConnectionObjectNotification creation failure, Database configuration is incorrect.
         * write error message in log file
         * Stop loading application and exit the application startup
         */
        // console.log("\nNotification Database Connection Error: "+error);
        // console.log("Notification Database Connection Failed\nDB Name     : '"+dbConfigObject.database+"'\nServer IP   : '"+dbConfigObject.server+"'\nPort Number : '"+dbConfigObject.port+"'.\nPlease check if the database is up and running, make sure the DB configuration is correct.");
        logger.log('error', 'Notification Database Connection Failed.\nError Details : '+error +'\nDB Name     : '+dbConfigObject.database+'\nServer IP   : '+dbConfigObject.server+'\nPort Number : '+dbConfigObject.port+'.\nPlease check if the database is up and running, make sure the DB configuration is correct.');
        
        process.exit(0);
    })
} catch (error) {
    logger.log('error', 'dbConnection.js : Notification Database Connection Error : '+error);
    // console.log("\nNotification Database Connection Error: "+error.stack);
    process.exit(0);
}

module.exports = {
    poolConnectionObjectNotification : poolConnectionObjectNotification
  } 