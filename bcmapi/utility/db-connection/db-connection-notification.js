const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config-notification.js');

// Override from environment when running in Docker / different environments
if (typeof process !== 'undefined' && process.env) {
    if (process.env.NOTIFICATION_DB_SERVER) dbConfigObject.server = process.env.NOTIFICATION_DB_SERVER;
    else if (process.env.DB_SERVER) dbConfigObject.server = process.env.DB_SERVER;
    if (process.env.NOTIFICATION_DB_USER) dbConfigObject.user = process.env.NOTIFICATION_DB_USER;
    else if (process.env.DB_USER) dbConfigObject.user = process.env.DB_USER;
    if (process.env.NOTIFICATION_DB_NAME) dbConfigObject.database = process.env.NOTIFICATION_DB_NAME;
    else if (process.env.DB_NAME) dbConfigObject.database = process.env.DB_NAME;
    if (process.env.NOTIFICATION_DB_PORT) dbConfigObject.port = parseInt(process.env.NOTIFICATION_DB_PORT, 10);
    else if (process.env.DB_PORT) dbConfigObject.port = parseInt(process.env.DB_PORT, 10);
}

var utilityAppObject = new UTILITY_APP();

try {
    var clearTextPassword = (process.env && (process.env.NOTIFICATION_DB_PASSWORD || process.env.DB_PASSWORD))
        ? (process.env.NOTIFICATION_DB_PASSWORD || process.env.DB_PASSWORD)
        : (dbConfigObject.password ? utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password) : null);
    if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
        logger.log('error', 'dbConnection.js : Password for database connection is null in dbConnection class.');
        console.log("Password for Notification database connection is null. Set NOTIFICATION_DB_PASSWORD or DB_PASSWORD env or check dbConfig in './config/'.");
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
        console.log("Notification Database Connection Failed\nDB Name     : '"+dbConfigObject.database+"'\nServer IP   : '"+dbConfigObject.server+"'\nPort Number : '"+dbConfigObject.port+"'.\nPlease check if the database is up and running, make sure the DB configuration is correct.");
        logger.log('error', 'Notification Database Connection Failed.\nError Details : '+error +'\nDB Name     : '+dbConfigObject.database+'\nServer IP   : '+dbConfigObject.server+'\nPort Number : '+dbConfigObject.port+'.\nPlease check if the database is up and running, make sure the DB configuration is correct.');
        
        process.exit(0);
    })
} catch (error) {
    logger.log('error', 'dbConnection.js : Notification Database Connection Error : '+error);
    console.log("\nNotification Database Connection Error: "+error.stack);
    process.exit(0);
}

module.exports = {
    poolConnectionObjectNotification : poolConnectionObjectNotification
  } 