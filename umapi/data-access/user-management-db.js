const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class UserManagementDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will get users details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @returns 
     */
    async getUsers(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementDb(UM) : getUsers : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : Input parameters value for UM.GetUsers procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : userNameFromToken  = '+userNameFromToken);
            logger.log('info', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb(UM) : getUsers : AccountGUID  = ' + accountGUIDFromToken);

            return request.execute('UM.GetUsers').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : Output parameters value of UM.GetUsers procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : No Input parameters value for UM.GetUsers procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : userNameFromToken  = '+userNameFromToken);
                logger.log('error', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb(UM) : getUsers : AccountGUID  = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : No Input parameters value for UM.GetUsers procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : userNameFromToken  = '+userNameFromToken);
            logger.log('error', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb(UM) : getUsers : AccountGUID  = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : getUsers : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add assign usermanager info to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} userMaster 
     * @returns 
     */
    async assignUserManager(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
          
            request.input('FirstName',          MSSQL.NVarChar,         userMaster.firstName);
            request.input('MiddleName',         MSSQL.NVarChar,         userMaster.middleName);
            request.input('LastName',           MSSQL.NVarChar,         userMaster.lastName);
            request.input('MobileNumber',       MSSQL.NVarChar,         userMaster.mobileNumber);
            request.input('EmailID',            MSSQL.NVarChar,         userMaster.emailID);
            request.input('ADUserName',         MSSQL.NVarChar,         userMaster.adUserName);
            request.input('Password',           MSSQL.NVarChar,         userMaster.hashPassword);
            request.input('Salt',               MSSQL.NVarChar,         userMaster.salt);  
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken); 
            request.input('DefaultRoleID',      MSSQL.Int,              userMaster.defaultRoleID);          
            request.input('IsDefaultPassword',  MSSQL.Bit,              userMaster.isDefaultPwd)
            request.input('UserName',           MSSQL.NVarChar,         userNameFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);
         
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Input parameters value for UM.AddUserManager procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : firstName      = ' + userMaster.firstName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : middleName     = ' + userMaster.middleName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : lastName       = ' + userMaster.lastName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : mobileNumber   = ' + userMaster.mobileNumber);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : emailID        = ' + userMaster.emailID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : ADUserName     = ' + userMaster.adUserName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : accountGUID    = ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : defaultRoleID  = ' + userMaster.defaultRoleID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : userName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : isDefaultpwd   = ' + userMaster.isDefaultPwd);
            

            return request.execute('UM.AddUserManager').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Output parameters value of UM.AddUserManager procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Success 	  = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : OutMessage = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Input parameters value for UM.AddUserManager procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : firstName      = ' + userMaster.firstName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : lastName       = ' + userMaster.lastName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : mobileNumber   = ' + userMaster.mobileNumber);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : emailID        = ' + userMaster.emailID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : ADUserName     = ' + userMaster.adUserName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : accountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : middleName     = ' + userMaster.middleName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : defaultRoleID  = ' + userMaster.defaultRoleID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : userName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Execution end. : Error details : ' + error);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : Input parameters value for UM.AddUserManager procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : firstName      = ' + userMaster.firstName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : lastName       = ' + userMaster.lastName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : mobileNumber   = ' + userMaster.mobileNumber);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : emailID        = ' + userMaster.emailID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : ADUserName     = ' + userMaster.adUserName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : accountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : middleName     = ' + userMaster.middleName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : defaultRoleID  = ' + userMaster.defaultRoleID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : assignUserManager : userName       = ' + userNameFromToken);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }

    }

    /**
     * This function will delete user from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} userMaster 
     * @returns 
     */
    async deleteUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
          
            request.input('UserGUID',    MSSQL.UniqueIdentifier,    userMaster.UserGUID);
            request.input('AccountGUID', MSSQL.UniqueIdentifier,    accountGUIDFromToken);
            request.input('UserName',    MSSQL.NVarChar,            userNameFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Input parameters value for UM.DeleteUser procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : UserGUID  = ' + userMaster.UserGUID);
            logger.log('info', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb : deleteUser : AccountGUID  = ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : UserName  = ' + userNameFromToken);

            return request.execute('UM.DeleteUser').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Output parameters value of UM.DeleteUser procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Input parameters value for UM.DeleteUser procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : UserGUID  = ' + userMaster.UserGUID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : UserName  = ' + userNameFromToken);
                logger.log('error', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb : deleteUser : AccountGUID  = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Execution end. : Error details : ' + error);

                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Input parameters value for UM.DeleteUser procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : UserGUID  = ' + userMaster.UserGUID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : UserName  = ' + userNameFromToken);
            logger.log('error', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb : deleteUser : AccountGUID  = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : deleteUser : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }

    }

    /**
     * This function will get assigned users info from database
     * @param {*} userIdFromToken      
     * @returns 
     */
    async getAssignedUserInfo(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',       MSSQL.NVarChar,            userNameFromToken);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier,    accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Input parameters value for UM.GetInfoForAddUser procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : UserName  = ' + userNameFromToken);
            logger.log('info', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb : getAssignedUserInfo : AccountGUID  = ' + accountGUIDFromToken);

            return request.execute('UM.GetInfoForAddUser').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Output parameters value of UM.GetInfoForAddUser procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : UserName   = ' + userNameFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Success 	= ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : OutMessage = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Input parameters value for UM.GetInfoForAddUser procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : UserName  = ' + userNameFromToken);
                logger.log('error', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb : getAssignedUserInfo : AccountGUID  = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Execution end. : Error details : ' + error);
                
                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Input parameters value for UM.GetInfoForAddUser procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : UserName  = ' + userNameFromToken);
            logger.log('error', 'Account Id : ' + accountGUIDFromToken + ' : UserManagementDb : getAssignedUserInfo : AccountGUID  = ' + accountGUIDFromToken);           
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : getAssignedUserInfo : Execution end. : Error details : ' + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }

    }

    /**
     * This function will add assign users to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} userMaster 
     * @returns 
     */
    async addAssignUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken) {
        logger.log('info', 'userIdFromToken : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Execution started.');
        logger.log('info', 'userIdFromToken : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : ADD_USER_PAYLOAD : ' + JSON.stringify(userMaster));
        logger.log('info', 'userIdFromToken : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : ACCOUNT_GUID_FROM_TOKEN : ' + accountGUIDFromToken);
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('FirstName',              MSSQL.NVarChar,             userMaster.firstName);
            request.input('MiddleName',             MSSQL.NVarChar,             userMaster.middleName);
            request.input('LastName',               MSSQL.NVarChar,             userMaster.lastName);
            request.input('Designation',            MSSQL.NVarChar,             userMaster.Designation);
            request.input('MobileNumber',           MSSQL.NVarChar,             userMaster.mobileNumber);
            request.input('EmailID',                MSSQL.NVarChar,             userMaster.emailID);
            request.input('ADUserName',             MSSQL.NVarChar,             userMaster.adUserName);            
            request.input('AssignedModules',        MSSQL.NVarChar,             userMaster.assignedModules);
            request.input('AssignedGroupsUnits',    MSSQL.NVarChar,             userMaster.assignedGroupsUnits);
            request.input('Password',               MSSQL.NVarChar,             userMaster.hashPassword);
            request.input('Salt',                   MSSQL.NVarChar,             userMaster.salt);   
            request.input('DefaultRoleID',          MSSQL.Int,                  userMaster.defaultRoleID);
            request.input('IsDefaultPassword',      MSSQL.Bit,                  userMaster.isDefaultPwd);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier,     accountGUIDFromToken);
            request.input('UserName',               MSSQL.NVarChar,             userNameFromToken);
            request.output('Success',               MSSQL.Bit);
            request.output('OutMessage',            MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Input parameters value for UM.AddUser procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : FirstName            = ' + userMaster.firstName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : MiddleName           = ' + userMaster.middleName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : LastName             = ' + userMaster.lastName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Designation          = ' + userMaster.Designation);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : MobileNumber         = ' + userMaster.mobileNumber);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : EmailID              = ' + userMaster.emailID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : ADUserName           = ' + userMaster.adUserName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AssignedModules      = ' + userMaster.assignedModules);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AssignedGroupsUnits  = ' + userMaster.assignedGroupsUnits);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : defaultRoleID        = ' + userMaster.defaultRoleID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : isDefaultpwd         = ' + userMaster.isDefaultPwd);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : UserName             = ' + userNameFromToken);


            return request.execute('UM.AddUser').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Output parameters value of UM.AddUser procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Success      = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Input parameters value for UM.AddUser procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : FirstName            = ' + userMaster.firstName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : MiddleName           = ' + userMaster.middleName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : LastName             = ' + userMaster.lastName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Designation          = ' + userMaster.Designation);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : MobileNumber         = ' + userMaster.mobileNumber);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : EmailID              = ' + userMaster.emailID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : ADUserName           = ' + userMaster.adUserName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AccountGUID          = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AssignedModules      = ' + userMaster.assignedModules);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AssignedGroupsUnits  = ' + userMaster.assignedGroupsUnits);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : defaultRoleID        = ' + userMaster.defaultRoleID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Execution end. : Error details : ' + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Input parameters value for UM.AddUser procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : FirstName            = ' + userMaster.firstName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : MiddleName           = ' + userMaster.middleName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : LastName             = ' + userMaster.lastName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Designation          = ' + userMaster.Designation);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : MobileNumber         = ' + userMaster.mobileNumber);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : EmailID              = ' + userMaster.emailID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : ADUserName           = ' + userMaster.adUserName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AssignedModules      = ' + userMaster.assignedModules);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : AssignedGroupsUnits  = ' + userMaster.assignedGroupsUnits);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : defaultRoleID        = ' + userMaster.defaultRoleID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addAssignUser : Execution end. : Error details : ' + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }

    }

    /**
     * This function will add assign users to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @returns 
     */
    async addUserCredentialHistory(userIdFromToken, userNameFromToken, accountGUIDFromToken,  userGUID, hashPassword) {
        logger.log('info', 'userIdFromToken : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Execution started.');
        logger.log('info', 'userIdFromToken : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : ACCOUNT_GUID_FROM_TOKEN : ' + accountGUIDFromToken);
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('UserGUID',       MSSQL.NVarChar,             userGUID);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier,     accountGUIDFromToken);
            request.input('Password',       MSSQL.NVarChar,             hashPassword);
            request.input('CreatedBy',      MSSQL.NVarChar,             userNameFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Input parameters value for UM.AddUserCredentialHistory procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : userGUID             = ' + userGUID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : accountGUIDFromToken = ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : UserName             = ' + userNameFromToken);


            return request.execute('UM.AddUserCredentialHistory').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Output parameters value of UM.AddUserCredentialHistory procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Success      = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Execution end. : Error details : ' + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Input parameters value for UM.AddUserCredentialHistory procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb : addUserCredentialHistory : Execution end. : Error details : ' + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }

    }
    

    async enableDisableUser(userIdFromToken, userNameFromToken, accountGUIDFromToken, data) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementDb(UM) : enableDisableUser : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('UserGUID',       MSSQL.UniqueIdentifier,    data.UserGUID);
            request.input('IsEnabled',      MSSQL.Bit,                 data.isEnabled);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier,    accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : Input parameters value for UM.enableDisableUser procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : userNameFromToken  = '+userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : data               = '+JSON.stringify(data));

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : AccountGUID  = ' + accountGUIDFromToken);

            return request.execute('UM.EnableDisableUser').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : Output parameters value of UM.enableDisableUser procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : No Input parameters value for UM.enableDisableUser procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : userNameFromToken  = '+userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : AccountGUID  = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : No Input parameters value for UM.enableDisableUser procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : userNameFromToken  = '+userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : AccountGUID  = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementDb(UM) : enableDisableUser : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}