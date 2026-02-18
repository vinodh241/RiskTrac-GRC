const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config.js');

// Override from environment when running in Docker
if (typeof process !== 'undefined' && process.env) {
    if (process.env.DB_SERVER) dbConfigObject.server = process.env.DB_SERVER;
    if (process.env.DB_USER)   dbConfigObject.user   = process.env.DB_USER;
    if (process.env.DB_NAME)  dbConfigObject.database = process.env.DB_NAME;
    if (process.env.DB_PORT)  dbConfigObject.port = parseInt(process.env.DB_PORT, 10);
}

var utilityAppObject = new UTILITY_APP();

var poolConnectionObject;

try {
    var clearTextPassword   = (typeof process !== 'undefined' && process.env && process.env.DB_PASSWORD)
        ? process.env.DB_PASSWORD
        : (dbConfigObject && dbConfigObject.password && utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password));
    if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
        if (typeof logger !== 'undefined' && logger.log) logger.log('error', 'dbConnection.js : Password for database connection is null. Set DB_PASSWORD env or use encrypted password in config.');
        poolConnectionObject = Promise.reject(new Error('Database password is null'));
    } else {
        dbConfigObject.password = clearTextPassword;
        poolConnectionObject = new MSSQL.ConnectionPool(dbConfigObject).connect().then(function(pool) {
            if (typeof logger !== 'undefined' && logger.log) logger.log('info', 'Database Connected......');
            return pool;
        }).catch(function(error) {
            if (typeof logger !== 'undefined' && logger.log) logger.log('error', 'Database Connection Failed. Error: ' + error + ' DB: ' + dbConfigObject.database + ' Server: ' + dbConfigObject.server);
            return Promise.reject(error);
        });
    }
} catch (error) {
    if (typeof logger !== 'undefined' && logger.log) logger.log('error', 'dbConnection.js : Database Connection Error : ' + error);
    poolConnectionObject = Promise.reject(error);
}

module.exports = {
    poolConnectionObject : poolConnectionObject
};
