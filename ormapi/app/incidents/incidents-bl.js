const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const INCIDENTS_DB          = require('../../data-access/incidents-db.js');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
const BINARY_DATA           = require('../../utility/binary-data.js');
const EMAIL_NOTIFICATION    = require('../../utility/email-notification.js');
const INAPP_NOTIFICATION_DB = require('../../data-access/inApp-notification-db.js');

// ORM Email Templates: Now fully data-driven via database (ORM_EmailTemplate table)
// Legacy file-based template imports removed - templates resolved via workflow-step-based resolution
const UtilityApp = require('../../utility/utility.js');
const { logger } = require('../../utility/log-manager/log-manager.js');
const { resolveOrmEmailTemplate, resolveOrmEmailTemplateByCode } = require('../../utility/orm-email-template-resolver.js');

var appValidatorObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var incidentsDbObject           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var incidentsBLClassInstance    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var binarydataObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var notificationObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class IncidentsBl {
    constructor() {
        appValidatorObject          = new APP_VALIATOR();
        incidentsDbObject           = new INCIDENTS_DB();
        binarydataObject            = new BINARY_DATA();
        notificationObject          = new EMAIL_NOTIFICATION();
        inAppNotificationDbObject   = new INAPP_NOTIFICATION_DB();
        utilityAppObject            = new UtilityApp();
    }

    start() {

    }

    /**
     * Get incidents master data from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getIncidentMasterData(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;           

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : Execution started.');

            const GET_INCIDENT_MASTER_DATA = await incidentsDbObject.getIncidentMasterData(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            // logger.log('info', ' : IncidentsBl : getIncidentMasterData : GET_INCIDENT_MASTER_DATA : ' + JSON.stringify(GET_INCIDENT_MASTER_DATA));

            // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : GET_INCIDENT_MASTER_DATA.' + JSON.stringify(GET_INCIDENT_MASTER_DATA));

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_MASTER_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_MASTER_DATA){
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : Execution end. : GET_INCIDENT_MASTER_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_MASTER_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : Execution end. : Error details : ' + GET_INCIDENT_MASTER_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_MASTER_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_MASTER_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : Execution end. : Error details : ' + GET_INCIDENT_MASTER_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            const INCIDENT_MASTER_DATA_RESPONSE = await formatGetIncidentMasterData(userIdFromToken,GET_INCIDENT_MASTER_DATA);
            // logger.log('info', ' : IncidentsBl : getIncidentMasterData : INCIDENT_MASTER_DATA_RESPONSE : ' + JSON.stringify(INCIDENT_MASTER_DATA_RESPONSE));

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : Execution end. : Get Incidents master data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, INCIDENT_MASTER_DATA_RESPONSE));

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To set incident master data
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setIncidentMasterData(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            var data = {
                types               : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                source              : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                criticality         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                riskLossCategory    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                reviewers           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                approvers           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };           

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            data.types              = request.body.incidentTypes;
            data.source             = request.body.sourceOfIdentifications;
            data.criticality        = request.body.criticality;
            data.riskLossCategory   = request.body.operationalRiskLossEventCategory; 
            data.reviewers          = request.body.incidentReviewers;
            data.approvers          = request.body.incidentApprovalUsers; 
            data.checkers          = request.body.IncidentCheckers; 

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData : Execution started.');

            const SET_INCIDENT_MASTER = await incidentsDbObject.setIncidentMasterData(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData :SET_INCIDENT_MASTER:' + JSON.stringify(SET_INCIDENT_MASTER));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_INCIDENT_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_INCIDENT_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData : Execution end. :  SET_INCIDENT_MASTER is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_INCIDENT_MASTER.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData : Execution end. : Error details : ' + SET_INCIDENT_MASTER.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_INCIDENT_MASTER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_INCIDENT_MASTER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData : Execution end. : Error details : ' + SET_INCIDENT_MASTER.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const INCIDENT_MASTER_DATA_RESPONSE = await formatGetIncidentMasterData(userIdFromToken, SET_INCIDENT_MASTER);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData : Execution end. : Incident master data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, INCIDENT_MASTER_DATA_RESPONSE));        
            
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get incidents list from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getIncidents(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentsData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let recommendationStatusData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
           

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : Execution started.');

            const GET_INCIDENTS_LIST = await incidentsDbObject.getIncidents(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : GET_INCIDENTS_LIST response.' + JSON.stringify(GET_INCIDENTS_LIST));
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENTS_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENTS_LIST){
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : Execution end. : GET_INCIDENTS_LIST is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENTS_LIST.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : Execution end. : Error details : ' + GET_INCIDENTS_LIST.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENTS_LIST.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENTS_LIST.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : Execution end. : Error details : ' + GET_INCIDENTS_LIST.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }            

            const GET_USER_ALERTS  = await inAppNotificationDbObject.getUserAlerts(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_USER_ALERTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_USER_ALERTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : GET_USER_ALERTS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_USER_ALERTS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : Error details :' + GET_USER_ALERTS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_USER_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_ALERTS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : Error details : ' + GET_USER_ALERTS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            incidentsData               = GET_INCIDENTS_LIST.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            recommendationStatusData    = GET_INCIDENTS_LIST.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            
            const GET_INCIDENTS_FORMAT_DATA = await getFormatIncidentData(userIdFromToken,incidentsData,recommendationStatusData,GET_USER_ALERTS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENTS_FORMAT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENTS_FORMAT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidents : Execution end. : GET_INCIDENTS_FORMAT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : Execution end. : Get Incidents list successfully.' + JSON.stringify(GET_INCIDENTS_FORMAT_DATA));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_INCIDENTS_FORMAT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidents : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    
    /**
     * Get info for add new incident reporting from  Database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getIncidentInfo(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let groupData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let locationData            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentTypeData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentSourceData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentCriticalityData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let lossCategoryData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let currentUserData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution started.');

            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : GET_INCIDENT_INFO response.' + JSON.stringify(GET_INCIDENT_INFO));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

             //Formatting Resultset of get Incident info data
            const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : INCIDENT_INFO_DATA response.' + JSON.stringify(INCIDENT_INFO_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution end. : Get info for incident reporting successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, INCIDENT_INFO_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To Get incident details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getIncidentDetails(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let groupData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let locationData            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentTypeData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentSourceData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentCriticalityData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let lossCategoryData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let currentUserData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;                             

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const GET_INCIDENT_DATA = await incidentsDbObject.getIncidentDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIncidentDetails : Execution started.GET_INCIDENT_DATA' + JSON.stringify(GET_INCIDENT_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution end. : Error details : ' + GET_INCIDENT_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution end. : Error details : ' + GET_INCIDENT_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            const INCIDENT_DATA_RESPONSE = await formatGetIncidentDetails(userIdFromToken,GET_INCIDENT_DATA,userNameFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : INCIDENT_DATA_RESPONSE response : ' + JSON.stringify(INCIDENT_DATA_RESPONSE));

            // Adding incident info details : Start
            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentDetails : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentDetails : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentDetails : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Formatting Resultset of get Incident info data
             const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO);
             logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentDetails : INCIDENT_INFO_DATA response : ' + JSON.stringify(INCIDENT_INFO_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentDetails : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // Adding incident info details : End

            // Merging incident details and incident info details
            const GET_INCIDENT = {...INCIDENT_DATA_RESPONSE,...INCIDENT_INFO_DATA};
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : GET_INCIDENT response : ' + JSON.stringify(GET_INCIDENT));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : getIncidentDetails : Execution end. : GET_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution end. : Get incident Details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_INCIDENT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : getIncidentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To upload incident evidence 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async uploadIncidentEvidence(request, response) {
        try {

            response.setTimeout(1200000);

            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var remarks             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var destinationPath     = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {               
                fileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL 
            };
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remarks             = request.body.remarks;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;          

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution started.');

            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)
            {
                const ALLOWED_FILE_EXTENSION_TYPES  = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES       = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_MIME_TYPES
                
                await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES,ALLOWED_FILE_MIME_TYPES, userIdFromToken, function(fileUploadResponseObject){
                    if(fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
                  
                        data.fileName       = fileUploadResponseObject.fileName;                        
                        data.fileContent    = fileUploadResponseObject.fileDataContent;
                        data.fileType       = fileUploadResponseObject.fileExtension;

                        incidentsDbObject.uploadIncidentEvidence(userIdFromToken, userNameFromToken, data,remarks, accountGUIDFromToken, async function(ADD_INCIDENT_EVIDENCE){
                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_INCIDENT_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_INCIDENT_EVIDENCE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution end. : Upload RAT response is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_INCIDENT_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution end. : Error details : ' + ADD_INCIDENT_EVIDENCE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_INCIDENT_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_INCIDENT_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution end. : Error details : ' + ADD_INCIDENT_EVIDENCE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                            }

                            /**
                             * Formating resultset provided by DB : START.
                             */
                            const FORMAT_DATA_RESULT =  await formatEvidencelist(userIdFromToken,ADD_INCIDENT_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                            /**
                             * Formating resultset provided by DB : END.
                             */

                            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DATA_RESULT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DATA_RESULT) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution end. : FORMAT_DATA_RESULT is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                            }
                                
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution end. : Incident evidence uploaded successfully.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL,FORMAT_DATA_RESULT));
                        });
                    }
                    else {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : uploadIncidentEvidence : Execution end. : Error on dumping file into server. : Error detail : '+fileUploadResponseObject.errorMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                });
            } 
            else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : uploadIncidentEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadIncidentEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }

    /**
     * To download Incidents evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async downloadIncidentEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;         

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : downloadIncidentEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            evidenceID  =  data.evidenceID;

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : downloadIncidentEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

           const DOWNLOAD__RESPONSE = await incidentsDbObject.downloadIncidentEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD__RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD__RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution end. : DOWNLOAD__RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD__RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
    
            //Formating DB response 
            const INCIDENTS_DOWNLOAD_RESPONSE = await formatDownloadResponse(userIdFromToken,DOWNLOAD__RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENTS_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENTS_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution end. : GET_INCIDENTS_FORMAT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution end. : Incident evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, INCIDENTS_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadIncidentEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }  
    
    /**
     * To delete Incident evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteIncidentEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;          

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteIncidentEvidence : Execution started.');

            
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : deleteIncidentEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            evidenceID  =  data.evidenceID;

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : deleteIncidentEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await incidentsDbObject.deleteIncidentEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteIncidentEvidence : Execution end. : DELETE_RESPONSE of Incident is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteIncidentEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteIncidentEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteIncidentEvidence : Execution end. : Incident evidence deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteIncidentEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To upload RCA evidence 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async uploadRcaEvidence(request, response) {
        try {

            response.setTimeout(1200000);

            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var remarks             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var destinationPath     = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {               
                fileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL 
            };
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remarks             = request.body.remarks;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRcaEvidence : Execution started.');

            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)
            {
                const ALLOWED_FILE_EXTENSION_TYPES  = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES       = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_MIME_TYPES

                await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES,ALLOWED_FILE_MIME_TYPES, userIdFromToken, function(fileUploadResponseObject){
                    if(fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
                      
                        data.fileName           = fileUploadResponseObject.fileName;                        
                        data.fileContent        = fileUploadResponseObject.fileDataContent;
                        data.fileType           = fileUploadResponseObject.fileExtension;

                        incidentsDbObject.uploadRcaEvidence(userIdFromToken, userNameFromToken, data,remarks, accountGUIDFromToken, async function(RCA_EVIDENCE){
                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCA_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCA_EVIDENCE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRcaEvidence : Execution end. : Upload RAT response is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (RCA_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRcaEvidence : Execution end. : Error details : ' + RCA_EVIDENCE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (RCA_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCA_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRcaEvidence : Execution end. : Error details : ' + RCA_EVIDENCE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                            }

                            /**
                             * Formating resultset provided by DB : START.
                             */
                            const FORMAT_DATA_RESULT =  await formatEvidencelist(userIdFromToken,RCA_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                            /**
                             * Formating resultset provided by DB : END.
                             */
                                
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRcaEvidence : Execution end. : RCA evidence uploaded successfully.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_DATA_RESULT));
                        });
                    }
                    else {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : uploadRcaEvidence : Execution end. : Error on dumping file into server. : Error detail : '+fileUploadResponseObject.errorMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                });
            } 
            else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : uploadRcaEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRcaEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }

    /**
     * To download RCA evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async downloadRcaEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : downloadRcaEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            evidenceID  =  data.evidenceID;

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : downloadRcaEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DOWNLOAD_RCA_RESPONSE = await incidentsDbObject.downloadRcaEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD_RCA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD_RCA_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution end. : DOWNLOAD_RCA_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_RCA_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution end. : Error details : ' + DOWNLOAD_RCA_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_RCA_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD_RCA_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution end. : Error details : ' + DOWNLOAD_RCA_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            //Formating DB response 
            const FORMAT_DOWNLOAD_RCA_RESPONSE = await formatDownloadResponse(userIdFromToken,DOWNLOAD_RCA_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_RCA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_RCA_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution end. : FORMAT_DOWNLOAD_RCA_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution end. : RCA evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, FORMAT_DOWNLOAD_RCA_RESPONSE));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRcaEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To delete RCA evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteRcaEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRcaEvidence : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : deleteRcaEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            evidenceID  =  data.evidenceID;

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : deleteRcaEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await incidentsDbObject.deleteRcaEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRcaEvidence : Execution end. : DELETE_RESPONSE of RCA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRcaEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRcaEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRcaEvidence : Execution end. : RCA evidence file deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRcaEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To upload Recommendation evidence 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async uploadRecomendationEvidence(request, response) {
        try {
            response.setTimeout(1200000);

            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var destinationPath     = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {               
                fileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL 
            };
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRecomendationEvidence : Execution started.');

            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)
            {
                const ALLOWED_FILE_EXTENSION_TYPES  = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES       = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_MIME_TYPES

                await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES,ALLOWED_FILE_MIME_TYPES, userIdFromToken, function(fileUploadResponseObject){
                    if(fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
                        data.fileName       = fileUploadResponseObject.fileName;                        
                        data.fileContent    = fileUploadResponseObject.fileDataContent;
                        data.fileType       = fileUploadResponseObject.fileExtension;

                        incidentsDbObject.uploadRecomendationEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken, async function(RECOMMENDATION_EVIDENCE){
                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RECOMMENDATION_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RECOMMENDATION_EVIDENCE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRecomendationEvidence : Execution end. : Upload RAT response is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (RECOMMENDATION_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRecomendationEvidence : Execution end. : Error details : ' + RECOMMENDATION_EVIDENCE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (RECOMMENDATION_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RECOMMENDATION_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRecomendationEvidence : Execution end. : Error details : ' + RECOMMENDATION_EVIDENCE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                            }
                            /**
                             * Formating resultset provided by DB : START.
                             */
                            const FORMAT_DATA_RESULT =  await formatRecommendationEvidencelist(userIdFromToken,RECOMMENDATION_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                            /**
                             * Formating resultset provided by DB : END.
                             */
                                
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRecomendationEvidence : Execution end. : Incident evidence uploaded successfully.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_DATA_RESULT));
                        });
                    }
                    else {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : uploadRecomendationEvidence : Execution end. : Error on dumping file into server. : Error detail : '+fileUploadResponseObject.errorMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                });
            } 
            else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : uploadRecomendationEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : uploadRecomendationEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }

    /**
     * To download Recommendation evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async downloadRecomendationEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : downloadRecomendationEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            evidenceID  =  data.evidenceID;

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : downloadRecomendationEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DOWNLOAD_RESPONSE = await incidentsDbObject.downloadRecomendationEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution end. : DOWNLOAD_RESPONSE of recommendation is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution end. : Error details : ' + DOWNLOAD_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution end. : Error details : ' + DOWNLOAD_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            //Formating DB response 
            const FORMAT_DOWNLOAD_RESPONSE = await formatDownloadResponse(userIdFromToken,DOWNLOAD_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution end. : FORMAT_DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution end. : Recommendation evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, FORMAT_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : downloadRecomendationEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To delete Recommendation evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteRecomendationEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRecomendationEvidence : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : deleteRecomendationEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            evidenceID  =  data.evidenceID;

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : deleteRecomendationEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await incidentsDbObject.deleteRecomendationEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRecomendationEvidence : Execution end. : DELETE_RESPONSE of recommendation is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRecomendationEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRecomendationEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRecomendationEvidence : Execution end. : Recommendation evidence Deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : deleteRecomendationEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To save incident data
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setIncident(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
  
            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             =  request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            data                        = request.body.data;
            accountGUIDFromToken        = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution started.');

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : userIdFromToken.' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : userNameFromToken.' + userNameFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            const SAVE_INCIDENT = await incidentsDbObject.setIncident(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : SAVE_INCIDENT response.' + JSON.stringify(SAVE_INCIDENT));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_INCIDENT.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution end. : Error details : ' + SAVE_INCIDENT.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_INCIDENT.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_INCIDENT.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution end. : Error details : ' + SAVE_INCIDENT.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const INCIDENT_DATA_RESPONSE = await formatGetIncidentDetails(userIdFromToken, SAVE_INCIDENT,userNameFromToken);

            // Adding incident info details : Start
            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncident : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncident : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncident : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Formatting Resultset of get Incident info data
            const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken, GET_INCIDENT_INFO);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncident : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // Adding incident info details : End

            // Merging incident details and incident info details
            const GET_INCIDENT = {
                ...INCIDENT_DATA_RESPONSE,
                ...INCIDENT_INFO_DATA
            };

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncident : Execution end. : GET_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
 

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution end. : Incidents saved successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, GET_INCIDENT));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsBl : setIncident : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }    

    /**
     * To save comment on workflow action and update incident status
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setIncidentStatus(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var Action                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var inAppMessage            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentStatus : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : setIncidentStatus : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                // Case Reviewer Rejected Incident, which is submitted by Reportee
                data.isReviewed = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR){
                // Case Reviewer Approved Incident, which is submitted by Reportee
                data.isReviewed = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE){
                // Case Approver Rejected Incident, which is submitted by Reviewer
                data.isApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX){
                // Case Approver Approved Incident, which is submitted by Reviewer
                data.isApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE){
                // Case when checker rejects the incident
                data.IsChecked = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
                // Case when checker approves the incident
                data.IsChecked = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TEN){
                // Case when checker rejects and close the incident
                Action = "Rejected and Closed"
                inAppMessage = "Rejected and Closed"
                data.IsChecked = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }
            const SET_INCIDENT_STATUS = await incidentsDbObject.setIncidentStatus(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : SET_INCIDENT_STATUS : '+JSON.stringify(SET_INCIDENT_STATUS || null));

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_INCIDENT_STATUS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_INCIDENT_STATUS){
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentStatus : Execution end. : SET_INCIDENT_STATUS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_INCIDENT_STATUS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentStatus : Execution end. : Error details : ' + SET_INCIDENT_STATUS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_INCIDENT_STATUS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_INCIDENT_STATUS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentStatus : Execution end. : Error details : ' + SET_INCIDENT_STATUS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            } 

            const INCIDENT_DATA_RESPONSE = await formatGetIncidentDetails(userIdFromToken, SET_INCIDENT_STATUS,userNameFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : INCIDENT_DATA_RESPONSE : '+JSON.stringify(INCIDENT_DATA_RESPONSE || null));

            try {
                /**
                 * Sending email notification : START
                 */

                // INCIDENT_DATA_RESPONSE
                let templateMasterData = INCIDENT_DATA_RESPONSE.incidentData[0]
                templateMasterData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                templateMasterData["IncidentCode_1"] = INCIDENT_DATA_RESPONSE.incidentData[0].IncidentCode;
                templateMasterData["IncidentCode_2"] = INCIDENT_DATA_RESPONSE.incidentData[0].IncidentCode; 
                templateMasterData["ReporterName_1"] = INCIDENT_DATA_RESPONSE.incidentData[0].ReporterName; 
                templateMasterData["ClosedDate"] = utilityAppObject.formatDate(userIdFromToken,SET_INCIDENT_STATUS.recordset[11][0].ClosureDate); 
                templateMasterData["NewIncidentDate"] = utilityAppObject.formatDate(userIdFromToken,(INCIDENT_DATA_RESPONSE.incidentData[0].ReportingDate));
                templateMasterData["inAppMessage"] = inAppMessage
                let NAV_LINK                                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
               
                let EmailData = INCIDENT_DATA_RESPONSE.EmailDetails;
                let FinancialEmailList = INCIDENT_DATA_RESPONSE.FinancialEmailDetails

                // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : EmailData : '+ JSON.stringify(EmailData || null));
                // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : templateMasterData : '+ JSON.stringify(templateMasterData || null));

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : currentStatusCode : '+ (data.currentStatusCode || null));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : nextStatusCode    : '+ (data.nextStatusCode || null));
               
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailData.toUserEmailIDs || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailData.toUserEmailIDs || 
                    CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY == EmailData.toUserEmailIDs) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : Mailer list is undefined or null.');
                } else {
                    // ORM: Data-driven email template resolution using workflow-step-based approach
                    // Step 1: Determine workflow step code from status transition
                    const workflowStepCode = getWorkflowStepCodeForIncidentTransition(data.currentStatusCode, data.nextStatusCode);
                    
                    // Step 2: Determine reviewer type (INTERNAL/EXTERNAL)
                    const reviewerTypeCode = getReviewerTypeForIncident(INCIDENT_DATA_RESPONSE.incidentData[0], templateMasterData);
                    
                    // Step 3: Set action and in-app message based on status transition
                    let templateKey = ''; // Fallback template key for backward compatibility
                    Action = '';
                    inAppMessage = '';
                    
                    // Set action and message based on status transitions
                    if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (8 to 2) : Execution started.');
                        Action = "Submitted by Checker";
                        inAppMessage = "Incident submitted for review:";
                        templateKey = 'SUBMIT_TO_REVIEWER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TEN) {
                        inAppMessage = "Incident has been Rejected and Closed";
                        Action = "Rejected and Closed";
                        templateKey = 'REJECT_CLOSED_CHECKER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (2 to 3) : Execution started.');
                        inAppMessage = "Incident Rejected by the Reviewer";
                        templateKey = 'REVIEWER_REJECT_EMAIL_TEMPLATE'; // Fallback
                    } else if ((data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO || data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN) 
                        && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (' + data.currentStatusCode + ' to 4) : Execution started.');
                        inAppMessage = "Incident submitted for Approval/Rejection:";
                        templateKey = 'SUBMIT_TO_APPROVER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (4 to 5) : Execution started.');
                        inAppMessage = "Incident Rejected by Approver:";
                        templateKey = 'APPROVER_REJECT_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (5 to 3) : Execution started.');
                        inAppMessage = "Incident Rejected by the Reviewer";
                        templateKey = 'REVIEWER_REJECT_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (4 to 6) : Execution started.');
                        inAppMessage = "Incident approved for required action";
                        templateKey = 'INCIDENT_APPROVAL_APPROVER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (1 to 11) : Execution started.');
                        inAppMessage = "Incident submitted for review";
                        templateKey = 'SUBMIT_TO_REVIEWER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (3 to 2) : Execution started.');
                        inAppMessage = "Incident Re-Submitted for Review";
                        templateKey = 'RESUBMIT_TO_REVIEWER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (3 to 8) : Execution started.');
                        inAppMessage = "Incident Re-submitted for internal review";
                        templateKey = 'RE_SUBMIT_REPORTEE_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (5 to 4) : Execution started.');
                        inAppMessage = "Incident Re-Submitted for Review";
                        templateKey = 'RESUBMIT_TO_REVIEWER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (6 to 7) : Execution started.');
                        inAppMessage = "Incident Closure";
                        templateKey = 'INCIDENT_CLOSURE_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TEN) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (8 to 10) : Execution started.');
                        inAppMessage = "Incident Rejected and Closed by the Incident Unit Head";
                        templateKey = 'REJECT_CLOSED_CHECKER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (8 to 9) : Execution started.');
                        Action = "Rejected by Checker";
                        inAppMessage = "Incident Rejected by the Incident Unit Head";
                        templateKey = 'REJECT_CHECKER_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (1 to 8) : Execution started.');
                        inAppMessage = "Incident submitted for internal review";
                        templateKey = 'SUBMIT_REPORTEE_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (12 to 11) : Execution started.');
                        inAppMessage = "Incident Re-submitted for internal review";
                        templateKey = 'RE_SUBMIT_REPORTEE_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (11 to 12) : Execution started.');
                        inAppMessage = "Incident Rejected by the Reviewer";
                        templateKey = 'REVIEWER_REJECT_EMAIL_TEMPLATE'; // Fallback
                    } else if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.NINE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : (9 to 8) : Execution started.');
                        inAppMessage = "Incident Re-submitted for internal review";
                        templateKey = 'RE_SUBMIT_REPORTEE_EMAIL_TEMPLATE'; // Fallback
                    }

                    // Prepare template master data
                    let filterFullName = SET_INCIDENT_STATUS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].filter((ele => ele.Action == Action));
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : filterFullName : ' + JSON.stringify(filterFullName));
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : workflowStepCode=' + (workflowStepCode || 'null') + ', reviewerTypeCode=' + reviewerTypeCode + ', templateKey=' + templateKey);
                    
                    templateMasterData["CheckerUser"] = filterFullName.length > 0 ? filterFullName[0].FullName : "";
                    templateMasterData["CheckerUser_1"] = filterFullName.length > 0 ? filterFullName[0].FullName : "";
                    templateMasterData["inAppMessage"] = inAppMessage;
                    let NAV_LINK = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

                    // Step 4: Resolve email template using workflow-step-based resolution (preferred) or fallback
                    if (workflowStepCode || (templateKey && CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey.trim())) {
                        const emailTemplateObj = await resolveIncidentEmailTemplate(workflowStepCode, reviewerTypeCode, templateKey, templateMasterData, userIdFromToken);
                        
                            try {
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailData || EmailData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : EmailData is undefined or null.');
                                } else {
                                    var toEmailIDs = await filterEmailIds(userIdFromToken, EmailData.toUserEmailIDs);
                                    var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailData.ccUserEmailIDs);
                                    let toccEmails = {
                                        "TOEmail": toEmailIDs,
                                        "CCEmail": ccEmailIDs
                                    }

                                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : toccEmails : ' + JSON.stringify(toccEmails || null));
                                    if (emailTemplateObj && templateMasterData && toccEmails) {
                                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData, toccEmails);
                                    } else {
                                        if (!emailTemplateObj) {
                                            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email NOT sent - Template not found. workflowStepCode=' + (workflowStepCode || 'null') + ', reviewerTypeCode=' + (reviewerTypeCode || 'null') + ', templateKey=' + (templateKey || 'null'));
                                        } else if (!toccEmails || (!toccEmails.TOEmail && !toccEmails.CCEmail)) {
                                            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email NOT sent - No recipient emails found.');
                                        }
                                    }
                                // logger.log('info', 'templateMasterData: ' + templateMasterData[0].IncidentCode);
                                // logger.log('info', 'templateMasterData: ' + templateMasterData.IncidentCode);
                                logger.log('info', 'templateMasterData: ' + JSON.stringify(templateMasterData));



                                var senderGUID = await filterUserGUIDs(userIdFromToken, EmailData.toUserEmailIDs);
                                var ccEmailID = await filterUserGUIDs(userIdFromToken, EmailData.ccUserEmailIDs)

                                let messageData = '';
                                if (EmailData && EmailData.length > 0) {
                                    if (EmailData[0].UnitName) {
                                        messageData = EmailData[0].UnitName;
                                    } else if (EmailData[0].FrameworkName) {
                                        messageData = EmailData[0].FrameworkName;
                                    }
                                }  
                                // let navUrl = NAV_LINK + 'orm/incident-list';
                                let inappDetails = {
                                    inAppContent: inAppMessage +": "  + templateMasterData["IncidentCode"] + messageData + " link:" + "incident-list" ,
                                    recepientUserID: senderGUID + "," + ccEmailID,
                                    subModuleID      : 3
                                }


                                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email :   inappDetails : ' + JSON.stringify(inappDetails || null));
                                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email :   senderGUID : ' + JSON.stringify(senderGUID || null));
                                // if (senderGUID && CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== messageData) {
                                    await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                                // }
                            }
                        } catch (error) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus-EmailNotification : Notification error ' + error);
                        }

                    }
                }
                
                // Only check and process financial loss emails if IsFinancialLoss is "Yes"
                if (data.IsFinancialLoss == "Yes") {
                    // Check if financialToEmailDetails is undefined, null, empty string, or empty array
                    const isFinancialEmailListEmpty = (
                        CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FinancialEmailList.financialToEmailDetails || 
                        CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FinancialEmailList.financialToEmailDetails || 
                        CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY == FinancialEmailList.financialToEmailDetails ||
                        (Array.isArray(FinancialEmailList.financialToEmailDetails) && FinancialEmailList.financialToEmailDetails.length === 0)
                    );
                    
                    if (isFinancialEmailListEmpty) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : Mailer list for financial loss is undefined, null, or empty. financialToEmailDetails=' + JSON.stringify(FinancialEmailList.financialToEmailDetails));
                    } else {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email for IsFinancialLoss : Execution started.');
                        inAppMessage = "Incident created with Financial Loss"
                        let templateKey = 'INCIDENT_APPROVAL_TEMPLATE';
                        
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : templateKey : '+ templateKey);

                        // ORM: Resolve email template for financial loss notification
                        // Note: Financial loss notifications may not have workflow step codes yet
                        // Using template-code-based resolution as fallback
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                        const emailTemplateObj = await resolveIncidentEmailTemplate(null, null, templateKey, templateMasterData, userIdFromToken);

                        if (emailTemplateObj && emailTemplateObj.Subject) {
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email : emailTemplateObj : ' + JSON.stringify(emailTemplateObj || null));
                            try {
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailData || EmailData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : EmailData is undefined or null.');
                            } else {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : FinancialEmailList.' + JSON.stringify(FinancialEmailList));

                                var toEmailIDs = await filterEmailIds(userIdFromToken,FinancialEmailList.financialToEmailDetails);
                                var ccEmailIDs = await filterEmailIds(userIdFromToken, FinancialEmailList.financialCCEmailDetails);
                                let toccEmails = {
                                    "TOEmail": toEmailIDs,
                                    "CCEmail": ccEmailIDs
                                }

                                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email :   toccEmails : ' + JSON.stringify(toccEmails || null));
                                if (emailTemplateObj && templateMasterData && toccEmails) {
                                    await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData, toccEmails);
                                }

                                // logger.log('info', 'templateMasterData: ' + templateMasterData[0].IncidentCode);
                                // logger.log('info', 'templateMasterData: ' + templateMasterData.IncidentCode);
                                logger.log('info', 'templateMasterData: ' + JSON.stringify(templateMasterData));
                                var senderGUID = await filterUserGUIDs(userIdFromToken, EmailData.toUserEmailIDs);
                                var ccEmailID = await filterUserGUIDs(userIdFromToken, EmailData.ccUserEmailIDs)

                                let messageData = '';
                                if (EmailData && EmailData.length > 0) {
                                    if (EmailData[0].UnitName) {
                                        messageData = EmailData[0].UnitName;
                                    } else if (EmailData[0].FrameworkName) {
                                        messageData = EmailData[0].FrameworkName;
                                    }
                                }  
                                // let navUrl = NAV_LINK + 'orm/incident-list';

                                let inappDetails = {
                                    inAppContent: inAppMessage +": " + templateMasterData["IncidentCode"] + messageData + " link:" + "incident-list",
                                    recepientUserID: senderGUID + "," + ccEmailID
                                }


                                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email :   inappDetails : ' + JSON.stringify(inappDetails || null));
                                if (senderGUID && CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== messageData) {
                                    await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                                }
                            }
                            } catch (error) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus-EmailNotification : Notification error ' + error);
                            }
                        }
                        }

                    }

                }

                /**
                 * Sending email notification : END
                 */
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus-EmailNotification : Notification error ' + error);
            }

            // Adding incident info details : Start
            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Formatting Resultset of get Incident info data
            const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // Adding incident info details : End

            // Merging incident details and incident info details
            const GET_INCIDENT = {...INCIDENT_DATA_RESPONSE, ...INCIDENT_INFO_DATA};

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Execution end. : GET_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentStatus : Execution end. : Recommendations added  successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, GET_INCIDENT));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To save RCA, comment and create recommendations by reviewer.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setIncidentReview(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let groupData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let locationData            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentTypeData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentSourceData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentCriticalityData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let lossCategoryData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let currentUserData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken; 
        
            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : setIncidentReview : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const SET_REVIEW_INCIDENT = await incidentsDbObject.setIncidentReview(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview Response : ' +JSON.stringify(SET_REVIEW_INCIDENT));
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_REVIEW_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_REVIEW_INCIDENT){
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview : Execution end. : SET_REVIEW_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_REVIEW_INCIDENT.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview : Execution end. : Error details : ' + SET_REVIEW_INCIDENT.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_REVIEW_INCIDENT.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_REVIEW_INCIDENT.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview : Execution end. : Error details : ' + SET_REVIEW_INCIDENT.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const INCIDENT_DATA_RESPONSE = await formatGetIncidentDetails(userIdFromToken, SET_REVIEW_INCIDENT,userNameFromToken);

            // Adding incident info details : Start
            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentReview : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentReview : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentReview : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Formatting Resultset of get Incident info data
            const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentReview : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // Adding incident info details : End

            // Merging incident details and incident info details
            const GET_INCIDENT = {...INCIDENT_DATA_RESPONSE,...INCIDENT_INFO_DATA};

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentReview : Execution end. : GET_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview : Execution end. : Recommendations reviewed successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, GET_INCIDENT));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setIncidentReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To save action-taken into recomendations by maker (Unit).
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRecommendationAction(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let groupData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let locationData            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentTypeData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentSourceData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let incidentCriticalityData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let lossCategoryData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let currentUserData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;            

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationAction : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : setRecommendationAction : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const ADD_RECOMMENDATION = await incidentsDbObject.setRecommendationAction(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_RECOMMENDATION || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_RECOMMENDATION){
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationAction : Execution end. : ADD_RECOMMENDATION is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_RECOMMENDATION.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationAction : Execution end. : Error details : ' + ADD_RECOMMENDATION.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_RECOMMENDATION.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_RECOMMENDATION.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationAction : Execution end. : Error details : ' + ADD_RECOMMENDATION.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const INCIDENT_DATA_RESPONSE = await formatGetIncidentDetails(userIdFromToken, ADD_RECOMMENDATION,userNameFromToken);

            // Adding incident info details : Start
            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationAction : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationAction : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationAction : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Formatting Resultset of get Incident info data
            const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationAction : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // Adding incident info details : End

            // Merging incident details and incident info details
            const GET_INCIDENT = {...INCIDENT_DATA_RESPONSE,...INCIDENT_INFO_DATA};

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationAction : Execution end. : GET_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationAction : Execution end. : Recommendations added  successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, GET_INCIDENT));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationAction : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To save comment on workflow action and update recommendation status.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRecommendationStatus(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let inAppMessage            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let groupData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let unitData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let locationData            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let incidentTypeData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let incidentSourceData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let incidentCriticalityData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let lossCategoryData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let userData                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // let currentUserData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : incidentsBl : setRecommendationStatus : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){            
                // Case Reviewer Rejected Recommendation, which is Claimed Close by Reportee
                data.isApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            }
            if(data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                // Case Reviewer Approved Recommendation, which is Claimed Close by Reportee
                data.isApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            }else{
                data.isApproved = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            }
        
            const SET_RECOMMENDATION_STATUS = await incidentsDbObject.setRecommendationStatus(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : SET_RECOMMENDATION_STATUS : ' + JSON.stringify(SET_RECOMMENDATION_STATUS || null));

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_RECOMMENDATION_STATUS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_RECOMMENDATION_STATUS){
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : Execution end. : SET_RECOMMENDATION_STATUS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RECOMMENDATION_STATUS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : Execution end. : Error details : ' + SET_RECOMMENDATION_STATUS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RECOMMENDATION_STATUS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_RECOMMENDATION_STATUS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : Execution end. : Error details : ' + SET_RECOMMENDATION_STATUS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const INCIDENT_DATA_RESPONSE = await formatGetIncidentDetails(userIdFromToken, SET_RECOMMENDATION_STATUS,userNameFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : INCIDENT_DATA_RESPONSE : ' + JSON.stringify(INCIDENT_DATA_RESPONSE || null));

            try {
                /**
                 * Sending email notification : START
                 */

                // INCIDENT_DATA_RESPONSE
                let templateMasterData = INCIDENT_DATA_RESPONSE.incidentData[0];
                let dataArray = INCIDENT_DATA_RESPONSE.recommendations.filter((item) => item.RecommendationID == data.recommendationID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : dataArray : ' + JSON.stringify(dataArray) || null);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : templateMasterData : ' + JSON.stringify(templateMasterData || null));
                templateMasterData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                templateMasterData["IncidentCode_1"] = INCIDENT_DATA_RESPONSE.incidentData[0].IncidentCode;
                templateMasterData["IncidentCode_2"] = INCIDENT_DATA_RESPONSE.incidentData[0].IncidentCode; 
                templateMasterData["RecomendationCode_1"] = dataArray[0].RecommendationCode;
                templateMasterData["RecomendationCode_2"] = dataArray[0].RecommendationCode;
                templateMasterData["RUnitName"]           = dataArray[0].UnitName;
                templateMasterData["NewIncidentDate"] = utilityAppObject.formatDate(userIdFromToken,(INCIDENT_DATA_RESPONSE.incidentData[0].ReportingDate));
                let EmailData = INCIDENT_DATA_RESPONSE.EmailDetails;

                // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : EmailData : ' + JSON.stringify(EmailData || null));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : templateMasterData : ' + JSON.stringify(templateMasterData || null));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : currentStatusCode : ' + (data.currentStatusCode || null));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : nextStatusCode    : ' + (data.nextStatusCode || null));

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailData.toUserEmailIDs || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailData.toUserEmailIDs ||
                    CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY == EmailData.toUserEmailIDs) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : Mailer list is undefined or null.');
                } else {
                    let templateKey = '';
                    //case :  (1 to 2)
                    if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email : (1 to 2) : Execution started.');
                        templateKey = 'RECOMMENDATION_ACTION_PLAN_SUBMIT_EMAIL_TEMPLATE';
                        inAppMessage = 'Incident Action Plan Submitted : ' + templateMasterData["IncidentCode_1"] + ' with Recommendation : ' + templateMasterData["RecomendationCode_1"]
                    }

                    //case :   (2 to 3)
                    if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email : (2 to 3) : Execution started.');
                        templateKey = 'RECOMMENDATION_ACTION_PLAN_APPROVED_REVIEWER_EMAIL_TEMPLATE';
                        inAppMessage = 'Incident submitted for Approval/Rejection of action plan : ' + templateMasterData["IncidentCode_1"] + ' with Recommendation : ' + templateMasterData["RecomendationCode_1"]
                    }

                    //case :  (2   to 1)
                    if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email : (2 & 1) : Execution started.');
                        templateKey = 'RECOMMENDATION_ACTION_PLAN_REJECTED_REVIEWER_EMAIL_TEMPLATE';
                        inAppMessage = 'Recommendation Action Plan Rejected by Reviewer : ' + templateMasterData["IncidentCode_1"] + ' with Recommendation : ' + templateMasterData["RecomendationCode_1"]
                    }

                    if (data.currentStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO && data.nextStatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email : (2 to 3) : Execution started.');
                        templateKey = 'INCIDENT_RESUBMITTED_CREATER_EMAIL_TEMPLATE';
                        inAppMessage = 'Incident Re-submitted for review : ' + templateMasterData["IncidentCode_1"]
                        
                    }

                    

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email : templateKey : ' + templateKey);

                    // ORM: Resolve email template for recommendation status changes
                    // Note: Recommendation workflows may not have workflow step codes yet
                    // Using template-code-based resolution as fallback
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                        const emailTemplateObj = await resolveIncidentEmailTemplate(null, null, templateKey, templateMasterData, userIdFromToken);
                        
                        if (emailTemplateObj && emailTemplateObj.Subject) {
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email : emailTemplateObj : ' + JSON.stringify(emailTemplateObj || null));
                            try {
                                if (!EmailData || EmailData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : EmailData is undefined or null.');
                                } else {
                                    let toEmailIDs = '';
                                    try {
                                        if (EmailData && EmailData.toUserEmailIDs) {
                                            toEmailIDs = await filterEmailIds(userIdFromToken, EmailData.toUserEmailIDs);
                                        }
                                    } catch (error) {
                                        toEmailIDs = '';
                                    }

                                    let ccEmailIDs = '';
                                    try {
                                        if (EmailData && EmailData.ccUserEmailIDs) {
                                            ccEmailIDs = await filterEmailIds(userIdFromToken, EmailData.ccUserEmailIDs);
                                        }
                                    } catch (error) {
                                        ccEmailIDs = '';
                                    }

                                    let toccEmails = {
                                        "TOEmail": toEmailIDs,
                                        "CCEmail": ccEmailIDs
                                    }

                                    var toEmailID = await filterUserGUIDs(userIdFromToken, EmailData.toUserEmailIDs);
                                    var ccEmailID = await filterUserGUIDs(userIdFromToken, EmailData.ccUserEmailIDs);

                                    let inappDetails = {
                                        inAppContent: inAppMessage + " link:" + "incident-list" ,
                                        recepientUserID: toEmailID + "," + ccEmailID,
                                        subModuleID      : 3
                                    }


                                    logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email :   inappDetails : ' + JSON.stringify(inappDetails || null));
                                    // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setIncidentStatus : Email :   senderGUID : ' + JSON.stringify(senderGUID || null));
                                    
                                    await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

                                    // logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Email :   toccEmails : ' + JSON.stringify(toccEmails || null));
                                    if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail !== '') {
                                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData, toccEmails);
                                        logger.log('info', 'EmailTemplateObject: ' + JSON.stringify(emailTemplateObj));
                                    }
                                }
                            } catch (error) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus-EmailNotification : Notification error ' + error);
                            }
                        }

                    }
                }
                /**
                 * Sending email notification : END
                 */

            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus-EmailNotification : Notification error ' + error);
            }

            // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : INCIDENT_DATA_RESPONSE : '+JSON.stringify(INCIDENT_DATA_RESPONSE || null));

            // Adding incident info details : Start
            const GET_INCIDENT_INFO = await incidentsDbObject.getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : Error details : ' + GET_INCIDENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_INCIDENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INCIDENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : Error details : ' + GET_INCIDENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Formatting Resultset of get Incident info data
            const INCIDENT_INFO_DATA = await getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_INFO_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_INFO_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : INCIDENT_INFO_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // Adding incident info details : End

            // Merging incident details and incident info details
            const GET_INCIDENT = {...INCIDENT_DATA_RESPONSE,...INCIDENT_INFO_DATA};

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INCIDENT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INCIDENT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : setRecommendationStatus : Execution end. : GET_INCIDENT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : Execution end. : Recommendations reviewed successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, GET_INCIDENT));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : setRecommendationStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
    }
}

function unsuccessfulResponse(refreshedToken, errorMessage){
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : errorMessage
        }
    }
}

function successfulResponse(refreshedToken, successMessage, result){
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}

/**
 * This is function will format DB response of incident master data .
 */
 async function formatGetIncidentMasterData(userIdFromToken,IncidentData){
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentMasterData : Execution started.');
        let incidentTypes                       = []; 
        let sourceOfIdentifications             = [];
        let criticality                         = [];
        let operationalRiskLossEventCategory    = [];
        let incidentReviewers                   = [];
        let incidentApprovalUsers               = [];
        let usersList                           = [];
        let IncidentCheckers                    = [];
        let AddingIncidentCheckersGroup         = [];
        let AddingIncidentCheckersUnit          = [];
        let AddingIncidentCheckersUsers         = [];

        // forming incident Types data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                incidentTypes.push({
                    "TypeID"    : obj.TypeID,
                    "Name"      : obj.Name,
                    "IsActive"  : obj.IsActive
                });
            }
        }       

        // forming incident source data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                sourceOfIdentifications.push({
                    "SourceID"  : obj.SourceID,
                    "Name"      : obj.Name,
                    "IsActive"  : obj.IsActive
                });
            }
        }

        // forming incident criticality data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                criticality.push({
                    "CriticalityID" : obj.CriticalityID,
                    "Name"          : obj.Name,
                    "Description"   : obj.Description,
                    "IsActive"      : obj.IsActive
                });
            }
        }

        // forming incident RiskLossEventCategory data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                operationalRiskLossEventCategory.push({
                    "CategoryID"    : obj.CategoryID,
                    "Name"          : obj.Name,
                    "IsActive"      : obj.IsActive,
                });
            }
        }

        // forming incident Reviewers data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])){
                incidentReviewers.push({
                    "ReviewerID"    : obj.ReviewerID,
                    "UserGUID"      : obj.UserGUID,
                    "FullName"      : obj.FullName,
                    "IsActive"      : obj.IsActive,
                    "IsDeleted"     : obj.IsDeleted
                });
            }
        }

        // forming incident Approval Users data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])){
                incidentApprovalUsers.push({
                    "ApproverID"    : obj.ApproverID,
                    "UserGUID"      : obj.UserGUID,
                    "FullName"      : obj.FullName,
                    "IsActive"      : obj.IsActive,
                    "IsDeleted"     : obj.IsDeleted
                });
            }
        }

        // forming incident users List data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])){
                IncidentCheckers.push({
                    "UserGUID"  : obj.UserGUID,
                    "UserName"  : obj.UserName,
                    "FullName"  : obj.FullName,
                    "RoleID"    : obj.RoleID,
                    "IsActive"  : obj.IsActive,
                    "CheckerID" : obj.CheckerID,
                    "UnitName"  : obj.UnitName,
                    "UnitID"    : obj.UnitID,
                    "GroupName" : obj.GroupName,
                    "GroupID"   : obj.GroupID,
                    "IsDeleted" : obj.IsDeleted
                });
            }
        }
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN])){
                    AddingIncidentCheckersGroup.push({
                        "UserGUID"  : obj.UserGUID,
                        "UserName"  : obj.UserName,
                        "FullName"  : obj.FullName,
                        "RoleID"    : obj.RoleID,
                        "IsActive"  : obj.IsActive,
                        "CheckerID" : obj.CheckerID,
                        "UnitName"  : obj.UnitName,
                        "UnitID"    : obj.UnitID,
                        "GroupName" : obj.Name,
                        "GroupID"   : obj.GroupID,
                        "IsDeleted" : obj.IsDeleted
                    });
                }
            }
            if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT])){
                    AddingIncidentCheckersUnit.push({
                        "UserGUID"  : obj.UserGUID,
                        // "UserName"  : obj.UserName,
                        // "FullName"  : obj.FullName,
                        "RoleID"    : obj.RoleID,
                        "IsActive"  : obj.IsActive,
                        "CheckerID" : obj.CheckerID,
                        "Name"      : obj.Name,
                        "UnitID"    : obj.UnitID,
                        "GroupID"   : obj.GroupID,
                        "IsDeleted" : obj.IsDeleted
                    });
                }
            }
            if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN])){
                    AddingIncidentCheckersUsers.push({
                        "UserGUID"  : obj.UserGUID,
                        "UserName"  : obj.UserName,
                        "FullName"  : obj.FullName,
                        "RoleID"    : obj.RoleID,
                        "IsActive"  : obj.IsActive,
                        "CheckerID" : obj.CheckerID,
                        "UnitName"  : obj.UnitName,
                        "UnitID"    : obj.UnitID,
                        "GroupName" : obj.GroupName,
                        "GroupID"   : obj.GroupID,
                        "IsDeleted" : obj.IsDeleted
                    });
                }
            }

        // forming incident checker users List data for UI.
        if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE])){
                usersList.push({
                    "UserGUID"  : obj.UserGUID,
                    "FullName"  : obj.FullName,
                    "RoleID"    : obj.RoleID,
                    "GroupID"   : obj.GroupID,
                    "GroupName" : obj.GroupName,
                    "UnitName"  : obj.UnitName,
                    "UnitID"    : obj.UnitID,
                });
            }
        }

        // Forming final data to send UI.
        return{
            "incidentTypes"                     : incidentTypes,
            "sourceOfIdentifications"           : sourceOfIdentifications,
            "criticality"                       : criticality,
            "operationalRiskLossEventCategory"  : operationalRiskLossEventCategory,
            "incidentReviewers"                 : incidentReviewers,
            "incidentApprovalUsers"             : incidentApprovalUsers,
            "usersList"                         : usersList,
            "IncidentCheckers"                  : IncidentCheckers,
            "AddingIncidentCheckersGroup"       : AddingIncidentCheckersGroup,
            "AddingIncidentCheckersUnit"        : AddingIncidentCheckersUnit,
            "AddingIncidentCheckersUsers"       : AddingIncidentCheckersUsers
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of getInfoForIncident .
 */
async function getIndicentInfoData(userIdFromToken,GET_INCIDENT_INFO){
    try{
         logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIndicentInfoData : Execution started.');

         let groupData               = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
         let unitData                = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
         let locationData            = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
         let incidentTypeData        = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
         let incidentSourceData      = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
         let incidentCriticalityData = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
         let lossCategoryData        = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
         let userData                = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
         let currentUserData         = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];
         let currency                = GET_INCIDENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];
 
         let groupDetails            = [];
         let unitDetails             = [];
         let locDetails              = [];
         let incTypeDetails          = [];
         let incSourceDetails        = [];
         let incCriticalityDetails   = [];
         let lossCategoryDetails     = [];
         let userDetails             = [];
         let currentUserDetails      = [];
         let currencyType            = [];

        // forming group data for UI.
        for(const obj of Object.values(groupData)){
            groupDetails.push({
                "GroupID"   : obj.GroupID,
                "Name"      : obj.Name
            });
        }
 
        // forming unit data for UI.
        for(const obj of Object.values(unitData)){
            unitDetails.push({
                "UnitID"    : obj.UnitID,
                "GroupID"   : obj.GroupID,
                "Name"      : obj.Name
            });
        }
 
        // forming location type data for UI.
        for(const obj of Object.values(locationData)){
            locDetails.push({
                "LocationTypeID"    : obj.LocationTypeID,
                "Name"              : obj.Name
            });
        }
 
        // forming incident type data for UI.
        for(const obj of Object.values(incidentTypeData)){
            incTypeDetails.push({
                "TypeID"    : obj.TypeID,
                "Name"      : obj.Name
            });
        }

        // forming incident source data for UI.
        for(const obj of Object.values(incidentSourceData)){
            incSourceDetails.push({
                "SourceID"  : obj.SourceID,
                "Name"      : obj.Name
            });
        }

        // forming incident criticality data for UI.
        for(const obj of Object.values(incidentCriticalityData)){
            incCriticalityDetails.push({
                "CriticalityID" : obj.CriticalityID,
                "Name"          : obj.Name,
                "Description"   : obj.Description
            });
        }

        // forming loss category data for UI.
        for(const obj of Object.values(lossCategoryData)){
            lossCategoryDetails.push({
                "CategoryID"    : obj.CategoryID,
                "Name"          : obj.Name
            });
        }

        //forming user data for UI.
        for(const obj of Object.values(userData)){
            let midName = (obj.MiddleName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) ? obj.MiddleName : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY;
            userDetails.push({
                "UserGUID"  : obj.UserGUID,
                "FullName"  : obj.FirstName + midName + obj.LastName
            });
        }

        //forming current user data for UI.
        let UnitIDs = [];
        for(const obj of Object.values(currentUserData)){
            UnitIDs.push(obj.UnitID);        
        }
        currentUserDetails.push({
            "UnitIDs"      : UnitIDs,
            "FullName"     : currentUserData.length > 0 ? currentUserData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FullName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            "EmailID"      : currentUserData.length > 0 ? currentUserData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EmailID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            "MobileNumber" : currentUserData.length > 0 ? currentUserData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].MobileNumber : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        });

        //forming currency type data by account basis
        for(const obj of Object.values(currency)){
            currencyType.push({
                "AccountName"   : obj.AccountName,
                "Currency"      : obj.Currency
            })
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIndicentInfoData : Execution end.');

        // Forming final data to send UI.
        return{
            "groups"                : groupDetails,
            "units"                 : unitDetails,
            "locationTypes"         : locDetails,
            "incidentTypes"         : incTypeDetails,
            "incidentSources"       : incSourceDetails,
            "incidentCriticalities" : incCriticalityDetails,
            "lossCatagories"        : lossCategoryDetails,
            "users"                 : userDetails,
            "currentUserData"       : currentUserDetails,
            "currencyType"          : currencyType
        };
    }catch (error){
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getIndicentInfoData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of getIncidents .
 */
async function getFormatIncidentData(userIdFromToken,incidentsData,recommendationStatusData,userAlsertsData){
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getFormatIncidentData : Execution started.');
        let filteredIncident    = [];
        let incidentsDetails    = [];
        let recommendationData  = [];
        let OpenstatusID        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let CCstatusID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let closedstatusID      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      
        //filtered draft Incident  data based on reporterGUID matches loggedin userGUID
        let draftIncident = incidentsData.filter(ele => (ele.StatusCode == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) );
        for(const obj of Object.values(draftIncident)){
            filteredIncident.push(obj);
        }
        
        //filtered Non-draft Incident data 
        let nonDraftIncident = incidentsData.filter(ele => (ele.StatusCode != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE));
        for(const obj of Object.values(nonDraftIncident)){
            filteredIncident.push(obj);
        }

        // Sorted incidents based on Incident code
        filteredIncident = filteredIncident.sort((a,b)=> (b.IncidentCode.localeCompare(a.IncidentCode)));

        // forming incident data for UI.
        for(const obj of Object.values(filteredIncident)){
            recommendationData  = JSON.parse(obj.RecommendationData);
            
            if(recommendationStatusData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                OpenstatusID    = recommendationStatusData.filter(ele =>ele.Name == CONSTANT_FILE_OBJ.APP_CONSTANT.OPEN).map(ele=>ele.StatusID);
                CCstatusID      = recommendationStatusData.filter(ele =>ele.Name == CONSTANT_FILE_OBJ.APP_CONSTANT.CLAIM_CLOSED).map(ele=>ele.StatusID);
                closedstatusID  = recommendationStatusData.filter(ele =>ele.Name == CONSTANT_FILE_OBJ.APP_CONSTANT.CLOSED).map(ele=>ele.StatusID);
            }
            let incTypeData = [];
            var TypeData = obj.IncidentTypeData;

            // forming IncidentTypeData for UI.
            if(TypeData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                for(const ele of Object.values(JSON.parse(obj.IncidentTypeData))){
                    incTypeData.push({
                        "IncidentTypeLNID"  : ele.IncidentTypeLNID,
                        "IncidentTypeID"    : ele.IncidentTypeID,
                        "Name"              : ele.Name ? ele.Name : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                    });
                }
            }
        
              //Calculating Number of recommendations ,Number of open,Claimclosed and closed recommendation for UI.
            let NoOfRecommendation  = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            let Open                = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            let ClaimClosed         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            let Closed              = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            
            if(recommendationData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                NoOfRecommendation  = recommendationData.length;
                Open                = recommendationData.filter(ele =>OpenstatusID.includes(ele.StatusID)).length;
                ClaimClosed         = recommendationData.filter(ele =>CCstatusID.includes(ele.StatusID)).length;
                Closed              = recommendationData.filter(ele =>closedstatusID.includes(ele.StatusID)).length;
            }

            incidentsDetails.push({
                "IncidentID"            : obj.IncidentID,
                "IncidentCode"          : obj.IncidentCode,
                "IncidentTitle"         : obj.IncidentTitle,
                "UnitID"                : obj.UnitID,
                "UnitName"              : obj.UnitName,
                // "ReportingDate"         : obj.ReportingDate ? obj.ReportingDate : obj.CreatedDate,
                "ReportingDate"         : obj.CreatedDate,
                "IncidentDate"          : obj.IncidentDate,
                "IncidentTypeData"      : incTypeData,
                "CriticalityID"         : obj.CriticalityID,
                "CriticalityName"       : obj.CriticalityName,
                "CriticalityDescription": obj.CriticalityDescription,
                "MakerRCA"              : obj.MakerRCA,
                "StatusID"              : obj.StatusID,
                "StatusName"            : obj.StatusName,
                "NoOfRecommendation"    : NoOfRecommendation,
                "Open"                  : Open,
                "ClaimClosed"           : ClaimClosed,
                "Closed"                : Closed
            });
        }

        let userAlerts = [];
        for(const obj of Object.values(userAlsertsData)){                   
            userAlerts.push({
                AlertID                 : obj.AlertID,
                AlertDate               : obj.AlertDate,
                ToUserGUID              : obj.ToUserGUID,
                InAppMessage            : obj.InAppMessage, 
                IsRead                  : obj.IsRead,
                IsInAppNotification     : obj.IsInAppNotification,
                TotalCount              : obj.TotalCount,              
                UnReadCount             : obj.UnReadCount,
                SubModuleID             : obj.SubModuleID, 
            })        
        };      
        userAlerts.map(item => {
            const inAppMessage = item.InAppMessage;
            const splitText    = inAppMessage.split("link:");
            item.message       = splitText[0];
            item.link          = splitText[1];

        });

        // logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : userAlerts  :: ' +JSON.stringify(userAlerts || null));
        let RAInApp     = userAlerts.filter(obj=> obj.SubModuleID == 1);
        let RCSAInApp   = userAlerts.filter(obj=> obj.SubModuleID == 2);
        let INCInApp    = userAlerts.filter(obj=> obj.SubModuleID == 3);
        let KRIInApp    = userAlerts.filter(obj=> obj.SubModuleID == 4);


        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : getFormatIncidentData : Execution end.');
 
        // Forming final data to send UI.
        return{
            "incidents"  : incidentsDetails,
            "RAInApp"         : RAInApp,
            "RCSAInApp"       : RCSAInApp,
            "INCInApp"        : INCInApp,
            "KRIInApp"        : KRIInApp,
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : getFormatIncidentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

/**
 * This is function will format DB response of upload incident .
 */
async function formatEvidencelist(userIdFromToken,dbRecordSet){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution started.'); 

        let evidences = []; 

        // forming uploadedincident evidence data for UI.  
        evidences.push({
            "EvidenceID"        : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EvidenceID,
            "OriginalFileName"  : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "Remark"            : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Remark
        });

        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of upload incident .
 */
async function formatRecommendationEvidencelist(userIdFromToken,dbRecordSet){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution started.'); 

        let evidences = []; 

        // forming uploadedincident evidence data for UI.  
        evidences.push({
            "EvidenceID"        : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EvidenceID,
            "OriginalFileName"  : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "CreatedDate"       : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CreatedDate
        });

        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of download incident evidence .
 */
async function formatDownloadResponse(userIdFromToken,dbRecordSet){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatDownloadResponse : Execution started.'); 

        let evidences = []; 
        // forming uploadedincident evidence data for UI.  
        evidences.push({
            "OriginalFileName"  : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "FileType"          : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
            "FileContent"       : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContent
        });

        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatDownloadResponse : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatDownloadResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of get Incident Details .
 */
async function formatGetIncidentDetails(userIdFromToken, IncidentData,userNameFromToken){
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : Execution started.');
        let incidentData                = []; 
        let incidentTypesData           = [];
        let impactedUnitsData           = [];
        let incidentWorkflowActionData  = [];
        let recommendations             = [];             
        let incidentEvidences           = [];
        let rcaEvidences                = [];
        let recommendationEvidences     = [];
        let auditTrail                  = []; 
        let nextWorkFlowData            = [];
        let riskLossCategory            = [];  
        let incidentWorkflowActionCheckerData = [];
        let riskApproverUserName        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskApprovalDate            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskClosureUserName         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let riskClosureDate             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let auditTrailData              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentDataFromDB          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentCode                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let incidentTypesFromDB         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let EmailDetails                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let IsFinancialLoss             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let FinancialLossComment        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let FinancialEmailDetails       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
        incidentDataFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != incidentDataFromDB && incidentDataFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incidentDataFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            incidentCode = incidentDataFromDB.IncidentCode;
        }



        // forming incident data for UI.
        incidentDataFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
      
        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != incidentDataFromDB && incidentDataFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incidentDataFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            incidentCode = incidentDataFromDB.IncidentCode;
            for(const obj of Object.values(incidentDataFromDB)){
                incidentData.push({
                    "IncidentCode"          : obj.IncidentCode,
                    "IncidentID"            : obj.IncidentID,
                    "IncidentTitle"         : obj.IncidentTitle,
                    "GroupID"               : obj.GroupID,
                    "GroupName"             : obj.GroupName,
                    "UnitID"                : obj.UnitID,
                    "UnitName"              : obj.UnitName,
                    "UserGUID"              : obj.ReporterGUID,
                    "LocationName"          : obj.LocationName,
                    "LocationTypeID"        : obj.LocationTypeID,
                    "IncidentTeam"          : obj.IncidentTeam,
                    "IdentificationDate"    : obj.ReportingDate,
                    "IncidentDate"          : obj.IncidentDate,
                    "MobileNumber"          : obj.MobileNumber,
                    "EmailID"               : obj.EmailID,
                    "Description"           : obj.Description,
                    "Recommendation"        : obj.Recommendation,
                    "Action"                : obj.Action,
                    "MakerRCA"              : obj.MakerRCA,
                    "IncidentSourceID"      : obj.IncidentSourceID,
                    "DirectLoss"            : obj.DirectLoss,
                    "IndirectLoss"          : obj.IndirectLoss,
                    "Recoveries"            : obj.Recoveries,
                    "LossAmount"            : obj.LossAmount,
                    "AggPartyDetails"       : obj.AggPartyDetails,
                    "CriticalityID"         : obj.CriticalityID,
                    "CriticalityName"       : obj.CriticalityName,
                    "StatusID"              : obj.StatusID,
                    "StatusName"            : obj.StatusName,
                    "StatusCode"            : obj.StatusCode,
                    "WorkflowActionBy"      : obj.WorkflowActionBy,
                    "RiskApproverUserName"  : riskApproverUserName,
                    "RiskApprovalDate"      : riskApprovalDate,
                    "RiskClosureUserName"   : riskClosureUserName,
                    "ClosureDate"           : obj.ClosureDate,
                    "Comment"               : obj.Comment,
                    "RCA"                   : obj.RCA,
                    "IsApproved"            : obj.IsApproved,
                    "IsReviewed"            : obj.IsReviewed,
                    // "ReportingDate"         : obj.ReportingDate ? obj.ReportingDate : obj.CreatedDate,
                    "ReportingDate"         : obj.CreatedDate,
                    "Reportee"              : obj.CanbeReportee,
                    "Reviewer"              : obj.CanbeReviewer,
                    "Approver"              : obj.CanbeApprover,
                    "Checker"               : obj.CanbeChecker,
                    "IsFinancialLoss"       : obj.IsFinancialLoss,
                    "FinancialLossComment"  : obj.FinancialLossComment,
                    "ReporterName"          : obj.ReporterName,
                    "IsReporteeAndChecker"  : obj.IsReporteeAndChecker,
                    "IsReportedByChecker"   : obj.IsReportedByChecker //only used for reject by reviwer when incident is reported by checker user
                    
                });
            }
        }

        // forming incident incident Types Data for UI.
        incidentTypesFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != incidentTypesFromDB && incidentTypesFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incidentTypesFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(incidentTypesFromDB)){
                incidentTypesData.push({
                    "TypeID"    : obj.IncidentTypeID,
                    "Name"      : obj.Name
                });
            }
        }

        // forming incident impacted Units data for UI.
        let impactedUnitsDataFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != impactedUnitsDataFromDB && impactedUnitsDataFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && impactedUnitsDataFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(impactedUnitsDataFromDB)){
                impactedUnitsData.push({
                    "UnitID"    : obj.IncidentUnitID,
                    "Name"      : obj.Name,
                    "LossValue" : obj.LossPercentage
                });
            }
        }

        // forming incident Workflow Action  data for UI on basis of currentStatusCode.
        let WorkflowActionDataFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
        let currentStatusCode = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != WorkflowActionDataFromDB && WorkflowActionDataFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && WorkflowActionDataFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            currentStatusCode = incidentData && incidentData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? incidentData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StatusCode : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            nextWorkFlowData = WorkflowActionDataFromDB.filter(ele =>ele.StatusCode == currentStatusCode);
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : WorkflowActionDataFromDB :' + JSON.stringify(WorkflowActionDataFromDB))
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : currentStatusCode1 : ' + currentStatusCode);
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : nextWorkFlowData : ' + JSON.stringify(nextWorkFlowData));
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : obj.Workflow : ' + JSON.stringify(obj.Workflow));

        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : userIdFromToken : ' + userIdFromToken);
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : incidentDataFromDB.ReporterName : ' + IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][0].ReporterGUID);
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : IsReporteeAndChecker : ' + IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][0].IsReporteeAndChecker);
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : IncidentData : ' + JSON.stringify(IncidentData.recordset[0][0] || null));
        
        // ZRA-113: Database-driven workflow transitions
        // NextStatusCode now comes directly from the database (INC_IncidentStatus.NextStatusCode column)
        // This eliminates hardcoded workflow logic and makes the system resilient to DB changes
        
        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != nextWorkFlowData && nextWorkFlowData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && nextWorkFlowData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){

            for(const obj of Object.values(nextWorkFlowData)){
                // Get NextStatusCode directly from database instead of hardcoded logic
                // The database now contains the complete workflow transition mapping
                let nextStatusCode = obj.NextStatusCode;
                
                logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : DB-driven workflow - Workflow: ' + obj.Workflow + ', NextStatusCode from DB: ' + nextStatusCode);

                // Build workflow action data for UI
                // WorkflowActionBy from DB determines who can perform this action (Reportee, Checker, Reviewer, Approver)
                if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][0].IsReporteeAndChecker == 1 && obj.WorkflowActionBy !== "Checker"){
                    let newarray = {
                        "NextWorkflowAction": obj.Workflow,
                        "NextWorkflowActionBy": obj.WorkflowActionBy,
                        "NextStatusCode": nextStatusCode
                    };               
                    incidentWorkflowActionData.push(newarray);
                    
                } else if(IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][0].IsReporteeAndChecker == 0){
                    let newarray = {
                        "NextWorkflowAction": obj.Workflow,
                        "NextWorkflowActionBy": obj.WorkflowActionBy,
                        "NextStatusCode": nextStatusCode
                    };               
                    incidentWorkflowActionCheckerData.push(newarray);
                } else {
                    let newarray = {
                        "NextWorkflowAction": obj.Workflow,
                        "NextWorkflowActionBy": obj.WorkflowActionBy,
                        "NextStatusCode": nextStatusCode
                    };               
                    incidentWorkflowActionCheckerData.push(newarray);
                }
            }
        }

        // forming incident recommendations data for UI.
        let recommendationDataFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != recommendationDataFromDB && recommendationDataFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && recommendationDataFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(recommendationDataFromDB)){
                recommendations.push({
                    "RecommendationID"      : obj.RecommendationID,
                    "IncidentID"            : obj.IncidentID,
                    "RecommendationCode"    : obj.RecommendationCode,
                    "Description"           : obj.Description,
                    "UnitID"                : obj.UnitID,
                    "UnitName"              : obj.Name,
                    "TargetDate"            : obj.TargetDate,
                    "IsApproved"            : obj.IsApproved,
                    "StatusID"              : obj.StatusID,
                    "StatusCode"            : obj.StatusCode,
                    "StatusName"            : obj.StatusName,
                    "Action"                : obj.Action,
                    "LessonLearnt"          : obj.LessonLearnt,
                    "Reportee"              : (obj.IsRcmReportee === 1) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE
                });
            }
        }

        // forming incident Evidences data for UI.
        let incidentEvidencesFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != incidentEvidencesFromDB && incidentEvidencesFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incidentEvidencesFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(incidentEvidencesFromDB)){
                incidentEvidences.push({           
                    "EvidenceID"        : obj.EvidenceID,
                    "IncidentID"        : obj.IncidentID,
                    "OriginalFileName"  : obj.OriginalFileName,
                    "FileType"          : obj.FileType,
                    "Remark"            : obj.Remark
                })
            };
        }

        // forming incident rca Evidences data for UI.
        let rcaEvidencesFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != rcaEvidencesFromDB && rcaEvidencesFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && rcaEvidencesFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(rcaEvidencesFromDB)){
                rcaEvidences.push({
                    "EvidenceID"        : obj.EvidenceID,
                    "IncidentID"        : obj.IncidentID,
                    "OriginalFileName"  : obj.OriginalFileName,
                    "FileType"          : obj.FileType,
                    "Remark"            : obj.Remark
                });
            }
        }

        // forming incident recommendation Evidences data for UI.
        let recommendationEvidencesFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != recommendationEvidencesFromDB && recommendationEvidencesFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && recommendationEvidencesFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(recommendationEvidencesFromDB)){
                recommendationEvidences.push({
                    "EvidenceID"        : obj.EvidenceID,
                    "RecommendationID"  : obj.RecommendationID,
                    "OriginalFileName"  : obj.OriginalFileName,
                    "FileType"          : obj.FileType,
                    "CreatedDate"       : obj.CreatedDate
                });
            }
        }

        // forming incident audit Trail data for UI.
        auditTrailData = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != auditTrailData && auditTrailData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && auditTrailData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            var auditTrailArray   = [];
            auditTrailArray       = auditTrailData;
            auditTrailArray       = auditTrailArray.sort((a, b) => (a.CreatedDate < b.CreatedDate) ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_ONE);

            for(const obj of Object.values(auditTrailArray)){
                auditTrail.push({
                    "CreatedDate"   : obj.CreatedDate,
                    "Code"          : obj.Code,
                    "Action"        : obj.Action,
                    "FullName"      : obj.FullName,
                    "Comment"       : obj.Comment
                });

                if(incidentCode != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incidentCode == obj.Code && obj.Action == CONSTANT_FILE_OBJ.APP_CONSTANT.INCIDENT_APPROVED){
                    riskApprovalDate        = obj.CreatedDate;
                    riskApproverUserName    = obj.FullName;

                }

                if(incidentCode != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && incidentCode == obj.Code && obj.Action == CONSTANT_FILE_OBJ.APP_CONSTANT.INCIDENT_CLOSED){                
                    riskClosureDate     = obj.CreatedDate;
                    riskClosureUserName =  obj.FullName;
                }
            }
        }

        let lossCategoryFromDB = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];

        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != lossCategoryFromDB && lossCategoryFromDB != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && lossCategoryFromDB.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(const obj of Object.values(lossCategoryFromDB)){
                riskLossCategory.push({
                    "RiskLossCategoryID"   : obj.RiskLossCategoryID,
                    "Name"                 : obj.Name
                });
            }
        }

        let toUserEmailIDs = '';
        let ccUserEmailIDs = '';

        try {
            toUserEmailIDs = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];
        } catch (error) {
            toUserEmailIDs = '';
        }

        try {
            ccUserEmailIDs = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];
        } catch (error) {
            ccUserEmailIDs = '';
        }


        EmailDetails = {
            "toUserEmailIDs": toUserEmailIDs,
            "ccUserEmailIDs": ccUserEmailIDs
        }

        let financialToEmailDetails = ''
        let financialCCEmailDetails = ''

        try {
            financialToEmailDetails = IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
        } catch (error) {
            financialToEmailDetails = '';
        }

        try {
            financialCCEmailDetails =  IncidentData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THIRTEEN];
        } catch (error) {
            financialCCEmailDetails = '';
        }

        FinancialEmailDetails = {
            "financialToEmailDetails": financialToEmailDetails,
            "financialCCEmailDetails": financialCCEmailDetails
        }
       
        // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : EmailDetails : ' + JSON.stringify(EmailDetails || null));

        // Forming final data to send UI.
        return {
            "incidentTypesData"           : incidentTypesData,
            "impactedUnitsData"           : impactedUnitsData,
            "incidentWorkflowActionData"  : incidentWorkflowActionData,
            "auditTrail"                  : auditTrail,
            "recommendations"             : recommendations,
            "incidentEvidences"           : incidentEvidences,
            "rcaEvidences"                : rcaEvidences,
            "recommendationEvidences"     : recommendationEvidences,
            "riskLossCategory"            : riskLossCategory,
            "EmailDetails"                : EmailDetails,
            "FinancialEmailDetails"       : FinancialEmailDetails,
            "incidentData"                : incidentData,
            "incidentWorkflowActionCheckerData":incidentWorkflowActionCheckerData
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatGetIncidentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will filter emailid from  DB response object .
 */
async function filterEmailIds(userIdFromToken, emailList) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsBl : filterEmailIds : Execution started.');
        let allEmail = [];
        let isEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        var senderEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        for (var i = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO; i < emailList.length; i++) {
            if (emailList[i].EmailID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                allEmail.push(emailList[i].EmailID);
                isEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            }
        }

        if (isEmail == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            senderEmail = allEmail.join(", ");
        }

        return senderEmail;
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsBl : filterEmailIds : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will filter UserGUID from  DB response object .
 */
async function filterUserGUIDs(userIdFromToken,emailList){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : filterUserGUIDs : Execution started.');
            let alluserGUID        = [];          
            var senderGUID     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            for(var i= CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ; i< emailList.length ; i++)
            {
                if(emailList[i].UserGUID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)
                    {
                        alluserGUID.push(emailList[i].UserGUID); 
                        senderGUID = alluserGUID.join(",");  
                    }        
            }
       
        return senderGUID;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : filterUserGUIDs : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * Maps incident status transitions to ORM workflow step codes.
 * Centralized mapping for data-driven email template resolution.
 * @param {number} currentStatusCode - Current incident status code
 * @param {number} nextStatusCode - Next incident status code
 * @returns {string|null} Workflow step code or null if mapping not found
 */
function getWorkflowStepCodeForIncidentTransition(currentStatusCode, nextStatusCode) {
    // Map status transitions to workflow step codes
    // Format: 'currentStatusCode→nextStatusCode' -> 'WORKFLOW_STEP_CODE'
    const stepCodeMap = {
        // Submit to Reviewer flows
        '8→2': 'INCIDENT_SUBMIT_TO_REVIEWER',      // Checker submits to Reviewer
        '1→11': 'INCIDENT_SUBMIT_TO_REVIEWER',     // Direct submit to Reviewer (no checker)
        
        // Resubmit to Reviewer flows
        '3→2': 'INCIDENT_RESUBMIT_TO_REVIEWER',    // Resubmit after rejection
        '5→4': 'INCIDENT_RESUBMIT_TO_REVIEWER',   // Resubmit after approver rejection
        
        // Reviewer actions
        '2→4': 'INCIDENT_REVIEWER_APPROVED',       // Reviewer approves, submit to Approver
        '11→4': 'INCIDENT_REVIEWER_APPROVED',      // Reviewer approves (direct flow)
        '2→3': 'INCIDENT_REVIEWER_REJECTED',       // Reviewer rejects
        '5→3': 'INCIDENT_REVIEWER_REJECTED',       // Reviewer rejects (after resubmit)
        '11→12': 'INCIDENT_REVIEWER_REJECTED',     // Reviewer rejects (direct flow)
        
        // Approver actions
        '4→5': 'INCIDENT_APPROVER_REJECTED',       // Approver rejects
        '4→6': 'INCIDENT_APPROVER_APPROVED',      // Approver approves
        
        // Incident closure
        '6→7': 'INCIDENT_CLOSURE',                 // Incident closed
        
        // Checker actions
        '1→8': 'INCIDENT_SUBMIT_TO_CHECKER',       // Submit to Checker
        '3→8': 'INCIDENT_RESUBMIT_TO_CHECKER',     // Resubmit to Checker
        '9→8': 'INCIDENT_RESUBMIT_TO_CHECKER',     // Resubmit to Checker after rejection
        '8→9': 'INCIDENT_CHECKER_REJECTED',        // Checker rejects
        '8→10': 'INCIDENT_CHECKER_REJECTED_CLOSED', // Checker rejects and closes
        
        // Reportee actions (for notifications to reportee)
        '12→11': 'INCIDENT_RESUBMIT_TO_REVIEWER'   // Resubmit after rejection (direct flow)
    };
    
    const transitionKey = `${currentStatusCode}→${nextStatusCode}`;
    return stepCodeMap[transitionKey] || null;
}

/**
 * Determines reviewer type (INTERNAL/EXTERNAL) for incident email notifications.
 * Based on incident configuration and workflow context.
 * @param {Object} incidentData - Incident data object from INCIDENT_DATA_RESPONSE
 * @param {Object} templateMasterData - Template master data (may contain additional context)
 * @returns {string} 'INTERNAL' or 'EXTERNAL' (defaults to 'EXTERNAL' if not determinable)
 */
function getReviewerTypeForIncident(incidentData, templateMasterData) {
    // For incidents, default to EXTERNAL reviewer type
    // Future enhancement: Add logic to determine INTERNAL vs EXTERNAL based on:
    // - Incident configuration flags
    // - Unit hierarchy
    // - Reviewer assignment type
    // For now, incidents use external reviewers by default
    
    // If incident data has IsInternalReviewRequired flag, use it
    if (incidentData && incidentData.IsInternalReviewRequired === true) {
        return 'INTERNAL';
    }
    
    // Default to EXTERNAL for all incident notifications
    return 'EXTERNAL';
}

/**
 * Resolves email template using workflow-step-based resolution (preferred) or fallback to template code.
 * @param {string} workflowStepCode - Workflow step code (e.g., 'INCIDENT_SUBMIT_TO_REVIEWER')
 * @param {string} reviewerTypeCode - Reviewer type ('INTERNAL' or 'EXTERNAL')
 * @param {string} templateKey - Fallback template key (for backward compatibility)
 * @param {Object} templateMasterData - Template data with placeholders
 * @param {string} userIdFromToken - User ID for logging
 * @returns {Promise<{Subject: string, Body: string}|null>} Resolved template or null
 */
async function resolveIncidentEmailTemplate(workflowStepCode, reviewerTypeCode, templateKey, templateMasterData, userIdFromToken) {
    let emailTemplateObj = null;
    
    // Step 1: Try workflow-step-based resolution (preferred method)
    if (workflowStepCode && reviewerTypeCode) {
        // Ensure RISKTRAC_WEB_URL is set for template placeholders
        if (!templateMasterData['RISKTRAC_WEB_URL']) {
            templateMasterData['RISKTRAC_WEB_URL'] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
        }
        
        emailTemplateObj = await resolveOrmEmailTemplate(workflowStepCode, reviewerTypeCode, templateMasterData, userIdFromToken);
        
        if (emailTemplateObj) {
            logger.log('info', 'User Id : ' + (userIdFromToken || 'system') + ' : IncidentsBl : resolveIncidentEmailTemplate : Resolved ORM DB template for workflowStep=' + workflowStepCode + ', reviewerType=' + reviewerTypeCode);
            return emailTemplateObj;
        }
    }
    
    // Step 2: Fallback to template-code-based resolution (backward compatibility)
    if (templateKey && CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey.trim()) {
        emailTemplateObj = await getEmailTemplate(templateKey, templateMasterData, userIdFromToken);
        if (emailTemplateObj && emailTemplateObj.Subject) {
            logger.log('info', 'User Id : ' + (userIdFromToken || 'system') + ' : IncidentsBl : resolveIncidentEmailTemplate : Using fallback template code=' + templateKey);
            return emailTemplateObj;
        }
    }
    
    // Step 3: No template found
    logger.log('warn', 'User Id : ' + (userIdFromToken || 'system') + ' : IncidentsBl : resolveIncidentEmailTemplate : No template found for workflowStep=' + (workflowStepCode || 'null') + ', reviewerType=' + (reviewerTypeCode || 'null') + ', templateKey=' + (templateKey || 'null'));
    return null;
}

async function getEmailTemplate(templateKey, templateMasterData, userIdFromToken) {
    let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let emailTemplate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    // DB-first: resolve by template code (TemplateCode matches templateKey)
    const dbTemplate = await resolveOrmEmailTemplateByCode(templateKey, templateMasterData, userIdFromToken);
    if (dbTemplate && dbTemplate.Subject) {
        return {
            "Subject": dbTemplate.Subject,
            "Body": dbTemplate.Body
        };
    }
    logger.log('warn', 'User Id : ' + (userIdFromToken || 'system') + ' : IncidentsBl : getEmailTemplate : No DB template for templateKey=' + templateKey + '. File-based templates are disabled.');
    
    // Legacy file-based template code removed - templates now resolved via database (ORM_EmailTemplate table)
    // This function now only serves as fallback for template-code-based resolution

    return {
        "Subject": emailSubject || '',
        "Body": emailTemplate || ''
    };
}

/**
 * This is function will be used to return single instance of class.
 */
function getIncidentsBLClassInstance() {
    if (incidentsBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        incidentsBLClassInstance = new IncidentsBl();
    }
    return incidentsBLClassInstance;
}

exports.getIncidentsBLClassInstance = getIncidentsBLClassInstance;