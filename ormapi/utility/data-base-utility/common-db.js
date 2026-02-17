const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../message/message-constant.js');

module.exports = class CommonDBManager {
    constructor() {
    }

    start() {

    }

    /**
     * This function will update refreshed token details into database
     * @param {*} userId 
     * @param {*} userName 
     * @param {*} refreshedToken 
     * @param {*} oldToken  
     */
    async updateUserLoginForRefreshToken(userId, userName, refreshedToken, oldToken, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('OldToken',           MSSQL.NVarChar,         oldToken);
            request.input('Token',              MSSQL.NVarChar,         refreshedToken);
            request.input('UserID',             MSSQL.UniqueIdentifier, userId);
            request.input('UserName',           MSSQL.NVarChar,         userName);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : userId              = ' + userId);
            logger.log('info', 'User Id : '+ userId + ' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : AccountGUID        = ' + accountGUID);
            
            return request.execute('UM.UpdateUserLogin').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Output parameters value of UpdateUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : OutMessage  = ' + result.output.OutMessage);
                
                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : userId              = ' + userId);
                logger.log('error', 'User Id : ' + userId + ' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : AccountGUID        = ' + accountGUID);

                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg          = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                dbResponseObj.procedureSuccess  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                dbResponseObj.procedureMessage  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {

            logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);
            
            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.procedureSuccess  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            dbResponseObj.procedureMessage  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            dbResponseObj.errorMsg          = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

 
     /**
     * This function will get user-login and users details from database
     * @param {*} userName 
     * @param {*} userName
     * @returns 
     */
     async getInfoForUserLogin(userId, userName, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : userName    = ' + userName);
            logger.log('info', 'User Id : ' + userId + ' : CommonDBManager(ORM) : getInfoForUserLogin : AccountGUID        = ' + accountGUID);

            return request.execute('UM.GetInfoforUserLogin').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Output parameters value of UM.GetInfoforUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : userName    = ' + userName);
                logger.log('error', 'User Id : ' + userId + ' : CommonDBManager(ORM) : getInfoForUserLogin : AccountGUID        = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : userName    = ' + userName);
            logger.log('error', 'User Id : ' + userId + ' : CommonDBManager(ORM) : getInfoForUserLogin : AccountGUID        = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager(ORM) : getInfoForUserLogin : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

     /**
     * This function will get info for authorized function from database
     * @param {*} userName 
     *  @param {*} userName
     * @returns 
     */
     async getInfoFunctionAuthorized(userId, userName, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken)
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);

            return request.execute('UM.GetInfoforAuthorizedfunction').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Output parameters value of UM.GetInfoforAuthorizedfunction procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * This function will get account data for single user from database
     * @param {*} accountName 
     * @returns 
     */
    async getAccountIdByAccountName(accountName) {
        logger.log('info', 'User Name : ' + accountName + ' : CommonDB ORMgetAccountIdByAccountName : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('CRNCode', MSSQL.NVarChar, accountName);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
            logger.log('info', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : accountName    = ' + accountName);

            return request.execute('[TM].[GetTenantAccountByName]').then(function (result) {

                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Output parameters value of [TM].[GetTenantAccountByName] procedure.');
                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Execution end.');
                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
                    logger.log('error', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : accountName   = ' + accountName);
                    logger.log('error', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
            logger.log('error', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : accountName   = ' + accountName);
            logger.log('error', 'User Name : ' + accountName + ' : CommonDB(ORM) : getAccountIdByAccountName : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    stop(){
    }
}