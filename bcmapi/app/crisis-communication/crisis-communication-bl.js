const MESSAGE_FILE_OBJ          = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ         = require("../../utility/constants/constant.js");
const APP_CONFIG_FILE_OBJ       = require("../../config/app-config.js");
const APP_VALIDATOR             = require("../../utility/app-validator.js");
const CRISIS_COMMUNICATION_DB   = require("../../data-access/crisis-communication-db.js");
const { logger }                = require("../../utility/log-manager/log-manager.js");
const EMAIL_NOTIFICATION        = require("../../utility/email-notification.js");
const UTILITY_APP               = require("../../utility/utility.js");
const UtilityApp                = require("../../utility/utility.js");
const INAPP_DB                  = require("../../data-access/inApp-notification-db.js");
const ENUMS_OBJ                 = require("../../utility/enums/enums.js");
const FILE_TYPE                 = require('file-type');
const path                      = require('path');
const fileSystem                = require('fs');

var CrisisCommunicationBLClassInstance  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var crisisCommunicationDB               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailNotificationObject             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityObject                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class CrisisCommunicationBL {
    constructor() {
        crisisCommunicationDB       = new CRISIS_COMMUNICATION_DB();
        emailNotificationObject     = new EMAIL_NOTIFICATION();
        appValidatorObject          = new APP_VALIDATOR();
        utilityObject               = new UTILITY_APP();
        utilityAppObject            = new UtilityApp();
        inAppNotificationDbObject   = new INAPP_DB();
    }

    start() {}

    /** 
    * This function will fetch the all crisis communications list from the dataBase 
    */
      async getCrisisCommunicationsList(request, response) {

        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {


            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationsList : Execution started.');

            const GET_CRISIS_COMMS_LIST = await crisisCommunicationDB.getCrisisCommunicationsList(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_CRISIS_COMMS_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_CRISIS_COMMS_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationsList : Execution end. :  GET_CRISIS_COMMS_LIST is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_CRISIS_COMMS_LIST.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationsList : Execution end. : Error details :' + GET_CRISIS_COMMS_LIST.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_CRISIS_COMMS_LIST.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_CRISIS_COMMS_LIST.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationsList : Execution end. : Error details : ' + GET_CRISIS_COMMS_LIST.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_GET_CRISIS_COMMS_LIST = await getFormatCrisisCommunicationsList(userIdFromToken,userNameFromToken, GET_CRISIS_COMMS_LIST, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CRISIS_COMMS_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CRISIS_COMMS_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationsList : Execution end. :  FORMAT_GET_CRISIS_COMMS_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_CRISIS_COMMS_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the all master list required for create crisis message from the dataBase 
    */
      async getCreateCrisisMessageInfo(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCreateCrisisMessageInfo : Execution started.');


            const GET_INFO_DB_RESPONSE = await crisisCommunicationDB.getCreateCrisisMessageInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCreateCrisisMessageInfo : Execution end. :  GET_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCreateCrisisMessageInfo : Execution end. : Error details :' + GET_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCreateCrisisMessageInfo : Execution end. : Error details : ' + GET_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_INFO__DATA = await getFormatCreateCrisisInfoData(userIdFromToken,GET_INFO_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_INFO__DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_INFO__DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCreateCrisisMessageInfo : Execution end. :  FORMAT_GET_INFO__DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_INFO__DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCreateCrisisMessageInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will create new crisis message 
    */
     async createCrisisMessage(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let crisisCommunicationData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            crisisCommunicationData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : crisisCommunicationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : createCrisisMessage : Execution started.');

             /**
             * Input Validation : Start
             */
     
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.communicationTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.communicationTitle || appValidatorObject.isStringEmpty(crisisCommunicationData.communicationTitle)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : communicationTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMUNICATION_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.recipentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.recipentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : recipentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RECIPENT_TYPE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.categoryId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.categoryId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : categoryId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CATEGORY_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.incidentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.incidentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : incidentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.templateId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.templateId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : templateId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEMPLATE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.emailTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.emailTitle || appValidatorObject.isStringEmpty(crisisCommunicationData.emailTitle)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : emailTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.emailContent || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.emailContent || appValidatorObject.isStringEmpty(crisisCommunicationData.emailContent)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : emailContent is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_CONTENT_NULL_EMPTY));
            }
            if (crisisCommunicationData.recipentId != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.recipentsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.recipentsData )) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : createCrisisMessage : Execution end. : recipentsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RECIPENTS_DATA_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const CREATE_CRISIS_DB_RESPONSE = await crisisCommunicationDB.createCrisisMessage(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == CREATE_CRISIS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == CREATE_CRISIS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : createCrisisMessage : Execution end. :  CREATE_CRISIS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (CREATE_CRISIS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : createCrisisMessage : Execution end. : Error details :' + CREATE_CRISIS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (CREATE_CRISIS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && CREATE_CRISIS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : createCrisisMessage : Execution end. : Error details : ' + CREATE_CRISIS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_CREATE_CRISIS_DATA = await getFormatCrisisCommunicationsList(userIdFromToken,userNameFromToken, CREATE_CRISIS_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_CREATE_CRISIS_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_CREATE_CRISIS_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : createCrisisMessage : Execution end. :  FORMAT_CREATE_CRISIS_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_CREATE_CRISIS_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : createCrisisMessage : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will update crisis message 
    */
    async updateCrisisMessage(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let crisisCommunicationData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            crisisCommunicationData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : crisisCommunicationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : updateCrisisMessage : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.communicationId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.communicationId ) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : communicationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMUNICATION_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.communicationTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.communicationTitle || appValidatorObject.isStringEmpty(crisisCommunicationData.communicationTitle)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : communicationTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMUNICATION_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.recipentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.recipentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : recipentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RECIPENT_TYPE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.categoryId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.categoryId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : categoryId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CATEGORY_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.incidentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.incidentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : incidentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.templateId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.templateId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : templateId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEMPLATE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.emailTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.emailTitle || appValidatorObject.isStringEmpty(crisisCommunicationData.emailTitle)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : emailTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.emailContent || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.emailContent || appValidatorObject.isStringEmpty(crisisCommunicationData.emailContent)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : emailContent is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_CONTENT_NULL_EMPTY));
            }
            if (crisisCommunicationData.recipentId != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.recipentsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.recipentsData )) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : recipentsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RECIPENTS_DATA_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             * 
             */

            const UPDATE_CRISIS_DB_RESPONSE = await crisisCommunicationDB.createCrisisMessage(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_CRISIS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_CRISIS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : updateCrisisMessage : Execution end. :  UPDATE_CRISIS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_CRISIS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : Error details :' + UPDATE_CRISIS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_CRISIS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_CRISIS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : Error details : ' + UPDATE_CRISIS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_CREATE_CRISIS_DATA = await getFormatCrisisCommunicationsList(userIdFromToken,userNameFromToken, UPDATE_CRISIS_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_CREATE_CRISIS_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_CREATE_CRISIS_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : updateCrisisMessage : Execution end. :  FORMAT_CREATE_CRISIS_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_CREATE_CRISIS_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : updateCrisisMessage : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the crisis communication details of particular id  from the dataBase 
    */
      async getCrisisCommunicationData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let crisisCommunicationData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            crisisCommunicationData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : crisisCommunicationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.communicationIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.communicationIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : communicationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMUNICATION_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             * 
             */

            const GET_COMMUNICATION_DB_RESPONSE = await crisisCommunicationDB.getCrisisCommunicationData(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_COMMUNICATION_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_COMMUNICATION_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. :  GET_COMMUNICATION_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_COMMUNICATION_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : Error details :' + GET_COMMUNICATION_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_COMMUNICATION_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_COMMUNICATION_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : Error details : ' + GET_COMMUNICATION_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const GET_INFO_DB_RESPONSE = await crisisCommunicationDB.getCreateCrisisMessageInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. :  GET_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : Error details :' + GET_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : Error details : ' + GET_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_COMMUNICATION_DATA = await getFormatCrisisCommunicationData(userIdFromToken, GET_COMMUNICATION_DB_RESPONSE,GET_INFO_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_COMMUNICATION_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_COMMUNICATION_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. :  FORMAT_COMMUNICATION_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_COMMUNICATION_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getCrisisCommunicationData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    

     /**
     * This function to upload crisis attachments
     */

     async uploadCrisisAttachment(request, response) {

        let refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let crisisCommunicationData = {
            OriginalFileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileName            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileType            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            FileContent         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken      = request.body.refreshedToken;
        userIdFromToken     = request.body.userIdFromToken;
        userNameFromToken   = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution started.');
            // check request body should not be undefined
            if (typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Request body has not found');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            let allowedExtensions               = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER;
            let allowedExtensionsFile           = APP_CONFIG_FILE_OBJ.REMEDIATION_TRACKER_FILE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST;
            let filePath                        = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.ATTACHMENTS_DESTINATION_PATH;
            let fileMimeType                    = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.ATTACHMENTS_FILE_MIME_TYPES;
            let limits                          = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.FILE_SIZE * CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_MEGABYTE;
            let destinationPath                 = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.ATTACHMENTS_DESTINATION_PATH_SERVER;
            let uploadFileExtension             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueFileName                  = Date.now() +"_"+ request.files.file.name; 
            let fileSize                        = request.files.file.size;
            let lastIndex                       = uniqueFileName.lastIndexOf('.');
            uploadFileExtension                 = uniqueFileName.substr(lastIndex, uniqueFileName.length - 1).toLowerCase();
            crisisCommunicationData.OriginalFileName        = request.files.file.name;         
            crisisCommunicationData.FileType                = uploadFileExtension;
            crisisCommunicationData.FileContent             = request.files.file.data;
            const mimeType                                  = await FILE_TYPE.fromBuffer(crisisCommunicationData.FileContent);
            const localFilePath                             = path.join(__dirname, '..','..','file-upload', 'crisis-management', 'attachments', 'temp');

            if (/^[a-zA-Z0-9\s_\-()./]*$/.test(request.files.file.name)) {
                crisisCommunicationData.FileName                = Date.now() +"_"+ request.files.file.name;   
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Error Details : File name should not have special characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_NAME_IS_NOT_VALID));
            }
            // Validating file Size
            if (fileSize > limits) {                    
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Error Details : File size has exceeded the allowed limit');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_SIZE_EXCEED + APP_CONFIG_FILE_OBJ.FILE_UPLOAD.FILE_SIZE ));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : mimeType : ' + JSON.stringify(mimeType));

            if (mimeType.ext == 'exe') {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

            if (mimeType != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) {
                // Validating file extension
                if (!(allowedExtensions.includes((mimeType.ext)))  || !allowedExtensionsFile.includes(crisisCommunicationData.FileType)) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));
                }               
                
                // Validating file Mimetype
                if (!(fileMimeType.includes(mimeType.mime))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));                    
                }                
                const fileUploadedResponse = await utilityObject.uploadFileToRemoteServer(userIdFromToken, crisisCommunicationData.FileContent, destinationPath, request.files.file.name, crisisCommunicationData.FileType, localFilePath);     

                if (fileUploadedResponse.uploadFileResponse) { 
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : File dumped into SFTP server successfully in the path : ' + destinationPath);

                    const GET_CRISIS_ATTACHMENT_DB_RESPONSE = await crisisCommunicationDB.uploadCrisisAttachment(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken);

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_CRISIS_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_CRISIS_ATTACHMENT_DB_RESPONSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. :  GET_CRISIS_ATTACHMENT_DB_RESPONSE is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_CRISIS_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Error details :' + GET_CRISIS_ATTACHMENT_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_CRISIS_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_CRISIS_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Error details : ' + GET_CRISIS_ATTACHMENT_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    
                
                    const FORMAT_CRISIS_ATTACHMENT_DATA = await getFormatCrisisAttachmentData(userIdFromToken,GET_CRISIS_ATTACHMENT_DB_RESPONSE, accountGUIDFromToken);
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_CRISIS_ATTACHMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_CRISIS_ATTACHMENT_DATA) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. :  FORMAT_CRISIS_ATTACHMENT_DATA response is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Crisis Attachment uploaded successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_CRISIS_ATTACHMENT_DATA));
                
                } else if(fileUploadedResponse.uploadFileResponse === false && fileUploadedResponse.SFTPConnection === true){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Uploaded file is malicious ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
                } else {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Failed to connect to sftp server ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL_SFTP));
                }    
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : uploadCrisisAttachment : Execution end. : Got unhandled error : Error Detail : ' + error)
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));

        }
    }

     /** 
    * This function will download crisis attachment of particular attachmentid  from the dataBase 
    */
     async downloadCrisisAttachment(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let crisisCommunicationData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            crisisCommunicationData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. : crisisCommunicationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : downloadCrisisAttachment : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.attachmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.attachmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. : attachmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const GET_DOWNLOAD_RESPONSE = await crisisCommunicationDB.downloadCrisisAttachment(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. :  GET_DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. : Error details :' + GET_DOWNLOAD_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DOWNLOAD_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. : Error details : ' + GET_DOWNLOAD_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_DOWNLOAD_RESPONSE = await getFormatDownloadAttachment(userIdFromToken, GET_DOWNLOAD_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. :  FORMAT_DOWNLOAD_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, FORMAT_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : downloadCrisisAttachment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }

     /** 
    * This function will download crisis attachment of particular attachmentid  from the dataBase 
    */
     async sendCrisisCommunication(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let crisisCommunicationData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        accountNameFromToken        = request.body.accountNameFromToken;
        try {

            crisisCommunicationData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. : crisisCommunicationData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommunicationData.communicationId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommunicationData.communicationId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. : communicationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMUNICATION_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             * 
             */

            const GET_PUBLISH_CRISIS_RESPONSE =  await crisisCommunicationDB.sendCrisisCommunication(userIdFromToken, userNameFromToken,crisisCommunicationData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : GET_PUBLISH_CRISIS_RESPONSE   : ' + JSON.stringify(GET_PUBLISH_CRISIS_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_PUBLISH_CRISIS_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_PUBLISH_CRISIS_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. :  GET_PUBLISH_CRISIS_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_PUBLISH_CRISIS_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. : Error details :' + GET_PUBLISH_CRISIS_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_PUBLISH_CRISIS_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_PUBLISH_CRISIS_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. : Error details : ' + GET_PUBLISH_CRISIS_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_COMMUNICATION_DATA = await getFormatSendCommunications(userIdFromToken, GET_PUBLISH_CRISIS_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_COMMUNICATION_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_COMMUNICATION_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. :  FORMAT_COMMUNICATION_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }          

            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : FORMAT_COMMUNICATION_DATA :'+ JSON.stringify(FORMAT_COMMUNICATION_DATA));

            // Email Logic (Send Communication) : Start
            if (FORMAT_COMMUNICATION_DATA.CrisisData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                let CrisisEmailData = FORMAT_COMMUNICATION_DATA.CrisisData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                if(CrisisEmailData.Recipents.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    for(let recObj of Object.values(CrisisEmailData.Recipents)){
                        try {                    
                            let emailTemplateObj = {
                                Subject : CrisisEmailData.EmailTitle,
                                Body    : CrisisEmailData.EmailContent
                            };
                            let toccEmails = {
                                "TOEmail"   : recObj.email,
                                "CCEmail"   : (FORMAT_COMMUNICATION_DATA.CCList).join(",")
                            };
                            let attachment = FORMAT_COMMUNICATION_DATA.Attachments;
                            let templateMaster = {    
                                communication_title	: CrisisEmailData.CommunicationTitle,
                                incident_code	    : CrisisEmailData.IncidentCode,
                                incident_title	    : CrisisEmailData.Incident,
                                action_link	        : `<a href="${CrisisEmailData.ActionLinkURL}" style="font-weight:bold; color: #5068c5;">${CrisisEmailData.ActionLink}</a>`,
                                recipient_name      : recObj.name,
                                // recipient_org       : APP_CONFIG_FILE_OBJ.CLIENT_NAME_CONFIG.CLIENT_NAME
                                recipient_org       : accountNameFromToken
                            };
        
                            let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,attachment);
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : emailData   : ' + JSON.stringify(emailData || null));
                            
                            //InApp alert starts
                            let inAppMessage     = `A crisis communication regarding - "${CrisisEmailData.CommunicationTitle}" has been delivered successfully.`;
                            let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(FORMAT_COMMUNICATION_DATA.InAppUserGUIDs.join(','))
                            let inappDetails     = {
                                inAppContent     : inAppMessage + "link: " + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].CrisisRoute,
                                recepientUserID  : inAppUserList,
                                subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].SubModuleID
                            }
                
                            let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                            //InApp alert end   

                        } catch(error) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                        }
                    }    
                }                
            }
            // Email Logic (Send Communication) : End
  
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, []));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : sendCrisisCommunication : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }


    stop() {} 
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


async function getFormatCrisisCommunicationsList(userIdFromToken,userNameFromToken,crisisCommunicationsList, accountGUIDFromToken){
    let commsList               = [];
    let bcManagersList          = [];
    let fbccUsersList           = [];
    let siteBccUsersList        = []

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Execution start.'+ JSON.stringify(crisisCommunicationsList.recordset)); 

        // Result Set 1: Crisis Communication List
        if(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let crisisObj of Object.values(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                if(crisisObj.IsActive){

                    //formating crisis attachments
                    let crisisAttachments = [];
                    if(crisisObj.CommunicationEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        for(let evObj of Object.values(JSON.parse(crisisObj.CommunicationEvidences))){
                            crisisAttachments.push({
                                "AttachmentID"      : evObj.EvidenceID,
                                "AttachmentName"    : evObj.OriginalFileName,
                                "CreatedDate"       : evObj.CreatedDate,
                                "AttachmentType"    : evObj.FileType,
                                "FileContentID"     : evObj.FileContentID,
                                "IsVisible"         : evObj.IsVisible
                                
                            })
                        }
                    }

                    commsList.push({
                        "CommunicationID"           : crisisObj.CommunicationID,
                        "CommunicationCode"         : crisisObj.Code,
                        "CommunicationTitle"        : crisisObj.Title,
                        "CrisisCategoryID"          : crisisObj.CrisisCategoryID,
                        "CrisisCategory"            : crisisObj.CrisisCategory,
                        "CommunicationIssueDate"    : crisisObj.CreatedDate,
                        "RecipentOptionID"          : crisisObj.RecipientTypeID,
                        "RecipentOption"            : crisisObj.RecipientType,
                        "Sites"                     : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO || crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) ? JSON.parse(crisisObj.CommunicationRecipients|| []).map(ele =>({"SiteID":ele.SiteID,"SiteName":ele.Sites})) : [],
                        "BussinessFunctions"        : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) ? JSON.parse(crisisObj.CommunicationRecipients || []).map(ele => ({"BusinessFunctionsID": ele.BusinessFunctionsID, "BusinessFunctionsName":ele.BusinessFunctions})) : [],
                        "FBCCsAndFBCTs"             : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? JSON.parse(crisisObj.CommunicationRecipients || []).map(ele =>({ "UserGUID": ele.UserGUID, "UserName": ele.UserName })) : [],
                        "Attachments"               : crisisAttachments,
                        "IsAttachmentsAvailable"    : crisisAttachments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Status"                    : crisisObj.Status,
                        "StatusID"                  : crisisObj.StatusID,
                        "Incident"                  : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.Incident).join(", ") : '',
                        "IncidentID"                : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.IncidentID).join(", ") : '',
                        "EmailTemplateID"           : crisisObj.TemplateID,
                        "EmailTemplateName"         : crisisObj.EmailTemplate,
                        "EmailTitle"                : crisisObj.EmailTitle,
                        "EmailContent"              : crisisObj.EmailContent,
                        "CreatedBy"                 : await getUserName(userIdFromToken,crisisObj.CreatedBy)
                    })
                }
            }
        }


        // Result Set 2 : BC Managers List
        if(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcmObj of Object.values(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                bcManagersList.push({
                    "AdminGUID"   : bcmObj.AdminGUID,
                    "AdminName"   : bcmObj.AdminName,
                })
            }
        }

        // Result Set 3 : FBCC Users List
        if(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let fbccObj of Object.values(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                fbccUsersList.push({
                    "FBCCUserGUID"   : fbccObj.FBCCID,
                    "FBCCUserName"   : fbccObj.FBCCUSER,
                })

            }
        }

        // Result Set 3 : Site BCC Users List
        if(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteBccObj of Object.values(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                siteBccUsersList.push({
                    "SiteBCChampionGUID"        : siteBccObj.BCChampionGUID,
                    "SiteBCChampionUserName"    : siteBccObj.BCChampionName,
                })

            }
        }

        let steeringCommitteeUsers  = crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
  

        /**
         * filter the crisis communicaitons list based on Users logged-in : Start
         */

        // Case : Logged-in User is steeringCommitteeUsers (filtering only published crisis messages)
        if(steeringCommitteeUsers.some(ele => ele.UserGUID == userIdFromToken)){
            commsList = commsList.filter(ele => ele.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO);
        }

        // Case : Logged-in User is FBCC
        if(fbccUsersList.some(ele =>ele.FBCCUserGUID == userIdFromToken)){ 
            commsList = commsList.filter(ele => ele.CreatedBy == userNameFromToken);
        }
        // Case : BCManagers and other Users
        else{
            commsList = commsList;
        } 

         /**
         * filter the crisis communicaitons list based on Users logged-in : End
         */

        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Execution end.'); 

        //Formating the final resultset
        return {
            "CrisisCommunicationsListDetails"   : commsList,
            "BCManagersList"                    : bcManagersList,
            "FBCCUsersList"                     : fbccUsersList,
            "SiteBCCUsersList"                  : siteBccUsersList  
        }
    } catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

async function getFormatCreateCrisisInfoData(userIdFromToken,createCrisisInfoList, accountGUIDFromToken){
    recipentOptionList  = [];
    statusList          = [];
    categoryList        = [];
    fbccUsersList       = [];
    bussinessFuncList   = [];
    sitesList           = [];
    templateList        = [];
    incidentList        = [];
    attachmentConfig    = [];
    userRole            = '';

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCreateCrisisInfoData : Execution start.'); 

        // Result Set 1: Recipent Options List
        if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let recOptObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                recipentOptionList.push({
                    "RecipentOptionID"    : recOptObj.RecipientTypeID,
                    "RecipentOption"      : recOptObj.Name
                })
            }
        }

        // Result Set 2: Crisis Status List
        if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let statusObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                statusList.push({
                    "StatusID"  : statusObj.StatusID,
                    "Status"    : statusObj.Name
                })
            }
        }

        // Result Set 3: crisis category List
        if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let crisiCatObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                if(crisiCatObj.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                    categoryList.push({
                        "CrisisCategoryID"  : crisiCatObj.ID,
                        "CrisisCategory"    : crisiCatObj.NAME
                    })
                }
            }
        }

        // Find the Role of Logged-in User :Start
        let FBCCs       = createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let SiteBCCs    = createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        let BCManagers  = createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
       
        if(FBCCs.some(ele=> ele.FBCCID == userIdFromToken)){
            userRole = 'FBCC User';
        }else if(SiteBCCs.some(ele=> ele.BCChampionGUID == userIdFromToken)){
            userRole = 'Site BCC';
        }else if(BCManagers.some(ele=> ele.AdminGUID == userIdFromToken)){
            userRole = 'BC Manager'
        }
        // Find the Role of Logged-in User :End

        // Result Set 4 : FBCC Users List
        if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let userObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                fbccUsersList.push({
                    "UserGUID"    : userObj.FBCCID,
					"UserName"    : userObj.FBCCUSER
                })
            }
        }

         // Result Set 5 : Business Functions List & Result Set 6 : Site List
         if(userRole == 'Site BCC'){
            for(let bussObj of Object.values(SiteBCCs)){
                if(bussObj.BCChampionGUID == userIdFromToken){
                    if(bussObj.BusinessFunctionsID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        bussinessFuncList.push({
                            "BusinessFunctionsID"   : bussObj.BusinessFunctionsID,
                            "BusinessFunctionsName" : bussObj.BusinessFunction,
                        })
                    }
                    sitesList.push({
                        "SiteID"    : bussObj.SiteID,
                        "SiteName"  : bussObj.SiteName,
                    })
                }
            }
         }else  if(userRole == 'FBCC User'){
            for(let bussObj of Object.values(FBCCs)){
                if(bussObj.FBCCID == userIdFromToken){
                    if(bussObj.BusinessFunctionsID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        bussinessFuncList.push({
                            "BusinessFunctionsID"       : bussObj.BusinessFunctionsID,
                            "BusinessFunctionsName"     : bussObj.Name,
                        }) 
                    }
                    sitesList.push({
                        "SiteID"    : bussObj.SiteID,
                        "SiteName"  : bussObj.SiteName,
                    })
                }
            }
         }else  if(userRole == 'BC Manager'){
            if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
                for(let bussObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])){
                    if(bussObj.BusinessFunctionsID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        bussinessFuncList.push({
                            "BusinessFunctionsID"   : bussObj.BusinessFunctionsID,
                            "BusinessFunctionsName"   : bussObj.Name,
                        })
                    }
                }
            }

            if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
                for(let siteObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])){
                    sitesList.push({
                        "SiteID"   : siteObj.SiteID,
                        "SiteName"   : siteObj.Name,
                    })
                }
            }
         }

      

        // Result Set 7 : email templates List
        if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let tempObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])){
                templateList.push({
                    "EmailTemplateID"   : tempObj.EmailTemplateID,
                    "EmailTemplateName" : tempObj.TemplateName,
                    "EmailTitle"        : tempObj.EmailTitle,
                    "EmailContent"      : tempObj.emailContent
                })
            }
        }

        // Result Set 8 : Incidents List
        if(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] &&  createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let incObj of Object.values(createCrisisInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN])){
                //filter only closed incidents
                if(incObj.StatusID != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                    incidentList.push({
                        "IncidentID"                    : incObj.IncidentID,
                        "Incident"                      : incObj.Title,
                        "IncidentCode"                  : incObj.Code,
                        "AssociatedSites"               : incObj.IncidentSites ? JSON.parse(incObj.IncidentSites) : [],
                        "AssociatedBusinessFuncitons"   : incObj.IncidentBusinessFunctions ? JSON.parse(incObj.IncidentBusinessFunctions) : []
                    })
                }
            }
        }

        // file upload configuration
        attachmentConfig.push({
            "FileSize"          : APP_CONFIG_FILE_OBJ.FILE_UPLOAD.FILE_SIZE,
            "FileExtensions"    : APP_CONFIG_FILE_OBJ.FILE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST
        })
        
        
        //filter unique business functions
        bussinessFuncList = bussinessFuncList.filter((value, index, self) =>
            index === self.findIndex((t) => (t.BusinessFunctionsID === value.BusinessFunctionsID)
        ));

        //filter unique sites
        sitesList = sitesList.filter((value, index, self) =>
            index === self.findIndex((t) => (t.SiteID === value.SiteID)
        ));

        //filter unique Business Owners
        fbccUsersList = fbccUsersList.filter((value, index, self) =>
            index === self.findIndex((t) => (t.UserGUID === value.UserGUID)
        ));


        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCreateCrisisInfoData : Execution end.'); 

        //formating final resultset
        return {
            "IncidentsList"             : incidentList,
            "EmailTemplatesList"        : templateList,
            "SitesList"                 : sitesList,
            "BusinessFunctionsList"     : bussinessFuncList,
            "FBCCAndFBCTs"              : fbccUsersList,
            "CrisisCatergoryList"       : categoryList,
            "RecipentsOptionList"       : recipentOptionList,
            "CrisisStatusList"          : statusList,
            "AttachmentConfiguration"   : attachmentConfig
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCreateCrisisInfoData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


async function getFormatCrisisCommunicationData(userIdFromToken, crisisCominicationData,createCrisisInfoList){
    commsList   = [];
    masters     = [];


    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationData : Execution start.'); 

        // Result Set 1: Crisis Coommunication List
        if(crisisCominicationData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  crisisCominicationData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let crisisObj of Object.values(crisisCominicationData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                if(crisisObj.IsActive){
                    //formating crisis attachments
                    let crisisAttachments = [];
                    if(crisisObj.CommunicationEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        for(let evObj of Object.values(JSON.parse(crisisObj.CommunicationEvidences))){
                            crisisAttachments.push({
                                "AttachmentID"      : evObj.EvidenceID,
                                "AttachmentName"    : evObj.OriginalFileName,
                                "CreatedDate"       : evObj.CreatedDate,
                                "AttachmentType"    : evObj.FileType,
                                "FileContentID"     : evObj.FileContentID,
                                "IsVisible"         : evObj.IsVisible
                                
                            })
                        }
                    }

                    let recipents = crisisObj.CommunicationRecipients != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(crisisObj.CommunicationRecipients) : [];
                    commsList.push({
                        "CommunicationID"           : crisisObj.CommunicationID,
                        "CommunicationCode"         : crisisObj.Code,
                        "CommunicationTitle"        : crisisObj.Title,
                        "CrisisCategoryID"          : crisisObj.CrisisCategoryID,
                        "CrisisCategory"            : crisisObj.CrisisCategory,
                        "CommunicationIssueDate"    : crisisObj.CreatedDate,
                        "RecipentOptionID"          : crisisObj.RecipientTypeID,
                        "RecipentOption"            : crisisObj.RecipientType,
                        "Sites"                     : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO || crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) ? (recipents || []).map(ele =>({"SiteID":ele.SiteID,"SiteName":ele.Sites})) : [],
                        "BussinessFunctions"        : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) ? (recipents || []).map(ele => ({"BusinessFunctionsID": ele.BusinessFunctionsID, "BusinessFunctionsName":ele.BusinessFunctions})) : [],
                        "FBCCsAndFBCTs"             : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? (recipents || []).map(ele =>({ "UserGUID": ele.UserGUID, "UserName": ele.UserName })) : [],
                        "Attachments"               : crisisAttachments,
                        "IsAttachmentsAvailable"    : crisisAttachments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                        "Status"                    : crisisObj.Status,
                        "StatusID"                  : crisisObj.StatusID,
                        "Incident"                  : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.Incident).join(",") : '',
                        "IncidentID"                : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.IncidentID).join(",") : '',
                        "EmailTemplateID"           : crisisObj.TemplateID,
                        "EmailTemplateName"         : crisisObj.EmailTemplate,
                        "EmailTitle"                : crisisObj.EmailTitle,
                        "EmailContent"              : crisisObj.EmailContent
                    })
                }
            }
        }

        // Result set 2 : Master list
        masters = await getFormatCreateCrisisInfoData(userIdFromToken,createCrisisInfoList);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationData : Execution end.'); 

        // forming final resultset
        return {
            "CrisisCommunicationsListDetails"   : commsList,
            "MasterList"                        : masters
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatCrisisAttachmentData(userIdFromToken,crisisAttachmentsResponse, accountGUIDFromToken){
    crisisAttachments = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisAttachmentData : Execution start.'); 

        // Result Set 1: Uploaded evidence list
        if(crisisAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  crisisAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let evObj of Object.values(crisisAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                crisisAttachments.push({
                    "AttachmentID"      : evObj.EvidenceID,
                    "AttachmentName"    : evObj.OriginalFileName,
                    "AttachmentType"    : evObj.FileType,
                    "FileContentID"     : evObj.FileContentID,
                    "CreatedDate"       : evObj.CreatedDate,
                    "CreatedBy"         : evObj.CreatedBy
                    
                })
            }
        }
        
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisAttachmentData : Execution end.'); 

        //Forming the final resultset
        return {
            "attachmentDetails" : crisisAttachments
        }


    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisAttachmentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


async function getFormatDownloadAttachment(userIdFromToken,crisisAttachmentsResponse, accountGUIDFromToken){
    let crisisAttachments = [];
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatDownloadAttachment : Execution start.'+ crisisAttachmentsResponse); 

           // Result Set 1: Uploaded evidence list 
           if(crisisAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  crisisAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let evObj of Object.values(crisisAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                crisisAttachments.push({
                    "AttachmentID"      : evObj.EvidenceID,
                    "CommunicationID"   : evObj.CommunicationID,
                    "AttachmentName"    : evObj.OriginalFileName,
                    "CreatedDate"       : evObj.CreatedDate,
                    "AttachmentType"    : evObj.FileType,
                    "FileContent"       : evObj.Content,
                    "IsVisible"         : evObj.IsVisible,
                    "CreatedBy"         : evObj.CreatedBy
                    
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatDownloadAttachment : Execution end.'); 
        return {
            "attachmentDetails" : crisisAttachments
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatDownloadAttachment : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatSendCommunications(userIdFromToken,crisisCommunicationsList, accountGUIDFromToken){
    let commsList           = [];
    let attachmentsData     = [];
    let fbccUsers           = [];
    let bcmanagers          = [];
    let steeringCommittee   = [];
    let SBCCsSHAs           = [];
    let emailList           = {}

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Execution start.'); 

        fbccUsers           = crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        steeringCommittee   = crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        SBCCsSHAs           = crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        bcmanagers          = crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let siteFBCCs       = crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        
        // Result Set 2: Crisis attachments List
        if(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let evObj of Object.values(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
              
                const directory = path.join(__dirname, 'file-upload', 'crisis-management', 'attachments', 'temp');
                if (!fileSystem.existsSync(directory)) {
                    try {
                        fileSystem.mkdirSync(directory, { recursive: true });
                    } catch (error) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : failed to create the path'+ error);
                        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    }
                } 

                const filename = evObj.OriginalFileName;
                const fileContent = Buffer.from(evObj.Content);

                try {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Saving File To Directory :  Execution start.'); 
                   
                    const filePath = await saveFileToDirectory(userIdFromToken,fileContent, filename, directory);
                    if(filePath != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        attachmentsData.push({ filename:filename, path: filePath });
                    }
                    else{
                        attachmentsData = [];
                    }

                } catch (error) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Saving File To Directory :  Execution start.'+ error);
                    return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                } 
               
            }
        }

        // Result Set 1: Crisis Coommunication List
        if(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let crisisObj of Object.values(crisisCommunicationsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                if(crisisObj.IsActive){
                    //Fetching recipents and CC list for send communication
                    emailList = await fetchUniqueRecipientsNCCList(userIdFromToken, crisisObj, fbccUsers, siteFBCCs, bcmanagers, steeringCommittee, SBCCsSHAs);
                    
                    commsList.push({
                        "CommunicationID"           : crisisObj.CommunicationID,
                        "CommunicationCode"         : crisisObj.Code,
                        "CommunicationTitle"        : crisisObj.Title,
                        "CrisisCategoryID"          : crisisObj.CrisisCategoryID,
                        "CrisisCategory"            : crisisObj.CrisisCategory,
                        "CommunicationIssueDate"    : crisisObj.CreatedDate,
                        "RecipentOptionID"          : crisisObj.RecipientTypeID,
                        "RecipentOption"            : crisisObj.RecipientType,
                        "Sites"                     : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO || crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) ? JSON.parse(crisisObj.CommunicationRecipients || []).map(ele =>({"SiteID":ele.SiteID,"SiteName":ele.Sites})) : [],
                        "BussinessFunctions"        : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) ? JSON.parse(crisisObj.CommunicationRecipients || []).map(ele => ({"BusinessFunctionsID": ele.BusinessFunctionsID, "BusinessFunctionsName":ele.BusinessFunctions})) : [],
                        "FBCCsAndFBCTs"             : (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) ? JSON.parse(crisisObj.CommunicationRecipients || []).map(ele =>({ "UserGUID": ele.UserGUID, "UserName": ele.UserName })) : [],
                        "Status"                    : crisisObj.Status,
                        "StatusID"                  : crisisObj.StatusID,
                        "Incident"                  : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.Incident).join(", ") : '',
                        "IncidentID"                : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.IncidentID).join(", ") : '',
                        "IncidentCode"              : crisisObj.CommunicationIncidents != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(crisisObj.CommunicationIncidents).map(ele=>ele.IncidentCode).join(", ") : '',
                        "EmailTemplateID"           : crisisObj.TemplateID,
                        "EmailTemplateName"         : crisisObj.EmailTemplate,
                        "EmailTitle"                : crisisObj.EmailTitle,
                        "EmailContent"              : crisisObj.EmailContent,
                        "ActionLinkID"              : crisisObj.ActionLinkID,
                        "ActionLink"                : crisisObj.ActionLink,
                        "ActionLinkURL"             : crisisObj.ActionLinkURL,
                        "Recipents"                 : emailList.uniqueRecipientsArray
                    })
                }
            }
        }

        const combinedUsersList = Array.from(new Set([
            ...(SBCCsSHAs || []).map(n => n.UserGUID),
            ...(bcmanagers || []).map(n => n.AdminGUID),
            ...(fbccUsers || []).map(n => n.FBCCID)
        ]));

          
        const uniqueCCMailList = emailList.uniqueCCEmailsArray;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Execution end.'); 
        
        //Formating the final resultset
        return {
            "CrisisData"        : commsList,
            "Attachments"       : attachmentsData,
            "CCList"            : uniqueCCMailList,
            "InAppUserGUIDs"    : combinedUsersList
        }
    } catch(error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommunicationBL : getFormatCrisisCommunicationsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

async function fetchUniqueRecipientsNCCList(userIdFromToken, crisisObj, fbccs, siteFBCCs,bcmanagers,steeringCommittee,SBCCsSHAs) {
    let uniqueRecipientsArray       = [];
    let uniqueBCMEmailsArray        = [];
    let uniqueSCEmailsArray         = [];
    let uniqueSBCCsSHAsEmailArray   = [];

    try {
        logger.log('info', 'User Id: ' + userIdFromToken + ' : CrisisCommunicationBL : fetchUniqueRecipientsNCCList : Execution start.');

        if ((fbccs && fbccs.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) || (siteFBCCs && siteFBCCs.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ) {
            const uniqueRecipientsSet = new Set();

            if ((crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO || crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR)) {
                // Case: Custom List of Sites and All Business Functions at specific site
                const siteIDs = JSON.parse(crisisObj.CommunicationRecipients || []).map(ele => ele.SiteID);
                siteFBCCs.forEach(item =>{
                    let recipient = {};
                    if (siteIDs.includes(Number(item.SiteID))) {
                        recipient = { name: item.FBCCUSER, email: item.EmailID };
                        uniqueRecipientsSet.add(JSON.stringify(recipient));
                    }
                })
                const uniqueEmails = new Set();
                SBCCsSHAs.forEach(item =>{
                    if (siteIDs.includes(Number(item.SiteID))) {
                        uniqueEmails.add(item.EmailID);
                    }
                })
                uniqueSBCCsSHAsEmailArray = Array.from(uniqueEmails);
            } else if (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
                //Case : Custom List of Bussiness Functions
                const busFuncIDs = JSON.parse(crisisObj.CommunicationRecipients || []).map(ele => ele.BusinessFunctionsID);
                fbccs.forEach(item => {
                    let recipient = {};
                    if (busFuncIDs.includes(Number(item.BusinessFunctionsID))) {
                        recipient = { name: item.FBCCUSER, email: item.EmailID };
                        uniqueRecipientsSet.add(JSON.stringify(recipient));
                    }
                });
            } else if (crisisObj.RecipientTypeID == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) { 
                //Case : Custom list of Recipients
                const FBCCIDs = JSON.parse(crisisObj.CommunicationRecipients || []).map(ele => ele.UserGUID);
                fbccs.forEach(item => {
                    let recipient = {};
                    if (FBCCIDs.includes(item.FBCCID)) {
                        recipient = { name: item.FBCCUSER, email: item.EmailID };
                        uniqueRecipientsSet.add(JSON.stringify(recipient));
                    }
                });
            } else { 
                //Case : All Business Functions
                fbccs.forEach(item => {
                    let recipient = {};
                    recipient = { name: item.FBCCUSER, email: item.EmailID };
                    uniqueRecipientsSet.add(JSON.stringify(recipient));
                });
                }

            uniqueRecipientsArray = Array.from(uniqueRecipientsSet).map(recipient => JSON.parse(recipient));
        }
     

        if(bcmanagers && bcmanagers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            const uniqueEmails = new Set();
            bcmanagers.forEach(item => {
                uniqueEmails.add(item.EmailID);
            });
            uniqueBCMEmailsArray = Array.from(uniqueEmails);
        }  
        
        if(steeringCommittee && steeringCommittee.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            const uniqueEmails = new Set();
            steeringCommittee.forEach(item => {
                uniqueEmails.add(item.EmailID);
            });
            uniqueSCEmailsArray = Array.from(uniqueEmails);
        }  
        
        //CC List : BCManagers,Steering Committee Users and Site Admin/BCC Users 
        const combinedEmailsArray = [...uniqueBCMEmailsArray, ...uniqueSCEmailsArray,...uniqueSBCCsSHAsEmailArray];
        const uniqueCombinedEmails = new Set(combinedEmailsArray);
        const uniqueCCEmailsArray = Array.from(uniqueCombinedEmails);

        logger.log('info', 'User Id: ' + userIdFromToken + ' : CrisisCommunicationBL : fetchUniqueRecipientsNCCList : Execution end.');
        return {
           "uniqueRecipientsArray"  : uniqueRecipientsArray,
           "uniqueCCEmailsArray"    : uniqueCCEmailsArray
        };

    } catch (error) {
        logger.log('info', 'User Id: ' + userIdFromToken + ' : CrisisCommunicationBL : fetchUniqueRecipientsNCCList : Execution end. ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


 /**
 * This Function to save file to specified directory
 * @param {*} fileContent
 * @param {*} fileName
 * @param {*} directory
 */
 async function saveFileToDirectory(userIdFromToken,fileContent, fileName, directory) {

    
    const filePath = path.join(directory, fileName);

    logger.log('info', 'User Id : '+ userIdFromToken +': saveFileToDirectory : Execution start.');
    try {
        await fileSystem.writeFileSync(filePath, fileContent);
        logger.log('info', 'User Id: ' + userIdFromToken + ': File saved successfully: ' + filePath);
        return filePath;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +': saveFileToDirectory : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


async function getUserName(userIdFromToken,String){
    logger.log('info', 'User Id : '+ userIdFromToken +': getUserName : Execution start.');
    try {

    // Find the position of the last hyphen
	let lastIndex = String.lastIndexOf('-');
	
	// Split the string at the last hyphen
	let userName    = String.substring(0, lastIndex);
	let domainName  = String.substring(lastIndex + 1);
    
	return userName;

    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +': getUserName : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


/**
* This is function will be used to return single instance of class.
*/
function getCrisisCommunicationBLClassInstance() {
    if (CrisisCommunicationBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        CrisisCommunicationBLClassInstance = new CrisisCommunicationBL();
    }
    return CrisisCommunicationBLClassInstance;
}

exports.getCrisisCommunicationBLClassInstance = getCrisisCommunicationBLClassInstance;
