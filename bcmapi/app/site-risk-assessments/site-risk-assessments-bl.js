const MESSAGE_FILE_OBJ        = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ       = require("../../utility/constants/constant.js");
const APP_VALIDATOR           = require("../../utility/app-validator.js");
const ENUMS_OBJ               = require("../../utility/enums/enums.js")
const COMPUTATION_OBJ         = require("../../utility/computations.js")
const SITE_RISK_ASSESSMENT_DB = require("../../data-access/site-risk-assessments-db.js");
const { logger }              = require("../../utility/log-manager/log-manager.js");
const EMAIL_NOTIFICATION      = require("../../utility/email-notification.js");
const APP_CONFIG_FILE_OBJ     = require('../../config/app-config.js');
const GENERIC_SRA             = require('../../config/email-template/generic-sra-template.js');
const SRA_NOTIFY_TEMPLATE     = require('../../config/email-template/generic-sra-notify-template.js');
const UTILITY_APP             = require("../../utility/utility.js");
const INAPP_DB                = require("../../data-access/inApp-notification-db.js");
const FILE_TYPE               = require('file-type');
const path                    = require('path');
const fileSystem              = require('fs');

var SiteRiskAssessmentsBLClassInstance      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var siteRiskAssessmentDB                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject                      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var computationUtilityObj                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailNotificationObject                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class SiteRiskAssessmentsBl {
    constructor() {
        siteRiskAssessmentDB        = new SITE_RISK_ASSESSMENT_DB();
        appValidatorObject          = new APP_VALIDATOR();
        computationUtilityObj       = new COMPUTATION_OBJ();
        emailNotificationObject     = new EMAIL_NOTIFICATION();
        utilityAppObject            = new UTILITY_APP();
        inAppNotificationDbObject   = new INAPP_DB()
    }

    start() { }

    /** 
    * This function will fetch the particalur risk details of a site from the dataBase 
    */
    async getRiskData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getRiskData : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.threatRiskId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.threatRiskId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getRiskData : Execution end. : threatRiskId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_RISK_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getRiskData : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.scheduleRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.scheduleRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getRiskData : Execution end. : scheduleRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const GET_RISK_DATA_DB_RESPONSE = await siteRiskAssessmentDB.getRiskData(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : GET_RISK_DATA_DB_RESPONSE : ' + JSON.stringify(GET_RISK_DATA_DB_RESPONSE));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. :  GET_RISK_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. : Error details :' + GET_RISK_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. : Error details : ' + GET_RISK_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const GET_INFO_DB_RESPONSE = await siteRiskAssessmentDB.getInfoForSaveResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : GET_INFO_DB_RESPONSE : ' + JSON.stringify(GET_INFO_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. :  GET_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. : Error details :' + GET_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. : Error details : ' + GET_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_RISK_DATA = await getFormatRiskData(userIdFromToken, GET_RISK_DATA_DB_RESPONSE,GET_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : FORMAT_GET_RISK_DATA : ' + JSON.stringify(FORMAT_GET_RISK_DATA));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_RISK_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_RISK_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. :  FORMAT_GET_RISK_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_RISK_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will save response against particular risk for a site
    */
    async saveRiskResponse(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sraRiskData             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {
            siteRiskAssessmentData  = request.body.data;
            sraRiskData = {
                "scheduleRiskAssessmentId"  : siteRiskAssessmentData.scheduleRiskAssessmentId,
                "threatRiskId"              : siteRiskAssessmentData.threatRiskId,
                "siteRiskAssessmentId"      : siteRiskAssessmentData.siteRiskAssessmentId
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sraRiskData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sraRiskData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : sraRiskData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution started.');

            /**
             * Input Validation : Start	
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.scheduleRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.scheduleRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : scheduleRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.threatRiskId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.threatRiskId ) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : threatRiskId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_RISK_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId ) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if ((siteRiskAssessmentData.controls.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.controlEffectivenessId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.controlEffectivenessId)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : controlEffectivenessId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CONTROL_EFFECTIVENESS_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.inherentLikelihoodRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.inherentLikelihoodRatingId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : inherentLikelihoodRatingId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INHERENT_LIKELIHOOD_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.inherentImpactRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.inherentImpactRatingId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : inherentImpactRatingId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INHERENT_IMPACT_ID_NULL_EMPTY));
            }
            // Note: residualLikelihoodRatingId and residualImpactRatingId are now optional
            // as residual risk is derived from the matrix (OverallInherentRiskRating + ControlEffectiveness)
            // These fields are kept for backward compatibility but no longer mandatory
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.overallInherentRiskRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.overallInherentRiskRatingId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : overallInherentRiskRatingId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OVERALL_INHERENT_RATING_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.overallResidualRiskRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.overallResidualRiskRatingId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : overallResidualRiskRatingId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OVERALL_RESIDUAL_RATING_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskTreatmentStrategyId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskTreatmentStrategyId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : riskTreatmentStrategyId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.STRATEGY_ID_NULL_EMPTY));
            }
            if (siteRiskAssessmentData.riskTreatmentStrategyId == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&  (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.actionPlans || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.actionPlans || (siteRiskAssessmentData.actionPlans).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : actionPlans is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_PLANS_NULL_EMPTY));
            }
            
            // Action Plans - Date Validation - START
            const GET_RISK_DATA_DB_RESPONSE = await siteRiskAssessmentDB.getRiskData(userIdFromToken, userNameFromToken, sraRiskData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : GET_RISK_DATA_DB_RESPONSE : ' + JSON.stringify(GET_RISK_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. :  GET_RISK_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Error details :' + GET_RISK_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Error details : ' + GET_RISK_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (GET_RISK_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && GET_RISK_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                const sraRiskDetails = GET_RISK_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                let existingActionPlans = sraRiskDetails.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(sraRiskDetails.ActionPlans) : [];
                for (let actionPlanObj of Object.values(siteRiskAssessmentData.actionPlans)) {
                    if (actionPlanObj.actionID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, actionPlanObj.startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, actionPlanObj.targetDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                        if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                        }
                    } else {
                        let matchedActionPlan = existingActionPlans.find(x => Number(x.RiskActionPlanID) == Number(actionPlanObj.actionID));

                        let startDate = matchedActionPlan.StartDate != actionPlanObj.startDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] ? actionPlanObj.startDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : matchedActionPlan.StartDate;
                        let endDate = matchedActionPlan.TargetDate != actionPlanObj.targetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] ? actionPlanObj.targetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : matchedActionPlan.TargetDate;

                        // Checking requested date and time with existing date and time
                        if (matchedActionPlan.StartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != actionPlanObj.startDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] || matchedActionPlan.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != actionPlanObj.targetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]) {
                            let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, endDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, matchedActionPlan.StartDate != actionPlanObj.startDate.split('T')[0], matchedActionPlan.TargetDate != actionPlanObj.targetDate.split('T')[0], CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                            if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                            }
                        }
                    }
                }
            }
            // Action Plans - Date Validation - END
            
            if (siteRiskAssessmentData.riskTreatmentStrategyId == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskTolerateDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskTolerateDescription || appValidatorObject.isStringEmpty((siteRiskAssessmentData.riskTolerateDescription).trim()))) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : riskTolerateDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TOLERATE_DESCRIPTION_NULL_EMPTY));
            }
        
            /**
             * Input Validation : End
             */

            const SAVE_RISK_DB_RESPONSE =  await siteRiskAssessmentDB.saveRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : SAVE_RISK_DB_RESPONSE : ' + JSON.stringify(SAVE_RISK_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_RISK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_RISK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. :  SAVE_RISK_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RISK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Error details :' + SAVE_RISK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RISK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_RISK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Error details : ' + SAVE_RISK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const GET_INFO_DB_RESPONSE = await siteRiskAssessmentDB.getInfoForSaveResponse(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : GET_INFO_DB_RESPONSE : ' + JSON.stringify(GET_INFO_DB_RESPONSE));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. :  GET_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Error details :' + GET_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Error details : ' + GET_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_GET_RISK_DATA = await getFormatRiskData(userIdFromToken, SAVE_RISK_DB_RESPONSE,GET_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : FORMAT_GET_RISK_DATA : ' + JSON.stringify(FORMAT_GET_RISK_DATA));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_RISK_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_RISK_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. :  FORMAT_GET_RISK_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
             * Email Logic : Start
             */
            if (SAVE_RISK_DB_RESPONSE.recordset.length > CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
                let EMAIL_DETAILS = SAVE_RISK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
                if(EMAIL_DETAILS.length) {
                    try {                    
                        let emailTemplateObj = {
                            Subject : GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Subject,
                            Body    : GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Body
                        };
                        let toccEmails = {
                            "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersEmailIDs),
                            "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCEmailID+ ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminEmailID)
                        };
                       
                        let templateMaster = {                     
                            AssessmentCode     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode,
                            RISKTRAC_WEB_URL   : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                            AssessmentName     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentName,                                                           
                            StartDate          : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                            EndDate            : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate),
                            subject_text       : "Site Risk Assessment has been moved to In-progress.",
                            body_text          : "Site Risk Assessment has been moved to In-progress.",
                            Note               : ""
                        };
                        let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : emailData   : ' + JSON.stringify(emailData || null));

                        let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersUserGUIDs
                                            + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminUserGUID)
    
                        let inappDetails     = {
                            inAppContent     : 'Site Risk Assessment has been moved to In-progress. Assessment code - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route, 
                            recepientUserID  : inAppUserList,
                            subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                        }
    
                        let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);             

                    } catch(error) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                    }
                }                
            }
            /**
             * Email Logic : End
             */

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_RISK_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : saveRiskResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will submit the risk response for the particular site master in the database
    */
    async submitRiskResponse(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.scheduleRiskAssessmentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.scheduleRiskAssessmentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : scheduleRiskAssessmentIds is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.reviewComment || appValidatorObject.isStringEmpty((siteRiskAssessmentData.reviewComment).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const SUBMIT_SITE_RISK_DB_RESPONSE = await siteRiskAssessmentDB.submitRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : SUBMIT_SITE_RISK_DB_RESPONSE : ' + JSON.stringify(SUBMIT_SITE_RISK_DB_RESPONSE));
        
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SUBMIT_SITE_RISK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SUBMIT_SITE_RISK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_SITE_RISK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : Error details :' + SUBMIT_SITE_RISK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_SITE_RISK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SUBMIT_SITE_RISK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : Error details : ' + SUBMIT_SITE_RISK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_RISK_DATA = await getFormatRiskData(userIdFromToken, SUBMIT_SITE_RISK_DB_RESPONSE, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : FORMAT_GET_RISK_DATA : ' + JSON.stringify(FORMAT_GET_RISK_DATA));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_RISK_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_RISK_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. :  FORMAT_GET_RISK_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
             * Email Logic : Start
             */

            let RiskOwnerName   = SUBMIT_SITE_RISK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].filter(n => n.RiskOwnerID == userIdFromToken)[0].RiskOwnerName 
            if (SUBMIT_SITE_RISK_DB_RESPONSE.recordset.length > CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
                let EMAIL_DETAILS   = SUBMIT_SITE_RISK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
                
                if (EMAIL_DETAILS.length) {
                    try {                           
                        let RiskTitleArr = EMAIL_DETAILS.map((item, index) => ({ SlNo: index + 1, RiskTitle: item.RiskTitle }));
                        let emailTemplateObj = {
                            Subject : SRA_NOTIFY_TEMPLATE.NOTIFY_SRA["NOTIFY_SRA_TEMPLATE"].Subject,
                            Body    : SRA_NOTIFY_TEMPLATE.NOTIFY_SRA["NOTIFY_SRA_TEMPLATE"].Body
                        };
                        let toccEmails = {
                            "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs),
                            "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersEmailIDs + ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCEmailID+ ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminEmailID)
                        };
                      
                        let templateMaster = {                     
                            AssessmentCode     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode,
                            RISKTRAC_WEB_URL   : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                            AssessmentName     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentName,                                    
                            StartDate          : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                            EndDate            : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate),            
                            subject_text       : "",
                            body_text          : "",
                            table_data         : `Risks details are: <br>
                                                    <table border="1" cellpadding="5" cellspacing="0">
                                                        <tr>
                                                            <th style="width: 8%;">Sl No.</th>
                                                            <th style="width: 92%;">Risk Title</th>
                                                        </tr>
                                                        ${RiskTitleArr.map(risk => `<tr><td style="text-align: center;">${risk.SlNo}</td><td>${risk.RiskTitle}</td></tr>`).join('')}
                                                    </table>`, 
                        };
                        
                        if (EMAIL_DETAILS.every(ob =>ob.SpecialNote == "ScheduleRiskAssessment - Submit")) {   
                            templateMaster.subject_text       = "Site Risk Assessment has been submitted for review.",
                            templateMaster.body_text          = "Site Risk Assessment has been submitted. Requesting you to review the same."
                        } else {
                            templateMaster.subject_text       = "Site Risk Assessment has been re-submitted for review.",
                            templateMaster.body_text          = "Site Risk Assessment has been re-submitted. Requesting you to review the same."
                        }
    
                        let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : emailData   : ' + JSON.stringify(emailData || null));
                        
                        let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersUserGUIDs
                                            + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminUserGUID)
    
                        let inappDetails     = {
                            inAppContent     : templateMaster.subject_text +` By risk owner - ${RiskOwnerName}.` + ' Assessment code - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route, 
                            recepientUserID  : inAppUserList,
                            subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                        }
    
                        let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     

                    } catch(error) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                    }
                }
            }    
            /**
             * Email Logic : Start
             */     
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_RISK_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /** 
     * This function will fetch the site risk assessments lists data from the dataBase 
     */
    async getSiteRiskAssessmentsList(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;

        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : Execution started.');

            const GET_SITE_RISK_LIST_DB_RESPONSE = await siteRiskAssessmentDB.getSiteRiskAssessmentsList(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : GET_SITE_RISK_LIST_DB_RESPONSE : ' + JSON.stringify(GET_SITE_RISK_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SITE_RISK_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SITE_RISK_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : Execution end. :  GET_SITE_RISK_LIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : Execution end. : Error details :' + GET_SITE_RISK_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_RISK_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : Execution end. : Error details : ' + GET_SITE_RISK_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_SITE_RISK_LIST_MASTER = await getFormatSiteRiskAssessmentsList(userIdFromToken, GET_SITE_RISK_LIST_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : FORMAT_GET_SITE_RISK_LIST_MASTER : ' + JSON.stringify(FORMAT_GET_SITE_RISK_LIST_MASTER));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_RISK_LIST_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_RISK_LIST_MASTER) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : Execution end. :  FORMAT_GET_SITE_RISK_LIST_MASTER response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
        
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_SITE_RISK_LIST_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
     * This function will fetch the site risk assessments info data from the dataBase 
     */
    async getSiteRiskAssessmentsInfo(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : Execution started.');

            const GET_SITE_RISK_INFO_DB_RESPONSE = await siteRiskAssessmentDB.getSiteRiskAssessmentsInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : GET_SITE_RISK_INFO_DB_RESPONSE : ' + JSON.stringify(GET_SITE_RISK_INFO_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SITE_RISK_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SITE_RISK_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : Execution end. :  GET_SITE_RISK_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : Execution end. : Error details :' + GET_SITE_RISK_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_RISK_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : Execution end. : Error details : ' + GET_SITE_RISK_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_SITE_RISK_INFO_MASTER = await getFormatSiteRiskAssessmentsInfo(userIdFromToken,GET_SITE_RISK_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : FORMAT_GET_SITE_RISK_INFO_MASTER : ' + JSON.stringify(FORMAT_GET_SITE_RISK_INFO_MASTER));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_RISK_INFO_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_RISK_INFO_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : Execution end. :  FORMAT_GET_SITE_RISK_INFO_MASTER response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
        
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_SITE_RISK_INFO_MASTER));
        } catch (error) {

            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
     * This function will add a new Site Risk Assessment 
     */
    async addSiteRiskAssessment(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let dateTimeNotValid        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution started.');

            /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.SiteID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.SiteID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : SiteID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.SiteName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.SiteName || appValidatorObject.isStringEmpty((siteRiskAssessmentData.SiteName).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : SiteName is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_NAME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.AssessmentName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.AssessmentName || appValidatorObject.isStringEmpty((siteRiskAssessmentData.AssessmentName).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : AssessmentName is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_NAME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.AssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.AssessmentCode || appValidatorObject.isStringEmpty((siteRiskAssessmentData.AssessmentCode).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : AssessmentCode is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_CODE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.StartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.StartDate || appValidatorObject.isStringEmpty((siteRiskAssessmentData.StartDate).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : StartDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.START_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.EndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.EndDate || appValidatorObject.isStringEmpty((siteRiskAssessmentData.EndDate).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : EndDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.END_DATE_NULL_EMPTY));
            }
            
            // Date Validation - START
            dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, siteRiskAssessmentData.StartDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, siteRiskAssessmentData.EndDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
            if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment  : Execution end. :' + dateTimeNotValid.message);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
            }
            // Date Validation - END

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.Risks || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.Risks || (siteRiskAssessmentData.Risks).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : Risks is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISKS_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE  = await siteRiskAssessmentDB.addSiteRiskAssessment(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken);
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE : ' + JSON.stringify(ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. :  ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : Error details :' + ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : Error details : ' + ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_ADD_SITE_RISK_ASSESSMENT = await getFormatSiteRiskAssessmentsList(userIdFromToken, ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : FORMAT_ADD_SITE_RISK_ASSESSMENT : ' + JSON.stringify(FORMAT_ADD_SITE_RISK_ASSESSMENT));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_SITE_RISK_ASSESSMENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_SITE_RISK_ASSESSMENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. :  FORMAT_ADD_SITE_RISK_ASSESSMENT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
             * Email Logic : Start
             */
            let EMAIL_DETAILS = ADD_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];
            if (EMAIL_DETAILS.length) {
                try {
                    let emailTemplateObj = {
                        Subject: GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Subject,
                        Body: GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Body
                    }
                    let toccEmails = {
                        "TOEmail": utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersEmailIDs),
                        "CCEmail": utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminEmailID)
                    }

                    let templateMaster = {
                        AssessmentCode      : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode,
                        RISKTRAC_WEB_URL    : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        AssessmentName      : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentName,
                        StartDate           : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate             : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate),
                        subject_text        : "Site Risk Assessment has been created.",
                        body_text           : "Site Risk Assessment has been created.",
                        Note                : ""
                    };

                    const stDate = new Date(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate);
                    if (stDate > new Date()) {
                        templateMaster.Note = "Note: The Assessment will be visible to Risk Owner once Start date is met.";
                    }

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : emailData   : ' + JSON.stringify(emailData || null));

                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersUserGUIDs
                                        + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminUserGUID)

                    let inappDetails     = {
                        inAppContent     : 'Site Risk Assessment has been created. Assessment code - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route, 
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);             

                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            /**
            * Email Logic : Start
            */

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ADD_SITE_RISK_ASSESSMENT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addSiteRiskAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update a single Site Risk Assessment 
     */
    async updateSiteRiskAssessment(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sraDetailsData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let dateTimeNotValid        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData = request.body.data;
            sraDetailsData = {
                "siteRiskAssessmentId"  : request.body.data.SiteRiskAssessmentID
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sraDetailsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sraDetailsData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : sraDetailsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution started.');

            
            /**
             * Input Validation : Start
            */
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.SiteRiskAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.SiteRiskAssessmentID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : SiteRiskAssessmentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.StartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.StartDate || appValidatorObject.isStringEmpty((siteRiskAssessmentData.StartDate).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : StartDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.START_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.EndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.EndDate || appValidatorObject.isStringEmpty((siteRiskAssessmentData.EndDate).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : EndDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.END_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.Risks || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.Risks || (siteRiskAssessmentData.Risks).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Risks is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISKS_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            // Logic for Start Date and End Date Validation - START
            const GET_SITE_RISK_ASSESSMENT_DB_RESPONSE = await siteRiskAssessmentDB.getSiteRiskAssessmentsDetails(userIdFromToken, userNameFromToken, sraDetailsData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : GET_SITE_RISK_ASSESSMENT_DB_RESPONSE : ' + JSON.stringify(GET_SITE_RISK_ASSESSMENT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SITE_RISK_ASSESSMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SITE_RISK_ASSESSMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. :  GET_SITE_RISK_ASSESSMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Error details :' + GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Error details : ' + GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_SITE_RISK_ASSESSMENT_DB_RESPONSE));
            }

            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                const siteAssessmentDetails = GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                let previousStartDate = siteAssessmentDetails.StartDate.toISOString();
                let previousEndDate = siteAssessmentDetails.EndDate[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].toISOString();

                let startDate = previousStartDate != siteRiskAssessmentData.StartDate ? siteRiskAssessmentData.StartDate : previousStartDate;
                let endDate = previousEndDate != siteRiskAssessmentData.EndDate ? siteRiskAssessmentData.EndDate : previousEndDate;

                // Checking requested date and time with existing date and time
                if (previousStartDate != siteRiskAssessmentData.StartDate || previousEndDate.date != siteRiskAssessmentData.EndDate) {

                    let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, endDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, previousStartDate != siteRiskAssessmentData.StartDate, previousEndDate != siteRiskAssessmentData.EndDate, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                    if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution end. :' + dateTimeNotValid.message);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
                    }
                }
            }

            // for updating a site risk assessment
            const UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE = await siteRiskAssessmentDB.updateSiteRiskAssessment(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE : ' + JSON.stringify(UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. :  UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Error details :' + UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Error details : ' + UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
             * Email Logic : Start
             */
            let EMAIL_DETAILS = UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            if (EMAIL_DETAILS.length) {
                try {                    
                    let emailTemplateObj = {
                        Subject : GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Subject,
                        Body    : GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Body
                    }; 
                    let toccEmails = {
                        "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersEmailIDs),
                        "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs+ ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCEmailID+ ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminEmailID)
                    };
                
                    let templateMaster = {                     
                        AssessmentCode     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode,
                        RISKTRAC_WEB_URL   : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        AssessmentName     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentName,
                        subject_text       : "Site Risk Assessment has been updated.",
                        body_text          : "Site Risk Assessment has been updated.",
                        StartDate          : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate            : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate),
                        Note               : ""
                    };

                    const stDate = new Date(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate); 
                    if (stDate > new Date()) {
                        templateMaster.Note = "Note: The Assessment will be visible to Risk Owner once Start date is met.";
                    }

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : emailData   : ' + JSON.stringify(emailData || null));

                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersUserGUIDs
                                        + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminUserGUID)

                    let inappDetails     = {
                        inAppContent     : 'Site Risk Assessment has been updated. Assessment code - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route, 
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                    }
        
                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);             
        
                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            /**
             * Email Logic : End
            */

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, UPDATE_SITE_RISK_ASSESSMENT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateSiteRiskAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will delete a single Site Risk Assessment 
     */
    async deleteSiteRiskAssessment(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution started.');

             /**
             * Input Validation : Start
            */
           
             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.SiteRiskAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.SiteRiskAssessmentID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. : SiteRiskAssessmentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */
            const DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE = await siteRiskAssessmentDB.deleteSiteRiskAssessment(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE : ' + JSON.stringify(DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. :  DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. : Error details :' + DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. : Error details : ' + DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_DELETE_SITE_RISK_ASSESSMENT = await getFormatSiteRiskAssessmentsList(userIdFromToken, DELETE_SITE_RISK_ASSESSMENT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : FORMAT_DELETE_SITE_RISK_ASSESSMENT : ' + JSON.stringify(FORMAT_DELETE_SITE_RISK_ASSESSMENT));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DELETE_SITE_RISK_ASSESSMENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DELETE_SITE_RISK_ASSESSMENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. :  FORMAT_DELETE_SITE_RISK_ASSESSMENT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_DELETE_SITE_RISK_ASSESSMENT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteSiteRiskAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    
    /**
    * This function will add threat master data into database
    */
    async addNewCustomThreat(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken      = request.body.refreshedToken;
        userIdFromToken     = request.body.userIdFromToken;
        userNameFromToken   = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData      = request.body.data;
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution started.');

            /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskTitle || appValidatorObject.isStringEmpty((siteRiskAssessmentData.riskTitle).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : riskTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskDescription || appValidatorObject.isStringEmpty((siteRiskAssessmentData.riskDescription).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : riskDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.threatCategoryId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.threatCategoryId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : threat CategoryID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_CATEGORY_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.impacts || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.impacts || (siteRiskAssessmentData.impacts).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : impacts is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IMPACTS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskOwnerId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskOwnerId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : riskOwnerId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_OWNER_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const ADD_RISK_DB_RESPONSE = await siteRiskAssessmentDB.addNewCustomThreat(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addNewCustomThreat : ADD_RISK_DB_RESPONSE : ' + JSON.stringify(ADD_RISK_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_RISK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_RISK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_RISK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : Error details :' + ADD_RISK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_RISK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_RISK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : Error details : ' + ADD_RISK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
    
        
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, ADD_RISK_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : addNewCustomThreat : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will add threat master data into database
    */
    async updateNewCustomThreat(request, response) {
        let refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken      = request.body.refreshedToken;
        userIdFromToken     = request.body.userIdFromToken;
        userNameFromToken   = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData      = request.body.data;
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution started.');

            /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : riskId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskTitle || appValidatorObject.isStringEmpty((siteRiskAssessmentData.riskTitle).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : riskTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskDescription || appValidatorObject.isStringEmpty((siteRiskAssessmentData.riskDescription).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : riskDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.threatCategoryId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.threatCategoryId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : threat CategoryID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_CATEGORY_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.impacts || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.impacts || (siteRiskAssessmentData.impacts).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : impacts is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IMPACTS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskOwnerId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskOwnerId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : riskOwnerId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_OWNER_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const UPDATE_RISK_DB_RESPONSE = await siteRiskAssessmentDB.updateNewCustomThreat(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateNewCustomThreat : UPDATE_RISK_DB_RESPONSE : ' + JSON.stringify(UPDATE_RISK_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_RISK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_RISK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_RISK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : Error details :' + UPDATE_RISK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_RISK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_RISK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : Error details : ' + UPDATE_RISK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
        
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA, UPDATE_RISK_DB_RESPONSE));
        
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : updateNewCustomThreat : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }
    
    async getSiteRiskAssessmentsDetails(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {

            siteRiskAssessmentData  = request.body.data;
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
            */

            const GET_SITE_RISK_ASSESSMENT_DB_RESPONSE = await siteRiskAssessmentDB.getSiteRiskAssessmentsDetails(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : GET_SITE_RISK_ASSESSMENT_DB_RESPONSE : ' + JSON.stringify(GET_SITE_RISK_ASSESSMENT_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SITE_RISK_ASSESSMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SITE_RISK_ASSESSMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. :  GET_SITE_RISK_ASSESSMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. : Error details :' + GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. : Error details : ' + GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if (GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_SITE_RISK_ASSESSMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_SITE_RISK_ASSESSMENT_DB_RESPONSE));
            }

            const FORMAT_GET_RISK_DATA = await getFormatSiteRiskAssessmentData(userIdFromToken, GET_SITE_RISK_ASSESSMENT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : FORMAT_GET_RISK_DATA : ' + JSON.stringify(FORMAT_GET_RISK_DATA));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_RISK_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_RISK_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. :  FORMAT_GET_RISK_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_RISK_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    async reviewRiskResponse(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData      = request.body.data;
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution started.');

            /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.scheduleRiskAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.scheduleRiskAssessmentID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : schedule assessment risk id cannot be null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_ASSESSMENT_RISK_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : SiteRiskAssessmentId cannot be null,empty or undefined.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.reviewStatus || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.reviewStatus) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : review status cannot be null,empty or undefined.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_STATUS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskReviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskReviewComment || appValidatorObject.isStringEmpty((siteRiskAssessmentData.riskReviewComment).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : risk review comment canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_REVIEW_COMMENT_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const UPDATE_RISK_DB_RESPONSE = await siteRiskAssessmentDB.reviewRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : reviewRiskResponse : UPDATE_RISK_DB_RESPONSE : ' + JSON.stringify(UPDATE_RISK_DB_RESPONSE));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_RISK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_RISK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_RISK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : Error details :' + UPDATE_RISK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_RISK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_RISK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : Error details : ' + UPDATE_RISK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
                    
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA, UPDATE_RISK_DB_RESPONSE));
            
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : reviewRiskResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will approve reject the data filled by RO
    */
    async submitReviewRiskResponse(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData      = request.body.data;
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : SiteRiskAssessmentId cannot be null,empty or undefined.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.reviewComment || appValidatorObject.isStringEmpty((siteRiskAssessmentData.reviewComment).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : risk review comment canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_REVIEW_COMMENT_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const UPDATE_RISK_DB_RESPONSE   = await siteRiskAssessmentDB.submitReviewRiskResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : UPDATE_RISK_DB_RESPONSE : ' + JSON.stringify(UPDATE_RISK_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_RISK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_RISK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_RISK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : Error details :' + UPDATE_RISK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_RISK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_RISK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : Error details : ' + UPDATE_RISK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }              
            
            /**
             * Email Logic : Start
             */
            let EMAIL_DETAILS =  UPDATE_RISK_DB_RESPONSE.recordset;
            
            if (EMAIL_DETAILS.length) {
                try {                                                    
                    let MERGED_EMAIL_DATA    = EMAIL_DETAILS.flat();  
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : MERGED_EMAIL_DATA   : ' + JSON.stringify(MERGED_EMAIL_DATA));

                    let emailTemplateObj = {
                        Subject : SRA_NOTIFY_TEMPLATE.NOTIFY_SRA["NOTIFY_SRA_TEMPLATE"].Subject,
                        Body    : SRA_NOTIFY_TEMPLATE.NOTIFY_SRA["NOTIFY_SRA_TEMPLATE"].Body
                    }; 
                    let toccEmails = {
                        "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersEmailIDs),
                        "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + ","+ MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCEmailID+ ","+ MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminEmailID)
                    };
                 
                    let RiskTitleArr =  MERGED_EMAIL_DATA.map((item, index) => ({ SlNo: index + 1, RiskTitle: item.RiskTitle, RiskStatus: item.SpecialNote.split('-')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] }));
                    
                    let templateMaster = {                     
                        AssessmentCode      : MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode,
                        RISKTRAC_WEB_URL    : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        AssessmentName      : MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentName,                                   
                        StartDate           : utilityAppObject.formatDate(userIdFromToken, MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate             : utilityAppObject.formatDate(userIdFromToken, MERGED_EMAIL_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate),
                        subject_text        : "Site Risk Assessment has been reviewed.",                        
                        body_text           : "Site Risk Assessment has been reviewed.",
                        table_data          : `Reviewed risks are : <br>
                                                    <table border="1" cellpadding="5" cellspacing="0">
                                                        <tr>
                                                            <th style="width: 8%;">Sl. No.</th>
                                                            <th style="width: 80%;">Risk Title</th>
                                                            <th style="width: 12%;">Status</th>
                                                        </tr>
                                                        ${RiskTitleArr.map(risk => `<tr><td style="text-align: center;">${risk.SlNo}</td><td>${risk.RiskTitle}</td><td style="text-align: center;">${risk.RiskStatus}</td></tr>`).join('')}
                                                    </table>`
                    };
                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : emailData   : ' + JSON.stringify(emailData || null));

                    //Grouped based on risk owner with approved/rejected count
                    const FORMATTED_INAPP_DATA = MERGED_EMAIL_DATA.reduce((acc, assessment) => {
                        let existing = acc.find(item => item.RiskOwnerID === assessment.RiskOwnerID);
                        if (!existing) {
                            existing = {
                                "AssessmentCode"             : assessment.AssessmentCode,
                                "AssessmentName"             : assessment.AssessmentName,
                                "ReviewerName"               : assessment.ReviewerName,
                                "BCMMangerUsersUserGUIDs"    : assessment.BCMMangerUsersUserGUIDs,
                                "RiskOwnersUserGUIDs"        : assessment.RiskOwnersUserGUIDs,
                                "SiteBCCUserGUID"            : assessment.SiteBCCUserGUID,
                                "SiteAdminUserGUID"          : assessment.SiteAdminUserGUID,
                                "RiskOwnerID"                : assessment.RiskOwnerID,
                                "RiskOwnerName"              : assessment.RiskOwnerName,
                                "Approved"                   : 0,
                                "Rejected"                   : 0
                            };
                            acc.push(existing);
                        }

                        if (assessment.SpecialNote.includes("Approved")) {
                            existing.Approved += 1;
                        } else if (assessment.SpecialNote.includes("Rejected")) {
                            existing.Rejected += 1;
                        }
                        return acc;
                    }, []);

                    for (const obj of FORMATTED_INAPP_DATA) {
                        let inAppUserList = utilityAppObject.removeDuplicateGUIDs(obj.BCMMangerUsersUserGUIDs + "," +obj.RiskOwnerID + "," + obj.SiteBCCUserGUID + "," + obj.SiteAdminUserGUID);
                        let InAppMessage = `Site Risk Assessment has been reviewed for assessment (code -"${obj.AssessmentCode}") for Risk Owner - "${obj.RiskOwnerName}", ("Approved" risk count- ${obj.Approved}, "Rejected" risk count- ${obj.Rejected})`
                        let inappDetails = {
                            inAppContent    : InAppMessage + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route,
                            recepientUserID : inAppUserList,
                            subModuleID     : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                        };
                
                        try {
                            const InAPPResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                        } catch (error) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ': SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : Got unhandled error. While sending InApp : Error Detail : ' + error);
                        }
                    }

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ': SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            /**
             * Email Logic : End
             */
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA, UPDATE_RISK_DB_RESPONSE));
        
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : submitReviewRiskResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    async getRiskAssessmentActionTrail(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. : siteRiskAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
            */

            const GET_ACTION_TRAIL_DB_RESPONSE = await siteRiskAssessmentDB.getRiskAssessmentActionTrail(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : GET_ACTION_TRAIL_DB_RESPONSE : ' + JSON.stringify(GET_ACTION_TRAIL_DB_RESPONSE));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ACTION_TRAIL_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ACTION_TRAIL_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. :  GET_ACTION_TRAIL_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_TRAIL_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. : Error details :' + GET_ACTION_TRAIL_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_TRAIL_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_ACTION_TRAIL_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. : Error details : ' + GET_ACTION_TRAIL_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if (GET_ACTION_TRAIL_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_ACTION_TRAIL_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_ACTION_TRAIL_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_ACTION_TRAIL_DB_RESPONSE));
            }

            const FORMAT_ACTION_TRAIL_DATA = await getFormatRiskAssessmentActionTrail(userIdFromToken, GET_ACTION_TRAIL_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : FORMAT_ACTION_TRAIL_DATA : ' + JSON.stringify(FORMAT_ACTION_TRAIL_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ACTION_TRAIL_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ACTION_TRAIL_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. :  FORMAT_ACTION_TRAIL_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ACTION_TRAIL_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getRiskAssessmentActionTrail : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the site risk assessments data for report from the dataBase 
    */
    async getSiteRiskAssessmentsForReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution started.');

             /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. : siteRiskAssessmentIds is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const GET_SRA_DB_RESPONSE = await siteRiskAssessmentDB.getSiteRiskAssessmentsForReport(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : GET_SRA_DB_RESPONSE : ' + JSON.stringify(GET_SRA_DB_RESPONSE));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SRA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SRA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. :  GET_SRA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SRA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. : Error details :' + GET_SRA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SRA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SRA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. : Error details : ' + GET_SRA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_SRA_REPORT_DATA = await getFormatSRAReportData(userIdFromToken, GET_SRA_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : FORMAT_GET_SRA_REPORT_DATA : ' + JSON.stringify(FORMAT_GET_SRA_REPORT_DATA));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SRA_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SRA_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. :  FORMAT_GET_SRA_REPORT_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_SRA_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsForReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

     /** 
    * This function will calcuate the overall risk ratings 
    */
     async getOverAllRiskRating(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskRating              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let inherentRiskRanges      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let residualRiskRanges      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
         accountGUIDFromToken       = request.body.accountGUIDFromToken;
        try {

            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution started.');

             /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.riskRatingType || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.riskRatingType) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : riskRatingType is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_RATING_TYPE_NULL_EMPTY));
            }

            //If risk rating type is Inherent
            if (siteRiskAssessmentData.riskRatingType == ENUMS_OBJ.RISK_RATING_TYPES.INHERENT_RISK_RATING){

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.inherentLikelihoodRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.inherentLikelihoodRatingId) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : inherentLikelihoodRatingId is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INHERENT_LIKELIHOOD_ID_NULL_EMPTY));
                }
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.inherentImpactRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.inherentImpactRatingId) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : inherentImpactRatingId is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INHERENT_IMPACT_ID_NULL_EMPTY));
                }
            }

            // If risk rating type is Residual (legacy formula-based)
            if (siteRiskAssessmentData.riskRatingType == ENUMS_OBJ.RISK_RATING_TYPES.RESIDUAL_RISK_RATING){
               
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.residualLikelihoodRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.residualLikelihoodRatingId) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : residualLikelihoodRatingId is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RESIDUAL_LIKELIHOOD_ID_NULL_EMPTY));
                }
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.residualImpactRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.residualImpactRatingId) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : residualImpactRatingId is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RESIDUAL_IMPACT_ID_NULL_EMPTY));
                }
            }

            // If risk rating type is Matrix-based Residual Risk (new approach)
            if (siteRiskAssessmentData.riskRatingType == ENUMS_OBJ.RISK_RATING_TYPES.MATRIX_RESIDUAL_RISK_RATING){

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.overallInherentRiskRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.overallInherentRiskRatingId) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : overallInherentRiskRatingId is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OVERALL_INHERENT_RATING_ID_NULL_EMPTY));
                }
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.controlEffectivenessId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.controlEffectivenessId) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : controlEffectivenessId is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CONTROL_EFFECTIVENESS_ID_NULL_EMPTY));
                }
            }

            /**
             * Input Validation : End
             * 
             */

            const GET_INFO_DB_RESPONSE = await siteRiskAssessmentDB.getInfoForSaveResponse(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : GET_SRA_DB_RESPONSE : ' + JSON.stringify(GET_INFO_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. :  GET_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : Error details :' + GET_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : Error details : ' + GET_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // fetching risk Ranges from the GET_INFO_DB_RESPONSE procedure
            
            inherentRiskRanges = GET_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
            residualRiskRanges = GET_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

            //Calculate Overall risk rating

            if (siteRiskAssessmentData.riskRatingType == ENUMS_OBJ.RISK_RATING_TYPES.INHERENT_RISK_RATING){

                let inherentLikelihoodRatingId  = siteRiskAssessmentData.inherentLikelihoodRatingId;
                let inherentImpactRatingId      = siteRiskAssessmentData.inherentImpactRatingId;

                riskRating = await computationUtilityObj.calcutateRiskRating(userIdFromToken,inherentLikelihoodRatingId,inherentImpactRatingId,inherentRiskRanges);

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskRating || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskRating) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. :  riskRating response is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                }
    
                const FORMAT_RISK_RATING = await getFormatRiskRating(userIdFromToken,riskRating,siteRiskAssessmentData.riskRatingType, accountGUIDFromToken);
  
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RISK_RATING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RISK_RATING) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. :  FORMAT_RISK_RATING  is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                }
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_RISK_RATING));
            
            } else if (siteRiskAssessmentData.riskRatingType == ENUMS_OBJ.RISK_RATING_TYPES.RESIDUAL_RISK_RATING){

                let residualLikelihoodRatingId  = siteRiskAssessmentData.residualLikelihoodRatingId;
                let residualImpactRatingId      = siteRiskAssessmentData.residualImpactRatingId;


                riskRating = await computationUtilityObj.calcutateRiskRating(userIdFromToken,residualLikelihoodRatingId,residualImpactRatingId,residualRiskRanges);

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskRating || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskRating) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. :  riskRating  is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                }

                const FORMAT_RISK_RATING = await getFormatRiskRating(userIdFromToken,riskRating,siteRiskAssessmentData.riskRatingType, accountGUIDFromToken);

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RISK_RATING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RISK_RATING) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. :  FORMAT_RISK_RATING  is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                }

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_RISK_RATING));

            } else if (siteRiskAssessmentData.riskRatingType == ENUMS_OBJ.RISK_RATING_TYPES.MATRIX_RESIDUAL_RISK_RATING) {

                // Matrix-based Residual Risk Derivation
                // Lookup: OverallInherentRiskRatingID + ControlEffectivenessID => OverallResidualRiskRatingID
                logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Matrix-based residual risk calculation.');

                let overallInherentRiskRatingId = siteRiskAssessmentData.overallInherentRiskRatingId;
                let controlEffectivenessId      = siteRiskAssessmentData.controlEffectivenessId;

                // Fetch residual risk matrix data from GET_INFO_DB_RESPONSE (recordset index 11 - SRA_ResidualRiskMatrix)
                let residualRiskMatrix = GET_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];

                logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : residualRiskMatrix length = ' + (residualRiskMatrix ? residualRiskMatrix.length : 0));

                let matrixResult = await computationUtilityObj.getResidualRiskFromMatrix(userIdFromToken, overallInherentRiskRatingId, controlEffectivenessId, residualRiskMatrix);

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == matrixResult || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == matrixResult) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : Matrix residual risk lookup returned no match.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                }

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, {
                    "OverAllRiskRating": [matrixResult]
                }));

            }else{

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_RISK_RATING_TYPE));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getOverAllRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
   
    /** 
    * This function will fetch the site risk assessments data for report draft from the dataBase 
    */
    async getSiteRiskAssessmentsDraftReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution started.');
            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : siteRiskAssessmentIds is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.threatRiskIDs || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.threatRiskIDs) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : threatRiskIDs is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_RISK_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.scheduleRiskAssessmentIDs || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.scheduleRiskAssessmentIDs) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : scheduleRiskAssessmentIDs is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End 
            */
            const GET_REPORT_DRAFT_DB_RESPONSE = await siteRiskAssessmentDB.getSiteRiskAssessmentForExportDraft(userIdFromToken,userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : GET_REPORT_DRAFT_DB_RESPONSE : ' + JSON.stringify(GET_REPORT_DRAFT_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_REPORT_DRAFT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_REPORT_DRAFT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. :  GET_REPORT_DRAFT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REPORT_DRAFT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : Error details :' + GET_REPORT_DRAFT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REPORT_DRAFT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_REPORT_DRAFT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : Error details : ' + GET_REPORT_DRAFT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_REPORT_DRAFT_DATA = await getFormatExportDraftReportData(userIdFromToken, GET_REPORT_DRAFT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : FORMAT_GET_REPORT_DRAFT_DATA : ' + JSON.stringify(FORMAT_GET_REPORT_DRAFT_DATA));
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_REPORT_DRAFT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_REPORT_DRAFT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. :  FORMAT_GET_REPORT_DRAFT_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_REPORT_DRAFT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getSiteRiskAssessmentsDraftReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the delete the custom threat from the dataBase 
    */
    async deleteCustomThreat(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {
            siteRiskAssessmentData      = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution started.');
            
            /**
             * Input Validation : Start
            */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.customThreatRiskID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.customThreatRiskID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. : customThreatRiskID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_RISK_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. : siteRiskAssessmentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            
            /**
            * Input Validation : End 
            */

            const DELETE_THREAT_DB_RESPONSE = await siteRiskAssessmentDB.deleteCustomThreat(userIdFromToken, userNameFromToken, siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteCustomThreat : DELETE_THREAT_DB_RESPONSE : ' + JSON.stringify(DELETE_THREAT_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_THREAT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_THREAT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_THREAT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. : Error details :' + DELETE_THREAT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_THREAT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_THREAT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. : Error details : ' + DELETE_THREAT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, DELETE_THREAT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : deleteCustomThreat : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will publish the assessment 
    */
    async publishSiteAssessment(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {
            let ACTION_ITEM_OWNER_EMAIL_DETAILS     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.siteRiskAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.siteRiskAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : SiteRiskAssessmentId cannot be null,empty or undefined.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_RISK_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.reviewComment || appValidatorObject.isStringEmpty((siteRiskAssessmentData.reviewComment).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : risk review comment canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_REVIEW_COMMENT_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const PUBLISH_SITE_DB_RESPONSE  = await siteRiskAssessmentDB.publishSiteAssessment(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : PUBLISH_SITE_DB_RESPONSE : ' + JSON.stringify(PUBLISH_SITE_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == PUBLISH_SITE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == PUBLISH_SITE_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (PUBLISH_SITE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : Error details :' + PUBLISH_SITE_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (PUBLISH_SITE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && PUBLISH_SITE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : Error details : ' + PUBLISH_SITE_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }        

            let EMAIL_DETAILS = PUBLISH_SITE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            if (EMAIL_DETAILS.length) {
                try {                    
                    let emailTemplateObj = {
                        Subject : GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Subject,
                        Body    : GENERIC_SRA.GENERIC_SRA["GENERIC_SRA_TEMPLATE"].Body
                    }; 
                    let toccEmails = {
                        "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersEmailIDs),
                        "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCEmailID+ ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminEmailID)
                    };
          
                    let templateMaster = {                     
                        AssessmentCode     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode,
                        RISKTRAC_WEB_URL   : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        AssessmentName     : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentName,                                   
                        StartDate          : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate            : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate),
                        subject_text       : "Site Risk Assessment has been published.",
                        body_text          : "Site Risk Assessment has been published.",
                        Note               : ""
                    };
                    
                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : emailData   : ' + JSON.stringify(emailData || null));
                    
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RiskOwnersUserGUIDs
                                        + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCCUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteAdminUserGUID)

                    let inappDetails     = {
                        inAppContent     : 'Site Risk Assessment has been published. Assessment code - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AssessmentCode + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route, 
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            
            ACTION_ITEM_OWNER_EMAIL_DETAILS     = PUBLISH_SITE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            if(ACTION_ITEM_OWNER_EMAIL_DETAILS && ACTION_ITEM_OWNER_EMAIL_DETAILS.length) {
                try {           

                    for(const obj of ACTION_ITEM_OWNER_EMAIL_DETAILS) {
                        let templateMaster = {                     
                            AssessmentCode          : obj.AssessmentCode,
                            ActionItem              : obj.IdentifiedActionItem,
                            RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                            AssessmentName          : obj.AssessmentName,                                   
                            ActionItemStartDate     : utilityAppObject.formatDate(userIdFromToken, obj.ActionItemStartDate),
                            ActionItemEndDate       : utilityAppObject.formatDate(userIdFromToken, obj.ActionItemEndDate),
                            RiskTitle               : obj.RiskTitle
                        };

                        let emailTemplateObj =  {
                            Subject: "Action item has been defined.",
                            Body: `<!DOCTYPE html><html> <body>  <head>  <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head> <div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear, </p>  <br>      <p style="margin-top:0;margin-bottom:0;">An action item has been assigned to you.</p>  <br> <table border="1" cellpadding="5" cellspacing="0"> <tr><th>Module</th><th>Assessment Code</th> <th>Assessment Name</th><th>Risk Title</th> <th>Action Item</th><th>Action Item Start Date</th><th>Action Item End Date</th>  </tr>  <tr style="text-align: center;"><td>Site Risk Assessment</td> <td>[[AssessmentCode]]</td><td>[[AssessmentName]]</td> <td>[[RiskTitle]]</td> <td>[[ActionItem]]</td><td>[[ActionItemStartDate]]</td><td>[[ActionItemEndDate]]</td>  </tr> </table> <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br><p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p> </div> </div> </body> </html>`
                        } 

                        let toccEmails = {
                            "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(obj.ActionItemOwnerEmailID),
                            "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(obj.BCMMangerUsersEmailIDs + ","+ obj.RiskOwnersEmailIDs+ ","+ obj.SiteBCCEmailID + ","+ obj.SiteAdminEmailID + "," +obj.SteeringCommitteEmailIDs)
                        };
                        
                        let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : emailData   : ' + JSON.stringify(emailData || null));
                             
                        let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(obj.ActionItemOwnerID + "," + obj.BCMMangerUsersUserGUIDs + "," + obj.RiskOwnersUserGUIDs + "," + obj.SiteBCCUserGUID + "," + obj.SiteAdminUserGUID);

                        let inappDetails     = {
                            inAppContent     : 'Action item has been defined. Assessment code - ' + obj.AssessmentCode + ", Risk title - " + obj.RiskTitle + ", Action Item - " +  obj.IdentifiedActionItem  + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Route, 
                            recepientUserID  : inAppUserList,
                            subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID
                        }

                        let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    }     
                   
                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }

            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, PUBLISH_SITE_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : publishSiteAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function to upload risk evidence file 
    */
    async uploadRiskEvidence(request, response) {

        let refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData = {
            OriginalFileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileName            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileType            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileContent         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };       
        refreshedToken      = request.body.refreshedToken;
        userIdFromToken     = request.body.userIdFromToken;
        userNameFromToken   = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution started.');
            // check request body should not be undefined
            if (typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Request body has not found');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            let allowedExtensions               = APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER;
            let filePath                        = APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_DESTINATION_PATH;
            let fileMimeType                    = APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_FILE_MIME_TYPES;
            let limits                          = APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE * CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_MEGABYTE;
            let destinationPath                 = APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_DESTINATION_PATH_SERVER;
            let uploadFileExtension             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueFileName                  =  Date.now() +"_"+ request.files.file.name; 
            let fileSize                        = request.files.file.size;
            let lastIndex                       = uniqueFileName.lastIndexOf('.');
            uploadFileExtension                 = uniqueFileName.substr(lastIndex, uniqueFileName.length - 1).toLowerCase();
            siteRiskAssessmentData.OriginalFileName        = request.files.file.name;         
            siteRiskAssessmentData.FileType                = uploadFileExtension;
            siteRiskAssessmentData.FileContent             = request.files.file.data;
            const mimeType                                 = await FILE_TYPE.fromBuffer(siteRiskAssessmentData.FileContent);
            const localFilePath                            = path.join(__dirname, '..','..','file-upload', 'evidences', 'temp');

            if (/^[a-zA-Z0-9\s_\-()./]*$/.test(request.files.file.name)) {
                siteRiskAssessmentData.FileName                = Date.now() +"_"+ request.files.file.name;   
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Error Details : File name should not have special characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_NAME_IS_NOT_VALID));
            }
            // Validating file Size
            if (fileSize > limits) {                    
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Error Details : File size has exceeded the allowed limit');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_SIZE_EXCEED + APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE ));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : mimeType : ' + JSON.stringify(mimeType));

            if (mimeType.ext == 'exe') {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

            if (mimeType != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) {
                // Validating file extension
                if (!(allowedExtensions.includes((mimeType.ext)))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));
                }               
                
                // Validating file Mimetype
                if (!(fileMimeType.includes(mimeType.mime))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));                    
                }                
                const fileUploadedResponse = await utilityAppObject.uploadFileToRemoteServer(userIdFromToken, siteRiskAssessmentData.FileContent, destinationPath, request.files.file.name, siteRiskAssessmentData.FileType, localFilePath, accountGUIDFromToken);     

                if (fileUploadedResponse.uploadFileResponse) { 
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : File dumped into SFTP server successfully in the path : ' + destinationPath);

                    const GET_EVIDENCE_ATTACHMENT_DB_RESPONSE = await siteRiskAssessmentDB.uploadRiskEvidence(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EVIDENCE_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EVIDENCE_ATTACHMENT_DB_RESPONSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. :  GET_EVIDENCE_ATTACHMENT_DB_RESPONSE is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Error details :' + GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Error details : ' + GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    
                
                    const FORMAT_RISK_ATTACHMENT_DATA = await getFormatEvidenceList(userIdFromToken,GET_EVIDENCE_ATTACHMENT_DB_RESPONSE , 'upload', accountGUIDFromToken);
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RISK_ATTACHMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RISK_ATTACHMENT_DATA) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. :  FORMAT_RISK_ATTACHMENT_DATA response is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Risk evidence uploaded successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_RISK_ATTACHMENT_DATA));
                
                } else if(fileUploadedResponse.uploadFileResponse === false && fileUploadedResponse.SFTPConnection === true){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Uploaded file is malicious ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
                } else {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Failed to connect to sftp server ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL_SFTP));
                }    
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : uploadRiskEvidence : Execution end. : Got unhandled error : Error Detail : ' + error)
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));

        }
    }

    /** 
    * This function will download evidence of particular attachmentid  from the dataBase 
    */
     async downloadRiskEvidence(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let siteRiskAssessmentData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            siteRiskAssessmentData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. : siteRiskAssessmentData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteRiskAssessmentData.fileContentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteRiskAssessmentData.fileContentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. : fileContentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_CONTENT_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const GET_DOWNLOAD_RESPONSE = await siteRiskAssessmentDB.downloadRiskEvidence(userIdFromToken, userNameFromToken,siteRiskAssessmentData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : GET_DOWNLOAD_RESPONSE : ' + JSON.stringify(GET_DOWNLOAD_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. :  GET_DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. : Error details :' + GET_DOWNLOAD_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DOWNLOAD_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. : Error details : ' + GET_DOWNLOAD_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_DOWNLOAD_RESPONSE = await getFormatEvidenceList(userIdFromToken, GET_DOWNLOAD_RESPONSE, 'download', accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : FORMAT_DOWNLOAD_RESPONSE : ' + JSON.stringify(FORMAT_DOWNLOAD_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. :  FORMAT_DOWNLOAD_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, FORMAT_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : downloadRiskEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }

    stop() { }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : errorMessage,
        },
    };
}

function successfulResponse(refreshedToken, successMessage, result) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        },
    };
}

async function getFormatRiskData(userIdFromToken, RiskDBResponse,MasterDBResponse, accountGUIDFromToken){
    let riskDetails                     = [];
    let InherentLikelihoodMasterList    = [];
    let InherentImpactMasterList        = [];
    let controlEffectivenessList        = [];
    let riskTreatmentStrategyList       = [];
    let threatImpactMaster              = [];
    let actionItemOwnerList             = [];
    let residualLikelihoodList          = [];
    let residualImpactList              = [];
    let threatCategoryList              = [];
    let workFlowStatus                  = [];
    let riskData                        = [];
    let previousResponses               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let attachmentConfig                = [];

    try{

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskData : Execution Started.');
        //Risk Data
        if(RiskDBResponse!= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){

            if (RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) {

                let riskDetails = RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
                previousResponses = riskDetails.length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && riskDetails.PreviousData !=  CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(riskDetails.PreviousData)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;               
                //Case : BC Manager View : Modifying resultset to show the latest data only if it is submitted from risk owner 
                if(riskDetails.IsReviewer ) {

                    let isLatestVisible     = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    isLatestVisible         = [3,4,5,6,7].includes(riskDetails.StatusID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE :CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                   

                    let actionPlans       = [];
                    let actionsPlansList = isLatestVisible ?
                     (riskDetails.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? riskDetails.ActionPlans : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) :
                     (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && previousResponses.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ActionPlans : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    if(actionsPlansList != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        // forming action plans list
                        for(const actionPlanObj of Object.values(JSON.parse(actionsPlansList))){
                            actionPlans.push({
                                actionID            : Number(actionPlanObj.RiskActionPlanID),
                                actionItem          : actionPlanObj.IdentifiedActionItem,
                                startDate           : actionPlanObj.StartDate,
                                targetDate          : actionPlanObj.TargetDate,
                                actionItemOwnerID   : actionPlanObj.ActionItemOwnerID,
                                actionItemOwner     : actionPlanObj.ActionItemOwner
                            })
                        }
                    }

                    let controls = [];

                    // forming controls list
                    if(riskDetails.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        if(isLatestVisible){
                            let visibleControls = JSON.parse(riskDetails.Controls).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
                            let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                            let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                            controls = [...masterControls,...customContorls]
                            controls = JSON.stringify(controls);
                        }else{
                            if(previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && previousResponses.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                                let visibleControls = JSON.parse(previousResponses.Controls)
                                let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                controls = [...masterControls,...customContorls]
                                controls = JSON.stringify(controls);
                            }else{
                                let visibleControls = JSON.parse(riskDetails.Controls).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
                                let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                controls = [...masterControls,...customContorls]
                                controls = JSON.stringify(controls);
                            }
                        }
                    }

                    let evidences = [];
                    // forming evidence list
                    let riskEvidence = isLatestVisible ? (riskDetails.RiskAssessmentEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?  JSON.parse(riskDetails.RiskAssessmentEvidences).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) 
                                        : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && previousResponses.RiskAssessmentEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(previousResponses.RiskAssessmentEvidences).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL );

                    if(riskEvidence != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        for(let evObj of Object.values(riskEvidence)){
                            evidences.push({
                                "AttachmentID"  : evObj.EvidenceID,
                                "IncidentID"    : evObj.IncidentID,
                                "AttachmentName": evObj.FileName,
                                "FileType"      : evObj.FileType,
                                "FileContentID" : evObj.FileContentID,
                                "CreatedDate"   : evObj.CreatedDate
                            })
                        }
                    }



                    riskData.push({   
                        "SiteRiskAssessmentID"        : riskDetails.SiteRiskAssessmentID,
                        "AssessmentName"              : riskDetails.AssessmentName,
                        "AssessmentCode"              : riskDetails.AssessmentCode,
                        "ScheduleRiskAssessmentID"    : riskDetails.ScheduleRiskAssessmentID,
                        "SiteID"                      : riskDetails.SiteID,
                        "SiteName"                    : riskDetails.SiteName,
                        "ShortCode"                   : riskDetails.ShortCode,
                        "StartDate"                   : riskDetails.StartDate,
                        "EndDate"                     : riskDetails.EndDate,
                        "ThreatRiskID"                : riskDetails.ThreatRiskID,
                        "RiskTitle"                   : riskDetails.RiskTitle,
                        "RiskCode"                    : riskDetails.RiskCode,
                        "RiskDescription"             : riskDetails.RiskDescription,
                        "Controls"                    : controls,
                        "RiskImpact"                  : riskDetails.RiskImpact,
                        "ThreatCategoryID"            : riskDetails.ThreatCategoryID,
                        "ThreatCategory"              : riskDetails.ThreatCategory,
                        "ExistingControls"            : riskDetails.ExistingControls,
                        // isLatestVisible ? riskDetails.ExistingControls : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.ExistingControls : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "RiskOwnerID"                 : riskDetails.RiskOwnerID,
                        "RiskOwnerName"               : riskDetails.RiskOwnerName,
                        "RiskTreatmentStrategyID"     : riskDetails.RiskTreatmentStrategyID,
                        // isLatestVisible ? riskDetails.RiskTreatmentStrategyID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.RiskTreatmentStrategyID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "RiskTreatmentStrategyName"   : riskDetails.RiskTreatmentStrategyName,
                        // isLatestVisible ? riskDetails.RiskTreatmentStrategyName : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.RiskTreatmentStrategyName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "OverallResidualRiskRatingID" : riskDetails.OverallResidualRiskRatingID,
                        //  isLatestVisible ? riskDetails.OverallResidualRiskRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.OverallResidualRiskRatingID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "OverallResidualRiskRating"   : riskDetails.OverallResidualRiskRating,
                        //  isLatestVisible ? riskDetails.OverallResidualRiskRating :(previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.OverallResidualRiskRating: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "OverallInherentRiskRatingID" : riskDetails.OverallInherentRiskRatingID,
                        //  isLatestVisible ? riskDetails.OverallInherentRiskRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.OverallInherentRiskRatingID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "OverallInherentRiskRating"   : riskDetails.OverallInherentRiskRating,
                        //  isLatestVisible ? riskDetails.OverallInherentRiskRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.OverallInherentRiskRating: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "StatusID"                    : isLatestVisible ? riskDetails.StatusID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.StatusID : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE),
                        "Status"                      : isLatestVisible ? riskDetails.Status : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW),
                        "WorkFlowStatusID"            : riskDetails.AssessmentWrokflowStatusID,
                        "ControlEffectivenessID"      : riskDetails.ControlEffectivenessID,
                        // isLatestVisible ? riskDetails.ControlEffectivenessID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.ControlEffectivenessID: riskDetails.MasterControlEffectivenessID),
                        "ControlEffectiveness"        : riskDetails.ControlEffectiveness,
                        "ResidualLikelihoodRatingID"  : riskDetails.ResidualLikelihoodRatingID,
                        //  isLatestVisible ? riskDetails.ResidualLikelihoodRatingID :(previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.ResidualLikelihoodRatingID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "ResidualLikelihoodRating"    : riskDetails.ResidualLikelihoodRating,
                        "ResidualImpactRatingID"      : riskDetails.ResidualImpactRatingID,
                        // isLatestVisible ? riskDetails.ResidualImpactRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.ResidualImpactRatingID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "ResidualImpactRating"        : riskDetails.ResidualImpactRating,
                        "InherentLikelihoodRatingID"  : riskDetails.InherentLikelihoodRatingID,
                        // isLatestVisible ? riskDetails.InherentLikelihoodRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.InherentLikelihoodRatingID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "InherentLikelihoodRating"    : riskDetails.InherentLikelihoodRating,
                        "InherentImpactRatingID"      : riskDetails.InherentImpactRatingID,
                        // isLatestVisible ? riskDetails.InherentImpactRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.InherentLikelihoodRatingID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "InherentImpactRating"        : riskDetails.InherentImpactRating,
                        "ResidualRiskDescription"     : riskDetails.ResidualRiskDescription,
                        // isLatestVisible ? riskDetails.ResidualRiskDescription : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.RiskRatingComment: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "RiskTolerateExplanation"     : riskDetails.RiskTolerateExplanation,
                        // isLatestVisible ? riskDetails.RiskTolerateExplanation : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?previousResponses.RiskTolerateExplanation: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "ActionPlans"                 : JSON.stringify(actionPlans),
                        "IsRiskOwner"                 : riskDetails.IsRiskOwner,
                        "IsReviewer"                  : riskDetails.IsReviewer,
                        "IsReviewed"                  : isLatestVisible ? riskDetails.IsReviewed :  (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.IsReviewed: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                        "NextWorkflowAction"          : riskDetails.NextWorkflowAction,
                        "NextWorkflowActionBy"        : riskDetails.NextWorkflowActionBy,
                        "ThreatReviewComments"        : (riskDetails.CommentsHistory != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && (isLatestVisible ? riskDetails.IsReviewed :  (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.IsReviewed: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)))
                                                        ? (JSON.parse(riskDetails.CommentsHistory)).filter(ele => ele.IsVisible).sort((a, b) => (b.RiskReviewCommentID - a.RiskReviewCommentID))
                                                        : (riskDetails.CommentsHistory != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (JSON.parse(riskDetails.CommentsHistory)).sort((a, b) => (b.RiskReviewCommentID - a.RiskReviewCommentID)) : [],
                        "RiskEvidences"               : evidences                                
                    });  
                   
                }
                else{ //Case : Risk Owner View :Modifying resultset to show the latest data only if it is submitted from BC manager 
                    let isLatestVisible     = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    isLatestVisible         = riskDetails.IsReviewed == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE || (riskDetails.IsReviewed == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && [1,2,3,4].includes(riskDetails.StatusID));

                    let actionPlans       = [];
                    if(riskDetails.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        for(const actionPlanObj of Object.values(JSON.parse(riskDetails.ActionPlans))){
                            // forming action plans list
                            actionPlans.push({
                                actionID            : Number(actionPlanObj.RiskActionPlanID),
                                actionItem          : actionPlanObj.IdentifiedActionItem,
                                startDate           : actionPlanObj.StartDate,
                                targetDate          : actionPlanObj.TargetDate,
                                actionItemOwnerID   : actionPlanObj.ActionItemOwnerID,
                                actionItemOwner     : actionPlanObj.ActionItemOwner
                            })
                        }
                    }

                    let controls = [];
                    // forming controls list
                    if(riskDetails.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        let visibleControls = JSON.parse(riskDetails.Controls);
                        let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                        let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                        controls = [...masterControls,...customContorls]
                        controls = JSON.stringify(controls);
                    }

                    let evidences = [];
                    // forming evidence list
                    if(riskDetails.RiskAssessmentEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        let riskEvidence = JSON.parse(riskDetails.RiskAssessmentEvidences)

                        for(let evObj of Object.values(riskEvidence)){
                            evidences.push({
                                "AttachmentID"  : evObj.EvidenceID,
                                "IncidentID"    : evObj.IncidentID,
                                "AttachmentName": evObj.FileName,
                                "FileType"      : evObj.FileType,
                                "FileContentID" : evObj.FileContentID,
                                "CreatedDate"   : evObj.CreatedDate
                            })
                        }
                    }
                    
                    riskData.push({   
                        "SiteRiskAssessmentID"        : riskDetails.SiteRiskAssessmentID,
                        "AssessmentName"              : riskDetails.AssessmentName,
                        "AssessmentCode"              : riskDetails.AssessmentCode,
                        "ScheduleRiskAssessmentID"    : riskDetails.ScheduleRiskAssessmentID,
                        "SiteID"                      : riskDetails.SiteID,
                        "SiteName"                    : riskDetails.SiteName,
                        "ShortCode"                   : riskDetails.ShortCode,
                        "StartDate"                   : riskDetails.StartDate,
                        "EndDate"                     : riskDetails.EndDate,
                        "ThreatRiskID"                : riskDetails.ThreatRiskID,
                        "RiskTitle"                   : riskDetails.RiskTitle,
                        "RiskCode"                    : riskDetails.RiskCode,
                        "RiskDescription"             : riskDetails.RiskDescription,
                        "Controls"                    : controls,
                        "RiskImpact"                  : riskDetails.RiskImpact,
                        "ThreatCategoryID"            : riskDetails.ThreatCategoryID,
                        "ThreatCategory"              : riskDetails.ThreatCategory,
                        "ExistingControls"            : riskDetails.ExistingControls,
                        "RiskOwnerID"                 : riskDetails.RiskOwnerID,
                        "RiskOwnerName"               : riskDetails.RiskOwnerName,
                        "RiskTreatmentStrategyID"     : riskDetails.RiskTreatmentStrategyID ,
                        "RiskTreatmentStrategyName"   : riskDetails.RiskTreatmentStrategyName,
                        "OverallResidualRiskRatingID" : riskDetails.OverallResidualRiskRatingID ,
                        "OverallResidualRiskRating"   : riskDetails.OverallResidualRiskRating,
                        "OverallInherentRiskRatingID" : riskDetails.OverallInherentRiskRatingID ,
                        "OverallInherentRiskRating"   : riskDetails.OverallInherentRiskRating,
                        "StatusID"                    : isLatestVisible ? riskDetails.StatusID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.StatusID : (riskDetails.StatusID)),
                        "Status"                      : isLatestVisible ? riskDetails.Status : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : (riskDetails.Status)),
                        "WorkFlowStatusID"            : riskDetails.AssessmentWrokflowStatusID,
                        "ControlEffectivenessID"      : riskDetails.ControlEffectivenessID ,
                        "ControlEffectiveness"        : riskDetails.ControlEffectiveness,
                        "ResidualLikelihoodRatingID"  : riskDetails.ResidualLikelihoodRatingID ,
                        "ResidualLikelihoodRating"    : riskDetails.ResidualLikelihoodRating,
                        "ResidualImpactRatingID"      : riskDetails.ResidualImpactRatingID,
                        "ResidualImpactRating"        : riskDetails.ResidualImpactRating,
                        "InherentLikelihoodRatingID"  : riskDetails.InherentLikelihoodRatingID ,
                        "InherentLikelihoodRating"    : riskDetails.InherentLikelihoodRating,
                        "InherentImpactRatingID"      : riskDetails.InherentImpactRatingID ,
                        "InherentImpactRating"        : riskDetails.InherentImpactRating,
                        "ResidualRiskDescription"     : riskDetails.ResidualRiskDescription,
                        "RiskTolerateExplanation"     : riskDetails.RiskTolerateExplanation ,
                        "ActionPlans"                 : JSON.stringify(actionPlans),
                        "IsRiskOwner"                 : riskDetails.IsRiskOwner,
                        "IsReviewer"                  : riskDetails.IsReviewer,
                        "IsReviewed"                  : isLatestVisible ? riskDetails.IsReviewed :  CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        "NextWorkflowAction"          : riskDetails.NextWorkflowAction,
                        "NextWorkflowActionBy"        : riskDetails.NextWorkflowActionBy,
                        "ThreatReviewComments"        : riskDetails.CommentsHistory != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (JSON.parse(riskDetails.CommentsHistory).filter(ele => ele.IsVisible)).sort((a, b) => (b.RiskReviewCommentID - a.RiskReviewCommentID)) : [],
                        "RiskEvidences"               : evidences          
                    });  
                }
              } 
        }
        
        //Master List
        if(MasterDBResponse!= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            controlEffectivenessList        = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]   && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]   : [];
            residualLikelihoodList          = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]    && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]     : [];
            residualImpactList              = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]    && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]     : [];
            InherentLikelihoodMasterList    = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE]  && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
            InherentImpactMasterList        = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR]   && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR]   : [];
            riskTreatmentStrategyList       = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE]   && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE]   : [];
            threatCategoryList              = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT]  && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT]     : [];
            threatImpactMaster              = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE]   && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
            actionItemOwnerList             = MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN]    && MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? MasterDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] : [];
        }

        let actionItemOwners = [];
        // Result Set: ActionItem Owners List
        if (actionItemOwnerList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(actionItemOwnerList)) {
                actionItemOwners.push({
                    "AdminGUID"     : obj.ActionItemOwnerGUID,
                    "AdminName"     : obj.ActionItemOwnerName,
                });
            }
        }

        //Result Set: workflow status
        if (RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            workFlowStatus = RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        }

        // file upload configuration
        attachmentConfig.push({
            "FileSize"          : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE,
            "FileExtensions"    : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST
        })
        
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskData : Execution End.');
    
        if(MasterDBResponse!= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && RiskDBResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            return {
              "RiskData"       : riskData,
              "IsBCChampion"   : RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO],
              "IsSiteAdminHead": RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE],
              "IsBCManager"    : RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR],
              "MasterList"     : {
                  "CurrentControlEffectivenessList" : controlEffectivenessList,
                    "ResidualLikelihoodMasterList"  : residualLikelihoodList.sort((a, b) => (b.ResidualLikelihoodRatingID - a.ResidualLikelihoodRatingID)),
                    "ResidualImpactMasterList"      : residualImpactList.sort((a, b) => (b.ResidualImpactRatingID - a.ResidualImpactRatingID)),
                    "InherentLikelihoodMasterList"  : InherentLikelihoodMasterList.sort((a, b) => (b.InherentLikelihoodRatingID - a.InherentLikelihoodRatingID)),
                    "InherentImpactMasterList"      : InherentImpactMasterList.sort((a, b) => (b.InherentImpactRatingID - a.InherentImpactRatingID)),
                    "RiskTreatmentStrategyList"     : riskTreatmentStrategyList,
                    "ThreatCategoryList"            : threatCategoryList,
                    "ThreatImpactMaster"            : threatImpactMaster,
                    "ActionItemOwnerList"           : actionItemOwners,
                    "AttachmentConfiguration"       : attachmentConfig
    
                }
            }
        }
        if(MasterDBResponse == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            return {
                "RiskData"       : riskDetails,
                "IsBCChampion"   : RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO],
                "IsSiteAdminHead": RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE],
                "IsBCManager"    : RiskDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR]
            }    
        }
      }catch(error){
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskData : Execution end. : Got unhandled error. : Error Detail : ' + error);
          return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
       
      }
}

// async function getFormatSiteRiskAssessmentsList(userIdFromToken,getDBResponse, accountGUIDFromToken){
//   try{
//     logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution Started.');

//     let siteRiskAssessmentsList         = [];
//     let statusData                      = [];
//     let bcManagersList                  = [];
//     let riskOwnerslist                  = [];
//     let filteredSiteRiskAssessmentsList = [];

//     siteRiskAssessmentsList     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
//     statusData                  = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
//     bcManagersList              = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
//     riskOwnerslist              = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
//     BCMUnitUsersList            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];

//     let isBCManager              = bcManagersList.some(admin => userIdFromToken === admin.AdminGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
//     let totalRiskOwners          = riskOwnerslist.map((user) => user.RiskOwnerGUID);
//     let totalBCMUnitUsers        = BCMUnitUsersList.map((user) => user.BCMUnitUserGUID);
//     let bcmManagersList          = bcManagersList.map((user) => user.AdminGUID);

//     let filteredBCMUnitUsersList = totalBCMUnitUsers.filter((user) => {
//         return !totalRiskOwners.some(id => id === user.RiskOwnerGUID) && !bcmManagersList.some(id => id === user.AdminGUID)
//     })

//     // formatting of IDs from string to number
//     siteRiskAssessmentsList.forEach((sra) => {
//         sra.SiteRiskAssessmentID    = Number(sra.SiteRiskAssessmentID);
//         sra.SiteID                  = Number(sra.SiteID);
//         sra["IsRiskOwner"]          = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
//         sra["IsReviewer"]           = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
//         let percentageValue         = (sra.OverallCompletionPercentage != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Math.round(parseFloat(sra.OverallCompletionPercentage)) : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
//         sra.OverallCompletionPercentage = percentageValue + "%";
//     })

//     // to show all the SRAs having start date less than current date for non BCManager users
//     if(!(isBCManager == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)){
//             filteredSiteRiskAssessmentsList = siteRiskAssessmentsList.filter((sral) => {
//             let currentDate = new Date();
//             currentDate = currentDate.toLocaleDateString();
//             console.log("Current Date string : ", currentDate);
//             let [day, month, year] = currentDate.split('/').map(Number)
//             currentDate = new Date(Date.UTC(year, month - 1, day, 0,0,0,0));
//             console.log("Current Date : ", currentDate)
//             let sralStartDate = new Date(sral.StartDate);
//             console.log("Start Date : ", sralStartDate);
//             if (sralStartDate <= currentDate){
//                 return sral;
//             }
//         })
//     }else {
//         filteredSiteRiskAssessmentsList = siteRiskAssessmentsList;
//     }
//     //   console.log("Filtered SRA List : ", filteredSiteRiskAssessmentsList);

//     // for filtering the RiskOwnerIDs
//     filteredSiteRiskAssessmentsList.forEach((assessment) => {
//         try {
//             const assessmentData        = JSON.parse(assessment.AssessmentData);
//             const riskOwnerIDs          = assessmentData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SchdeduleRiskAssessment.map((scheduleRisk) => scheduleRisk.RiskOwnerID);
//             const uniqueRiskOwnerIDs    = [...new Set(riskOwnerIDs)];
//             assessment["RiskOwnerIDs"]  = uniqueRiskOwnerIDs;
//             if(assessment.RiskOwnerIDs.includes(userIdFromToken)){
//                 assessment.IsRiskOwner  = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
//                 assessment.IsReviewer   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
//             }
//             if(assessment.ReviewerID == userIdFromToken){
//                 assessment.IsRiskOwner  = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
//                 assessment.IsReviewer   = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
//             }
//         } catch (error) {
//             logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
//             return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
//         }
//     });

//       logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution End.');
       
//       /**
//        * seggregating SRA list based on RiskOwner, Reviewer, BCManager and Normal User - START
//        */

//       let totalRiskOwnersFromSRAs = [...new Set (filteredSiteRiskAssessmentsList.flatMap(element => element.RiskOwnerIDs))];
//       let RiskBasedLists          = [];
//       let ReviewerBasedLists      = [];
//       let completeResult          = [];
//       logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 1');
      
//       // filter risk owner based SRA list
//       let OwnerLists = filteredSiteRiskAssessmentsList.filter((assessment) => {
//           if (assessment.RiskOwnerIDs && assessment.RiskOwnerIDs.includes(userIdFromToken) && totalRiskOwners.some(ele => assessment.RiskOwnerIDs.includes(ele))) {
//               RiskBasedLists.push(assessment)
//           } else {
//               return false;
//           }
//           return RiskBasedLists;
//       })
//       logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Owner List : ' + JSON.stringify(OwnerLists));

//       // filter reviewer based SRA list
//       let ReviewersList = filteredSiteRiskAssessmentsList.filter((assessment) => {
//           if (assessment.ReviewerID === userIdFromToken) {
//               ReviewerBasedLists.push(assessment)
//           } else {
//               return false;
//           }
//           return ReviewerBasedLists
//       })
//       logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Reviewers List : ' + JSON.stringify(ReviewersList));

//     // conditions to assign different types of SRA list to different types of users (Risk Owners, BCManagers, etc.)
//     if ((totalRiskOwners.some(ele => totalRiskOwnersFromSRAs.includes(ele)) && (OwnerLists.length && OwnerLists.every(assessment => assessment.IsRiskOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE))) && (isBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)){
//         if (totalRiskOwners.some(ele => totalBCMUnitUsers.includes(ele)) && totalBCMUnitUsers.includes(userIdFromToken)) {
//             completeResult = OwnerLists.concat(filteredSiteRiskAssessmentsList.filter((ele) => ele.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE));
//             logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 2 : ' + JSON.stringify(completeResult));
//             completeResult = Array.from(new Set(completeResult.map(JSON.stringify))).map(JSON.parse);
//             logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 3 : ' + JSON.stringify(completeResult));
            
//         }else {
            
//             completeResult = OwnerLists;
//             logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 4 : ' + JSON.stringify(completeResult));
//         }
//       }
//       else if ((ReviewersList.length && ReviewersList.every(assessment => assessment.IsReviewer === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)) && (isBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)) {
            
//           completeResult = filteredSiteRiskAssessmentsList;
//         logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 5 : ' + JSON.stringify(completeResult));
//       }
//       else {
        
//           if (filteredBCMUnitUsersList.length && filteredBCMUnitUsersList.includes(userIdFromToken) && (isBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)){
              
//             completeResult = filteredSiteRiskAssessmentsList.filter((ele) => ele.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE)
//             logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 6 : ' + JSON.stringify(completeResult));
//         }else if (isBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
              
//               completeResult = filteredSiteRiskAssessmentsList;
//               logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 7 : ' + JSON.stringify(completeResult));
//         }else {

//             completeResult = [];
//               logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 8 : ' + JSON.stringify(completeResult));
//         }
//       }

//       /**
//        * seggregating SRA list based on RiskOwner, Reviewer, BCManager and Normal User - END
//        */

//       return {
//           "SiteRiskAssessments" : completeResult,
//           "StatusData"          : statusData,
//           "BCManagersList"      : bcManagersList,
//           "IsBCManager"         : [{isBCManager}],
//           "RiskOwnersList"      : riskOwnerslist,
//           "BCMUnitUsersList"    : BCMUnitUsersList,
//           "ExportFileLimit"     : APP_CONFIG_FILE_OBJ.EXPORT_FILE_LIMIT.SRA_EXPORT_LIMIT
//       }

//   }catch(error){
//       logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
//       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
//   }
// }


 async function getFormatSiteRiskAssessmentsList(userIdFromToken, getDBResponse, accountGUIDFromToken) {

    // try {
    //     //console.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution Started.');

    //     let siteRiskAssessmentsList = [];
    //     let statusData = [];
    //     let bcManagersList = [];
    //     let riskOwnerslist = [];
    //     let filteredSiteRiskAssessmentsList = [];

    //     siteRiskAssessmentsList = getDBResponse.recordset[0] && getDBResponse.recordset[0].length > 0 ? getDBResponse.recordset[0] : [];
    //     statusData = getDBResponse.recordset[1] && getDBResponse.recordset[1].length > 0 ? getDBResponse.recordset[1] : [];
    //     bcManagersList = getDBResponse.recordset[2] && getDBResponse.recordset[2].length > 0 ? getDBResponse.recordset[2] : [];
    //     riskOwnerslist = getDBResponse.recordset[3] && getDBResponse.recordset[3].length > 0 ? getDBResponse.recordset[3] : [];
    //     BCMUnitUsersList = getDBResponse.recordset[4] && getDBResponse.recordset[4].length > 0 ? getDBResponse.recordset[4] : [];

    //     let isBCManager = bcManagersList.some(admin => userIdFromToken === admin.AdminGUID) ? 1 : 0;
    //     let totalRiskOwners = riskOwnerslist.map((user) => user.RiskOwnerGUID);
    //     // console.log('✌️totalRiskOwners --->', totalRiskOwners);
    //     let totalBCMUnitUsers = BCMUnitUsersList.map((user) => user.BCMUnitUserGUID);
    //     let bcmManagersList = bcManagersList.map((user) => user.AdminGUID);

    //     let filteredBCMUnitUsersList = totalBCMUnitUsers.filter((user) => {
    //         return !totalRiskOwners.some(id => id === user.RiskOwnerGUID) && !bcmManagersList.some(id => id === user.AdminGUID)
    //     })

    //     // formatting of IDs from string to number
    //     siteRiskAssessmentsList.forEach((sra) => {
    //         sra.SiteRiskAssessmentID = Number(sra.SiteRiskAssessmentID);
    //         sra.SiteID = Number(sra.SiteID);
    //         sra["IsRiskOwner"] = 0;
    //         sra["IsReviewer"] = 0;
    //         let percentageValue = (sra.OverallCompletionPercentage != null) ? Math.round(parseFloat(sra.OverallCompletionPercentage)) : 0;
    //         sra.OverallCompletionPercentage = percentageValue + "%";
    //     })
    //     // console.log('✌️siteRiskAssessmentsList --->', siteRiskAssessmentsList);


    //     // to show all the SRAs having start date less than current date for non BCManager users
    //     if (!(isBCManager == 1)) {
    //         // console.log('✌️isBCManager ---> if', isBCManager);
    //         filteredSiteRiskAssessmentsList = siteRiskAssessmentsList.filter((sral) => {
    //             let currentDate = new Date();
    //             currentDate = currentDate.toLocaleDateString();
    //             //console.log("Current Date string : ", currentDate);
    //             let [day, month, year] = currentDate.split('/').map(Number)
    //             currentDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    //             //console.log("Current Date : ", currentDate)
    //             let sralStartDate = new Date(sral.StartDate);
    //             //console.log("Start Date : ", sralStartDate);
    //             if (sralStartDate <= currentDate) {
    //                 return sral;
    //             }
    //         })
    //     } else {
    //         filteredSiteRiskAssessmentsList = siteRiskAssessmentsList;
    //         // console.log('✌️filteredSiteRiskAssessmentsList ---> else', filteredSiteRiskAssessmentsList);
    //     }

    //     filteredSiteRiskAssessmentsList = siteRiskAssessmentsList;

    //     //   //console.log("Filtered SRA List : ", filteredSiteRiskAssessmentsList);

    //     // for filtering the RiskOwnerIDs
    //     // console.log('✌️filteredSiteRiskAssessmentsList --->', filteredSiteRiskAssessmentsList);

    //     filteredSiteRiskAssessmentsList.forEach((assessment) => {
    //         try {
    //             const assessmentData = JSON.parse(assessment.AssessmentData);
    //             const riskOwnerIDs = assessmentData[0].SchdeduleRiskAssessment.map((scheduleRisk) => scheduleRisk.RiskOwnerID);
    //             const uniqueRiskOwnerIDs = [...new Set(riskOwnerIDs)];
    //             assessment["RiskOwnerIDs"] = uniqueRiskOwnerIDs;
    //             if (assessment.RiskOwnerIDs.includes(userIdFromToken)) {
    //                 console.log("if1",assessment.AssessmentCode);

    //                 assessment.IsRiskOwner = 1;
    //                 assessment.IsReviewer = 0;
    //                 assessment["IsSiteAdminHead"] = 0;
    //                 assessment["IsBCSiteChampionID"] = 0;
    //             }
    //             if (assessment.ReviewerID == userIdFromToken) {
    //                 console.log("if2",assessment.AssessmentCode);
    //                 assessment.IsRiskOwner = 0;
    //                 assessment.IsReviewer = 1;
    //                 assessment["IsSiteAdminHead"] = 0;
    //                 assessment["IsBCSiteChampionID"] = 0;
    //             }
    //             if(assessment.BCSiteChampionID == userIdFromToken){
    //                 console.log("if3",assessment.AssessmentCode);
    //                 assessment["IsBCSiteChampionID"] = 1;
    //             } 
    //             if(assessment.SiteAdminHeadID == userIdFromToken){
    //                 console.log("if4",assessment.AssessmentCode);
    //                 assessment["IsSiteAdminHead"] = 1;
    //             }
    //         } catch (error) {
    //             //console.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
    //             return null;
    //         }
    //     });

    //     //console.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution End.');

    //     /**
    //      * seggregating SRA list based on RiskOwner, Reviewer, BCManager and Normal User - START
    //      */

    //     let totalRiskOwnersFromSRAs = [...new Set(filteredSiteRiskAssessmentsList.flatMap(element => element.RiskOwnerIDs))];
    //     // console.log('✌️totalRiskOwnersFromSRAs --->', totalRiskOwnersFromSRAs);
    //     let RiskBasedLists = [];
    //     let ReviewerBasedLists = [];
    //     let completeResult = [];
    //     //console.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Cmplete Result 1');

    //     // filter risk owner based SRA list
    //     let OwnerLists = filteredSiteRiskAssessmentsList.filter((assessment) => {
    //         if ((assessment.RiskOwnerIDs && assessment.RiskOwnerIDs.includes(userIdFromToken) && totalRiskOwners.some(ele => assessment.RiskOwnerIDs.includes(ele))) || (assessment.BCSiteChampionID == userIdFromToken) || (assessment.SiteAdminHeadID == userIdFromToken)) {
    //             RiskBasedLists.push(assessment)
    //         } else {
    //             return false;
    //         }
    //         return RiskBasedLists;
    //     })
    //     // filter reviewer based SRA list
    //     let ReviewersList = filteredSiteRiskAssessmentsList.filter((assessment) => {
    //         if (assessment.ReviewerID === userIdFromToken) {
    //             ReviewerBasedLists.push(assessment)
    //         } else {
    //             return false;
    //         }
    //         return ReviewerBasedLists
    //     })
       
    //     if ((totalRiskOwners.some(ele => totalRiskOwnersFromSRAs.includes(ele)) && (OwnerLists.length && OwnerLists.every(assessment => assessment.IsRiskOwner === 1)) && (isBCManager === 0)) ) {
    //         if (totalRiskOwners.some(ele => totalBCMUnitUsers.includes(ele)) && totalBCMUnitUsers.includes(userIdFromToken)) {
    //             completeResult = OwnerLists.concat(filteredSiteRiskAssessmentsList.filter((ele) => ele.StatusID == 3));
    //             completeResult = Array.from(new Set(completeResult.map(JSON.stringify))).map(JSON.parse);
    //         } else {
    //             completeResult = OwnerLists;
    //         }
    //     }
    //     else if ((ReviewersList.length && ReviewersList.every(assessment => assessment.IsReviewer === 1)) && (isBCManager === 1)) {
    //         completeResult = filteredSiteRiskAssessmentsList;
    //     }
    //     else {
    //         if (filteredBCMUnitUsersList.length && filteredBCMUnitUsersList.includes(userIdFromToken) && (isBCManager === 0)) {
    //             completeResult = filteredSiteRiskAssessmentsList.filter((ele) => ele.StatusID == 3)
    //         } else if (isBCManager === 1) {
    //             completeResult = filteredSiteRiskAssessmentsList;
    //         } else {
    //             completeResult = [];
    //         }
    //     }

    //     /**
    //      * seggregating SRA list based on RiskOwner, Reviewer, BCManager and Normal User - END
    //      */

    //     return {
    //         "SiteRiskAssessments": completeResult,
    //         "StatusData"          : statusData,
    //         "BCManagersList"      : bcManagersList,
    //         "IsBCManager"         : [{isBCManager}],
    //         "RiskOwnersList"      : riskOwnerslist,
    //         "BCMUnitUsersList"    : BCMUnitUsersList,
    //         "ExportFileLimit"     : 5
    //     }

    // } 
    try {
         
        let siteRiskAssessmentsList     = [];
        let statusData                  = [];
        let bcManagersList              = [];
        let riskOwnerslist              = [];
        let filteredSiteRiskAssessmentsList = [];
        let BCSteeringCommittee         = [];
        let BCSteeringCommitteeList     = [];
       
        siteRiskAssessmentsList     = getDBResponse.recordset[0] && getDBResponse.recordset[0].length > 0 ? getDBResponse.recordset[0] : [];
        statusData                  = getDBResponse.recordset[1] && getDBResponse.recordset[1].length > 0 ? getDBResponse.recordset[1] : [];
        bcManagersList              = getDBResponse.recordset[2] && getDBResponse.recordset[2].length > 0 ? getDBResponse.recordset[2] : [];
        riskOwnerslist              = getDBResponse.recordset[3] && getDBResponse.recordset[3].length > 0 ? getDBResponse.recordset[3] : [];
        BCMUnitUsersList            = getDBResponse.recordset[4] && getDBResponse.recordset[4].length > 0 ? getDBResponse.recordset[4] : [];
        BCSteeringCommittee         = getDBResponse.recordset[7] && getDBResponse.recordset[7].length > 0 ? getDBResponse.recordset[7] : [];
 
       
 
        let isBCManager         = bcManagersList.some(admin => userIdFromToken === admin.AdminGUID) ? 1 : 0;
        let totalRiskOwners     = riskOwnerslist.map((user) => user.RiskOwnerGUID);
        let totalBCMUnitUsers   = BCMUnitUsersList.map((user) => user.BCMUnitUserGUID);
        let bcmManagersList     = bcManagersList.map((user) => user.AdminGUID);
 
        let filteredBCMUnitUsersList = totalBCMUnitUsers.filter((user) => {
            return !totalRiskOwners.some(id => id === user.RiskOwnerGUID) && !bcmManagersList.some(id => id === user.AdminGUID)
        })
 
        // formatting of IDs from string to number
        siteRiskAssessmentsList.forEach((sra) => {
            sra.SiteRiskAssessmentID = Number(sra.SiteRiskAssessmentID);
            sra.SiteID = Number(sra.SiteID);
            sra["IsRiskOwner"] = 0;
            sra["IsReviewer"] = 0;
            let percentageValue = (sra.OverallCompletionPercentage != null) ? Math.round(parseFloat(sra.OverallCompletionPercentage)) : 0;
            sra.OverallCompletionPercentage = percentageValue + "%";
        })
        // siteRiskAssessmentsList = siteRiskAssessmentsList.filter(n => n["AssessmentCode"]== "TEST-SRA-03")
        // console.log(siteRiskAssessmentsList)
        // to show all the SRAs having start date less than current date for non BCManager users
        if (!(isBCManager == 1)) {
            filteredSiteRiskAssessmentsList = siteRiskAssessmentsList.filter((sral) => {
                // let currentDate = new Date();
                // currentDate = currentDate.toLocaleDateString();
                // let [day, month, year] = currentDate.split('/').map(Number)
                // currentDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
                // let sralStartDate = new Date(sral.StartDate);
                // if (sralStartDate <= currentDate) {
                //     return sral;
                // }
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); 
            
                let sralStartDate = new Date(sral.StartDate);
                sralStartDate.setHours(0, 0, 0, 0); 
            
                return sralStartDate <= currentDate;
                        });
                        
        } else {
            filteredSiteRiskAssessmentsList     = siteRiskAssessmentsList;
        }
 
        BCSteeringCommitteeList = [...new Set(BCSteeringCommittee.map(n => n.SteeringCommiteeUserGUID))]
 
        let SteerringCommitteeAssessmentList = filteredSiteRiskAssessmentsList.filter((assessment) => {
            if (assessment.StatusID == "3" && BCSteeringCommitteeList.includes(userIdFromToken)) {
                assessment['IsBCSteeringCommitee'] = 1
                BCSteeringCommitteeList.push(assessment)
            } else {
                return false;
            }
            return BCSteeringCommitteeList
        })
 
        if (isBCManager == 1) {
            CompletedData = siteRiskAssessmentsList.map(item => ({
                ...item,
                isBCManager: 1,
                IsReviewer :   item.ReviewerID  == userIdFromToken ? 1 : 0
            }));
        } else if(!SteerringCommitteeAssessmentList.length && isBCManager == 0) {
            const userIDWiseAssessments = filteredSiteRiskAssessmentsList.filter(assessment => {
                const assessmentGuids = [
                  assessment.BCSiteChampionID,
                  assessment.SiteAdminHeadID,
                  assessment.ReviewerID,
                  ...JSON.parse(assessment.AssessmentData).map(item => item.ReviewerID),
                  ...JSON.parse(assessment.AssessmentData).flatMap(item => item.SchdeduleRiskAssessment.map(schedule => schedule.RiskOwnerID))
                ];
                return assessmentGuids.filter(Boolean).includes(userIdFromToken);
            });
   
            userIDWiseAssessments.forEach((assessment) => {
                try {
                    const assessmentData        = JSON.parse(assessment.AssessmentData);
                    const riskOwnerIDs          = assessmentData[0].SchdeduleRiskAssessment.map((scheduleRisk) => scheduleRisk.RiskOwnerID);
                    const uniqueRiskOwnerIDs    = [...new Set(riskOwnerIDs)];
                    assessment["RiskOwnerIDs"]  = uniqueRiskOwnerIDs;
 
                        assessment.IsRiskOwner = assessment.RiskOwnerIDs.includes(userIdFromToken) ? 1 : 0
                        assessment.IsReviewer = assessment.ReviewerID == userIdFromToken ? 1 : 0;
                        assessment["IsSiteAdminHead"] = assessment.SiteAdminHeadID == userIdFromToken ? 1: 0;
                        assessment["IsBCSiteChampionID"] = assessment.BCSiteChampionID == userIdFromToken ? 1 : 0;
                    
 
                } catch (error) {
                    return null;
                }
            });
            
            CompletedData = userIDWiseAssessments
        } else {
            CompletedData = SteerringCommitteeAssessmentList
        }
 
        return {
            "SiteRiskAssessments" : CompletedData,
            "StatusData"          : statusData,
            "BCManagersList"      : bcManagersList,
            "IsBCManager"         : [{isBCManager}],
            "RiskOwnersList"      : riskOwnerslist,
            "BCMUnitUsersList"    : BCMUnitUsersList,
            "ExportFileLimit"     : 5
        }
    }
    catch (error) {
        //console.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return null;

    }
}


async function getFormatSiteRiskAssessmentsInfo(userIdFromToken,getDBResponse, accountGUIDFromToken){
  try{
    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsInfo : Execution Started.');

    let siteMasterList          = [];
    let threatCategoryList      = [];
    let risksList               = [];
    let bcManagerList           = [];

    siteMasterList              = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
    risksList                   = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
    bcManagerList               = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];

    // segregating ThreatCategoryList from RisksList
    threatCategoryList  =  risksList.map(risk => {
        let { ThreatCategoryID, ThreatCategory } = risk;
        return { ThreatCategoryID, ThreatCategory };
    });

    let threatCategorySet           = new Set(threatCategoryList.map(JSON.stringify));
    let uniqueThreatCategoryList    = Array.from(threatCategorySet, JSON.parse);

    // formatting string IDs to Number
    siteMasterList.forEach((site) => {
        site.SiteID            = Number(site.SiteID);
        let count              = site.AssessmentCount + 1;
        site["AssessmentCode"] = `${site.ShortCode}-SRA-${count < CONSTANT_FILE_OBJ.APP_CONSTANT.TEN ? '0' : ''}${count}`;
        site["AssessmentName"] = `${site.SiteName}-SRA-${count < CONSTANT_FILE_OBJ.APP_CONSTANT.TEN ? '0' : ''}${count}`;
    })

    risksList.forEach((risk) => {
        risk.RiskID = Number(risk.RiskID)
    })

    logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsInfo : Execution End.');

    return {
      "SiteMasterList"      : siteMasterList,
      "ThreatCategoryList"  : uniqueThreatCategoryList,
      "RisksList"           : risksList,
      "BCManagerList"       : bcManagerList  
    }
  }catch(error){
      logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentsInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
  }
}

async function getFormatSiteRiskAssessmentData(userIdFromToken, DBResponse, accountGUIDFromToken) {
    let siteRiskAssessments     = [];
    let reviewer                = [];
    let workFlowStatus          = [];
    let overAllProgress         = [];
    let summary                 = [];
    let qualifiedStatus         = [];
    let workFlowAction          = [];
    let riskOwner               = [];
    let actionTrail             = [];
    let previousResponses       = [];
    let TotalRisks              = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
    let RespondedRisks          = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
    let summaryBasedonRiskOwners = [];
    let IsSubmitForRiskOwner    = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
    try{

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentData : Execution Started.');
        // Site Risks Data
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                previousResponses = obj.PreviousData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(obj.PreviousData)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                // case : BCM Manager view - modifying the recordset to show the latest value if Risk Owner save and submits the risks.
                if(DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsReviewer || DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN][0].IsBCManager || DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE][0].IsSiteAdminHead || DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN][0].IsBCChampion){
                    let isLatestVisible     = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    isLatestVisible         = [1,2,3, 4, 5, 6, 7].includes(obj.ScheduleRiskAssessmentStatusID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        
                    let ControlsArr        = JSON.parse(obj.Controls) || [];
                    let RiskImpactArr      =  JSON.parse(obj.RiskImpact) || [];
                    if (!(obj.IsCustomRisk == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && obj.PreviousData == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)){
                       
                        siteRiskAssessments.push({
                              "ScheduleRiskAssessmentID"      : Number(obj.ScheduleRiskAssessmentID),
                              "SiteRiskAssessmentID"          : Number(obj.SiteRiskAssessmentID),
                              "AssessmentName"                : obj.AssessmentName,  
                              "AssessmentCode"                : obj.AssessmentCode,
                              "SiteID"                        : Number(obj.SiteID),
                              "ShortCode"                     : obj.ShortCode,
                              "SiteName"                      : obj.SiteName,  
                              "StartDate"                     : obj.StartDate,
                              "EndDate"                       : obj.EndDate,
                              "ThreatRiskID"                  : Number(obj.ThreatRiskID),
                              "RiskTitle"                     : obj.RiskTitle,  
                              "RiskCode"                      : obj.RiskCode,
                              "RiskDescription"               : obj.RiskDescription,
                              "ThreatCategoryID"              : obj.ThreatCategoryID,
                              "ThreatCategory"                : obj.ThreatCategory,  
                              "ExistingControls"              : obj.ExistingControls == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? 'Y' : 'N',
                              "RiskTreatmentStrategyID"       : isLatestVisible ? Number(obj.RiskTreatmentStrategyID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? Number(previousResponses.RiskTreatmentStrategyID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                              "RiskTreatmentStrategyName"     : isLatestVisible ? obj.RiskTreatmentStrategyName : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.RiskTreatmentStrategyName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                              "OverallResidualRiskRatingID"   : isLatestVisible ? Number(obj.OverallResidualRiskRatingID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? Number(previousResponses.OverallResidualRiskRatingID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),  
                              "OverallResidualRiskRating"     : isLatestVisible ? obj.OverallResidualRiskRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.OverallResidualRiskRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                              "OverallInherentRiskRatingID"   : isLatestVisible ? Number(obj.OverallInherentRiskRatingID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? Number(previousResponses.OverallInherentRiskRatingID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                              "OverallInherentRiskRating"     : isLatestVisible ? obj.OverallInherentRiskRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.OverallInherentRiskRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                              "RiskOwnerID"                   : obj.RiskOwnerID,
                              "BCSiteChampionName"            : obj.BCSiteChampionName,
                              "Controls"                      : isLatestVisible ? ControlsArr : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Controls : ControlsArr),
                              "RiskImpact"                    : RiskImpactArr,  
                              "IsCustomRisk"                  : obj.IsCustomRisk,
                              "RiskOwner"                     : obj.RiskOwnerName,
                              "StatusID"                      : Number(obj.StatusID),
                              "Status"                        : obj.Status,
                              "RiskAssessmentStatus"          :  //obj.RiskAssessmentStatus ,
                              isLatestVisible ? obj.RiskAssessmentStatus : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW),
                              "RiskAssessmentStatusID"        : isLatestVisible ? Number(obj.ScheduleRiskAssessmentStatusID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.StatusID : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE),
                              "IsReviewed"                    : isLatestVisible ? obj.IsReviewed : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.IsReviewed : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                              "WorkFlowStatusID"              : Number(obj.AssessmentWrokflowStatusID),
                          });   
                    }

                }else{ //Case: Risk Owner view - modifying the recordset to show the latest value only if BCM Manager saves and submits the risks

                    let isLatestVisible = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    isLatestVisible     = obj.IsReviewed || (obj.IsReviewed == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && [1,2,3,4,5].includes(obj.ScheduleRiskAssessmentStatusID));
                    let ControlsArr     = JSON.parse(obj.Controls) || [];
                    let RiskImpactArr   = JSON.parse(obj.RiskImpact) || [];

                    siteRiskAssessments.push({
                        "ScheduleRiskAssessmentID"      : Number(obj.ScheduleRiskAssessmentID),
                        "SiteRiskAssessmentID"          : Number(obj.SiteRiskAssessmentID),
                        "AssessmentName"                : obj.AssessmentName,
                        "AssessmentCode"                : obj.AssessmentCode,
                        "SiteID"                        : Number(obj.SiteID),
                        "ShortCode"                     : obj.ShortCode,
                        "SiteName"                      : obj.SiteName,
                        "StartDate"                     : obj.StartDate,
                        "EndDate"                       : obj.EndDate,
                        "ThreatRiskID"                  : Number(obj.ThreatRiskID),
                        "RiskTitle"                     : obj.RiskTitle,
                        "RiskCode"                      : obj.RiskCode,
                        "RiskDescription"               : obj.RiskDescription,
                        "ThreatCategoryID"              : obj.ThreatCategoryID,
                        "ThreatCategory"                : obj.ThreatCategory,
                        "ExistingControls"              : obj.ExistingControls == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? 'Y' : 'N',
                        "RiskTreatmentStrategyID"       : Number(obj.RiskTreatmentStrategyID),
                        "RiskTreatmentStrategyName"     : obj.RiskTreatmentStrategyName,
                        "OverallResidualRiskRatingID"   : Number(obj.OverallResidualRiskRatingID),
                        "OverallResidualRiskRating"     : obj.OverallResidualRiskRating,
                        "OverallInherentRiskRatingID"   : Number(obj.OverallInherentRiskRatingID),
                        "OverallInherentRiskRating"     : obj.OverallInherentRiskRating,
                        "RiskOwnerID"                   : obj.RiskOwnerID,
                        "BCSiteChampionName"            : obj.BCSiteChampionName,
                        "Controls"                      : ControlsArr,
                        "RiskImpact"                    : RiskImpactArr,
                        "IsCustomRisk"                  : obj.IsCustomRisk,
                        "RiskOwner"                     : obj.RiskOwnerName,
                        "StatusID"                      : Number(obj.StatusID),
                        "Status"                        : obj.Status,
                        // "RiskAssessmentStatus"          :  obj.RiskAssessmentStatus ,
                        "RiskAssessmentStatus"          : isLatestVisible ? obj.RiskAssessmentStatus : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : obj.RiskAssessmentStatus),
                        "RiskAssessmentStatusID"        : isLatestVisible ? Number(obj.ScheduleRiskAssessmentStatusID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.StatusID : Number(obj.ScheduleRiskAssessmentStatusID)),
                        "IsReviewed"                    : isLatestVisible ? obj.IsReviewed : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        "WorkFlowStatusID"              : Number(obj.AssessmentWrokflowStatusID)
                    });
                }

            }
        }
        
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            summary = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
           
        }  

        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            overAllProgress = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            if(overAllProgress != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && overAllProgress.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                let newDate = new Date(overAllProgress[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CompletedDate);
                overAllProgress[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CompletedDate = newDate.toISOString().split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            }
        } 
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            let BCManager   = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN]
            let IsReviewer  = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsReviewer) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            workFlowStatus  = await getAssessmentLevelWorkFlowActions(userIdFromToken,siteRiskAssessments,IsReviewer,BCManager);
        }
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            qualifiedStatus = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        } 
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            workFlowAction = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        }
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            riskOwner = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
        }   
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            reviewer = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
        } 
        if (reviewer[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsReviewer == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            actionTrail = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];
        } else if (riskOwner[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsRiskOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            actionTrail = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].filter(ob => ob.UserGUID == userIdFromToken);
        } 

        // console.log(summary)
        // calculating the OverallPercentage
        if (summary.length) {
            for (const obj of Object.values(summary)) {
                TotalRisks = obj.TotalRisks + TotalRisks;
                RespondedRisks = obj.RespondedRisks + RespondedRisks;
            }    
            let OverallPercentage =  (RespondedRisks / TotalRisks) * 100;
            overAllProgress.push({ "OverallPercentage": Math.round(OverallPercentage) });  
        } else {
            overAllProgress.push({"OverallPercentage" : 0})
        }

        /**
         * delayed response scenario when EndDate is equals to or greater than current date
         * clubbing the total risks based on risk owner id for BCManager review page : START
         */
        let modifiedObject = {}

        summary.forEach((item) => {
            const { RiskOwnerID, TotalRisks, RespondedRisks, ScheduleRiskAssessmentStatusID, ResubmittedStatus } = item;
            if (modifiedObject[RiskOwnerID]) {
                if(ScheduleRiskAssessmentStatusID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE || ScheduleRiskAssessmentStatusID === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO 
                    && ResubmittedStatus == ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.RE_SUBMITTED || (ScheduleRiskAssessmentStatusID === CONSTANT_FILE_OBJ.APP_CONSTANT.THREE 
                    && ResubmittedStatus === ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.RE_SUBMITTED)) {
                    for (const prop in modifiedObject[RiskOwnerID]) {
                        if(prop != 'TotalRisks' && prop != 'RespondedRisks') {
                            modifiedObject[RiskOwnerID][prop] = item[prop];
                        }
                    }
                }
                modifiedObject[RiskOwnerID].TotalRisks += TotalRisks;
                modifiedObject[RiskOwnerID].RespondedRisks += RespondedRisks;
            } else {
                modifiedObject[RiskOwnerID] = { ...item };
            }
        });
       

        // END
        
        // Assigning different Risk Status based ScheduleRiskAssessmentStatusID, Start Date and End Date conditions for SRA summary column.
        let objectArray = Object.values(modifiedObject);
        
        objectArray.forEach((singleObject) => {
            let currentDate     = new Date();
            let onlyCurrentDate = currentDate.toISOString().split("T")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]
            let sraEndDate      = new Date(overAllProgress[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate);
            let onlySRAEndDate  = sraEndDate.toISOString().split("T")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            if (onlySRAEndDate < onlyCurrentDate && (singleObject.QualifiedStatusName == ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW || singleObject.QualifiedStatusName == ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.DRAFT || singleObject.QualifiedStatusName == ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.RETURN_WITH_COMMENT)) {
                singleObject.QualifiedStatusName = ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.DELAYED_RESPONSE;
            } else if (onlySRAEndDate >= onlyCurrentDate && (singleObject.ScheduleRiskAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || singleObject.ScheduleRiskAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO)) {
                if (singleObject.ResubmittedStatus == ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.RE_SUBMITTED){
                    singleObject.QualifiedStatusName = ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.RETURN_WITH_COMMENT;
                }else{
                    singleObject.QualifiedStatusName = singleObject.QualifiedStatusName
                    // ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW;
                }
            }
            else if (onlySRAEndDate >= onlyCurrentDate && (singleObject.ScheduleRiskAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX)) {
                singleObject.QualifiedStatusName = ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.RESPONDED;
            }
            //  else if (onlySRAEndDate > onlyCurrentDate && (singleObject.ScheduleRiskAssessmentStatusID != CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN)) {
            //     console.log("1")
            //     singleObject.QualifiedStatusName = ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.REVIEW_PENDING;
            // } else if (onlySRAEndDate = onlyCurrentDate && (singleObject.ScheduleRiskAssessmentStatusID != CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN)) {
            //     singleObject.QualifiedStatusName = ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.REVIEW_PENDING;
            // } 
            else {
                singleObject.QualifiedStatusName = singleObject.QualifiedStatusName
            }
        })
  


        //Merging the flag and assessmentDetails of each risk to check Risk Owner is active or not 
        if(siteRiskAssessments != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&  siteRiskAssessments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let data of Object.values(siteRiskAssessments)){
                if(DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                    for(let userDataObj of Object.values(DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN])){
                        if(data.ThreatRiskID == userDataObj.ThreatRiskID){
                            data['IsRiskOwnerActive'] = userDataObj.ActiveUser;
                        }
                    }
                }
            }
        }

        IsSubmitForRiskOwner    = siteRiskAssessments.filter(nn => nn.RiskOwnerID === userIdFromToken && nn.RiskAssessmentStatusID != 6).every(n => n.RiskAssessmentStatusID == 2)

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentData : Execution End.');

    
        return {
            "siteRiskAssessments"   : siteRiskAssessments,
            "workFlowStatus"        : workFlowStatus,   
            "summary"               :  summary,
            "overAllProgress"       : overAllProgress,
            "qualifiedStatus"       : qualifiedStatus,
            "workFlowAction"        : workFlowAction,
            "riskOwner"             : riskOwner,            
            "reviewer"              : reviewer,
            "isBCManager"           : DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN],
            "IsSiteAdminHead"       : DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE],
            "IsBCChampion"          : DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN],
            "actionTrail"           : actionTrail,
            "IsSubmitForRiskOwner"  : IsSubmitForRiskOwner
        }
    } catch(error){
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSiteRiskAssessmentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
          return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;       
    }
}  

async function getFormatRiskAssessmentActionTrail(userIdFromToken,DBResponse, accountGUIDFromToken) {
    try {
      logger.log('info', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getFormatRiskAssessmentActionTrail : Execution started. ');
      
      let actionTrailList       = [];
      let CommentsHistoryArr    = [];
      let actionTrails          = [];
      let BCManagerGUID         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
     
      if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
            actionTrailList     = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]
            BCManagerGUID       = actionTrailList.BCManagerID;
            let CommentsHistory = actionTrailList.CommentsHistory != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(actionTrailList.CommentsHistory) : []
            let RiskOwnerGUIDs  =  []

            for(const obj of Object.values(JSON.parse(actionTrailList.RiskOwnerData))) {
                RiskOwnerGUIDs.push(obj.RiskOwnerGUID);
            }

            //Case: BCManager View - Sending comments history  of all riskowners along with BCMananger Comments
            if(BCManagerGUID == userIdFromToken){
                CommentsHistoryArr  = CommentsHistory || [];
            }
            else if(RiskOwnerGUIDs.includes(userIdFromToken)){//Case:RiskOWner View - Sending comments history based on loggedin user along with BCManager comments
                CommentsHistoryArr  = CommentsHistory.filter(ele=>ele.UserGUID == userIdFromToken || BCManagerGUID == ele.UserGUID) || [];
            }
            else{
                CommentsHistoryArr  = CommentsHistory || [];     
            }
            actionTrails.push({                          
                "SiteID"                        : Number(actionTrailList.SiteID),
                "SiteRiskAssessmentID"          : Number(actionTrailList.SiteRiskAssessmentID),
                "CommentsHistory"               : CommentsHistoryArr.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? CommentsHistoryArr.sort((a,b) => b.ActionTrailID - a.ActionTrailID) : [], 
            });   

        }      
   
      logger.log('info', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getFormatRiskAssessmentActionTrail : Execution end.');
       
      return { "actionTrailList" : actionTrails };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : getFormatRiskAssessmentActionTrail : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatSRAReportData(userIdFromToken, sraDBResponse, accountGUIDFromToken){
    let SRAList             = [];
    let BCManagersList      = [];
    let BCMUserUnitsList    = [];
    let FunctionAdminsList  = [];
    try{

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSRAReportData : Execution Started.');

        if (sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {

            // Fetching all BCManagers GUIDs
            for(const bcManagerObj of Object.values(sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                BCManagersList.push(bcManagerObj.BCManagerGUID);
            }
        }

        if (sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {

            // Fetching all BCM Unit Users GUIDs
            for(const bcmUnitUserObj of Object.values(sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                BCMUserUnitsList.push(bcmUnitUserObj.BCMUnitUserGUID);
            }
        }

        if (sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {

            // Fetching all Funcitonal Admin GUIDs
            for(const funcAdminObj of Object.values(sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                FunctionAdminsList.push(funcAdminObj.FunctionalAdminGUID);
            }
        }

        //Risk Data
        if (sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {

            //Manupulating Resultset for Risks
            for(const obj of Object.values(sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
    
                let actionPlans = [];
                let riskDetails = [];

                if(obj.Risks != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(const riskObj of Object.values(JSON.parse(obj.Risks))){
                        //action plans against each risk
                        if(riskObj.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            for(const actionPlanObj of Object.values(riskObj.ActionPlans)){
                                actionPlans.push({
                                    actionID            : Number(actionPlanObj.RiskActionPlanID),
                                    actionItem          : actionPlanObj.IdentifiedActionItem,
                                    startDate           : actionPlanObj.StartDate,
                                    targetDate          : actionPlanObj.TargetDate,
                                    actionItemOwnerID   : actionPlanObj.ActionItemOwnerID,
                                    actionItemOwner     : actionPlanObj.ActionItemOwner
                                })
                            }
                        }

                        let controls = [];
                        if(riskObj.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            let visibleControls = riskObj.Controls;
                            let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                            let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                            controls = [...masterControls,...customContorls];
                        }

                        riskDetails.push({   
                            "SiteRiskAssessmentID"        : Number(obj.SiteRiskAssessmentID),
                            "AssessmentName"              : obj.AssessmentName,
                            "AssessmentCode"              : obj.AssessmentCode,
                            "StartDate"                   : obj.StartDate,
                            "EndDate"                     : obj.EndDate,
                            "SiteRiskAssessmentStatusID"  : obj.SiteRiskAssessmentstatusID,
                            "SiteRiskAssessmentStatus"    : obj.SiteRiskAssessmentstatus,
                            "SiteID"                      : Number(obj.SiteID),
                            "SiteName"                    : obj.SiteName,
                            "ShortCode"                   : obj.ShortCode,
                            "ScheduleRiskAssessmentID"    : riskObj.ScheduleRiskAssessmentID,
                            "ThreatRiskID"                : riskObj.ThreatRiskID,
                            "RiskTitle"                   : riskObj.RiskTitle,
                            "RiskCode"                    : riskObj.RiskCode,
                            "RiskDescription"             : riskObj.Description,
                            "Controls"                    : controls,
                            "RiskImpact"                  : riskObj.RiskImpact,
                            "ThreatCategoryID"            : riskObj.ThreatCategoryID,
                            "ThreatCategory"              : riskObj.ThreatCategory,
                            "ExistingControls"            : riskObj.ExistingControls,
                            "RiskOwnerID"                 : riskObj.RiskOwnerID,
                            "RiskOwnerName"               : riskObj.RiskOwnerName,
                            "IsCustomRisk"                : riskObj.IsCustomRisk,
                            "RiskTreatmentStrategyID"     : riskObj.RiskTreatmentStrategyID,
                            "RiskTreatmentStrategyName"   : riskObj.RiskTreatmentStrategyName,
                            "OverallResidualRiskRatingID" : riskObj.OverallResidualRiskRatingID,
                            "OverallResidualRiskRating"   : riskObj.OverallResidualRiskRating,
                            "OverallInherentRiskRatingID" : riskObj.OverallInherentRiskRatingID,
                            "OverallInherentRiskRating"   : riskObj.OverallInherentRiskRating,
                            "StatusID"                    : Number(riskObj.StatusID),
                            "Status"                      : riskObj.Status,
                            "WorkFlowStatusID"            : riskObj.AssessmentWrokflowStatusID,
                            "ControlEffectivenessID"      : riskObj.ControlEffectivenessID,
                            "ControlEffectiveness"        : riskObj.ControlEffectiveness,
                            "ResidualLikelihoodRatingID"  : riskObj.ResidualLikelihoodRatingID,
                            "ResidualLikelihoodRating"    : riskObj.ResidualLikelihoodRating,
                            "ResidualImpactRatingID"      : riskObj.ResidualImpactRatingID,
                            "ResidualImpactRating"        : riskObj.ResidualImpactRating,
                            "InherentLikelihoodRatingID"  : riskObj.InherentLikelihoodRatingID,
                            "InherentLikelihoodRating"    : riskObj.InherentLikelihoodRating,
                            "InherentImpactRatingID"      : riskObj.InherentImpactRatingID,
                            "InherentImpactRating"        : riskObj.InherentImpactRating,
                            "ResidualRiskDescription"     : riskObj.ResidualRiskDescription,
                            "RiskTolerateExplanation"     : riskObj.RiskTolerateExplanation,
                            "ActionPlans"                 : actionPlans.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? actionPlans : [],
                            "IsReviewed"                  : riskObj.IsReviewed,
                            "CommentsHistory"             : riskObj.CommentsHistory,
                            "RiskAssessmentStatus"        : riskObj.Status
                        });
                        actionPlans = [];
                    }
                }

                // checking if logged-in User is RiskOwner or not,if Riskowner filtering risk which is relevant for that User else providing all risks
                if(BCManagersList.includes(userIdFromToken) || FunctionAdminsList.includes(userIdFromToken) || BCMUserUnitsList.includes(userIdFromToken)){  //Case:: BCmanager/BCMUserUnitsList/FunctionalAdmin   
                    riskDetails = riskDetails;
                }
                else //Case:: RiskOwner
                { 
                    riskDetails = riskDetails.filter(ele=>ele.RiskOwnerID == userIdFromToken);
                }

                SRAList.push({   
                    "SiteRiskAssessmentID"        : Number(obj.SiteRiskAssessmentID),
                    "AssessmentName"              : obj.AssessmentName,
                    "AssessmentCode"              : obj.AssessmentCode,
                    "SiteID"                      : Number(obj.SiteID),
                    "SiteName"                    : obj.SiteName,
                    "ShortCode"                   : obj.ShortCode,
                    "StartDate"                   : obj.StartDate,
                    "EndDate"                     : obj.EndDate,
                    "SiteRiskAssessmentStatusID"  : Number(obj.SiteRiskAssessmentstatusID),
                    "SiteRiskAssessmentStatus"    : obj.SiteRiskAssessmentstatus,
                    "Risks"                       : riskDetails
                });               
            }
        } 
        
        
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSRAReportData : Execution End.');
    
        return {
            "SiteAssessmentsDetails"       : SRAList
        }    
        
      }catch(error){
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatSRAReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
          return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
       
      }
    
}

async function getFormatRiskRating(userIdFromToken,getRiskRating,type, accountGUIDFromToken){
    let riskRating = [];
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskRating : Execution Started.');

        if(getRiskRating.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){

            if(type == ENUMS_OBJ.RISK_RATING_TYPES.INHERENT_RISK_RATING){
                riskRating = [];
                riskRating.push({
                    "OverallInherentRiskRatingID"   : getRiskRating[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OverallInherentRiskRatingID,
                    "OverallInherentRiskRating"     : getRiskRating[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OverallInherentRiskRating
                })
            }
            if(type == ENUMS_OBJ.RISK_RATING_TYPES.RESIDUAL_RISK_RATING){
                riskRating = [];
                riskRating.push({
                    "OverallResidualRiskRatingID"   : getRiskRating[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OverallResidualRiskRatingID,
                    "OverallResidualRiskRating"     : getRiskRating[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OverallResidualRiskRating
                })
                
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskRating : Execution End.');

        return {
            "OverAllRiskRating" : riskRating
        }
    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
    }
}

async function getFormatExportDraftReportData(userIdFromToken, sraDBResponse, accountGUIDFromToken) {
    let draftReportData     = [];
    let riskDetails         = [];
    let actionPlans         = [];
    let previousResponses   = [];
    let BCManagerLists      = [];
    let RiskOwnersLists     = [];
    let RiskOwnersArray     = [];
    let BCMManagersArray    = [];

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatExportDraftReportData : Execution Started.');

        BCManagerLists      = sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        RiskOwnersLists     = sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
  
        if (sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(sraDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                let RisksArr = JSON.parse(obj.Risks) || [];
                    
                if (RisksArr != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && RisksArr.length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && RisksArr != []) {

                    for (const riskObj of Object.values(RisksArr)) {
                        previousResponses = riskObj.length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && riskObj.PreviousData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && riskObj.PreviousData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ? JSON.parse(riskObj.PreviousData)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        RiskOwnersArray = RiskOwnersLists.map(ele => ele.RiskOwnerGUID);
                        BCMManagersArray = BCManagerLists.map(ele => ele.BCManagerGUID);
                        riskObj["IsRiskOwner"] = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        riskObj["IsReviewer"] = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                        if(RiskOwnersArray.length && RiskOwnersArray.includes(userIdFromToken)){
                            riskObj.IsRiskOwner = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                            riskObj.IsReviewer = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                        }
                        if(BCMManagersArray.length && BCMManagersArray.includes(userIdFromToken)){
                            riskObj.IsRiskOwner = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                            riskObj.IsReviewer = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                        }
                        // Case : BCM Manager view
                        
                        if (riskObj.IsReviewer === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                            let isLatestVisible     = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                            isLatestVisible         = [3,4,5,6,7].includes(riskObj.StatusID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                                
                            if(!(riskObj.IsCustomRisk == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && isLatestVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)){

                                let actionPlans         = [];
                                let actionsPlansList    = isLatestVisible ? 
                                    (riskObj.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? riskObj.ActionPlans : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) :
                                    (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && previousResponses.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(previousResponses.ActionPlans) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                                    
                                    if (actionsPlansList != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                                        for (const actionPlanObj of Object.values(actionsPlansList)) {
                                            actionPlans.push({
                                                actionID            : Number(actionPlanObj.RiskActionPlanID),
                                                actionItem          : actionPlanObj.IdentifiedActionItem,
                                                startDate           : actionPlanObj.StartDate,
                                                targetDate          : actionPlanObj.TargetDate,
                                                actionItemOwnerID   : actionPlanObj.ActionItemOwnerID,
                                                actionItemOwner     : actionPlanObj.ActionItemOwner
                                            })
                                        }
                                    }

                                let controls = [];
                                if(riskObj.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                                    if(isLatestVisible){
                                        let visibleControls = riskObj.Controls.filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
                                        let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                        let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                        controls = [...masterControls,...customContorls]
                                    }else{
                                        if(previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && previousResponses.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                                            let visibleControls = JSON.parse(previousResponses.Controls);
                                            let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                            let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                            controls = [...masterControls,...customContorls];
                                        }else{
                                            let visibleControls = riskObj.Controls.filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
                                            let masterControls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                            let customContorls = (visibleControls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                            controls = [...masterControls,...customContorls]
                                        }
                                    }
                                }

                                riskDetails.push({
                                    "ScheduleRiskAssessmentID"          : riskObj.ScheduleRiskAssessmentID,
                                    "ThreatRiskID"                      : riskObj.ThreatRiskID,
                                    "RiskTitle"                         : riskObj.RiskTitle,
                                    "RiskCode"                          : riskObj.RiskCode,
                                    "RiskDescription"                   : riskObj.Description,
                                    "Controls"                          : controls,
                                    "RiskImpact"                        : riskObj.RiskImpact,
                                    "ThreatCategoryID"                  : riskObj.ThreatCategoryID,
                                    "ThreatCategory"                    : riskObj.ThreatCategory,
                                    "ExistingControls"                  : isLatestVisible ? riskObj.ExistingControls : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ExistingControls : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "RiskOwnerID"                       : riskObj.RiskOwnerID,
                                    "RiskOwnerName"                     : riskObj.RiskOwnerName,
                                    "RiskTreatmentStrategyID"           : isLatestVisible ? riskObj.RiskTreatmentStrategyID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.RiskTreatmentStrategyID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "RiskTreatmentStrategyName"         : isLatestVisible ? riskObj.RiskTreatmentStrategyName : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.RiskTreatmentStrategyName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "OverallResidualRiskRatingID"       : isLatestVisible ? riskObj.OverallResidualRiskRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.OverallResidualRiskRatingID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "OverallResidualRiskRating"         : isLatestVisible ? riskObj.OverallResidualRiskRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.OverallResidualRiskRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "OverallInherentRiskRatingID"       : isLatestVisible ? riskObj.OverallInherentRiskRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.OverallInherentRiskRatingID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "OverallInherentRiskRating"         : isLatestVisible ? riskObj.OverallInherentRiskRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.OverallInherentRiskRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "StatusID"                          : isLatestVisible ? Number(riskObj.StatusID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? Number(previousResponses.StatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE),
                                    "Status"                            : isLatestVisible ? riskObj.Status : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW),
                                    "WorkFlowStatusID"                  : riskObj.AssessmentWrokflowStatusID,
                                    "ControlEffectivenessID"            : isLatestVisible ? riskObj.ControlEffectivenessID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ControlEffectivenessID : riskObj.MasterControlEffectivenessID),
                                    "ControlEffectiveness"              : isLatestVisible ? riskObj.ControlEffectiveness : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ControlEffectiveness : riskObj.MasterControlEffectiveness),
                                    "ResidualLikelihoodRatingID"        : isLatestVisible ? riskObj.ResidualLikelihoodRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ResidualLikelihoodRatingID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "ResidualLikelihoodRating"          : isLatestVisible ? riskObj.ResidualLikelihoodRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ResidualLikelihoodRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "ResidualImpactRatingID"            : isLatestVisible ? riskObj.ResidualImpactRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ResidualImpactRatingID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "ResidualImpactRating"              : isLatestVisible ? riskObj.ResidualImpactRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ResidualImpactRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "InherentLikelihoodRatingID"        : isLatestVisible ? riskObj.InherentLikelihoodRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.InherentLikelihoodRatingID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "InherentLikelihoodRating"          : isLatestVisible ? riskObj.InherentLikelihoodRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.InherentLikelihoodRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "InherentImpactRatingID"            : isLatestVisible ? riskObj.InherentImpactRatingID : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.InherentImpactRatingID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "InherentImpactRating"              : isLatestVisible ? riskObj.InherentImpactRating : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.InherentImpactRating : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "ResidualRiskDescription"           : isLatestVisible ? riskObj.ResidualRiskDescription : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.ResidualRiskDescription : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "RiskTolerateExplanation"           : isLatestVisible ? riskObj.RiskTolerateExplanation : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.RiskTolerateExplanation : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "IsRiskOwner"                       : riskObj.IsRiskOwner,
                                    "IsReviewer"                        : riskObj.IsReviewer,
                                    "IsReviewed"                        : isLatestVisible ? riskObj.IsReviewed : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.IsReviewed : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                    "StartDate"                         : obj.StartDate,
                                    "EndDate"                           : obj.EndDate,
                                    "AssessmentName"                    : obj.AssessmentName,
                                    "AssessmentCode"                    : obj.AssessmentCode,
                                    "SiteRiskAssessmentStatusID"        : obj.SiteRiskAssessmentstatusID,
                                    "SiteRiskAssessmentStatus"          : obj.SiteRiskAssessmentstatus,
                                    "ActionPlans"                       : actionPlans.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? actionPlans : [],
                                    "CommentsHistory"                   : riskObj.CommentsHistory,
                                    "RiskAssessmentStatus"              : isLatestVisible ? riskObj.Status : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW),
                                });
                            }
                        } else {
                            let isLatestVisible     = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                            isLatestVisible = riskObj.IsReviewed == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE || (riskObj.IsReviewed == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && [1, 2, 3, 4].includes(riskObj.StatusID));

                            let actionPlans         = [];
                            if(riskObj.ActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                                for(const actionPlanObj of Object.values(riskObj.ActionPlans)){
                                    actionPlans.push({
                                        actionID            : Number(actionPlanObj.RiskActionPlanID),
                                        actionItem          : actionPlanObj.IdentifiedActionItem,
                                        startDate           : actionPlanObj.StartDate,
                                        targetDate          : actionPlanObj.TargetDate,
                                        actionItemOwnerID   : actionPlanObj.ActionItemOwnerID,
                                        actionItemOwner     : actionPlanObj.ActionItemOwner
                                    })
                                }
                            }

                          

                            let controls = [];
                            if(riskObj.Controls != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                                let masterControls = (riskObj.Controls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                let customContorls = (riskObj.Controls.filter(ele=>ele.IsMasterControl == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)).sort((a,b)=>a.ThreatLibraryControlsID - b.ThreatLibraryControlsID); //ascending order
                                controls = [...masterControls,...customContorls];
                            }

                            riskDetails.push({
                                "ScheduleRiskAssessmentID"      : riskObj.ScheduleRiskAssessmentID,
                                "ThreatRiskID"                  : riskObj.ThreatRiskID,
                                "RiskTitle"                     : riskObj.RiskTitle,
                                "RiskCode"                      : riskObj.RiskCode,
                                "RiskDescription"               : riskObj.Description,
                                "Controls"                      : controls, 
                                "RiskImpact"                    : riskObj.RiskImpact,
                                "ThreatCategoryID"              : riskObj.ThreatCategoryID,
                                "ThreatCategory"                : riskObj.ThreatCategory,
                                "ExistingControls"              : riskObj.ExistingControls, 
                                "RiskOwnerID"                   : riskObj.RiskOwnerID,
                                "RiskOwnerName"                 : riskObj.RiskOwnerName,
                                "RiskTreatmentStrategyID"       : riskObj.RiskTreatmentStrategyID,
                                "RiskTreatmentStrategyName"     : riskObj.RiskTreatmentStrategyName,
                                "OverallResidualRiskRatingID"   : riskObj.OverallResidualRiskRatingID,
                                "OverallResidualRiskRating"     : riskObj.OverallResidualRiskRating,
                                "OverallInherentRiskRatingID"   : riskObj.OverallInherentRiskRatingID,
                                "OverallInherentRiskRating"     : riskObj.OverallInherentRiskRating,
                                "StatusID"                      : isLatestVisible ? Number(riskObj.StatusID) : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? Number(previousResponses.StatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE),
                                "Status"                        : isLatestVisible ? riskObj.Status : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW),
                                "WorkFlowStatusID"              : riskObj.AssessmentWrokflowStatusID,
                                "ControlEffectivenessID"        : riskObj.ControlEffectivenessID,
                                "ControlEffectiveness"          : riskObj.ControlEffectiveness,
                                "ResidualLikelihoodRatingID"    : riskObj.ResidualLikelihoodRatingID,
                                "ResidualLikelihoodRating"      : riskObj.ResidualLikelihoodRating,
                                "ResidualImpactRatingID"        : riskObj.ResidualImpactRatingID,
                                "ResidualImpactRating"          : riskObj.ResidualImpactRating,
                                "InherentLikelihoodRatingID"    : riskObj.InherentLikelihoodRatingID,
                                "InherentLikelihoodRating"      : riskObj.InherentLikelihoodRating,
                                "InherentImpactRatingID"        : riskObj.InherentImpactRatingID,
                                "InherentImpactRating"          : riskObj.InherentImpactRating,
                                "ResidualRiskDescription"       : riskObj.ResidualRiskDescription,
                                "RiskTolerateExplanation"       : riskObj.RiskTolerateExplanation,
                                "IsRiskOwner"                   : riskObj.IsRiskOwner,
                                "IsReviewer"                    : riskObj.IsReviewer,
                                "IsReviewed"                    : isLatestVisible ? riskObj.IsReviewed : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                "StartDate"                     : obj.StartDate,
                                "EndDate"                       : obj.EndDate,
                                "AssessmentName"                : obj.AssessmentName,
                                "AssessmentCode"                : obj.AssessmentCode,
                                "SiteRiskAssessmentStatusID"    : obj.SiteRiskAssessmentstatusID,
                                "SiteRiskAssessmentStatus"      : obj.SiteRiskAssessmentstatus,
                                "ActionPlans"                   : actionPlans.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? actionPlans : [],
                                "CommentsHistory"               : isLatestVisible ? riskObj.CommentsHistory : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.CommentsHistory != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(previousResponses.CommentsHistory).sort((a, b) => b.RiskReviewCommentID - a.RiskReviewCommentID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                                "RiskAssessmentStatus"          : isLatestVisible ? riskObj.Status : (previousResponses != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? previousResponses.Status : ENUMS_OBJ.SRA_WORKFLOW_N_REVIEW_STATUS.NEW),
                            });
                        }
                    }
                }

                draftReportData.push({
                    "SiteID"                        : Number(obj.SiteID),
                    "SiteRiskAssessmentID"          : Number(obj.SiteRiskAssessmentID),
                    "SiteRiskAssessmentstatusID"    : Number(obj.SiteRiskAssessmentstatusID),
                    "AssessmentName"                : obj.AssessmentName,
                    "AssessmentCode"                : obj.AssessmentCode,
                    "ShortCode"                     : obj.ShortCode,
                    "SiteName"                      : obj.SiteName,
                    "StartDate"                     : obj.StartDate,
                    "EndDate"                       : obj.EndDate,
                    "SiteRiskAssessmentStatusID"    : Number(obj.SiteRiskAssessmentstatusID),
                    "SiteRiskAssessmentStatus"      : obj.SiteRiskAssessmentstatus,
                    "Risks"                         : riskDetails,
                    "TotalNumberOfRisk"             : riskDetails.length
                });
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatExportDraftReportData : Execution End.');
        return {
            "SiteAssessmentsDetails": draftReportData,
            "BCMManagerList"        : BCManagerLists,
            "RiskOwnerList"         : RiskOwnersLists
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatExportDraftReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getAssessmentLevelWorkFlowActions(userIdFromToken,siteRiskAssessments,isReviewer,BCManager, accountGUIDFromToken){
    let workFlowAction = {
        CurrentStep         : '',
        NextStep            : '',
        WorkFlowButtonName  : ''
    }
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getAssessmentLevelWorkFlowActions : Execution Start.');

        let RiskAssessmentStatusIDs = [];
        let IsReviewedFlags         = [];

        // fetching all RiskAssessmentStatusIDs from the siteRiskAssessments
        for (const obj of Object.values(siteRiskAssessments)) {
            RiskAssessmentStatusIDs.push(obj.RiskAssessmentStatusID);
            IsReviewedFlags.push(obj.IsReviewed);
        }
       

        if(isReviewer || BCManager[0].IsBCManager){ //Case : BCManagerView
            if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) && siteRiskAssessments[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){// Status = New && AssessmentStatus = Scheduled
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.NOT_STARTED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SCHEDULED;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else  if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) && siteRiskAssessments[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){// AssessmentStatus = Inprogress
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.DRAFT;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SUBMIT_FOR_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else if( RiskAssessmentStatusIDs.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)){// Status = partially RO Responded
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.DRAFT;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SUBMIT_FOR_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) || RiskAssessmentStatusIDs.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) || RiskAssessmentStatusIDs.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR)){// Status = every RO responded
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.RESPONDED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.UNDER_BCM_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else if(RiskAssessmentStatusIDs.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) && IsReviewedFlags.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)){// Status = Rejected(Not Submitted)
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.RESPONDED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.UNDER_BCM_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else if(RiskAssessmentStatusIDs.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE)){// Status = Rejected
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.DRAFT;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SUBMIT_FOR_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) && IsReviewedFlags.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)){// Status = Approved(Not Submitted)
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.APPROVED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.TO_BE_PUBLISHED;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }else if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) && IsReviewedFlags.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)){// Status = Approved(Submitted)
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.APPROVED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.TO_BE_PUBLISHED;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.PUBLISH;
            }else if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN)){// Status = Published
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.PUBLISHED;
                workFlowAction.NextStep             = '';
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.PUBLISH;
            } else if(RiskAssessmentStatusIDs.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO)){// Status = Draft
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.DRAFT;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SUBMIT_FOR_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else{ //Default
                workFlowAction.CurrentStep          = '';
                workFlowAction.NextStep             = '';
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.TAKE_REVIEW_ACTION;
            }
        }else{//Case: Risk Owner View
            if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)){// Status = New
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.NOT_STARTED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SCHEDULED;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else if(RiskAssessmentStatusIDs.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO)){// Status = Draft
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.DRAFT;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SUBMIT_FOR_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else if(RiskAssessmentStatusIDs.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) || RiskAssessmentStatusIDs.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR)){// Status = Responded
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.RESPONDED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.UNDER_BCM_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else if(RiskAssessmentStatusIDs.some(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE)){// Status =  any Rejected
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.DRAFT;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.SUBMIT_FOR_REVIEW;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX)) {// Status = Approved
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.APPROVED;
                workFlowAction.NextStep             = ENUMS_OBJ.WORKFLOW_STATUS.TO_BE_PUBLISHED;
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else if(RiskAssessmentStatusIDs.every(id => id == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN)){// Status = Published
                workFlowAction.CurrentStep          = ENUMS_OBJ.WORKFLOW_STATUS.PUBLISHED;
                workFlowAction.NextStep             = '';
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }else{ //Default
                workFlowAction.CurrentStep          = '';
                workFlowAction.NextStep             = '';
                workFlowAction.WorkFlowButtonName   = ENUMS_OBJ.WORKFLOW_ACTION_BUTTONS.SUBMIT_FOR_REVIEW;
            }  
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getAssessmentLevelWorkFlowActions : Execution End.');
        return [workFlowAction];
    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getAssessmentLevelWorkFlowActions : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return [workFlowAction];
    }
}

async function getFormatEvidenceList(userIdFromToken,evidenceAttachmentsResponse ,source, accountGUIDFromToken){
    let evidences = [];
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatEvidenceList : Execution start.'+ evidenceAttachmentsResponse); 

           // Result Set 1: Uploaded evidence list 
           if(evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let evObj of Object.values(evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                evidences.push({
                    "AttachmentID"      : evObj.EvidenceID,
                    "AttachmentName"    : evObj.FileName,
                    "CreatedDate"       : evObj.CreatedDate,
                    "AttachmentType"    : evObj.FileType,
                    "FileContent"       : source == 'download' ? evObj.Content : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, 
                    "FileContentID"     : evObj.FileContentID,
                    "IsVisible"         : evObj.IsVisible,
                    "CreatedBy"         : evObj.CreatedBy      
                })

            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatEvidenceList : Execution end.'); 
        return {
            "attachmentDetails" : evidences
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatEvidenceList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


/**
* This is function will be used to return single instance of class.
*/
function getSiteRiskAssessmentsBLClassInstance() {
    if (SiteRiskAssessmentsBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        SiteRiskAssessmentsBLClassInstance = new SiteRiskAssessmentsBl();
    }
    return SiteRiskAssessmentsBLClassInstance;
}

exports.getSiteRiskAssessmentsBLClassInstance = getSiteRiskAssessmentsBLClassInstance;
