const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../message/message-constant.js');
const EMAIL_CONFIG       = require('../../config/email-config.js')

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
     * @param {*} validateFunction 
     * @param {*} functionName
     * @param {*} accountGUID 
     */
    async updateUserLoginForRefreshToken(userId, userName, refreshedToken, oldToken, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution started.');
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
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUID);
            request.input('UserName',           MSSQL.NVarChar,         userName);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : userId              = ' + userId);
            logger.log('info', 'Account Id : ' + userId + ' : CommonDBManager : updateUserLoginForRefreshToken : AccountGUID              = ' + accountGUID);
            
            return request.execute('UM.UpdateUserLogin').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Output parameters value of UpdateUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : OutMessage  = ' + result.output.OutMessage);
                
                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : userId              = ' + userId);
                logger.log('error', 'Account Id : ' + userId + ' : CommonDBManager : updateUserLoginForRefreshToken : AccountGUID              = ' + accountGUID);

                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg          = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                dbResponseObj.procedureSuccess  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                dbResponseObj.procedureMessage  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {

            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);
            
            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.procedureSuccess  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            dbResponseObj.procedureMessage  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            dbResponseObj.errorMsg          = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

     /**
     * This function will get user-login and users details from database
     * @param {*} userId 
     * @param {*} userName
     * @param {*} accountGUID
     * @returns 
     */
     async getInfoForUserLogin(userId, userName, accountGUID) {
         logger.log('info', 'Account Id : ' + userId + ' : CommonDBManager : getInfoForUserLogin : ACCOUNTGUID_IN_COMMON_DB   = ' + accountGUID);
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution started.');
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

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : userName    = ' + userName);
            logger.log('info', 'Account Id : ' + userId + ' : CommonDBManager : getInfoForUserLogin : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetInfoforUserLogin').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Output parameters value of UM.GetInfoforUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : userName    = ' + userName);
                logger.log('error', 'Account Id : ' + userId + ' : CommonDBManager : getInfoForUserLogin : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : userName    = ' + userName);
            logger.log('error', 'Account Id : ' + userId + ' : CommonDBManager : getInfoForUserLogin : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution end. : Error details : '+ error);
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
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);
            logger.log('info', 'User Id : ' + userId + ' : CommonDBManager : getInfoFunctionAuthorized : AccountGUID    = ' + accountGUIDFromToken);

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
                logger.log('error', 'User Id : ' + userId + ' : CommonDBManager : getInfoFunctionAuthorized : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);
            logger.log('error', 'User Id : ' + userId + ' : CommonDBManager : getInfoFunctionAuthorized : AccountGUID    = ' + accountGUIDFromToken);
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
        logger.log('info', 'User Name : ' + accountName + ' : CommonDB : getAccountIdByAccountName : Execution started.');
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

            logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
            logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : accountName    = ' + accountName);

            return request.execute('[TM].[GetTenantAccountByName]').then(function (result) {

                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Output parameters value of [TM].[GetTenantAccountByName] procedure.');
                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Execution end.');
                logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : DB_RESPONSE_OBJECT  = ' + JSON.stringify(dbResponseObj));
                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
                    logger.log('error', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : accountName   = ' + accountName);
                    logger.log('error', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    logger.log('info', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : DB_RESPONSE_OBJECT  = ' + JSON.stringify(dbResponseObj));
                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
            logger.log('error', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : accountName   = ' + accountName);
            logger.log('error', 'User Name : ' + accountName + ' : CommonDB(UM) : getAccountIdByAccountName : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }


    async addEmailAlerts(userNameFromToken,  emailObj) {
        logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB : addEmailAlerts : Execution started.');
        logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : emailObj             = ' + JSON.stringify(emailObj));

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

            request.input('ToIDs',          MSSQL.NVarChar,     emailObj.TOEmail);
            request.input('CCIDs',          MSSQL.NVarChar,     emailObj.CCEmail);
            request.input('FromID',         MSSQL.NVarChar,     EMAIL_CONFIG.SENDER_CONFIG.senderEmail)
            request.input('EmailSubject',   MSSQL.NVarChar,     emailObj.EmailSubject);
            request.input('EmailContent',   MSSQL.NVarChar,     emailObj.EmailContent);
            request.input('UserName',       MSSQL.NVarChar,     userNameFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Input parameters value for [UM].[AddEmailAlerts] procedure.');
            logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : userNameFromToken    = ' + userNameFromToken);
            logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : emailObj             = ' + JSON.stringify(emailObj));

            return request.execute('[UM].[AddEmailAlerts]').then(function (result) {

                logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Output parameters value of [UM].[AddEmailAlerts] procedure.');
                logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Execution end.');
                logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : DB_RESPONSE_OBJECT  = ' + JSON.stringify(dbResponseObj));
                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Input parameters value for [UM].[AddEmailAlerts] procedure.');
                    logger.log('error', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    logger.log('info', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : DB_RESPONSE_OBJECT  = ' + JSON.stringify(dbResponseObj));
                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Input parameters value for [UM].[AddEmailAlerts] procedure.');
            logger.log('error', 'User Name : ' + userNameFromToken + ' : CommonDB(UM) : addEmailAlerts : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    stop(){
    }
}