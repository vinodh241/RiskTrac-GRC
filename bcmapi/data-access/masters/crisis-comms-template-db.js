const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../../utility/message/message-constant.js");

module.exports = class CrisisCommsDB {
  constructor() {}

  start() {}

  

    /**
     * This function will fetch crisis comms template master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getCrisisCommsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Execution started.");
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
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_GetEmailTemplateMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.CrisisCommunication_GetEmailTemplateMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Output parameters value of BCM.CrisisCommunication_GetEmailTemplateMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_GetEmailTemplateMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_GetEmailTemplateMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch info for add/update crisis comms template master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
     async getCrisisCommsMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Execution started.");
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
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Input parameters value for BCM.CrisisCommunication_GetEmailInfo procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.CrisisCommunication_GetEmailInfo").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Output parameters value of BCM.CrisisCommunication_GetEmailInfo procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Input parameters value for BCM.CrisisCommunication_GetEmailInfo procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Input parameters value for BCM.CrisisCommunication_GetEmailInfo procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : getCrisisCommsMasterInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will add crisis comms template master to the database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommsMasterData
     * @returns
     */
     async addCrisisCommsMaster(userIdFromToken, userNameFromToken,crisisCommsMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Execution started.");
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

            request.input("EmailTemplateID",    MSSQL.BigInt,       crisisCommsMasterData.emailTemplateID);
            request.input("TemplateName",       MSSQL.NVarChar,     crisisCommsMasterData.emailTemplateName);
            request.input("EmailTitle",         MSSQL.NVarChar,     crisisCommsMasterData.emailTitle);
            request.input("EmailContent",       MSSQL.NVarChar,     crisisCommsMasterData.emailContent);
            request.input("ActionLinkID",       MSSQL.Int,          crisisCommsMasterData.actionLinkId);
            request.input("CriticalityID",      MSSQL.Int,          crisisCommsMasterData.criticalityId);
            request.input("UserName",           MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_AddEmailTemplateMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailTemplateID  = " + crisisCommsMasterData.emailTemplateID);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : TemplateName     = " + crisisCommsMasterData.emailTemplateName);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailTitle       = " + crisisCommsMasterData.emailTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailContent     = " + crisisCommsMasterData.emailContent);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : ActionLinkID     = " + crisisCommsMasterData.actionLinkId);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : CriticalityID    = " + crisisCommsMasterData.criticalityId);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : UserName         = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : AccountGUID         = " + accountGUIDFromToken);

            return request.execute("BCM.CrisisCommunication_AddEmailTemplateMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Output parameters value of BCM.CrisisCommunication_AddEmailTemplateMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_AddEmailTemplateMaster  procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailTemplateID    = " + crisisCommsMasterData.emailTemplateID);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : TemplateName       = " + crisisCommsMasterData.emailTemplateName);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailTitle         = " + crisisCommsMasterData.emailTitle);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailContent       = " + crisisCommsMasterData.emailContent);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : ActionLinkID       = " + crisisCommsMasterData.actionLinkId);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : CriticalityID      = " + crisisCommsMasterData.criticalityId);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : UserName           = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : AccountGUID         = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_AddEmailTemplateMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailTemplateID    = " + crisisCommsMasterData.emailTemplateID);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : TemplateName  `    = " + crisisCommsMasterData.emailTemplateName);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailTitle         = " + crisisCommsMasterData.emailTitle);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : EmailContent       = " + crisisCommsMasterData.emailContent);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : ActionLinkID       = " + crisisCommsMasterData.actionLinkId);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : CriticalityID      = " + crisisCommsMasterData.criticalityId);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : UserName           = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : AccountGUID         = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : addCrisisCommsMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
   * This function will update crisis comms template master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} crisisCommsMasterData
   * @returns
   */
    async updateCrisisCommsMaster(userIdFromToken, userNameFromToken,crisisCommsMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Execution started.");
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

            request.input("EmailTemplateID",    MSSQL.BigInt,       crisisCommsMasterData.emailTemplateID);
            request.input("TemplateName",       MSSQL.NVarChar,     crisisCommsMasterData.emailTemplateName);
            request.input("EmailTitle",         MSSQL.NVarChar,     crisisCommsMasterData.emailTitle);
            request.input("EmailContent",       MSSQL.NVarChar,     crisisCommsMasterData.emailContent);
            request.input("ActionLinkID",       MSSQL.Int,          crisisCommsMasterData.actionLinkId);
            request.input("CriticalityID",      MSSQL.Int,          crisisCommsMasterData.criticalityId);
            request.input("UserName",           MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_AddEmailTemplateMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailTemplateID   = " + crisisCommsMasterData.emailTemplateID);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : TemplateName      = " + crisisCommsMasterData.emailTemplateName);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailTitle        = " + crisisCommsMasterData.emailTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailContent      = " + crisisCommsMasterData.emailContent);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : ActionLinkID      = " + crisisCommsMasterData.actionLinkId);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : CriticalityID     = " + crisisCommsMasterData.criticalityId);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : UserName          = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : AccountGUID          = " + accountGUIDFromToken);

            return request.execute("BCM.CrisisCommunication_AddEmailTemplateMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Output parameters value of BCM.CrisisCommunication_AddEmailTemplateMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_AddEmailTemplateMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailTemplateID     = " + crisisCommsMasterData.emailTemplateID);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : TemplateName        = " + crisisCommsMasterData.emailTemplateName);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailTitle          = " + crisisCommsMasterData.emailTitle);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailContent        = " + crisisCommsMasterData.emailContent);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : ActionLinkID        = " + crisisCommsMasterData.actionLinkId);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : CriticalityID       = " + crisisCommsMasterData.criticalityId);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : AccountGUID          = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_AddEmailTemplateMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailTemplateID     = " + crisisCommsMasterData.emailTemplateID);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : TemplateName        = " + crisisCommsMasterData.emailTemplateName);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailTitle          = " + crisisCommsMasterData.emailTitle);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : EmailContent        = " + crisisCommsMasterData.emailContent);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : ActionLinkID        = " + crisisCommsMasterData.actionLinkId);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : CriticalityID       = " + crisisCommsMasterData.criticalityId);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : UserName            = " + userNameFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : AccountGUID         = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : updateCrisisCommsMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
   * This function will delete crisis comms template master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} crisisCommsMasterData
   * @returns
   */
    async deleteCrisisCommsMaster(userIdFromToken, userNameFromToken,crisisCommsMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Execution started.");
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

            request.input("EmailTemplateID",    MSSQL.BigInt,   crisisCommsMasterData.emailTemplateID);
            request.input("UserName",           MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_DeleteEmailTemplateMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : EmailTemplateID   = " + crisisCommsMasterData.emailTemplateID);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : UserName          = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : AccountGUID          = " + accountGUIDFromToken);

            return request.execute("BCM.CrisisCommunication_DeleteEmailTemplateMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Output parameters value of BCM.CrisisCommunication_DeleteEmailTemplateMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_DeleteEmailTemplateMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : EmailTemplateID = " + crisisCommsMasterData.emailTemplateID);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : UserName        = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : AccountGUID          = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Input parameters value for BCM.CrisisCommunication_DeleteEmailTemplateMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : EmailTemplateID = " + crisisCommsMasterData.emailTemplateID);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : UserName        = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : AccountGUID          = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : CrisisCommsDB : deleteCrisisCommsMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }



  stop() {}
};
