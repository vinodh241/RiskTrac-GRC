const MSSQL = require("mssql");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ = require("../../utility/message/message-constant.js");
const { logger } = require("../../utility/log-manager/log-manager.js");

module.exports = class BusinessServicesAndAppsDB {
    constructor() { }

    start() { }



    /**
     * This function will fetch Business Services And Apps master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Execution started.");
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
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("UserName", MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success", MSSQL.Bit);
            request.output("OutMessage", MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Input parameters value for [BCM].[BusinessServicesApps_GetBusinessServicesAppsMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[BusinessServicesApps_GetBusinessServicesAppsMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Output parameters value of [BCM].[BusinessServicesApps_GetBusinessServicesAppsMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Input parameters value for [BCM].[BusinessServicesApps_GetBusinessServicesAppsMaster] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Input parameters value for [BCM].[BusinessServicesApps_GetBusinessServicesAppsMaster] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMaster : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Business Services And Apps Master Info data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getBusinessServicesAppsMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Execution started.");
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
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("UserName",    MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",    MSSQL.Bit);
            request.output("OutMessage", MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Input parameters value for [BCM].[BusinessServicesApps_GetBusinessServicesAppsInfo] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[BusinessServicesApps_GetBusinessServicesAppsInfo]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Output parameters value of [BCM].[BusinessServicesApps_GetBusinessServicesAppsInfo] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Input parameters value for [BCM].[BusinessServicesApps_GetBusinessServicesAppsInfo] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Input parameters value for [BCM].[BusinessServicesApps_GetBusinessServicesAppsInfo] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDb : getBusinessServicesAppsMasterInfo : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
       * This function will Insert a record in BusinessServicesAndApps table
       * @param {LevelOfControl, Score, CreatedBy } binds
       * @returns 
       */
    async addBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, businessServicesMasterData, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Execution started.');
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
            request.input('ApplicationID', MSSQL.BigInt, businessServicesMasterData.ApplicationID);
            request.input('ApplicationName', MSSQL.NVarChar, businessServicesMasterData.Application_Name);
            request.input('ApplicationTypeID', MSSQL.Int, businessServicesMasterData.ApplicationTypeID);
            request.input('BusinessFunctionsID', MSSQL.BigInt, businessServicesMasterData.BusinessFunctionID);
            request.input('RecoveryTime', MSSQL.Int, businessServicesMasterData.RTO_Value);
            request.input('RecoveryTimeUnit', MSSQL.Int, businessServicesMasterData.RTO_ID);
            request.input('RecoveryPoint', MSSQL.Int, businessServicesMasterData.RPO_Value);
            request.input('RecoveryPointUnit', MSSQL.Int, businessServicesMasterData.RPO_ID);
            request.input('BusinessOwnerID', MSSQL.NVarChar, businessServicesMasterData.BusinessOwnerID);
            request.input('ITOwnerID', MSSQL.NVarChar, businessServicesMasterData.ITOwnerID);
            request.input('SupportLeadID', MSSQL.NVarChar, businessServicesMasterData.SupportLeadID);
            request.input('Sites', MSSQL.NVarChar, JSON.stringify(businessServicesMasterData.Sites));
            request.input('SupportTeams', MSSQL.NVarChar, JSON.stringify(businessServicesMasterData.Support_Team));
            request.input('UserName', MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Input parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationID         = ' + businessServicesMasterData.ApplicationID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationName       = ' + businessServicesMasterData.Application_Name);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationTypeID     = ' + businessServicesMasterData.ApplicationTypeID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : BusinessFunctionsID   = ' + businessServicesMasterData.BusinessFunctionID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryTime          = ' + businessServicesMasterData.RTO_Value);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryTimeUnit      = ' + businessServicesMasterData.RTO_ID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryPoint         = ' + businessServicesMasterData.RPO_Value);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryPointUnit     = ' + businessServicesMasterData.RPO_ID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : BusinessOwnerID       = ' + businessServicesMasterData.BusinessOwnerID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ITOwnerID             = ' + businessServicesMasterData.ITOwnerID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : SupportLeadID         = ' + businessServicesMasterData.SupportLeadID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Sites                 = ' + JSON.stringify(businessServicesMasterData.Sites));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : SupportTeams          = ' + JSON.stringify(businessServicesMasterData.Support_Team));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : UserName              = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : AccountGUID              = ' + accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Parameters value are defined and ready to execute.');

            return request.execute('[BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster]').then(function (result) {

                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Output parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecordSet     = ' + JSON.stringify(result.recordset));

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Execution end.');

                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Input parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationID         = ' + businessServicesMasterData.ApplicationID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationName       = ' + businessServicesMasterData.Application_Name);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationTypeID     = ' + businessServicesMasterData.ApplicationTypeID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : BusinessFunctionsID   = ' + businessServicesMasterData.BusinessFunctionID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryTime          = ' + businessServicesMasterData.RTO_Value);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryTimeUnit      = ' + businessServicesMasterData.RTO_ID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryPoint         = ' + businessServicesMasterData.RPO_Value);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryPointUnit     = ' + businessServicesMasterData.RPO_ID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : BusinessOwnerID       = ' + businessServicesMasterData.BusinessOwnerID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ITOwnerID             = ' + businessServicesMasterData.ITOwnerID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : SupportLeadID         = ' + businessServicesMasterData.SupportLeadID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Sites                 = ' + JSON.stringify(businessServicesMasterData.Sites));
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : SupportTeams          = ' + JSON.stringify(businessServicesMasterData.Support_Team));
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : UserName              = ' + userNameFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : AccountGUID              = ' + accountGUIDFromToken);

                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Input parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationID         = ' + businessServicesMasterData.ApplicationID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationName       = ' + businessServicesMasterData.Application_Name);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ApplicationTypeID     = ' + businessServicesMasterData.ApplicationTypeID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : BusinessFunctionsID   = ' + businessServicesMasterData.BusinessFunctionID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryTime          = ' + businessServicesMasterData.RTO_Value);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryTimeUnit      = ' + businessServicesMasterData.RTO_ID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryPoint         = ' + businessServicesMasterData.RPO_Value);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : RecoveryPointUnit     = ' + businessServicesMasterData.RPO_ID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : BusinessOwnerID       = ' + businessServicesMasterData.BusinessOwnerID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : ITOwnerID             = ' + businessServicesMasterData.ITOwnerID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : SupportLeadID         = ' + businessServicesMasterData.SupportLeadID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Sites                 = ' + JSON.stringify(businessServicesMasterData.Sites));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : SupportTeams          = ' + JSON.stringify(businessServicesMasterData.Support_Team));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : UserName              = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : AccountGUID              = ' + accountGUIDFromToken);

            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : addBusinessServicesAppsMaster : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
       * This function will Update BusinessServicesAndApps table
       * @param {ControlAutomationID, LevelOfControl, Score, LastUpdatedBy} binds
       * @returns 
       */
    async updateBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, businessServicesMasterData, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDB : updateBusinessServicesAppsMaster : Execution started.');
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
            request.input('ApplicationID', MSSQL.BigInt, businessServicesMasterData.ApplicationID);
            request.input('ApplicationName', MSSQL.NVarChar, businessServicesMasterData.Application_Name);
            request.input('ApplicationTypeID', MSSQL.Int, businessServicesMasterData.ApplicationTypeID);
            request.input('BusinessFunctionsID', MSSQL.BigInt, businessServicesMasterData.BusinessFunctionID);
            request.input('RecoveryTime', MSSQL.Int, businessServicesMasterData.RTO_Value);
            request.input('RecoveryTimeUnit', MSSQL.Int, businessServicesMasterData.RTO_ID);
            request.input('RecoveryPoint', MSSQL.Int, businessServicesMasterData.RPO_Value);
            request.input('RecoveryPointUnit', MSSQL.Int, businessServicesMasterData.RPO_ID);
            request.input('BusinessOwnerID', MSSQL.UniqueIdentifier, businessServicesMasterData.BusinessOwnerID);
            request.input('ITOwnerID', MSSQL.UniqueIdentifier, businessServicesMasterData.ITOwnerID);
            request.input('SupportLeadID', MSSQL.UniqueIdentifier, businessServicesMasterData.SupportLeadID);
            request.input('Sites', MSSQL.NVarChar, JSON.stringify(businessServicesMasterData.Sites));
            request.input('SupportTeams', MSSQL.NVarChar, JSON.stringify(businessServicesMasterData.Support_Team));
            request.input('UserName', MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Input parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationID         = ' + businessServicesMasterData.ApplicationID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationName       = ' + businessServicesMasterData.Application_Name);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationTypeID     = ' + businessServicesMasterData.ApplicationTypeID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : BusinessFunctionsID   = ' + businessServicesMasterData.BusinessFunctionID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryTime          = ' + businessServicesMasterData.RTO_Value);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryTimeUnit      = ' + businessServicesMasterData.RTO_ID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryPoint         = ' + businessServicesMasterData.RPO_Value);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryPointUnit     = ' + businessServicesMasterData.RPO_ID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : BusinessOwnerID       = ' + businessServicesMasterData.BusinessOwnerID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ITOwnerID             = ' + businessServicesMasterData.ITOwnerID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : SupportLeadID         = ' + businessServicesMasterData.SupportLeadID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Sites                 = ' + JSON.stringify(businessServicesMasterData.Sites));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : SupportTeams          = ' + JSON.stringify(businessServicesMasterData.Support_Team));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : UserName              = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : AccountGUID              = ' + accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster :  Parameters value are defined and ready to execute.');

            return request.execute('[BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster]').then(function (result) {

                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Output parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Execution end.');

                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Input parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationID         = ' + businessServicesMasterData.ApplicationID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationName       = ' + businessServicesMasterData.Application_Name);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationTypeID     = ' + businessServicesMasterData.ApplicationTypeID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : BusinessFunctionsID   = ' + businessServicesMasterData.BusinessFunctionID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryTime          = ' + businessServicesMasterData.RTO_Value);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryTimeUnit      = ' + businessServicesMasterData.RTO_ID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryPoint         = ' + businessServicesMasterData.RPO_Value);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryPointUnit     = ' + businessServicesMasterData.RPO_ID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : BusinessOwnerID       = ' + businessServicesMasterData.BusinessOwnerID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ITOwnerID             = ' + businessServicesMasterData.ITOwnerID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : SupportLeadID         = ' + businessServicesMasterData.SupportLeadID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Sites                 = ' + JSON.stringify(businessServicesMasterData.Sites));
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : SupportTeams          = ' + JSON.stringify(businessServicesMasterData.Support_Team));
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : UserName              = ' + userNameFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : AccountGUID              = ' + accountGUIDFromToken);

                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Execution end. : Error details : ' + error);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Input parameters value of [BCM].[BusinessServicesApps_AddBusinessServicesAppsMaster] procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationID         = ' + businessServicesMasterData.ApplicationID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationName       = ' + businessServicesMasterData.Application_Name);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ApplicationTypeID     = ' + businessServicesMasterData.ApplicationTypeID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : BusinessFunctionsID   = ' + businessServicesMasterData.BusinessFunctionID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryTime          = ' + businessServicesMasterData.RTO_Value);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryTimeUnit      = ' + businessServicesMasterData.RTO_ID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryPoint         = ' + businessServicesMasterData.RPO_Value);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : RecoveryPointUnit     = ' + businessServicesMasterData.RPO_ID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : BusinessOwnerID       = ' + businessServicesMasterData.BusinessOwnerID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : ITOwnerID             = ' + businessServicesMasterData.ITOwnerID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : SupportLeadID         = ' + businessServicesMasterData.SupportLeadID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Sites                 = ' + JSON.stringify(businessServicesMasterData.Sites));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : SupportTeams          = ' + JSON.stringify(businessServicesMasterData.Support_Team));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : UserName              = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : AccountGUID              = ' + accountGUIDFromToken);

            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : updateBusinessServicesAppsMaster : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
       * 
       * @param {*} request 
       * @param {*} response 
       * @returns 
       */
    async addBulkBusinessServicesMaster(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Execution started.");
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
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("BusinessServicesAppsData",   MSSQL.NVarChar, JSON.stringify(data));
            request.input('UserName',                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",                MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Input parameters value for [BCM].[BusinessServicesApps_AddBulkBusinessServicesAppsMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : data       = " + JSON.stringify(data || null));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[BusinessServicesApps_AddBulkBusinessServicesAppsMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Output parameters value of [BCM].[BusinessServicesApps_AddBulkBusinessServicesAppsMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null));

                return dbResponseObj;
            })
                .catch(function (error) {
                    logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Input parameters value for [BCM].[BusinessServicesApps_AddBulkBusinessServicesAppsMaster] procedure.");
                    logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : UserName       = " + userNameFromToken);
                    logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : AccountGUID       = " + accountGUIDFromToken);
                    logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Execution end. : Error details : " + error);

                    dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    return dbResponseObj;
                });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Input parameters value for [BCM].[BusinessServicesApps_AddBulkBusinessServicesAppsMaster] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : addBulkBusinessServicesMaster : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
       * This function will fetch incident master data from database
       * @param {*} userIdFromToken
       * @param {*} userNameFromToken
       * @param {*} businessServicesAppsMasterData
       * @returns
       */
    async deleteBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, businessServicesAppsMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Execution started.");
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
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("BusinessServiceAppsID", MSSQL.BigInt, businessServicesAppsMasterData.ApplicationID)
            request.input("UserName", MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success", MSSQL.Bit);
            request.output("OutMessage", MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Input parameters value for [BCM].[BusinessServicesApps_DeleteBusinessServicesAppsMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : BusinessServiceAppsID   = " + businessServicesAppsMasterData.ApplicationID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : UserName                = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : AccountGUID                = " + accountGUIDFromToken);

            return request.execute("[BCM].[BusinessServicesApps_DeleteBusinessServicesAppsMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Output parameters value of [BCM].[BusinessServicesApps_DeleteBusinessServicesAppsMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : OutMessage    = " + result.output.OutMessage);
                logger.log("info", 'User Id : ' + userIdFromToken + ' : BusinessServicesAndAppsDb : deleteBusinessServicesAppsMaster : RecordSet     = ' + JSON.stringify(result.recordset));

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Input parameters value for [BCM].[BusinessServicesApps_DeleteBusinessServicesAppsMaster] procedure.");
                logger.log(" error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : BusinessServiceAppsID     = " + businessServicesAppsMasterData.ApplicationID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : UserName                  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : AccountGUID                = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Input parameters value for [BCM].[BusinessServicesApps_DeleteBusinessServicesAppsMaster] procedure.");
            logger.log(" error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : BusinessServiceAppsID     = " + businessServicesAppsMasterData.ApplicationID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : AccountGUID                = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessServicesAndAppsDB : deleteBusinessServicesAppsMaster : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }



    stop() { }
};
