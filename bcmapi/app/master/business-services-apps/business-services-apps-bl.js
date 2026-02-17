const MESSAGE_FILE_OBJ          = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ         = require("../../../utility/constants/constant.js");
const APP_VALIDATOR             = require("../../../utility/app-validator.js");
const BUSINESS_SERVICES_APPS_DB = require("../../../data-access/masters/business-services-apps-db.js");
const { logger }                = require("../../../utility/log-manager/log-manager.js");

var BusinessServicesAndAppsBLClassInstance  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var BusinessServicesAndAppsDB               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject                      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BusinessServicesAppsBl {
    constructor() {
        BusinessServicesAndAppsDB   = new BUSINESS_SERVICES_APPS_DB();
        appValidatorObject          = new APP_VALIDATOR();
    }

    start() { }

    /**
     * This function will fetch the Business Services & Apps master data from database.
     */
    async getBusinessServicesAppsMaster(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            // userIdFromToken           = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken         = 'kashish.sharma@secureyes.net';


            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution started.');

            const BUSINESS_SERVICES_APPS_DB_RESPONSE = await BusinessServicesAndAppsDB.getBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : BUSINESS_SERVICES_APPS_DB_RESPONSE ' + JSON.stringify(BUSINESS_SERVICES_APPS_DB_RESPONSE || null));

            // if DB response is undefined/null
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_SERVICES_APPS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_SERVICES_APPS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution end. :  BusinessServicesApps Master db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // if error in DB response
            if (BUSINESS_SERVICES_APPS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution end. : Error details :' + BUSINESS_SERVICES_APPS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // if error in procedure execution
            if (BUSINESS_SERVICES_APPS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_SERVICES_APPS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution end. : Error details : ' + BUSINESS_SERVICES_APPS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if (BUSINESS_SERVICES_APPS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_SERVICES_APPS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && BUSINESS_SERVICES_APPS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, BUSINESS_SERVICES_APPS_DB_RESPONSE));
            }
            
            const FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER = await getFormatBusinessServicesAppsMaster(userIdFromToken, BUSINESS_SERVICES_APPS_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER ' + JSON.stringify(FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution end. :  FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch info for add/edit Business Services & Apps master data from database.
     */
    async getBusinessServicesAppsMasterInfo(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            // userIdFromToken           = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken         = 'kashish.sharma@secureyes.net';

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution started.');

            const BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE = await BusinessServicesAndAppsDB.getBusinessServicesAppsMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE ' + JSON.stringify(BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE || null));

            // if DB response is undefined/null
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution end. :  BusinessServicesApps Master Info db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // if error in DB response
            if (BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution end. : Error details :' + BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // if error in procedure execution
            if (BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution end. : Error details : ' + BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if (BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE));
            }

            const FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER = await getFormatBusinessServicesAppsMasterInfo(userIdFromToken, BUSINESS_SERVICES_APPS_INFO_DB_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER ' + JSON.stringify(FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER || null));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution end. :  FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getBusinessServicesAppsMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will add Business Services & Apps master data to the database.
     */
    async addBusinessServicesAppsMaster(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let businessServicesMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken                  = request.body.userIdFromToken;
            userNameFromToken                = request.body.userNameFromToken;
            businessServicesMasterData = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            // userIdFromToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken = 'kashish.sharma@secureyes.net';

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution started.');

            /**
             * Input Validation : Start
             */
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.ApplicationID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : ApplicationID is undefined.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_UNDEFINED));
            //   }  
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.Application_Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.Application_Name || appValidatorObject.isStringEmpty((businessServicesMasterData.Application_Name).trim())) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : Application_Name is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_NAME_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RTO_Value || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RTO_Value) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : RTO_Value is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RTO_VALUE_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RPO_Value || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RPO_Value) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : RPO_Value is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RPO_VALUE_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.ApplicationTypeID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.ApplicationTypeID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : ApplicationTypeID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_TYPE_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.BusinessFunctionID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : BusinessFunctionID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RTO_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RTO_ID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : RTO_ID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RTO_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RPO_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RPO_ID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : RPO_ID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RPO_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.BusinessOwnerID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.BusinessOwnerID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : BusinessOwnerID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_OWNER_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.ITOwnerID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.ITOwnerID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : ITOwnerID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IT_OWNER_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.SupportLeadID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.SupportLeadID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : SupportLeadID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_LEAD_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.Sites || CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO == businessServicesMasterData.Sites.length) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : Sites is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITES_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.Support_Team || CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO == businessServicesMasterData.Support_Team.length) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : Support_Team is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_TEAM_NULL_EMPTY));
            //   }

            /**
           * Input Validation : End
           */

            const ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE = await BusinessServicesAndAppsDB.addBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, businessServicesMasterData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE ' + JSON.stringify(ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : Error details :' + ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : Error details : ' + ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE));
            }

            const FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER = await getFormatBusinessServicesAppsMaster(userIdFromToken, ADD_BUSINESS_SERVICES_MASTER_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. :  FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBusinessServicesAppsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This will update particular Business Services & Apps master data in the database.
     */
    async updateBusinessServicesAppsMaster(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let businessServicesMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            businessServicesMasterData = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            // userIdFromToken                 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken               = 'kashish.sharma@secureyes.net';

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution started.');

            /**
             * Input Validation : Start
             */

            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.ApplicationID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.ApplicationID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : ApplicationID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.Application_Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.Application_Name || appValidatorObject.isStringEmpty((businessServicesMasterData.Application_Name).trim())) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : Application_Name is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_NAME_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RTO_Value || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RTO_Value) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : RTO_Value is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RTO_VALUE_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RPO_Value || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RPO_Value) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : RPO_Value is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RPO_VALUE_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.ApplicationTypeID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.ApplicationTypeID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : ApplicationTypeID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_TYPE_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.BusinessFunctionID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.BusinessFunctionID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : BusinessFunctionID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTION_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RTO_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RTO_ID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : RTO_ID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RTO_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.RPO_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.RPO_ID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : RPO_ID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RPO_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.BusinessOwnerID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.BusinessOwnerID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : BusinessOwnerID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_OWNER_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.ITOwnerID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.ITOwnerID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : ITOwnerID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IT_OWNER_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.SupportLeadID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesMasterData.SupportLeadID) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : SupportLeadID is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_LEAD_ID_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.Sites || CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO == businessServicesMasterData.Sites.length) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : Sites is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITES_NULL_EMPTY));
            //   }
            //   if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesMasterData.Support_Team || CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO == businessServicesMasterData.Support_Team.length) {
            //       logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : Support_Team is undefined or null or empty.');
            //       return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_TEAM_NULL_EMPTY));
            //   }

            /**
           * Input Validation : End
           */

            const UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE = await BusinessServicesAndAppsDB.updateBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, businessServicesMasterData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE ' + JSON.stringify(UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : Error details :' + UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : Error details : ' + UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE));
            }

            const FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER = await getFormatBusinessServicesAppsMaster(userIdFromToken, UPDATE_BUSINESS_SERVICES_MASTER_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. :  FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : updateBusinessServicesAppsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will bulk upload Business Services & Apps master data to the databse. 
     */
    async addBulkBusinessServicesMaster(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            let payloadData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            payloadData         =  request.body.BusinessServiceBulk;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == payloadData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == payloadData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : payloadData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution started.');

            const BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO = await BusinessServicesAndAppsDB.getBusinessServicesAppsMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO ' + JSON.stringify(BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO || null));
            
            // if DB response is undefined/null
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. :  BusinessServicesApps Master Info db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // if error in DB response
            if (BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : Error details :' + BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // if error in procedure execution
            if (BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : Error details : ' + BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO));
            }
            const BULK_UPLOAD_PAYLOAD_VALIDATED_DATA = await formatPayloadBulkData(userIdFromToken, payloadData, BULK_UPLOAD_BUSINESS_SERVICES_APPS_INFO, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : BULK_UPLOAD_PAYLOAD_VALIDATED_DATA ' + JSON.stringify(BULK_UPLOAD_PAYLOAD_VALIDATED_DATA || null));
            
            if(BULK_UPLOAD_PAYLOAD_VALIDATED_DATA.modifiedPayloadData.length) {
                const ADD_BULK_UPLOAD_DB_RESPONSE = await BusinessServicesAndAppsDB.addBulkBusinessServicesMaster(userIdFromToken, userNameFromToken, BULK_UPLOAD_PAYLOAD_VALIDATED_DATA.modifiedPayloadData, accountGUIDFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : ADD_BULK_UPLOAD_DB_RESPONSE ' + JSON.stringify(ADD_BULK_UPLOAD_DB_RESPONSE || null));

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_BULK_UPLOAD_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_BULK_UPLOAD_DB_RESPONSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                if (ADD_BULK_UPLOAD_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : Error details :' + ADD_BULK_UPLOAD_DB_RESPONSE.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                if (ADD_BULK_UPLOAD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_BULK_UPLOAD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : Error details : ' + ADD_BULK_UPLOAD_DB_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
            }            
            let outputMessage   = `Number of Records successfully added : ${BULK_UPLOAD_PAYLOAD_VALIDATED_DATA.validData.length} Number of records failed to add : ${BULK_UPLOAD_PAYLOAD_VALIDATED_DATA.inValidData.length}`
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, outputMessage, BULK_UPLOAD_PAYLOAD_VALIDATED_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : addBulkBusinessServicesMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will delete the members from Support Team field in the database.
     */
    async deleteSupportTeam(request, response) {
        try {
            let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let businessServicesMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            businessServicesMasterData = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : Execution started.');

            const DELETE_SUPPORT_TEAM_DB_RESPONSE = await BusinessServicesAndAppsDB.deleteSupportTeam(userIdFromToken, userNameFromToken, businessServicesMasterData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : DELETE_SUPPORT_TEAM_DB_RESPONSE ' + JSON.stringify(DELETE_SUPPORT_TEAM_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_SUPPORT_TEAM_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_SUPPORT_TEAM_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_SUPPORT_TEAM_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : Execution end. : Error details :' + DELETE_SUPPORT_TEAM_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_SUPPORT_TEAM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_SUPPORT_TEAM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : Execution end. : Error details : ' + DELETE_SUPPORT_TEAM_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (DELETE_SUPPORT_TEAM_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_SUPPORT_TEAM_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && DELETE_SUPPORT_TEAM_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, DELETE_SUPPORT_TEAM_DB_RESPONSE));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, DELETE_SUPPORT_TEAM_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteSupportTeam : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will delete the Business Services Apps master from the database.
     */
    async deleteBusinessServicesAppsMaster(request, response) {
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let businessServicesAppsMasterData  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            refreshedToken                  = request.body.refreshedToken;
            userIdFromToken                 = request.body.userIdFromToken;
            userNameFromToken               = request.body.userNameFromToken;
            businessServicesAppsMasterData  = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution started.');

            /**
            * Input Validation : Start
            */
            //    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == businessServicesAppsMasterData.ApplicationID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == businessServicesAppsMasterData.ApplicationID) {
            //     logger.log('error', 'User Id : '+ userIdFromToken +' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. : ApplicationID is undefined or null or empty.');
            //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.APPLICATION_ID_NULL_EMPTY));
            //   }

            /**
            * Input Validation : End
            */

            const DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE = await BusinessServicesAndAppsDB.deleteBusinessServicesAppsMaster(userIdFromToken, userNameFromToken, businessServicesAppsMasterData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE ' + JSON.stringify(DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. : Error details :' + DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. : Error details : ' + DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE));
            }

            const FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER = await getFormatBusinessServicesAppsMaster(userIdFromToken, DELETE_BUSINESS_SERVICES_MASTER_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. :  FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_BUSINESS_SERVICES_APPS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : deleteBusinessServicesAppsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
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

async function getFormatBusinessServicesAppsMaster(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getFormatBusinessServicesAppsMaster : Execution Started.');


        let businessServicesAppsMasterList  = [];
        let applicationTypeList             = [];
        let businessFunctionsList           = [];
        let sitesList                       = [];
        let businessOwnersList              = [];
        let ITOwnersList                    = [];
        let supportLeadList                 = [];
        let supportTeamList                 = [];


        businessServicesAppsMasterList  = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        applicationTypeList             = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        businessFunctionsList           = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        sitesList                       = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        businessOwnersList              = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        ITOwnersList                    = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        supportLeadList                 = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        supportTeamList                 = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];

        // Result Set 1 - Business Services and Apps List
        businessServicesAppsMasterList.forEach((obj) => {
            obj["TimeUnit"]    = obj.RecoveryTimeUnit == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? "hour(s)" : "day(s)",
            obj["PointUnit"]   = obj.RecoveryPointUnit == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? "hour(s)" : "day(s)"

            if (obj.Sites == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || obj.Sites == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || obj.Sites == []){
                obj.Sites = []
            }

            if(obj.SupportTeamList != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                const userMap = new Map();
                // Iterate through SupportTeamList
                JSON.parse(obj.SupportTeamList).forEach(entry => {
                    const { UserGUID, TeamMember, SupportTeamID, BusinessGroup } = entry;
                    
                    // If user already exists in the map, append business group
                    if (userMap.has(UserGUID)) {
                        userMap.get(UserGUID).BusinessGroup.add(BusinessGroup);
                    } else { // If user is new, create a new entry
                        userMap.set(UserGUID, {
                            UserGUID,
                            TeamMember,
                            SupportTeamID,
                            BusinessGroup: new Set([BusinessGroup])
                        });
                    }
                });

                // Format the result
                obj.SupportTeamList = Array.from(userMap.values()).map(user => ({
                    UserGUID        : user.UserGUID,
                    TeamMember      : user.TeamMember,
                    SupportTeamID   : user.SupportTeamID,
                    BusinessGroup   : [...user.BusinessGroup].join(', ')
                }));

            }
        })


        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getFormatBusinessServicesAppsMaster : Execution End.');

        return {
            "BusinessServicesAppsMasterList"    : businessServicesAppsMasterList,
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getFormatBusinessServicesAppsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function getFormatBusinessServicesAppsMasterInfo(userIdFromToken, getDBResponse, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getFormatBusinessServicesAppsMasterInfo : Execution Started.');

        let applicationTypeList     = [];
        let businessFunctionsList   = [];
        let sitesList               = [];
        let businessOwnersList      = [];
        let ITOwnersList            = [];
        let supportLeadList         = [];
        let supportTeamList         = [];
        let newSiteList             = [];

        applicationTypeList     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        businessFunctionsList   = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        sitesList               = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        businessOwnersList      = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        ITOwnersList            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        supportLeadList         = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        supportTeamList         = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];

        // Result Set 1 - Site List
        sitesList.forEach(x => {
            newSiteList.push({ 
                "SiteID"                : Number(x.SiteID),
                "SiteName"              : x.SiteName,
                "BusinessFunctionID"    : Number(x.BusinessFunctionsID),
                "BusinessFunctionName"  : x.Name ,
                "BusinessOwnerGUID"     : x.BusinessOwnerGUID,
                "BusinessOwnerName"     : x.BusinessOwnerName
            })
        })

        // Logic for filtering Support Team members
        let uniqueSupportTeamObject = {};

        supportTeamList.forEach((val) => {
            if (val.UserGUID in uniqueSupportTeamObject) {
                uniqueSupportTeamObject[val.UserGUID] = {
                    ...uniqueSupportTeamObject[val.UserGUID],
                    "BusinessGroup": [
                        ...uniqueSupportTeamObject[val.UserGUID]["BusinessGroup"],
                        val.BusinessGroup
                    ]
                }
            } else {
                uniqueSupportTeamObject[val.UserGUID] = {
                    ...val,
                    "BusinessGroup": [val.BusinessGroup]
                }
            }
        })

        let uniqueSupportTeamList = []

        Object.keys(uniqueSupportTeamObject).forEach((key) => {

            uniqueSupportTeamList.push({
                ...uniqueSupportTeamObject[key],
                "BusinessGroup": uniqueSupportTeamObject[key].BusinessGroup.join(', ')
            })
        })

        // Result Set 2 - Application Type List
        // modify the property names of TypeID and Type
        let modifiedApplicationTypeList = applicationTypeList.map((obj) => {
            let { TypeID, Type } = obj;
            let ApplicationTypeID = TypeID;
            let ApplicationType = Type;

            return { ApplicationTypeID, ApplicationType };
        })

        // Result Set 3 - Business Functions List
        // modify the property name of BusinessFunctions
        let modifiedBusinessFunctionsList = businessFunctionsList.map((obj) => {
            let { BusinessFunctionsID, BusinessFunctions } = obj;
            let BusinessFunction = BusinessFunctions;
            BusinessFunctionsID = Number(BusinessFunctionsID)

            return { BusinessFunctionsID, BusinessFunction };
        })

        // Result Set 4 - Support Team List
        // modify the property name of SupportTeamList
        let modifiedSupportTeamList = uniqueSupportTeamList.map((obj) => {
            let { UserGUID, UserName, BusinessGroup } = obj;
            let TeamMember = UserName;

            return { UserGUID, TeamMember, BusinessGroup }
        })

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getFormatBusinessServicesAppsMasterInfo : Execution End.');

        return {
            "ApplicationTypeList"   : modifiedApplicationTypeList,
            "BusinessFunctionsList" : modifiedBusinessFunctionsList,
            "SitesList"             : newSiteList,
            "BusinessOwnersList"    : businessOwnersList,
            "ITOwnersList"          : ITOwnersList,
            "SupportLeadList"       : supportLeadList,
            "SupportTeamList"       : modifiedSupportTeamList
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessServicesAppsBl : getFormatBusinessServicesAppsMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

async function formatPayloadBulkData(userIdFromToken, payloadData, bulkInfoData, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData: Execution started.');        
        let parsedData              = JSON.parse(payloadData);
        let modifiedData            = [];
        let validData               = [];
        let inValidData             = [];
        let modifiedPayloadData     = [];  
        let duplicateData           = [];
        let uniqueRecords           = [];
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData :: bulkInfoData: ' + JSON.stringify(bulkInfoData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData :: parsedData : '  + JSON.stringify(parsedData || null));
        
        if(parsedData.length) {
            parsedData.forEach(obj=>{    
                const requiredKeys = [ 'Application Name*', 'Application Type*', 'Business Function*', "Site*(Multiple Site's should be separated by ';' )", 'IT Owner EmailID*', 'Support Lead EmailID*',
                    'RTO Value*', 'RTO Unit*', 'RPO Value*', 'RPO Unit*', "Support Team EmailID*(Multiple email ID's should be separated by ';' )"];
                const hasAllKeys = requiredKeys.every(key => obj.hasOwnProperty(key) && obj[key]);
                if (hasAllKeys) {    
                    modifiedData.push({
                        "ApplicationName"       : obj['Application Name*'],
                        "ApplicationType"       : obj['Application Type*'],
                        "BusinessFunction"      : obj['Business Function*'],                    
                        "Site"                  : obj["Site*(Multiple Site's should be separated by ';' )"],
                        "ITOwnerEmailID"        : obj['IT Owner EmailID*'],
                        "SupportLeadEmailID"    : obj['Support Lead EmailID*'],                    
                        "RTOValue"              : obj['RTO Value*'],
                        "RTOUnit"               : obj['RTO Unit*'],
                        "RPOValue"              : obj['RPO Value*'],
                        "RPOUnit"               : obj['RPO Unit*'], 
                        "SupportTeamEmailID"    : obj["Support Team EmailID*(Multiple email ID's should be separated by ';' )"]                  
                    });
                } else {
                    inValidData.push({
                        "ApplicationName"       : obj['Application Name*'],
                        "ApplicationType"       : obj['Application Type*'],
                        "BusinessFunction"      : obj['Business Function*'],                    
                        "Site"                  : obj["Site*(Multiple Site's should be separated by ';' )"],
                        "ITOwnerEmailID"        : obj['IT Owner EmailID*'],
                        "SupportLeadEmailID"    : obj['Support Lead EmailID*'],                    
                        "RTOValue"              : obj['RTO Value*'],
                        "RTOUnit"               : obj['RTO Unit*'],
                        "RPOValue"              : obj['RPO Value*'],
                        "RPOUnit"               : obj['RPO Unit*'], 
                        "SupportTeamEmailID"    : obj["Support Team EmailID*(Multiple email ID's should be separated by ';' )"],
                        "FailureDesc"           : "Header name mis matched"
                    })
                }
            })
        }
        
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData  :: modifiedData: ' + JSON.stringify(modifiedData || null));        
        const cleanedData = modifiedData.map((item) => {
            for (const key in item) {
              if (typeof item[key] === "string") {
                item[key] = item[key].trim();
              }
            }
            return item;
        });
          
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData  :: cleanedData: ' + JSON.stringify(cleanedData || null)); 
        
        const grouped = cleanedData.reduce((acc, item) => {
            const { ApplicationName } = item;
            if (!acc[ApplicationName]) {
                acc[ApplicationName] = [];
            }
            acc[ApplicationName].push(item);
            return acc;
        }, {});
        // Separate duplicates and valid data       
        for (const [key, value] of Object.entries(grouped)) {
            if (value.length > 1) {
                duplicateData.push(...value);
            } else {
                uniqueRecords.push(...value);
            }
        }
        if(duplicateData.length) {
            duplicateData.forEach(obj => {
                inValidData.push({
                    "ApplicationName"       : obj.ApplicationName,
                    "ApplicationType"       : obj.ApplicationType,
                    "BusinessFunction"      : obj.BusinessFunction,                    
                    "Site"                  : obj.Site,
                    "ITOwnerEmailID"        : obj.ITOwnerEmailID,
                    "SupportLeadEmailID"    : obj.SupportLeadEmailID,                    
                    "RTOValue"              : obj.RTOValue,
                    "RTOUnit"               : obj.RTOUnit,
                    "RPOValue"              : obj.RPOValue,
                    "RPOUnit"               : obj.RPOUnit,
                    "SupportTeamEmailID"    : obj.SupportTeamEmailID,
                    "FailureDesc"           : "Duplicate Application name found - " + obj.ApplicationName
                });
            })
        }
        
        uniqueRecords.forEach(obj => {
            const BusinessFunction          = bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].find(itr => itr.BusinessFunctions.trim() === obj.BusinessFunction);
            const filteredSite              = BusinessFunction ? bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].filter(n => n.BusinessFunctionsID == Number(BusinessFunction.BusinessFunctionsID)) : [];            
            const siteArray                 = obj.Site.includes(';') ? obj.Site.split(';').filter(Boolean) : [obj.Site]; 
            const SupportTeamEmailIDArray   = obj.SupportTeamEmailID.includes(';') ? obj.SupportTeamEmailID.split(';').filter(Boolean) : [obj.SupportTeamEmailID]; 
            const ApplicationType           = bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].find(itr => itr.Type.trim() === obj.ApplicationType);
            const AllSiteName               = siteArray.every(site => filteredSite.some(itr => itr.SiteName.trim() === site));
            const ITOwnerEmailID            = bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].find(itr => itr.EmailID.trim() === obj.ITOwnerEmailID);
            const SupportLeadEmailID        = bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].find(itr => itr.EmailID.trim() === obj.SupportLeadEmailID);
            const AllSupportTeamEmailID     = SupportTeamEmailIDArray.every(emailID => bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].some(itr => itr.EmailID.trim() === emailID));
            const UniqueApplicationName     = bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].filter(itr => itr.ApplicationName.trim() === obj.ApplicationName.trim());

            if (ApplicationType && BusinessFunction && AllSiteName && ITOwnerEmailID && SupportLeadEmailID && AllSupportTeamEmailID && !UniqueApplicationName.length) {
                modifiedPayloadData.push({
                    "ApplicationName"       : obj.ApplicationName,
                    "ApplicationTypeID"     : Number(bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].find(itr => itr.Type.trim() === obj.ApplicationType).TypeID),
                    "BusinessFunctionID"    : Number(bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].find(itr => itr.BusinessFunctions.trim() === obj.BusinessFunction).BusinessFunctionsID),
                    "Sites"                 : [...new Set(bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].filter(itr => obj.Site.includes(itr.SiteName.trim())).map(site => Number(site.SiteID)))].map(SiteID => ({ SiteID })),
                    "RecoveryTime"          : obj.RTOValue,
                    "RecoveryTimeUnit"      : obj.RTOUnit === 'Hours' ? 1 : 2, //obj.RTOUnit === 'Hours' ? 1 : (obj.RTOUnit === 'Days' ? 2 : 0)
                    "RecoveryPoint"         : obj.RPOValue,
                    "RecoveryPointUnit"     : obj.RPOUnit === 'Hours' ? 1 : 2, //obj.RPOUnit === 'Hours' ? 1 : (obj.RPOUnit === 'Days' ? 2 : 0)   
                    "ITOwnerGUID"           : bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].find(itr => itr.EmailID.trim() === obj.ITOwnerEmailID).ITOwnerID,
                    "SupportLeadGUID"       : bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].find(itr => itr.EmailID.trim() === obj.SupportLeadEmailID).SupportLeadID,  
                    "SupportTeam"           : [...new Set(bulkInfoData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].filter(itr => obj.SupportTeamEmailID.trim().includes(itr.EmailID)).map(user => user.UserGUID))].map(UserGUID => ({ UserGUID }))                   
                })
                validData.push({
                    "ApplicationName"       : obj.ApplicationName,
                    "ApplicationType"       : obj.ApplicationType,
                    "BusinessFunction"      : obj.BusinessFunction,                    
                    "Site"                  : obj.Site,
                    "ITOwnerEmailID"        : obj.ITOwnerEmailID,
                    "SupportLeadEmailID"    : obj.SupportLeadEmailID,                   
                    "RTOValue"              : obj.RTOValue,
                    "RTOUnit"               : obj.RTOUnit,
                    "RPOValue"              : obj.RPOValue,
                    "RPOUnit"               : obj.RPOUnit,
                    "SupportTeamEmailID"    : obj.SupportTeamEmailID,
                    "ITOwnerGUID"           : ITOwnerEmailID.ITOwnerID,
                    "SupportLeadID"         : SupportLeadEmailID.SupportLeadID
                });
            }  else {
                let failureReasons = [];      
                if (!ApplicationType)               failureReasons.push("Application Type");
                if (!BusinessFunction)              failureReasons.push("Business Function");
                if (!AllSiteName)                   failureReasons.push("Site Name");
                if (!ITOwnerEmailID)                failureReasons.push("ITOwner Email ID");
                if (!SupportLeadEmailID)            failureReasons.push("Support Lead Email ID");
                if (!AllSupportTeamEmailID)         failureReasons.push("Support Team Email ID"); 
                if (UniqueApplicationName.length)   failureReasons.push("Duplicate Application Name found");
                inValidData.push({
                    "ApplicationName"       : obj.ApplicationName,
                    "ApplicationType"       : obj.ApplicationType,
                    "BusinessFunction"      : obj.BusinessFunction,                    
                    "Site"                  : obj.Site,
                    "ITOwnerEmailID"        : obj.ITOwnerEmailID,
                    "SupportLeadEmailID"    : obj.SupportLeadEmailID,                    
                    "RTOValue"              : obj.RTOValue,
                    "RTOUnit"               : obj.RTOUnit,
                    "RPOValue"              : obj.RPOValue,
                    "RPOUnit"               : obj.RPOUnit,
                    "SupportTeamEmailID"    : obj.SupportTeamEmailID,
                    "FailureDesc"           : "Incorrect fields- " + failureReasons.join(", ")
                });
            }
        });      
        
      
        const InputData = modifiedPayloadData.map(item => ({
            ...item,
            "Sites": JSON.stringify(item.Sites),
            "SupportTeam": JSON.stringify(item.SupportTeam)
        }));
        
        let resp = {
            "validData"             : validData, //.length ? validData : [],
            "inValidData"           : inValidData, //.length ? inValidData : [],
            "modifiedPayloadData"   : InputData
        };                 
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData  :: resp : '   + JSON.stringify(resp || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData  ::  Execution end.');
        return resp;
    } catch (error) {
        logger.log('error', 'User Id: ' + userIdFromToken + ' : BusinessServicesAppsBl: formatPayloadBulkData :: Execution end. : Got an unhandled error. : Error Detail: ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getBusinessServicesAndAppsBLClassInstance() {
    if (BusinessServicesAndAppsBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        BusinessServicesAndAppsBLClassInstance = new BusinessServicesAppsBl();
    }
    return BusinessServicesAndAppsBLClassInstance;
}

exports.getBusinessServicesAndAppsBLClassInstance = getBusinessServicesAndAppsBLClassInstance;
