const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config-notification.js');

// Override from environment when running in Docker
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

var poolConnectionObjectNotification;

try {
    var clearTextPassword   = (typeof process !== 'undefined' && process.env && (process.env.NOTIFICATION_DB_PASSWORD || process.env.DB_PASSWORD))
        ? (process.env.NOTIFICATION_DB_PASSWORD || process.env.DB_PASSWORD)
        : (dbConfigObject && dbConfigObject.password && utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password));
    if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
        if (typeof logger !== 'undefined' && logger.log) logger.log('error', 'dbConnection-notification: Password is null. Set NOTIFICATION_DB_PASSWORD or DB_PASSWORD env or use encrypted password in config.');
        poolConnectionObjectNotification = Promise.reject(new Error('Notification database password is null'));
    } else {
        dbConfigObject.password = clearTextPassword;
        poolConnectionObjectNotification = new MSSQL.ConnectionPool(dbConfigObject).connect()
            .then(function(pool) {
                if (typeof logger !== 'undefined' && logger.log) logger.log('info', 'Notification Database Connected......');
                return pool;
            })
            .catch(function(error) {
                if (typeof logger !== 'undefined' && logger.log) logger.log('error', 'Notification Database Connection Failed. Error: ' + error + ' DB: ' + dbConfigObject.database);
                return Promise.reject(error);
            });
    }
} catch (error) {
    if (typeof logger !== 'undefined' && logger.log) logger.log('error', 'dbConnection-notification : Notification Database Connection Error : ' + error);
    poolConnectionObjectNotification = Promise.reject(error);
}

module.exports = {
    poolConnectionObjectNotification : poolConnectionObjectNotification
};
