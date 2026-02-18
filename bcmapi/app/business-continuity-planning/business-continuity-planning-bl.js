const MESSAGE_FILE_OBJ              = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ             = require("../../utility/constants/constant.js");
const APP_VALIDATOR                 = require("../../utility/app-validator.js");
const BUSINESS_CONTINUITY_PLAN_DB   = require("../../data-access/business-continuity-planning-db.js");
const ENUMS_OBJ                     = require("../../utility/enums/enums.js");
const COMPUTATION_OBJ               = require("../../utility/computations.js");
const { logger }                    = require("../../utility/log-manager/log-manager.js");
const { Container }                 = require("winston");
const UTILITY_APP                   = require("../../utility/utility.js");
const BCP_TEMPLATE                  = require("./../../config/email-template/generic-bcp-template.js");
const EMAIL_NOTIFICATION            = require("../../utility/email-notification.js");
const APP_CONFIG_FILE_OBJ           = require('../../config/app-config.js');
const INAPP_DB                      = require("../../data-access/inApp-notification-db.js")
const RISK_RATING_DB                = require("../../data-access/masters/risk-rating-db.js");

var BusinessContinuityPlansBLClassInstance      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var businessContinuityPlanDB                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject                          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var computationUtilityObj                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject                            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailNotificationObject                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskRatingDB                                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BusinessContinuityPlansBl {
    constructor() {
        businessContinuityPlanDB    = new BUSINESS_CONTINUITY_PLAN_DB();
        appValidatorObject          = new APP_VALIDATOR();
        computationUtilityObj       = new COMPUTATION_OBJ();
        utilityAppObject            = new UTILITY_APP();
        emailNotificationObject     = new EMAIL_NOTIFICATION();
        inAppNotificationDbObject   = new INAPP_DB();
        riskRatingDB                = new RISK_RATING_DB();
    }

    start() { }

    /**
    * This function will submit the business continuity plan with review comments in the database
    */
    async getBusinessContinuityPlansList(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let businessContPlanData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {

            if (request.body.data !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                businessContPlanData = {
                    BusinessContinuityPlanID: request.body.data.BusinessContinuityPlanID,
                    BusinessFunctionID: request.body.data.BusinessFunctionID
                }
            } else {
                businessContPlanData = {
                    BusinessContinuityPlanID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    BusinessFunctionID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                }
            }

            // console.log("Business Continuity Plan List Payload : ", data);

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessContPlanData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessContPlanData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : businessContPlanData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution started.');

            const BUSINESS_CONT_PLANS_LIST_DB_RESPONSE = await businessContinuityPlanDB.getBusinessContinuityPlansList(userIdFromToken, userNameFromToken, businessContPlanData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : BUSINESS_CONT_PLANS_LIST_DB_RESPONSE : ' + JSON.stringify(BUSINESS_CONT_PLANS_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_CONT_PLANS_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_CONT_PLANS_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Error details :' + BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Error details : ' + BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_BCP_LIST = await formatBusinessContinuityPlanList(userIdFromToken, BUSINESS_CONT_PLANS_LIST_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : FORMAT_BCP_LIST : ' + JSON.stringify(FORMAT_BCP_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_BCP_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_BCP_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  FORMAT_BCP_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_BCP_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will submit the business continuity plan with review comments in the database (Pg - 106)
    */
    async saveBusinessFunctionProfile(request, response) {
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let businessFunctionProfileData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let completeBCPData                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        refreshedToken                      = request.body.refreshedToken;
        userIdFromToken                     = request.body.userIdFromToken;
        userNameFromToken                   = request.body.userNameFromToken;
        accountGUIDFromToken                = request.body.accountGUIDFromToken;  
        // userIdFromToken                     = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken                   = 'kashish.sharma@secureyes.net';
        try {
            businessFunctionProfileData     = request.body.data;
            completeBCPData = {
                "BusinessFunctionID"        : request.body.data.BusinessFunctionID,
                "BusinessContinuityPlanID"  : request.body.data.BusinessContinuityPlanID
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : businessFunctionProfileData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            if ((CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.ProfilingQuestions || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.ProfilingQuestions) && (businessFunctionProfileData.ProfilingQuestions.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : ProfilingQuestions is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROFILING_QUESTIONS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.BusinessFunctionID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : BusinessFunctionID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.BusinessDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.BusinessDescription || appValidatorObject.isStringEmpty((businessFunctionProfileData.BusinessDescription).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : BusinessDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.BusinessServices || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.BusinessServices || appValidatorObject.isStringEmpty((businessFunctionProfileData.BusinessServices).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : BusinessServices is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_SERVICES_NULL_EMPTY));
            }
            if ((CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.CriticalBusinessActivities || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.CriticalBusinessActivities) && (businessFunctionProfileData.CriticalBusinessActivities.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : CriticalBusinessActivities is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_PROCESSES_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessFunctionProfileData.Customers || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessFunctionProfileData.Customers && (businessFunctionProfileData.Customers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : Customers is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CUSTOMERS_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE = await businessContinuityPlanDB.saveBusinessFunctionProfile(userIdFromToken, userNameFromToken, businessFunctionProfileData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE : ' + JSON.stringify(SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : Error details :' + SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : Error details : ' + SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const GET_COMPLETE_BCP_DETAILS = await businessContinuityPlanDB.getCompleteBCPDetails(userIdFromToken, userNameFromToken, completeBCPData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : GET_COMPLETE_BCP_DETAILS : ' + JSON.stringify(GET_COMPLETE_BCP_DETAILS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_COMPLETE_BCP_DETAILS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_COMPLETE_BCP_DETAILS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLETE_BCP_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : Error details :' + GET_COMPLETE_BCP_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLETE_BCP_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_COMPLETE_BCP_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : Error details : ' + GET_COMPLETE_BCP_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE = await formatSaveBusinessFunctionProfile(userIdFromToken, SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE, GET_COMPLETE_BCP_DETAILS, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE : ' + JSON.stringify(FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.recordset.length) {
                let EMAIL_DETAILS = SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];
                if(EMAIL_DETAILS.length && EMAIL_DETAILS[0].SaveCount == 1) {
                    try {                    
                        let emailTemplateObj = {
                            Subject : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Subject,
                            Body    : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Body
                        };
                        let BCManagerIDs        = EMAIL_DETAILS[0].BCMManger     != null ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersEmailIDs).join(',') : "";
                        let BusinessOwnerIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersEmailIDs).join(',') : "";
                        let BCCIDs              = EMAIL_DETAILS[0].BCC           != null ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCEmailIDs).join(',') : "";
                        let BusinessOwnerName   = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnerName).join(',') : "";

                        let toccEmails       = {
                            "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(BCCIDs),
                            "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs + ","+ BCManagerIDs)
                        }; 
                        let templateMaster   = {                     
                            Name                    : EMAIL_DETAILS[0].BusinessFunctionName,
                            BusinessOwner           : BusinessOwnerName,
                            Group                   : EMAIL_DETAILS[0].BusinessGroupName,        
                            RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                            subject_text            : `BCP - (BIA Exercise) has been moved to In-Progress for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            body_text               : `BCP - (BIA Exercise) has been moved to In-Progress for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BCC - (${userNameFromToken.split('@')[0]})`,
                            Note                    : ""
                        };
                        let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : emailData   : ' + JSON.stringify(emailData || null));
                        
                        let BCManagerGUIDs        = EMAIL_DETAILS[0].BCMManger != null     ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersUserGUIDs).join(',') : "";
                        let BusinessOwnerGUIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersUserGUIDs).join(',') : "";
                        let BCCGUIDs              = EMAIL_DETAILS[0].BCC != null           ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCUserGUIDs).join(',') : "";
                        let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(BCManagerGUIDs + "," + BusinessOwnerGUIDs + "," + BCCGUIDs)

                        let inappDetails     = {
                            inAppContent     : 'BCP - (BIA Exercise) has been moved to In-Progress for Business Function - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessFunctionName + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].Route, 
                            recepientUserID  : inAppUserList,
                            subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].SubModuleID
                        }

                        let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                     
                    } catch(error) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                    }
                } 
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SAVE_BUSINESS_FUNCTION_PROFILE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will submit the business continuity plan with review comments in the database (Pg - 106)
    */
    async getBusinessProfileQuestions(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let profileQuestionsData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            profileQuestionsData    = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == profileQuestionsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == profileQuestionsData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : profileQuestionsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == profileQuestionsData.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == profileQuestionsData.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const GET_PROFILE_QUESTIONS_DB_RESPONSE = await businessContinuityPlanDB.getBusinessProfileQuestions(userIdFromToken, userNameFromToken, profileQuestionsData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : GET_PROFILE_QUESTIONS_DB_RESPONSE : ' + JSON.stringify(GET_PROFILE_QUESTIONS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_PROFILE_QUESTIONS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_PROFILE_QUESTIONS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_PROFILE_QUESTIONS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Error details :' + GET_PROFILE_QUESTIONS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_PROFILE_QUESTIONS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_PROFILE_QUESTIONS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Error details : ' + GET_PROFILE_QUESTIONS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const GET_BCP_LIST_DB_RESPONSE = await businessContinuityPlanDB.getBusinessContinuityPlansList(userIdFromToken, userNameFromToken, profileQuestionsData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : GET_BCP_LIST_DB_RESPONSE : ' + JSON.stringify(GET_BCP_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BCP_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BCP_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_BCP_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Error details :' + GET_BCP_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_BCP_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BCP_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Error details : ' + GET_BCP_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const GET_COMPLETE_BCP_DETAILS = await businessContinuityPlanDB.getCompleteBCPDetails(userIdFromToken, userNameFromToken, profileQuestionsData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveBusinessFunctionProfile : GET_COMPLETE_BCP_DETAILS : ' + JSON.stringify(GET_COMPLETE_BCP_DETAILS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_COMPLETE_BCP_DETAILS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_COMPLETE_BCP_DETAILS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLETE_BCP_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Error details :' + GET_COMPLETE_BCP_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLETE_BCP_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_COMPLETE_BCP_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Error details : ' + GET_COMPLETE_BCP_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_BUSINESS_PROFILE_QUESTIONS = await formatGetBusinessProfileQuestions(userIdFromToken, GET_PROFILE_QUESTIONS_DB_RESPONSE, GET_BCP_LIST_DB_RESPONSE, profileQuestionsData,GET_COMPLETE_BCP_DETAILS, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : FORMAT_GET_BUSINESS_PROFILE_QUESTIONS : ' + JSON.stringify(FORMAT_GET_BUSINESS_PROFILE_QUESTIONS));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BUSINESS_PROFILE_QUESTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BUSINESS_PROFILE_QUESTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. :  FORMAT_GET_BUSINESS_PROFILE_QUESTIONS response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, FORMAT_GET_BUSINESS_PROFILE_QUESTIONS));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProfileQuestions : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will save the Dependencies Section to the database
    */
    async saveDependencies(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let saveDependenciesData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            saveDependenciesData    = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == saveDependenciesData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == saveDependenciesData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. : saveDependenciesData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution started.');

            /**
             * Input Validation : Start
             */
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == saveDependenciesData.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == saveDependenciesData.BusinessContinuityPlanID) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            // }
            // if ((CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == saveDependenciesData.BusinessProcesses || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == saveDependenciesData.BusinessProcesses) && (saveDependenciesData.BusinessProcesses.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. : BusinessProcesses is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_PROCESSES_NULL_EMPTY));
            // }
            /**
             * Input Validation : End
             */

            const SAVE_DEPENDENCIES_DB_RESPONSE = await businessContinuityPlanDB.saveDependencies(userIdFromToken, userNameFromToken, saveDependenciesData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : SAVE_DEPENDENCIES_DB_RESPONSE : ' + JSON.stringify(SAVE_DEPENDENCIES_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_DEPENDENCIES_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_DEPENDENCIES_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_DEPENDENCIES_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. : Error details :' + SAVE_DEPENDENCIES_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_DEPENDENCIES_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_DEPENDENCIES_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. : Error details : ' + SAVE_DEPENDENCIES_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_ADD_DEPENDENCIES_DB_RESPONSE = await formatAddDependenciesData(userIdFromToken, SAVE_DEPENDENCIES_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_DEPENDENCIES_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_DEPENDENCIES_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  FORMAT_ADD_DEPENDENCIES_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_ADD_DEPENDENCIES_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveDependencies : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch the Dependencies Section details and info from the database (Pg - 108)
    */
    async getDependenciesInfo(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let getDependenciesData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;  

        try {
            getDependenciesData     = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getDependenciesData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getDependenciesData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : getDependenciesData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getDependenciesData.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getDependenciesData.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            // procedure call for getting Dependencies Info before saving.
            // const GET_DEPENDENCIES_INFO_DB_RESPONSE = await businessContinuityPlanDB.getDependenciesInfo(userIdFromToken, userNameFromToken, getDependenciesData);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : GET_DEPENDENCIES_INFO_DB_RESPONSE : ' + JSON.stringify(GET_DEPENDENCIES_INFO_DB_RESPONSE));

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DEPENDENCIES_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DEPENDENCIES_INFO_DB_RESPONSE) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  update site master db response is undefined or null.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            // }
            // if (GET_DEPENDENCIES_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : Error details :' + GET_DEPENDENCIES_INFO_DB_RESPONSE.errorMsg);
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            // }
            // if (GET_DEPENDENCIES_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DEPENDENCIES_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : Error details : ' + GET_DEPENDENCIES_INFO_DB_RESPONSE.procedureMessage);
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            // }

            // procedure call for getting Dependencies Details.
            const GET_DEPENDENCIES_DETAILS_DB_RESPONSE = await businessContinuityPlanDB.getDependenciesDetails(userIdFromToken, userNameFromToken, getDependenciesData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : GET_DEPENDENCIES_DETAILS_DB_RESPONSE : ' + JSON.stringify(GET_DEPENDENCIES_DETAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DEPENDENCIES_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DEPENDENCIES_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_DEPENDENCIES_DETAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : Error details :' + GET_DEPENDENCIES_DETAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_DEPENDENCIES_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DEPENDENCIES_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : Error details : ' + GET_DEPENDENCIES_DETAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_DEPENDENCIES_DB_RESPONSE = await getFormatDependenciesData(userIdFromToken, GET_DEPENDENCIES_DETAILS_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_DEPENDENCIES_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_DEPENDENCIES_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  FORMAT_GET_DEPENDENCIES_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_DEPENDENCIES_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will save the Risk Mitigation Section in the database (Pg - 110)
    */
    async saveRiskMitigation(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskMitigationData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            riskMitigationData  = request.body.data;

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. : riskMitigationData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution started.');

            /**
             * Input Validation : Start
             */
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationData.siteId) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. : siteId is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            // }
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationData.reviewComment || appValidatorObject.isStringEmpty((riskMitigationData.reviewComment).trim())) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. : reviewComment is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            // }
            /**
             * Input Validation : End
             */

            const SAVE_RISK_MITIGATION_DB_RESPONSE = await businessContinuityPlanDB.saveRiskMitigation(userIdFromToken, userNameFromToken, riskMitigationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : SAVE_RISK_MITIGATION_DB_RESPONSE : ' + JSON.stringify (SAVE_RISK_MITIGATION_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_RISK_MITIGATION_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_RISK_MITIGATION_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if  (SAVE_RISK_MITIGATION_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. : Error details :' + SAVE_RISK_MITIGATION_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if  (SAVE_RISK_MITIGATION_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_RISK_MITIGATION_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. : Error details : ' + SAVE_RISK_MITIGATION_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE = await getFormatRiskMitigationData(userIdFromToken, SAVE_RISK_MITIGATION_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE : ' + JSON.stringify(FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SAVE_RISK_MITIGATION_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRiskMitigation : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch the Risk Mitigation Section info from the database (Pg - 110)
    */
    async getRiskMitigationInfo(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskMitigationInfoData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            riskMitigationInfoData  = request.body.data;

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationInfoData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationInfoData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. : riskMitigationInfoData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution started.');

            /**
             * Input Validation : Start
             */
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationInfoData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationInfoData.siteId) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. : siteId is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            // }
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationInfoData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationInfoData.reviewComment || appValidatorObject.isStringEmpty((riskMitigationInfoData.reviewComment).trim())) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. : reviewComment is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            // }
            /**
             * Input Validation : End
             */

            const GET_RISK_MITIGATION_INFO_DB_RESPONSE = await businessContinuityPlanDB.getRiskMitigationInfo(userIdFromToken, userNameFromToken, riskMitigationInfoData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : GET_RISK_MITIGATION_INFO_DB_RESPONSE : ' + JSON.stringify(GET_RISK_MITIGATION_INFO_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_MITIGATION_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_MITIGATION_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_MITIGATION_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. : Error details :' + GET_RISK_MITIGATION_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_MITIGATION_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_MITIGATION_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. : Error details : ' + GET_RISK_MITIGATION_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_RISK_MITIGATION_DB_RESPONSE = await getFormatRiskMitigationData(userIdFromToken, GET_RISK_MITIGATION_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : FORMAT_GET_RISK_MITIGATION_DB_RESPONSE : ' + JSON.stringify(FORMAT_GET_RISK_MITIGATION_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_RISK_MITIGATION_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_RISK_MITIGATION_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  FORMAT_GET_RISK_MITIGATION_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_RISK_MITIGATION_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRiskMitigationInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will save the Staff Contact Details Section in the database (Pg - 112)
    */
    async saveStaffContactDetails(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let staffContactData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            staffContactData    = request.body.data;

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == staffContactData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == staffContactData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. : staffContactData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == staffContactData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == staffContactData.siteId) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. : siteId is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            // }
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == staffContactData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == staffContactData.reviewComment || appValidatorObject.isStringEmpty((staffContactData.reviewComment).trim())) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. : reviewComment is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            // }
            /**
             * Input Validation : End
             */

            const SAVE_STAFF_CONTACTS_DB_RESPONSE = await businessContinuityPlanDB.saveStaffContactDetails(userIdFromToken, userNameFromToken, staffContactData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : SAVE_STAFF_CONTACTS_DB_RESPONSE : ' + JSON.stringify(SAVE_STAFF_CONTACTS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_STAFF_CONTACTS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_STAFF_CONTACTS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_STAFF_CONTACTS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. : Error details :' + SAVE_STAFF_CONTACTS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_STAFF_CONTACTS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_STAFF_CONTACTS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. : Error details : ' + SAVE_STAFF_CONTACTS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE = await getFormatStaffContactData(userIdFromToken, SAVE_STAFF_CONTACTS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE : ' + JSON.stringify(FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SAVE_STAFF_CONTACT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveStaffContactDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch the Staff Contact Details Section info from the database (Pg - 112)
    */
    async getStaffContactInfo(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let staffContactInfoData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            staffContactInfoData    = request.body.data;

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == staffContactInfoData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == staffContactInfoData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. : staffContactInfoData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution started.');

            /**
             * Input Validation : Start
             */
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == staffContactInfoData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == staffContactInfoData.siteId) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. : siteId is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            // }
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == staffContactInfoData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == staffContactInfoData.reviewComment || appValidatorObject.isStringEmpty((staffContactInfoData.reviewComment).trim())) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. : reviewComment is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            // }
            /**
             * Input Validation : End
             */

            const GET_STAFF_CONTACT_INFO_DB_RESPONSE = await businessContinuityPlanDB.getStaffContactInfo(userIdFromToken, userNameFromToken, staffContactInfoData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : GET_STAFF_CONTACT_INFO_DB_RESPONSE : ' + JSON.stringify(GET_STAFF_CONTACT_INFO_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_STAFF_CONTACT_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_STAFF_CONTACT_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_STAFF_CONTACT_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. : Error details :' + GET_STAFF_CONTACT_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_STAFF_CONTACT_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_STAFF_CONTACT_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. : Error details : ' + GET_STAFF_CONTACT_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_STAFF_CONTACT_DB_RESPONSE = await getFormatStaffContactData(userIdFromToken, GET_STAFF_CONTACT_INFO_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_STAFF_CONTACT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_STAFF_CONTACT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getDependenciesInfo : Execution end. :  FORMAT_GET_STAFF_CONTACT_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_STAFF_CONTACT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getStaffContactInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will return database response for consolidated report.
    */
    async getBCPConsolidatedReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcpPayload              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;  
        try {
            bcpPayload              = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcpPayload || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcpPayload) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. : bcpPayload is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcpPayload.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcpPayload.BusinessContinuityPlanID || appValidatorObject.isStringEmpty((bcpPayload.BusinessContinuityPlanID).trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const GET_CONSOLIDATED_DB_RESPONSE = await businessContinuityPlanDB.getBCPConsolidatedReport(userIdFromToken, userNameFromToken, bcpPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : GET_CONSOLIDATED_DB_RESPONSE : ' + JSON.stringify(GET_CONSOLIDATED_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_CONSOLIDATED_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_CONSOLIDATED_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_CONSOLIDATED_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. : Error details :' + GET_CONSOLIDATED_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_CONSOLIDATED_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_CONSOLIDATED_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. : Error details : ' + GET_CONSOLIDATED_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_CONSOLIDATED_DB_RESPONSE = await formatGetConsolidatedReport(userIdFromToken, GET_CONSOLIDATED_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CONSOLIDATED_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CONSOLIDATED_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. :  FORMAT_GET_CONSOLIDATED_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_CONSOLIDATED_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPConsolidatedReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

      
    /**
     * This function will fetch the business function list from the dataBase to intiate review (pg-96)
    */
    async getInitiateReview(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        try {
            sectionData         = request.body;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken; 
            accountGUIDFromToken = request.body.accountGUIDFromToken;         
            // userIdFromToken           = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. : sectionData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution started.');

            const GET_REVIEW_LIST_DB_RESPONSE = await businessContinuityPlanDB.getInitiateReview(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : GET_REVIEW_LIST_DB_RESPONSE : ' + JSON.stringify(GET_REVIEW_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_REVIEW_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_REVIEW_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. :  GET_REVIEW_LIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REVIEW_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. : Error details :' + GET_REVIEW_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REVIEW_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_REVIEW_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. : Error details : ' + GET_REVIEW_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (GET_REVIEW_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_REVIEW_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_REVIEW_LIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_REVIEW_LIST_DB_RESPONSE));
            }

            const FORMAT_REVIEW_LIST = await formatInitiateReviewList(userIdFromToken, GET_REVIEW_LIST_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : FORMAT_REVIEW_LIST : ' + JSON.stringify(FORMAT_REVIEW_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REVIEW_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REVIEW_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. :  FORMAT_REVIEW_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_REVIEW_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getInitiateReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will initiate bcp review  (Pg - 96)
    */
    async initiateReview(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {            
            refreshedToken       = request.body.refreshedToken;
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            sectionData          = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;  

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution end. : sectionData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution started.');

            /**
             * Input Validation : Start
             */
            if (sectionData.BusinessFunctionId === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || sectionData.BusinessFunctionId === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || sectionData.BusinessFunctionId === '') {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution end. : BusinessFunctionId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, "BusinessFunctionId" + MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const INITIATE_REVIEW_DB_RESPONSE = await businessContinuityPlanDB.initiateReview(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : INITIATE_REVIEW_DB_RESPONSE : ' + JSON.stringify(INITIATE_REVIEW_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INITIATE_REVIEW_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INITIATE_REVIEW_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (INITIATE_REVIEW_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution end. : Error details :' + INITIATE_REVIEW_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (INITIATE_REVIEW_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && INITIATE_REVIEW_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution end. : Error details : ' + INITIATE_REVIEW_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

            let EMAIL_DETAILS = INITIATE_REVIEW_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            if(EMAIL_DETAILS.length) {
                try {                    
                    let emailTemplateObj = {
                        Subject : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Subject,
                        Body    : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Body
                    };                   
                    
                    let BCManagerIDs        = EMAIL_DETAILS[0].BCMManger != null     ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersEmailIDs).join(',') : "";
                    let BusinessOwnerIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersEmailIDs).join(',') : "";
                    let BCCIDs              = EMAIL_DETAILS[0].BCC != null           ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCEmailIDs).join(',') : "";
                    let BusinessOwnerName   = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnerName).join(',') : "";

                    let toccEmails       = {
                        "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(BCCIDs),
                        "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs + ","+ BCManagerIDs)
                    }; 
                    let templateMaster   = {                     
                        Name                    : EMAIL_DETAILS[0].BusinessFunctionName,
                        BusinessOwner           : BusinessOwnerName,
                        Group                   : EMAIL_DETAILS[0].BusinessGroupName,        
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        subject_text            : `BCP - (BIA Exercise) has been scheduled for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                        body_text               : `BCP - (BIA Exercise) has been scheduled for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BC Manager - (${userNameFromToken.split('@')[0]})`,
                        Note                    : ""
                    };

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : emailData   : ' + JSON.stringify(emailData || null));

                    let BCManagerGUIDs        = EMAIL_DETAILS[0].BCMManger != null     ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersUserGUIDs).join(',') : "";
                    let BusinessOwnerGUIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersUserGUIDs).join(',') : "";
                    let BCCGUIDs              = EMAIL_DETAILS[0].BCC != null           ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCUserGUIDs).join(',') : "";
                    
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(BCManagerGUIDs + "," + BusinessOwnerGUIDs + "," + BCCGUIDs)

                    let inappDetails     = {
                        inAppContent     : 'BCP - (BIA Exercise) has been scheduled for Business Function - ' + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessFunctionName + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].Route, 
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            } 

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_DATA, INITIATE_REVIEW_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : initiateReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch the business process details from the dataBase (pg-98, 107)
    */
    async getBusinessProcessDetails(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        try {
            sectionData         = request.body.data;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken; 
            accountGUIDFromToken = request.body.accountGUIDFromToken;         
            // userIdFromToken           = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_UNDEFINED));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessFunctionId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessFunctionId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessFunctionId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
            */

            const GET_BUSINESS_PROCESS_LIST_DB_RESPONSE = await businessContinuityPlanDB.getBusinessProcessInfoList(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : GET_BUSINESS_PROCESS_LIST_DB_RESPONSE : ' + JSON.stringify(GET_BUSINESS_PROCESS_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BUSINESS_PROCESS_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BUSINESS_PROCESS_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. :  GET_BUSINESS_PROCESS_LIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. : Error details :' + GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. : Error details : ' + GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }          


            const GET_BUSINESS_PROCESS_DB_RESPONSE = await businessContinuityPlanDB.getBusinessProcessDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : GET_BUSINESS_PROCESS_DB_RESPONSE : ' + JSON.stringify(GET_BUSINESS_PROCESS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BUSINESS_PROCESS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BUSINESS_PROCESS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. :  GET_BUSINESS_PROCESS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BUSINESS_PROCESS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. : Error details :' + GET_BUSINESS_PROCESS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BUSINESS_PROCESS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BUSINESS_PROCESS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. : Error details : ' + GET_BUSINESS_PROCESS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if ((GET_BUSINESS_PROCESS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BUSINESS_PROCESS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_BUSINESS_PROCESS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) 
                && (GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_BUSINESS_PROCESS_DB_RESPONSE));
            }          

            const FORMAT_BUSINESS_PROCESS_DATA = await getFormatBusinessProcessData(userIdFromToken, GET_BUSINESS_PROCESS_LIST_DB_RESPONSE, GET_BUSINESS_PROCESS_DB_RESPONSE, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : FORMAT_BUSINESS_PROCESS_DATA : ' + JSON.stringify(FORMAT_BUSINESS_PROCESS_DATA));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_BUSINESS_PROCESS_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_BUSINESS_PROCESS_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. :  FORMAT_BUSINESS_PROCESS_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_BUSINESS_PROCESS_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch the business process info list from the dataBase (pg-107)
    */
    async getBusinessProcessInfoList(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        try {
            sectionData          = request.body.data;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken; 
            accountGUIDFromToken = request.body.accountGUIDFromToken;         
            // userIdFromToken           = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution started.');

            const GET_BUSINESS_PROCESS_LIST_DB_RESPONSE = await businessContinuityPlanDB.getBusinessProcessInfoList(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : GET_BUSINESS_PROCESS_LIST_DB_RESPONSE : ' + JSON.stringify(GET_BUSINESS_PROCESS_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BUSINESS_PROCESS_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BUSINESS_PROCESS_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution end. :  GET_BUSINESS_PROCESS_LIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution end. : Error details :' + GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution end. : Error details : ' + GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_BUSINESS_PROCESS_LIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_BUSINESS_PROCESS_LIST_DB_RESPONSE));
            }

            const FORMAT_PROCESS_INFO_LIST = await getFormatBusinessProcessInfoList(userIdFromToken, GET_BUSINESS_PROCESS_LIST_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : FORMAT_PROCESS_INFO_LIST : ' + JSON.stringify(FORMAT_PROCESS_INFO_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REVIEW_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_PROCESS_INFO_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution end. :  FORMAT_PROCESS_INFO_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_PROCESS_INFO_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessProcessInfoList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch the impact assessment info list from the dataBase (pg-100)
    */
    async getImpactAssessmentDetails(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        try {
            sectionData         = request.body.data;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken; 
            accountGUIDFromToken = request.body.accountGUIDFromToken;         
            // userIdFromToken           = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';
            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_UNDEFINED));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessFunctionID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessFunctionId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
            */
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution started.');

            const GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE = await businessContinuityPlanDB.getImpactAssessmentDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE : ' + JSON.stringify(GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution end. :  GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution end. : Error details :' + GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution end. : Error details : ' + GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE));
            }

            const FORMAT_IMPACT_ASSESSMENT_LIST = await getFormatImpactAssessmentDetails(userIdFromToken, GET_IMPACT_ASSESSMENT_DETAILS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : FORMAT_IMPACT_ASSESSMENT_LIST : ' + JSON.stringify(FORMAT_IMPACT_ASSESSMENT_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_IMPACT_ASSESSMENT_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_IMPACT_ASSESSMENT_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution end. :  FORMAT_IMPACT_ASSESSMENT_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_IMPACT_ASSESSMENT_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getImpactAssessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    
    /**
     * This function will fetch the resource requirement details from the dataBase (pg-102)
    */
    async getResourceRequirementDetails(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        try {
            data                = request.body.data;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken; 
            accountGUIDFromToken = request.body.accountGUIDFromToken;  
             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_UNDEFINED));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data.BusinessFunctionID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessFunctionId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            }
             /**
             * Input Validation : end
             */
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution started.');

            const GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE = await businessContinuityPlanDB.getResourceRequirementDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE : ' + JSON.stringify(GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution end. :  GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution end. : Error details :' + GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution end. : Error details : ' + GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE));
            }

            const FORMAT_RESOURCE_REQUIREMENT_LIST = await getFormatResourceRequirementDetails(userIdFromToken, GET_RESOURCE_REQUIREMENTS_DETAILS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : FORMAT_RESOURCE_REQUIREMENT_LIST : ' + JSON.stringify(FORMAT_RESOURCE_REQUIREMENT_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RESOURCE_REQUIREMENT_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RESOURCE_REQUIREMENT_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution end. :  FORMAT_RESOURCE_REQUIREMENT_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_RESOURCE_REQUIREMENT_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getResourceRequirementDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

     /**
     * This function will fetch the recovery process info details from the dataBase (pg-104)
    */
    async getRecoveryProcessDetails(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcpPayload          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;      
        try {
            sectionData         = request.body.data;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;       
             /**
             * Input Validation : Start
             */
             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_UNDEFINED));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessFunctionID) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : SiteRiskAssessmentsBl : submitRiskResponse : Execution end. : BusinessFunctionId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            }
             /**
             * Input Validation : end
             */   
            bcpPayload          = {
                BusinessContinuityPlanID: sectionData.BusinessContinuityPlanId,
                BusinessFunctionID      : sectionData.BusinessFunctionID,
            } 
            // userIdFromToken           = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : Execution started.');

            const GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE = await businessContinuityPlanDB.getRecoveryProcessDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE : ' + JSON.stringify(GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : Execution end. :  GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : Execution end. : Error details :' + GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : Execution end. : Error details : ' + GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // for getting user type and workflow status IDs
            const BUSINESS_CONT_PLANS_LIST_DB_RESPONSE = await businessContinuityPlanDB.getBusinessContinuityPlansList(userIdFromToken, userNameFromToken, bcpPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : BUSINESS_CONT_PLANS_LIST_DB_RESPONSE : ' + JSON.stringify(BUSINESS_CONT_PLANS_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_CONT_PLANS_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_CONT_PLANS_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Error details :' + BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Error details : ' + BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_RECOVERY_PROCESS_LIST = await getFormatRecoveryProcessDetails(userIdFromToken, GET_RECOVERY_PROCESS_DETAILS_DB_RESPONSE, BUSINESS_CONT_PLANS_LIST_DB_RESPONSE, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatResourceRequirementInfoList : FORMAT_RECOVERY_PROCESS_LIST : ' + JSON.stringify(FORMAT_RECOVERY_PROCESS_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RECOVERY_PROCESS_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RECOVERY_PROCESS_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : Execution end. :  FORMAT_RECOVERY_PROCESS_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_RECOVERY_PROCESS_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getRecoveryProcessDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    
    
    /**
    * This function will save the process activity details in the database (Pg - 107)
    */
    async saveProcessActivityDetails(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {            
            refreshedToken       = request.body.refreshedToken;
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            sectionData          = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;  

            // userIdFromToken           = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : sectionData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanId) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : BusinessContinuityPlanId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessProcesses || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessProcesses || (sectionData.BusinessProcesses).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : BusinessProcesses is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCESS_DATA_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.SubBusinessProcesses || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.SubBusinessProcesses || (sectionData.SubBusinessProcesses).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : SubBusinessProcesses is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCESS_DATA_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const SAVE_PROCESS_ACTIVITY_DB_RESPONSE = await businessContinuityPlanDB.saveProcessActivityDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : SAVE_PROCESS_ACTIVITY_DB_RESPONSE : ' + JSON.stringify(SAVE_PROCESS_ACTIVITY_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_PROCESS_ACTIVITY_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_PROCESS_ACTIVITY_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_PROCESS_ACTIVITY_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : Error details :' + SAVE_PROCESS_ACTIVITY_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_PROCESS_ACTIVITY_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_PROCESS_ACTIVITY_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : Error details : ' + SAVE_PROCESS_ACTIVITY_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            let BusinessProcessDetails  = SAVE_PROCESS_ACTIVITY_DB_RESPONSE.recordset[0][0].BusinessProcessDetails;
            let Section2AllProcessSaved = JSON.parse(BusinessProcessDetails).every(n => n.IsSaved == true);
            let completeSavedData       = SAVE_PROCESS_ACTIVITY_DB_RESPONSE.recordset[3][0]
            let SectionDetails          = {};
            let IsSavedObj              = {};
            if(completeSavedData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                SectionDetails = completeSavedData;
                if (SectionDetails) {
                    IsSavedObj = {
                        "Section1IsSaved": SectionDetails.Section1IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section1IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Section2IsSaved": Section2AllProcessSaved,
                        "Section3IsSaved": SectionDetails.Section3IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section3IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Section4IsSaved": SectionDetails.Section4IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section4IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Section5IsSaved": SectionDetails.Section5IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section5IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Section6IsSaved": SectionDetails.Section6IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section6IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Section7IsSaved": SectionDetails.Section7IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section7IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Section8IsSaved": SectionDetails.Section8IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section8IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    }            
                }
            }
            completeSavedData = IsSavedObj;

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, {Section2AllProcessSaved,completeSavedData }));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will save the impact assessment details in the database (Pg - 109)
    */
    async saveImpactAssessmentDetails(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {            
            refreshedToken       = request.body.refreshedToken;
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            sectionData          = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;  

            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : Execution end. : sectionData is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            // }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanId) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : BusinessContinuityPlanId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.ImpactAssessment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.ImpactAssessment || (sectionData.ImpactAssessment).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : ImpactAssessment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IMPACT_DATA_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const SAVE_IMPACT_ASSESSMENT_DB_RESPONSE = await businessContinuityPlanDB.saveImpactAssessmentDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : SAVE_IMPACT_ASSESSMENT_DB_RESPONSE : ' + JSON.stringify(SAVE_IMPACT_ASSESSMENT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_IMPACT_ASSESSMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_IMPACT_ASSESSMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_IMPACT_ASSESSMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : Execution end. : Error details :' + SAVE_IMPACT_ASSESSMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_IMPACT_ASSESSMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_IMPACT_ASSESSMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : Execution end. : Error details : ' + SAVE_IMPACT_ASSESSMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, SAVE_IMPACT_ASSESSMENT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveImpactAssessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will save the resource requirements details in the database (Pg - 111)
    */
    async saveResourceRequirementsDetails(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {            
            refreshedToken       = request.body.refreshedToken;
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            sectionData          = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;  

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanId) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : BusinessContinuityPlanId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.VitalRecords || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.VitalRecords || (sectionData.VitalRecords).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : VitalRecords is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RESOURCE_DATA_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.CriticalEquipmentSupplies || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.CriticalEquipmentSupplies || (sectionData.CriticalEquipmentSupplies).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : CriticalEquipmentSupplies is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RESOURCE_DATA_NULL_EMPTY));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveResourceRequirementsDetails : Execution started.');

            const SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE = await businessContinuityPlanDB.saveResourceRequirementsDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveResourceRequirementsDetails : SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE : ' + JSON.stringify(SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveResourceRequirementsDetails : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveResourceRequirementsDetails : Execution end. : Error details :' + SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveResourceRequirementsDetails : Execution end. : Error details : ' + SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, SAVE_RESOURCE_REQUIREMENTS_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveResourceRequirementsDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will will save the recovery process details in the database (Pg - 113)
    */
    async saveRecoveryProcessDetails(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sectionData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {            
            refreshedToken       = request.body.refreshedToken;
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            sectionData          = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;  
             // userIdFromToken          = '0DDE8C05-788A-ED11-BAC5-000C29A8F9E1';
            // userNameFromToken         = 'naganandan.p@secureyes.net';

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.BusinessContinuityPlanId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.BusinessContinuityPlanId) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : BusinessContinuityPlanId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.RecoveryStaffRequirement || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.RecoveryStaffRequirement || (sectionData.RecoveryStaffRequirement).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : RecoveryStrategies is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RECOVERY_DATA_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == sectionData.RecoveryStrategies || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == sectionData.RecoveryStrategies || (sectionData.RecoveryStrategies).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveProcessActivityDetails : Execution end. : RecoveryStrategies is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RECOVERY_DATA_NULL_EMPTY));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRecoveryProcessDetails : Execution started.');

            const SAVE_RECOVERY_PROCESS_DB_RESPONSE = await businessContinuityPlanDB.saveRecoveryProcessDetails(userIdFromToken, userNameFromToken, sectionData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRecoveryProcessDetails : SAVE_RECOVERY_PROCESS_DB_RESPONSE : ' + JSON.stringify(SAVE_RECOVERY_PROCESS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_RECOVERY_PROCESS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_RECOVERY_PROCESS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRecoveryProcessDetails : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RECOVERY_PROCESS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRecoveryProcessDetails : Execution end. : Error details :' + SAVE_RECOVERY_PROCESS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RECOVERY_PROCESS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_RECOVERY_PROCESS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRecoveryProcessDetails : Execution end. : Error details : ' + SAVE_RECOVERY_PROCESS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, SAVE_RECOVERY_PROCESS_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : saveRecoveryProcessDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

     /**
    * This function will will submit the review data of bcp in the database
    */
    async submitReview(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let submitReviewData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {            
            refreshedToken       = request.body.refreshedToken;
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            submitReviewData     = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;  
            // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken           = 'kashish.sharma@secureyes.net';

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == submitReviewData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == submitReviewData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. : submitReviewData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution started.');

            if (submitReviewData.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                submitReviewData.IsApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                submitReviewData.IsRejected = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            } else if(submitReviewData.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                submitReviewData.IsApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                submitReviewData.IsRejected = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            } else {
                submitReviewData.IsApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                submitReviewData.IsRejected = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : SUBMIT_REVIEW_PAYLOAD_DATA : submitReviewData : ' + JSON.stringify(submitReviewData));

            /**
             * Input Validation : Start
             */
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == submitReviewData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == submitReviewData.siteId) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. : siteId is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            // }
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == submitReviewData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == submitReviewData.reviewComment || appValidatorObject.isStringEmpty((submitReviewData.reviewComment).trim())) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. : reviewComment is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENTS_NULL_EMPTY));
            // }
            /**
             * Input Validation : End
             */

            const SUBMIT_REVIEW_DB_RESPONSE = await businessContinuityPlanDB.submitReview(userIdFromToken, userNameFromToken, submitReviewData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : SUBMIT_REVIEW_DB_RESPONSE : ' + JSON.stringify(SUBMIT_REVIEW_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SUBMIT_REVIEW_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SUBMIT_REVIEW_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_REVIEW_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. : Error details :' + SUBMIT_REVIEW_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_REVIEW_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SUBMIT_REVIEW_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. : Error details : ' + SUBMIT_REVIEW_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

            // const FORMAT_SUBMIT_REVIEW_DB_RESPONSE = await formatSubmitReview(userIdFromToken, SUBMIT_REVIEW_DB_RESPONSE);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : FORMAT_SUBMIT_REVIEW_DB_RESPONSE : ' + JSON.stringify(FORMAT_SUBMIT_REVIEW_DB_RESPONSE));
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SUBMIT_REVIEW_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SUBMIT_REVIEW_DB_RESPONSE) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  FORMAT_SUBMIT_REVIEW_DB_RESPONSE response is undefined or null.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            // }

            // let EMAIL_DETAILS = SAVE_BUSINESS_FUNCTION_PROFILE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            let EMAIL_DETAILS = SUBMIT_REVIEW_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            if(EMAIL_DETAILS.length) {
                try {                    
                    let emailTemplateObj = {
                        Subject : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Subject,
                        Body    : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Body
                    };
                    let BCManagerIDs        = EMAIL_DETAILS[0].BCMManger     != null ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersEmailIDs).join(',') : "";
                    let BusinessOwnerIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersEmailIDs).join(',') : "";
                    let BCCIDs              = EMAIL_DETAILS[0].BCC           != null ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCEmailIDs).join(',') : "";
                    let BusinessOwnerName   = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnerName).join(',') : "";

                    let toccEmails       = {
                        "TOEmail"   : "",
                        "CCEmail"   : ""
                    }; 
                    let templateMaster   = {                     
                        Name                    : EMAIL_DETAILS[0].BusinessFunctionName,
                        BusinessOwner           : BusinessOwnerName,
                        Group                   : EMAIL_DETAILS[0].BusinessGroupName,        
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        subject_text            : "",
                        body_text               : "",
                        Note                    : ""
                    };
                    if (submitReviewData.IsBCManager == true) {
                        if (submitReviewData.IsRejected == 1) {
                            // console.log("submitReviewData.IsRejected == 1")
                            toccEmails.TOEmail              = utilityAppObject.removeDuplicateEmailIDs(BCCIDs)
                            toccEmails.CCEmail              = utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs + ","+ BCManagerIDs)
                            templateMaster.subject_text     = `BCP - (BIA Exercise) has been returned by BC Manager for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            templateMaster.body_text        = `BCP - (BIA Exercise) has been returned for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BC Manager  - (${userNameFromToken.split('@')[0]})`
                        } else if (submitReviewData.IsApproved == 1) {
                            toccEmails.TOEmail              = utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs)
                            toccEmails.CCEmail              = utilityAppObject.removeDuplicateEmailIDs(BCManagerIDs + ","+ BCCIDs)
                            templateMaster.subject_text     = `BCP - (BIA Exercise) has been approved by BC Manager for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            templateMaster.body_text        = `BCP - (BIA Exercise) has been approved for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BC Manager  - (${userNameFromToken.split('@')[0]})`
                        }                        
                    } else if (submitReviewData.IsBusinessOwner == true) {
                        if (submitReviewData.IsRejected == 1) {
                            templateMaster.subject_text     = `BCP - (BIA Exercise) has been returned by Business owner for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            templateMaster.body_text        = `BCP - (BIA Exercise) has been returned for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by Business owner - (${userNameFromToken.split('@')[0]})`
                        } else if (submitReviewData.IsApproved == 1) {
                            templateMaster.subject_text     = `BCP - (BIA Exercise) has been approved by Business owner for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            templateMaster.body_text        = `BCP - (BIA Exercise) has been approved for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by Business owner - (${userNameFromToken.split('@')[0]})`
                        }
                        toccEmails.TOEmail              = utilityAppObject.removeDuplicateEmailIDs(BCCIDs)
                        toccEmails.CCEmail              = utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs + ","+ BCManagerIDs)                            
                    } else if (submitReviewData.IsCoordinator == true) {
                        if (EMAIL_DETAILS[0].IsReSubmit == 1) {
                            templateMaster.subject_text     = `BCP - (BIA Exercise) has been resubmitted by BC Coordinator for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            templateMaster.body_text        = `BCP - (BIA Exercise) has been resubmitted for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BC Coordinator  - (${userNameFromToken.split('@')[0]})`
                        } else {
                            templateMaster.subject_text     = `BCP - (BIA Exercise) has been submitted by BC Coordinator for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                            templateMaster.body_text        = `BCP - (BIA Exercise) has been submitted for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BC Coordinator  - (${userNameFromToken.split('@')[0]})`
                        }                        
                        toccEmails.TOEmail              = utilityAppObject.removeDuplicateEmailIDs(BCManagerIDs) 
                        toccEmails.CCEmail              = utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs + ","+ BCCIDs)                       
                    } 
                    
                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken ,userNameFromToken, emailTemplateObj, templateMaster, toccEmails, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : emailData   : ' + JSON.stringify(emailData || null));
    
                    let BCManagerGUIDs        = EMAIL_DETAILS[0].BCMManger != null     ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersUserGUIDs).join(',') : "";
                    let BusinessOwnerGUIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersUserGUIDs).join(',') : "";
                    let BCCGUIDs              = EMAIL_DETAILS[0].BCC != null           ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCUserGUIDs).join(',') : "";

                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(BCManagerGUIDs + "," + BusinessOwnerGUIDs + "," + BCCGUIDs)

                    let inappDetails     = {
                        inAppContent     : templateMaster.subject_text + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].Route, 
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    
                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            } 

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, SUBMIT_REVIEW_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : submitReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }
    /**
    * This function will get the under review details (Pg - 105)
    */
        async getBusinessContinuityPlansReviewList(request, response) {
            let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let businessContPlanData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             = request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;    
            // userIdFromToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken = 'kashish.sharma@secureyes.net';
            try {
    
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : Execution started.');
    
                const BUSINESS_UNDER_REVIEW_DB_RESPONSE = await businessContinuityPlanDB.getBusinessContinuityPlansReviewList(userIdFromToken, userNameFromToken, accountGUIDFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : BUSINESS_UNDER_REVIEW_DB_RESPONSE : ' + JSON.stringify(BUSINESS_UNDER_REVIEW_DB_RESPONSE));
    
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_UNDER_REVIEW_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_UNDER_REVIEW_DB_RESPONSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : Execution end. :  update site master db response is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
                }
                if (BUSINESS_UNDER_REVIEW_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : Execution end. : Error details :' + BUSINESS_UNDER_REVIEW_DB_RESPONSE.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
                }
                if (BUSINESS_UNDER_REVIEW_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_UNDER_REVIEW_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : Execution end. : Error details : ' + BUSINESS_UNDER_REVIEW_DB_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
                }
    
                const FORMAT_BCP_LIST = await formatUnderReviewList(userIdFromToken, BUSINESS_UNDER_REVIEW_DB_RESPONSE, accountGUIDFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : FORMAT_BCP_LIST : ' + JSON.stringify(FORMAT_BCP_LIST));
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_BCP_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_BCP_LIST) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : Execution end. :  FORMAT_BCP_LIST response is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                }
    
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_BCP_LIST));
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansReviewList : Execution end. : Got unhandled error. : Error Detail : ' + error);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
        }

    /** 
   * This function will calcuate the overall risk ratings 
   */
    async getOverAllRiskRating(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskMitigationData   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskRating           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let inherentRiskRanges   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken;  
     
        try {

            riskMitigationData         = request.body.data;

            let LikelihoodRatingData   = [];
            let ImpactRatingData       = [];
            let ComputeRiskCode        = [];
            let ComputeRiskRatingCode  = [];
            let ConfigRiskScores       = [];
            let ConfigRiskRating       = [];
            let computedRiskScore      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let computedRiskRating     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : riskMitigationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution started.');

            /**
            * Input Validation : Start
            */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationData.ImpactRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationData.ImpactRatingId) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' :RiskRatingBl : getDataForOverallRiskRating : Execution end. : ImpactRatingId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_RATING_TYPE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMitigationData.LikelihoodRatingId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMitigationData.LikelihoodRatingId) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : LikelihoodRatingId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_RATING_TYPE_NULL_EMPTY));
            }
            /**
            * Input Validation : end
            */
            
            // fetching risk Ranges from the procedure
            const RISK_RATING_DB_RESPONSE = await riskRatingDB.getDataForOverallRiskRating(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : RISK_RATING_DB_RESPONSE ' + JSON.stringify(RISK_RATING_DB_RESPONSE || null));
    
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RISK_RATING_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RISK_RATING_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RISK_RATING_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : Error details :' + RISK_RATING_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RISK_RATING_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RISK_RATING_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : Error details : ' + RISK_RATING_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RISK_RATING_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RISK_RATING_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, RISK_RATING_DB_RESPONSE));
            }
    
            //Formatting all the recordset            
            LikelihoodRatingData    = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].filter(nn => nn.IsActive);
            ImpactRatingData        = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(nn => nn.IsActive); 
            ComputeRiskCode         = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].filter(nn => nn.IsActive);
            ComputeRiskRatingCode   = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].filter(nn => nn.IsActive);
            ConfigRiskScores        = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            ConfigRiskRating        = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];

            let LikelihoodData      = LikelihoodRatingData.find(nn => nn.ID == riskMitigationData.LikelihoodRatingId)
            let ImpactlihoodData    = ImpactRatingData.find(nn => nn.ID == riskMitigationData.ImpactRatingId)

            // to calc the "Overall Inherent Risk Score" based on computation code
            if(ImpactlihoodData && LikelihoodData) {
                let ImpactRatingScore       = ImpactlihoodData.Value;
                let LikelihoodRatingScore   = LikelihoodData.Value;
                let RiskFormula             = '';

                const computationIDs    = ComputeRiskCode[0].ComputationCode.split(',');
                computationIDs.forEach((id, index) => {
                    const config = ConfigRiskScores.find(c => c.ConfigScoreAndRatingID == id);
                    if (config) {
                        if (config.IsOperator) {
                            RiskFormula += `${config.ConfigField}`;
                        } else {
                            RiskFormula += config.ConfigField;
                        }
                    }
                    
                    if (index < computationIDs.length - 1) {
                        RiskFormula += ' ';
                    }
                });

                try {
                    computedRiskScore = eval(RiskFormula);
                } catch (error) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : error while evaulvating the risk formula'+ error);
                }
            }   
            let scoreObj = {
                OverallRiskScore : computedRiskScore
            }

            // to calc the "Overall Inherent Risk Rating Score" based on computation score
            if (computedRiskScore >= 0) {
                for (const rating of ComputeRiskRatingCode) {
                    const formulaParts = rating.ComputationCode.split(',');
                    let formula = "";
                    let isBetween = false;
                    let betweenField = '';
                    let betweenLower = null;
                    let betweenUpper = null;
                    let betweenValues = [];
            
                    for (let part of formulaParts) {
                        if (part.includes('-')) {
                            const [configId, value] = part.split('-');
                            const config = ConfigRiskRating.find(m => m.ConfigScoreAndRatingID == configId);
                    
                            if (config?.ConfigField === "Custom") {
                                if (isBetween) {
                                    betweenValues.push(Number(value));
                                } else {
                                    formula += value;
                                }
                            }
                        } else {
                            const config = ConfigRiskRating.find(m => m.ConfigScoreAndRatingID == part);
                            if (config) {
                                if (config.ConfigField === "Between") {
                                    isBetween = true;
                                } else if (!config.IsOperator) {
                                    if (!betweenField && config.ConfigField === "OverallRiskScore") {
                                        betweenField = config.ConfigField;
                                    }
                    
                                    if (!isBetween) {
                                        formula += config.ConfigField;
                                    }
                                } else {
                                    if (!isBetween) {
                                        formula += config.ConfigField;
                                    }
                                }
                            }
                        }
                    }
                    
            
                    if (isBetween && betweenValues.length === 2) {
                        betweenLower = betweenValues[0];
                        betweenUpper = betweenValues[1];
                    }
            
                    let expression = "";
            
                    if (isBetween && betweenField && betweenLower !== null && betweenUpper !== null) {
                        const valueToCompare = scoreObj[betweenField];
                        expression = `(${betweenLower} <= ${valueToCompare} && ${valueToCompare} <= ${betweenUpper})`;
                    } else {
                        expression = formula.replace(/OverallRiskScore/g, scoreObj.OverallRiskScore);
                    }
            
                    try {
                        if (eval(expression)) {
                            computedRiskRating = rating;
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse( refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, computedRiskRating ) );
                        }
                    } catch (error) {
                        logger.log('info', `User Id : ${userIdFromToken} : RiskRatingBl : getDataForOverallRiskRating : error while evaluating the risk rating: ${error}`);
                    }
                }
            }
           
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_RISK_RATING_UNSUCCESSFUL));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_RISK_RATING_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch for all Sections details from the database
    */
    async getCompleteBCPDetails(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let profileQuestionsData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            profileQuestionsData    = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == profileQuestionsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == profileQuestionsData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution end. : profileQuestionsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == profileQuestionsData.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == profileQuestionsData.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const GET_BCP_DETAILS_DB_RESPONSE = await businessContinuityPlanDB.getCompleteBCPDetails(userIdFromToken, userNameFromToken, profileQuestionsData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : GET_BCP_DETAILS_DB_RESPONSE : ' + JSON.stringify(GET_BCP_DETAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BCP_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BCP_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_BCP_DETAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution end. : Error details :' + GET_BCP_DETAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_BCP_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BCP_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution end. : Error details : ' + GET_BCP_DETAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_BCP_DETAILS_DB_RESPONSE = await formatGetCompleteBCPDetails(userIdFromToken, GET_BCP_DETAILS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : FORMAT_GET_BCP_DETAILS_DB_RESPONSE : ' + JSON.stringify(FORMAT_GET_BCP_DETAILS_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BCP_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BCP_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  FORMAT_GET_BCP_DETAILS_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, FORMAT_GET_BCP_DETAILS_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getCompleteBCPDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch for all the review comment details for a particular BCP from the database
    */
    async getReviewComments(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let reviewPayload       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            reviewPayload       = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == reviewPayload || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == reviewPayload) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution end. : reviewPayload is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == reviewPayload.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == reviewPayload.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const GET_REVIEW_COMMENTS_DB_RESPONSE = await businessContinuityPlanDB.getBusinessContinuityPlansList(userIdFromToken, userNameFromToken, reviewPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : GET_REVIEW_COMMENTS_DB_RESPONSE : ' + JSON.stringify(GET_REVIEW_COMMENTS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_REVIEW_COMMENTS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_REVIEW_COMMENTS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_REVIEW_COMMENTS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution end. : Error details :' + GET_REVIEW_COMMENTS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_REVIEW_COMMENTS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_REVIEW_COMMENTS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution end. : Error details : ' + GET_REVIEW_COMMENTS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE = await formatGetReviewComments(userIdFromToken, GET_REVIEW_COMMENTS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE : ' + JSON.stringify(FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, FORMAT_GET_REVIEW_COMMENTS_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getReviewComments : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will publish the given BCP
    */
    async publishBCP(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let publishPayload          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;  
            publishPayload = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == publishPayload || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == publishPayload) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. : publishPayload is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == publishPayload.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == publishPayload.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const PUBLISH_BCP_DB_RESPONSE = await businessContinuityPlanDB.publishBCP(userIdFromToken, userNameFromToken, publishPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : PUBLISH_BCP_DB_RESPONSE : ' + JSON.stringify(PUBLISH_BCP_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == PUBLISH_BCP_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == PUBLISH_BCP_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (PUBLISH_BCP_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. : Error details :' + PUBLISH_BCP_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (PUBLISH_BCP_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && PUBLISH_BCP_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. : Error details : ' + PUBLISH_BCP_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            // const FORMAT_PUBLISH_BCP_DB_RESPONSE = await formatpublishBCP(userIdFromToken, PUBLISH_BCP_DB_RESPONSE);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : FORMAT_PUBLISH_BCP_DB_RESPONSE : ' + JSON.stringify(FORMAT_PUBLISH_BCP_DB_RESPONSE));
            // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_PUBLISH_BCP_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_PUBLISH_BCP_DB_RESPONSE) {
            //     logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. :  FORMAT_PUBLISH_BCP_DB_RESPONSE response is undefined or null.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            // }

            let EMAIL_DETAILS = PUBLISH_BCP_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            if(EMAIL_DETAILS.length) {
                try {                    
                    let emailTemplateObj = {
                        Subject : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Subject,
                        Body    : BCP_TEMPLATE.GENERIC_BCP["GENERIC_BCP_TEMPLATE"].Body
                    };
                    let BCManagerIDs        = EMAIL_DETAILS[0].BCMManger     != null ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersEmailIDs).join(',') : "";
                    let BusinessOwnerIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersEmailIDs).join(',') : "";
                    let BCCIDs              = EMAIL_DETAILS[0].BCC           != null ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCEmailIDs).join(',') : "";
                    let BusinessOwnerName   = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnerName).join(',') : "";
                    let SteeringCommitee    = EMAIL_DETAILS[0].SteeringCommitee != null ? JSON.parse(EMAIL_DETAILS[0].SteeringCommitee).map(n => n.EmailID).join(',') : "";
                    let toccEmails       = {
                        "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(BCCIDs),
                        "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(BusinessOwnerIDs + ","+ BCManagerIDs + "," +SteeringCommitee)
                    }; 
                    let templateMaster   = {                     
                        Name                    : EMAIL_DETAILS[0].BusinessFunctionName,
                        BusinessOwner           : BusinessOwnerName,
                        Group                   : EMAIL_DETAILS[0].BusinessGroupName,        
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        subject_text            : `BCP - (BIA Exercise) has been published by BC Manager for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName})`,
                        body_text               : `BCP - (BIA Exercise) has been published for Business Function - (${EMAIL_DETAILS[0].BusinessFunctionName}) by BC Manager  - (${userNameFromToken.split('@')[0]})`,
                        Note                    : ""
                    };
           
                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : emailData   : ' + JSON.stringify(emailData || null));
                    
                    let BCManagerGUIDs        = EMAIL_DETAILS[0].BCMManger != null     ? JSON.parse(EMAIL_DETAILS[0].BCMManger).map(n => n.BCMMangerUsersUserGUIDs).join(',') : "";
                    let BusinessOwnerGUIDs    = EMAIL_DETAILS[0].BusinessOwner != null ? JSON.parse(EMAIL_DETAILS[0].BusinessOwner).map(n => n.BusinessOwnersUserGUIDs).join(',') : "";
                    let BCCGUIDs              = EMAIL_DETAILS[0].BCC != null           ? JSON.parse(EMAIL_DETAILS[0].BCC).map(n => n.BCCUserGUIDs).join(',') : "";

                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(BCManagerGUIDs + "," + BusinessOwnerGUIDs + "," + BCCGUIDs)

                    let inappDetails     = {
                        inAppContent     : templateMaster.subject_text + "link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].Route, 
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : addUpdateNewActionItem : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            } 

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, PUBLISH_BCP_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : publishBCP : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch all the sections data for export draft report
    */
    async getBCPDraftResponse(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcpDraftPayload     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcpPayload          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken;  
        // userIdFromToken             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken           = 'kashish.sharma@secureyes.net';
        try {
            bcpDraftPayload = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcpDraftPayload || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcpDraftPayload) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. : bcpDraftPayload is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcpDraftPayload.BusinessContinuityPlanID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcpDraftPayload.BusinessContinuityPlanID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. : BusinessContinuityPlanID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcpDraftPayload.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcpDraftPayload.BusinessFunctionID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. : BusinessFunctionID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            bcpPayload = {
                BusinessContinuityPlanID: bcpDraftPayload.BusinessContinuityPlanId,
                BusinessFunctionID      : bcpDraftPayload.BusinessFunctionID,
            }

            const GET_COMPLETE_BCP_DRAFT_DB_RESPONSE = await businessContinuityPlanDB.getBCPDraftResponse(userIdFromToken, userNameFromToken, bcpDraftPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : GET_COMPLETE_BCP_DRAFT_DB_RESPONSE : ' + JSON.stringify(GET_COMPLETE_BCP_DRAFT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_COMPLETE_BCP_DRAFT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_COMPLETE_BCP_DRAFT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLETE_BCP_DRAFT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. : Error details :' + GET_COMPLETE_BCP_DRAFT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLETE_BCP_DRAFT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_COMPLETE_BCP_DRAFT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. : Error details : ' + GET_COMPLETE_BCP_DRAFT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            // for listing page and users type identification
            const BUSINESS_CONT_PLANS_LIST_DB_RESPONSE = await businessContinuityPlanDB.getBusinessContinuityPlansList(userIdFromToken, userNameFromToken, bcpPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : BUSINESS_CONT_PLANS_LIST_DB_RESPONSE : ' + JSON.stringify(BUSINESS_CONT_PLANS_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_CONT_PLANS_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_CONT_PLANS_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. :  update site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Error details :' + BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBusinessContinuityPlansList : Execution end. : Error details : ' + BUSINESS_CONT_PLANS_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE = await formatGetCompleteBCPDraft(userIdFromToken, GET_COMPLETE_BCP_DRAFT_DB_RESPONSE, BUSINESS_CONT_PLANS_LIST_DB_RESPONSE, bcpDraftPayload, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE : ' + JSON.stringify(FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. :  FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, FORMAT_GET_COMPLETE_BCP_DRAFT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBCPDraftResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will fetch BIA Rating master data from the database
    */
    async getBIARatingMasterData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : Execution started.');

            const BIA_RATING_DB_RESPONSE = await businessContinuityPlanDB.getBIARatingMasterData(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : BIA_RATING_DB_RESPONSE : ' + JSON.stringify(BIA_RATING_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BIA_RATING_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BIA_RATING_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : Execution end. : BIA_RATING_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (BIA_RATING_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : Execution end. : Error details :' + BIA_RATING_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (BIA_RATING_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BIA_RATING_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : Execution end. : Error details : ' + BIA_RATING_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Format the BIA Rating data
            let biaRatingList = [];
            if (BIA_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                for(const obj of Object.values(BIA_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                    biaRatingList.push({
                        "id"          : obj.BIARatingID,
                        "value"       : obj.Name,
                        "description" : obj.Description
                    });
                }
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : Execution end.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, { biaRatingList: biaRatingList }));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getBIARatingMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
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
            errorCode   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: errorMessage,
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
            errorCode   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        },
    };
}

async function formatInitiateReviewList(userIdFromToken, DBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatInitiateReviewList : Execution Started.');

        let reviewList  = [];
        // if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        //     reviewList  = DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        // }
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                reviewList.push({
                    "BusinessFunctionProfileID"     : obj.BusinessFunctionProfileID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?  Number(obj.BusinessFunctionProfileID) : obj.BusinessFunctionProfileID,
                    "BusinessFunctionID"            : Number(obj.BusinessFunctionID),
                    "BusinessFunctionName"          : obj.BusinessFunctionName, 
                    "ShortCode"                     : obj.ShortCode, 
                    "LastReviewed"                  : null,
                    "BusinessGroupName"             : obj.BusinessGroupName, 
                    "FBCCID"                        : obj.FBCCID,
                    "FBCCName"                      : obj.FBCCName,
                    "DocStatusID"                   : obj.DocStatusID,
                    "DocStatus"                     : obj.DocStatus,
                    "BusinessGroupID"               : Number(obj.BusinessGroupId)
                });   
            }
            reviewList = Array.from(new Set(reviewList.map(a => a.BusinessFunctionID))).map(BusinessFunctionID => {
                return reviewList.find(a => a.BusinessFunctionID === BusinessFunctionID)
            })
        }
        if (DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            if(reviewList.length) {
                DBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].forEach(n => {
                    reviewList.forEach(rev => {
                        if (n.BusinessFunctionID == rev.BusinessFunctionID) {
                            rev.LastReviewed =   ( n.LastReviewed != null ? n.LastReviewed : null)
                        }
                    })
                })
            }
        }

        return  {
            "reviewList" : reviewList
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatInitiateReviewList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function formatBusinessContinuityPlanList(userIdFromToken, getBCPDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatBusinessContinuityPlanList : Execution Started.');

        let BCPLists            = [];
        let finalList           = [];
        let userBasedBCPList    = [];
        let BCManagersList      = [];
        let BusinessOwnersList  = [];
        let BCCUsersList        = [];
        let comments            = [];
        let commentsList        = [];
        let formattedDate       = [];
        let StandardUsersList   = [];
        let SteeringUsersList   = [];
        let IsSteeringUser;

        BCPLists            = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        BCManagersList      = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        BusinessOwnersList  = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        SteeringUsersList   = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        BCCUsersList        = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        comments            = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        StandardUsersList   = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];

        let SteeringGUIDS   = SteeringUsersList.map((user) => user.UserGUID);
        IsSteeringUser = SteeringGUIDS.includes(userIdFromToken);
        StandardUsersList   = StandardUsersList.filter((item) => !SteeringGUIDS.includes(item.StandardUserGUID))
       // console.log("Steering Users : ", IsSteeringUser);

        let IsBCManager                 = (BCManagersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCManagersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCManagersList.some((admin) => userIdFromToken === admin.AdminGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsBusinessOwner             = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BusinessOwnersList.some((owner) => userIdFromToken === owner.BusinessOwner) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // let IsBCCUser                   = (BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ||
        //      BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCCUsersList.filter(ele => ele.IsFunctionalAdmin == false).some((bcc) => userIdFromToken === bcc.BCCGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsBCCUser                   = (BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCCUsersList.some((bcc) => userIdFromToken === bcc.BCCGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsStandardUser              = (StandardUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || StandardUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (StandardUsersList.some((user) => userIdFromToken === user.StandardUserGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // let BusinessFunctionsIDArray    = (BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? BCCUsersList.filter((item) => userIdFromToken === item.BCCGUID && item.IsFunctionalAdmin == false).map((obj) => Number(obj.BusinessFunctionsID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BusinessFunctionsIDArray    = (BCCUsersList && BCCUsersList.length > 0) ? BCCUsersList.filter(item => userIdFromToken === item.BCCGUID).map(obj => Number(obj.BusinessFunctionsID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BusinessFunctionsIDArrayBO  = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? BusinessOwnersList.filter((item) => userIdFromToken === item.BusinessOwner).map((obj) => Number(obj.BusinessFunctionsID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BusinessFunctionsArrayStandard = (StandardUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || StandardUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? StandardUsersList.filter((item) => userIdFromToken === item.StandardUserGUID).map((obj) => Number(obj.BusinessFunctionsID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        for(const obj of Object.values(BCPLists)){

            let MTPD = (obj.Original_MTPD !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${obj.Original_MTPD.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${obj.Original_MTPD.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}` : '_';
            let RTO = (obj.Original_RTO !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${obj.Original_RTO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${obj.Original_RTO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}` : '_';
            let RPO = (obj.Original_RPO !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${obj.Original_RPO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${obj.Original_RPO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}` : '_';

            if(obj.LastReviewDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                let strippedDate    = (obj.LastReviewDate).toISOString().split("T")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                let inputDate       = new Date(strippedDate);
                formattedDate       = inputDate.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit'})
            } else {
                formattedDate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            }

            finalList.push({
                "BusinessContinuityPlanID"      : Number(obj.BusinessContinuityPlanId),
                "BusinessFunctionID"            : Number(obj.BusinessFunctionID),
                "BusinessFunctionName"          : obj.BusinessFunctionName,
                "BusinessGroupID"               : Number(obj.BusinessGroupID),
                "BusinessGroup"                 : obj.BusinessGroup,
                "MTPDValue"                     : MTPD,
                "RTOValue"                      : RTO,
                "RPOValue"                      : RPO,
                "MACValue"                      : (obj.MAC !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${Number(obj.MAC)}%` : '_',
                "MNPRValue"                     : (obj.MNPR !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(obj.MNPR) : '_',
                "FBCCID"                        : obj.FBCCID,
                "FBCCName"                      : obj.FBCCName,
                "LastReviewDate"                : (obj.LastReviewDate),
                "FinalDate"                     : formattedDate,
                "MTPDID"                        : obj.MTPDID ? Number(obj.MTPDID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "RTOID"                         : obj.RTOID ? Number(obj.RTOID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "RPOID"                         : obj.RPOID ? Number(obj.RPOID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "DocStatusID"                   : obj.DocStatusID ? Number(obj.DocStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "DocStatus"                     : obj.DocStatus ? obj.DocStatus : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "CurrentWorkflowStatusID"       : (obj.CurrentWorkFlowStatusID) ? Number(obj.CurrentWorkFlowStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "CurrentWorkflowStatus"         : (obj.CurrentWorkFlowStatus) ? obj.CurrentWorkFlowStatus : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "BIARating"                     : (obj.BIA !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? obj.BIA : '_',
                "BIARatingDescription"          : obj.BIARatingDescription ? obj.BIARatingDescription : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,                                
            })
        }

        finalList.forEach((item) => {
            let BCCUserList = BCCUsersList.filter((obj) => obj.BusinessFunctionsID == item.BusinessFunctionID)
            let BCCNames = BCCUsersList.filter((obj) => obj.BusinessFunctionsID == item.BusinessFunctionID ).map((names) => names.BCCName);
            item["BCCName"] = (BCCNames.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? BCCNames.join(",") : CONSTANT_FILE_OBJ.APP_CONSTANT.BCCNOTASSIGNED;
            let FilteredUserList = BCCUserList.filter(n => n.BCCGUID == userIdFromToken)
            if (FilteredUserList.length) {
                item['IsBCCValidUser'] =CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            } else {
                item['IsBCCValidUser'] =CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }
            if (BCCNames.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                item["BCCNotFound"] = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            } else {
                item["BCCNotFound"] = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            }
        });

        if(IsBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
            userBasedBCPList = finalList;
        } else if (IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE){
            userBasedBCPList = finalList.filter((obj) => BusinessFunctionsIDArrayBO.includes(obj.BusinessFunctionID));
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE){
            userBasedBCPList = finalList.filter((obj) => BusinessFunctionsIDArray.includes(obj.BusinessFunctionID));
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && IsBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && IsStandardUser === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            userBasedBCPList = finalList.filter((item) => BusinessFunctionsArrayStandard.includes(item.BusinessFunctionID));
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            userBasedBCPList    = finalList.filter((obj) => BusinessFunctionsIDArrayBO.includes(obj.BusinessFunctionID));
            let BCCBCPList      = finalList.filter((obj) => BusinessFunctionsIDArray.includes(obj.BusinessFunctionID));
            userBasedBCPList = Array.from(new Set([...userBasedBCPList, ...BCCBCPList]))
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && IsBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && IsSteeringUser === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
            userBasedBCPList = finalList.filter((item) => item.DocStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE)
        } else {
            userBasedBCPList = finalList
        }

        if (comments !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && comments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (item of Object.values(comments)) {
                commentsList.push({
                    "BusinessContinuityPlanID"  : Number(item.BusinessContinuityPlanID),
                    "BusinessFunctionID"        : Number(item.BusinessFunctionId),
                    "CommentID"                 : Number(item.CommentID),
                    "CommentBody"               : item.Comment,
                    "CommentedByUserName"       : item.FullName,
                    "CommentedByUserGUID"       : item.UserGUID,
                    "UserName"                  : item.UserName,
                    "CreatedDate"               : item.CreatedDate
                })
            }
        } else {
            comments = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatBusinessContinuityPlanList : User Based BCP List : ' + userBasedBCPList);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatBusinessContinuityPlanList : Execution End.');

        return {
            "BusinessContinuityPlansList"   : userBasedBCPList,
            "IsBCManager"                   : IsBCManager,
            "IsBusinessOwner"               : IsBusinessOwner,
            "IsBCCUser"                     : IsBCCUser,
            "BCManagersList"                : BCManagersList,
            "BusinessOwnersList"            : BusinessOwnersList,
            "BCCUsersList"                  : BCCUsersList,
            "commentList"                   : commentsList,
            "IsStandardUser"                : IsStandardUser,
            "StandardUserList"              : StandardUsersList,
            "ExportFileLimit"               : APP_CONFIG_FILE_OBJ.EXPORT_FILE_LIMIT.BCP_EXORT_LIMIT
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatBusinessContinuityPlanList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatUnderReviewList(userIdFromToken, getBCPDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatUnderReviewList : Execution Started.');

        let BCPLists            = [];
        let finalList           = [];
        let BCCUsersList        = [];
        let BCManagersList      = [];
        let BusinessOwnersList  = [];
        let userBasedBCPList    = [];

        BCPLists            = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        BCManagersList      = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        BusinessOwnersList  = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        BCCUsersList        = getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getBCPDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];

        let IsBCManager                 = (BCManagersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCManagersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCManagersList.some((admin) => userIdFromToken === admin.AdminGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsBusinessOwner             = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BusinessOwnersList.some((owner) => userIdFromToken === owner.BusinessOwner) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsBCCUser                   = (BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCCUsersList.filter(item => item.IsFunctionalAdmin == false).some((bcc) => userIdFromToken === bcc.BCCGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BusinessFunctionsIDArray    = (BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? BCCUsersList.filter((item) => userIdFromToken === item.BCCGUID && item.IsFunctionalAdmin == false).map((obj) => Number(obj.BusinessFunctionsID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BusinessFunctionsIDArrayBO  = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? BusinessOwnersList.filter((item) => userIdFromToken === item.BusinessOwner).map((obj) => Number(obj.BusinessFunctionsID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        // console.log("Business Owner based array : ", BusinessFunctionsIDArrayBO);
        // console.log("BCC based array : ", BusinessFunctionsIDArray);

        for(const obj of Object.values(BCPLists)){
            finalList.push({
                "BusinessContinuityPlanID"      : Number(obj.BusinessContinuityPlanId),
                "BusinessFunctionID"            : Number(obj.BusinessFunctionID),
                "BusinessFunctionName"          : obj.BusinessFunctionName,
                "BusinessGroupID"               : Number(obj.BusinessGroupID),
                "BusinessGroup"                 : obj.BusinessGroup,
                "MTPDValue"                     : obj.MTPD,
                "RTOValue"                      : obj.RTO,
                "RPOValue"                      : obj.RPO,
                "FBCCID"                        : obj.FBCCID,
                "FBCCName"                      : obj.FBCCName,
                "NextReviewDate"                : obj.LastReviewDate,
                "MTPDID"                        : obj.MTPDID ? Number(obj.MTPDID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "RTOID"                         : obj.RTOID ? Number(obj.RTOID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "RPOID"                         : obj.RPOID ? Number(obj.RPOID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "DocStatusID"                   : obj.DocStatusID ? Number(obj.DocStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "DocStatus"                     : obj.DocStatus ? obj.DocStatus : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            })
        }

        if (IsBCManager === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {;
            userBasedBCPList = finalList;
        } else if (IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            userBasedBCPList = finalList.filter((obj) => BusinessFunctionsIDArrayBO.includes(obj.BusinessFunctionID));
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            userBasedBCPList = finalList.filter((obj) => BusinessFunctionsIDArray.includes(obj.BusinessFunctionID));
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            userBasedBCPList = finalList
        } else if (IsBCCUser === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsBusinessOwner === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            userBasedBCPList = finalList.filter((obj) => BusinessFunctionsIDArrayBO.includes(obj.BusinessFunctionID));
            let BCCBCPList = finalList.filter((obj) => BusinessFunctionsIDArray.includes(obj.BusinessFunctionID));
            // userBasedBCPList = userBasedBCPList.concat(BCCBCPList);
            userBasedBCPList = Array.from(new Set([...userBasedBCPList, ...BCCBCPList]))
        } else {
            userBasedBCPList = finalList
        }

        // console.log("User Based BCP List : ", userBasedBCPList);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatUnderReviewList : Filtered User Based BCP List : ' + userBasedBCPList);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatUnderReviewList : Execution End.');

        return {
            "BusinessContinuityPlansList"   : userBasedBCPList,
            "BCManagersList"                : BCManagersList,
            "BusinessOwnersList"            : BusinessOwnersList,
            "BCCUsersList"                  : BCCUsersList,
            "IsBCManager"                   : IsBCManager,
            "IsBusinessOwner"               : IsBusinessOwner,
            "IsBCCUser"                     : IsBCCUser
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatUnderReviewList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatGetBusinessProfileQuestions(userIdFromToken, getDBResponse, BCPListDBResponse, profileQuestionsData,getCompleteBCP, accountGUIDFromToken){
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetBusinessProfileQuestions : Execution Started.');

        let businessFunctionProfileDetails = [];
        let profileQuestions               = [];
        let Customers                      = [];
        let ProfilingQuestions             = [];
        let CriticalBusinessActivities     = [];
        let detailsBusinessFunctionProfile = [];
        let profileQuestionsArray          = [];
        let finalProfileQuestionArray      = [];
        let infoBusinessFunctionProfile    = [];
        let newCustomersArray              = [];
        let newProfilingQuestions          = [];
        let newBusinessProcesses           = [];
        let customersList                  = [];
        let businessProcessesList          = [];
        let BCPLists                       = [];
        let CurrentWorkflowStatusID        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let CurrentWorkflowStatus          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BCPProfileQuestions            = [];
        let MTPD                           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let RTO                            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let RPO                            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let MNPR                           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let MAC                            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let modifiedProfiligQuestions      = [];
        let modifiedQuestionsArray         = [];
        let completeSavedData               = [];
        let SectionDetails                  = {};
        let IsSavedObj                      = {};

        businessFunctionProfileDetails = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        profileQuestionsArray          = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ProfilingResponse) : [];
        customersList                  = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        businessProcessesList          = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        BCPLists                       = BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        BCPProfileQuestions            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        // Section1Details                = BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        // Section3Details                = BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        // Section5Details                = BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIFTEEN] && BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIFTEEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIFTEEN] : [];
        // Section7Details                = BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWENTY_THREE] && BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWENTY_THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? BCPListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWENTY_THREE] : [];

        completeSavedData              = getCompleteBCP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getCompleteBCP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getCompleteBCP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

        if(completeSavedData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            SectionDetails = completeSavedData;
            if (SectionDetails) {
                IsSavedObj = {
                    "Section1IsSaved": SectionDetails.Section1IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section1IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section2IsSaved": SectionDetails.Section2IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section2IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section3IsSaved": SectionDetails.Section3IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section3IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section4IsSaved": SectionDetails.Section4IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section4IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section5IsSaved": SectionDetails.Section5IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section5IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section6IsSaved": SectionDetails.Section6IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section6IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section7IsSaved": SectionDetails.Section7IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section7IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section8IsSaved": SectionDetails.Section8IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section8IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                }            
            }
        }

        // changing variable names for Business Processes
        businessProcessesList = businessProcessesList.map((obj) => {
            let { BusinessProcessID, BusinessProcessName } = obj;
            let ActivityID = Number(BusinessProcessID);
            let ActivityName = BusinessProcessName;

            return {ActivityID, ActivityName}
        })

        // customersList = customersList.map((obj) => {
        //     let { CustomerID, CustomerName } = obj;
        //     CustomerID = Number(CustomerID);

        //     return {CustomerID, CustomerName}
        // })

        const uniqueCustomerNames = new Set();

        customersList = customersList.map(obj => {
            let { CustomerID, CustomerName } = obj;
            CustomerID = Number(CustomerID);
        
            return { CustomerID, CustomerName };
        }).filter(obj => {
            if (uniqueCustomerNames.has(obj.CustomerName)) {
                return false;
            } else {
                uniqueCustomerNames.add(obj.CustomerName);
                return true;
            }
        });
        

        for (const obj of Object.values(businessFunctionProfileDetails)) {

            Customers                   = (obj.CustomerData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.CustomerData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.CustomerData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            ProfilingQuestions          = (obj.ProfilingResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.ProfilingResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.ProfilingResponse) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            CriticalBusinessActivities  = (obj.BusinessProcessData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.BusinessProcessData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.BusinessProcessData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            newCustomersArray = (Customers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Customers.map(ele => ({
                CustomerID: Number(ele.CustomerID),
                Description: ele.CustomerName,
                Affiliate: (ele.IsInternal == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) ? CONSTANT_FILE_OBJ.APP_CONSTANT.INTERNAL : CONSTANT_FILE_OBJ.APP_CONSTANT.EXTERNAL
            })) : []

            newProfilingQuestions = (ProfilingQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? ProfilingQuestions.map(ele => ({
                ProfilingQuestionID: ele.ID,
                ProfilingQuestion: ele.ProfillingQuestions,
                ProfilingAnswer: ele.ProfilingResponse
            })) : BCPProfileQuestions.map(obj => ({
                ProfilingQuestionID: Number(obj.ID),
                ProfilingQuestion: obj.ProfillingQuestions
            }))

            modifiedProfiligQuestions = (BCPProfileQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? 
                                        await mapQuestionsAndResponses(ProfilingQuestions, BCPProfileQuestions) : 
                                        [];

            newBusinessProcesses = (CriticalBusinessActivities != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CriticalBusinessActivities.map(ele => ({
                ActivityID: ele.BusinessProcessID,
                Description: ele.BusinessProcessName
            })) : []

            detailsBusinessFunctionProfile.push({
                "BusinessContinuityPlanID"      : Number(obj.BusinessContinuityPlanId),
                "BusinessFunctionProfileID"     : Number(obj.BusinessFunctionProfileID),
                "BusinessFunctionID"            : Number(obj.BusinessFunctionID),
                "BusinessFunctionName"          : obj.BusinessFunctionName,
                "BusinessDescription"           : obj.BusinessDescription,
                "BusinessServices"              : obj.BusinessProductsServices,
                "CriticalBusinessActivities"    : newBusinessProcesses,
                "Customers"                     : newCustomersArray,
                // "ProfilingQuestions"            : newProfilingQuestions,
                "ProfilingQuestions"            : modifiedProfiligQuestions,
                "BusinessOwnerGUID"             : obj.FBCCID,
                "BusinessOwnerName"             : obj.UserName ? obj.UserName.split(CONSTANT_FILE_OBJ.APP_CONSTANT.AT_SYMBOL)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_STRING,
                "IsReviewed"                    : obj.IsReviewed,
                "ReviewedDate"                  : obj.ReviewedDate,
                "ReviewedBy"                    : obj.ReviewedBy,
                "ShortCode"                     : obj.ShortCode,
                "BCCNames"                      : (obj.BCC && obj.BCC.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((JSON.parse(obj.BCC).filter(n => n.BusinessFunctionsID == obj.BusinessFunctionID && n.IsFunctionalAdmin == false)).map(item => item["BCCName"]).join(',')) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "IsSaved"                       : (obj.IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (obj.IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            })
        }

        finalProfileQuestionArray = (profileQuestionsArray != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? profileQuestionsArray.map(item => ({
            ProfilingQuestionID : Number(item.ID),
            ProfilingQuestion : item.ProfillingQuestions
        })) : BCPProfileQuestions.map(obj => ({
            ProfilingQuestionID : Number(obj.ID),
            ProfilingQuestion: obj.ProfillingQuestions
        }))

        modifiedQuestionsArray = (BCPProfileQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ?
                                    await mapQuestionsAndResponses(profileQuestionsArray, BCPProfileQuestions) :
                                    [];

        // console.log("Profile questions : ", modifiedQuestionsArray);
        
        for (const obj of Object.values(businessFunctionProfileDetails)) {
            infoBusinessFunctionProfile.push({
                "BusinessContinuityPlanID"      : Number(obj.BusinessContinuityPlanId),
                "BusinessFunctionProfileID"     : Number(obj.BusinessFunctionProfileID),
                "BusinessFunctionID"            : Number(obj.BusinessFunctionID),
                "BusinessFunctionName"          : obj.BusinessFunctionName,
                "BusinessDescription"           : obj.BusinessDescription,
                "Affiliation"                   : ENUMS_OBJ.AFFILIATION_LIST,
                // "ProfilingQuestions"            : finalProfileQuestionArray,
                "ProfilingQuestions"            : modifiedQuestionsArray,
                "FBCCID"                        : obj.FBCCID,
                "FBCCName"                      : obj.UserName ? obj.UserName.split(CONSTANT_FILE_OBJ.APP_CONSTANT.AT_SYMBOL)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_STRING,
                "Customers"                     : newCustomersArray,
                "CriticalBusinessActivities"    : newBusinessProcesses,
                "BusinessProcessesList"         : businessProcessesList,
                "TotalCustomersList"            : customersList
            })
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetBusinessProfileQuestions : BCPLists.' + JSON.stringify(BCPLists));

        // fetching the DocStatus for a particular BCP
        if (BCPLists !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BCPLists.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            CurrentWorkflowStatusID = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkFlowStatusID;
            CurrentWorkflowStatus = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkFlowStatus;
            MTPD = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Original_MTPD;
            RTO = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Original_RTO;
            RPO = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Original_RPO;
            MTPD = (MTPD !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${MTPD.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${MTPD.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}` : '_';
            RTO = (RTO !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${RTO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${RTO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}` : '_';
            RPO = (RPO !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${RPO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${RPO.split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split('_')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}` : '_';
            MNPR = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].MNPR;
            MAC = BCPLists.filter((item) => (item.BusinessContinuityPlanId == profileQuestionsData.BusinessContinuityPlanID && item.BusinessFunctionID == profileQuestionsData.BusinessFunctionID))[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].MAC;
        } else {
            CurrentWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            CurrentWorkflowStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            MTPD = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            RTO = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            RPO = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            MNPR = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            MAC = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }

        

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetBusinessProfileQuestions : Execution End.');

        return {
            "BusinessFunctionProfileDetails"    : detailsBusinessFunctionProfile,
            "BusinessContinuityQuestionsList"   : infoBusinessFunctionProfile,
            "CurrentWorkflowStatusID"           : Number(CurrentWorkflowStatusID),
            "CurrentWorkflowStatus"             : CurrentWorkflowStatus,
            "MTPD"                              : MTPD,
            "RTO"                               : RTO,
            "RPO"                               : RPO,
            "MNPR"                              : MNPR,
            "MAC"                               : MAC,
            "completeSavedData"                 : IsSavedObj
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetBusinessProfileQuestions : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatSaveBusinessFunctionProfile(userIdFromToken, getDBResponse, getCompleteBCP, accountGUIDFromToken){
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatSaveBusinessFunctionProfile : Execution Started.');

        let businessFunctionProfileDetails  = [];
        let Customers                       = [];
        let ProfilingQuestions              = [];
        let CriticalBusinessActivities      = [];
        let detailsBusinessFunctionProfile  = [];
        let newCustomersArray               = [];
        let newProfilingQuestions           = [];
        let newBusinessProcesses            = [];
        let completeSavedData               = [];
        let SectionDetails                  = {};
        let IsSavedObj                      = {};

        businessFunctionProfileDetails = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        completeSavedData              = getCompleteBCP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getCompleteBCP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getCompleteBCP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

        if(completeSavedData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            SectionDetails = completeSavedData;
            if (SectionDetails) {
                IsSavedObj = {
                    "Section1IsSaved": SectionDetails.Section1IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section1IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section2IsSaved": SectionDetails.Section2IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section2IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section3IsSaved": SectionDetails.Section3IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section3IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section4IsSaved": SectionDetails.Section4IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section4IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section5IsSaved": SectionDetails.Section5IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section5IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section6IsSaved": SectionDetails.Section6IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section6IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section7IsSaved": SectionDetails.Section7IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section7IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section8IsSaved": SectionDetails.Section8IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails.Section8IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                }            
            }
        }
        if (businessFunctionProfileDetails !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && businessFunctionProfileDetails.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){

            for (const obj of Object.values(businessFunctionProfileDetails)) {
    
                Customers = (obj.CustomerData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.CustomerData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.CustomerData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                ProfilingQuestions = (obj.ProfilingResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.ProfilingResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.ProfilingResponse) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                CriticalBusinessActivities = (obj.BusinessProcessData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.BusinessProcessData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.BusinessProcessData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
                newCustomersArray = (Customers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Customers.map(ele => ({
                    CustomerID: Number(ele.CustomerID),
                    Description: ele.CustomerName,
                    Affiliate: (ele.IsInternal == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) ? 'Internal' : 'External'
                })) : []
    
                newProfilingQuestions = (ProfilingQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? ProfilingQuestions.map(ele => ({
                    ProfilingQuestionID: ele.ID,
                    ProfilingQuestion: ele.ProfillingQuestions,
                    ProfilingAnswer: ele.ProfilingResponse
                })) : []
    
                newBusinessProcesses = (CriticalBusinessActivities != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CriticalBusinessActivities.map(ele => ({
                    ActivityID: ele.BusinessProcessID,
                    Description: ele.BusinessProcessName
                })) : []
    
                detailsBusinessFunctionProfile.push({
                    "BusinessContinuityPlanID"      : Number(obj.BusinessContinuityPlanId),
                    "BusinessFunctionProfileID"     : Number(obj.BusinessFunctionProfileID),
                    "BusinessFunctionID"            : Number(obj.BusinessFunctionID),
                    "BusinessFunctionName"          : obj.BusinessFunctionName,
                    "BusinessDescription"           : obj.BusinessDescription,
                    "BusinessServices"              : obj.BusinessProductsServices,
                    "CriticalBusinessActivities"    : newBusinessProcesses,
                    "Customers"                     : newCustomersArray,
                    "ProfilingQuestions"            : newProfilingQuestions,
                    "FBCCID"                        : obj.FBCCID,
                    "FBCCName"                      : obj.UserName ? obj.UserName.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : '',
                    "IsReviewed"                    : obj.IsReviewed,
                    "ReviewedDate"                  : obj.ReviewedDate,
                    "ReviewedBy"                    : obj.ReviewedBy,
                    "IsSaved"                       : (obj.IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO
                })
            }
        } else {
            detailsBusinessFunctionProfile = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatSaveBusinessFunctionProfile : Execution End.');

        return {
            "BusinessFunctionProfileDetails": detailsBusinessFunctionProfile,
            "CompleteSavedData"             : IsSavedObj
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatSaveBusinessFunctionProfile : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    } 
}

async function getFormatBusinessProcessData (userIdFromToken, getInfoDBResponse, getDataDBResponse, sectionData, accountGUIDFromToken){
    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatBusinessProcessData : Execution Started.');
    let siteList                = [];
    let businessProcessList     = [];
    let businessProcessDetails  = [];
    let valueList               = [];
    let subProcessList          = [];

    if (getInfoDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        for(const obj of Object.values(getInfoDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
          siteList.push({
                "SiteID"    : Number(obj.SiteId),
                "SiteName"  : obj.Name, 
            });   
        }
    }

    if (getInfoDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        for(const obj of Object.values(getInfoDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
          businessProcessList.push({
                "BusinessProcessID"     : Number(obj.BusinessProcessId),
                "BusinessProcessName"   : obj.BusinessProcessName, 
            });   
        }
    }
    
    if (getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        for(const obj of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
            if (obj.BusinessProcessDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                for(const pro of Object.values(JSON.parse(obj.BusinessProcessDetails))) {           
                    let SubBusinessProcess      = obj.SubBusinessProcess != null ? (JSON.parse(obj.SubBusinessProcess)).filter(it => Number(it.BusinessProcessId) == Number(pro.BusinessProcessId)) : []                 
                    let SubProcessActivities    = [];                    
                    if (SubBusinessProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {        
                        for(const sub of Object.values(SubBusinessProcess)) {
                            SubProcessActivities.push({                                                    
                                BusinessProcessID           : Number(sub.BusinessProcessId),
                                Description                 : sub.SubBusinessProcessDescription,
                                Name                        : sub.SubBusinessProcessName,
                                SubBusinessProcessId        : Number(sub.SubBusinessProcessId),
                                BusinessContinuityPlanID    : Number(obj.BusinessContinuityPlanID),                                
                            });
                        }
                    }
                   
                    businessProcessDetails.push({                            
                        BusinessContinuityPlanID    : Number(obj.BusinessContinuityPlanID),                         
                        BusinessProcessID           : Number(pro.BusinessProcessId),
                        BusinessProcessDesc         : pro.BusinessProcessDescription,
                        BusinessProcessDetailsID    : Number(pro.BusinessProcessDetailsID),
                        BusinessProcessName         : pro.BusinessProcessName,
                        SiteID                      : Number(pro.SiteID),
                        SiteName                    : pro.SiteName,
                        NormalWorkingHoursStart     : pro.NormalWH_StartTime,
                        NormalWorkingHoursEnd       : pro.NormalWH_EndTime,
                        PeakWorkingHoursStart       : pro.PeakWH_StartTime,
                        PeakWorkingHoursEnd         : pro.PeakWH_EndTime,
                        MTPD                        : Number(pro.MTPD.split('_')[0]),
                        MTPDUnit                    : pro.MTPD.split('_')[1], //== 1 ? "Hours" : "Day(s)",
                        RTO                         : Number(pro.RTO.split('_')[0]),
                        RTOUnit                     : pro.RTO.split('_')[1],  //== 1 ? "Hours" : "Day(s)",
                        RPO                         : Number(pro.RPO.split('_')[0]),
                        RPOUnit                     : pro.RPO.split('_')[1],  //== 1 ? "Hours" : "Day(s)",
                        MAC                         : pro.MAC,
                        MNPRRemoteHeadCount         : pro.RemoteHeadCount,
                        MNPROfficeHeadCount         : pro.OfficeHeadCount,
                        SubProcessActivities        : SubProcessActivities,
                        IsSaved                     : pro.IsSaved
        
                    }); 
                }
            }
        }
    }

    if (businessProcessDetails != null || businessProcessDetails != []) {
        for (const ob of Object.values(businessProcessDetails)) {
            subProcessList.push(ob.SubProcessActivities)    
        }
        subProcessList = subProcessList.flat();
    }

    if (getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) { 
        let filteredValuesData = getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].filter(n => n.BusinessFunctionsID == sectionData.BusinessFunctionId);
        if (filteredValuesData.length) {
            valueList = computeMaxValue(filteredValuesData)
        } else {
            valueList = [{
                RTO                 : '',
                RPO                 : '',
                RTOUnit             : '',
                RPOUnit             : '',
                BusinessFunctionsID : ''
            }]
        }
    }

    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatBusinessProcessData : Execution end.');

    return {
        "siteListInfo"                  : siteList,
        "businessProcessListInfo"       : businessProcessList,
        "BusinessProcessDetailsView"    : businessProcessDetails,
        "valueList"                     : valueList,
        "subProcessListView"            : subProcessList 
    }  
}


function computeMaxValue(data) {
    logger.log('info', 'User Id : : BusinessContinuityPlansBl : computeMaxValue : Execution started.' +JSON.stringify(data));

    const toHours = (value, unit) => unit === 2 ? value * 24 : value;
    
    let maxRTO = { value: -Infinity, unit: -1 };
    let maxRPO = { value: -Infinity, unit: -1 };
  
    data.forEach(item => {
        const rtoInHours = toHours(item.RecoveryTime, item.RecoveryTimeUnit);
        const rpoInHours = toHours(item.RecoveryPoint, item.RecoveryPointUnit);
    
        if (rtoInHours > toHours(maxRTO.value, maxRTO.unit)) {
        maxRTO.value = item.RecoveryTime;
        maxRTO.unit = item.RecoveryTimeUnit;
        }
    
        if (rpoInHours > toHours(maxRPO.value, maxRPO.unit)) {
        maxRPO.value = item.RecoveryPoint;
        maxRPO.unit = item.RecoveryPointUnit;
        }
    });

    let res = [{
        RTO                 : maxRTO.value,
        RPO                 : maxRPO.value,
        RTOUnit             : (maxRTO.unit == 1 ? 'Hours' : 'Day(s)'),
        RPOUnit             : (maxRPO.unit == 1 ? 'Hours' : 'Day(s)'),
        BusinessFunctionsID : data[0].BusinessFunctionsID  
    }]
  logger.log('info', 'User Id :  : BusinessContinuityPlansBl : computeMaxValue : Execution end.' +JSON.stringify(res));

  return res
  
}
async function getFormatDependenciesData(userIdFromToken, getDetailsDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatDependenciesData : Execution Started.');

        let DependenciesDetailsList     = [];
        let DependenciesInfoList        = [];
        let BusinessApplicationsList    = [];
        let DependentFunctionsList      = [];
        let DependencyTypesList         = [];
        let SuppliersList               = [];
        let BusinessProcesslist         = [];
        let BusinessSubActivityLists    = [];
        let transformedDependenciesData = [];
        let formatTechDependency        = [];
        let formatInterProcess          = [];
        let formatSupplierProcess       = [];

        DependenciesDetailsList            = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        DependenciesInfoList        = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // BusinessApplicationsList    = DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // DependentFunctionsList      = DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // DependencyTypesList         = DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // SuppliersList               = DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessApplication !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessApplication).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
           BusinessApplicationsList = JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessApplication).map((item) => {
                let { BusinessServiceAppsID, BusinessServicesAppsName } = item;
                let BusinessApplicationID = BusinessServiceAppsID;
                let BusinessApplication = BusinessServicesAppsName;

                return {BusinessApplicationID, BusinessApplication}
            })
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].DependentFunction !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].DependentFunction).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            DependentFunctionsList = JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].DependentFunction).map((item) => {
                let { BusinessFunctionsID, Name } = item;
                let BusinessFunctionID = BusinessFunctionsID;
                let BusinessFunction = Name;

                return { BusinessFunctionID, BusinessFunction }
            })
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].DependencyType !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].DependencyType).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            DependencyTypesList = JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].DependencyType).map((item) => {
                let { DependencyTypeId, DependencyType } = item;
                let DependencyID = DependencyTypeId;
                DependencyType = DependencyType;

                return { DependencyID, DependencyType }
            })
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Supplier !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Supplier).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            SuppliersList = JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Supplier).map((item) => {
                let { VendorID, Name } = item;
                let SupplierID = VendorID;
                let SupplierName = Name;

                return { SupplierID, SupplierName }
            })
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessProcess).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            BusinessProcesslist = JSON.parse(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessProcess).map((item) => {
                let { BusinessProcessId, BusinessProcessName } = item;
                let BusinessActivityID = BusinessProcessId;
                let BusinessActivity = BusinessProcessName;

                return { BusinessActivityID, BusinessActivity }
            })
        }

        if (DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            formatInterProcess = JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess)
            let uniqueMap = new Map();
            formatInterProcess.forEach((item) => {
                let key = `${item.BusinessProcessId}-${item.SubBusinessProcessId}-${item.SubBusinessProcessName}`;
                if(!uniqueMap.has(key)) {
                    uniqueMap.set(key, {
                        BusinessProcessID: item.BusinessProcessId,
                        SubBusinessProcessID: item.SubBusinessProcessId,
                        SubBusinessProcessName: item.SubBusinessProcessName
                    });
                }
            });
            let uniqueArray = Array.from(uniqueMap.values());
        }

        if (DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TechnologyDependencies !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TechnologyDependencies).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            formatTechDependency = JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TechnologyDependencies).map((item) => {
                let { TechnologyDependenciesId, BusinessProcessId, BusinessServiceAppsID, BusinessServicesAppsName, BusinessServiceAppsDescription, IsSaved } = item;
                TechnologyDependenciesId    = TechnologyDependenciesId;
                let ID                      = BusinessProcessId;
                let BusinessApplicaionID    = Number(BusinessServiceAppsID);
                let BusinessApplication     = BusinessServicesAppsName;
                let Description             = BusinessServiceAppsDescription;
                let IsEdit                  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                IsSaved                     = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { TechnologyDependenciesId, ID, BusinessApplicaionID, BusinessApplication, Description, IsEdit, IsSaved}
            })
        } else {
            formatTechDependency = [];
        }

        if (DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            formatInterProcess = JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess).map((item) => {
                let { InterdependentProcessesId, BusinessProcessId, SubBusinessProcessId, SubBusinessProcessName, BusinessFunctionsID, BusinessFunctionName, ID, DependencyType, DependencyDescription, IsSaved} = item;
                InterdependentProcessesId = InterdependentProcessesId;
                let ProcessID       = BusinessProcessId;
                let SubActivityID   = SubBusinessProcessId;
                let SubActivity     = SubBusinessProcessName;
                let Dependency      = DependencyDescription;
                let Function        = BusinessFunctionName;
                let DependencyID    = BusinessFunctionsID;
                let Type            = DependencyType;
                let TypeID          = ID;
                let IsEdit          = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                IsSaved             = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { InterdependentProcessesId, ProcessID, SubActivityID, SubActivity, Function, DependencyID, Dependency, Type, TypeID, IsEdit, IsSaved}
            })
        } else {
            formatInterProcess = [];
        }

        if (DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SupplierDependencies !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SupplierDependencies).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            formatSupplierProcess = JSON.parse(DependenciesDetailsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SupplierDependencies).map((item) => {
                let { SupplierDependenciesId, BusinessProcessId, SubBusinessProcessId, SubBusinessProcessName, VendorID, SupplierName, ID, DependencyType, DependencyDescription, IsSaved} = item;
                SupplierDependenciesId  = SupplierDependenciesId;
                let ProcessID           = BusinessProcessId;
                let SubActivityID       = SubBusinessProcessId;
                let SubActivity         = SubBusinessProcessName;
                let Dependency          = DependencyDescription;
                let SupplierID          = VendorID;
                Supplier                = SupplierName;
                let DependentTypeID     = ID;
                let Type                = DependencyType;
                let IsEdit              = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                IsSaved                 = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { SupplierDependenciesId, ProcessID, SubActivityID, SubActivity, SupplierID, Dependency, Type, Supplier, DependentTypeID, IsEdit, IsSaved}
            })
        } else {
            formatSupplierProcess = [];
        }

        const businessProcessIDsArray = BusinessProcesslist.map((obj) => obj.BusinessActivityID);

        formatTechDependency = formatTechDependency.filter((item) => businessProcessIDsArray.includes(item.ID));

        formatInterProcess = formatInterProcess.filter((item) => businessProcessIDsArray.includes(item.ProcessID));

        formatSupplierProcess = formatSupplierProcess.filter((item) => businessProcessIDsArray.includes(item.ProcessID));

        // console.log("Tech Process : ", formatTechDependency);
        // console.log("Inter Process : ", formatInterProcess);
        // console.log("Supplier Process : ", formatSupplierProcess);

        let originalDependenciesList = {
            "TechnologyDependencies": formatTechDependency,
            "InterDependentProcess" : formatInterProcess,
            "SupplierDependencies"  : formatSupplierProcess
        }

        if (DependenciesDetailsList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DependenciesDetailsList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            let oldDependenciesData = DependenciesDetailsList;
            transformedDependenciesData = oldDependenciesData.map((item) => {
                let TechnologyDependencies = (JSON.parse(item.TechnologyDependencies) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.TechnologyDependencies) : [];
                let InterDependentProcess = (JSON.parse(item.InterDependentProcess) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.InterDependentProcess) : [];
                let SupplierDependencies = (JSON.parse(item.SupplierDependencies) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.SupplierDependencies) : [];

                let groupedData = {};

                // grouping Technologies Dependencies by BusinessProcessID
                TechnologyDependencies.forEach((obj) => {
                    if (!groupedData[obj.BusinessProcessId]) {
                        groupedData[obj.BusinessProcessId] = {
                            BusinessProcessID: obj.BusinessProcessId,
                            BusinessProcessName: obj.BusinessProcessName,
                            TechnologyDependency: [],
                            InterdependentProcesses: [],
                            SupplierDependency: []
                        };
                    }
                    groupedData[obj.BusinessProcessId].TechnologyDependency.push({
                        BusinessProcessID: obj.BusinessProcessId,
                        BusinessApplicationName: obj.BusinessServicesAppsName,
                        Description: obj.BusinessServiceAppsDescription,
                        TechnologyDependenciesId : obj.TechnologyDependenciesId
                    });
                });

                // grouping Interdependent Processes by BusinessProcessID
                InterDependentProcess.forEach((obj) => {
                    if (!groupedData[obj.BusinessProcessId]) {
                        groupedData[obj.BusinessProcessId] = {
                            BusinessProcessID: obj.BusinessProcessId,
                            BusinessProcessName: obj.BusinessProcessName,
                            TechnologyDependency: [],
                            InterdependentProcesses: [],
                            SupplierDependency: []
                        };
                    }
                    groupedData[obj.BusinessProcessId].InterdependentProcesses.push({
                        ProcessActivityID: obj.SubBusinessProcessId,
                        ProcessActivityName: obj.SubBusinessProcessName,
                        Description: obj.DependencyDescription,
                        DependentFunction: obj.BusinessFunctionName,
                        DependencyType: obj.DependencyType,
                        InterdependentProcessesId : obj.InterdependentProcessesId
                    });
                });

                // grouping Supplier Dependencies by BusinessProcessID
                SupplierDependencies.forEach((obj) => {
                    if (!groupedData[obj.BusinessProcessId]) {
                        groupedData[obj.BusinessProcessId] = {
                            BusinessProcessID: obj.BusinessProcessId,
                            BusinessProcessName: obj.BusinessProcessName,
                            TechnologyDependency: [],
                            InterdependentProcesses: [],
                            SupplierDependencies: []
                        };
                    }
                    groupedData[obj.BusinessProcessId].SupplierDependency.push({
                        SubActivityID: obj.SubBusinessProcessId,
                        SubActivityName: obj.SubBusinessProcessName,
                        Description: obj.DependencyDescription,
                        SupplierID: obj.VendorID,
                        SupplierName: obj.SupplierName,
                        DependentTypeID: obj.ID,
                        DependentTypeName: obj.DependencyType,
                        SupplierDependenciesId : obj.SupplierDependenciesId
                    });
                });

                groupedData = businessProcessIDsArray.reduce((acc, id) => {
                    if (groupedData[id]) {
                        acc[id] = groupedData[id];
                    }
                    return acc;
                }, {});

                // console.log("GroupedData : ", groupedData);

                return Object.values(groupedData);

            })
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatDependenciesData : Execution End.');

        return {
            "DependenciesDetails"           : transformedDependenciesData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],
            "OriginalDependenciesDetails"   :[originalDependenciesList],
            // "DependenciesInfoList"          : DependenciesInfoList,
            "BusinessApplicationsList"      : BusinessApplicationsList,
            "DependencyTypeList"            : DependencyTypesList,
            "DependentFunctionsList"        : DependentFunctionsList,
            "SupplierList"                  : SuppliersList,
            "BusinessProcesslist"           : BusinessProcesslist,
            "BusinessSubActivityLists"      : BusinessSubActivityLists
        }
        
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatDependenciesData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function getFormatImpactAssessmentDetails (userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        let impactMasterList        = []
        let businessProcessList     = []
        let impactAssementList      = []
        let subProcessList          = []
        let publishedImpact         = []
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatImpactAssessmentDetails : Execution Started.');

        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {            
            for (const obj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {                
                impactMasterList.push({
                    ImpactMasterDataID  : obj.ImpactId,
                    ImpactMasterData    : obj.ImpactName
                })
            }
        }

        if(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            businessProcessList     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        }
        if(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            subProcessList          = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        }

        if(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) { 
                impactAssementList.push({
                    BusinessContinuityPlanID    : Number(obj.BusinessContinuityPlanID),
                    ImpactMasterData            : obj.ImpactAssessment != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(obj.ImpactAssessment) : []
                })
            }   
        }

        if(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            publishedImpact = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR]  
        }

        return {
            "impactMasterList"      : impactMasterList,
            "businessProcessList"   : businessProcessList,
            "impactAssementList"    : impactAssementList,
            "impactDropDownList"    : ENUMS_OBJ.IMPACT_LIST_DROPDOWN,
            "subProcessList"        : subProcessList,
            "publishedImpact"       : publishedImpact
        }

    } catch (error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatImpactAssessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function formatAddDependenciesData(userIdFromToken, getDetailsDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatAddDependenciesData : Execution Started.');

        let DependenciesList            = [];
        let DependenciesInfoList        = [];
        let BusinessApplicationsList    = [];
        let DependentFunctionsList      = [];
        let DependencyTypesList         = [];
        let SuppliersList               = [];
        let transformedDependenciesData = [];

        DependenciesList            = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        DependenciesInfoList        = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (const obj in Object.values(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                BusinessApplicationsList.push({
                    "BusinessApplicaionID": Number(obj.BusinessServiceAppsID),
                    "BusinessApplication": obj.BusinessServicesAppsName
                })
            }
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (const obj in Object.values(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
                DependentFunctionsList.push({
                    "BusinessFunctionID": Number(obj.BusinessFunctionsID),
                    "BusinessFunction": obj.Name
                })
            }
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (const obj in Object.values(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                DependencyTypesList.push({
                    "DependencyID": Number(obj.DependencyTypeId),
                    "DependencyType": obj.DependencyType
                })
            }
        }

        if (DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (const obj in Object.values(DependenciesInfoList[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
                SuppliersList.push({
                    "SupplierID": Number(obj.VendorID),
                    "SupplierName": obj.Name
                })
            }
        }

        if (DependenciesList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && DependenciesList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            let oldDependenciesData = DependenciesList;
            transformedDependenciesData = oldDependenciesData.map((item) => {
                let TechnologyDependencies  = (JSON.parse(item.TechnologyDependencies) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.TechnologyDependencies) : [];
                let InterDependentProcess   = (JSON.parse(item.InterDependentProcess) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.InterDependentProcess) : [];
                let SupplierDependencies    = (JSON.parse(item.SupplierDependencies) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.SupplierDependencies) : [];

                let groupedData = {};

                // grouping Technologies Dependencies by BusinessProcessID
                TechnologyDependencies.forEach((obj) => {
                    if(!groupedData[obj.BusinessProcessId]) {
                        groupedData[obj.BusinessProcessId] = {
                            BusinessProcessID       : obj.BusinessProcessId,
                            BusinessProcessName     : obj.BusinessProcessName,
                            TechnologyDependency    : [],
                            InterdependentProcesses : [],
                            SupplierDependency      : []
                        };
                    }
                    groupedData[obj.BusinessProcessId].TechnologyDependency.push({
                        BusinessProcessID           : obj.BusinessProcessId,
                        BusinessApplicationName     : obj.BusinessServicesAppsName,
                        Description                 : obj.BusinessServiceAppsDescription
                    });
                });

                // grouping Interdependent Processes by BusinessProcessID
                InterDependentProcess.forEach((obj) => {
                    if(!groupedData[obj.BusinessProcessId]) {
                        groupedData[obj.BusinessProcessId] = {
                            BusinessProcessID       : obj.BusinessProcessId,
                            BusinessProcessName     : obj.BusinessProcessName,
                            TechnologyDependency    : [],
                            InterdependentProcesses : [],
                            SupplierDependency      : []
                        };
                    }
                    groupedData[obj.BusinessProcessId].InterdependentProcesses.push({
                        ProcessActivityID       : obj.SubBusinessProcessId,
                        ProcessActivityName     : obj.SubBusinessProcessName,
                        Description             : obj.DependencyDescription,
                        DependentFunction       : obj.BusinessFunctionName,
                        DependencyType          : obj.DependencyType
                    });
                });

                // grouping Supplier Dependencies by BusinessProcessID
                SupplierDependencies.forEach((obj) => {
                    if(!groupedData[obj.BusinessProcessId]) {
                        groupedData[obj.BusinessProcessId] = {
                            BusinessProcessID       : obj.BusinessProcessId,
                            BusinessProcessName     : obj.BusinessProcessName,
                            TechnologyDependency    : [],
                            InterdependentProcesses : [],
                            SupplierDependencies    : []
                        };    
                    }
                    groupedData[obj.BusinessProcessId].SupplierDependency.push({
                        SubActivityID       : obj.SubBusinessProcessId,
                        SubActivityName     : obj.SubBusinessProcessName,
                        Description         : obj.DependencyDescription,
                        SupplierID          : obj.VendorID,
                        SupplierName        : obj.SupplierName,
                        DependentTypeID     : obj.ID,
                        DependentTypeName   : obj.DependencyType
                    });
                });

                return Object.values(groupedData);
                
            })
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatAddDependenciesData : Execution End.');

        return {
            // "TotalDependenciesList": DependenciesList,
            "DependenciesDetails": transformedDependenciesData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],
            // "DependenciesInfoList": DependenciesInfoList,
            // "BusinessApplicationsList": BusinessApplicationsList,
            // "DependencyTypeList": DependencyTypesList,
            // "DependentFunctionsList": DependentFunctionsList,
            // "SupplierList": SuppliersList,
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatAddDependenciesData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}
async function getFormatRiskMitigationData(userIdFromToken, getDetailsDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatRiskMitigationData : Execution Started.');

        let RiskMitigationList          = [];
        let RiskMitigationInfoList      = [];
        let BusinessProcessList         = [];
        let ImpactList                  = [];
        let LikelihoodList              = [];
        let finalImpactList             = [];
        let finalLikelihoodList         = [];
        let finalBusinessProcessList    = [];
        let finalRiskMitigationList     = [];
        let IsSavedArray                = [];

        ImpactList          = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        LikelihoodList      = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        BusinessProcessList = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        RiskMitigationList  = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        if (ImpactList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && ImpactList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalImpactList = ImpactList.map((item) => {
                let { ImpactId, ImpactName , ImpactValue } = item;
                let ImpactID    = Number(ImpactId);
                let Impact      = ImpactName;
                ImpactValue     = Number(ImpactValue)

                return { ImpactID, Impact ,ImpactValue }
            })
        } else {
            finalImpactList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        if (LikelihoodList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && LikelihoodList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalLikelihoodList = LikelihoodList.map((item) => {
                let { LikelihoodID, LikelihoodName,LikelihoodValue } = item
                LikelihoodID    = Number(LikelihoodID);
                let Likelihood  = LikelihoodName;
                LikelihoodValue = Number(LikelihoodValue)

                return {LikelihoodID, Likelihood,LikelihoodValue}
            })
        } else {
            finalLikelihoodList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        if (BusinessProcessList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BusinessProcessList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalBusinessProcessList = BusinessProcessList.map((item) => {
                let { BusinessProcessId, BusinessProcessName} = item;
                let BusinessActivityID  = Number(BusinessProcessId);
                let BusinessActivity    = BusinessProcessName;

                return { BusinessActivityID, BusinessActivity}
            })
        } else {
            finalBusinessProcessList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        if (RiskMitigationList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && RiskMitigationList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalRiskMitigationList = RiskMitigationList.map((item) => {
                let { BusinessContinuityPlanID, RiskMitigartionId, PotentialFailure, BusinessProcessName, BusinessProcessId, ImpactRatingId, ImpactRatingName, LikelihoodRatingId, LikelihoodRatingName, Risk, ContingencyMeasures, TreatmentPlan, IsSaved, RiskRatingID} = item;
                BusinessContinuityPlanID    = Number(BusinessContinuityPlanID);
                let RiskMitigatonID         = Number(RiskMitigartionId);
                let PotentialData           = PotentialFailure;
                let AffectedProcess         = BusinessProcessName;
                let AffectedProcessID       = Number(BusinessProcessId);
                let ImpactID                = Number(ImpactRatingId);
                let Impact                  = ImpactRatingName;
                let LikelihoodID            = Number(LikelihoodRatingId);
                let Likelihood              = LikelihoodRatingName;
                Risk                        = Risk;
                let Contingency             = ContingencyMeasures;
                let Treatment               = TreatmentPlan;
                RiskRatingID                = RiskRatingID
                IsSaved                     = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { BusinessContinuityPlanID, RiskMitigatonID, PotentialData, AffectedProcess, AffectedProcessID, ImpactID, Impact, LikelihoodID, Likelihood, Risk, Contingency, Treatment, IsSaved,RiskID : RiskRatingID }
            })

        } else {
            finalRiskMitigationList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        IsSavedArray = finalRiskMitigationList.map((item) => item.IsSaved);
        // console.log("Risk Mitigation IsSaved Array : ", IsSavedArray);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatRiskMitigationData : Execution End.');

        return {
            "RiskMitigationLists"   : finalRiskMitigationList,
            // "IsSaved"               : (IsSavedArray.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            "ImpactList"            : finalImpactList,
            "LikelihoodList"        : finalLikelihoodList,
            "AffectedProcesslist"   : finalBusinessProcessList
            // "DependenciesInfoList"  : DependenciesInfoList
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatRiskMitigationData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatRiskRating(userIdFromToken, getRiskRating, type) {
    let riskRating = [];
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskRating : Execution Started.');

        if (getRiskRating.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {

            if (type == ENUMS_OBJ.RISK_RATING_TYPES.INHERENT_RISK_RATING) {
                riskRating = [];
                riskRating.push({
                    "OverallInherentRiskRatingID"   : getRiskRating[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OverallInherentRiskRatingID,
                    "OverallInherentRiskRating"     : getRiskRating[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OverallInherentRiskRating
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskRating : Execution End.');

        return {
            "OverAllRiskRating": riskRating
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SiteRiskAssessmentsBl : getFormatRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function getFormatStaffContactData(userIdFromToken, getDetailsDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatStaffContactData : Execution Started.');

        let StaffContactList            = [];
        let StaffContactInfoList        = [];
        let finalStaffContactInfoList   = [];
        let finalStaffContactList       = [];
        let IsSavedArray                = [];

        StaffContactInfoList    = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        StaffContactList        = getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDetailsDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        if (StaffContactInfoList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && StaffContactInfoList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalStaffContactInfoList = StaffContactInfoList.map((item) => {
                let { UserGUID, UserName, FullName, MobileNumber} = item;
                UserGUID        = UserGUID;
                UserEmailID     = UserName;
                UserName        = FullName;
                MobileNumber    = MobileNumber

                return { UserGUID, UserEmailID, UserName, MobileNumber }
            })
        } else {
            finalStaffContactInfoList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        if (StaffContactList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CallTreeDetails !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && StaffContactList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CallTreeDetails.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalStaffContactList = JSON.parse(StaffContactList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CallTreeDetails).map((item) => {
                let { CallTreeId, CallID, Role, CallInitiatorGUID, CallInitiatorName, CallOrderInitiator, CallInitiatorDesignation, CallInitiatorMobile, CallInitiatorResidence, CallReceiverGUID, CallOrderReceiver, CallReceiverDesignation, CallReceiverMobile, CallReceiverResidence, CallReceiverName, IsSaved } = item;
                let StaffContactID          = Number(CallTreeId);
                CallID                      = CallID;
                let CallOrder1              = CallOrderReceiver;
                Role                        = Role;
                CallInitiatorGUID           = CallInitiatorGUID;
                let CallInitiator           = CallInitiatorName;
                let CallOrder               = CallOrderInitiator;
                let DesignationC            = CallInitiatorDesignation;
                let Mobile                  = CallInitiatorMobile;
                let Residence               = CallInitiatorResidence;
                CallReceiverGUID            = CallReceiverGUID;
                CallReceiver                = CallReceiverName;
                // let CallReceiver            = CallOrderReceiver;
                let DesignationR            = CallReceiverDesignation;
                let MobileR                 = CallReceiverMobile;
                let ResidenceR              = CallReceiverResidence;
                IsSaved                     = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { StaffContactID, CallID, CallOrder1, Role, CallInitiatorGUID, CallInitiator, CallOrder, DesignationC, Mobile, Residence, CallReceiverGUID, CallReceiver, DesignationR, MobileR, ResidenceR, CallReceiverName, IsSaved }
            })
                
        } else {
            finalStaffContactList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        IsSavedArray = finalStaffContactList.map((item) => item.IsSaved);
        // console.log("Staff Contact Details IsSaved Array : ", IsSavedArray);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatStaffContactData : Execution End.');

        return {
            "StaffContactLists" : finalStaffContactList,
            // "IsSaved"           : (IsSavedArray.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE)) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            "StaffUserDetails"  : finalStaffContactInfoList,
            "RoleList"          : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY,
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatStaffContactData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function getFormatResourceRequirementDetails(userIdFromToken, getDataDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatResourceRequirementDetails : Execution started.');
        let equipmentList           = [];
        let subProcessList          = [];
        let criticalEquipmentList   = [];
        let businessProcessList     = [];
        let mediaTypeList           = [];
        let alternateSourceList     = [];

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            equipmentList = getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
                businessProcessList.push({
                    BusinessProcessID    : Number(obj.BusinessProcessId), 
                    BusinessProcessName  : obj.BusinessProcessName,
                })
            }
        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                subProcessList.push({
                    SubBusinessProcessID    : Number(obj.SubBusinessProcessId), 
                    SubBusinessProcessName  : obj.SubBusinessProcessName,
                    BusinessProcessID       : Number(obj.BusinessProcessId),
                    BusinessProcessName     : obj.BusinessProcessName
                })
            }
        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            let VitalRecords                = [];
            let CriticalEquipmentSupplies   = [];
            let BusinessContinuityPlanID;
            for (const obj of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {               
                BusinessContinuityPlanID = obj.BusinessContinuityPlanID               
                if (obj.VitalRecords != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    for (const ob of JSON.parse(obj.VitalRecords)) {
                        if (Array.isArray(ob.SubBusinessProcess)) {
                            for (const n of ob.SubBusinessProcess) {
                                VitalRecords.push({
                                    VitalRecordsId          : Number(n.VitalRecordsId),
                                    BusinessProcessId       : Number(ob.BusinessProcessId),
                                    BusinessProcessName     : ob.BusinessProcessName,
                                    SubBusinessProcessId    : Number(n.SubBusinessProcessId),
                                    SubBusinessProcessName  : n.SubBusinessProcessName,
                                    RecordType              : n.RecordType,
                                    MediaTypeID             : Number(n.MediaTypeID),
                                    MediaType               : n.MediaTypeName,
                                    AlternateSourceID       : Number(n.AlternateSourceID),
                                    AlternateSource         : n.AlternateSourceName,
                                    IsSaved                 : n.IsSaved
                                }); 
                            }
                        }
                    }
                }
            
                if (obj.CriticalEquipmentSupplies != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    for (const n of Object.values(JSON.parse(obj.CriticalEquipmentSupplies))) {
                        CriticalEquipmentSupplies.push({
                            "CriticalEquipmentSuppliesID"   : Number(n.CriticalEquipmentSuppliesID),
                            "BusinessProcessId"             : Number(n.BusinessProcessId),
                            "BusinessProcessName"           : n.BusinessProcessName,
                            "EquipmentID"                   : Number(n.EquipmentID),
                            "Equipment"                     : n.EquipmentName,
                            "Description"                   : n.EquipmentDescription,
                            "TotalCount"                    : n.TotalCount,
                            "MinimumCount"                  : n.MinCount,
                            "IsSaved"                       : n.IsSaved 
                        })  
                    }
                }
            }
            criticalEquipmentList.push({
                BusinessContinuityPlanID    : Number(BusinessContinuityPlanID),
                VitalRecords                : VitalRecords,
                CriticalEquipmentSupplies   : CriticalEquipmentSupplies
            })
        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            mediaTypeList = getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            alternateSourceList = getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatResourceRequirementDetails : Execution End.');
        return {
            equipmentList, 
            subProcessList,
            criticalEquipmentList,
            businessProcessList,
            mediaTypeList,
            alternateSourceList
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatResourceRequirementDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatRecoveryProcessDetails(userIdFromToken, getDataDBResponse, getListDBResponse, payloadData, accountGUIDFromToken) {
    
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatRecoveryProcessDetails : Execution started.');
        let staffRequirementDetails     = [];
        let recoveryProcessList         = [];
        let userList                    = [];
        let siteList                    = [];
        let processList                 = [];
        let mergedList                  = [];
        let BCManagersList              = [];
        let BusinessOwnersList          = [];
        let BCCUsersList                = [];
        let BCPLists                    = [];
        let currentWorkflowStatusID     = [];
        let currentWorkflowStatus       = [];
        let recoveryStrategies          = [];  
        let BIARating                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let BIARatingDescription        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        BCPLists                = getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        BCManagersList          = getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        BusinessOwnersList      = getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        BCCUsersList            = getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];

        // for identifying the type of user logged in
        let IsBCManager         = (BCManagersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCManagersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCManagersList.some((admin) => userIdFromToken === admin.AdminGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsBusinessOwner     = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BusinessOwnersList.filter(n => Number(n.BusinessFunctionsID) === Number(payloadData.BusinessFunctionID)).some((owner) => userIdFromToken === owner.BusinessOwner) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsBCCUser           = (BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BCCUsersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ? (BCCUsersList.filter(ele => Number(ele.BusinessFunctionsID) === Number(payloadData.BusinessFunctionID)).some((bcc) => userIdFromToken === bcc.BCCGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // for getting the currentWorkflowStatusID and Status of the ongoing BCP - Start
        BCPLists = BCPLists.filter((item) => Number(item.BusinessContinuityPlanId) === payloadData.BusinessContinuityPlanId && Number(item.BusinessFunctionID) === payloadData.BusinessFunctionID);
        let BusinessOwnerName   = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ?
                                   BusinessOwnersList.filter(n => Number(n.BusinessFunctionsID) === Number(payloadData.BusinessFunctionID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // console.log("BCPLists", BCPLists);
        // console.log("Payload Data", payloadData);

        if (BCPLists !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BCPLists.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            currentWorkflowStatusID = Number(BCPLists[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkFlowStatusID);
            currentWorkflowStatus   = BCPLists[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkFlowStatus;
            BIARating               = BCPLists[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BIA;
            BIARatingDescription    = BCPLists[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BIARatingDescription;
        } else {
            currentWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            currentWorkflowStatus   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            BIARating               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            BIARatingDescription    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
        // for getting the currentWorkflowStatusID and Staus of the ongoing BCP - End

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            staffRequirementDetails = getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        }

        if (getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) { 
            for (const ob of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {
              let SubProcess      = ob.SubBusinessProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(ob.SubBusinessProcess) : []
              let SubBusinessProcesses  = [];
                if (SubProcess && SubProcess.length) {
                    for (const n of Object.values(SubProcess)) {
                        SubBusinessProcesses.push({
                            SubBusinessProcessId    : Number(n.SubBusinessProcessId),
                            SubBusinessProcessName  : n.SubBusinessProcessName,
                            BusinessProcessId       : Number(ob.BusinessProcessId),
                        })
                    }
                }
                processList.push({
                    BusinessProcessID   : ob.BusinessProcessId,
                    BusinessProcessName : ob.BusinessProcessName,
                    When                : ob.RTO.includes('_') ? (ob.RTO.split('_')[0] + " " + ob.RTO.split('_')[1]) : ob.RTO,
                    RTO                 : ob.RTO,
                    SubBusinessProcesses: SubBusinessProcesses,
                    Who                 : BusinessOwnerName != null ? BusinessOwnerName[0].BusinessOwnerUSER : ''
                });
            }
        }
        
        if (getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            let RecoveryStrategies = getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RecoveryStrategies
            if (RecoveryStrategies != null) {
                for (const ob of Object.values(JSON.parse(RecoveryStrategies))) {
                    recoveryStrategies.push({
                        BusinessProcessId       : Number(ob.BusinessProcessId),
                        BusinessProcessName     : ob.BusinessProcessName,
                        IsSaved                 : ob.IsSaved,
                        SubBusinessProcesses    : [],
                        When                    : "",
                        Who                     : BusinessOwnerName != null ? BusinessOwnerName[0].BusinessOwnerUSER : '',//ob.UserName
                        Where                   : ob.Where.includes('_') ? (ob.Where.split('_')[0]) : ob.Where,
                        Site                    : ob.Where.includes('_') ? (ob.Where.split('_')[1]) : "", 
                        WhenToTrigger           : ob.WhenToTrigger,
                        WhereSite               : ob.Where, 
                        WhoGUID                 : BusinessOwnerName != null ? BusinessOwnerName[0].BusinessOwner : '', //ob.WhoGUID,
                        RecoveryStrategiesId    : Number(ob.RecoveryStrategiesId),
                        // subProcessList          : subProcessList
                    });
                }
            }
            
            recoveryProcessList.push({
                BusinessContinuityPlanID    : Number(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessContinuityPlanID),
                RecoveryStrategies          : recoveryStrategies,
                // (Array.from(new Set (recoveryStrategies.map(ob => Number(ob.BusinessProcessId))))).map(BusinessProcessId => {
                //     return recoveryStrategies.find(m => Number(m.BusinessProcessId) == BusinessProcessId)
                // })                
            });


        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                userList.push({
                    UserName  : obj['BCC Name'],
                    UserGUID  : obj['BCC GUID']
                })
            }
        }

        if(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
                siteList.push({
                    SiteID    : Number(obj.SiteId),
                    SiteName  : obj.Name
                })
            }
        }          

        if (processList.length && recoveryProcessList[0].RecoveryStrategies.length) {            
            recoveryProcessList[0].RecoveryStrategies.forEach(strategy => {
                let process = processList.find(p => p.BusinessProcessID == strategy.BusinessProcessId);
                if (process) {
                    strategy.When = process.When;
                    if (strategy.SubBusinessProcesses) {
                        strategy.SubBusinessProcesses = process.SubBusinessProcesses;
        
                    }
                } 
            });        
        } 
        if (processList.length && recoveryProcessList[0].RecoveryStrategies.length) {  
            const detailsViewIds = new Set(recoveryProcessList[0].RecoveryStrategies.map(item => Number(item.BusinessProcessId)));
            const unmatchedData = processList.filter(x => !detailsViewIds.has(Number(x.BusinessProcessID)));
            if (unmatchedData.length) {
                unmatchedData.forEach(item => {
                    recoveryProcessList[0].RecoveryStrategies.push({
                        BusinessProcessId: Number(item.BusinessProcessID),
                        BusinessProcessName: item.BusinessProcessName,
                        SubBusinessProcesses: item.SubBusinessProcesses || [],
                        When: item.When || "",
                       
                    });
                });
            }       
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatRecoveryProcessDetails : Execution End.');
        return {
            staffRequirementDetails, 
            recoveryProcessList,
            userList,
            siteList,
            "processList"               : processList,
            "IsBCCUser"                 : IsBCCUser,
            "IsBusinessOwner"           : IsBusinessOwner,
            "IsBCManager"               : IsBCManager,
            "currentWorkflowStatusID"   : currentWorkflowStatusID,
            "currentWorkflowStatus"     : currentWorkflowStatus,
            "BIARating"                 : BIARating,
            "BIARatingDescription"      : BIARatingDescription,
            "IsFAwithBCM"               : getDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE][0].IsFAwithBCM
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : getFormatResourceRequirementDetails : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function formatGetCompleteBCPDetails(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetCompleteBCPDetails : Execution Started.');
        
        let SectionDetails  = []
        let IsSavedObj      = {}

        if(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            SectionDetails = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]; 
            if (SectionDetails.length) {
                IsSavedObj = {
                    "Section1IsSaved": SectionDetails[0].Section1IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section1IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section2IsSaved": SectionDetails[0].Section2IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section2IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section3IsSaved": SectionDetails[0].Section3IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section3IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section4IsSaved": SectionDetails[0].Section4IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section4IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section5IsSaved": SectionDetails[0].Section5IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section5IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section6IsSaved": SectionDetails[0].Section6IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section6IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section7IsSaved": SectionDetails[0].Section7IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section7IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                    "Section8IsSaved": SectionDetails[0].Section8IsSaved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (SectionDetails[0].Section8IsSaved == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE : CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                }            
            }
        }        

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetCompleteBCPDetails : Execution End.');
        return IsSavedObj;
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetCompleteBCPDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatGetReviewComments(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetReviewComments : Execution Started.');

        let comments = [];
        let finalComments = [];

        comments = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];

        if (comments !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && comments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (const item of Object.values(comments)){
                finalComments.push({
                    "BusinessContinuityPlanID"  : Number(item.BusinessContinuityPlanID),
                    "BusinessFunctionID"        : Number(item.BusinessFunctionId),
                    "CommentID"                 : Number(item.CommentID),
                    "CommentBody"               : item.Comment,
                    "UserGUID"                  : item.UserGUID,
                    "UserName"                  : item.UserName,
                    "CommentUserName"           : item.FullName,
                    "CreatedDate"               : item.CreatedDate
                })
            }
        } else {
            finalComments = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetReviewComments : Execution End.');

        return {
            "ReviewComments": finalComments
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetReviewComments : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

// for filtering profile questions based on 3rd recordset
async function mapQuestionsAndResponses(firstProfilingQuestions, secondProfilingQuestions){
    if (firstProfilingQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){

        return secondProfilingQuestions.map((item) => {
            const matchedItem = firstProfilingQuestions.find((firstItem) => firstItem.ID === item.ID);
            return {
                ProfilingQuestionID: item.ID,
                ProfilingQuestion: item.ProfillingQuestions,
                ProfilingAnswer: matchedItem ? matchedItem.ProfilingResponse : ''
            };
        });
    } else {
        return secondProfilingQuestions.map((item) => {
            return {
                ProfilingQuestionID: item.ID,
                ProfilingQuestion: item.ProfillingQuestions,
                ProfilingAnswer: ''
            }
        })
    }
}

// for formatting resultset for consolidated reports
async function formatGetConsolidatedReport(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetConsolidatedReport : Execution Started.');

        let businessContinuityPlansList = [];
        let finalBusinessContinuityPlansList = [];

        businessContinuityPlansList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

        if (businessContinuityPlansList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && businessContinuityPlansList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            businessContinuityPlansList.forEach((obj) => {
               const newProcessArray = JSON.parse(obj.ProcessList);

               newProcessArray.forEach((process) => {

                let finalSubProcessList = (process.SubProcessList != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || process.SubProcessList != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ?
                 process.SubProcessList.map(subProcess => {
                    return {
                        SubProcessID: Number(subProcess.SubBusinessProcessId),
                        SubProcessName: subProcess.SubBusinessProcessName,
                        BusinessProcessID: subProcess.BusinessProcessId
                    }
                }) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;

                let finalTechnologyDependecies = (process.TechnologyDependencies != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || process.TechnologyDependencies != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ?
                 process.TechnologyDependencies.map(tech => {
                    return {
                        ApplicationID: Number(tech.ApplicationID),
                        ApplicationName: tech.ApplicationName
                    }
                }) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;

                let finalInterdependentProcess = (process.InterdependentProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || process.InterdependentProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ?
                 process.InterdependentProcess.map((inter) => {
                    return {
                        SubProcessID: Number(inter.SubBusinessProcessID),
                        SubProcessName: inter.SubBusinessProcessName,
                        DependentFunction: inter.DependentFunction,
                        DependencyTypeID: Number(inter.DependencyTypeID),
                        DependencyType: inter.DependencyType
                    }
                }) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;

                let finalSupplierList = (process.SupplierDependencies != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || process.SupplierDependencies != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ?
                 process.SupplierDependencies.map(sup => {
                    return {
                        SupplierID: Number(sup.SupplierID),
                        SupplierName: sup.SupplierName,
                        SubProcessID: sup.SubProcessID
                    }
                }) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;

                let finalVitalRecords = (process.VitalRecords != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || process.VitalRecords != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ?
                 process.VitalRecords.map(rec => {
                    return {
                        SubProcessID: Number(rec.SubProcessID),
                        MediaType: rec.MediaType,
                        AlternateSource: rec.AlternateSource
                    }
                }) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;

                let finalCriticalEquipments = (process.CriticalEquipmentSupplies != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || process.CriticalEquipmentSupplies != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ?
                 process.CriticalEquipmentSupplies.map(equip => {
                    return {
                        CriticalEquipementName: equip.CriticalEquipementName,
                        TotalCount: Number(equip.TotalCount),
                        MinCount: Number(equip.MinCount)
                    }
                }) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;

                let MTPD            = (process.MTPD != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? process.MTPD.split("_") : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let RTO             = (process.RTO != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? process.RTO.split("_") : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let RPO             = (process.RPO != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? process.RPO.split("_") : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let MAC             = (process.MACValue != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(process.MACValue) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let remoteCount     = (process.MNPRRemotely != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(process.MNPRRemotely) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let onPremiseCount  = (process.MNPROnPremise != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(process.MNPROnPremise) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let SiteID          = (process.SiteId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(process.SiteId) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let SiteName        = (process.SiteName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? process.SiteName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                let formattedLastReviewDate
                // format Last Review Date and Time
                if(obj.LastReviewDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    let strippedDate = (obj.LastReviewDate).toISOString().split("T")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                    let inputDate = new Date(strippedDate);
                    formattedDate = inputDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })
                    
                    let strippedTime = utilityAppObject.convertTime((obj.LastReviewDate).toISOString().split("T")[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]);
                    formattedLastReviewDate = `${formattedDate}`;
                } else {
                    formattedLastReviewDate = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_STRING;
                }

                finalBusinessContinuityPlansList.push({
                    BusinessContinuityPlanID    : Number(obj.BusinessContinuityPlanId),
                    BusinessFunctionID          : Number(obj.BusinessFunctionID),
                    BusinessFunctionName        : obj.BusinessFunctionName,
                    BusinessGroupID             : Number(obj.BusinessGroupID),
                    BusinessGroup               : obj.BusinessGroup,
                    DocStatusID                 : Number(obj.DocStatusID),
                    DocStatus                   : obj.DocStatus,
                    BIARating                   : obj.BIA,
                    BIARatingDescription        : obj.BIARatingDescription ? obj.BIARatingDescription : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    SubProcessList              : finalSubProcessList,
                    TechnologyDependencies      : finalTechnologyDependecies,
                    InterdependentProcess       : finalInterdependentProcess,
                    SupplierDependencies        : finalSupplierList,
                    VitalRecords                : finalVitalRecords,
                    CriticalEquipmentSupplies   : finalCriticalEquipments,
                    MTPD                        : `${MTPD[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${MTPD[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split("_")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}`,
                    RTO                         : `${RTO[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${RTO[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split("_")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}`,
                    RPO                         : `${RPO[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]} ${RPO[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].split("_")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}`,
                    MACValue                    : (MAC != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? `${MAC}%` : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    MNPRRemotely                : (remoteCount != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? remoteCount : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    MNPROnPremise               : (onPremiseCount != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? onPremiseCount : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    SiteID                      : SiteID,
                    SiteName                    : SiteName,
                    BusinessProcessID           : (process.BusinessProcessId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(process.BusinessProcessId) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    BusinessProcessName         : (process.BusinessProcessName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? process.BusinessProcessName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    PeakHoursStartTime          : (process.PeakHoursStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? utilityAppObject.convertTime(process.PeakHoursStartTime) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    PeakHoursEndTime            : (process.PeakHoursEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? utilityAppObject.convertTime(process.PeakHoursEndTime) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    NormalHoursStartTime        : (process.NormalHoursStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? utilityAppObject.convertTime(process.NormalHoursStartTime) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    NormalHoursEndTime          : (process.NormalHoursEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? utilityAppObject.convertTime(process.NormalHoursEndTime) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    LastReviewedDate            : (obj.LastReviewDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? formattedLastReviewDate : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
               })
            
                });
            })
        } else {
            finalBusinessContinuityPlansList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetConsolidatedReport : Execution End.');

        return {
            "FinalBusinessContinuityPlansList": finalBusinessContinuityPlansList
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetConsolidatedReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

// for formatting result for BCP Draft document
async function formatGetCompleteBCPDraft(userIdFromToken, getDBResponse, getListDBResponse, payloadData, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetCompleteBCPDraft : Execution Started.');

        let Section1Response                = [];
        let Section2Response                = [];
        let Section3Response                = [];
        let Section4Response                = [];
        let Section5Response                = [];
        let Section6Response                = [];
        let Section7Response                = [];
        let Section8ResponseStaff           = [];
        let Section8ResponseStrategy        = [];
        let detailsBusinessFunctionProfile  = [];
        let businessProcessDetails          = [];
        let formatTechDependency            = [];
        let formatInterProcess              = [];
        let formatSupplierProcess           = [];
        let originalDependenciesList        = [];
        let transformedDependenciesData     = [];
        let impactAssementList              = [];
        let finalRiskMitigationList         = [];
        let criticalEquipmentList           = [];
        let finalStaffContactList           = [];
        let staffRequirementDetails         = [];
        let recoveryProcessList             = [];
        let recoveryStrategies              = [];
        let BusinessOwnersList              = [];
        let BCPProfileQuestions             = [];
        let Section8ResponseProcess         = [];
        let processList                     = [];
        let Section3InfoResponse            = [];
        let BusinessProcesslist             = [];
        let Customers                       = [];
        let ProfilingQuestions              = [];
        let CriticalBusinessActivities      = [];
        let newCustomersArray               = [];
        let newProfilingQuestions           = [];
        let modifiedProfiligQuestions       = [];
        let newBusinessProcesses            = [];
        let impactMasterList                = [];
        let Section4ImpactMaster            = [];
        let subProcessList                  = [];
        let businessProcessList             = [];
        let Section4SubProcess              = [];
        let Section4BusinessProcess         = [];


        Section1Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        BCPProfileQuestions         = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        Section2Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        Section3Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        Section3InfoResponse        = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        Section4Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        Section5Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        Section6Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        Section7Response            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        Section8ResponseStaff       = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
        Section8ResponseStrategy    = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] : [];
        BusinessOwnersList          = getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        Section8ResponseProcess     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN] : [];
        Section4ImpactMaster        = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE] : [];
        Section4SubProcess          = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN] : [];
        Section4BusinessProcess     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN] : [];

        let BusinessOwnerName = (BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || BusinessOwnersList !== CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY) ?
            BusinessOwnersList.filter(n => Number(n.BusinessFunctionsID) === Number(payloadData.BusinessFunctionID)) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        // Section 1 response formatting
        if(Section1Response != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section1Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for (const obj of Object.values(Section1Response)) {

                Customers = (obj.CustomerData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.CustomerData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.CustomerData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                ProfilingQuestions = (obj.ProfilingResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.ProfilingResponse != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.ProfilingResponse) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                CriticalBusinessActivities = (obj.BusinessProcessData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.BusinessProcessData != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) ? JSON.parse(obj.BusinessProcessData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                newCustomersArray = (Customers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Customers.map(ele => ({
                    CustomerID: Number(ele.CustomerID),
                    Description: ele.CustomerName,
                    Affiliate: (ele.IsInternal == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) ? CONSTANT_FILE_OBJ.APP_CONSTANT.INTERNAL : CONSTANT_FILE_OBJ.APP_CONSTANT.EXTERNAL
                })) : []

                newProfilingQuestions = (ProfilingQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? ProfilingQuestions.map(ele => ({
                    ProfilingQuestionID: ele.ID,
                    ProfilingQuestion: ele.ProfillingQuestions,
                    ProfilingAnswer: ele.ProfilingResponse
                })) : BCPProfileQuestions.map(obj => ({
                    ProfilingQuestionID: Number(obj.ID),
                    ProfilingQuestion: obj.ProfillingQuestions
                }))

                modifiedProfiligQuestions = (BCPProfileQuestions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ?
                    await mapQuestionsAndResponses(ProfilingQuestions, BCPProfileQuestions) :
                    [];

                newBusinessProcesses = (CriticalBusinessActivities != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CriticalBusinessActivities.map(ele => ({
                    ActivityID: ele.BusinessProcessID,
                    Description: ele.BusinessProcessName
                })) : []

                detailsBusinessFunctionProfile.push({
                    "BusinessContinuityPlanID"  : Number(obj.BusinessContinuityPlanId),
                    "BusinessFunctionProfileID" : Number(obj.BusinessFunctionProfileID),
                    "BusinessFunctionID"        : Number(obj.BusinessFunctionID),
                    "BusinessFunctionName"      : obj.BusinessFunctionName,
                    "BusinessDescription"       : obj.BusinessDescription,
                    "BusinessServices"          : obj.BusinessProductsServices,
                    "CriticalBusinessActivities": newBusinessProcesses,
                    "Customers"                 : newCustomersArray,
                    // "ProfilingQuestions"        : newProfilingQuestions,
                    "ProfilingQuestions"        : modifiedProfiligQuestions,
                    "BusinessOwnerGUID"         : obj.FBCCID,
                    "BusinessOwnerName"         : obj.UserName ? obj.UserName.split(CONSTANT_FILE_OBJ.APP_CONSTANT.AT_SYMBOL)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_STRING,
                    "IsReviewed"                : obj.IsReviewed,
                    "ReviewedDate"              : obj.ReviewedDate,
                    "ReviewedBy"                : obj.ReviewedBy,
                    "ShortCode"                 : obj.ShortCode,
                    "BCCNames"                  : (obj.BCC && obj.BCC.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((JSON.parse(obj.BCC).filter(n => n.BusinessFunctionsID == obj.BusinessFunctionID && n.IsFunctionalAdmin == false)).map(item => item["BCCName"]).join(',')) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "IsSaved"                   : (obj.IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (obj.IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                })
            }
        } else {
            detailsBusinessFunctionProfile = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        }

        // Section 2 response formatting
        if(Section2Response != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section2Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for (const obj of Object.values(Section2Response)) {
                if (obj.BusinessProcessDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    for (const pro of Object.values(JSON.parse(obj.BusinessProcessDetails))) {
                        let SubBusinessProcess = obj.SubBusinessProcess != null ? (JSON.parse(obj.SubBusinessProcess)).filter(it => Number(it.BusinessProcessId) == Number(pro.BusinessProcessId)) : []
                        let SubProcessActivities = [];
                        if (SubBusinessProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                            for (const sub of Object.values(SubBusinessProcess)) {
                                SubProcessActivities.push({
                                    BusinessProcessID   : Number(sub.BusinessProcessId),
                                    Description         : sub.SubBusinessProcessDescription,
                                    Name                : sub.SubBusinessProcessName,
                                    SubBusinessProcessId: Number(sub.SubBusinessProcessId)
                                });
                            }
                        }

                        businessProcessDetails.push({
                            BusinessContinuityPlanID    : Number(obj.BusinessContinuityPlanID),
                            BusinessProcessID           : Number(pro.BusinessProcessId),
                            BusinessProcessDesc         : pro.BusinessProcessDescription,
                            BusinessProcessDetailsID    : Number(pro.BusinessProcessDetailsID),
                            BusinessProcessName         : pro.BusinessProcessName,
                            SiteID                      : Number(pro.SiteID),
                            SiteName                    : pro.SiteName,
                            NormalWorkingHoursStart     : pro.NormalWH_StartTime,
                            NormalWorkingHoursEnd       : pro.NormalWH_EndTime,
                            PeakWorkingHoursStart       : pro.PeakWH_StartTime,
                            PeakWorkingHoursEnd         : pro.PeakWH_EndTime,
                            MTPD                        : Number(pro.MTPD.split('_')[0]),
                            MTPDUnit                    : pro.MTPD.split('_')[1], //== 1 ? "Hours" : "Day(s)",
                            RTO                         : Number(pro.RTO.split('_')[0]),
                            RTOUnit                     : pro.RTO.split('_')[1],  //== 1 ? "Hours" : "Day(s)",
                            RPO                         : Number(pro.RPO.split('_')[0]),
                            RPOUnit                     : pro.RPO.split('_')[1],  //== 1 ? "Hours" : "Day(s)",
                            MAC                         : pro.MAC,
                            MNPRRemoteHeadCount         : pro.RemoteHeadCount,
                            MNPROfficeHeadCount         : pro.OfficeHeadCount,
                            SubProcessActivities        : SubProcessActivities,
                            IsSaved                     : pro.IsSaved

                        });
                    }
                }
            }
        }else {
            businessProcessDetails = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }

        // Section 3 response formatting

        if (Section3InfoResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(Section3InfoResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessProcess).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            BusinessProcesslist = JSON.parse(Section3InfoResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessProcess).map((item) => {
                let { BusinessProcessId, BusinessProcessName } = item;
                let BusinessActivityID = BusinessProcessId;
                let BusinessActivity = BusinessProcessName;

                return { BusinessActivityID, BusinessActivity }
            })
        }

        if(Section3Response != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section3Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            if (Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TechnologyDependencies !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TechnologyDependencies).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                formatTechDependency = JSON.parse(Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TechnologyDependencies).map((item) => {
                    let { TechnologyDependenciesId, BusinessProcessId, BusinessServiceAppsID, BusinessServicesAppsName, BusinessServiceAppsDescription, IsSaved } = item;
                    TechnologyDependenciesId    = TechnologyDependenciesId;
                    let ID                      = BusinessProcessId;
                    let BusinessApplicaionID    = Number(BusinessServiceAppsID);
                    let BusinessApplication     = BusinessServicesAppsName;
                    let Description             = BusinessServiceAppsDescription;
                    let IsEdit                  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    IsSaved                     = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                    return { TechnologyDependenciesId, ID, BusinessApplicaionID, BusinessApplication, Description, IsEdit, IsSaved }
                })
            } else {
                formatTechDependency = [];
            }

            if (Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                formatInterProcess = JSON.parse(Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].InterDependentProcess).map((item) => {
                    let { InterdependentProcessesId, BusinessProcessId, SubBusinessProcessId, SubBusinessProcessName, BusinessFunctionsID, BusinessFunctionName, ID, DependencyType, DependencyDescription, IsSaved } = item;
                    InterdependentProcessesId   = InterdependentProcessesId;
                    let ProcessID               = BusinessProcessId;
                    let SubActivityID           = SubBusinessProcessId;
                    let SubActivity             = SubBusinessProcessName;
                    let Dependency              = DependencyDescription;
                    let Function                = BusinessFunctionName;
                    let DependencyID            = BusinessFunctionsID;
                    let Type                    = DependencyType;
                    let TypeID                  = ID;
                    let IsEdit                  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    IsSaved                     = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                    return { InterdependentProcessesId, ProcessID, SubActivityID, SubActivity, Function, DependencyID, Dependency, Type, TypeID, IsEdit, IsSaved }
                })
            } else {
                formatInterProcess = [];
            }

            if (Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SupplierDependencies !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && JSON.parse(Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SupplierDependencies).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                formatSupplierProcess = JSON.parse(Section3Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SupplierDependencies).map((item) => {
                    let { SupplierDependenciesId, BusinessProcessId, SubBusinessProcessId, SubBusinessProcessName, VendorID, SupplierName, ID, DependencyType, DependencyDescription, IsSaved } = item;
                    SupplierDependenciesId  = SupplierDependenciesId;
                    let ProcessID           = BusinessProcessId;
                    let SubActivityID       = SubBusinessProcessId;
                    let SubActivity         = SubBusinessProcessName;
                    let Dependency          = DependencyDescription;
                    let SupplierID          = VendorID;
                    Supplier                = SupplierName;
                    let DependentTypeID     = ID;
                    let Type                = DependencyType;
                    let IsEdit              = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    IsSaved                 = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                    return { SupplierDependenciesId, ProcessID, SubActivityID, SubActivity, SupplierID, Dependency, Type, Supplier, DependentTypeID, IsEdit, IsSaved }
                })
            } else {
                formatSupplierProcess = [];
            }

            const businessProcessIDsArray = BusinessProcesslist.map((obj) => obj.BusinessActivityID);

            formatTechDependency = formatTechDependency.filter((item) => businessProcessIDsArray.includes(item.ID));

            formatInterProcess = formatInterProcess.filter((item) => businessProcessIDsArray.includes(item.ProcessID));

            formatSupplierProcess = formatSupplierProcess.filter((item) => businessProcessIDsArray.includes(item.ProcessID));

            // console.log("Tech Process : ", formatTechDependency);
            // console.log("Inter Process : ", formatInterProcess);
            // console.log("Supplier Process : ", formatSupplierProcess);

            originalDependenciesList = {
                "TechnologyDependencies": formatTechDependency,
                "InterDependentProcess": formatInterProcess,
                "SupplierDependencies": formatSupplierProcess
            }

            if (Section3Response !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section3Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                let oldDependenciesData = Section3Response;
                transformedDependenciesData = oldDependenciesData.map((item) => {
                    let TechnologyDependencies  = (JSON.parse(item.TechnologyDependencies) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.TechnologyDependencies) : [];
                    let InterDependentProcess   = (JSON.parse(item.InterDependentProcess) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.InterDependentProcess) : [];
                    let SupplierDependencies    = (JSON.parse(item.SupplierDependencies) !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? JSON.parse(item.SupplierDependencies) : [];

                    let groupedData = {};

                    // grouping Technologies Dependencies by BusinessProcessID
                    TechnologyDependencies.forEach((obj) => {
                        if (!groupedData[obj.BusinessProcessId]) {
                            groupedData[obj.BusinessProcessId] = {
                                BusinessProcessID: obj.BusinessProcessId,
                                BusinessProcessName: obj.BusinessProcessName,
                                TechnologyDependency: [],
                                InterdependentProcesses: [],
                                SupplierDependency: []
                            };
                        }
                        groupedData[obj.BusinessProcessId].TechnologyDependency.push({
                            BusinessProcessID: obj.BusinessProcessId,
                            BusinessApplicationName: obj.BusinessServicesAppsName,
                            Description: obj.BusinessServiceAppsDescription
                        });
                    });

                    // grouping Interdependent Processes by BusinessProcessID
                    InterDependentProcess.forEach((obj) => {
                        if (!groupedData[obj.BusinessProcessId]) {
                            groupedData[obj.BusinessProcessId] = {
                                BusinessProcessID: obj.BusinessProcessId,
                                BusinessProcessName: obj.BusinessProcessName,
                                TechnologyDependency: [],
                                InterdependentProcesses: [],
                                SupplierDependency: []
                            };
                        }
                        groupedData[obj.BusinessProcessId].InterdependentProcesses.push({
                            ProcessActivityID: obj.SubBusinessProcessId,
                            ProcessActivityName: obj.SubBusinessProcessName,
                            Description: obj.DependencyDescription,
                            DependentFunction: obj.BusinessFunctionName,
                            DependencyType: obj.DependencyType
                        });
                    });

                    // grouping Supplier Dependencies by BusinessProcessID
                    SupplierDependencies.forEach((obj) => {
                        if (!groupedData[obj.BusinessProcessId]) {
                            groupedData[obj.BusinessProcessId] = {
                                BusinessProcessID: obj.BusinessProcessId,
                                BusinessProcessName: obj.BusinessProcessName,
                                TechnologyDependency: [],
                                InterdependentProcesses: [],
                                SupplierDependencies: []
                            };
                        }
                        groupedData[obj.BusinessProcessId].SupplierDependency.push({
                            SubActivityID: obj.SubBusinessProcessId,
                            SubActivityName: obj.SubBusinessProcessName,
                            Description: obj.DependencyDescription,
                            SupplierID: obj.VendorID,
                            SupplierName: obj.SupplierName,
                            DependentTypeID: obj.ID,
                            DependentTypeName: obj.DependencyType
                        });
                    });

                    groupedData = businessProcessIDsArray.reduce((acc, id) => {
                        if (groupedData[id]) {
                            acc[id] = groupedData[id];
                        }
                        return acc;
                    }, {});

                    // console.log("GroupedData : ", groupedData);

                    return Object.values(groupedData);

                })
            }
        }

        // Section 4 Response formatting
        if (Section4Response != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section4Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for (const obj of Object.values(Section4Response)) {
                impactAssementList.push({
                    BusinessContinuityPlanID: Number(obj.BusinessContinuityPlanID),
                    ImpactMasterData: obj.ImpactAssessment != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(obj.ImpactAssessment) : []
                })
            }
        } else {
            impactAssementList = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }

        if (Section4ImpactMaster != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(Section4ImpactMaster)) {
                impactMasterList.push({
                    ImpactMasterDataID: obj.ImpactId,
                    ImpactMasterData: obj.ImpactName
                })
            }
        }

        if (Section4SubProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            subProcessList = Section4SubProcess;
        }

        if (Section4BusinessProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            businessProcessList = Section4BusinessProcess;
        }

        // Section 5 Response formatting
        if (Section5Response != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section5Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            finalRiskMitigationList = Section5Response.map((item) => {
                let { BusinessContinuityPlanID, RiskMitigartionId, PotentialFailure, BusinessProcessName, BusinessProcessId, ImpactRatingId, ImpactRatingName, LikelihoodRatingId, LikelihoodRatingName, Risk, ContingencyMeasures, TreatmentPlan, IsSaved } = item;
                BusinessContinuityPlanID    = Number(BusinessContinuityPlanID);
                let RiskMitigatonID         = Number(RiskMitigartionId);
                let PotentialData           = PotentialFailure;
                let AffectedProcess         = BusinessProcessName;
                let AffectedProcessID       = Number(BusinessProcessId);
                let ImpactID                = Number(ImpactRatingId);
                let Impact                  = ImpactRatingName;
                let LikelihoodID            = Number(LikelihoodRatingId);
                let Likelihood              = LikelihoodRatingName;
                Risk                        = Risk;
                let Contingency             = ContingencyMeasures;
                let Treatment               = TreatmentPlan;
                IsSaved                     = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { BusinessContinuityPlanID, RiskMitigatonID, PotentialData, AffectedProcess, AffectedProcessID, ImpactID, Impact, LikelihoodID, Likelihood, Risk, Contingency, Treatment, IsSaved }
            }) 
        } else {
            finalRiskMitigationList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        // Section 6 Response formatting
        if (Section6Response != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section6Response.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            let VitalRecords = [];
            let CriticalEquipmentSupplies = [];
            let BusinessContinuityPlanID;
            for (const obj of Object.values(Section6Response)) {
                BusinessContinuityPlanID = obj.BusinessContinuityPlanID
                if (obj.VitalRecords != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    for (const ob of JSON.parse(obj.VitalRecords)) {
                        if (Array.isArray(ob.SubBusinessProcess)) {
                            for (const n of ob.SubBusinessProcess) {
                                VitalRecords.push({
                                    VitalRecordsId          : Number(n.VitalRecordsId),
                                    BusinessProcessId       : Number(ob.BusinessProcessId),
                                    BusinessProcessName     : ob.BusinessProcessName,
                                    SubBusinessProcessId    : Number(n.SubBusinessProcessId),
                                    SubBusinessProcessName  : n.SubBusinessProcessName,
                                    RecordType              : n.RecordType,
                                    MediaTypeID             : Number(n.MediaTypeID),
                                    MediaType               : n.MediaTypeName,
                                    AlternateSourceID       : Number(n.AlternateSourceID),
                                    AlternateSource         : n.AlternateSourceName,
                                    IsSaved                 : n.IsSaved
                                });
                            }
                        }
                    }
                }

                if (obj.CriticalEquipmentSupplies != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    for (const n of Object.values(JSON.parse(obj.CriticalEquipmentSupplies))) {
                        CriticalEquipmentSupplies.push({
                            "CriticalEquipmentSuppliesID"   : Number(n.CriticalEquipmentSuppliesID),
                            "BusinessProcessId"             : Number(n.BusinessProcessId),
                            "BusinessProcessName"           : n.BusinessProcessName,
                            "EquipmentID"                   : Number(n.EquipmentID),
                            "Equipment"                     : n.EquipmentName,
                            "Description"                   : n.EquipmentDescription,
                            "TotalCount"                    : n.TotalCount,
                            "MinimumCount"                  : n.MinCount,
                            "IsSaved"                       : n.IsSaved
                        })
                    }
                }
            }
            criticalEquipmentList.push({
                BusinessContinuityPlanID    : Number(BusinessContinuityPlanID),
                VitalRecords                : VitalRecords,
                CriticalEquipmentSupplies   : CriticalEquipmentSupplies
            })
        }

        // Section 7 Response formatting
        if (Section7Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CallTreeDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section7Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CallTreeDetails.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            finalStaffContactList = JSON.parse(Section7Response[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CallTreeDetails).map((item) => {
                let { CallTreeId, CallID, Role, CallInitiatorGUID, CallInitiatorName, CallOrderInitiator, CallInitiatorDesignation, CallInitiatorMobile, CallInitiatorResidence, CallReceiverGUID, CallOrderReceiver, CallReceiverDesignation, CallReceiverMobile, CallReceiverResidence, CallReceiverName, IsSaved } = item;
                let StaffContactID  = Number(CallTreeId);
                CallID              = CallID;
                let CallOrder1      = CallOrderReceiver;
                Role                = Role;
                CallInitiatorGUID   = CallInitiatorGUID;
                let CallInitiator   = CallInitiatorName;
                let CallOrder       = CallOrderInitiator;
                let DesignationC    = CallInitiatorDesignation;
                let Mobile          = CallInitiatorMobile;
                let Residence       = CallInitiatorResidence;
                CallReceiverGUID    = CallReceiverGUID;
                CallReceiver        = CallReceiverName;
                // let CallReceiver            = CallOrderReceiver;
                let DesignationR    = CallReceiverDesignation;
                let MobileR         = CallReceiverMobile;
                let ResidenceR      = CallReceiverResidence;
                IsSaved             = (IsSaved !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? (IsSaved === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                return { StaffContactID, CallID, CallOrder1, Role, CallInitiatorGUID, CallInitiator, CallOrder, DesignationC, Mobile, Residence, CallReceiverGUID, CallReceiver, DesignationR, MobileR, ResidenceR, CallReceiverName, IsSaved }
            })
        } else {
            finalStaffContactList = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        // Section 8 Response formatting - Start

        // Staff requirement details
        if (Section8ResponseStaff != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section8ResponseStaff.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            staffRequirementDetails = Section8ResponseStaff;
        } else {
            staffRequirementDetails = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_ARRAY;
        }

        // recovery strategies details
        if (Section8ResponseStrategy != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Section8ResponseStrategy.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            let RecoveryStrategies = Section8ResponseStrategy[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RecoveryStrategies
            if (RecoveryStrategies != null) {
                for (const ob of Object.values(JSON.parse(RecoveryStrategies))) {
                    recoveryStrategies.push({
                        BusinessProcessId   : Number(ob.BusinessProcessId),
                        BusinessProcessName : ob.BusinessProcessName,
                        IsSaved             : ob.IsSaved,
                        SubBusinessProcesses: [],
                        When                : "",
                        Who                 : BusinessOwnerName != null ? BusinessOwnerName[0].BusinessOwnerUSER : '',//ob.UserName
                        Where               : ob.Where.includes('_') ? (ob.Where.split('_')[0]) : ob.Where,
                        Site                : ob.Where.includes('_') ? (ob.Where.split('_')[1]) : "",
                        WhenToTrigger       : ob.WhenToTrigger,
                        WhereSite           : ob.Where,
                        WhoGUID             : BusinessOwnerName != null ? BusinessOwnerName[0].BusinessOwner : '', //ob.WhoGUID,
                        RecoveryStrategiesId: Number(ob.RecoveryStrategiesId),
                        // subProcessList          : subProcessList
                    });
                }
            }

            recoveryProcessList.push({
                BusinessContinuityPlanID: Number(Section8ResponseStrategy[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BusinessContinuityPlanID),
                RecoveryStrategies: recoveryStrategies,                
            }); 
        }

        // for Business Process List
        if (Section8ResponseProcess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const ob of Object.values(Section8ResponseProcess)) {
                let SubProcess = ob.SubBusinessProcess !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(ob.SubBusinessProcess) : []
                let SubBusinessProcesses = [];
                if (SubProcess && SubProcess.length) {
                    for (const n of Object.values(SubProcess)) {
                        SubBusinessProcesses.push({
                            SubBusinessProcessId: Number(n.SubBusinessProcessId),
                            SubBusinessProcessName: n.SubBusinessProcessName,
                            BusinessProcessId: Number(ob.BusinessProcessId),
                        })
                    }
                }
                processList.push({
                    BusinessProcessID: ob.BusinessProcessId,
                    BusinessProcessName: ob.BusinessProcessName,
                    When: ob.RTO.includes('_') ? (ob.RTO.split('_')[0] + " " + ob.RTO.split('_')[1]) : ob.RTO,
                    RTO: ob.RTO,
                    SubBusinessProcesses: SubBusinessProcesses,
                    Who: BusinessOwnerName != null ? BusinessOwnerName[0].BusinessOwnerUSER : ''
                });
            }
        }

        if (processList.length && recoveryProcessList[0].RecoveryStrategies.length) {
            recoveryProcessList[0].RecoveryStrategies.forEach(strategy => {
                let process = processList.find(p => p.BusinessProcessID == strategy.BusinessProcessId);
                if (process) {
                    strategy.When = process.When;
                    if (strategy.SubBusinessProcesses) {
                        strategy.SubBusinessProcesses = process.SubBusinessProcesses;

                    }
                }
            });
        }
        if (processList.length && recoveryProcessList[0].RecoveryStrategies.length) {
            const detailsViewIds = new Set(recoveryProcessList[0].RecoveryStrategies.map(item => Number(item.BusinessProcessId)));
            const unmatchedData = processList.filter(x => !detailsViewIds.has(Number(x.BusinessProcessID)));
            if (unmatchedData.length) {
                unmatchedData.forEach(item => {
                    recoveryProcessList[0].RecoveryStrategies.push({
                        BusinessProcessId: Number(item.BusinessProcessID),
                        BusinessProcessName: item.BusinessProcessName,
                        SubBusinessProcesses: item.SubBusinessProcesses || [],
                        When: item.When || "",

                    });
                });
            }
        }

        // Section 8 Response foramtting - End

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetCompleteBCPDraft : Execution End.');

        return {
            "BusinessFunctionProfileDetails"    : detailsBusinessFunctionProfile,
            "BusinessProcessDetailsView"        : businessProcessDetails,
            "DependenciesDetails"               : transformedDependenciesData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],
            "OriginalDependenciesDetails"       : [originalDependenciesList],
            "impactAssementList"                : impactAssementList,
            "RiskMitigationLists"               : finalRiskMitigationList,
            "criticalEquipmentList"             : criticalEquipmentList,
            "StaffContactLists"                 : finalStaffContactList,
            "staffRequirementDetails"           : staffRequirementDetails,
            "recoveryProcessList"               : recoveryProcessList,
            "processList"                       : processList,
            "impactDropDownList"                : ENUMS_OBJ.IMPACT_LIST_DROPDOWN,
            "impactMasterList"                  : impactMasterList,
            "BusinessProcesslist"               : BusinessProcesslist,
            "businessProcessList"               : businessProcessList,
            "subProcessList"                    : subProcessList

        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessContinuityPlansBl : formatGetCompleteBCPDraft : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

/**
* This is function will be used to return single instance of class.
*/
function getBusinessContinuityPlansBLClassInstance() {
    if (BusinessContinuityPlansBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        BusinessContinuityPlansBLClassInstance = new BusinessContinuityPlansBl();
    }
    return BusinessContinuityPlansBLClassInstance;
}

exports.getBusinessContinuityPlansBLClassInstance = getBusinessContinuityPlansBLClassInstance;