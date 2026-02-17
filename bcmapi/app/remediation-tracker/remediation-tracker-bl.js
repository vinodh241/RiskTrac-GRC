const MESSAGE_FILE_OBJ                  = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ                 = require("../../utility/constants/constant.js");
const APP_VALIDATOR                     = require("../../utility/app-validator.js");
const ENUMS_OBJ                         = require("../../utility/enums/enums.js")
const COMPUTATION_OBJ                   = require("../../utility/computations.js")
const REMEDIATION_TRACKER_DB            = require("../../data-access/remediation-tracker-db.js");
const { logger }                        = require("../../utility/log-manager/log-manager.js");
const EMAIL_NOTIFICATION                = require("../../utility/email-notification.js");
const APP_CONFIG_FILE_OBJ               = require('../../config/app-config.js');
const UTILITY_APP                       = require("../../utility/utility.js");
const multer                            = require("multer");
const FILE_TYPE                         = require('file-type');
const path                              = require('path');
const fileSystem                        = require('fs');
const { constrainedMemory, nextTick }   = require("process");
const RMT_TEMPLATE                      = require("./../../config/email-template/generic-rmt-template.js");
const INAPP_DB                          = require("../../data-access/inApp-notification-db.js");

var RemediationTrackerBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var RemediationTrackerDB                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var computationUtilityObj               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailNotificationObject             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RemediationTrackerBl {
    constructor() {
        RemediationTrackerDB        = new REMEDIATION_TRACKER_DB();
        appValidatorObject          = new APP_VALIDATOR();
        computationUtilityObj       = new COMPUTATION_OBJ();
        emailNotificationObject     = new EMAIL_NOTIFICATION();
        utilityAppObject            = new UTILITY_APP();
        inAppNotificationDbObject   = new INAPP_DB()
    }

    start() { }

    // for getting all the action items in listing page
    async getActionItemList(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken;
        try {
            remediationData = request.body;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemList : Execution started.');

            const ACTION_ITEM_LIST_DB_RESPONSE = await RemediationTrackerDB.getActionItemList(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ACTION_ITEM_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ACTION_ITEM_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemList : Execution end. :  ACTION_ITEM_LIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ACTION_ITEM_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemList : Execution end. : Error details :' + ACTION_ITEM_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ACTION_ITEM_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ACTION_ITEM_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemList : Execution end. : Error details : ' + ACTION_ITEM_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_ACTION_ITEM_LIST = await formatGetActionItemList(userIdFromToken, ACTION_ITEM_LIST_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_ACTION_ITEM_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_ACTION_ITEM_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemList : Execution end. :  FORMAT_GET_ACTION_ITEM_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_ACTION_ITEM_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for adding and updating new action item
    async addUpdateNewActionItem(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let Mode                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {            
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            remediationData         = request.body.data;
            Mode                    = request.body.data.Mode;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemModuleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemModuleID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemModuleID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_MODULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemSourceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemSourceID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemSourceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_SOURCE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.StartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.StartDate || '' == remediationData.StartDate) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : StartDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_START_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.EndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.EndDate || '' == remediationData.EndDate) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : EndDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_END_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemOwnerGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemOwnerGUID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemOwnerGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_OWNER_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IsBudgetRequired || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IsBudgetRequired) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : IsBudgetRequired is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUDGET_REQUIRED_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.CriticalityID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.CriticalityID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : CriticalityID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CRITICALITY_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemName || appValidatorObject.isStringEmpty(remediationData.ActionItemName)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemName is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_NAME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemPlan || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemPlan || appValidatorObject.isStringEmpty(remediationData.ActionItemPlan)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemPlan is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_PLAN_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE = await RemediationTrackerDB.addUpdateNewActionItem(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE : ' + JSON.stringify(ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. :  ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : Error details :' + ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : Error details : ' + ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Email Logic - Start

            let EMAIL_DETAILS = ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : EMAIL_DETAILS : ' + JSON.stringify(EMAIL_DETAILS));
            if(EMAIL_DETAILS.length) {
                try {                    
                    let emailTemplateObj = {
                        Subject : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Subject,
                        Body    : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Body
                    };
                    let toccEmails       = {
                        "TOEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID),
                        "CCEmail"   : utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + ","+ EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs + "," +EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID +"," +EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    }; 

                    let templateMaster   = {                     
                        IdentifiedActionItem    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IdentifiedActionItem,
                        BCMModuleName           : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleName,   
                        ActionItemSource        : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemSource,                                                           
                        StartDate               : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate                 : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TargetDate),
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        subject_text            : Mode == "edit" ?  "Action item has been updated by BC Manager" : "Action item has been created by BC Manager" ,
                        body_text               : Mode == "edit" ? `Action item has been updated by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})` : `Action item has been created by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`,
                        Note                    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID ? `Note : Risk Title - (${EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceTitle})` : ""
                    };
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : templateMaster : ' + JSON.stringify(templateMaster || null));

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : emailData   : ' + JSON.stringify(emailData || null));
                    
                    let CombinedGUIDs    = EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerUserGUID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCChampion;
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(CombinedGUIDs)
                    let InAppMessage     = Mode == "edit" ? "Action item has been updated." : "Action item has been created."

                    let inappDetails     = {
                        inAppContent     : InAppMessage + " Action Item Name - " + templateMaster.IdentifiedActionItem + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].Route,
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    
                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            } 

            // Email Logic - End

            const FORMAT_ADD_UPDATE_NEW_ACTION_ITEM = await formatAddUpdateNewActionItem(userIdFromToken, ADD_UPDATE_NEW_ACTION_ITEM_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_UPDATE_NEW_ACTION_ITEM || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_UPDATE_NEW_ACTION_ITEM) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. :  FORMAT_ADD_UPDATE_NEW_ACTION_ITEM response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ADD_UPDATE_NEW_ACTION_ITEM));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for saving action item details
    async saveActionItemDetails(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remediationData     = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.BCMModuleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.BCMModuleID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : BCMModuleID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_MODULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.UserGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.UserGUID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : UserGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IsMarkedComplete || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IsMarkedComplete) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : IsMarkedComplete is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MARKED_COMPLETE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.Comment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.Comment || appValidatorObject.isStringEmpty(remediationData.Comment)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : Comment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_COMMENT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.Progress || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.Progress || appValidatorObject.isStringEmpty(remediationData.Progress)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : Progress is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROGRESS_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE = await RemediationTrackerDB.saveActionItemDetails(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE : ' + JSON.stringify(SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. :  SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : Error details :' + SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : Error details : ' + SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, SAVE_ACTION_ITEM_DETAILS_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : saveActionItemDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for fetching the details of a particular action item
    async getActionItemData(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remediationData     = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const GET_ACTION_ITEM_DATA_DB_RESPONSE = await RemediationTrackerDB.getActionItemData(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData :  GET_ACTION_ITEM_DATA_DB_RESPONSE : ' + JSON.stringify(GET_ACTION_ITEM_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ACTION_ITEM_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ACTION_ITEM_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. :  GET_ACTION_ITEM_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_ITEM_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. : Error details :' + GET_ACTION_ITEM_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_ITEM_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_ACTION_ITEM_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. : Error details : ' + GET_ACTION_ITEM_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_ACTION_ITEM_DATA = await formatGetActionItemData(userIdFromToken, GET_ACTION_ITEM_DATA_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData :  FORMAT_GET_ACTION_ITEM_DATA : ' + JSON.stringify(FORMAT_GET_ACTION_ITEM_DATA));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_ACTION_ITEM_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_ACTION_ITEM_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. :  FORMAT_GET_ACTION_ITEM_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_ACTION_ITEM_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for requesting an extension in end data for an action item
    async requestActionItemExtention(request, response) {
        let refreshedToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let toList               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let ccList               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken           = request.body.refreshedToken;
        try {
            userIdFromToken      = request.body.userIdFromToken;
            userNameFromToken    = request.body.userNameFromToken;
            remediationData      = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            if (remediationData.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && remediationData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
                remediationData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.SIX
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.BCMModuleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.BCMModuleID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : BCMModuleID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_MODULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.CurrentWorkflowStatusID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.CurrentWorkflowStatusID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : CurrentWorkflowStatusID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CURRENT_WORKFLOW_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.NextWorkflowStatusID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.NextWorkflowStatusID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : NextWorkflowStatusID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEXT_WORKFLOW_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IsExtentionRequested || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IsExtentionRequested) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : IsExtentionRequested is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EXTENSION_REQUESTED_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ExtendedTargetDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ExtendedTargetDate || '' == remediationData.ExtendedTargetDate) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : ExtendedTargetDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EXTENDED_TARGET_DATE_NULL_EMPTY));
            }

            // Logic for Target Date and Extended Target Date Validation - START
            const GET_ACTION_ITEM_DATA_DB_RESPONSE = await RemediationTrackerDB.getActionItemData(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ACTION_ITEM_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ACTION_ITEM_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. :  GET_ACTION_ITEM_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_ITEM_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : Error details :' + GET_ACTION_ITEM_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_ITEM_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_ACTION_ITEM_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : Error details : ' + GET_ACTION_ITEM_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (GET_ACTION_ITEM_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_ACTION_ITEM_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                const remediationDetails = GET_ACTION_ITEM_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                let previousStartDate = remediationDetails.StartDate;
                let previousEndDate = remediationDetails.EndDate;

                let startDate = previousStartDate.toISOString();
                let endDate = previousEndDate != remediationData.ExtendedTargetDate ? remediationData.ExtendedTargetDate : previousEndDate;

                // Checking requested date with existing date
                if (previousEndDate != remediationData.ExtendedTargetDate) {

                    let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, endDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, remediationData.ExtendedTargetDate, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                    if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. :' + dateTimeNotValid.message);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
                    }
                }
            }
            // Logic for Target Date and Extended Target Date Validation - END

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ExtentionExplanation || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ExtentionExplanation || appValidatorObject.isStringEmpty(remediationData.ExtentionExplanation)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : ExtentionExplanation is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EXTENSION_EXPLANATION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.reviewComment || appValidatorObject.isStringEmpty(remediationData.reviewComment)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_COMMENT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const SAVE_EXTENSION_REQUEST_DB_RESPONSE = await RemediationTrackerDB.requestActionItemExtention(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : SAVE_EXTENSION_REQUEST_DB_RESPONSE : ' + JSON.stringify(SAVE_EXTENSION_REQUEST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_EXTENSION_REQUEST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_EXTENSION_REQUEST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. :  SAVE_EXTENSION_REQUEST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SAVE_EXTENSION_REQUEST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : Error details :' + SAVE_EXTENSION_REQUEST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SAVE_EXTENSION_REQUEST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_EXTENSION_REQUEST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : Error details : ' + SAVE_EXTENSION_REQUEST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Email Logic - Start
            let EMAIL_DETAILS = SAVE_EXTENSION_REQUEST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : EMAIL_DETAILS : ' + JSON.stringify(EMAIL_DETAILS));
            if(EMAIL_DETAILS.length) {
                try {                 
                    if (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {  // to and cc list for SRA
                        toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID);
                        ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    } else if (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE) {  // to and cc list for INC
                        toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID);
                        ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    } else if (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {  // to and cc list for BCMS Testing
                        toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID);
                        ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    }
                    let emailTemplateObj = {
                        Subject : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Subject,
                        Body    : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Body
                    };
                    let toccEmails       = {
                        "TOEmail"   : toList,
                        "CCEmail"   : ccList
                    }; 
                    let templateMaster   = {                     
                        IdentifiedActionItem    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IdentifiedActionItem,
                        BCMModuleName           : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleName,   
                        ActionItemSource        : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemSource,                                                           
                        StartDate               : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate                 : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TargetDate),
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],                        
                        subject_text            : "Target date extension request has been raised by Action Item Owner",
                        body_text               : `Target date extension request has been raised for below action item by Action Item Owner(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`,
                        Note                    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID ? `Note : Risk Title - (${EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceTitle})` : ""
                    };

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemextension : templateMaster : ' + JSON.stringify(templateMaster || null));

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : emailData   : ' + JSON.stringify(emailData || null));

                    let CombinedGUIDs    = EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerUserGUID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCChampion;
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(CombinedGUIDs);
                    let InAppMessage     = templateMaster.subject_text;

                    let inappDetails     = {
                        inAppContent     : InAppMessage + " Action Item Name - " + templateMaster.IdentifiedActionItem + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].Route,
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
    
                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            // Email Logic - End

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, SAVE_EXTENSION_REQUEST_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : requestActionItemExtention : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for downloading the uploaded action item attachment
    async downloadActionItemAttachment(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {
            remediationData     = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.AttachmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.AttachmentID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : AttachmentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.FileContentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.FileContentID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : FileContentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_CONTENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const DOWNLOAD_ACTION_ITEM_DB_RESPONSE = await RemediationTrackerDB.downloadActionItemAttachment(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD_ACTION_ITEM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD_ACTION_ITEM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. :  DOWNLOAD_ACTION_ITEM_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_ACTION_ITEM_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : Error details :' + DOWNLOAD_ACTION_ITEM_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_ACTION_ITEM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD_ACTION_ITEM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : Error details : ' + DOWNLOAD_ACTION_ITEM_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_DOWNLOAD_ACTION_ITEM_DB_RESPONSE = await formatDownloadActionItemAttachment(userIdFromToken, DOWNLOAD_ACTION_ITEM_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_ACTION_ITEM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_ACTION_ITEM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. :  FORMAT_DOWNLOAD_ACTION_ITEM_DB_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_DOWNLOAD_ACTION_ITEM_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : downloadActionItemAttachment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for uploading action item attachments/evidences
    async uploadActionItemAttachment(request, response) {

        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let actionItemData      = {
            ActionItemID        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            OriginalFileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileName            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileType            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileContent         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;      

        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution started.');

            // check request body should not be undefined
            if (typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Request body has not found');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            // Logic for assigning file properties for uploading attachments - Start

            let allowedExtensions               = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER;
            let allowedExtensionsFile           = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST;
            let filePath                        = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_DESTINATION_PATH;
            let fileMimeType                    = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_FILE_MIME_TYPES;
            let destinationPath                 = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_DESTINATION_PATH_SERVER;
            let uploadFileExtension             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueFileName                  = Date.now() +"_"+ request.files.UploadFile.name;
            let lastIndex                       = uniqueFileName.lastIndexOf('.');
            let fileSize                        = request.files.UploadFile.size;
            let allowedFIleSize                 = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.FILE_SIZE * CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_MEGABYTE;
            uploadFileExtension                 = uniqueFileName.substr(lastIndex, uniqueFileName.length - 1).toLowerCase();
            actionItemData.OriginalFileName     = request.files.UploadFile.name;
            actionItemData.ActionItemID         = request.body.ActionItemID;          
            actionItemData.FileType             = uploadFileExtension;
            actionItemData.FileName             = Date.now() +"_"+ request.files.UploadFile.name;            
            actionItemData.FileContent          = request.files.UploadFile.data;
            const mimeType                      = await FILE_TYPE.fromBuffer(actionItemData.FileContent);
            const localFilePath                 = path.join(__dirname, '..','..','file-upload', 'remediation-tracker', 'attachments', 'temp');

            if (/^[a-zA-Z0-9\s_\-()./]*$/.test(request.files.UploadFile.name)) {
                actionItemData.FileName     = Date.now() +"_"+ request.files.UploadFile.name;   
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Error Details : File name should not have special characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_NAME_IS_NOT_VALID));
            }

            if (fileSize > allowedFIleSize) {                    
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Error Details : File size has exceeded the allowed limit');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_SIZE_EXCEED));                    
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : mimeType : ' + JSON.stringify(mimeType));

            if (mimeType != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                // Validating file extension
                if (!(allowedExtensions.includes(mimeType.ext)) || !allowedExtensionsFile.includes(actionItemData.FileType)) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Error Details : File extension is not allowed, Please enter valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));
                }               

                // Validating file Mimetype
                if (!(fileMimeType.includes(mimeType.mime))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Error Details : File mime type is not allowed, Please enter valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));                    
                }

                const fileUploadedResponse = await utilityAppObject.uploadFileToRemoteServer(userIdFromToken, actionItemData.FileContent, destinationPath, request.files.UploadFile.name, actionItemData.FileType, localFilePath);     
                if (fileUploadedResponse.uploadFileResponse) { 
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : File dumped into SFTP server successfully in the path : ' + destinationPath);

                    const GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE = await RemediationTrackerDB.uploadActionItemAttachment(userIdFromToken, userNameFromToken, actionItemData, accountGUIDFromToken);

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. :  GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Error details :' + GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Error details : ' + GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }

                    const FORMAT_GET_ACTION_ITEM_ATTACHMENT_DATA = await formatGetActionItemAttachmentData(userIdFromToken, GET_ACTION_ITEM_ATTACHMENT_DB_RESPONSE, accountGUIDFromToken);
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_ACTION_ITEM_ATTACHMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_ACTION_ITEM_ATTACHMENT_DATA) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. :  FORMAT_GET_ACTION_ITEM_ATTACHMENT_DATA response is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Remediation Action Item Attachment uploaded successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_GET_ACTION_ITEM_ATTACHMENT_DATA));

                } else if(fileUploadedResponse.uploadFileResponse === false && fileUploadedResponse.SFTPConnection === true){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Uploaded file is malicious ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
                } else {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Failed to connect to sftp server ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL_SFTP));
                } 
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : uploadActionItemAttachment : Execution end. : Got unhandled error : Error Detail : ' + error)
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));

        }
    }

    // for fetching action item info details from database
    async getActionItemInfo(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : Execution started.');

            const GET_INFO_FOR_SAVE_DB_RESPONSE = await RemediationTrackerDB.getActionItemInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : GET_INFO_FOR_SAVE_DB_RESPONSE : ' + JSON.stringify(GET_INFO_FOR_SAVE_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_FOR_SAVE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_FOR_SAVE_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : Execution end. :  GET_INFO_FOR_SAVE_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_FOR_SAVE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : Execution end. : Error details :' + GET_INFO_FOR_SAVE_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_FOR_SAVE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_FOR_SAVE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : Execution end. : Error details : ' + GET_INFO_FOR_SAVE_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_INFO_FOR_SAVE_RESPONSE = await formatRemediationInfo(userIdFromToken, GET_INFO_FOR_SAVE_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : FORMAT_GET_INFO_FOR_SAVE_RESPONSE : ' + JSON.stringify(FORMAT_GET_INFO_FOR_SAVE_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_INFO_FOR_SAVE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_INFO_FOR_SAVE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : Execution end. :  FORMAT_GET_INFO_FOR_SAVE_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_INFO_FOR_SAVE_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for updating an existing action item from source modules
    async updateActionItem(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remediationData     = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : updateActionItem : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : updateActionItem : Execution started.');

            /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.BCMModuleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.BCMModuleID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : BCMModuleID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_MODULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IsMarkedComplete || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IsMarkedComplete) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : IsMarkedComplete is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MARKED_COMPLETE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.StartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.StartDate || '' == remediationData.StartDate) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : StartDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_START_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.EndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.EndDate || '' == remediationData.EndDate) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : EndDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_END_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemOwnerID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemOwnerID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : ActionItemOwnerID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_OWNER_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IsBudgetRequired || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IsBudgetRequired) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : IsBudgetRequired is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUDGET_REQUIRED_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.CriticalityID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.CriticalityID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : CriticalityID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CRITICALITY_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IdentifiedActionItem || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IdentifiedActionItem || appValidatorObject.isStringEmpty(remediationData.IdentifiedActionItem)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : IdentifiedActionItem is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_NAME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.IdentifiedActionPlan || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.IdentifiedActionPlan || appValidatorObject.isStringEmpty(remediationData.IdentifiedActionPlan)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : IdentifiedActionPlan is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_PLAN_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.BudgetedCost || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.BudgetedCost || appValidatorObject.isStringEmpty(remediationData.BudgetedCost)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : BudgetedCost is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUDGETED_COST_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.Progress || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.Progress || appValidatorObject.isStringEmpty(remediationData.Progress)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. : Progress is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROGRESS_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const UPDATE_ACTION_ITEM_DB_RESPONSE = await RemediationTrackerDB.updateActionItem(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_ACTION_ITEM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_ACTION_ITEM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : updateActionItem : Execution end. :  UPDATE_ACTION_ITEM_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_ACTION_ITEM_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : updateActionItem : Execution end. : Error details :' + UPDATE_ACTION_ITEM_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_ACTION_ITEM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_ACTION_ITEM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : updateActionItem : Execution end. : Error details : ' + UPDATE_ACTION_ITEM_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_UPDATE_ACTION_ITEM = await formatAddUpdateNewActionItem(userIdFromToken, UPDATE_ACTION_ITEM_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_UPDATE_ACTION_ITEM || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_UPDATE_ACTION_ITEM) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : addUpdateNewActionItem : Execution end. :  FORMAT_UPDATE_ACTION_ITEM response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA, FORMAT_UPDATE_ACTION_ITEM));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : updateActionItem : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    // for deleting an action item attachment
    async deleteActionItemAttachment(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            remediationData         = request.body.data
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.AttachmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.AttachmentID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : AttachmentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.FileContentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.FileContentID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : FileContentID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_CONTENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE = await RemediationTrackerDB.deleteActionItemAttachment(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. :  DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : Error details :' + DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : Error details : ' + DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, DELETE_ACTION_ITEM_ATTACHMENT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for submitting action item data to business owner or bcm manager for review
    async submitActionItemResponse(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let toList              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let ccList              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            remediationData     = request.body.data
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.BCMModuleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.BCMModuleID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : BCMModuleID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_MODULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.UserGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.UserGUID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : UserGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.CurrentWorkflowStatusID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.CurrentWorkflowStatusID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : CurrentWorkflowStatusID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CURRENT_WORKFLOW_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.NextWorkflowStatusID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.NextWorkflowStatusID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : NextWorkflowStatusID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEXT_WORKFLOW_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.reviewComment || appValidatorObject.isStringEmpty(remediationData.reviewComment)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_COMMENT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE = await RemediationTrackerDB.submitActionItemResponse(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE : ' + JSON.stringify(SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. :  SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : Error details :' + SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : Error details : ' + SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
             * Email Logic - Start
             */
            let EMAIL_DETAILS = SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : EMAIL_DETAILS : ' + JSON.stringify(EMAIL_DETAILS));
            if(EMAIL_DETAILS.length) {
                try {                 
                    if (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {  // to and cc list for SRA
                        toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID);
                        ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    } else if (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE) {  // to and cc list for INC
                        toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID);
                        ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    } else if (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {  // to and cc list for BCMS Testing
                        toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID);
                        ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail)
                    }
                    let emailTemplateObj = {
                        Subject : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Subject,
                        Body    : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Body
                    };
                    let toccEmails       = {
                        "TOEmail"   : toList,
                        "CCEmail"   : ccList
                    };                    
                    let templateMaster   = {                     
                        IdentifiedActionItem    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IdentifiedActionItem,
                        BCMModuleName           : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleName,   
                        ActionItemSource        : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemSource,                                                           
                        StartDate               : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate                 : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TargetDate),
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],                        
                        subject_text            : (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsSubmitResubmit =="Submitted") ? "Action item has been submitted for review by Action Item Owner" : "Action item has been re-submitted for review by Action Item Owner ",
                        body_text               : (EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsSubmitResubmit =="Submitted") ? `Action item has been submitted for review by Action Item Owner(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})` : `Action item has been re-submitted for review by Action Item Owner(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`,
                        Note                    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID ? `Note : Risk Title - (${EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceTitle})` : ""
                    };

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : templateMaster : ' + JSON.stringify(templateMaster || null));

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : emailData   : ' + JSON.stringify(emailData || null));
                    
                    let CombinedGUIDs    = EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerUserGUID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCChampion;
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(CombinedGUIDs)
                    let InAppMessage     = templateMaster.subject_text

                    let inappDetails     = {
                        inAppContent     : InAppMessage + " Action Item Name - " + templateMaster.IdentifiedActionItem + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].Route,
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    
                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            /**
             * Email Logic - End
             */

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, SUBMIT_ACTION_ITEM_ATTACHMENT_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for reviewing an action item data
    async reviewActionItemResponse(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let modifiedRemediationData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let Mode                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            remediationData     = request.body.data
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            Mode                = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : submitActionItemResponse : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution started.');

            // setting the next workflow status ID based on the scenario
            modifiedRemediationData  = await setNextWorkflowStatusID(remediationData);

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == modifiedRemediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == modifiedRemediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == modifiedRemediationData.BCMModuleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == modifiedRemediationData.BCMModuleID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : BCMModuleID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_MODULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == modifiedRemediationData.CurrentWorkflowStatusID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == modifiedRemediationData.CurrentWorkflowStatusID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : CurrentWorkflowStatusID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CURRENT_WORKFLOW_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == modifiedRemediationData.NextWorkflowStatusID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == modifiedRemediationData.NextWorkflowStatusID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : NextWorkflowStatusID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEXT_WORKFLOW_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == modifiedRemediationData.status || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == modifiedRemediationData.status) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : status is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_STATUS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == modifiedRemediationData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == modifiedRemediationData.reviewComment || appValidatorObject.isStringEmpty(modifiedRemediationData.reviewComment)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RMT_COMMENT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const REVIEW_ACTION_ITEM_DB_RESPONSE = await RemediationTrackerDB.reviewActionItemResponse(userIdFromToken, userNameFromToken, modifiedRemediationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : REVIEW_ACTION_ITEM_DB_RESPONSE : ' + JSON.stringify(REVIEW_ACTION_ITEM_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REVIEW_ACTION_ITEM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REVIEW_ACTION_ITEM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. :  REVIEW_ACTION_ITEM_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_ACTION_ITEM_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : Error details :' + REVIEW_ACTION_ITEM_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_ACTION_ITEM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && REVIEW_ACTION_ITEM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : Error details : ' + REVIEW_ACTION_ITEM_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            /**
             * Email Logic - Start
             */
            let EMAIL_DETAILS = REVIEW_ACTION_ITEM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : EMAIL_DETAILS : ' + JSON.stringify(EMAIL_DETAILS));
            if(EMAIL_DETAILS.length) {
                try {   
                    let updatedData = await getToCcListForReview(userIdFromToken, REVIEW_ACTION_ITEM_DB_RESPONSE, request.body.data, modifiedRemediationData,  userNameFromToken);
                    
                    let toccEmails  = {
                        "TOEmail"       : updatedData.TOEmail,
                        "CCEmail"       : updatedData.CCEmail,
                    }
                    
                    let emailTemplateObj    = {
                        Subject : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Subject,
                        Body    : RMT_TEMPLATE.GENERIC_RMT["GENERIC_RMT_TEMPLATE"].Body
                    }; 

                    let templateMaster      = {                     
                        IdentifiedActionItem    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IdentifiedActionItem,
                        BCMModuleName           : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleName,   
                        ActionItemSource        : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemSource,                                                           
                        StartDate               : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate),
                        EndDate                 : utilityAppObject.formatDate(userIdFromToken, EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TargetDate),
                        RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        subject_text            : updatedData.subject_text,
                        body_text               : updatedData.body_text,
                        Note                    : EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubModuleID ? `Note : Risk Title - (${EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceTitle})` : ""
                    };
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : templateMaster : ' + JSON.stringify(templateMaster || null));

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : emailData   : ' + JSON.stringify(emailData || null));
                    
                    let CombinedGUIDs    = EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersUserGUIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerUserGUID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerUserGUID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBCChampion;
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(CombinedGUIDs)
                    let InAppMessage     = updatedData.subject_text

                    let inappDetails     = {
                        inAppContent     : InAppMessage + " Action Item Name - " + templateMaster.IdentifiedActionItem + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].Route,
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].SubModuleID
                    }

                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
            /**
             * Email Logic - End
             */  

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, REVIEW_ACTION_ITEM_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : reviewActionItemResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for getting previous comments
    async getActionItemsComments(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            remediationData     = request.body.data;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const GET_ACTION_ITEM_COMMENTS_DB_RESPONSE = await RemediationTrackerDB.getActionItemsComments(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ACTION_ITEM_COMMENTS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ACTION_ITEM_COMMENTS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution end. :  GET_ACTION_ITEM_COMMENTS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_ITEM_COMMENTS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution end. : Error details :' + GET_ACTION_ITEM_COMMENTS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_ACTION_ITEM_COMMENTS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_ACTION_ITEM_COMMENTS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution end. : Error details : ' + GET_ACTION_ITEM_COMMENTS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_ACTION_ITEM_COMMENTS_RESPONSE = await formatActionItemsComments(userIdFromToken, GET_ACTION_ITEM_COMMENTS_DB_RESPONSE, remediationData, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ACTION_ITEM_COMMENTS_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ACTION_ITEM_COMMENTS_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItemAttachment : Execution end. :  FORMAT_ACTION_ITEM_COMMENTS_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ACTION_ITEM_COMMENTS_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getActionItemsComments : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    // for deleting a custom Action Item
    async deleteActionItem(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let remediationData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            remediationData     = request.body.data
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution end. : remediationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution started.');

            /**
             * Input Validation : Start
             */
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == remediationData.ActionItemID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == remediationData.ActionItemID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution end. : ActionItemID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_ITEM_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const DELETE_ACTION_ITEM_DB_RESPONSE = await RemediationTrackerDB.deleteActionItem(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_ACTION_ITEM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_ACTION_ITEM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution end. :  DELETE_ACTION_ITEM_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_ACTION_ITEM_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution end. : Error details :' + DELETE_ACTION_ITEM_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_ACTION_ITEM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_ACTION_ITEM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution end. : Error details : ' + DELETE_ACTION_ITEM_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, DELETE_ACTION_ITEM_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : deleteActionItem : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    stop() { }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: errorMessage,
        },
    };
}

function successfulResponse(refreshedToken, successMessage, result) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message: successMessage,
        result: result,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        },
    };
}

async function formatGetActionItemList(userIdFromToken, getRemDBResponse, accountGUIDFromToken) {

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemList : Execution Started.');

        let RemediationLists            = [];
        let ActionItemStatusList        = [];
        let ActionItemsList             = [];
        let StatusList                  = [];
        let AdminGUIDList               = [];
        let OwnersList                  = [];
        let ActionItemOwnersList        = [];
        let IsCustomActionItem          = [];
        let workFlowTransactionList     = [];
        let siteHeadList                = [];
        let businessOwnersList          = [];
        let steeringCommitteeList       = [];
        let workFlowRecord              = [];
        let SiteBusinessOwnersBasedList = [];
        let BCManagersBasedList         = [];
        let finalActionItemsList        = [];

        RemediationLists        = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        ActionItemStatusList    = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        AdminGUIDList           = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        OwnersList              = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        workFlowTransactionList = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        businessOwnersList      = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        siteHeadList            = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        steeringCommitteeList   = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        corresponsdingUsersList = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];

        let IsBCManager                     = AdminGUIDList.some((admin) => userIdFromToken === admin.AdminGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        let IsActionItemOwner               = OwnersList.some((owner) => userIdFromToken === owner.ActionItemOwnerGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        let IsSiteBusinessOwner             = businessOwnersList.concat(siteHeadList).some((owner) => (userIdFromToken === owner.SiteOwnerGUID || userIdFromToken === owner.BusinessOwner)) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        let IsBCMSteeringMember             = steeringCommitteeList.some((owner) => userIdFromToken === owner.UserGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        let siteBusinessOwnersActionItemIDs = corresponsdingUsersList.filter((item) => userIdFromToken == item.SiteBusinessOwner).map((obj) => obj.ActionItemID);
        let actionItemOwnersActionItemIDs   = corresponsdingUsersList.filter((item) => userIdFromToken == item.ActionitemOwner).map((obj) => obj.ActionItemID);

        // Result Set 1 - Detailed Action Item List
        for (const obj of Object.values(RemediationLists)) {
            let workFlowRecordData          = obj.WorkFlowRecordData ? JSON.parse(obj.WorkFlowRecordData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let percentage                  = (obj.ProgressPercentage ?  obj.ProgressPercentage : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) + "%";
            let filterStatusId

            if(Number(obj.ActionItemStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.THREE || Number(obj.ActionItemStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR){
                filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO
            }else if(Number(obj.ActionItemStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE){
                filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE
            }else{
                filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE
            }

            if (actionItemOwnersActionItemIDs.includes(obj.ActionItemID)) {
                ActionItemsList.push({
                    "ActionItemID"              : Number(obj.ActionItemID),
                    "BCMModuleID"               : Number(obj.BCMModuleID),
                    "ActionItemName"            : obj.ActionPlanTitle,
                    "ActionItemDescription"     : obj.ActionPlanDescription,
                    "ActionItemSource"          : obj.ActionItemSource,
                    "ActionItemSourceID"        : Number(obj.SourceID),
                    "ActionItemModule"          : obj.ActionItemModule,
                    "ActionItemOwnerGUID"       : obj.ActionItemOwnerID,
                    "ActionItemOwner"           : obj.ActionItemOwnerName,
                    "SiteBusinessOwner"         : obj.SiteBusinessOwner,
                    "StartDate"                 : obj.StartDate,
                    "EndDate"                   : obj.EndDate,
                    "StatusID"                  : Number(obj.ActionItemStatusID),
                    "StatusName"                : obj.StatusName,
                    "CriticalityID"             : Number(obj.CriticalityID),
                    "CriticalityName"           : obj.CriticalityName,
                    "IsBudgetRequired"          : Number(obj.IsBudgetRequired) ? Number(obj.IsBudgetRequired) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "BudgetedCost"              : obj.BudgetedCost ? Number(obj.BudgetedCost) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Progress"                  : percentage,
                    "ProgressPercentage"        : (obj.ProgressPercentage) ? Number(obj.ProgressPercentage) : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    "ScheduleRiskAssessmentID"  : (obj.BCMModuleID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? Number(obj.SourceID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "RiskTitle"                 : obj.RiskDetails ? ((obj.BCMModuleID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? JSON.parse(obj.RiskDetails).RiskTitle : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "IsMarkCompleted"           : (obj.IsMarkCompleted == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsMarkCompleted == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                    "SourceActionPlanID"        : Number(obj.SourceActionPlanID),
                    "SourceCode"                : obj.ActionItemSource,
                    "SourceID"                  : Number(obj.SourceID),
                    "IsExtentionRequested"      : (obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                    "ExtendedTargetDate"        : obj.ExtendedTargetDate,
                    "ExtentionExPlanation"      : obj.ExtentionExPlanation,
                    "IsCustomActionItem"        : (obj.IsCustomActionItem == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsCustomActionItem == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                    "WorkFlowRecordData"        : workFlowRecordData,
                    "CurrentWorkFlowStatusIDToDB"   : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "CurrentWorkFlowStatusToDB"     : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "NextWorkFlowStatusIDToDBList"  : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowTransactionList.filter((item) => item.CurrentWorkflowStatusID == workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "NextWorkFlowStatusToDBList"    : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowTransactionList.filter((item) => item.CurrentWorkflowStatus == workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "IsRejected"                    : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workFlowRecordData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && [4, 5].includes(workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkflowStatusID)) ? 1 : 0) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "FilterStatusId"                : filterStatusId,
                    "FormattedStartDate"            : new Date(obj.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    "FormattedEndDate"              : new Date(obj.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                })

            } else if (siteBusinessOwnersActionItemIDs.includes(obj.ActionItemID)){
                SiteBusinessOwnersBasedList.push({
                            "ActionItemID"              : Number(obj.ActionItemID),
                            "BCMModuleID"               : Number(obj.BCMModuleID),
                            "ActionItemName"            : obj.ActionPlanTitle,
                            "ActionItemDescription"     : obj.ActionPlanDescription,
                            "ActionItemSource"          : obj.ActionItemSource,
                            "ActionItemSourceID"        : Number(obj.SourceID),
                            "ActionItemModule"          : obj.ActionItemModule,
                            "ActionItemOwnerGUID"       : obj.ActionItemOwnerID,
                            "ActionItemOwner"           : obj.ActionItemOwnerName, 
                            "SiteBusinessOwner"         : obj.SiteBusinessOwner,
                            "StartDate"                 : obj.StartDate,
                            "EndDate"                   : obj.EndDate,
                            "StatusID"                  : Number(obj.ActionItemStatusID),
                            "StatusName"                : obj.StatusName,
                            "CriticalityID"             : Number(obj.CriticalityID),
                            "CriticalityName"           : obj.CriticalityName,
                            "IsBudgetRequired"          : (obj.IsBudgetRequired !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(obj.IsBudgetRequired) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "BudgetedCost"              : obj.BudgetedCost ? Number(obj.BudgetedCost) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "Progress"                  : percentage,
                            "ProgressPercentage"        : (obj.ProgressPercentage) ? Number(obj.ProgressPercentage) : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            "ScheduleRiskAssessmentID"  : (obj.BCMModuleID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? Number(obj.SourceID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "RiskTitle"                 : obj.RiskDetails ? ((obj.BCMModuleID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? JSON.parse(obj.RiskDetails).RiskTitle : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "IsMarkCompleted"           : (obj.IsMarkCompleted == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsMarkCompleted == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                            "SourceActionPlanID"        : Number(obj.SourceActionPlanID),
                            "SourceCode"                : obj.ActionItemSource,
                            "SourceID"                  : Number(obj.SourceID),
                            "IsExtentionRequested"      : (obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                            "ExtendedTargetDate"        : obj.ExtendedTargetDate,
                            "ExtentionExPlanation"      : obj.ExtentionExPlanation,
                            "IsCustomActionItem"        : (obj.IsCustomActionItem == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsCustomActionItem == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                            "WorkFlowRecordData"        : workFlowRecordData,
                            "CurrentWorkFlowStatusIDToDB"   : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "CurrentWorkFlowStatusToDB"     : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "NextWorkFlowStatusIDToDBList"  : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowTransactionList.filter((item) => item.CurrentWorkflowStatusID == workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "NextWorkFlowStatusToDBList"    : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowTransactionList.filter((item) => item.CurrentWorkflowStatus == workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "IsRejected"                    : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workFlowRecordData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && [4, 5].includes(workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkflowStatusID)) ? 1 : 0) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "FilterStatusId"                :  filterStatusId,
                            "FormattedStartDate"            : new Date(obj.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                            "FormattedEndDate"              : new Date(obj.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        }) 
                } else {
                    BCManagersBasedList.push({
                            "ActionItemID"                  : Number(obj.ActionItemID),
                            "BCMModuleID"                   : Number(obj.BCMModuleID),
                            "ActionItemName"                : obj.ActionPlanTitle,
                            "ActionItemDescription"         : obj.ActionPlanDescription,
                            "ActionItemSource"              : obj.ActionItemSource,
                            "ActionItemSourceID"            : Number(obj.SourceID),
                            "ActionItemModule"              : obj.ActionItemModule,
                            "ActionItemOwnerGUID"           : obj.ActionItemOwnerID,
                            "ActionItemOwner"               : obj.ActionItemOwnerName,
                            "SiteBusinessOwner"             : obj.SiteBusinessOwner,
                            "StartDate"                     : obj.StartDate,
                            "EndDate"                       : obj.EndDate,
                            "StatusID"                      : Number(obj.ActionItemStatusID),
                            "StatusName"                    : obj.StatusName,
                            "CriticalityID"                 : Number(obj.CriticalityID),
                            "CriticalityName"               : obj.CriticalityName,
                            "IsBudgetRequired"              : (obj.IsBudgetRequired !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? Number(obj.IsBudgetRequired) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "BudgetedCost"                  : obj.BudgetedCost ? Number(obj.BudgetedCost) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "Progress"                      : percentage,
                            "ProgressPercentage"            : (obj.ProgressPercentage) ? Number(obj.ProgressPercentage) : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            "ScheduleRiskAssessmentID"      : (obj.BCMModuleID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? Number(obj.SourceID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "RiskTitle"                     : obj.RiskDetails ? ((obj.BCMModuleID === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? JSON.parse(obj.RiskDetails).RiskTitle : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "IsMarkCompleted"               : (obj.IsMarkCompleted == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsMarkCompleted == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                            "SourceActionPlanID"            : Number(obj.SourceActionPlanID),
                            "SourceCode"                    : obj.ActionItemSource,
                            "SourceID"                      : Number(obj.SourceID),
                            "IsExtentionRequested"          : (obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                            "ExtendedTargetDate"            : obj.ExtendedTargetDate,
                            "ExtentionExPlanation"          : obj.ExtentionExPlanation,
                            "IsCustomActionItem"            : (obj.IsCustomActionItem == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE || obj.IsCustomActionItem == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                            "WorkFlowRecordData"            : workFlowRecordData,
                            "CurrentWorkFlowStatusIDToDB"   : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "CurrentWorkFlowStatusToDB"     : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "NextWorkFlowStatusIDToDBList"  : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowTransactionList.filter((item) => item.CurrentWorkflowStatusID == workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "NextWorkFlowStatusToDBList"    : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workFlowTransactionList.filter((item) => item.CurrentWorkflowStatus == workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "IsRejected"                    : (workFlowRecordData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workFlowRecordData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && [4, 5].includes(workFlowRecordData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkflowStatusID)) ? 1 : 0) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "FilterStatusId"                :  filterStatusId,
                            "FormattedStartDate"            : new Date(obj.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                            "FormattedEndDate"              : new Date(obj.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        })
                    }
                }
        
        // assigning different types of Action Items List based on different user types.
        if(IsBCManager == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || IsBCMSteeringMember == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
            finalActionItemsList = BCManagersBasedList
        } else if(IsActionItemOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsSiteBusinessOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
            finalActionItemsList = ActionItemsList.concat(SiteBusinessOwnersBasedList)
        } else if (IsActionItemOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsSiteBusinessOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            finalActionItemsList = ActionItemsList
        } else if (IsSiteBusinessOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsActionItemOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            finalActionItemsList = SiteBusinessOwnersBasedList
        } else {
            finalActionItemsList = BCManagersBasedList
        }

        // Result Set 2 - Action Item Status List
        for (const obj of Object.values(ActionItemStatusList)) {
            StatusList.push({
                "ActionItemStatusID"    : Number(obj.ActionItemStatusID),
                "ActionItemStatus"      : obj.ActionItemStatus,

            })
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemList : Execution End.');

        return {
            "ActionItemsList"           : finalActionItemsList,
            "ActionItemStatusList"      : StatusList,
            "IsActionItemOwner"         : IsActionItemOwner,
            "IsBCManager"               : IsBCManager,
            "IsSiteBusinessOwner"       : IsSiteBusinessOwner,
            "IsBCMSteeringMember"       : IsBCMSteeringMember,
            "WorkFlowTransactionList"   : workFlowTransactionList
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }

}

async function formatRemediationInfo(userIdFromToken, getRemDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatRemediationInfo : Execution Started.');

        let DetailActionLists           = [];
        let ActionItemOwnerList         = [];
        let StatusList                  = [];
        let ModuleList                  = [];
        let CriticalityList             = [];
        let filteredDetailActionLists   = [];
        let dataArr                     = [];
        let RiskArr                     = [];
        let currencyType                = [];

        // Result Set 1 : Different Sub-Modules List
        if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                ModuleList.push({
                    "ActionItemModule"      : obj.SubModuleName,
                    "ActionItemModuleID"    : obj.SubModuleID,
                    "ModuleName"            : obj.ModuleName,

                })
            }
        }

        // Result Set 2 - Action Items along with respective Sources
        if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const itr of Object.values(getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    let filteredResponse = getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(item => Number(item.SubModuleID) == Number(itr.SubModuleID));
                    DetailActionLists.push({
                        "ActionItemModuleID": Number(itr.SubModuleID),
                        "Sources"           : filteredResponse,
                    })
                }
            }

           let bcmsArr      = [];
           let testAssArr   = [];
           let incArr       = [];
           let incSourceArr = [];
           DetailActionLists.forEach(module => {
                //Case -1 : SRA
                if(module.ActionItemModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE){
                    for (const ob of Object.values([].concat(...module.Sources))) {
                        if(ob.SourceDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            dataArr.push(JSON.parse(ob.SourceDetails))
                        }
                    }

                    dataArr = dataArr.flat()
                    RiskArr = Array.from(new Set(dataArr.map(a => a.ScheduleRiskAssessmentID))).map(ScheduleRiskAssessmentID => {
                        return dataArr.find(a => a.ScheduleRiskAssessmentID === ScheduleRiskAssessmentID)
                    });
                }
                //Case -2 : BCMS Test
                if(module.ActionItemModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT){
                    for (const ob of Object.values([].concat(...module.Sources))) {
                        if(ob.SourceDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            bcmsArr.push(JSON.parse(ob.SourceDetails))
                        }
                    }

                    bcmsArr = bcmsArr.flat()
                    testAssArr = Array.from(new Set(bcmsArr.map(a => a.TestAssessmentID))).map(TestAssessmentID => {
                        return bcmsArr.find(a => a.TestAssessmentID === TestAssessmentID)
                    });
                }
                //Case -3 : Incident
                if(module.ActionItemModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE){
                    for (const ob of Object.values([].concat(...module.Sources))) {
                        if(ob.SourceDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            incArr.push(JSON.parse(ob.SourceDetails))
                        }
                    }
    
                    incArr = incArr.flat()
                    incSourceArr = Array.from(new Set(incArr.map(a => a.IncidentID))).map(IncidentID => {
                        return incArr.find(a => a.IncidentID === IncidentID)
                    });
                }

           });
           
            // filtering detailed Action Items list based on module sources
            filteredDetailActionLists = DetailActionLists.map((obj) => {
                let { ActionItemModuleID, Sources } = obj;
                let resArr      = [];
                let bcmsResArr  = [];
                let incResArr   = []
                if (ActionItemModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
                    resArr = Array.from(new Set(Sources.map(a => a.SourceCode))).map(SourceCode => {
                        return Sources.find(a => a.SourceCode === SourceCode)
                    })
                    resArr.forEach((item) => {
                        item.SourceDetails = RiskArr.filter(ob => ob.AssessmentName == item.SourceCode)
                    })
                    Sources = resArr
                }
                if (ActionItemModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
                    bcmsResArr = Array.from(new Set(Sources.map(a => a.SourceCode))).map(SourceCode => {
                        return Sources.find(a => a.SourceCode === SourceCode)
                    })
                    bcmsResArr.forEach((item) => {
                        item.SourceDetails = testAssArr.filter(ob => ob.SourceCode == item.SourceCode)
                    })
                    Sources = bcmsResArr
                } 
                if (ActionItemModuleID == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE){
                    incResArr = Array.from(new Set(Sources.map(a => a.SourceCode))).map(SourceCode => {
                        return Sources.find(a => a.SourceCode === SourceCode)
                    })
                    incResArr.forEach((item) => {
                        item.SourceDetails = incSourceArr.filter(ob => ob.SourceCode == item.SourceCode)
                    })
                    Sources = incResArr
                }

                return { ActionItemModuleID, Sources }
            })

        }

        // Result Set 3 - Action Item Owners List
        if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                ActionItemOwnerList.push({
                    "ActionItemOwnerGUID"   : obj.ActionItemOwnerGUID,
                    "ActionItemOwner"       : obj.ActionItemOwnerName,

                })
            }
        }

        // Result Set 4 - Criticality List
        if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
                CriticalityList.push({
                    "CriticalityID"     : Number(obj.CriticalityID),
                    "CriticalityName"   : obj.Name,
                })
            }
        }

        // Result Status 5 - Action Item Status List
        if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {
                StatusList.push({
                    "ActionItemStatusID": Number(obj.ActionItemStatusID),
                    "ActionItemStatus"  : obj.ActionItemStatus,
                    "IsActive"          : obj.IsActive,
                })
            }
        }

        // Result Status 6 - Currency type for particular Account
        if (getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getRemDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])) {
                currencyType.push({
                    "AccountName"   : obj.AccountName,
                    "Currency"      : obj.Currency
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatRemediationInfo : Execution End.');

        return {
            "ActionItemSourceList"  : filteredDetailActionLists,
            "ActionItemStatusList"  : StatusList,
            "ActionItemOwnerList"   : ActionItemOwnerList,
            "ActionItemModuleList"  : ModuleList,
            "BudgetRequiredList"    : ENUMS_OBJ.BUDGET_REQUIRED_LIST,
            "CriticalityList"       : CriticalityList,
            "CurrencyType"          : currencyType
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatRemediationInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatGetActionItemData(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemData : Execution Started.');
        let detailActionLists        = []
        let commentsList             = []
        let actionItemOwnerList      = []
        let actionItemWorkflowList   = []
        let attachmentList           = []
        let workflowList             = []
        let workFLowTransitionList   = []
        let IsSiteBusinessOwner      = []
        let IsBCManager              = []
        let IsBCMSteeringCommitee    = []
        let IsActionItemOwner;
        let currentWorkFlowStatus;
        let nextWorkFlowStatus;
        let filteredCommentsList     = [];
        let actionItemOwnerComments  = [];
        let IsActionItemOwnerUser    = [];
        let currencyType             = [];
       
        // Result Set 1 : Workflow List of Previous Action
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            workflowList            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            currentWorkFlowStatus   = (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].WorkflowStatus : "New";
            nextWorkFlowStatus      = (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus : "Assigned Master Action Item";
        }

        // Result Set 2 : Action Item Comments List
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                commentsList.push({
                    "ActionItemCommentID"   : Number(obj.ActionItemCommentID),
                    "ActionItemID"          : Number(obj.ActionItemID),
                    "CommentBody"           : obj.CommentBody,
                    "ProgressPercentage"    : obj.ProgressPercentage,
                    "CommentedByUserGUID"   : obj.CommentedByUserGUID,
                    "CommentedByUserName"   : obj.CommentedByUserName,
                    "CreatedDate"           : obj.CreatedDate,
                    "IsVisible"             : obj.IsVisible,
                    "FromStatus"            : obj.FromStatus,
                    "ToStatus"              : obj.ToStatus
                })
            }
            
        }

        actionItemOwnerComments = commentsList.filter((item) => item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && item.ToStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

        // Result Set 3 : Action Item Attachments List
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            attachmentList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE]
        }

        // Result Set 4 : Workflow Transitions List
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            workFLowTransitionList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR]
        }

        // Result Set 5 : Action Items Workflow List
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            actionItemWorkflowList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];           
        }

        // Result Set 6 : IsActionItemOwner
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            actionItemOwnerList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
            IsActionItemOwner   = actionItemOwnerList.some((owner) => userIdFromToken === owner.ActionItemOwnerGUID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;   
        }

        // Result Set 7 : IsSiteBusinessOwner
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            IsSiteBusinessOwner = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN]
        }

        // Result Set 8 : IsBCManager
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            IsBCManager = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT]
        }

        // Result Set 9 : IsBCMSteeringCommittee
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            IsBCMSteeringCommitee = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE]
        }

        // Result Set 10 : Detailed Action Items 
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                let ActionItemSource    = JSON.parse(obj.ActionItemSource);
                let Source              = ActionItemSource != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (Number(obj.BCMModuleID) == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE ? ActionItemSource.AssessmentName :
                                          (Number(obj.BCMModuleID) == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE ? ActionItemSource.IncidentCode  : 
                                          (Number(obj.BCMModuleID) == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT ? ActionItemSource.TestTitle :CONSTANT_FILE_OBJ.APP_CONSTANT.NULL))) : 
                                          CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let RiskDetails         = ActionItemSource !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Number(obj.BCMModuleID) === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE ? ActionItemSource.RiskTitle : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
                detailActionLists.push({
                    "ActionItemID"          : Number(obj.ActionItemID),
                    "BCMModuleID"           : obj.BCMModuleID,
                    "ActionItemModule"      : obj.ActionItemModule,
                    "SourceActionPlanID"    : obj.SourceActionPlanID,
                    "ActionItemSource"      : obj.ActionItemSource != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? ActionItemSource : [],                    
                    "Source"                : Source,
                    "ActionItemOwnerGUID"   : obj.ActionItemOwnerID,
                    "ActionItemOwner"       : obj.ActionItemOwnerName,
                    "StartDate"             : obj.StartDate,
                    "EndDate"               : obj.EndDate,
                    "StatusID"              : obj.ActionItemStatusID,
                    "StatusName"            : obj.StatusName,
                    "CriticalityID"         : Number(obj.CriticalityID),
                    "CriticalityName"       : obj.CriticalityName,
                    "IsBudgetRequired"      : obj.IsBudgetRequired != null ? (obj.IsBudgetRequired == false ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : '',
                    "BudgetedCost"          : obj.BudgetedCost ? Number(obj.BudgetedCost) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ProgressPercentage"    : obj.ProgressPercentage ? Number(obj.ProgressPercentage.replace('%', '')) : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    "IdentifiedActionItem"  : obj.IdentifiedActionItem,
                    "IdentifiedActionPlan"  : obj.IdentifiedActionPlan,
                    "ExtendedTargetDate"    : obj.ExtendedTargetDate,
                    "IsMarkCompleted"       : (obj.IsMarkCompleted == false || obj.IsMarkCompleted == null) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                    "ExtentionExPlanation"  : obj.ExtentionExPlanation,
                    "WorkflowStatusID"      : obj.WorkflowStatusID,
                    "CurrentWorkFlowStatusIDToDB"   : (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                    "CurrentWorkFlowStatusToDB"     : (obj.StatusName == "New") ? ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_NEW : ((obj.StatusName == "Assigned") ? ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_ASSIGNED : ((obj.StatusName == "Open") ? ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_OPEN : nextWorkFlowStatus)),
                    "NextWorkFlowStatusIDToDBList"  : (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? workFLowTransitionList.filter((item) => item.CurrentWorkflowStatusID == workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "NextWorkFlowStatusToDBList"    : (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? workFLowTransitionList.filter((item) => item.CurrentWorkflowStatus == workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ExtentionRequestID"            : Number(obj.ExtentionRequestID),
                    "EscalationRequestID"           : Number(obj.EscalationRequestID),
                    "IsExtentionRequested"          : (obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : (obj.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ? CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL),
                    "IsEscalated"                   : obj.IsEscalated ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "WorkflowStatusToBeShown"       : (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? setWorkFlowStatus(workflowList) : ENUMS_OBJ.NEW_REMEDIATION_TRACKER,
                    "IsRejected"                    : (workflowList !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && workflowList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? ((workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && [4, 5].includes(workflowList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CurrentWorkflowStatusID)) ? 1 : 0) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "RiskDetails"                   : RiskDetails
                })
            }
        }

        // Result Set 11 : IsActionItemOwnerUser
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            IsActionItemOwnerUser = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN]
        }

        // Adding types of user as tags in each user comment.
        filteredCommentsList = commentsList.map((item) => {
            setTagForComments(item)
            return item
        });

        // Result Set 12 : For showing the currency type in UI
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN])){
                currencyType.push({
                    "AccountName": obj.AccountName,
                    "Currency": obj.Currency
                })
            }
        }
        

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemData : Execution end.');

        return {
            "detailActionLists"         : detailActionLists,
            "commentsList"              : filteredCommentsList,
            "actionItemOwnerList"       : actionItemOwnerList,
            "actionItemWorkflowList"    : actionItemWorkflowList,
            "attachmentList"            : attachmentList,
            "workflowList"              : workflowList,
            "workFLowTransitionList"    : workFLowTransitionList,
            "IsSiteBusinessOwner"       : IsSiteBusinessOwner,
            "IsBCManager"               : IsBCManager,
            "IsBCMSteeringCommitee"     : IsBCMSteeringCommitee,
            "ActionItemOwnerComments"   : actionItemOwnerComments,
            "fileTypeList"              : APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER,
            "IsActionItemOwnerUser"     : IsActionItemOwnerUser,
            "CurrencyType"              : currencyType
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

async function formatAddUpdateNewActionItem(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatAddUpdateNewActionItem : Execution Started.');

        let ActionItemLists         = [];
        let ActionItemOwnersList    = [];
        let ActionItemStatusList    = [];
        let DetailActionLists       = [];
        let OwnersList              = [];
        let StatusList              = [];

        ActionItemLists         = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        ActionItemOwnersList    = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        ActionItemStatusList    = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];

        // Result Set 1 - Detailed Action Items
        for (const obj of Object.values(ActionItemLists)) {
            DetailActionLists.push({
                "ActionItemID"          : Number(obj.ActionItemID),
                "ActionItemName"        : obj.ActionItemName,
                "ActionItemPlan"        : obj.ActionItemPlan,
                "ActionItemSourceID"    : Number(obj.SourceActionPlanID),
                "ActionItemSource"      : obj.ActionItemSource != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(obj.ActionItemSource) : [],
                "ActionItemModuleID"    : Number(obj.BCMModuleID),
                "ActionItemModule"      : obj.ActionItemModule,
                "ActionItemOwnerGUID"   : obj.ActionItemOwnerID,
                "ActionItemOwner"       : obj.ActionItemOwnerName,
                "StartDate"             : obj.StartDate,
                "EndDate"               : obj.EndDate,
                "StatusID"              : obj.ActionItemStatusID,
                "StatusName"            : obj.StatusName,
                "CriticalityID"         : Number(obj.CriticalityID),
                "CriticalityName"       : obj.CriticalityName,
                "IsBudgetRequired"      : obj.IsBudgetRequired ? Number(obj.IsBudgetRequired) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "BudgetedCost"          : obj.BudgetedCost ? Number(obj.BudgetedCost) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "Progress"              : obj.ProgressPercentage,
                "ExtendedTargetDate"    : obj.ExtendedTargetDate
            })
        }

        // Result Set 2 - Action Item Owners List
        for (const obj of Object.values(ActionItemOwnersList)) {
            OwnersList.push({
                "ActionItemOwnerGUID"   : obj.ActionItemOwnerGUID,
                "ActionItemOwner"       : obj.ActionItemOwnerName,

            })
        }

        // Result Set 3 - Action Item Status List
        for (const obj of Object.values(ActionItemStatusList)) {
            StatusList.push({
                "ActionItemStatusID"    : obj.ActionItemStatusID,
                "ActionItemStatus"      : obj.ActionItemStatus,
                "IsActive"              : obj.IsActive
            })
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatAddUpdateNewActionItem : Execution End.');

        return {
            "ActionItemLists"       : DetailActionLists,
            "ActionItemStatusList"  : StatusList,
            "ActionItemOwnerList"   : OwnersList,
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatAddUpdateNewActionItem : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatGetActionItemAttachmentData(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    ActionItemAttachmentDetails = [];

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemAttachmentData : Execution start.');

        // Result Set 1: Upload evidence List
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let evObj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                ActionItemAttachmentDetails.push({
                    "AttachmentID"  : Number(evObj.AttachmentID),
                    "ActionItemID"  : Number(evObj.ActionItemID),
                    "AttachmentName": evObj.OriginalFileName,
                    "AttachmentType": evObj.FileType,
                    "FileName"      : evObj.FileName,
                    "FileContentID" : Number(evObj.FileContentID),                    
                    "FileContent"   : evObj.FileContent,
                    "CreatedDate"   : evObj.CreatedDate,
                    "CreatedBy"     : evObj.CreatedBy
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemAttachmentData : Execution end.');

        //Forming the final resultset
        return {
            "ActionItemAttachmentDetails": ActionItemAttachmentDetails
        }


    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatGetActionItemAttachmentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function formatDownloadActionItemAttachment(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    let downloadActionItemAttachment = [];
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatDownloadActionItemAttachment : Execution start.');

        // Result Set 1: Upload evidence List
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let evObj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                downloadActionItemAttachment.push({
                    "ActionItemID"      : Number(evObj.ActionItemID),
                    "AttachmentID"      : Number(evObj.AttachmentID),
                    "AttachmentName"    : evObj.OriginalFileName,
                    "AttachmentType"    : evObj.FileType,
                    "FileContentID"     : Number(evObj.FileContentID),
                    "FileContent"       : evObj.FileContent,
                    "CreatedBy"         : evObj.CreatedBy,
                    "CreatedDate"       : evObj.CreatedDate,
                    "UploadedFileName"  : evObj.FileName
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatDownloadActionItemAttachment : Execution end.');
        return {
            "DownloadActionItemAttachment": downloadActionItemAttachment
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatDownloadActionItemAttachment : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

// Logic for setting nextWorkflow status ID based on currentWorkflow status ID and approve/reject case
async function setNextWorkflowStatusID(reviewData) {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split("T")[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
    
    if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.NINE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX && reviewData.previousEndDate >= currentDate) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;   //pre
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX && reviewData.previousEndDate < currentDate) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT;   /// BO reject  -post
        reviewData.IsEscalated = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN && reviewData.previousEndDate >= currentDate) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;  //pre
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN && reviewData.previousEndDate < currentDate) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT;  //BCM reject
        reviewData.IsEscalated = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        reviewData.IsEscalated = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
    } else if (reviewData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.CurrentWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
        reviewData.NextWorkflowStatusID = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        reviewData.IsEscalated = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
    } 

    return reviewData
}

// Logic for assigning current and next workFlow status based on scenarios
function setWorkFlowStatus(workflowRecord) {
    let currentWorkFlowStatus;
    let nextWorkflowStatus;

    if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        currentWorkFlowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_NEW;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_ASSIGNED;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
        currentWorkFlowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_ASSIGNED;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_OPEN;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
        currentWorkFlowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_OPEN
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_SUBMIT;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
        currentWorkFlowStatus = workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_REVIEW_BUSINESS_OWNER;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
        currentWorkFlowStatus = workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_REVIEW_BCMANAGER;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) {
        currentWorkFlowStatus = workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_EXTEND_REVIEW_BUSINESS_OWNER;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN) {
        currentWorkFlowStatus = workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_EXTEND_REVIEW_BCMANAGER;
    } else if (workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
        currentWorkFlowStatus = workflowRecord[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].NewWorkflowStatus;
        nextWorkflowStatus = ENUMS_OBJ.REMEDIATION_WORKFLOW_STATUS.ACTION_ITEM_ESCALATION_REVIEW
    }

    return {
        currentWorkFlowStatus,
        nextWorkflowStatus
    }
}

async function formatActionItemsComments(userIdFromToken, getDBResponse, payloadData, accountGUIDFromToken) {
    let commentList             = [];
    let workflowList            = [];
    let taggedCommentsList      = [];

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatActionItemsComments : Execution start.');

        // Result Set 1 - Comments List along with User tags
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            commentList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]
            taggedCommentsList  = commentList.map((item) => {
                setTagForComments(item)
                return item
            })
        }

        // Result Set 2 - Workflow List of previous action performed
        if (getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            workflowList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatActionItemsComments : Execution end.');

        //Forming the final resultset
        return {
            "commentList"   : taggedCommentsList,
            "workflowList"  : workflowList
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : formatActionItemsComments : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

// Logic for adding User tags to all the comments
function setTagForComments(item){
    if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.UPDATE_TAG;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && item.ToStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.SUBMIT_TAG;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && item.ToStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.REVIEW_EXT_TAG_ACTION_ITEM_OWNER;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.REVIEW_TAG_BUSINESS_OWNER;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.REVIEW_TAG_BC_MANAGER;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.REVIEW_EXT_TAG_BUSINESS_OWNER;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.REVIEW_EXT_TAG_BC_MANAGER;
    } else if (item.FromStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
        item.TagName = ENUMS_OBJ.REMEDIATION_TRACKER_COMMENT_TAGS.REVIEW_ESCALATION_TAG;
    } else {
        item.TagName = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_STRING;
    }
}

async function 
getToCcListForReview(userIdFromToken, REVIEW_ACTION_ITEM_DB_RESPONSE, data, reviewData,  userNameFromToken) {
    
    let toList              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let ccList              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let subject_text        = ''
    let body_text           = ''
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getToCcListForReview : Execution started.');

        let EMAIL_DETAILS           = REVIEW_ACTION_ITEM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
        let IsSiteBusinessOwner     = REVIEW_ACTION_ITEM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsSiteBusinessOwner;
        let IsBCManager             = REVIEW_ACTION_ITEM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsBCManager;
        let IsBCMSteeringCommitee   = REVIEW_ACTION_ITEM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsBCMSteeringCommitee;
        let BCMModuleID             = EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMModuleID;
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getToCcListForReview : EMAIL_DETAILS : ' +JSON.stringify(EMAIL_DETAILS));
    
        // escalation life cycle - 
        // Site Admin head/BCManager- escalation Rejects   Post target date 
        if (data.IsEscalated == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && (IsSiteBusinessOwner == true || IsBCManager == true)) {
            toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs);
            ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);           
            if (IsSiteBusinessOwner == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE ) {  
                subject_text     = "Extension request has been rejected by Business Owner/Site Admin Head and escalated to Steering Committe"
                body_text        = `Extension request has been rejected by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}) and escalated to Steering Committe`
            } else if (IsBCManager == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) { 
                subject_text     = "Extension request has been rejected by BC Manager and escalated to Steering Committe"
                body_text        = `Extension request has been rejected by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}) and escalated to Steering Committe`
            }                                     
        }        
        //site admin head rejected in the pre date the extension request  
        else if (data.IsEscalated == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && IsSiteBusinessOwner == true) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);                
            subject_text    = "Action item extension request has been returned with comment by Business Owner/Site Admin Head"
            body_text       = `Action item extension request has been returned with comment by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                            
        }
        //BC manager rejected in the pre date the extension request  
        else if (data.IsEscalated == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && reviewData.NextWorkflowStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && IsBCManager == true) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID); 
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);                
            subject_text    = "Action item extension request has been returned with comment by BC Manager"
            body_text       = `Action item extension request has been returned with comment by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                            
        }
        // BCMSteeringCommitee rejected/approved in the escalation request
        else if ( data.IsEscalated == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) && IsBCMSteeringCommitee == true) {
            toList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);    
            if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {  // extension scenario for rejection
                subject_text     = "Action item escalation request has been returned with comment by Steering Committe"
                body_text        = `Action item escalation request has been returned with comment by Steering Committe(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`
            } else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) { // escalation scenario for approve
                subject_text     = "Action item escalation request has been approved by Steering Committe"
                body_text        = `Action item escalation request has been approved by Steering Committe(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`
            }                                           
        }
        //Business Owner/Site Admin Head approve
        else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&  data.IsEscalated == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsSiteBusinessOwner == true ) { 
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);
            subject_text    = "Action item escalation request has been approved by Business Owner/Site Admin Head"
            body_text       = `Action item escalation request has been approved by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`
        }
        // BCManager approved
        else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.IsEscalated == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsBCManager == true) { 
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);       
            subject_text    = "Action item escalation request has been approved by BC Manager"
            body_text       = `Action item escalation request has been approved by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                                
        }
        // Extension life cycle    
        //Business Owner/Site Admin head- Extension Approval
        else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&  data.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsSiteBusinessOwner == true ) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);
            subject_text    = "Action item extension has been approved by Business Owner/Site Admin Head"
            body_text       = `Action item extension has been approved by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`
        } // Business Owner/Site Admin head- Extension rejected
        else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && data.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsSiteBusinessOwner == true) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);       
            subject_text    = "Action item extension has been returned with comment by Business Owner/Site Admin Head"
            body_text       = `Action item extension has been returned with comment by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                                
        } 
        // BCManager approved
        else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsBCManager == true) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);       
            subject_text    = "Action item extension has been approved by BC Manager"
            body_text       = `Action item extension has been approved by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                                
        } 
        else if (data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && data.IsExtentionRequested == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && IsBCManager == true) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);       
            subject_text    = "Action item extension has been returned with comment by BC Manager"
            body_text       = `Action item extension has been returned with comment by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                                
        }
        //Normal work flow 
        //All Source Module,user - site admin head/BO && mode = 0 -> rejected 
        else if (IsSiteBusinessOwner == true && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);  
            subject_text    = "Action item has been returned with comment by Business Owner/Site Admin Head"
            body_text       = `Action item has been returned with comment by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                               
        }
        //All Source Module,user - site admin head/BO && mode = 1 -> approved 
        else if (IsSiteBusinessOwner == true && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);      
            subject_text    = "Action item has been approved by Business Owner/Site Admin Head"
            body_text       = `Action item has been approved by Business Owner/Site Admin Head(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                                  
        }
        //All Source Module,user - BCManager && mode = 1 -> approved 
        else if (IsBCManager == true && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);      
            subject_text    = "Action item has been approved by BC Manager"
            body_text       = `Action item has been approved by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]}). Action item has been closed`                                
        }
        //All Source Module,user - BCManager && mode = 0 -> rejected 
        else if (IsBCManager == true && data.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            toList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ActionItemOwnerEmailID);
            ccList          = utilityAppObject.removeDuplicateEmailIDs(EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].BCMMangerUsersEmailIDs + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SteeringCommitteEmailIDs  + "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteBusinessOwnerEmailID+ "," + EMAIL_DETAILS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SourceOwnerEmail);      
            subject_text    = "Action item has been returned with comment by BC Manager"
            body_text       = `Action item has been returned with comment by BC Manager(${userNameFromToken.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]})`                              
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getToCcListForReview : Execution end.');
        return  {
            "TOEmail"       : toList,
            "CCEmail"       : ccList,
            "subject_text"  : subject_text,
            "body_text"     : body_text
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RemediationTrackerBl : getToCcListForReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

/**
* This is function will be used to return single instance of class.
*/
function getRemediationTrackerBLClassInstance() {
    if (RemediationTrackerBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        RemediationTrackerBLClassInstance = new RemediationTrackerBl();
    }
    return RemediationTrackerBLClassInstance;
}

exports.getRemediationTrackerBLClassInstance = getRemediationTrackerBLClassInstance;
