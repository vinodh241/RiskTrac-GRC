const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../utility/message/message-constant.js");

module.exports = class crisisCommunicationDB {
  constructor() {}

  start() {}

   /**
     * This function will fetch all crisis communications list from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommunicationData
     * @returns
     */
    async getCrisisCommunicationsList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Execution started.");
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

            request.input("CommunicationIDs",       MSSQL.NVarChar, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
            request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Input parameters value for BCM.CM_GetCommunications procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : UserName     = "           + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetCommunications").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Output parameters value of BCM.CM_GetCommunications procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Input parameters value for BCM.CM_GetCommunications procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : UserName     = "             + userNameFromToken );
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Input parameters value for BCM.CM_GetCommunications procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : UserName     = "           + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationsList : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will fetch the all master list required for create crisis message from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getCreateCrisisMessageInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Execution started.");
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

            request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Input parameters value for BCM.CM_GetCommunicationInfo procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : UserName     = "           + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetCommunicationInfo").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Output parameters value of BCM.CM_GetCommunicationInfo procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Input parameters value for BCM.CM_GetCommunicationInfo procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : UserName     = "             + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Input parameters value for BCM.CM_GetCommunicationInfo procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : UserName     = "           + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCreateCrisisMessageInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * his function will create new crisis message 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommunicationData
     * @returns
     */
     async createCrisisMessage(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Execution started.");
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

            request.input("CommunicationID",        MSSQL.BigInt,       crisisCommunicationData.communicationId);
            request.input("Title",                  MSSQL.NVarChar,     crisisCommunicationData.communicationTitle);
            request.input("RecipientTypeID",        MSSQL.Int,          crisisCommunicationData.recipentId);
            request.input("CrisisCategoryID",       MSSQL.Int,          crisisCommunicationData.categoryId);
            request.input("IncidentIDs",            MSSQL.NVarChar,     crisisCommunicationData.incidentIds);
            request.input("TemplateID",             MSSQL.BigInt,       crisisCommunicationData.templateId);
            request.input("EmailTitle",             MSSQL.NVarChar,     crisisCommunicationData.emailTitle);
            request.input("EmailContent",           MSSQL.NVarChar,     crisisCommunicationData.emailContent);
            request.input("EvidenceIDs",            MSSQL.NVarChar,     crisisCommunicationData.evidenceIds);
            request.input("Recipients",             MSSQL.NVarChar,     crisisCommunicationData.recipentsData);
            request.input("StatusID",               MSSQL.Int,          crisisCommunicationData.statusId);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Input parameters value for BCM.CM_AddCommunication procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CommunicationID = "       + crisisCommunicationData.communicationId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CommunicationTitle = "    + crisisCommunicationData.communicationTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : RecipientTypeID = "       + crisisCommunicationData.recipentId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CategoryID = "            + crisisCommunicationData.categoryId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : IncidentIDs = "           + crisisCommunicationData.incidentIds);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : TemplateID = "            + crisisCommunicationData.templateId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EmailTitle = "            + crisisCommunicationData.emailTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EmailContent = "          + crisisCommunicationData.emailContent);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EvidenceIDs = "           + crisisCommunicationData.evidenceIds);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Recipients = "            + crisisCommunicationData.recipentsData);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : StatusID = "              + crisisCommunicationData.statusId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : UserName     = "          + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_AddCommunication").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Output parameters value of BCM.CM_AddCommunication procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Input parameters value for BCM.CM_AddCommunication procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CommunicationID = "       + crisisCommunicationData.communicationId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CommunicationTitle = "    + crisisCommunicationData.communicationTitle);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : RecipientTypeID = "       + crisisCommunicationData.recipentId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CategoryID = "            + crisisCommunicationData.categoryId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : IncidentIDs = "           + crisisCommunicationData.incidentIds);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : TemplateID = "            + crisisCommunicationData.templateId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EmailTitle = "            + crisisCommunicationData.emailTitle);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EmailContent = "          + crisisCommunicationData.emailContent);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EvidenceIDs = "           + crisisCommunicationData.evidenceIds);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Recipients = "            + crisisCommunicationData.recipentsData);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : StatusID = "              + crisisCommunicationData.statusId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : UserName     = "          + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Input parameters value for BCM.CM_AddCommunication procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CommunicationID = "       + crisisCommunicationData.communicationId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CommunicationTitle = "    + crisisCommunicationData.communicationTitle);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : RecipientTypeID = "       + crisisCommunicationData.recipentId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : CategoryID = "            + crisisCommunicationData.categoryId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : IncidentIDs = "           + crisisCommunicationData.incidentIds);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : TemplateID = "            + crisisCommunicationData.templateId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EmailTitle = "            + crisisCommunicationData.emailTitle);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EmailContent = "          + crisisCommunicationData.emailContent);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : EvidenceIDs = "           + crisisCommunicationData.evidenceIds);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Recipients = "            + crisisCommunicationData.recipentsData);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : StatusID = "              + crisisCommunicationData.statusId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : UserName     = "          + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : createCrisisMessage : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch the crisis communication details of particular id  from the dataBase
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommunicationData
     * @returns
     */
     async getCrisisCommunicationData(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Execution started.");
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

            request.input("CommunicationIDs",       MSSQL.NVarChar,     crisisCommunicationData.communicationIds)
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Input parameters value for BCM.CM_GetCommunications procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : CommunicationIDs = "   + crisisCommunicationData.communicationIds);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetCommunications").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Output parameters value of BCM.CM_GetCommunications procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Input parameters value for BCM.CM_GetCommunications procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : CommunicationIDs = "     + crisisCommunicationData.communicationIds);
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : UserName     = "         + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Input parameters value for BCM.CM_GetCommunications procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : CommunicationIDs = "     + crisisCommunicationData.communicationIds);
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : UserName     = "         + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : getCrisisCommunicationData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will upload crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommunicationData
     * @returns
     */
     async uploadCrisisAttachment(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Execution started.");
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

            request.input('OriginalFileName',       MSSQL.NVarChar,     crisisCommunicationData.OriginalFileName);
            request.input('FileType',               MSSQL.NVarChar,     crisisCommunicationData.FileType)
            request.input('FileContent',            MSSQL.VarBinary,    crisisCommunicationData.FileContent);
            request.input('CommunicationID',        MSSQL.BigInt,       CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Input parameters value for BCM.CM_AddCommunicationEvidence procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : OriginalFileName = "   + crisisCommunicationData.OriginalFileName);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : FileType = "           + crisisCommunicationData.FileType);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : FileName = "           + crisisCommunicationData.FileName);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_AddCommunicationEvidence").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Output parameters value of BCM.CM_AddCommunicationEvidence procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Input parameters value for BCM.CM_AddCommunicationEvidence procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : OriginalFileName = "   + crisisCommunicationData.OriginalFileName);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : FileType = "           + crisisCommunicationData.FileType);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : FileName = "           + crisisCommunicationData.FileName);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : UserName     = "       + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Input parameters value for BCM.CM_AddCommunicationEvidence procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : OriginalFileName = "   + crisisCommunicationData.OriginalFileName);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : FileType = "           + crisisCommunicationData.FileType);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : FileName = "           + crisisCommunicationData.FileName);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : UserName     = "       + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : uploadCrisisAttachment : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will download crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommunicationData
     * @returns
     */
      async downloadCrisisAttachment(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Execution started.");
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


            request.input('FileContentID',          MSSQL.BigInt,      crisisCommunicationData.attachmentId);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Input parameters value for BCM.CM_DownloadCommunicationEvidence procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : FileContentID = "    + crisisCommunicationData.attachmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : UserName     = "     + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_DownloadCommunicationEvidence").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Output parameters value of BCM.CM_DownloadCommunicationEvidence procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Input parameters value for BCM.CM_DownloadCommunicationEvidence procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : FileContentID = "    + crisisCommunicationData.attachmentId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : UserName     = "    + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Input parameters value for BCM.CM_DownloadCommunicationEvidence procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : FileContentID = "    + crisisCommunicationData.attachmentId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : UserName     = "    + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : downloadCrisisAttachment : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will send crisis communication
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} crisisCommunicationData
     * @returns
     */
      async sendCrisisCommunication(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Execution started.");
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


            request.input('CommunicationID',        MSSQL.BigInt,       crisisCommunicationData.communicationId);
            request.input('StatusID',               MSSQL.Int,          crisisCommunicationData.statusId);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Input parameters value for BCM.CM_PublishCommunication procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : CommunicationID = "    + crisisCommunicationData.communicationId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : StatusID = "           + crisisCommunicationData.statusId);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_PublishCommunication").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Output parameters value of BCM.CM_PublishCommunication procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Input parameters value for BCM.CM_PublishCommunication procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : CommunicationID = "    + crisisCommunicationData.communicationId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : StatusID = "           + crisisCommunicationData.statusId);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : UserName     = "       + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Input parameters value for BCM.CM_PublishCommunication procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : CommunicationID = "    + crisisCommunicationData.communicationId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : StatusID = "           + crisisCommunicationData.statusId);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : UserName     = "       + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : crisisCommunicationDB : sendCrisisCommunication : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }


  stop() {}
};