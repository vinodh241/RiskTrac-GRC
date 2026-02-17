const MSSQL                 = require("mssql");
const CONSTANT_FILE_OBJ     = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ      = require("../utility/message/message-constant.js");

module.exports = class IncidentReportDB {
    constructor() { }

    start() { }

    /**
     * This function will fetch incident reports list from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getIncidentReportList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("IncidentIDs",    MSSQL.NVarChar, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Input parameters value for BCM.CM_GetIncidents procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetIncidents").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Output parameters value of BCM.CM_GetIncidents procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Input parameters value for BCM.CM_GetIncidents procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : AccountGUID       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Input parameters value for BCM.CM_GetIncidents procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportList : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

        /**
     * This function will fetch the site risk assessments data for report from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
    async getIncidentConsolidatedReportData(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Execution started.");
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

            request.input("IncidentIDs",                MSSQL.NVarChar, incidentReportData.incidentIds);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Input parameters value for BCM.CM_GetIncidents procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : incidentIDs = "       + incidentReportData.incidentIds);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : UserName    = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : AccountGUID    = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetIncidents").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Output parameters value of BCM.CM_GetIncidents procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Success       = "   + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : OutMessage    = "   + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Input parameters value for BCM.CM_GetIncidents procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : incidentIDs = "     + incidentReportData.incidentIds);
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : UserName    = "     + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : AccountGUID    = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Input parameters value for BCM.CM_GetIncidents procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : incidentIDs = "     + incidentReportData.incidentIds);
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : UserName    = "     + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : AccountGUID    = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentConsolidatedReportData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will fetch info for add/update incident report data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getIncidentReportInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Execution started.");
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

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Input parameters value for BCM.CM_GetIncidentInfo procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetIncidentInfo").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Output parameters value of BCM.CM_GetIncidentInfo procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Input parameters value for BCM.CM_GetIncidentInfo procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Input parameters value for BCM.CM_GetIncidentInfo procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : UserName       = " + userNameFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will create new incident report to the database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
    async createNewIncidentReport(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Execution started.");
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

            request.input("IncidentID",                         MSSQL.BigInt,           incidentReportData.incidentId);
            request.input("Code",                               MSSQL.NVarChar,         incidentReportData.incidentCode);
            request.input("StatusID",                           MSSQL.Int,              incidentReportData.incidentStatusId);
            request.input("StartDate",                          MSSQL.DateTime,         incidentReportData.incidentStartDateTime);
            request.input("EndDate",                            MSSQL.DateTime,         incidentReportData.incidentEndDateTime);
            request.input("Title",                              MSSQL.NVarChar,         incidentReportData.incidentTitle);
            request.input("IncidentNatureIDs",                  MSSQL.NVarChar,         incidentReportData.incidentNatureId);
            request.input("ClassificationID",                   MSSQL.Int,              incidentReportData.incidentClassificationId);
            request.input("IncidentSiteIDs",                    MSSQL.NVarChar,         incidentReportData.incidentLocationId);
            request.input("Description",                        MSSQL.NVarChar,         incidentReportData.incidentDescription);
            request.input("Evaluation_Conclusion",              MSSQL.NVarChar,         incidentReportData.postIncidentEvaluationConclusion);
            request.input("IncidentActions",                    MSSQL.NVarChar,         JSON.stringify(incidentReportData.actionsTaken));
            request.input("IncidentActionPlans",                MSSQL.NVarChar,         JSON.stringify(incidentReportData.actionPlan));
            request.input("EvidenceIDs",                        MSSQL.NVarChar,         incidentReportData.evidenceIds)
            request.input("UserName",                           MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                           MSSQL.Bit);
            request.output("OutMessage",                        MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Input parameters value for BCM.CM_AddIncident procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Code                               = " + incidentReportData.incidentCode);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : StatusID                           = " + incidentReportData.incidentStatusId);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : StartDate                          = " + incidentReportData.incidentStartDateTime);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : EndDate                            = " + incidentReportData.incidentEndDateTime);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Title                              = " + incidentReportData.incidentTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentNatureIDs                  = " + incidentReportData.incidentNatureId);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : ClassificationID                   = " + incidentReportData.incidentClassificationId);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentSiteIDs                    = " + incidentReportData.incidentLocationId);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Description                        = " + incidentReportData.incidentDescription);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Evaluation_Conclusion              = " + incidentReportData.postIncidentEvaluationConclusion);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentActions                    = " + incidentReportData.actionsTaken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentActionPlans                = " + incidentReportData.actionPlan);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : EvidenceIDs                        = " + incidentReportData.evidenceIds);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : UserName                           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : AccountGUID                           = " + accountGUIDFromToken);

            return request.execute("BCM.CM_AddIncident").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Output parameters value of BCM.CM_AddIncident procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Input parameters value for BCM.CM_AddIncident procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Code                          = " + incidentReportData.incidentCode);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : StatusID                      = " + incidentReportData.incidentStatusId);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : StartDate                     = " + incidentReportData.incidentStartDateTime);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : EndDate                       = " + incidentReportData.incidentEndDateTime);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Title                         = " + incidentReportData.incidentTitle);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentNatureIDs             = " + incidentReportData.incidentNatureId);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : ClassificationID              = " + incidentReportData.incidentClassificationId);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentSiteIDs               = " + incidentReportData.incidentLocationId);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Description                   = " + incidentReportData.incidentDescription);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Evaluation_Conclusion         = " + incidentReportData.postIncidentEvaluationConclusion);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentActions               = " + incidentReportData.actionsTaken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentActionPlans           = " + incidentReportData.actionPlan);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : EvidenceIDs                   = " + incidentReportData.evidenceIds);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : UserName                      = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : AccountGUID                           = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Execution end.                : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Input parameters value for BCM.CM_AddIncident procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Code                      = " + incidentReportData.incidentCode);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : StatusID                  = " + incidentReportData.incidentStatusId);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : StartDate                 = " + incidentReportData.incidentStartDateTime);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : EndDate                   = " + incidentReportData.incidentEndDateTime);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Title                     = " + incidentReportData.incidentTitle);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentNatureIDs         = " + incidentReportData.incidentNatureId);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : ClassificationID          = " + incidentReportData.incidentClassificationId);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentSiteIDs           = " + incidentReportData.incidentLocationId);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Description               = " + incidentReportData.incidentDescription);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Evaluation_Conclusion     = " + incidentReportData.postIncidentEvaluationConclusion);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentActions           = " + incidentReportData.actionsTaken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : IncidentActionPlans       = " + incidentReportData.actionPlan);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : EvidenceIDs               = " + incidentReportData.evidenceIds);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : AccountGUID                           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : createNewIncidentReport : Execution end.            : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will get incident report data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
    async getIncidentReportData(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Execution started.");
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

            request.input("IncidentIDs",                MSSQL.NVarChar,     incidentReportData.incidentIds);
            request.input("UserName",                   MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Input parameters value for BCM.CM_GetIncidents procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : incidentIds      = " + incidentReportData.incidentIds);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : UserName         = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : AccountGUID         = " + accountGUIDFromToken);

            return request.execute("BCM.CM_GetIncidents").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Output parameters value of BCM.CM_GetIncidents procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Input parameters value for BCM.CM_GetIncidents procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : incidentIds         = " + incidentReportData.incidentIds);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : AccountGUID         = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Input parameters value for BCM.CM_GetIncidents procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : incidentIds     = " + incidentReportData.incidentIds);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : UserName        = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : AccountGUID         = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will get incident action trails from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
    async getIncidentReportActionTrail(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Execution started.");
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

            request.input("incidentId",                         MSSQL.Int,              incidentReportData.incidentId);
            request.input("UserName",                           MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                           MSSQL.Bit);
            request.output("OutMessage",                        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Input parameters value for BCM.Site_getIncidentReportActionTrail procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : incidentId                         = " + incidentReportData.incidentId);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : UserName                           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : AccountGUID                           = " + accountGUIDFromToken);

            return request.execute("BCM.Site_getIncidentReportActionTrail").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Output parameters value of BCM.Site_getIncidentReportActionTrail procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Input parameters value for BCM.Site_getIncidentReportActionTrail procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : incidentId                         = " + incidentReportData.incidentId);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : UserName                           = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : AccountGUID                           = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Execution end.                     : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Input parameters value for BCM.Site_getIncidentReportActionTrail procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : incidentId                         = " + incidentReportData.incidentId);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : UserName                           = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : AccountGUID                           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : getIncidentReportActionTrail : Execution end.                     : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will submit incident report for review to BC Manager
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
    async submitIncidentReportForReview(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Execution started.");
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
            
            request.input("IncidentID",                 MSSQL.Int,                  incidentReportData.incidentId);
            request.input("Comment",                    MSSQL.NVarChar,             incidentReportData.reviewComment);
            request.input("StatusID",                   MSSQL.Int,                  incidentReportData.statusId);
            request.input("IsApproved",                 MSSQL.Bit,                  CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
            request.input('UserGUID',                   MSSQL.UniqueIdentifier,     userIdFromToken)
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Input parameters value for BCM.CM_AddIncidentReviewComment procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : incidentReportData = " + JSON.stringify(incidentReportData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.CM_AddIncidentReviewComment").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Output parameters value of BCM.CM_AddIncidentReviewComment procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Input parameters value for BCM.CM_AddIncidentReviewComment procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : incidentReportData  = " + JSON.stringify(incidentReportData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : AccountGUID           = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Input parameters value for BCM.CM_AddIncidentReviewComment procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : incidentReportData      = " + JSON.stringify(incidentReportData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : submitIncidentReportForReview : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will review incident report by BC Manager
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
    async reviewIncidentReport(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Execution started.");
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
            
            request.input("IncidentID",                 MSSQL.BigInt,               incidentReportData.incidentId);
            request.input("IsApproved",                 MSSQL.Bit,                  incidentReportData.status);
            request.input("Comment",                    MSSQL.NVarChar,             incidentReportData.reviewComment);
            request.input('UserGUID',                   MSSQL.UniqueIdentifier,     userIdFromToken)
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Input parameters value for BCM.CM_AddIncidentReviewComment procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : incidentReportData = " + JSON.stringify(incidentReportData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : AccountGUID           = " + accountGUIDFromToken);


            return request.execute("BCM.CM_AddIncidentReviewComment").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Output parameters value of BCM.CM_AddIncidentReviewComment procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Input parameters value for BCM.CM_AddIncidentReviewComment procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : incidentReportData  = " + JSON.stringify(incidentReportData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : AccountGUID           = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Input parameters value for BCM.CM_AddIncidentReviewComment procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : incidentReportData      = " + JSON.stringify(incidentReportData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : reviewIncidentReport : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will upload crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
     async uploadIncidentEvidence(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Execution started.");
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

            request.input('FileName',               MSSQL.NVarChar,     incidentReportData.OriginalFileName);
            request.input('FileType',               MSSQL.NVarChar,     incidentReportData.FileType)
            request.input('FileContent',            MSSQL.VarBinary,    incidentReportData.FileContent);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Input parameters value for BCM.CM_UploadIncidentEvidences procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileName = "           + incidentReportData.OriginalFileName);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileType = "           + incidentReportData.FileType);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileName = "           + incidentReportData.FileName);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_UploadIncidentEvidences").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Output parameters value of BCM.CM_UploadIncidentEvidences procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Input parameters value for BCM.CM_UploadIncidentEvidences procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileName = "           + incidentReportData.OriginalFileName);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileType = "           + incidentReportData.FileType);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileName = "           + incidentReportData.FileName);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : UserName     = "       + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Input parameters value for BCM.SRA_UploadRiskAssessmentEvidences procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileName = "           + incidentReportData.OriginalFileName);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileType = "           + incidentReportData.FileType);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : FileName = "           + incidentReportData.FileName);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : UserName     = "       + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : uploadIncidentEvidence : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will download crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} incidentReportData
     * @returns
     */
      async downloadIncidentEvidence(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Execution started.");
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


            request.input('FileContentID',          MSSQL.BigInt,      incidentReportData.fileContentId);
            request.input("UserName",               MSSQL.NVarChar,    userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Input parameters value for BCM.CM_DownloadIncidentEvidences procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : FileContentID = "    + incidentReportData.fileContentId);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : UserName     = "     + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.CM_DownloadIncidentEvidences").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Output parameters value of BCM.CM_DownloadIncidentEvidences procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Input parameters value for BCM.CM_DownloadIncidentEvidences procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : FileContentID = "    + incidentReportData.fileContentId);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : UserName     = "    + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Input parameters value for BCM.CM_DownloadIncidentEvidences procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : FileContentID = "    + incidentReportData.fileContentId);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : UserName     = "    + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : IncidentReportDB : downloadIncidentEvidence : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }


    stop() { }
};
