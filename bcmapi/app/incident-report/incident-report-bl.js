const MESSAGE_FILE_OBJ          = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ         = require("../../utility/constants/constant.js");
const APP_VALIDATOR             = require("../../utility/app-validator.js");
const ENUMS_OBJ                 = require("../../utility/enums/enums.js")
const INCIDENT_REPORT_DB        = require("../../data-access/incident-report-db.js");
const { logger }                = require("../../utility/log-manager/log-manager.js");
const APP_CONFIG_FILE_OBJ       = require('../../config/app-config.js');
const INC_NOTIFY_TEMPLATE       = require('../../config/email-template/generic-incident-notify-template.js');
const EMAIL_NOTIFICATION        = require("../../utility/email-notification.js");
const UtilityApp                = require("../../utility/utility.js");
const INAPP_DB                  = require("../../data-access/inApp-notification-db.js");
const FILE_TYPE                 = require('file-type');
const path                      = require('path');
const fileSystem                = require('fs');

var IncidentReportBLClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var incidentReportDB              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailNotificationObject       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class IncidentReportBl {
    constructor() {
        incidentReportDB            = new INCIDENT_REPORT_DB();
        appValidatorObject          = new APP_VALIDATOR();
        utilityAppObject            = new UtilityApp();
        emailNotificationObject     = new EMAIL_NOTIFICATION();
        inAppNotificationDbObject   = new INAPP_DB();
    }

    start() { }

    /** 
    * This function will fetch the incidents report list from the dataBase 
    */
    async getIncidentsReportList(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;
        try {
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : Execution started.');
            

            const GET_INCIDENT_REPORT_LIST = await incidentReportDB.getIncidentReportList(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : GET_INCIDENT_REPORT_LIST : ' + JSON.stringify(GET_INCIDENT_REPORT_LIST));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : Execution end. :  GET_INCIDENT_REPORT_LIST is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_LIST.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : Execution end. : Error details :' + GET_INCIDENT_REPORT_LIST.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_LIST.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_LIST.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : Execution end. : Error details : ' + GET_INCIDENT_REPORT_LIST.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_INCIDENT_LIST = await getFormatIncidentReportsList(userIdFromToken,userNameFromToken,GET_INCIDENT_REPORT_LIST, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : FORMAT_INCIDENT_LIST : ' + JSON.stringify(FORMAT_INCIDENT_LIST));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_INCIDENT_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_INCIDENT_LIST) {
              logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : Execution end. :  FORMAT_INCIDENT_LIST response is undefined or null.');
              return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
        
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_INCIDENT_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentsReportList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the reported incident data for report from the dataBase 
    */
    async getIncidentConsolidatedReportData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentReportData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            incidentReportData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. : incidentReportData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : Execution started.');

            /**
            * Input Validation : Start
            */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. : incidentIds is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }

            /**
            * Input Validation : End 
            */

            const GET_INCIDENT_REPORT_RESPONSE = await incidentReportDB.getIncidentConsolidatedReportData(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : GET_INCIDENT_REPORT_RESPONSE : ' + JSON.stringify(GET_INCIDENT_REPORT_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. :  GET_INCIDENT_REPORT_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. : Error details :' + GET_INCIDENT_REPORT_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. : Error details : ' + GET_INCIDENT_REPORT_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_INCIDENT_REPORT_DATA = await getFormatIncidentConsolidatedReportsList(userIdFromToken, GET_INCIDENT_REPORT_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : FORMAT_INCIDENT_REPORT_DATA : ' + JSON.stringify(FORMAT_INCIDENT_REPORT_DATA));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_INCIDENT_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_INCIDENT_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. :  FORMAT_INCIDENT_REPORT_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_INCIDENT_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentConsolidatedReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
   * This function will fetch info for add/update incident report data from database
   */
    async getIncidentReportInfo(request, response) {

        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution started.');

            const GET_INCIDENT_REPORT_INFO_DB_RESPONSE = await incidentReportDB.getIncidentReportInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : GET_INCIDENT_REPORT_INFO_DB_RESPONSE : ' + JSON.stringify(GET_INCIDENT_REPORT_INFO_DB_RESPONSE));
        
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. :  get create incident info db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. : Error details :' + GET_INCIDENT_REPORT_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. : Error details : ' + GET_INCIDENT_REPORT_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
    
            const FORMAT_GET_INCIDENT_REPORT_INFO = await getFormatIncidentReportInfo(userIdFromToken, GET_INCIDENT_REPORT_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : FORMAT_GET_INCIDENT_REPORT_INFO : ' + JSON.stringify(FORMAT_GET_INCIDENT_REPORT_INFO));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_INCIDENT_REPORT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_INCIDENT_REPORT_INFO) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. :  FORMAT_GET_INCIDENT_REPORT_INFO response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
        
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_INCIDENT_REPORT_INFO));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
   * This function will create new incident report to the database
   */
    async createNewIncidentReport(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let incidentReportData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;
        try {
            incidentReportData      = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentReportData is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : Execution started.');

            /**
            * Input Validation : Start
            */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentStatusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentStatusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentStatusId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_STATUS_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentStartDate) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentStartDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_START_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentStartTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentStartTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentStartTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_START_TIME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentEndDate) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentEndDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_END_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentEndTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentEndTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentEndTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_END_TIME_NULL_EMPTY));
            }

            let dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, incidentReportData.incidentStartDate, incidentReportData.incidentStartTime, incidentReportData.incidentEndDate, incidentReportData.incidentEndTime, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
            if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. :' + dateTimeNotValid.message);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentTitle || appValidatorObject.isStringEmpty((incidentReportData.incidentTitle).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentNatureId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentNatureId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentNatureId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_NATURE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentClassificationId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentClassificationId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentClassificationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_CLASSIFICATION_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentLocationId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentLocationId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentLocationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_LOCATION_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentDescription || appValidatorObject.isStringEmpty((incidentReportData.incidentDescription).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : incidentDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.postIncidentEvaluationConclusion || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.postIncidentEvaluationConclusion || appValidatorObject.isStringEmpty((incidentReportData.postIncidentEvaluationConclusion).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : postIncidentEvaluationConclusion is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.POST_INCIDENT_EVALUATION_CONCLUSION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.actionsTaken || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.actionsTaken) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : actionsTaken is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_TAKEN_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.actionPlan || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.actionPlan) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. : actionPlan is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_PLAN_NULL_EMPTY));
            }

            for (let actionPlanObj of Object.values(incidentReportData.actionPlan)){
                let dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, actionPlanObj.startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, actionPlanObj.targetDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                    logger.log( 'error', 'User Id : ' + userIdFromToken +' : IncidentReportBl : createNewIncidentReport : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                }
            }
    
            /**
             * Input Validation : End
             */

            incidentReportData.incidentStartDateTime    = await utilityAppObject.mergeDateAndTime(userIdFromToken,incidentReportData.incidentStartDate,incidentReportData.incidentStartTime);
            incidentReportData.incidentEndDateTime      = await utilityAppObject.mergeDateAndTime(userIdFromToken,incidentReportData.incidentEndDate,incidentReportData.incidentEndTime);

            const CREATE_NEW_INCIDENT_DB_RESPONSE = await incidentReportDB.createNewIncidentReport(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken);
            logger.log( 'info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : CREATE_NEW_INCIDENT_DB_RESPONSE : ' + JSON.stringify(CREATE_NEW_INCIDENT_DB_RESPONSE));
        
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == CREATE_NEW_INCIDENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == CREATE_NEW_INCIDENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : Execution end. :  add site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (CREATE_NEW_INCIDENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : Execution end. : Error details :' + CREATE_NEW_INCIDENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (CREATE_NEW_INCIDENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && CREATE_NEW_INCIDENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : Execution end. : Error details : ' + CREATE_NEW_INCIDENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_CREATE_INC_REPORT = await getFormatIncidentReportsList(userIdFromToken,userNameFromToken,CREATE_NEW_INCIDENT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : FORMAT_CREATE_INC_REPORT : ' + JSON.stringify(FORMAT_CREATE_INC_REPORT));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_CREATE_INC_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_CREATE_INC_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : Execution end. :  FORMAT_CREATE_INC_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_CREATE_INC_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
    * This function will update incident report to the database
    */
    async updateIncidentReport(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let incidentReportData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {
            incidentReportData      = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData) {
                logger.log( 'error', 'User Id : ' + userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentReportData is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log( 'info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution started.');

            /**
             * Input Validation : Start
             */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentCode) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentCode is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_CODE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentStatusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentStatusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentStatusId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_STATUS_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentStartDate) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentStartDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_START_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentStartTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentStartTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentStartTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_START_TIME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentEndDate) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentEndDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_END_DATE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentEndTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentEndTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentEndTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_END_TIME_NULL_EMPTY));
            }

            /** 
            * Fetching particular Incident record from data base to verfy existing start/end date and time with requested date and time : Start
            */
            incidentReportData.incidentIds = incidentReportData.incidentId.toString();
            const GET_INCIDENT_REPORT_DATA_DB_RESPONSE = await incidentReportDB.getIncidentReportData(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. :  GET_INCIDENT_REPORT_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Error details :' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Error details : ' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if(GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
                const incidentDetails = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];


                let previousStartDateTime = await utilityAppObject.formatSplitDateTime(userIdFromToken, incidentDetails.StartDate);
                let previousEndDateTime = await utilityAppObject.formatSplitDateTime(userIdFromToken, incidentDetails.EndDate);

                let startDate = previousStartDateTime.date != incidentReportData.incidentStartDate.split('T')[0] ? incidentReportData.incidentStartDate.split('T')[0] : previousStartDateTime.date ;
                let startTime = previousStartDateTime.time != incidentReportData.incidentStartTime ? incidentReportData.incidentStartTime : previousStartDateTime.time ;
                let endDate =  previousEndDateTime.date != incidentReportData.incidentEndDate.split('T')[0] ? incidentReportData.incidentEndDate.split('T')[0] : previousEndDateTime.date ; 
                let endTime =  previousEndDateTime.time != incidentReportData.incidentEndTime ? incidentReportData.incidentEndTime :  previousEndDateTime.time ;
                
                // Checking requested date and time with existing date and time
                if (previousStartDateTime.date != incidentReportData.incidentStartDate.split('T')[0] || previousStartDateTime.time != incidentReportData.incidentStartTime || previousEndDateTime.date != incidentReportData.incidentEndDate.split('T')[0] || previousEndDateTime.time != incidentReportData.incidentEndTime) {

                    let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, startDate, startTime, endDate, endTime, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, previousStartDateTime.date != incidentReportData.incidentStartDate.split('T')[0], previousEndDateTime.date != incidentReportData.incidentEndDate.split('T')[0], CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);       
                    if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. :' + dateTimeNotValid.message);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
                    }
                }
            }
            /** 
            * Fetching particular Incident record from data base to verfy existing start/end date and time with requested date and time : End
            */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentTitle || appValidatorObject.isStringEmpty((incidentReportData.incidentTitle).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentNatureId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentNatureId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentNatureId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_NATURE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentClassificationId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentClassificationId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentClassificationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_CLASSIFICATION_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentLocationId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentLocationId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentLocationId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_LOCATION_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentDescription || appValidatorObject.isStringEmpty((incidentReportData.incidentDescription).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : incidentDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.postIncidentEvaluationConclusion || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.postIncidentEvaluationConclusion || appValidatorObject.isStringEmpty((incidentReportData.postIncidentEvaluationConclusion).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : postIncidentEvaluationConclusion is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.POST_INCIDENT_EVALUATION_CONCLUSION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.actionsTaken || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.actionsTaken) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : actionsTaken is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_TAKEN_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.actionPlan || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.actionPlan) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. : actionPlan is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_PLAN_NULL_EMPTY));
            }

            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
                const incidentDetails = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                let existingActionPlans = incidentDetails.IncidentActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentDetails.IncidentActionPlans) : [];
                for (let actionPlanObj of Object.values(incidentReportData.actionPlan)){
                    if (actionPlanObj.actionItemID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, actionPlanObj.startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, actionPlanObj.targetDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                        if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                        }
                    } else {
                        let matchedActionPlan = existingActionPlans.find(x => Number(x.IncidentActionPlanID) == Number(actionPlanObj.actionItemID));

                        let startDate   = matchedActionPlan.StartDate != actionPlanObj.startDate.split('T')[0] ? actionPlanObj.startDate.split('T')[0] : matchedActionPlan.StartDate ;
                        let endDate     = matchedActionPlan.TargetDate != actionPlanObj.targetDate.split('T')[0] ? actionPlanObj.targetDate.split('T')[0] : matchedActionPlan.TargetDate ;

                        // Checking requested date and time with existing date and time
                        if (matchedActionPlan.StartDate.split('T')[0] != actionPlanObj.startDate.split('T')[0] || matchedActionPlan.TargetDate.split('T')[0] != actionPlanObj.targetDate.split('T')[0]) {
                            let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, startDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, endDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, matchedActionPlan.StartDate != actionPlanObj.startDate.split('T')[0], matchedActionPlan.TargetDate != actionPlanObj.targetDate.split('T')[0], CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                            if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : updateIncidentReport : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                            }
                        }
                    }
                }
            }
    
            /**
            * Input Validation : End
            */

            incidentReportData.incidentStartDateTime    = await utilityAppObject.mergeDateAndTime(userIdFromToken,incidentReportData.incidentStartDate,incidentReportData.incidentStartTime);
            incidentReportData.incidentEndDateTime      = await utilityAppObject.mergeDateAndTime(userIdFromToken,incidentReportData.incidentEndDate,incidentReportData.incidentEndTime);

            const UPDATE_INCIDENT_DB_RESPONSE = await incidentReportDB.createNewIncidentReport(userIdFromToken, userNameFromToken, incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : UPDATE_INCIDENT_DB_RESPONSE : ' + JSON.stringify(UPDATE_INCIDENT_DB_RESPONSE));
        
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_INCIDENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_INCIDENT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution end. :  add site master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_INCIDENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution end. : Error details :' + UPDATE_INCIDENT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_INCIDENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_INCIDENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution end. : Error details : ' + UPDATE_INCIDENT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_CREATE_INC_REPORT = await getFormatIncidentReportsList(userIdFromToken,userNameFromToken,UPDATE_INCIDENT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : FORMAT_CREATE_INC_REPORT : ' + JSON.stringify(FORMAT_CREATE_INC_REPORT));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_CREATE_INC_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_CREATE_INC_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution end. :  FORMAT_CREATE_INC_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_CREATE_INC_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : updateIncidentReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the particalur incident report data of a incident from the dataBase 
    */
    async getIncidentReportData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentReportData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            incidentReportData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : getIncidentReportData : Execution end. : incidentReportData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : getIncidentReportData : Execution end. : incidentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const GET_INCIDENT_REPORT_DATA_DB_RESPONSE = await incidentReportDB.getIncidentReportData(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : createNewIncidentReport : GET_INCIDENT_REPORT_DATA_DB_RESPONSE : ' + JSON.stringify(GET_INCIDENT_REPORT_DATA_DB_RESPONSE  || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. :  GET_INCIDENT_REPORT_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Error details :' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Error details : ' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const GET_INFO_DB_RESPONSE = await incidentReportDB.getIncidentReportInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : GET_INFO_DB_RESPONSE : ' + JSON.stringify(GET_INFO_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. :  GET_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Error details :' + GET_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Error details : ' + GET_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_INC_REPORT_DATA = await getFormatIncidentData(userIdFromToken, GET_INCIDENT_REPORT_DATA_DB_RESPONSE,GET_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : FORMAT_INC_REPORT_DATA : ' + JSON.stringify(FORMAT_INC_REPORT_DATA || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_INC_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_INC_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. :  FORMAT_INC_REPORT_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_INC_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the particalur incident action trails from the dataBase 
    */
    async getIncidentActionTrails(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentReportData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            incidentReportData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : getIncidentActionTrails : Execution end. : incidentReportData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentIds || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentIds) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : getIncidentActionTrails : Execution end. : incidentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE = await incidentReportDB.getIncidentReportData(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE : ' + JSON.stringify(GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : Execution end. :  GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : Execution end. : Error details :' + GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : Execution end. : Error details : ' + GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_ACTION_TRAILS = await getFormatActionTrail(userIdFromToken, GET_INCIDENT_ACTION_TRAILS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : FORMAT_ACTION_TRAILS : ' + JSON.stringify(FORMAT_ACTION_TRAILS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ACTION_TRAILS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ACTION_TRAILS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : Execution end. :  FORMAT_ACTION_TRAILS response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ACTION_TRAILS));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentActionTrails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will submit incident report for review to the BC Manager. 
    */
    async submitIncidentReportForReview(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let incidentReportData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            incidentReportData  = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentReportDB : submitIncidentReportForReview : Execution started.');

            /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : submitIncidentReportForReview : Execution end. : incidentId cannot be null,empty or undefined.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.reviewComment || appValidatorObject.isStringEmpty((incidentReportData.reviewComment).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : submitIncidentReportForReview : Execution end. : review comment canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_REVIEW_COMMENT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.statusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.statusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : submitIncidentReportForReview : Execution end. : status id canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_STATUS_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const REVIEW_INCIDENT_REPORT_DB_RESPONSE = await incidentReportDB.submitIncidentReportForReview(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : REVIEW_INCIDENT_REPORT_DB_RESPONSE : ' + JSON.stringify(REVIEW_INCIDENT_REPORT_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REVIEW_INCIDENT_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REVIEW_INCIDENT_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : submitIncidentReportForReview : Execution end. :  REVIEW_INCIDENT_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_INCIDENT_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : submitIncidentReportForReview : Execution end. : Error details :' + REVIEW_INCIDENT_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_INCIDENT_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && REVIEW_INCIDENT_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : submitIncidentReportForReview : Execution end. : Error details : ' + REVIEW_INCIDENT_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            } 

            /**
             * Email Implementation : Start
             */

            incidentReportData.incidentIds = (incidentReportData.incidentId).toString();

            const GET_INCIDENT_REPORT_DATA_DB_RESPONSE = await incidentReportDB.getIncidentReportData(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : GET_INCIDENT_REPORT_DATA_DB_RESPONSE : ' + JSON.stringify(GET_INCIDENT_REPORT_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : Execution end. :  GET_INCIDENT_REPORT_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : Execution end. : Error details :' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : Execution end. : Error details : ' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            let incidentDetailsRes  = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let bcmanagers          = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            let FBCCSBCCOfSameSite  = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : incidentDetails   : ' + JSON.stringify(incidentDetailsRes));

            if (incidentDetailsRes.length) {
                try {       
                    let incidentDetails =incidentDetailsRes[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];                                              
               
                    let emailTemplateObj = {
                        Subject : INC_NOTIFY_TEMPLATE.NOTIFY_INCIDENT["NOTIFY_INC_TEMPLATE"].Subject,
                        Body    : INC_NOTIFY_TEMPLATE.NOTIFY_INCIDENT["NOTIFY_INC_TEMPLATE"].Body
                    }; 
                    let toccEmails = {
                        "TOEmail"   : await fetchUniqueMailsList(userIdFromToken,bcmanagers),
                        "CCEmail"   : await fetchUniqueMailsList(userIdFromToken,FBCCSBCCOfSameSite)
                    };
                    
                    let templateMaster = {                     
                        IncidentCode        : incidentDetails.Code,
                        RISKTRAC_WEB_URL    : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        IncidentName        : incidentDetails.Title,                                   
                        StartDate           : utilityAppObject.formatDate(userIdFromToken, incidentDetails.StartDate),
                        EndDate             : utilityAppObject.formatDate(userIdFromToken, incidentDetails.EndDate),
                        subject_text        : incidentDetails.IsApproved == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? "Incident has been reported" : "Incident has been resubmitted",                        
                        body_text           : incidentDetails.IsApproved == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? `Incident has been reported by` +"("+ `${incidentDetails.ReporteeName}` +")"  : `Incident has been resubmitted by ` +"("+ `${incidentDetails.ReporteeName}` +")" 
                    };

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : emailData   : ' + JSON.stringify(emailData || null));
                    
                    //InApp alert starts
                    let inAppMessage     = incidentDetails.IsApproved == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? "Incident has been reported." : "Incident has been resubmitted.";

                    let BCManagerGUIDs   = [...new Set(bcmanagers.map(n => n.AdminGUID))].join(',');
                    let FBCCSiteGUIDs    = [...new Set(FBCCSBCCOfSameSite.map(n => n.UserGUID))].join(',');
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(BCManagerGUIDs + "," + FBCCSiteGUIDs)
                    let inappDetails     = {
                        inAppContent     : inAppMessage + " Incident code - " + incidentDetails.Code + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].IncRoute,
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].SubModuleID
                    }
        
                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    //InApp alert end           

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ': IncidentReportBl : submitIncidentReportForReview : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }

             /**
             * Email Implementation : End
             */
            
            const FORMAT_SUBMIT_INC_REVIEW = await getFormatIncidentReportsList(userIdFromToken,userNameFromToken,REVIEW_INCIDENT_REPORT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : submitIncidentReportForReview : FORMAT_SUBMIT_INC_REVIEW : ' + JSON.stringify(FORMAT_SUBMIT_INC_REVIEW));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SUBMIT_INC_REVIEW || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SUBMIT_INC_REVIEW) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : submitIncidentReportForReview : Execution end. :  FORMAT_SUBMIT_INC_REVIEW is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_SUBMIT_INC_REVIEW));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : submitIncidentReportForReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will review incident report by BC Manager
    */
    async reviewIncidentReport(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let incidentReportData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            incidentReportData  = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentReportDB : reviewIncidentReport : Execution started.');

            /**
            * Input Validation : Start
            */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.incidentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.incidentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : reviewIncidentReport : Execution end. : incidentId cannot be null,empty or undefined.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.status || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.status) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : reviewIncidentReport : Execution end. : status canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_REVIEW_DECISION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.reviewComment || appValidatorObject.isStringEmpty((incidentReportData.reviewComment).trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : reviewIncidentReport : Execution end. : review comment canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_REVIEW_COMMENT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.statusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.statusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentReportDB : reviewIncidentReport : Execution end. : status id canot be undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INCIDENT_STATUS_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const REVIEW_INCIDENT_REPORT_DB_RESPONSE = await incidentReportDB.reviewIncidentReport(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : REVIEW_INCIDENT_REPORT_DB_RESPONSE : ' + JSON.stringify(REVIEW_INCIDENT_REPORT_DB_RESPONSE));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REVIEW_INCIDENT_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REVIEW_INCIDENT_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : reviewIncidentReport : Execution end. :  REVIEW_INCIDENT_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_INCIDENT_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : reviewIncidentReport : Execution end. : Error details :' + REVIEW_INCIDENT_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_INCIDENT_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && REVIEW_INCIDENT_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : reviewIncidentReport : Execution end. : Error details : ' + REVIEW_INCIDENT_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }   

            /**
            * Email Implementation : Start
            */

            incidentReportData.incidentIds = (incidentReportData.incidentId).toString();

            const GET_INCIDENT_REPORT_DATA_DB_RESPONSE = await incidentReportDB.getIncidentReportData(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : GET_INCIDENT_REPORT_DATA_DB_RESPONSE : ' + JSON.stringify(GET_INCIDENT_REPORT_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_REPORT_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_REPORT_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : Execution end. :  GET_INCIDENT_REPORT_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : Execution end. : Error details :' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_REPORT_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : Execution end. : Error details : ' + GET_INCIDENT_REPORT_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            let incidentDetailsRes  = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let FBCCSBCCOfSameSite  = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
            let BCManagerList       = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            let BCManagerName       = GET_INCIDENT_REPORT_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].find(ele => ele.AdminGUID == userIdFromToken).AdminName;
            let toList              = [...BCManagerList, ...FBCCSBCCOfSameSite]
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : incidentDetails   : ' + JSON.stringify(incidentDetailsRes));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : toList   : ' + JSON.stringify(toList));

            if (incidentDetailsRes.length) {

                let incidentDetails = incidentDetailsRes[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                try {   
                
                let emailTemplateObj = {
                        Subject : INC_NOTIFY_TEMPLATE.NOTIFY_INCIDENT["NOTIFY_INC_TEMPLATE"].Subject,
                        Body    : INC_NOTIFY_TEMPLATE.NOTIFY_INCIDENT["NOTIFY_INC_TEMPLATE"].Body
                    }; 
                    let toccEmails = {
                        "TOEmail"   : incidentDetails.ReporteeEmailID,
                        "CCEmail"   : await fetchUniqueMailsList(userIdFromToken,toList)
                    };
                
                    
                    let templateMaster = {                     
                        IncidentCode        : incidentDetails.Code,
                        RISKTRAC_WEB_URL    : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        IncidentName        : incidentDetails.Title,                                   
                        StartDate           : utilityAppObject.formatDate(userIdFromToken, incidentDetails.StartDate),
                        EndDate             : utilityAppObject.formatDate(userIdFromToken, incidentDetails.EndDate),
                        subject_text        : incidentReportData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? "Incident has been Approved" : "Incident has been Rejected",                        
                        body_text           : incidentReportData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? `Incident has been Approved by ` +"("+ `${BCManagerName} ` +")" : `Incident has been Rejected by` +"("+ `${BCManagerName}` + ")"
                    };

                    let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : emailData   : ' + JSON.stringify(emailData || null));
                    
                    //InApp alert starts
                    let inAppMessage     = incidentReportData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? "Incident has been Approved." : "Incident has been Rejected.";
                    let FBCCSiteGUIDs    = [...new Set(FBCCSBCCOfSameSite.map(n => n.UserGUID))].join(',');
                    let BCManagersGUIDs  = [...new Set(BCManagerList.map(n => n.AdminGUID))].join(',');
                    let inAppUserList    = utilityAppObject.removeDuplicateGUIDs(incidentDetails.ReporteeGUID + "," + FBCCSiteGUIDs + "," + BCManagersGUIDs)
                    let inappDetails     = {
                        inAppContent     : inAppMessage + " Incident code - " + incidentDetails.Code + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].IncRoute,
                        recepientUserID  : inAppUserList,
                        subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].SubModuleID
                    }
        
                    let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                    //InApp alert end 

                } catch(error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ': IncidentReportBl : reviewIncidentReport : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                }
            }
 
              /**
              * Email Implementation : End
              */
            
            const FORMAT_REVIEW_INCIDENT_LIST = await getFormatIncidentReportsList(userIdFromToken,userNameFromToken,REVIEW_INCIDENT_REPORT_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : FORMAT_REVIEW_INCIDENT_LIST : ' + JSON.stringify(FORMAT_REVIEW_INCIDENT_LIST));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REVIEW_INCIDENT_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REVIEW_INCIDENT_LIST) {
              logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : reviewIncidentReport : Execution end. :  FORMAT_REVIEW_INCIDENT_LIST response is undefined or null.');
              return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_REVIEW_INCIDENT_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentReportDB : reviewIncidentReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
        }
    }

      /**
     * This function to upload risk evidence file 
     */

      async uploadIncidentEvidence(request, response) {

        let refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentReportData = {
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

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution started.');
            // check request body should not be undefined
            if (typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Request body has not found');
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
            incidentReportData.OriginalFileName        = request.files.file.name;         
            incidentReportData.FileType                = uploadFileExtension;
            incidentReportData.FileContent             = request.files.file.data;
            const mimeType                             = await FILE_TYPE.fromBuffer(incidentReportData.FileContent);
            const localFilePath                        = path.join(__dirname, '..','..','file-upload', 'evidences', 'temp');

            if (/^[a-zA-Z0-9\s_\-()./]*$/.test(request.files.file.name)) {
                incidentReportData.FileName                = Date.now() +"_"+ request.files.file.name;   
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Error Details : File name should not have special characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_NAME_IS_NOT_VALID));
            }
            // Validating file Size
            if (fileSize > limits) {                    
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Error Details : File size has exceeded the allowed limit');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_SIZE_EXCEED + APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE ));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : mimeType : ' + JSON.stringify(mimeType));

            if (mimeType.ext == 'exe') {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

            if (mimeType != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) {
                // Validating file extension
                if (!(allowedExtensions.includes((mimeType.ext)))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));
                }               
                
                // Validating file Mimetype
                if (!(fileMimeType.includes(mimeType.mime))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));                    
                }                
                const fileUploadedResponse = await utilityAppObject.uploadFileToRemoteServer(userIdFromToken, incidentReportData.FileContent, destinationPath, request.files.file.name, incidentReportData.FileType, localFilePath);     

                if (fileUploadedResponse.uploadFileResponse) { 
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : File dumped into SFTP server successfully in the path : ' + destinationPath);

                    const GET_EVIDENCE_ATTACHMENT_DB_RESPONSE = await incidentReportDB.uploadIncidentEvidence(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EVIDENCE_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EVIDENCE_ATTACHMENT_DB_RESPONSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. :  GET_EVIDENCE_ATTACHMENT_DB_RESPONSE is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Error details :' + GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Error details : ' + GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    
                
                    const FORMAT_RISK_ATTACHMENT_DATA = await getFormatEvidenceList(userIdFromToken,GET_EVIDENCE_ATTACHMENT_DB_RESPONSE, accountGUIDFromToken);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : FORMAT_RISK_ATTACHMENT_DATA : ' + JSON.stringify(FORMAT_RISK_ATTACHMENT_DATA));
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RISK_ATTACHMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RISK_ATTACHMENT_DATA) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. :  FORMAT_RISK_ATTACHMENT_DATA response is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : incident evidence uploaded successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_RISK_ATTACHMENT_DATA));
                
                } else if(fileUploadedResponse.uploadFileResponse === false && fileUploadedResponse.SFTPConnection === true){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Uploaded file is malicious ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
                } else {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Failed to connect to sftp server ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL_SFTP));
                }    
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : uploadIncidentEvidence : Execution end. : Got unhandled error : Error Detail : ' + error)
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));

        }
    }

     /** 
    * This function will download evidence of particular attachmentid  from the dataBase 
    */
     async downloadIncidentEvidence(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentReportData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            incidentReportData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : downloadIncidentEvidence : Execution end. : incidentReportData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == incidentReportData.fileContentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == incidentReportData.fileContentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentReportBl : downloadIncidentEvidence : Execution end. : fileContentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_CONTENT_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const GET_DOWNLOAD_RESPONSE = await incidentReportDB.downloadIncidentEvidence(userIdFromToken, userNameFromToken,incidentReportData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : GET_DOWNLOAD_RESPONSE : ' + JSON.stringify(GET_DOWNLOAD_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : Execution end. :  GET_DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : Execution end. : Error details :' + GET_DOWNLOAD_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DOWNLOAD_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : Execution end. : Error details : ' + GET_DOWNLOAD_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_DOWNLOAD_RESPONSE = await getFormatEvidenceList(userIdFromToken, GET_DOWNLOAD_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : FORMAT_DOWNLOAD_RESPONSE : ' + JSON.stringify(FORMAT_DOWNLOAD_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : Execution end. :  FORMAT_DOWNLOAD_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, FORMAT_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : downloadIncidentEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
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
        error: {
            errorCode     : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage  : errorMessage,
        },
    };
}
  
function successfulResponse(refreshedToken, successMessage, result) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error: {
            errorCode     : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        },
    };
}

async function  getFormatIncidentReportInfo(userIdFromToken, incidentInfoList, accountGUIDFromToken){
    let incidentStatus          = [];
    let incidentNatures         = [];
    let incidentSiteLocations   = [];
    let classifications         = [];
    let actionItemOwners        = [];
    let SAUsersList             = [];
    let siteIds                 = [];
    let attachmentConfig        = [];
    let incCode                 = '';
    let userRole                = '';

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution start. ');

        // Result Set 1: Incident Status List
        if(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let statusObj of Object.values(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                if(statusObj.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                    incidentStatus.push({
                        "IncidentStatusID"    : statusObj.IncidentStatusID,
                        "IncidentStatus"      : statusObj.Name
                    })
                }
            }
        }

        // Result Set 2: Incident Nature List
        if(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let natureObj of Object.values(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                if(natureObj.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                    incidentNatures.push({
                        "IncidentNatureID"  : natureObj.ID,
                        "IncidentNature"    : natureObj.NAME
                    })
                }
            }
        }

        //Find the Role of Logged-in User
        let FBCCs      = incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let SiteBCCs   = incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        let PUUsers    = incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        let SiteAHs    = incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
        
        if(FBCCs.some(ele=> ele.FBCCID == userIdFromToken)){
            userRole = 'FBCC User';
        }else if(SiteBCCs.some(ele=> ele.BCChampionGUID == userIdFromToken)){
            userRole = 'Site BCC';
        }else if(SiteAHs.some(ele=> ele.UserGUID == userIdFromToken)){
            userRole = 'Site Admin Head';
        }else if(PUUsers.some(ele=> ele.PUID == userIdFromToken)){
            userRole = 'Power User';
        }else{
            userRole = 'Other Users'
        }

        //filter the Site ids which belongs to logged-in user, if user is FBCC user
        if(FBCCs.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteObj of Object.values(FBCCs)){
                if(siteObj.FBCCID == userIdFromToken){
                    siteIds.push(siteObj.SiteID)
                }
            }
        }

        //filter the Site ids which belongs to logged-in user, if user is Site BCC user
        if(SiteBCCs.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteObj of Object.values(SiteBCCs)){
                if(siteObj.BCChampionGUID == userIdFromToken){
                    siteIds.push(siteObj.SiteID)
                }
            }
        }

        //filter the Site ids which belongs to logged-in user, if user is Site Admin Head user
        if(SiteAHs.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteObj of Object.values(SiteAHs)){
                if(siteObj.UserGUID == userIdFromToken){
                    siteIds.push(siteObj.SiteID)
                }
            }
        }

        //filter the Site ids which belongs to logged-in user, if user is Power User(BCC Users)
        if(PUUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteObj of Object.values(PUUsers)){
                if(siteObj.PUID == userIdFromToken){
                    siteIds.push(siteObj.SiteID)
                }
            }
        }

        
      
        // Result Set 3: Incident Site Location List
        if(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteLocationObj of Object.values(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                //fetching only sites belongs to this logged-in user 
                if(userRole == 'FBCC User' || userRole == 'Site BCC' || userRole == 'Site Admin Head' || userRole == 'Power User'){
                    if(siteIds.includes(siteLocationObj.SiteID)){
                        incidentSiteLocations.push({
                            "IncidentLocation"   : siteLocationObj.Name,
                            "IncidentLocationID" : siteLocationObj.SiteID
                        })
                    }
                }else{
                    incidentSiteLocations.push({
                        "IncidentLocation"   : siteLocationObj.Name,
                        "IncidentLocationID" : siteLocationObj.SiteID
                    })
                }
            }
        }

        // Result Set 4 : Classification List
        if(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let classificationObj of Object.values(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                classifications.push({
                    "ClassificationID"  : classificationObj.ClassificationID,
					"Classification"    : classificationObj.Name
                })
            }
        }

        // Result Set 5 : Action Item Owner List
        if(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let actionItemOwnerObj of Object.values(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])){
                actionItemOwners.push({
                    "ActionItemOwnerGUID"   : actionItemOwnerObj.AdminGUID,
					"ActionItemOwnerName"   : actionItemOwnerObj.AdminName,
                })
            }
        }

        // Result Set 8 : Site Admin Users List 
        if(SiteAHs.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let ele of Object.values(SiteAHs)){
                SAUsersList.push({
                    "SiteID"     : ele.SiteID,
                    "SiteName"   : ele.SiteName,
                    "SAUserGUID" : ele.UserGUID,
                    "SAUserName" : ele.FullName
                })
            };
        }

        //formating incident code
        if(incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] &&  incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            incCount    = ((incidentInfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IncidentCount) + CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
            incCode     = "INC"+ incCount.toString().padStart(3, '0');
        }

         // file upload configuration
         attachmentConfig.push({
            "FileSize"          : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE,
            "FileExtensions"    : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST
          })

        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. ');

        //Formating Final ResultSet
        return {
            "IncidentStatusList"        : incidentStatus,
            "IncidentNatureList"        : incidentNatures,
            "IncidentSiteLocations"     : incidentSiteLocations,
            "Classifications"           : classifications,
            "ActionItemOwnerList"       : actionItemOwners,
            "SiteAdminUsersList"        : SAUsersList,
            "IncidentCode"              : incCode,
            "AttachmentConfiguration"   : attachmentConfig
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getIncidentReportInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatIncidentReportsList(userIdFromToken,userNameFromToken, incidentListDBResponse, accountGUIDFromToken){
    incidentList        = [];
    bcManagersList      = [];
    fbccUsersList       = [];
    siteBccUsersList    = [];
    incidentStatus      = [];
    SCList              = [];
    fbccSiteBccList     = [];
    PUUsersList         = [];
    SAUsersList         = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentReportsList : Execution start.'+ JSON.stringify(incidentListDBResponse));
        // Result Set 1: Incidents List
        if(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            
            for(let incObj of Object.values(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                let actions         = [];
                let actionPlans     = [];
                let evidences       = [];

                let isReportee      = incObj.ReporteeGUID == userIdFromToken ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                let isLatestVisible = ((!isReportee && incObj.IsApproved != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) || isReportee || incObj.IsApproved == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || incObj.StatusID ==CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                //formating incident action takens
                let incidentAction = isLatestVisible ? incObj.IncidentActions : incObj.PreviousIncidentActions;
                if(incidentAction != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let actObj of Object.values(JSON.parse(incidentAction))){
                        actions.push({
                            "ActionID"        : actObj.IncidentActionID,
                            "Action"          : actObj.IncidentAction,
                            "ActionDateTime"  : actObj.CreatedDate
                        })
                    }
                }

                //formating incident actionplans
                let incidentActionPlans = isLatestVisible ? incObj.IncidentActionPlans : incObj.PreviousIncidentActionPlans;
                
                if(incidentActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let actPlanObj of Object.values(JSON.parse(incidentActionPlans))){
                        actionPlans.push({
                            "ActionItemID"        : actPlanObj.IncidentActionPlanID,
                            "ActionItem"          : actPlanObj.IncidentActionPlan,
                            "StartDate"           : actPlanObj.StartDate,
                            "TargetDate"          : actPlanObj.TargetDate,
                            "ActionItemOwner"     : actPlanObj.ActionItemOwner,
                            "ActionItemOwnerGUID" : actPlanObj.ActionOwnerGUID
                        })
                    }
                }

                //formating incident evidences
                if(incObj.IncidentEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){

                   // let incidentEvidences = isLatestVisible ? JSON.parse(incObj.IncidentEvidences) : JSON.parse(incObj.IncidentEvidences).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
                   let incidentEvidences = isReportee ? JSON.parse(incObj.IncidentEvidences).filter(ele=>ele.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : JSON.parse(incObj.IncidentEvidences).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);

                    for(let evObj of Object.values(incidentEvidences)){
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
              

                let incidentLoations =  isLatestVisible ? incObj.IncidentLoations : incObj.PreviousIncidentLoations;
                let incidentNatures  =  isLatestVisible ? incObj.IncidentNatures : incObj.PreviousIncidentNatures;

                incidentList.push({                 
                    "IncidentID"        : incObj.IncidentID,
                    "IncidentTitle"     : isLatestVisible ? incObj.Title : incObj.PreviousTitle,
                    "IncidentCode"      : incObj.Code,
                    "ReportedDateTime"  : isLatestVisible ? incObj.StartDate : incObj.PreviousStartDate,
                    "ReporterName"      : incObj.ReporteeName,
                    "ReporterGUID"      : incObj.ReporteeGUID,
                    "Location"          : incidentLoations != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentLoations).map(ele => ele.SiteName).join(",") : '',
                    "LocationID"        : incidentLoations != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentLoations).map(ele=>ele.SiteID).join(",") : '',
                    "IncidentNature"    : incidentNatures != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentNatures).map(ele =>ele.NatureName).join(",") : '',
                    "IncidentNatureID"  : incidentNatures != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentNatures).map(ele =>ele.NatureID).join(",") : '',
                    "Classification"    : isLatestVisible ? incObj.Classification : incObj.PreviousClassification,
                    "ClassificationID"  : isLatestVisible ? incObj.ClassificationID : incObj.PreviousClassificationID,
                    "ActualStatus"      : incObj.Status,
                    "ActualStatusID"    : incObj.StatusID,
                    "QualifiedStatus"   : incObj.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE ? incObj.Status : ENUMS_OBJ.INC_STATUS.ON_GOING,
                    "IsApproved"        : incObj.IsApproved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (incObj.IsApproved? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "CreatedBy"         : await getUserName(userIdFromToken,incObj.CreatedBy),
                    "FilterStatusID"    : await calculateFilterStatusID(userIdFromToken,incObj),
                    "ActionsTaken"      : actions,
                    "ActionPlan"        : actionPlans,
                    "IncidentEvidences" : evidences
                })
            }
        }

        // Result Set 2 : BC Managers List
        if(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcmObj of Object.values(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                bcManagersList.push({
                    "AdminGUID"   : bcmObj.AdminGUID,
                    "AdminName"   : bcmObj.AdminName,
                })
            }
        }

         // Result Set 3 : FBCC Users List
         if(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let fbccObj of Object.values(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                fbccUsersList.push({
                    "FBCCUserGUID"   : fbccObj.FBCCID,
                    "FBCCUserName"   : fbccObj.FBCCUSER,
                })

            }
        }

        // Result Set 3 : Site BCC Users List
        if(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let siteBccObj of Object.values(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                siteBccUsersList.push({
                    "SiteBCChampionGUID"        : siteBccObj.BCChampionGUID,
                    "SiteBCChampionUserName"    : siteBccObj.BCChampionName,
                })

            }
        }

        let steeringCommitteeUsers  = incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        let siteBCCAdminHead        = incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];

        // Result Set 4: Incident Status List
        if(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let statusObj of Object.values(incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])){
                if(statusObj.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                    incidentStatus.push({
                        "IncidentStatusID"    : statusObj.IncidentStatusID,
                        "IncidentStatus"      : statusObj.Name
                    })
                }
            }
        }
        
        // Result Set 5 : Steering Committee Users
        if(steeringCommitteeUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let ele of Object.values(steeringCommitteeUsers)){
                SCList.push({
                    "SCUserGUID" : ele.UserGUID,
                    "SCUserName" : ele.UserName,
                    "SCFullName" : ele.FullName
                })
            };
        }
        
        // Result Set 6 : siteBCC/FCC of based on site
        if(siteBCCAdminHead.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let ele of Object.values(siteBCCAdminHead)){
                if(ele.UserGUID == userIdFromToken){
                    fbccSiteBccList.push({
                        "IncidentID"    : ele.IncidentID,
                        "SiteID"        : ele.SiteID,
                        "UserGUID"      : ele.UserGUID,
                        "UserName"      : ele.UserName,
                        "FullName"      : ele.FullName
                    })
                }
            };
        }
        
        let PUUsers         = incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        let SiteAdminUsers  = incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] &&  incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentListDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
       
        // Result Set 7 : Power Users List 
        if(PUUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let ele of Object.values(PUUsers)){
                PUUsersList.push({
                    "PUUserGUID" : ele.PUID,
                    "PUUserName" : ele.PUName
                })
            };
        }


        // Result Set 8 : Site Admin Users List 
        if(SiteAdminUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let ele of Object.values(SiteAdminUsers)){
                SAUsersList.push({
                    "SAUserGUID" : ele.UserGUID,
                    "SAUserName" : ele.FullName
                })
            };
        }


        /**
         * filter the incidents list based on Users logged-in : START
         */

        if((PUUsersList.some(ele =>ele.PUUserGUID == userIdFromToken)) || (siteBccUsersList.some(ele =>ele.SiteBCChampionGUID == userIdFromToken)) || (SAUsersList.some(ele =>ele.SAUserGUID == userIdFromToken))){ 
            // Case : Logged-in User is Power/Site BCC/Site Admin 
            incidentList = incidentList.filter(ele =>ele.CreatedBy == userNameFromToken || fbccSiteBccList.some(item => item.IncidentID == ele.IncidentID));
        }
        else if((bcManagersList.some(ele =>ele.AdminGUID == userIdFromToken) || steeringCommitteeUsers.some(ele=>ele.UserGUID == userIdFromToken))){ 
            // Case : BCManagers & steering committee
            incidentList = incidentList.filter(ele => !(ele.ActualStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ele.IsApproved ==CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
        }
        else{
            // Case : other Users
            incidentList = incidentList;
        } 
        /**
         * filter the incidents list based on Users logged-in : END
         */

        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentReportsList : Execution end. ');

        //Formating final resulsets
        return {
            "IncidentListDetails"       : incidentList,
            "BCManagersList"            : bcManagersList,
            "FBCCUsersList"             : fbccUsersList,
            "SiteBCCUsersList"          : siteBccUsersList,
            "IncidentStatusList"        : incidentStatus,
            "SteeringCommitteUsers"     : SCList ,
            "SameSiteFbccSiteBccList"   : fbccSiteBccList,
            "PowerUsersList"            : PUUsersList,
            "SiteAdminUsersList"        : SAUsersList,
            "ExportFileLimit"           : APP_CONFIG_FILE_OBJ.EXPORT_FILE_LIMIT.INC_EXPORT_LIMIT
        }
     
    }catch(error){
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentReportsList : Execution end.'+error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }    
}

async function getFormatIncidentConsolidatedReportsList(userIdFromToken, incReportDBResponse, accountGUIDFromToken){
    incidentList    = [];
    
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentConsolidatedReportsList : Execution start.');

        // Result Set 1: Incidents List
        if(incReportDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  incReportDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let incObj of Object.values(incReportDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                let actions     = [];
                let actionPlans = [];

                //formating incident action takens
                if(incObj.IncidentActions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let actObj of Object.values(JSON.parse(incObj.IncidentActions))){
                        actions.push({
                            ActionID        : actObj.IncidentActionID,
                            Action          : actObj.IncidentAction,
                            ActionDateTime  : actObj.CreatedDate
                        })
                    }
                }

                //formating incident actionplans
                if(incObj.IncidentActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let actPlanObj of Object.values(JSON.parse(incObj.IncidentActionPlans))){
                        actionPlans.push({
                            ActionItemID        : actPlanObj.IncidentActionPlanID,
                            ActionItem          : actPlanObj.IncidentActionPlan,
                            StartDate           : actPlanObj.StartDate,
                            TargetDate          : actPlanObj.TargetDate,
                            ActionItemOwner     : actPlanObj.ActionItemOwner,
                            ActionItemOwnerGUID : actPlanObj.ActionOwnerGUID
                        })
                    }
                }

                incidentList.push({
                    "IncidentID"                        : incObj.IncidentID,
                    "IncidentTitle"                     : incObj.Title,
                    "IncidentCode"                      : incObj.Code,
                    "IncidentStartDateTime"             : incObj.StartDate,
                    "IncidentEndDateTime"               : incObj.EndDate,
                    "IncidentDescription"               : incObj.Description,
                    "ReporterName"                      : incObj.CreatedBy,
                    "IncidentLocation"                  : incObj.IncidentLoations != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incObj.IncidentLoations).map(ele => ele.SiteName).join(",") : '',
                    "IncidentLocationID"                : incObj.IncidentLoations != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incObj.IncidentLoations).map(ele=>ele.SiteID).join(",") : '',
                    "IncidentNature"                    : incObj.IncidentNatures != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incObj.IncidentNatures).map(ele =>ele.NatureName).join(",") : '',
                    "IncidentNatureID"                  : incObj.IncidentNatures != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incObj.IncidentNatures).map(ele =>ele.NatureID).join(",") : '',
                    "Classification"                    : incObj.Classification,
                    "ClassificationID"                  : incObj.ClassificationID,
                    "ActualStatus"                      : incObj.Status,
                    "ActualStatusID"                    : incObj.StatusID,
                    "QualifiedStatus"                   : incObj.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE ? incObj.Status : ENUMS_OBJ.INC_STATUS.ON_GOING,
                    "PostIncidentEvaluationConclusion"  : incObj.Evaluation_Conclusion,
                    "IsReviewed"                        : incObj.IsApproved,
                    "ActionsTaken"                      : actions,
                    "ActionPlan"                        : actionPlans,
                })
            }
        }


        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentConsolidatedReportsList : Execution end. ');

        //Formating final resulsets
        return {
            "IncidentsReportData"   : incidentList,
        }
     
    }catch(error){
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentConsolidatedReportsList : Execution end.'+error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }    
}

async function getFormatIncidentData(userIdFromToken, getIncidentDataDBResponse,incidentInfoList, accountGUIDFromToken){
    let masterList      = [];
    let incidentData    = [];


    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentData : Execution start. ');

        // Result Set 1: Incident Data
        if(getIncidentDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getIncidentDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let incObj of Object.values(getIncidentDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                let actions         = [];
                let actionPlans     = [];
                let comments        = [];
                let evidences       = [];

                let isReportee      = incObj.ReporteeGUID == userIdFromToken ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                let isLatestVisible = ((!isReportee && incObj.IsApproved != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) || isReportee|| incObj.IsApproved == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || incObj.StatusID ==CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;

                
                //formating incident action takens
                let incidentAction = isLatestVisible ? incObj.IncidentActions : incObj.PreviousIncidentActions;
                if(incidentAction != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let actObj of Object.values(JSON.parse(incidentAction))){
                        actions.push({
                            "ActionID"        : actObj.IncidentActionID,
                            "Action"          : actObj.IncidentAction,
                            "ActionDateTime"  : actObj.CreatedDate
                        })
                    }
                }

                //formating incident actionplans
                let incidentActionPlans = isLatestVisible ? incObj.IncidentActionPlans : incObj.PreviousIncidentActionPlans;
                
                if(incidentActionPlans != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let actPlanObj of Object.values(JSON.parse(incidentActionPlans))){
                        actionPlans.push({
                            "ActionItemID"        : actPlanObj.IncidentActionPlanID,
                            "ActionItem"          : actPlanObj.IncidentActionPlan,
                            "StartDate"           : actPlanObj.StartDate,
                            "TargetDate"          : actPlanObj.TargetDate,
                            "ActionItemOwner"     : actPlanObj.ActionItemOwner,
                            "ActionItemOwnerGUID" : actPlanObj.ActionOwnerGUID
                        })
                    }
                }

                //formating review comments 
                if(incObj.IncidentReviewComments != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let cmtObj of Object.values(JSON.parse(incObj.IncidentReviewComments))){
                        comments.push({
                            "IncidentCommentID" : cmtObj.IncidentReviewCommentID,
                            "CommentBody"       : cmtObj.IncidentReviewComment,
                            "CreatedDate"       : cmtObj.CreatedDate,
                            "UserGUID"          : cmtObj.UserGUID,
                            "CommentUserName"   : cmtObj.UserName
                        })
                    }
                }

                //formating incident evidences
                if(incObj.IncidentEvidences != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){

                   // let incidentEvidences = isLatestVisible ? JSON.parse(incObj.IncidentEvidences) : JSON.parse(incObj.IncidentEvidences).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
                   let incidentEvidences = isReportee ? JSON.parse(incObj.IncidentEvidences).filter(ele=>ele.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : JSON.parse(incObj.IncidentEvidences).filter(ele=>ele.IsVisible == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);

                    for(let evObj of Object.values(incidentEvidences)){
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


                let incidentLoations    =  isLatestVisible ? incObj.IncidentLoations : incObj.PreviousIncidentLoations;
                let incidentNatures     =  isLatestVisible ? incObj.IncidentNatures : incObj.PreviousIncidentNatures;


                incidentData.push({
                    "IncidentID"                        : incObj.IncidentID,
                    "IncidentTitle"                     : isLatestVisible ? incObj.Title : incObj.PreviousTitle,
                    "IncidentCode"                      : incObj.Code,
                    "IncidentStartDateTime"             : isLatestVisible ? incObj.StartDate : incObj.PreviousStartDate,
                    "IncidentEndDateTime"               : isLatestVisible ? incObj.EndDate : incObj.PreviousEndDate,
                    "IncidentDescription"               : isLatestVisible ? incObj.Description : incObj.PreviousDescription,
                    "ReporterName"                      : incObj.ReporteeName,
                    "ReporterGUID"                      : incObj.ReporteeGUID,
                    "IncidentLocation"                  : incidentLoations != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentLoations).map(ele => ele.SiteName).join(",") : '',
                    "IncidentLocationID"                : incidentLoations != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentLoations).map(ele=>ele.SiteID).join(",") : '',
                    "IncidentNature"                    : incidentNatures != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentNatures).map(ele =>ele.NatureName).join(",") : '',
                    "IncidentNatureID"                  : incidentNatures != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(incidentNatures).map(ele =>ele.NatureID).join(",") : '',
                    "Classification"                    : isLatestVisible ? incObj.Classification : incObj.PreviousClassification,
                    "ClassificationID"                  : isLatestVisible ? incObj.ClassificationID : incObj.PreviousClassificationID,
                    "ActualStatus"                      : incObj.Status,
                    "ActualStatusID"                    : incObj.StatusID,
                    "QualifiedStatus"                   : incObj.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE ? incObj.Status : ENUMS_OBJ.INC_STATUS.ON_GOING,
                    "PostIncidentEvaluationConclusion"  : isLatestVisible ? incObj.Evaluation_Conclusion : incObj.PreviousEvaluation_Conclusion,
                    "IsApproved"                        : incObj.IsApproved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (incObj.IsApproved? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "IsReviewed"                        : incObj.IsApproved != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    "ActionsTaken"                      : actions,
                    "ActionPlan"                        : actionPlans,
                    "IncidentReviewComments"            : comments,
                    "IncidentEvidences"                 : evidences
               })

                
            }
        }

        //Result Set 2 :Master List 
        masterList = await getFormatIncidentReportInfo(userIdFromToken,incidentInfoList);

        


        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentData : Execution end. ');

        //Formating Final ResultSet
        return {
            "IncidentData"  : incidentData,
            "MasterList"    : masterList
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatIncidentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatActionTrail(userIdFromToken, getIncidentDataDBResponse, accountGUIDFromToken){

    let commentsHis    = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatActionTrail : Execution start. ');

          // Result Set 1: Incident Data
          if(getIncidentDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getIncidentDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let incObj of Object.values(getIncidentDataDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                let comments    = [];

                //formating review comments 
                if(incObj.IncidentReviewComments != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    for(let cmtObj of Object.values(JSON.parse(incObj.IncidentReviewComments))){
                        comments.push({
                            "IncidentCommentID" : cmtObj.IncidentReviewCommentID,
                            "CommentBody"       : cmtObj.IncidentReviewComment,
                            "CreatedDate"       : cmtObj.CreatedDate,
                            "UserGUID"          : cmtObj.UserGUID,
                            "CommentUserName"   : cmtObj.UserName
                        })
                    }
                }

                commentsHis.push({
                    "IncidentID"        : incObj.IncidentID,
                    "IncidentTitle"     : incObj.Title,
                    "CommentsHistory"   : comments
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatActionTrail : Execution end. ');

        //Formating Final ResultSet
        return {
            "actionTrailList"  : commentsHis
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatActionTrail : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function calculateFilterStatusID(userIdFromToken,incObj){

    let currentDate    = new Date().toDateString();
    let filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

   try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatActionTrail : Execution start. ');

        // Calculating status for listing page filter
        if(!(incObj.IsApproved == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incObj.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) && incObj.StatusID != CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
            // Case :: Under Review
            filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        }
        else if(incObj.StatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
            // Case :: Closed
            filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        }
        else if((new Date(incObj.EndDate) < new Date(currentDate)) && incObj.StatusID != CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
            // Case :: Reviews Delayed
            filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        }
        else{
            filterStatusId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatActionTrail : Execution end. ');

        return filterStatusId;
    }
   catch(error){
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : getFormatActionTrail : Execution end. '+error);
        CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
    
}

async function fetchUniqueMailsList(userIdFromToken,emailList){
    let uniqueEmailArray    = [];
    let emailIds            = '';

   try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : fetchUniqueRecipentsEmailIds : Execution start. ');

        if(emailList && emailList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            const uniqueEmails = new Set();
            emailList.forEach(item => {
                uniqueEmails.add(item.EmailID);
            });
            uniqueEmailArray = Array.from(uniqueEmails);
        }  
        
        emailIds = uniqueEmailArray.join(",");

        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : fetchUniqueRecipentsEmailIds : Execution end. ');
        return emailIds;

    }catch(error){
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentReportBl : fetchUniqueRecipentsEmailIds : Execution end. '+ error);
        CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
    
}

async function getUserName(userIdFromToken,String){
    logger.log('info', 'User Id : '+ userIdFromToken +': IncidentReportBl : getUserName : Execution start.');
    try {

    // Find the position of the last hyphen
	let lastIndex = String.lastIndexOf('-');
	
	// Split the string at the last hyphen
	let userName    = String.substring(0, lastIndex);
	let domainName  = String.substring(lastIndex + 1);
	return userName;

    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +':: IncidentReportBl : getUserName : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatEvidenceList(userIdFromToken,evidenceAttachmentsResponse, accountGUIDFromToken){
    let evidences = [];
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : : IncidentReportBl : : getFormatEvidenceList : Execution start.'+ evidenceAttachmentsResponse); 

           // Result Set 1: Uploaded evidence list 
           if(evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let evObj of Object.values(evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                evidences.push({
                    "AttachmentID"      : evObj.EvidenceID,
                    "AttachmentName"    : evObj.FileName,
                    "CreatedDate"       : evObj.CreatedDate,
                    "AttachmentType"    : evObj.FileType,
                    "FileContent"       : evObj.Content,
                    "FileContentID"     : evObj.FileContentID,
                    "IsVisible"         : evObj.IsVisible,
                    "CreatedBy"         : evObj.CreatedBy
                    
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : : IncidentReportBl : : getFormatEvidenceList : Execution end.'); 
        return {
            "attachmentDetails" : evidences
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : : IncidentReportBl : : getFormatEvidenceList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getIncidentReportBLClassInstance() {
    if (IncidentReportBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    IncidentReportBLClassInstance = new IncidentReportBl();
    }
    return IncidentReportBLClassInstance;
}

exports.getIncidentReportBLClassInstance = getIncidentReportBLClassInstance;