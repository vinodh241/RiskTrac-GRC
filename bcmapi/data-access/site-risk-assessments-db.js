const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../utility/message/message-constant.js");

module.exports = class siteRiskAssessmentDB {
  constructor() {}

  start() {}

  

    /**
     * This function will fetch the particalur risk details of a site from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async getRiskData(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Execution started.");
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

        request.input("SiteRiskAssessmentID",       MSSQL.BigInt,   siteRiskAssessmentData.siteRiskAssessmentId);
        request.input("ScheduleRiskAssessmentID",   MSSQL.BigInt,   siteRiskAssessmentData.scheduleRiskAssessmentId)
        request.input("ThreatRiskID",               MSSQL.BigInt,   siteRiskAssessmentData.threatRiskId)
        request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",                   MSSQL.Bit);
        request.output("OutMessage",                MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Input parameters value for BCM.SRA_GetRiskData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentId);
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : ScheduleRiskAssessmentID = "   + siteRiskAssessmentData.scheduleRiskAssessmentId);
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskId);
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : UserName     = "               + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : AccountGUID     = " + accountGUIDFromToken);

        return request.execute("BCM.SRA_GetRiskData").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Output parameters value of BCM.SRA_GetRiskData procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Input parameters value for BCM.SRA_GetRiskData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : ScheduleRiskAssessmentID = "   + siteRiskAssessmentData.scheduleRiskAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskId);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : UserName     = "               + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Input parameters value for BCM.SRA_GetRiskData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : ScheduleRiskAssessmentID = "   + siteRiskAssessmentData.scheduleRiskAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskId);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : UserName     = "               + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch the info required to save response from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
     async getInfoForSaveResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Execution started.");
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
            
            request.input("SiteRiskAssessmentID",       MSSQL.BigInt,   siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Input parameters value for BCM.SRA_GetInfoForSaveRiskResponse procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskData : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_GetInfoForSaveRiskResponse").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Output parameters value of BCM.SRA_GetInfoForSaveRiskResponse procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Input parameters value for BCM.SRA_GetInfoForSaveRiskResponse procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : UserName     = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Input parameters value for BCM.SRA_GetInfoForSaveRiskResponse procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : UserName     = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getInfoForSaveResponse : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will save response against particular risk for a site
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async saveRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Execution started.");
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

            request.input("ScheduleRiskAssessmentID",       MSSQL.BigInt,           siteRiskAssessmentData.scheduleRiskAssessmentId);
            request.input("ThreatRiskID",                   MSSQL.BigInt,           siteRiskAssessmentData.threatRiskId);
            request.input("SiteRiskAssessmentID",           MSSQL.BigInt,           siteRiskAssessmentData.siteRiskAssessmentId)
            request.input("ControlEffectivenessID",         MSSQL.Int,              siteRiskAssessmentData.controlEffectivenessId);
            request.input("InherentLikelihoodRatingID",     MSSQL.Int,              siteRiskAssessmentData.inherentLikelihoodRatingId);
            request.input("InherentImpactRatingID",         MSSQL.Int,              siteRiskAssessmentData.inherentImpactRatingId);
            request.input("ResidualLikelihoodRatingID",     MSSQL.Int,              siteRiskAssessmentData.residualLikelihoodRatingId || null);
            request.input("ResidualImpactRatingID",         MSSQL.Int,              siteRiskAssessmentData.residualImpactRatingId || null);
            request.input("OverallResidualRiskRatingID",    MSSQL.Int,              siteRiskAssessmentData.overallResidualRiskRatingId);
            request.input("OverallInherentRiskRatingID",    MSSQL.Int,              siteRiskAssessmentData.overallInherentRiskRatingId);
            request.input("Controls",                       MSSQL.NVarChar,         JSON.stringify(siteRiskAssessmentData.controls));
            request.input("RiskTreatmentStrategyID",        MSSQL.Int,              siteRiskAssessmentData.riskTreatmentStrategyId);
            request.input("ActionPlans",                    MSSQL.NVarChar,         JSON.stringify(siteRiskAssessmentData.actionPlans));
            request.input("RiskTolerateExplanation",        MSSQL.NVarChar,         siteRiskAssessmentData.riskTolerateDescription);
            request.input("RiskRatingComment",              MSSQL.NVarChar,         siteRiskAssessmentData.riskRatingComment);
            request.input("EvidenceIDs",                    MSSQL.NVarChar,         siteRiskAssessmentData.evidenceIds)
            request.input('UserGUID',                       MSSQL.UniqueIdentifier, userIdFromToken)
            request.input("UserName",                       MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Input parameters value for BCM.SRA_SaveRiskResponse procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ScheduleRiskAssessmentID     = " + siteRiskAssessmentData.scheduleRiskAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : SiteRiskAssessmentID         = " + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ThreatRiskID                 = " + siteRiskAssessmentData.threatRiskId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ControlEffectivenessID       = " + siteRiskAssessmentData.controlEffectivenessId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : InherentLikelihoodRatingID   = " + siteRiskAssessmentData.inherentLikelihoodRatingId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : InherentImpactRatingID       = " + siteRiskAssessmentData.inherentImpactRatingId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ResidualLikelihoodRatingID   = " + siteRiskAssessmentData.residualLikelihoodRatingId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ResidualImpactRatingID       = " + siteRiskAssessmentData.residualImpactRatingId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OverallResidualRiskRatingID  = " + siteRiskAssessmentData.overallResidualRiskRatingId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OverallInherentRiskRatingID  = " + siteRiskAssessmentData.overallInherentRiskRatingId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Controls                     = " + JSON.stringify(siteRiskAssessmentData.controls));
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskTreatmentStrategyID      = " + siteRiskAssessmentData.riskTreatmentStrategyId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ActionPlans                  = " + JSON.stringify(siteRiskAssessmentData.actionPlans));
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskTolerateExplanation      = " + siteRiskAssessmentData.riskTolerateDescription);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskRatingComment            = " + siteRiskAssessmentData.riskRatingComment);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : EvidenceIDs                  = " + siteRiskAssessmentData.evidenceIds);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : UserGUID                     = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : UserName                     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : AccountGUID                     = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_SaveRiskResponse").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Output parameters value of BCM.SRA_SaveRiskResponse procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Input parameters value of BCM.SRA_SaveRiskResponse procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ScheduleRiskAssessmentID     = " + siteRiskAssessmentData.scheduleRiskAssessmentId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ThreatRiskID                 = " + siteRiskAssessmentData.threatRiskId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : SiteRiskAssessmentID         = " + siteRiskAssessmentData.siteRiskAssessmentId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ControlEffectivenessID       = " + siteRiskAssessmentData.controlEffectivenessId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : InherentLikelihoodRatingID   = " + siteRiskAssessmentData.inherentLikelihoodRatingId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : InherentImpactRatingID       = " + siteRiskAssessmentData.inherentImpactRatingId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ResidualLikelihoodRatingID   = " + siteRiskAssessmentData.residualLikelihoodRatingId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ResidualImpactRatingID       = " + siteRiskAssessmentData.residualImpactRatingId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OverallResidualRiskRatingID  = " + siteRiskAssessmentData.overallResidualRiskRatingId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OverallInherentRiskRatingID  = " + siteRiskAssessmentData.overallInherentRiskRatingId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Controls                     = " + JSON.stringify(siteRiskAssessmentData.controls));
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskTreatmentStrategyID      = " + siteRiskAssessmentData.riskTreatmentStrategyId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ActionPlans                  = " + JSON.stringify(siteRiskAssessmentData.actionPlans));
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskTolerateExplanation      = " + siteRiskAssessmentData.riskTolerateDescription);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskRatingComment            = " + siteRiskAssessmentData.riskRatingComment);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : EvidenceIDs                  = " + siteRiskAssessmentData.evidenceIds);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : UserGUID                     = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : AccountGUID                     = " + accountGUIDFromToken);
        
                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Input parameters value of BCM.SRA_SaveRiskResponse procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ScheduleRiskAssessmentID     = " + siteRiskAssessmentData.scheduleRiskAssessmentId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ThreatRiskID                 = " + siteRiskAssessmentData.threatRiskId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : SiteRiskAssessmentID         = " + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ControlEffectivenessID       = " + siteRiskAssessmentData.controlEffectivenessId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : InherentLikelihoodRatingID   = " + siteRiskAssessmentData.inherentLikelihoodRatingId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : InherentImpactRatingID       = " + siteRiskAssessmentData.inherentImpactRatingId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ResidualLikelihoodRatingID   = " + siteRiskAssessmentData.residualLikelihoodRatingId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ResidualImpactRatingID       = " + siteRiskAssessmentData.residualImpactRatingId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OverallResidualRiskRatingID  = " + siteRiskAssessmentData.overallResidualRiskRatingId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : OverallInherentRiskRatingID  = " + siteRiskAssessmentData.overallInherentRiskRatingId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : Controls                     = " + JSON.stringify(siteRiskAssessmentData.controls));
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskTreatmentStrategyID      = " + siteRiskAssessmentData.riskTreatmentStrategyId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : ActionPlans                  = " + JSON.stringify(siteRiskAssessmentData.actionPlans));
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskTolerateExplanation      = " + siteRiskAssessmentData.riskTolerateDescription);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : RiskRatingComment            = " + siteRiskAssessmentData.riskRatingComment);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : EvidenceIDs                  = " + siteRiskAssessmentData.evidenceIds);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : UserGUID                     = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : saveRiskResponse : AccountGUID                     = " + accountGUIDFromToken);
    
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will submit the risk response for the particular site master in the database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async submitRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Execution started.");
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

            request.input("ScheduleRiskAssessmentIDs",  MSSQL.NVarChar,             siteRiskAssessmentData.scheduleRiskAssessmentIds);
            request.input("SiteRiskAssessmentID",       MSSQL.BigInt,               siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("Comment",                    MSSQL.NVarChar,             siteRiskAssessmentData.reviewComment);
            request.input("UserGUID",                   MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Input parameters value for BCM.SRA_SubmitRiskResponse procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : ScheduleRiskAssessmentIDs  = " + siteRiskAssessmentData.scheduleRiskAssessmentIds);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : SiteRiskAssessmentID       = " + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Comment                    = " + siteRiskAssessmentData.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : UserGUID                   = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : UserName                   = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : AccountGUID                   = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_SubmitRiskResponse").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Output parameters value of BCM.SRA_SubmitRiskResponse procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Input parameters value for BCM.SRA_SubmitRiskResponse procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : ScheduleRiskAssessmentIDs  = " + siteRiskAssessmentData.scheduleRiskAssessmentIds);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : SiteRiskAssessmentID       = " + siteRiskAssessmentData.siteRiskAssessmentId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Comment                    = " + siteRiskAssessmentData.reviewComment);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : UserGUID                   = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : UserName                   = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : AccountGUID                   = " + accountGUIDFromToken);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Input parameters value for BCM.SRA_SubmitRiskResponse procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : ScheduleRiskAssessmentIDs  = " + siteRiskAssessmentData.scheduleRiskAssessmentIds);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : SiteRiskAssessmentID       = " + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : Comment                    = " + siteRiskAssessmentData.reviewComment);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : UserGUID                   = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : UserName                   = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteRiskAssessmentsDB : submitRiskResponse : AccountGUID                   = " + accountGUIDFromToken);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch site risk assessments list data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @returns
    */
    async getSiteRiskAssessmentsList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Execution started.");
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
            request.output("OutMessage",    MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentList] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[SRA_GetSiteRiskAssessmentList]").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Output parameters value of [BCM].[SRA_GetSiteRiskAssessmentList] procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentList] procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentList] procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsList : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch site risk assessments info data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @returns
    */
    async getSiteRiskAssessmentsInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Execution started.");
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
            request.output("OutMessage",    MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentInfo] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[SRA_GetSiteRiskAssessmentInfo]").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Output parameters value of [BCM].[SRA_GetSiteRiskAssessmentInfo] procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentInfo] procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentInfo] procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch site risk assessments info data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} siteRiskAssessmentData
    * @returns
    */
    async addSiteRiskAssessment(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Execution started.");
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

            request.input("SiteID",               MSSQL.Int,                siteRiskAssessmentData.SiteID);
            request.input("SiteName",             MSSQL.NVarChar,           siteRiskAssessmentData.SiteName);
            request.input("AssessmentName",       MSSQL.NVarChar,           siteRiskAssessmentData.AssessmentName);
            request.input("AssessmentCode",       MSSQL.NVarChar,           siteRiskAssessmentData.AssessmentCode);
            request.input("StartDate",            MSSQL.NVarChar,           siteRiskAssessmentData.StartDate);
            request.input("EndDate",              MSSQL.NVarChar,           siteRiskAssessmentData.EndDate);
            request.input("ReviewerID",           MSSQL.UniqueIdentifier,   siteRiskAssessmentData.ReviewerID);
            request.input("Risks",                MSSQL.NVarChar,           JSON.stringify(siteRiskAssessmentData.Risks));
            request.input("UserName",             MSSQL.NVarChar,           userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",             MSSQL.Bit);
            request.output("OutMessage",          MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Input parameters value for [BCM].[SRA_AddSiteRiskAssessments] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : SiteID           = " + siteRiskAssessmentData.SiteID);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : SiteName         = " + siteRiskAssessmentData.SiteName);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AssessmentName   = " + siteRiskAssessmentData.AssessmentName);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AssessmentCode   = " + siteRiskAssessmentData.AssessmentCode);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : StartDate        = " + siteRiskAssessmentData.StartDate);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : EndDate          = " + siteRiskAssessmentData.EndDate);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : ReviewerID       = " + siteRiskAssessmentData.ReviewerID);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Risks            = " + JSON.stringify(siteRiskAssessmentData.Risks));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : UserName         = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AccountGUID         = " + accountGUIDFromToken);

            return request.execute("[BCM].[SRA_AddSiteRiskAssessments]").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Output parameters value of [BCM].[SRA_AddSiteRiskAssessments] procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Input parameters value for [BCM].[SRA_AddSiteRiskAssessments] procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : SiteID           = " + siteRiskAssessmentData.SiteID);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : SiteName         = " + siteRiskAssessmentData.SiteName);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AssessmentName   = " + siteRiskAssessmentData.AssessmentName);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AssessmentCode   = " + siteRiskAssessmentData.AssessmentCode);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : StartDate        = " + siteRiskAssessmentData.StartDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : EndDate          = " + siteRiskAssessmentData.EndDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : ReviewerID       = " + siteRiskAssessmentData.ReviewerID);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Risks            = " + JSON.stringify(siteRiskAssessmentData.Risks));
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : UserName         = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AccountGUID         = " + accountGUIDFromToken);

                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Input parameters value for [BCM].[SRA_AddSiteRiskAssessments] procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : SiteID           = " + siteRiskAssessmentData.SiteID);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : SiteName         = " + siteRiskAssessmentData.SiteName);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AssessmentName   = " + siteRiskAssessmentData.AssessmentName);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AssessmentCode   = " + siteRiskAssessmentData.AssessmentCode);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : StartDate        = " + siteRiskAssessmentData.StartDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : EndDate          = " + siteRiskAssessmentData.EndDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : ReviewerID       = " + siteRiskAssessmentData.ReviewerID);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Risks            = " + JSON.stringify(siteRiskAssessmentData.Risks));
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : UserName         = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : AccountGUID         = " + accountGUIDFromToken);

            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addSiteRiskAssessment : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will update site risk assessment data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} siteRiskAssessmentData
    * @returns
    */
    async updateSiteRiskAssessment(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Execution started.");
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

            request.input("SiteRiskAssessmentID", MSSQL.BigInt,   siteRiskAssessmentData.SiteRiskAssessmentID);
            request.input("Risks",                MSSQL.NVarChar, JSON.stringify(siteRiskAssessmentData.Risks));
            request.input("StartDate",            MSSQL.NVarChar, siteRiskAssessmentData.StartDate);
            request.input("EndDate",              MSSQL.NVarChar, siteRiskAssessmentData.EndDate);
            request.input("UserName",             MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",             MSSQL.Bit);
            request.output("OutMessage",          MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Input parameters value for [BCM].[SRA_UpdateSiteRiskAssessment] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : SiteRiskAssessmentID      = " + siteRiskAssessmentData.SiteRiskAssessmentID);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Risks                     = " + siteRiskAssessmentData.Risks);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : StartDate                 = " + siteRiskAssessmentData.StartDate);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : EndDate                   = " + siteRiskAssessmentData.EndDate);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : UserName                  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : AccountGUID                  = " + accountGUIDFromToken);

            return request.execute("[BCM].[SRA_UpdateSiteRiskAssessment]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Output parameters value of [BCM].[SRA_UpdateSiteRiskAssessment] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Input parameters value for [BCM].[SRA_UpdateSiteRiskAssessment] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : SiteRiskAssessmentID      = " + siteRiskAssessmentData.SiteRiskAssessmentID);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Risks                     = " + siteRiskAssessmentData.Risks);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : StartDate                 = " + siteRiskAssessmentData.StartDate);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : EndDate                   = " + siteRiskAssessmentData.EndDate);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : UserName                  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : AccountGUID                  = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Input parameters value for [BCM].[SRA_UpdateSiteRiskAssessment] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : SiteRiskAssessmentID      = " + siteRiskAssessmentData.SiteRiskAssessmentID);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Risks                     = " + siteRiskAssessmentData.Risks);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : StartDate                 = " + siteRiskAssessmentData.StartDate);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : EndDate                   = " + siteRiskAssessmentData.EndDate);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : AccountGUID                  = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateSiteRiskAssessment : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will delete site risk assessment data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} siteRiskAssessmentData
    * @returns
    */
    async deleteSiteRiskAssessment(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Execution started.");
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

            request.input("SiteRiskAssessmentID",   MSSQL.BigInt,   siteRiskAssessmentData.SiteRiskAssessmentID);
            request.input("UserGUID",               MSSQL.NVarChar, userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Input parameters value for [BCM].[SRA_DeleteSiteRiskAssessment] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : SiteRiskAssessmentID      = " + siteRiskAssessmentData.SiteRiskAssessmentID);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : UserName                  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : AccountGUID                  = " + accountGUIDFromToken);

            return request.execute("[BCM].[SRA_DeleteSiteRiskAssessment]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Output parameters value of [BCM].[SRA_DeleteSiteRiskAssessment] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Input parameters value for [BCM].[SRA_DeleteSiteRiskAssessment] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : SiteRiskAssessmentID      = " + siteRiskAssessmentData.SiteRiskAssessmentID);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : UserName                  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : AccountGUID                  = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Input parameters value for [BCM].[SRA_DeleteSiteRiskAssessment] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : SiteRiskAssessmentID      = " + siteRiskAssessmentData.SiteRiskAssessmentID);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : AccountGUID                  = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteSiteRiskAssessment : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch site risk assessments info data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} siteRiskAssessmentData
    * @returns
    */
    async getSiteRiskAssessmentsDetails(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Execution started.");
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
            request.input("SiteRiskAssessmentID",   MSSQL.BigInt,      siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("UserName",               MSSQL.NVarChar,    userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[SRA_GetSiteRiskAssessmentDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Output parameters value of [BCM].[SRA_GetSiteRiskAssessmentDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : AccountGUID       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Input parameters value for [BCM].[SRA_GetSiteRiskAssessmentDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
    	
    /**
     * This function will add new risk to existing site data into database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async addNewCustomThreat(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Execution started.");
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

            request.input("ThreatRiskID",           MSSQL.BigInt,           siteRiskAssessmentData.riskId);
            request.input("SiteRiskAssessmentID",   MSSQL.BigInt,           siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("RiskTitle",              MSSQL.NVarChar,         siteRiskAssessmentData.riskTitle);
            request.input("ThreatCategoryID",       MSSQL.Int,              siteRiskAssessmentData.threatCategoryId);
            request.input("ImpactIDs",              MSSQL.NVarChar,         JSON.stringify(siteRiskAssessmentData.impacts));
            request.input("RiskDiscription",        MSSQL.NVarChar,         siteRiskAssessmentData.riskDescription);
            request.input("RiskCode",               MSSQL.NVarChar,         siteRiskAssessmentData.riskCode);
            request.input("Controls",               MSSQL.NVarChar,         JSON.stringify(siteRiskAssessmentData.controls));
            request.input("RiskOwnerID",            MSSQL.NVarChar,         siteRiskAssessmentData.riskOwnerId);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Input parameters value for BCM.SRA_AddCustomThreat procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : siteRiskAssessmentData               = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_AddCustomThreat").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Output parameters value of BCM.SRA_AddCustomThreat procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Input parameters value for BCM.SRA_AddCustomThreat procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : siteRiskAssessmentData             = " + JSON.stringify(siteRiskAssessmentData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : AccountGUID           = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Input parameters value for BCM.SRA_AddCustomThreat procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : siteRiskAssessmentData                = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : addNewCustomThreat : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will update the existing risk data into database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async updateNewCustomThreat(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Execution started.");
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
            
            request.input("ThreatRiskID",           MSSQL.BigInt,           siteRiskAssessmentData.riskId);
            request.input("SiteRiskAssessmentID",   MSSQL.BigInt,           siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("RiskTitle",              MSSQL.NVarChar,         siteRiskAssessmentData.riskTitle);
            request.input("ThreatCategoryID",       MSSQL.Int,              siteRiskAssessmentData.threatCategoryId);
            request.input("ImpactIDs",              MSSQL.NVarChar,         JSON.stringify(siteRiskAssessmentData.impacts));
            request.input("RiskDiscription",        MSSQL.NVarChar,         siteRiskAssessmentData.riskDescription);
            request.input("RiskCode",               MSSQL.NVarChar,         siteRiskAssessmentData.riskCode);
            request.input("Controls",               MSSQL.NVarChar,         JSON.stringify(siteRiskAssessmentData.controls));
            request.input("RiskOwnerID",            MSSQL.NVarChar,         siteRiskAssessmentData.riskOwnerId);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Input parameters value for BCM.SRA_AddCustomThreat procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : siteRiskAssessmentData               = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_AddCustomThreat").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Output parameters value of BCM.SRA_AddCustomThreat procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Input parameters value for BCM.SRA_AddCustomThreat procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : siteRiskAssessmentData             = " + JSON.stringify(siteRiskAssessmentData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : AccountGUID           = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Input parameters value for BCM.SRA_AddCustomThreat procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : siteRiskAssessmentData                = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : updateNewCustomThreat : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will review the assessment
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async reviewRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Execution started.");
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
            
            request.input("ScheduleRiskAssessmentID",   MSSQL.BigInt,               siteRiskAssessmentData.scheduleRiskAssessmentID);
            request.input("SiteRiskAssessmentID",       MSSQL.BigInt,               siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("ReviewStatus",               MSSQL.BigInt,               siteRiskAssessmentData.reviewStatus);
            request.input("RiskReviewComment",          MSSQL.NVarChar,             siteRiskAssessmentData.riskReviewComment);
            request.input('UserGUID',                   MSSQL.UniqueIdentifier,     userIdFromToken)
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Input parameters value for BCM.SRA_ReviewRiskResponse procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : siteRiskAssessmentData               = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_ReviewRiskResponse").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Output parameters value of BCM.SRA_ReviewRiskResponse procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Input parameters value for BCM.SRA_ReviewRiskResponse procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : siteRiskAssessmentData             = " + JSON.stringify(siteRiskAssessmentData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : AccountGUID           = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Input parameters value for BCM.SRA_ReviewRiskResponse procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : siteRiskAssessmentData                = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : reviewRiskResponse : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will review the assessment
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async submitReviewRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Execution started.");
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
            
            request.input("SiteRiskAssessmentID",       MSSQL.BigInt,               siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("RiskPublishComment",         MSSQL.NVarChar,             siteRiskAssessmentData.reviewComment);
            request.input('UserGUID',                   MSSQL.UniqueIdentifier,     userIdFromToken)
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Input parameters value for BCM.SRA_SubmitReviewRiskResponse procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : siteRiskAssessmentData               = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_SubmitReviewRiskResponse").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Output parameters value of BCM.SRA_SubmitReviewRiskResponse procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Input parameters value for BCM.SRA_SubmitReviewRiskResponse procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : siteRiskAssessmentData             = " + JSON.stringify(siteRiskAssessmentData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : AccountGUID           = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Input parameters value for BCM.SRA_SubmitReviewRiskResponse procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : siteRiskAssessmentData                = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : submitReviewRiskResponse : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch site risk assessments info data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} siteRiskAssessmentData
    * @returns
    */
    async getRiskAssessmentActionTrail(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Execution started.");
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

            request.input("SiteRiskAssessmentID",       MSSQL.BigInt,       siteRiskAssessmentData.siteRiskAssessmentId); 
            request.input("UserName",                   MSSQL.NVarChar,      userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Input parameters value for [BCM].[SRA_GetRiskAssessmentActionTrail] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : SiteRiskAssessmentID  = " + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : UserName              = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : AccountGUID              = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_GetRiskAssessmentActionTrail").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Output parameters value of [BCM].[SRA_GetRiskAssessmentActionTrail] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Input parameters value for [BCM].[SRA_GetRiskAssessmentActionTrail] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : SiteRiskAssessmentID = " + siteRiskAssessmentData.siteRiskAssessmentId);    
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : UserName             = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : AccountGUID              = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Input parameters value for [BCM].[SRA_GetRiskAssessmentActionTrail] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : SiteRiskAssessmentID = " + siteRiskAssessmentData.siteRiskAssessmentId);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : UserName             = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : AccountGUID              = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getRiskAssessmentActionTrail : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch the site risk assessments data for report from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async getSiteRiskAssessmentsForReport(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Execution started.");
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

            request.input("SiteRiskAssessmentIDs",       MSSQL.NVarChar, siteRiskAssessmentData.siteRiskAssessmentIds);
            request.input("ThreatRiskIDs",               MSSQL.NVarChar, siteRiskAssessmentData.threatRiskIDs);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Input parameters value for BCM.SRA_GetSiteRiskAssessmentForReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentIds);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskIDs);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : ScheduleRiskAssessmentID = "   + CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : UserName     = "               + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_GetSiteRiskAssessmentForReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Output parameters value of BCM.SRA_GetSiteRiskAssessmentForReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Input parameters value for BCM.SRA_GetSiteRiskAssessmentForReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : SiteRiskAssessmentID = "     + siteRiskAssessmentData.siteRiskAssessmentIds);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : ThreatRiskID = "             + siteRiskAssessmentData.threatRiskIDs);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : ScheduleRiskAssessmentID = " + CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : UserName     = "             + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Input parameters value for BCM.SRA_GetSiteRiskAssessmentForReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : SiteRiskAssessmentID = "     + siteRiskAssessmentData.siteRiskAssessmentIds);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : ThreatRiskID = "             + siteRiskAssessmentData.threatRiskIDs);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : ScheduleRiskAssessmentID = " + CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : UserName     = "             + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will fetch the site risk assessments data for exporting report from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async getSiteRiskAssessmentForExportDraft(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentsForReport : Execution started.");
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

            request.input("SiteRiskAssessmentIDs",      MSSQL.NVarChar,     siteRiskAssessmentData.siteRiskAssessmentIds);
            request.input("ThreatRiskIDs",              MSSQL.NVarChar,     siteRiskAssessmentData.threatRiskIDs);
            request.input("ScheduleRiskAssessmentIDs",  MSSQL.NVarChar,     siteRiskAssessmentData.scheduleRiskAssessmentIDs);
            request.input("UserName",                   MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Input parameters value for SRA_GetSiteRiskAssessmentForExportDraft procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentIds);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskIDs);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : ScheduleRiskAssessmentIDs = "  + siteRiskAssessmentData.scheduleRiskAssessmentIDs);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : UserName     = "               + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_GetSiteRiskAssessmentForExportDraft").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Output parameters value of SRA_GetSiteRiskAssessmentForExportDraft procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Input parameters value for SRA_GetSiteRiskAssessmentForExportDraft procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentIds);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskIDs);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : ScheduleRiskAssessmentIDs = "  + siteRiskAssessmentData.scheduleRiskAssessmentIDs);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : UserName     = "               + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Input parameters value for SRA_GetSiteRiskAssessmentForExportDraft procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : SiteRiskAssessmentID = "       + siteRiskAssessmentData.siteRiskAssessmentIds);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : ThreatRiskID = "               + siteRiskAssessmentData.threatRiskIDs);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : ScheduleRiskAssessmentIDs = "  + siteRiskAssessmentData.scheduleRiskAssessmentIDs);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : UserName     = "               + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : getSiteRiskAssessmentForExportDraft : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will delete custom threat from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async deleteCustomThreat(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Execution started.");
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
            
            request.input("CustomThreatRiskID",     MSSQL.BigInt,      siteRiskAssessmentData.customThreatRiskID);
            request.input("SiteRiskAssessmentID",   MSSQL.BigInt,      siteRiskAssessmentData.siteRiskAssessmentID);
            request.input("UserName",               MSSQL.NVarChar,    userNameFromToken);  
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);  
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Input parameters value for BCM.SRA_DeleteCustomThreat procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : siteRiskAssessmentData               = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_DeleteCustomThreat").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Output parameters value of BCM.SRA_DeleteCustomThreat procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Input parameters value for BCM.SRA_DeleteCustomThreat procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : siteRiskAssessmentData             = " + JSON.stringify(siteRiskAssessmentData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : AccountGUID           = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : UserName         = " + userNameFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Input parameters value for BCM.SRA_DeleteCustomThreat procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : siteRiskAssessmentData                = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : deleteCustomThreat : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will review the assessment
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
    async publishSiteAssessment(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Execution started.");
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
            
            request.input("SiteRiskAssessmentID",       MSSQL.BigInt,               siteRiskAssessmentData.siteRiskAssessmentId);
            request.input("RiskPublishComment",         MSSQL.NVarChar,             siteRiskAssessmentData.reviewComment);
            request.input('UserGUID',                   MSSQL.UniqueIdentifier,     userIdFromToken)
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Input parameters value for BCM.SRA_PublishSiteAssessment procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : siteRiskAssessmentData               = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_PublishSiteAssessment").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Output parameters value of BCM.SRA_PublishSiteAssessment procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Input parameters value for BCM.SRA_PublishSiteAssessment procedure." );
				logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : siteRiskAssessmentData             = " + JSON.stringify(siteRiskAssessmentData || null));
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : AccountGUID           = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Execution end. : Error details : " + error.stack );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Input parameters value for BCM.SRA_PublishSiteAssessment procedure." );
			logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : siteRiskAssessmentData                = " + JSON.stringify(siteRiskAssessmentData || null));
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : publishSiteAssessment : Execution end. : Error details : " + error.stack );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will upload crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
     async uploadRiskEvidence(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Execution started.");
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

            request.input('FileName',               MSSQL.NVarChar,     siteRiskAssessmentData.OriginalFileName);
            request.input('FileType',               MSSQL.NVarChar,     siteRiskAssessmentData.FileType)
            request.input('FileContent',            MSSQL.VarBinary,    siteRiskAssessmentData.FileContent);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Input parameters value for BCM.SRA_UploadRiskAssessmentEvidences procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileName = "           + siteRiskAssessmentData.OriginalFileName);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileType = "           + siteRiskAssessmentData.FileType);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileName = "           + siteRiskAssessmentData.FileName);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_UploadRiskAssessmentEvidences").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Output parameters value of BCM.SRA_UploadRiskAssessmentEvidences procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Input parameters value for BCM.SRA_UploadRiskAssessmentEvidences procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileName = "           + siteRiskAssessmentData.OriginalFileName);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileType = "           + siteRiskAssessmentData.FileType);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileName = "           + siteRiskAssessmentData.FileName);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : UserName     = "       + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Input parameters value for BCM.SRA_UploadRiskAssessmentEvidences procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileName = "           + siteRiskAssessmentData.OriginalFileName);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileType = "           + siteRiskAssessmentData.FileType);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : FileName = "           + siteRiskAssessmentData.FileName);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : UserName     = "       + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : uploadRiskEvidence : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will download crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteRiskAssessmentData
     * @returns
     */
      async downloadRiskEvidence(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Execution started.");
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


            request.input('FileContentID',          MSSQL.BigInt,      siteRiskAssessmentData.fileContentId);
            request.input("UserName",               MSSQL.NVarChar,    userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Input parameters value for BCM.SRA_DownloadRiskAssessmentEvidences procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : FileContentID = "    + siteRiskAssessmentData.fileContentId);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : UserName     = "     + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.SRA_DownloadRiskAssessmentEvidences").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Output parameters value of BCM.SRA_DownloadRiskAssessmentEvidences procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Input parameters value for BCM.SRA_DownloadRiskAssessmentEvidences procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : FileContentID = "    + siteRiskAssessmentData.fileContentId);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : UserName     = "    + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Input parameters value for BCM.SRA_DownloadRiskAssessmentEvidences procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : FileContentID = "    + siteRiskAssessmentData.fileContentId);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : UserName     = "    + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : siteRiskAssessmentDB : downloadRiskEvidence : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
    
    stop() {}
};
