const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var fileConfig;
try { fileConfig = require('../../config/db-config.js'); } catch (e) { fileConfig = {}; }
if (!fileConfig || typeof fileConfig !== 'object') fileConfig = {};

var utilityAppObject = new UTILITY_APP();

function getEffectiveConfig() {
    var env = (typeof process !== 'undefined' && process.env) ? process.env : {};
    return {
        user:                env.DB_USER || (fileConfig && fileConfig.user) || 'sqldev',
        password:            null,
        server:              env.DB_SERVER || env.DB_HOST || (fileConfig && fileConfig.server) || '10.0.1.22',
        port:                parseInt(env.DB_PORT, 10) || (fileConfig && fileConfig.port) || 1433,
        database:            env.DB_NAME || env.DB_DATABASE || (fileConfig && fileConfig.database) || 'SE_GRC',
        connectionTimeout:   (fileConfig && fileConfig.connectionTimeout) || 30000,
        requestTimeout:      (fileConfig && fileConfig.requestTimeout) != null ? fileConfig.requestTimeout : 0,
        options:             (fileConfig && fileConfig.options) || { encrypt: true },
        pool:                (fileConfig && fileConfig.pool) || { max: 200, min: 50, idleTimeoutMillis: 30000 }
    };
}

function connectPool() {
    try {
        var dbConfigObject = getEffectiveConfig();
        var env = (typeof process !== 'undefined' && process.env) ? process.env : {};
        var clearTextPassword = (env.DB_PASSWORD && String(env.DB_PASSWORD).trim())
            ? String(env.DB_PASSWORD).trim()
            : null;
        if (!clearTextPassword && fileConfig && fileConfig.password) {
            try {
                clearTextPassword = utilityAppObject.decryptDataByPrivateKey(fileConfig.password);
            } catch (decryptErr) {
                clearTextPassword = (env.DB_PASSWORD && String(env.DB_PASSWORD).trim()) ? String(env.DB_PASSWORD).trim() : null;
            }
        }
        if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('error', 'dbConnection.js : Password for database connection is null. Set DB_PASSWORD env or use encrypted password in config with certs.');
            var hasEnv = env.DB_PASSWORD !== undefined && env.DB_PASSWORD !== null && String(env.DB_PASSWORD).trim() !== '';
            if (!hasEnv) {
                console.error('umapi: DB_PASSWORD env is not set. Create .env in project root with DB_PASSWORD=yourpassword and run: docker compose up -d');
            }
            return Promise.reject(new Error('Database password is null'));
        }
        dbConfigObject.password = clearTextPassword;
        return new MSSQL.ConnectionPool(dbConfigObject).connect().then(function(poolConnectionObject) {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('info', 'Database Connected......');
            return poolConnectionObject;
        }).catch(function(error) {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('error', 'Database Connection Failed. Error: ' + error + ' DB: ' + dbConfigObject.database + ' Server: ' + dbConfigObject.server);
            return Promise.reject(error);
        });
    } catch (error) {
        var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
        if (log) log.log('error', 'dbConnection.js : Database Connection Error : ' + error);
        return Promise.reject(error);
    }
}
var poolConnectionObject = connectPool();

module.exports = {
    poolConnectionObject : poolConnectionObject
  } 