const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config.js');

// Override from environment when running in Docker / different environments
if (typeof process !== 'undefined' && process.env) {
    if (process.env.DB_SERVER) dbConfigObject.server = process.env.DB_SERVER;
    if (process.env.DB_USER)   dbConfigObject.user   = process.env.DB_USER;
    if (process.env.DB_NAME)   dbConfigObject.database = process.env.DB_NAME;
    if (process.env.DB_PORT)   dbConfigObject.port = parseInt(process.env.DB_PORT, 10);
}

var utilityAppObject = new UTILITY_APP();

try {
    var clearTextPassword = (process.env && process.env.DB_PASSWORD)
        ? process.env.DB_PASSWORD
        : (dbConfigObject.password ? utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password) : null);
    if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
        logger.log('error', 'dbConnection.js : Password for database connection is null in dbConnection class.');
        console.log("Password for database connection is null. Set DB_PASSWORD env or check dbConfig in './config/' (encrypted password).");
        process.exit(0);
    }
    dbConfigObject.password = clearTextPassword;

    var poolConnectionObject = new MSSQL.ConnectionPool(dbConfigObject)
        .connect()
        .then(poolConnectionObject => {
             console.log("Database Connected......");
            logger.log('info', 'Database Connected......');
            return poolConnectionObject;
        }).catch(error => {
            /**
             * poolConnectionObject creation failure, Database configuration is incorrect.
             * write error message in log file
             * Stop loading application and exit the application startup
             */
            // console.log("\nDatabase Connection Error: "+error);
            console.log("Database Connection Failed\nDB Name     : '"+dbConfigObject.database+"'\nServer IP   : '"+dbConfigObject.server+"'\nPort Number : '"+dbConfigObject.port+"'.\nPlease check if the database is up and running, make sure the DB configuration is correct.");
            logger.log('error', 'Database Connection Failed.\nError Details : ' + error + '\nDB Name     : ' + dbConfigObject.database + '\nServer IP   : ' + dbConfigObject.server + '\nPort Number : ' + dbConfigObject.port + '.\nPlease check if the database is up and running, make sure the DB configuration is correct.');

            process.exit(0);
        })
} catch (error) {
    logger.log('error', 'dbConnection.js : Database Connection Error : '+error);
    console.log("\nDatabase Connection Error: "+error.stack);
    process.exit(0);
}

module.exports = {
    poolConnectionObject : poolConnectionObject
  } 