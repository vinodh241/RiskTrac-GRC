const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var fileConfig;
try { fileConfig = require('../../config/db-config-notification.js'); } catch (e) { fileConfig = {}; }
if (!fileConfig || typeof fileConfig !== 'object') fileConfig = {};

var utilityAppObject = new UTILITY_APP();

function getEffectiveConfig() {
    var env = (typeof process !== 'undefined' && process.env) ? process.env : {};
    return {
        user:                env.NOTIFICATION_DB_USER || env.DB_USER || (fileConfig && fileConfig.user) || 'sqldev',
        password:            null,
        server:              env.NOTIFICATION_DB_SERVER || env.NOTIFICATION_DB_HOST || env.DB_SERVER || env.DB_HOST || (fileConfig && fileConfig.server) || '10.0.1.22',
        port:                parseInt(env.NOTIFICATION_DB_PORT || env.DB_PORT, 10) || (fileConfig && fileConfig.port) || 1433,
        database:            env.NOTIFICATION_DB_NAME || env.NOTIFICATION_DB_DATABASE || env.DB_NAME || env.DB_DATABASE || (fileConfig && fileConfig.database) || 'SE_GRC',
        connectionTimeout:   (fileConfig && fileConfig.connectionTimeout) || 30000,
        requestTimeout:      (fileConfig && fileConfig.requestTimeout) != null ? fileConfig.requestTimeout : 0,
        options:             (fileConfig && fileConfig.options) || { encrypt: true },
        pool:                (fileConfig && fileConfig.pool) || { max: 200, min: 50, idleTimeoutMillis: 30000 }
    };
}

function connectNotificationPool() {
    try {
        var dbConfigObject = getEffectiveConfig();
        var env = (typeof process !== 'undefined' && process.env) ? process.env : {};
        var clearTextPassword = (env.NOTIFICATION_DB_PASSWORD && String(env.NOTIFICATION_DB_PASSWORD).trim())
            ? String(env.NOTIFICATION_DB_PASSWORD).trim()
            : (env.DB_PASSWORD && String(env.DB_PASSWORD).trim()) ? String(env.DB_PASSWORD).trim() : null;
        if (!clearTextPassword && fileConfig && fileConfig.password) {
            try {
                clearTextPassword = utilityAppObject.decryptDataByPrivateKey(fileConfig.password);
            } catch (decryptErr) {
                clearTextPassword = (env.NOTIFICATION_DB_PASSWORD && String(env.NOTIFICATION_DB_PASSWORD).trim()) ? String(env.NOTIFICATION_DB_PASSWORD).trim() : (env.DB_PASSWORD && String(env.DB_PASSWORD).trim()) ? String(env.DB_PASSWORD).trim() : null;
            }
        }
        if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('error', 'dbConnection-notification: Password is null. Set NOTIFICATION_DB_PASSWORD or DB_PASSWORD env or use encrypted password in config with certs.');
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