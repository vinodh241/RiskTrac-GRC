const MSSQL = require('mssql');

module.exports = class CommonDBManager {
    constructor() {
    }

    start() {

    }

    /**
     * This function will update refreshed token details into database
     * @param {*} userName 
     * @param {*} token 
     * @param {*} callback 
     */
    updateUserLoginForRefreshToken(userId, userName, refreshedToken, oldToken, validateFunction, functionName, callback) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status:             0,
            recordset:          null,
            errorMsg:           null,
            procedureSuccess:   false,
            procedureMessage:   null
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('OldToken',           MSSQL.NVarChar,   oldToken);
            request.input('Token',              MSSQL.NVarChar,   refreshedToken);
            request.input('UserID',             MSSQL.BigInt,     userId);
            request.input('UserName',           MSSQL.NVarChar,   userName);
            request.input('ValidateFunction',   MSSQL.Bit,        validateFunction);
            request.input('FunctionName',       MSSQL.NVarChar,   functionName);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : userId              = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : validateFunction    = ' + validateFunction);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : functionName        = ' + functionName);
            
            request.execute('UpdateUserLogin').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Output parameters value of UpdateUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : OutMessage  = ' + result.output.OutMessage);
                
                dbResponseObj.status            = 1;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : userId              = ' + userId);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : validateFunction    = ' + validateFunction);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : functionName        = ' + functionName);

                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);

                dbResponseObj.status            = 2;
                dbResponseObj.errorMsg          = "Error on procedure execution";
                dbResponseObj.procedureSuccess  = false;
                dbResponseObj.procedureMessage  = "Error on procedure execution";
                callback(dbResponseObj);
            });
        } catch (error) {

            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);
            
            dbResponseObj.status            = 0;
            dbResponseObj.procedureSuccess  = false;
            dbResponseObj.procedureMessage  = "Unable to connect database, Possible reason : database server is down or network error.";
            dbResponseObj.errorMsg          = "Got unhandled exception in DB layer.";
            callback(dbResponseObj);
        }
    }

    stop(){
    }
}