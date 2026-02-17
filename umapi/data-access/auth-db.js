const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class AuthDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will get user data for single user from database
     * @param {*} userName 
     * @returns 
     */ 
    async getUserIdByUserName(userName, accountGUID) {
        logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Execution started.');
        logger.log('info', 'UserManagementDb : addAssignUser : accountGUID : ' + accountGUID);

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

            request.input('ADUsername',     MSSQL.NVarChar,         userName);
            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Input parameters value for UM.GetUsers procedure.');
            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : userName       = ' + userName);
            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetUsers').then(function (result) {
                
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Output parameters value of UM.GetUsers procedure.');
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Input parameters value for UM.GetUsers procedure.');
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : userName       = ' + userName);
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Input parameters value for UM.GetUsers procedure.');
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : userName       = ' + userName);
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserIdByUserName : Execution end. : Error details : '+ error);
            
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }


    /**
     * This function will get user data for single user from database
     * @param {*} userName 
     * @returns 
     */ 
    async getUserDetailsByUserId(userName, accountGUID) {
        logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Execution started.');
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

            request.input('UserGUID',       MSSQL.UniqueIdentifier, userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Input parameters value for UM.GetUsers procedure.');
            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : userID         = ' + userName);
            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetUsers').then(function (result) {
                
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Output parameters value of UM.GetUsers procedure.');
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Input parameters value for UM.GetUsers procedure.');
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : ADUsername = ' + userName);
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : userName   = ' + userName);
                logger.log('error', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : getUserDetailsByUserId : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Input parameters value for UM.GetUsers procedure.');
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : ADUsername = ' + userName);
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : userName   = ' + userName);
            logger.log('error', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : getUserDetailsByUserId : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserDetailsByUserId : Execution end. : Error details : '+ error);
            
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will get user data for single user from database
     * @param {*} userName 
     * @returns 
     */ 
    async getUserOTP(userName, accountGUID) {
        logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Execution started.');
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

            request.input('UserGUID',       MSSQL.UniqueIdentifier, userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Input parameters value for UM.GetUserOTP procedure.');
            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : ADUsername  = ' + userName);
            logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : userName    = ' + userName);
            logger.log('info', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : getUserOTP : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetUserOTP').then(function (result) {
                
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Output parameters value of UM.GetUserOTP procedure.');
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Input parameters value for UM.GetUserOTP procedure.');
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : ADUsername = ' + userName);
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : userName   = ' + userName);
                logger.log('error', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : getUserOTP : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Input parameters value for UM.GetUserOTP procedure.');
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : ADUsername = ' + userName);
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : userName   = ' + userName);
            logger.log('error', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : getUserOTP : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Name : '+ userName +' : AuthDb(UM) : getUserOTP : Execution end. : Error details : '+ error);
            
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }


    /**
     * This function will get accounts data from database
     * @param {*} userName 
     * @returns 
     */
    async getAllAccountsName() {
        logger.log('info', ' : AuthDb(UM) : getAllAccountsName : Execution started.');
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

            // request.input('ADUsername', MSSQL.NVarChar, userName);
            // request.input('UserName', MSSQL.NVarChar, userName);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', ' : AuthDb(UM) : getAllAccountsName : Input parameters value for [TM].[GetAllTenantAccount] procedure.');

            return request.execute('[TM].[GetAllTenantAccount]').then(function (result) {

                logger.log('info', ' : AuthDb(UM) : getAllAccountsName : Output parameters value of [TM].[GetAllTenantAccount] procedure.');
                logger.log('info', ' : AuthDb(UM) : getAllAccountsName : Success      = ' + result.output.Success);
                logger.log('info', ' : AuthDb(UM) : getAllAccountsName : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', ' : AuthDb(UM) : getAllAccountsName : Execution end.');

                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', ' : AuthDb(UM) : getAllAccountsName : Input parameters value for [TM].[GetAllTenantAccount] procedure.');
                    logger.log('error', ' : AuthDb(UM) : getAllAccountsName : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', ' : AuthDb(UM) : getAllAccountsName : Input parameters value for [TM].[GetAllTenantAccount] procedure.');
            logger.log('error', ' : AuthDb(UM) : getAllAccountsName : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

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
        logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Execution started.');
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

            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : userName    = ' + userName);
            logger.log('info', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getInfoForUserLogin : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetInfoforUserLogin').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Output parameters value of UM.GetInfoforUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : userName    = ' + userName);
                logger.log('error', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getInfoForUserLogin : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : userName    = ' + userName);
            logger.log('error', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getInfoForUserLogin : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoForUserLogin : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * This function will update user login details into database
     * @param {*} userId 
     * @param {*} userName 
     */
    async updateUserLogin(userId, userName,token, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Execution started.');
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

            request.input('UserID',             MSSQL.UniqueIdentifier, userId);
            request.input('UserName',           MSSQL.NVarChar,         userName);
            request.input('Token',              MSSQL.NVarChar,         token);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Input parameters value for UM.UpdateUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : UserID              = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : UserName            = ' + userName);
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Token               = ' + token);
            logger.log('info', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getInfoForUserLogin : AccountGUID    = ' + accountGUID);

            return request.execute('UM.UpdateUserLogin').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Output parameters value of UM.UpdateUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Success      = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : OutMessage   = ' + result.output.OutMessage);
                
                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Input parameters value for UM.UpdateUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : UserID              = ' + userId);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : UserName            = ' + userName);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Token               = ' + token);
                logger.log('error', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getInfoForUserLogin : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Input parameters value for UM.UpdateUserLogin procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : UserID              = ' + userId);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : UserName            = ' + userName);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Token               = ' + token);
            logger.log('error', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getInfoForUserLogin : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogin : Execution end. : Error details : '+ error);
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
    async getInfoFunctionAuthorized(userId, userName) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Execution started.');
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
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : userName    = ' + userName);

            return request.execute('UM.GetInfoforAuthorizedfunction').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Output parameters value of UM.GetInfoforAuthorizedfunction procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : userName    = ' + userName);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : userName    = ' + userName);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * This function will get user subscription details from database
     * @param {*} userName 
     * @returns 
     */
    async getUserSubscription(userId, userName, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Execution started.');
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

            request.input('UserGUID',       MSSQL.UniqueIdentifier, userId);
            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Input parameters value for UM.GetUserSubscription procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : UserGUID    = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : userName    = ' + userName);
            logger.log('info', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getUserSubscription : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetUserSubscription').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Output parameters value of UM.GetUserSubscription procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Input parameters value for UM.GetUserSubscription procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : UserGUID    = ' + userId);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : userName    = ' + userName);
                logger.log('error', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getUserSubscription : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Input parameters value for UM.GetUserSubscription procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : UserGUID    = ' + userId);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : userName    = ' + userName);
            logger.log('error', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : getUserSubscription : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getUserSubscription : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * This will get all authorized functions list for a user id.
     * @param {*} userId 
     * @param {*} userName 
     * @returns 
     */
    async getAllAuthorizedFunctions(userId, userName, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Execution started.');
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

            request.input('UserGUID',       MSSQL.UniqueIdentifier, userId);
            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.VarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Input parameters value for UM.GetAllAuthorizedFunctions procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : UserGUID    = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : userName    = ' + userName);
            logger.log('info', 'Account Id : ' + userId + ' : AuthDb(UM) : getAllAuthorizedFunctions : AccountGUID    = ' + accountGUID);

            return request.execute('UM.GetAllAuthorizedFunctions').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Output parameters value of UM.GetAllAuthorizedFunctions procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Input parameters value for UM.GetAllAuthorizedFunctions procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : UserGUID    = ' + userId);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : userName    = ' + userName);
                logger.log('error', 'Account Id : ' + userId + ' : AuthDb(UM) : getAllAuthorizedFunctions : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Input parameters value for UM.GetAllAuthorizedFunctions procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : UserGUID    = ' + userId);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : userName    = ' + userName);
            logger.log('error', 'Account Id : ' + userId + ' : AuthDb(UM) : getAllAuthorizedFunctions : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : getAllAuthorizedFunctions : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * This function will update user logout from database
     * @param {*} userId 
     * @param {*} userName 
     * @param {*} token      
     */
    async updateUserLogout(userId, userName, token, accountGUID) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Execution started.');
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

            request.input('UserID',             MSSQL.UniqueIdentifier, userId);
            request.input('UserName',           MSSQL.NVarChar,         userName);
            request.input('Token',              MSSQL.NVarChar,         token);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUID);           
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Input parameters value for UM.Logout procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : UserID     = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : UserName   = ' + userName);
            logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Token      = ' + token);
            logger.log('info', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : updateUserLogout : AccountGUID    = ' + accountGUID);
            
            return request.execute('UM.Logout').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Output parameters value of UM.Logout procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Success      = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Input parameters value for UM.Logout procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : UserID    = ' + userId);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : UserName  = ' + userName);
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Token     = ' + token);
                logger.log('info', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : updateUserLogout : AccountGUID    = ' + accountGUID);           
                logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Input parameters value for UM.Logout procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : UserID    = ' + userId);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : UserName  = ' + userName);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Token     = ' + token);  
            logger.log('info', 'Account Id : ' + accountGUID + ' : AuthDb(UM) : updateUserLogout : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : AuthDb(UM) : updateUserLogout : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * This function will get accounts data from database
     * @param {*} userName 
     * @returns 
     */
    async GetUserCredentialHistory(userID, credentialHistoryRecordsCount, tenant_AccountGUID) {
        logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Execution started.');
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

            request.input('UserGUID',                   MSSQL.UniqueIdentifier,     userID);
            request.input('AccountGUID',                MSSQL.UniqueIdentifier,     tenant_AccountGUID);
            request.input('CredentialHistoryRecords',   MSSQL.BigInt,               credentialHistoryRecordsCount);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Input parameters value for [UM].[GetUserCredentialHistory] procedure.');
            logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Input parameters value for userID                        : ' + userID);
            logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Input parameters value for tenant_AccountGUID            : ' + tenant_AccountGUID);
            logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Input parameters value for credentialHistoryRecordsCount : ' + credentialHistoryRecordsCount);
            

            return request.execute('[UM].[GetUserCredentialHistory]').then(function (result) {

                logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Output parameters value of [UM].[GetUserCredentialHistory] procedure.');
                logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Success      = ' + result.output.Success);
                logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', ' : AuthDb(UM) : GetUserCredentialHistory : Execution end.');

                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', ' : AuthDb(UM) : GetUserCredentialHistory : Input parameters value for [UM].[GetUserCredentialHistory] procedure.');
                    logger.log('error', ' : AuthDb(UM) : GetUserCredentialHistory : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', ' : AuthDb(UM) : GetUserCredentialHistory : Input parameters value for [UM].[GetUserCredentialHistory] procedure.');
            logger.log('error', ' : AuthDb(UM) : GetUserCredentialHistory : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will get account data for single user from database
     * @param {*} accountName 
     * @returns 
     */
    async getAccountIdByAccountName(accountName) {
     
        logger.log('info', 'User Name : ' + accountName + ' : AuthDb : getAccountIdByAccountName : Execution started.');
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

            request.input('CRNCode',     MSSQL.NVarChar, accountName);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
            logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : accountName    = ' + accountName);

            return request.execute('[TM].[GetTenantAccountByName]').then(function (result) {

                logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Output parameters value of [TM].[GetTenantAccountByName] procedure.');
                logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Execution end.');
                logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : DB_RESPONSE_OBJECT  = ' + JSON.stringify(dbResponseObj));
                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
                    logger.log('error', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : accountName   = ' + accountName);
                    logger.log('error', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    logger.log('info', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : DB_RESPONSE_OBJECT  = ' + JSON.stringify(dbResponseObj));
                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Input parameters value for [TM].[GetTenantAccountByName] procedure.');
            logger.log('error', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : accountName   = ' + accountName);
            logger.log('error', 'User Name : ' + accountName + ' : AuthDb(UM) : getAccountIdByAccountName : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will update user master table
     * @param {*} userId 
     * @param {*} userName 
     */
    async updateUserMasterForAuth(userName, userId, accountGUID, data, type ) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Execution started.');
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
            request.input('UserName',           MSSQL.NVarChar,             userName);
            request.input('UserGUID',           MSSQL.UniqueIdentifier,     userId);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier,     accountGUID);
            if(type === 'auth') {
                request.input('isValidated',        MSSQL.Bit,   data.isValidated);
                request.input('isAuthenticated',    MSSQL.Bit,   data.isAuthenticated);
            } else if(type === 'otp') {
                request.input('OTPTryCount',        MSSQL.TinyInt,  data.otpTryCount);
            } else if(type === 'password') {
                request.input('SALT',               MSSQL.NVarChar,  data.salt);
                request.input('Password',           MSSQL.NVarChar,  data.hashPassword);
                request.input('IsDefaultPassword',  MSSQL.Bit,       data.isDefaultPwd);
            } else if(type === 'passwordTryCount') {
                request.input('SALT',               MSSQL.NVarChar,  data.salt);
                request.input('Password',           MSSQL.NVarChar,  data.hashPassword);
                request.input('IsDefaultPassword',  MSSQL.Bit,       data.isDefaultPwd);
                request.input('TryCount',           MSSQL.TinyInt,   data.setTryCount);
            }   
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Input parameters value for UM.UpdateUser procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : UserGUID                 = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : userName                 = ' + userName);
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : data                     = ' + JSON.stringify(data));
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : type                     = ' + type);
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : AccountGUID              = ' + accountGUID);

            return request.execute('UM.UpdateUser').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Output parameters value of UM.UpdateUser procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Input parameters value for UM.UpdateUser procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : AccountGUID   = ' + accountGUID);
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Execution end. : Error details : '+ error);
               
                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Input parameters value for UM.UpdateUser procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : AccountGUID   = ' + accountGUID);
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMasterForAuth : Execution end. : Error details : '+error);
           
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
           
            return dbResponseObj;
        }
    }
    
     /**
     * This function will get user subscription details from database
     * @param {*} userName 
     * @returns 
     */
     async getUserSubscriptionDetails(userName, accountGUID) {
        logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Execution started.');
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

            logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Input parameters value for TM.getUserSubscriptionDetails procedure.');
            logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : userName    = ' + userName);
            logger.log('info', 'userName : ' + userName + ' : AuthDb(UM) : getUserSubscriptionDetails : AccountGUID    = ' + accountGUID);

            return request.execute('TM.getUserSubscriptionDetails').then(function (result) {
                
                logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Output parameters value of TM.getUserSubscriptionDetails procedure.');
                logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Input parameters value for TM.getUserSubscriptionDetails procedure.');
                logger.log('error', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : userName    = ' + userName);
                logger.log('error', 'userName : ' + userName + ' : AuthDb(UM) : getUserSubscriptionDetails : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Input parameters value for TM.getUserSubscriptionDetails procedure.');
            logger.log('error', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : userName    = ' + userName);
            logger.log('error', 'userName: ' + userName + ' : AuthDb(UM) : getUserSubscriptionDetails : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Id : '+ userName +' : AuthDb(UM) : getUserSubscriptionDetails : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    /**
     * This function will get user data for single user from database
     * @param {*} userID 
     * @returns 
     */ 
    async addUserOTP(userID, OTPMaster, accountGUID) {
        logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Execution started.');
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
        let currentDateTime = new Date()
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('OTP',            MSSQL.NVarChar,         OTPMaster.OTP);
            request.input('IsActive',       MSSQL.Bit,              OTPMaster.isActive)
            request.input('UserGUID',       MSSQL.UniqueIdentifier, userID);
            request.input('LastUpdatedDate',MSSQL.DateTime2,        currentDateTime);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUID);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Input parameters value for UM.addUserOTP procedure.');
            logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : userID                  = ' + userID);
            logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : isActive                = ' + OTPMaster.isActive);
            logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : currentDateTime         = ' + currentDateTime);
            logger.log('info', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : addUserOTP : AccountGUID    = ' + accountGUID);

            return request.execute('UM.AddUserOTP').then(function (result) {
                
                logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Output parameters value of UM.addUserOTP procedure.');
                logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Input parameters value for UM.addUserOTP procedure.');
                logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : ADuserID = ' + userID);
                logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : userID   = ' + userID);
                logger.log('error', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : addUserOTP : AccountGUID    = ' + accountGUID);
                logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Input parameters value for UM.addUserOTP procedure.');
            logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : ADuserID = ' + userID);
            logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : userID   = ' + userID);
            logger.log('error', 'AccountGUID : ' + accountGUID + ' : AuthDb(UM) : addUserOTP : AccountGUID    = ' + accountGUID);
            logger.log('error', 'User Name : '+ userID +' : AuthDb(UM) : addUserOTP : Execution end. : Error details : '+ error);
            
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop(){
    }
}