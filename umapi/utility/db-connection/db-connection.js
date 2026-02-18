const MSSQL         = require('mssql');
const UTILITY_APP   = require('../utility.js');
var dbConfigObject  = require('../../config/db-config.js');

var utilityAppObject = new UTILITY_APP();

function connectPool() {
    try {
        var clearTextPassword = (typeof process !== 'undefined' && process.env && process.env.DB_PASSWORD)
            ? process.env.DB_PASSWORD
            : utilityAppObject.decryptDataByPrivateKey(dbConfigObject.password);
        if (clearTextPassword === null || clearTextPassword === undefined || clearTextPassword === '') {
            var log = (typeof global !== 'undefined' && global.logger && global.logger.log) ? global.logger : null;
            if (log) log.log('error', 'dbConnection.js : Password for database connection is null. Set DB_PASSWORD env or use encrypted password in config.');
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