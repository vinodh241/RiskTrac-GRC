const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../../utility/message/message-constant.js");

module.exports = class ThreatLibraryDB {
  constructor() {}

  start() {}

     /**
     * This function will fetch threat master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
    */
     async getThreatMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Execution started.");
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

            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Input parameters value for BCM.Threat_GetThreatMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Threat_GetThreatMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Output parameters value of BCM.Threat_GetThreatMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Input parameters value for BCM.Threat_GetThreatMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Input parameters value for BCM.Threat_GetThreatMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch info data for add/update threat master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} threatMasterData 
     * @returns
     */
     async getThreatMasterInfo(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Execution started.");
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

            request.input("CurrentDate",    MSSQL.DateTime, threatMasterData.currentDate);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Input parameters value for BCM.Threat_GetMasterInfo procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : CurrentDate    = " + threatMasterData.currentDate);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Threat_GetMasterInfo").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Output parameters value of BCM.Threat_GetMasterInfo procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Input parameters value for BCM.Threat_GetMasterInfo procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : CurrentDate    = " + threatMasterData.currentDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Input parameters value for BCM.Threat_GetMasterInfo procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : CurrentDate    = " + threatMasterData.currentDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : getThreatMasterInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will add threat master data into database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} threatMasterData
     * @returns
     */
     async addThreatMaster(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Execution started.");
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

            request.input("RiskID",                 MSSQL.BigInt,           threatMasterData.riskId);
            request.input("RiskTitle",              MSSQL.NVarChar,         threatMasterData.riskTitle);
            request.input("ThreatCategoryID",       MSSQL.Int,              threatMasterData.threatCategoryId);
            request.input("ImpactIDs",              MSSQL.NVarChar,         JSON.stringify(threatMasterData.impacts));
            request.input("RiskDiscription",        MSSQL.NVarChar,         threatMasterData.riskDescription);
            request.input("RiskCode",               MSSQL.NVarChar,         threatMasterData.riskCode);
            request.input("Controls",               MSSQL.NVarChar,         JSON.stringify(threatMasterData.controls));
            request.input("RiskOwnerID",            MSSQL.UniqueIdentifier, threatMasterData.riskOwnerId);
            request.input("ControlEffectivenessID", MSSQL.Int,              threatMasterData.controlEffectivenessId);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID",            MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Input parameters value for BCM.Threat_AddThreatMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskID                  = " + threatMasterData.riskId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskTitle               = " + threatMasterData.riskTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ImpactIDs               = " + JSON.stringify(threatMasterData.impacts));
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ThreatCategoryID        = " + threatMasterData.threatCategoryId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskDiscription         = " + threatMasterData.riskDescription);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskCode                = " + threatMasterData.riskCode);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Controls                = " + JSON.stringify(threatMasterData.controls));
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskOwnerID             = " + threatMasterData.riskOwnerId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ControlEffectivenessID  = " + threatMasterData.controlEffectivenessId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : UserName                = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : AccountGUID                = " + accountGUIDFromToken);

            return request.execute("BCM.Threat_AddThreatMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Output parameters value of BCM.Threat_AddThreatMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Input parameters value for BCM.Threat_AddThreatMaster procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskID                 = " + threatMasterData.riskId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskTitle              = " + threatMasterData.riskTitle);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ImpactIDs              = " + JSON.stringify(threatMasterData.impacts));
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ThreatCategoryID       = " + threatMasterData.threatCategoryId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskDiscription        = " + threatMasterData.riskDescription);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskCode               = " + threatMasterData.riskCode);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Controls               = " + JSON.stringify(threatMasterData.controls));
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskOwnerID            = " + threatMasterData.riskOwnerId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ControlEffectivenessID = " + threatMasterData.controlEffectivenessId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : UserName               = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : AccountGUID                = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Input parameters value for BCM.Threat_AddThreatMaster procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskID                 = " + threatMasterData.riskId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskTitle              = " + threatMasterData.riskTitle);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ImpactID               = " + threatMasterData.impactId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ThreatCategoryID       = " + threatMasterData.threatCategoryId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskDiscription        = " + threatMasterData.riskDescription);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskCode               = " + threatMasterData.riskCode);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Controls               = " + JSON.stringify(threatMasterData.controls));
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : RiskOwnerID            = " + threatMasterData.riskOwnerId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : ControlEffectivenessID = " + threatMasterData.controlEffectivenessId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : UserName               = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : AccountGUID                = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : addThreatMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch incident master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} threatMasterData
     * @returns
     */
     async updateThreatMaster(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Execution started.");
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

            request.input("RiskID",                 MSSQL.BigInt,           threatMasterData.riskId);
            request.input("RiskTitle",              MSSQL.NVarChar,         threatMasterData.riskTitle);
            request.input("ThreatCategoryID",       MSSQL.Int,              threatMasterData.threatCategoryId);
            request.input("ImpactIDs",              MSSQL.NVarChar,         JSON.stringify(threatMasterData.impacts));
            request.input("RiskDiscription",        MSSQL.NVarChar,         threatMasterData.riskDescription);
            request.input("RiskCode",               MSSQL.NVarChar,         threatMasterData.riskCode);
            request.input("Controls",               MSSQL.NVarChar,         JSON.stringify(threatMasterData.controls));
            request.input("RiskOwnerID",            MSSQL.UniqueIdentifier, threatMasterData.riskOwnerId);
            request.input("ControlEffectivenessID", MSSQL.Int,              threatMasterData.controlEffectivenessId);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID",            MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Input parameters value for BCM.Threat_AddThreatMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskID                   = " + threatMasterData.riskId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskTitle                = " + threatMasterData.riskTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ImpactIDs                = " + JSON.stringify(threatMasterData.impacts));
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ThreatCategoryID         = " + threatMasterData.threatCategoryId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskDiscription          = " + threatMasterData.riskDescription);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskCode                 = " + threatMasterData.riskCode);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Controls                 = " + JSON.stringify(threatMasterData.controls));
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskOwnerID              = " + threatMasterData.riskOwnerId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ControlEffectivenessID   = " + threatMasterData.controlEffectivenessId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : UserName                 = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : AccountGUID                 = " + accountGUIDFromToken);

            return request.execute("BCM.Threat_AddThreatMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Output parameters value of BCM.Threat_AddThreatMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Input parameters value for BCM.Threat_AddThreatMaster procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskID                  = " + threatMasterData.riskId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskTitle               = " + threatMasterData.riskTitle);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ImpactIDs               = " + JSON.stringify(threatMasterData.impacts));
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ThreatCategoryID        = " + threatMasterData.threatCategoryId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskDiscription         = " + threatMasterData.riskDescription);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskCode                = " + threatMasterData.riskCode);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Controls                = " + JSON.stringify(threatMasterData.controls));
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskOwnerID             = " + threatMasterData.riskOwnerId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ControlEffectivenessID  = " + threatMasterData.controlEffectivenessId);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : UserName                = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : AccountGUID                 = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Input parameters value for BCM.Threat_AddThreatMaster procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskID                  = " + threatMasterData.riskId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskTitle               = " + threatMasterData.riskTitle);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ImpactIDs               = " + JSON.stringify(threatMasterData.impacts));
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ThreatCategoryID        = " + threatMasterData.threatCategoryId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskDiscription         = " + threatMasterData.riskDescription);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskCode                = " + threatMasterData.riskCode);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Controls                = " + JSON.stringify(threatMasterData.controls));
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : RiskOwnerID             = " + threatMasterData.riskOwnerId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : ControlEffectivenessID  = " + threatMasterData.controlEffectivenessId);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : UserName                = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : AccountGUID                 = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : updateThreatMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch incident master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} threatMasterData
     * @returns
     */
     async deleteThreatMaster(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Execution started.");
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

            request.input("RiskID",         MSSQL.BigInt,   threatMasterData.riskId)
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Input parameters value for BCM.Threat_DeleteThreatMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : UserName = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : RiskID   = " + threatMasterData.riskId);
            logger.log("info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : AccountGUID   = " + accountGUIDFromToken);

            return request.execute("BCM.Threat_DeleteThreatMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Output parameters value of BCM.Threat_DeleteThreatMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Input parameters value for BCM.Threat_DeleteThreatMaster procedure." );
                logger.log(" error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : RiskID         = " + threatMasterData.riskId);
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : AccountGUID   = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Input parameters value for BCM.Threat_DeleteThreatMaster procedure." );
            logger.log(" error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : RiskID         = " + threatMasterData.riskId);
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : AccountGUID   = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : ThreatLibraryDB : deleteThreatMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }


  stop() {}
};
