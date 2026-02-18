const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config-notification.js');

var utilityAppObject = new UTILITY_APP();

function connectNotificationPool() {
    try {
        var clearTextPassword = (typeof process !== 'undefined' && process.env && (process.env.NOTIFICATION_DB_PASSWORD || process.env.DB_PASSWORD))
            ? (process.env.NOTIFICATION_DB_PASSWORD || process.env.DB_PASSWORD)
            : utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password);
        if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('error', 'dbConnection-notification: Password is null. Set NOTIFICATION_DB_PASSWORD env or use encrypted password in config.');
            return Promise.reject(new Error('Notification database password is null'));
        }
        dbConfigObject.password = clearTextPassword;
        return new MSSQL.ConnectionPool(dbConfigObject).connect().then(function(poolConnectionObjectNotification) {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('info', 'Notification Database Connected......');
            return poolConnectionObjectNotification;
        }).catch(function(error) {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('error', 'Notification Database Connection Failed. Error: ' + error + ' DB: ' + dbConfigObject.database);
            return Promise.reject(error);
        });
    } catch (error) {
        var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
        if (log) log.log('error', 'dbConnection-notification: ' + error);
        return Promise.reject(error);
    }
}
var poolConnectionObjectNotification = connectNotificationPool();

module.exports = {
    poolConnectionObjectNotification : poolConnectionObjectNotification
  } 