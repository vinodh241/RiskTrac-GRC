const MESSAGE_FILE_OBJ      = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ     = require("../../utility/constants/constant.js");
const APP_VALIDATOR         = require("../../utility/app-validator.js");
const BCMS_TESTING_DB       = require("../../data-access/bcms-testing-db.js");
const { logger }            = require("../../utility/log-manager/log-manager.js");
const UtilityApp 			= require("../../utility/utility.js");
const BCMS_TEMPLATE_NOTIFY  = require("../../config/email-template/generic-bcms-template.js")
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
const EMAIL_NOTIFICATION    = require("../../utility/email-notification.js");
const INAPP_DB              = require("../../data-access/inApp-notification-db.js");
const FILE_TYPE             = require('file-type');
const path                  = require('path');
const fileSystem            = require('fs');
const { use }               = require("browser-sync");
const ENUMS_OBJ             = require("../../utility/enums/enums.js")

var BCMSTesingBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var bcmsTestingDB               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailNotificationObject     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BCMSTestingBL {
    constructor() {
        bcmsTestingDB               = new BCMS_TESTING_DB();
        appValidatorObject          = new APP_VALIDATOR();
        utilityAppObject            = new UtilityApp();
        emailNotificationObject     = new EMAIL_NOTIFICATION();
        inAppNotificationDbObject   = new INAPP_DB();
    }

    start() {}

      /** 
    * This function will fetch the all bcms tests from the dataBase 
    */
      async getBcmsTestsList(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken

        try {

            const GET_BCMS_TESTS_DB_RESPONSE = await bcmsTestingDB.getBcmsTestsList(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsTestsList : ');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BCMS_TESTS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BCMS_TESTS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsTestsList : Execution end. :  GET_BCMS_TESTS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BCMS_TESTS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsTestsList : Execution end. : Error details :' + GET_BCMS_TESTS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BCMS_TESTS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BCMS_TESTS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsTestsList : Execution end. : Error details : ' + GET_BCMS_TESTS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_BCMS_TESTS = await getFormatBCMSTestsList(userIdFromToken, GET_BCMS_TESTS_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_BCMS_TESTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_BCMS_TESTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsTestsList : Execution end. :  FORMAT_GET_BCMS_TESTS response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_BCMS_TESTS));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsTestsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch info details for create BCMS test from the dataBase 
    */
    async getBcmsAddTestInfo(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken
        try {

            const ADD_BCMS_TEST_INFO_DB_RESPONSE = await bcmsTestingDB.getBcmsAddTestInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_BCMS_TEST_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_BCMS_TEST_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsAddTestInfo : Execution end. :  ADD_BCMS_TEST_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_BCMS_TEST_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsAddTestInfo : Execution end. : Error details :' + ADD_BCMS_TEST_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_BCMS_TEST_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_BCMS_TEST_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsAddTestInfo : Execution end. : Error details : ' + ADD_BCMS_TEST_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_ADD_BCMS_TEST_INFO = await getFormatBCMSTestsInfo(userIdFromToken, ADD_BCMS_TEST_INFO_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_BCMS_TEST_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_BCMS_TEST_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsAddTestInfo : Execution end. :  FORMAT_ADD_BCMS_TEST_INFO response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ADD_BCMS_TEST_INFO));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsAddTestInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will create new bcms test
    */
      async addBcmsTest(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testTitle || appValidatorObject.isStringEmpty(bcmsTestingData.testTitle)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : testTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedStartDate || '' == bcmsTestingData.plannedStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedStartTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedStartTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedStartDateTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_START_DATE_TIME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedEndDate || '' == bcmsTestingData.plannedEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedEndTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedEndTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedEndDateTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_END_DATE_TIME_NULL_EMPTY));
            }

            let dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, bcmsTestingData.plannedStartDate, bcmsTestingData.plannedStartTime, bcmsTestingData.plannedEndDate, bcmsTestingData.plannedEndTime, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
            if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. :' + dateTimeNotValid.message);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
            }

            //This function will merge date(2024-03-12T00:00:00.000Z)and time(21:08) into format 2024-03-12T21:08:00.000Z
            let plannedStartDateTime    = await utilityAppObject.mergeDateAndTime(userIdFromToken, bcmsTestingData.plannedStartDate, bcmsTestingData.plannedStartTime);
            let plannedEndDateTime      = await utilityAppObject.mergeDateAndTime(userIdFromToken, bcmsTestingData.plannedEndDate, bcmsTestingData.plannedEndTime);

            // calculate the difference between two dates in hours
            let diff = new Date(plannedEndDateTime).getTime() - new Date(plannedStartDateTime).getTime();
            let hoursDifference = diff / (60 * 60 * 1000); // Total hours
       
            if (hoursDifference < CONSTANT_FILE_OBJ.APP_CONSTANT.THREE || hoursDifference > CONSTANT_FILE_OBJ.APP_CONSTANT.SEVENTY_TWO) {
                let message = `The duration between the time should be greater than 3 and less than 72 hours.`;
                logger.log('info', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : The duration between the dates is:'+ hoursDifference +'hours');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, message));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testTitleScenario || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testTitleScenario|| appValidatorObject.isStringEmpty(bcmsTestingData.testTitleScenario)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : testTitleScenario is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_SCENARIO_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testScenarioDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testScenarioDescription|| appValidatorObject.isStringEmpty(bcmsTestingData.testScenarioDescription)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : testScenarioDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_SCENARIO_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverGUID|| appValidatorObject.isStringEmpty(bcmsTestingData.testObserverGUID)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : testObserverGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_GUID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedTestLimitations || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedTestLimitations|| appValidatorObject.isStringEmpty(bcmsTestingData.plannedTestLimitations)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedTestLimitations is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_TEST_LIMITATIONS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedFinancialImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedFinancialImpact|| appValidatorObject.isStringEmpty(bcmsTestingData.plannedFinancialImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedFinancialImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_FINANCIAL_IMPACT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedCustomerImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedCustomerImpact|| appValidatorObject.isStringEmpty(bcmsTestingData.plannedCustomerImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedCustomerImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_CUSTOMER_IMPACT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.participantsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.participantsData || bcmsTestingData.participantsData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : participantsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PARTICIPANTS_NULL_EMPTY));
            }
            let participantOption       = bcmsTestingData.participantsData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].participantsOptionID;
            let participantOptionValue  = bcmsTestingData.participantsData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].participantsOptionValue;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == participantOption || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == participantOption ) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : participantsOptionID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PARTICIPANT_OPTION_ID_NULL_EMPTY));
            }
            if ((participantOption != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == participantOptionValue || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == participantOptionValue || participantOptionValue.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO))) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : participantsOptionValue is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PARTICIPANTS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.disruptionScenarios || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.disruptionScenarios || bcmsTestingData.disruptionScenarios.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : disruptionScenarios is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DISRUPTION_SCENARIOS_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */
            
            const ADD_BCMS_TEST_DB_RESPONSE = await bcmsTestingDB.addBcmsTest(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : ADD_BCMS_TEST_DB_RESPONSE : ' + JSON.stringify(ADD_BCMS_TEST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_BCMS_TEST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_BCMS_TEST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : Execution end. :  ADD_BCMS_TEST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_BCMS_TEST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : Execution end. : Error details :' + ADD_BCMS_TEST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (ADD_BCMS_TEST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_BCMS_TEST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : Execution end. : Error details : ' + ADD_BCMS_TEST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }


            const FORMAT_ADD_BCMS_TEST = await getFormatBCMSTestsList(userIdFromToken, ADD_BCMS_TEST_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_BCMS_TEST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_BCMS_TEST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : Execution end. :  FORMAT_ADD_BCMS_TEST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_ADD_BCMS_TEST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : addBcmsTest : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will update new bcms test in Scheduled Status
    */
    async updateBcmsTest(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest : Execution started.');

             /**
             * Input Validation : Start
             * 
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testTitle || appValidatorObject.isStringEmpty(bcmsTestingData.testTitle)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : testTitle is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_TITLE_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedStartDate || '' == bcmsTestingData.plannedStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedStartTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedStartTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : plannedStartDateTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_START_DATE_TIME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedEndDate  || '' == bcmsTestingData.plannedEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedEndTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedEndTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : plannedEndDateTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_END_DATE_TIME_NULL_EMPTY));
            }

            /** 
            * Fetching particular Incident record from data base to verfy existing start/end date and time with requested date and time : Start
            */
            const GET_BCMS_TEST_DATA_DB_RESPONSE = await bcmsTestingDB.getBcmsTestData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest  :GET_BCMS_TEST_DATA_DB_RESPONSE.' + JSON.stringify(GET_BCMS_TEST_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BCMS_TEST_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BCMS_TEST_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. :  GET_BCMS_TEST_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BCMS_TEST_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. : Error details :' + GET_BCMS_TEST_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BCMS_TEST_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BCMS_TEST_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. : Error details : ' + GET_BCMS_TEST_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if(GET_BCMS_TEST_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  GET_BCMS_TEST_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
                const testDetails = GET_BCMS_TEST_DATA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                let ScheduledDate   = await utilityAppObject.formatMergeDateTime(userIdFromToken, testDetails.PlannedStartDate, testDetails.PlannedStartTime);
                let EndDate         = await utilityAppObject.formatMergeDateTime(userIdFromToken, testDetails.PlannedEndDate, testDetails.PlannedEndTime);

                let previousStartDateTime = await utilityAppObject.formatSplitDateTime(userIdFromToken, new Date(ScheduledDate));
                let previousEndDateTime = await utilityAppObject.formatSplitDateTime(userIdFromToken, new Date(EndDate));

                let startDate = previousStartDateTime.date != bcmsTestingData.plannedStartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] ? bcmsTestingData.plannedStartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : previousStartDateTime.date ;
                let startTime = previousStartDateTime.time != bcmsTestingData.plannedStartTime ? bcmsTestingData.plannedStartTime : previousStartDateTime.time ;
                let endDate =  previousEndDateTime.date != bcmsTestingData.plannedEndDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] ? bcmsTestingData.plannedEndDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : previousEndDateTime.date ; 
                let endTime =  previousEndDateTime.time != bcmsTestingData.plannedEndTime ? bcmsTestingData.plannedEndTime :  previousEndDateTime.time ;
                
                // Checking requested date and time with existing date and time
                if (previousStartDateTime.date != bcmsTestingData.plannedStartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] || previousStartDateTime.time != bcmsTestingData.plannedStartTime || previousEndDateTime.date != bcmsTestingData.plannedEndDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] || previousEndDateTime.time != bcmsTestingData.plannedEndTime) {

                    let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, startDate, startTime, endDate, endTime, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, previousStartDateTime.date != bcmsTestingData.plannedStartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], previousEndDateTime.date != bcmsTestingData.plannedEndDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);       
                    if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateIncidentReport : Execution end. :' + dateTimeNotValid.message);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message));
                    }
                }
            }
            /** 
            * Fetching particular Incident record from data base to verfy existing start/end date and time with requested date and time : End
            */

            //This function will merge date(2024-03-12T00:00:00.000Z)and time(21:08) into format 2024-03-12T21:08:00.000Z
            let plannedStartDateTime    = await utilityAppObject.mergeDateAndTime(userIdFromToken, bcmsTestingData.plannedStartDate, bcmsTestingData.plannedStartTime);
            let plannedEndDateTime      = await utilityAppObject.mergeDateAndTime(userIdFromToken, bcmsTestingData.plannedEndDate, bcmsTestingData.plannedEndTime);

            // calculate the difference between two dates in hours
            let diff = new Date(plannedEndDateTime).getTime() - new Date(plannedStartDateTime).getTime();
            let hoursDifference = diff / (60 * 60 * 1000); // Total hours

            if (hoursDifference < CONSTANT_FILE_OBJ.APP_CONSTANT.THREE || hoursDifference > CONSTANT_FILE_OBJ.APP_CONSTANT.SEVENTY_TWO) {
                let message = `The duration between the time should be greater than 3 and less than 72 hours.`;
                logger.log('info', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : The duration between the dates is:'+ hoursDifference +'hours');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, message));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testTitleScenario || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testTitleScenario|| appValidatorObject.isStringEmpty(bcmsTestingData.testTitleScenario)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : testTitleScenario is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_SCENARIO_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testScenarioDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testScenarioDescription|| appValidatorObject.isStringEmpty(bcmsTestingData.testScenarioDescription)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : testScenarioDescription is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_SCENARIO_DESCRIPTION_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverGUID|| appValidatorObject.isStringEmpty(bcmsTestingData.testObserverGUID)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : testObserverGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_GUID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentStatusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentStatusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : testAssessmentStatusId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_STATUS_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedTestLimitations || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedTestLimitations|| appValidatorObject.isStringEmpty(bcmsTestingData.plannedTestLimitations)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : plannedTestLimitations is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_TEST_LIMITATIONS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedFinancialImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedFinancialImpact|| appValidatorObject.isStringEmpty(bcmsTestingData.plannedFinancialImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : plannedFinancialImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_FINANCIAL_IMPACT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedCustomerImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedCustomerImpact|| appValidatorObject.isStringEmpty(bcmsTestingData.plannedCustomerImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : plannedCustomerImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_CUSTOMER_IMPACT_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.participantsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.participantsData || bcmsTestingData.participantsData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : participantsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PARTICIPANTS_NULL_EMPTY));
            }

            let participantOption       = bcmsTestingData.participantsData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].participantsOptionID;
            let participantOptionValue  = bcmsTestingData.participantsData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].participantsOptionValue;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == participantOption || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == participantOption ) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : participantsOptionID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PARTICIPANT_OPTION_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == participantOptionValue || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == participantOptionValue || (participantOption != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && participantOptionValue.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : participantsOptionValue is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PARTICIPANTS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.disruptionScenarios || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.disruptionScenarios || bcmsTestingData.disruptionScenarios.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTest : Execution end. : disruptionScenarios is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DISRUPTION_SCENARIOS_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const UPDATE_BCMS_TEST_DB_RESPONSE = await bcmsTestingDB.updateBcmsTest(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_BCMS_TEST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_BCMS_TEST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest : Execution end. :  UPDATE_BCMS_TEST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_BCMS_TEST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest : Execution end. : Error details :' + UPDATE_BCMS_TEST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_BCMS_TEST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_BCMS_TEST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest : Execution end. : Error details : ' + UPDATE_BCMS_TEST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }


            const FORMAT_UPDATE_BCMS_TEST = await getFormatBCMSTestsList(userIdFromToken, UPDATE_BCMS_TEST_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_UPDATE_BCMS_TEST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_UPDATE_BCMS_TEST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest : Execution end. :  FORMAT_UPDATE_BCMS_TEST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_UPDATE_BCMS_TEST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTest : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the bcms test details of particular asessment from the dataBase 
    */
      async getBcmsTestData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             =  request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
       
		try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getBcmsTestData : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution started.');

            /**
            * Input Validation : Start
            */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getBcmsTestData : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
            */

            const GET_BCMS_TEST_DATA_DB_RESPONSE = await bcmsTestingDB.getBcmsTestData(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData  :GET_BCMS_TEST_DATA_DB_RESPONSE.' + JSON.stringify(GET_BCMS_TEST_DATA_DB_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_BCMS_TEST_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_BCMS_TEST_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. :  GET_BCMS_TEST_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BCMS_TEST_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. : Error details :' + GET_BCMS_TEST_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_BCMS_TEST_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_BCMS_TEST_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. : Error details : ' + GET_BCMS_TEST_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_BCMS_TEST_DATA = await getFormatBCMSTestData(userIdFromToken, GET_BCMS_TEST_DATA_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_BCMS_TEST_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_BCMS_TEST_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. :  FORMAT_BCMS_TEST_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_BCMS_TEST_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsTestData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

     /** 
    * This function will update Assessment Status of particular asessment from the dataBase 
    */
     async updateBcmsTestStatus(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let inAppMessage            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        
		 try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.currentStatusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.currentStatusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : currentStatusId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CURRENT_STATUS_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.nextStatusId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.nextStatusId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : nextStatusId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEXT_STATUS_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const UPDATE_TEST_STATUS_DB_RESPONSE = await bcmsTestingDB.updateBcmsTestStatus(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_TEST_STATUS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_TEST_STATUS_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus : Execution end. :  UPDATE_TEST_STATUS_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_TEST_STATUS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : Error details :' + UPDATE_TEST_STATUS_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_TEST_STATUS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_TEST_STATUS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : Error details : ' + UPDATE_TEST_STATUS_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }


            const FORMAT_BCMS_TEST_DATA = await getFormatBCMSTestData(userIdFromToken, UPDATE_TEST_STATUS_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_BCMS_TEST_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_BCMS_TEST_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus : Execution end. :  FORMAT_BCMS_TEST_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }

            /** Email Logic :Starts */
            const GET_EMAIL_RESPONSE = await bcmsTestingDB.getDataForEmail(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus :GET_EMAIL_RESPONSE : ' +JSON.stringify(GET_EMAIL_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EMAIL_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EMAIL_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : updateBcmsTestStatus : Execution end. :  GET_EMAIL_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
            if (GET_EMAIL_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : updateBcmsTestStatus : Execution end. : Error details :' + GET_EMAIL_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }
            if (GET_EMAIL_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EMAIL_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : updateBcmsTestStatus : Execution end. : Error details : ' + GET_EMAIL_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
            }

            let emailResponse           = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
            let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
            }
            if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
            }

            //CC:BC Manager, Business Owner and Steering committee
            let BCMSArray       = data.BCMMangerUsersEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.BCMMangerUsersEmailIDs.split(',') : [];
            let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
            let BOArray         = emailResponse.filter(obj => obj.BusinessOwnerEmailID != null).map(obj => obj.BusinessOwnerEmailID);
            let mergedArray     = [...BCMSArray, ...SCArray,...BOArray];
            let uniqueEmails    = [...new Set(mergedArray)];
            let CCList          = uniqueEmails.join(',');

            if (bcmsTestingData.nextStatusId == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                let emailDetails = {
                    "TestName"                  : data.TestName,
                    "ActualStartDateTime"       : ActualStartDateTime,
                    "ActualEndDateTime"         : ActualEndDateTime,
                    "Subject"                   : `BCMS Test-"${data.TestName}" has been moved to InProgress`,
                    "Note"                      : "BCMS Test will be available for Steering committee once it is Published."
                }
                
                //To: BCC (All relevant business function),  Test Observer User  will receive email together
                let emailAddresses = new Set();
                emailResponse.forEach(data => {
                    if(data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        JSON.parse(data.BCCUsersDetails).forEach(user => {
                            emailAddresses.add(user.EmailID);
                        });
                    }
                    emailAddresses.add(data.TestObserverEmailID);
                });
                let toList = Array.from(emailAddresses).join(',');

                const SEND_EMAIL    = await sendEmailNotification(userIdFromToken, userNameFromToken, emailDetails, toList, CCList, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                
                inAppMessage        = `BCMS Test-"${data.TestName}" has been moved to InProgress`;

            } else if(bcmsTestingData.nextStatusId == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE) {
                let emailDetails = {
                    "TestName"                  : data.TestName,
                    "ActualStartDateTime"       : ActualStartDateTime,
                    "ActualEndDateTime"         : ActualEndDateTime,
                    "Subject"                   : `BCMS Test-"${data.TestName}" has been moved to Completed`,
                    "Note"                      : "User can start filling the data. BCMS Test will be available for Steering committee once it is Published."
                }

                //TO: BCC (All relevant business function ) and Test Observer will receive email separate separate 
                let testObserverDetails = {"UserGUID":data.TestObserverID,"FullName":data.TestObserverName,"EmailID":data.TestObserverEmailID}
                
                let toList = [];

                let bccusers = data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(data.BCCUsersDetails) : []
                emailResponse.forEach(data => {
                    toList = toList.concat(bccusers);
                });
                toList.push(testObserverDetails);

                toList = toList.filter((value, index, self) =>
                    index === self.findIndex((t) => (t.UserGUID == value.UserGUID)
                ))

                const SEND_EMAIL    = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)
                inAppMessage        = `BCMS Test-"${data.TestName}" has been moved to Completed`;
                
            }
             /** Email Logic : Ends */
            //InApp alert starts

            let BCCUsersList     = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');
            let inAppUserList    =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," +data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
            let inappDetails     = {
                inAppContent     : inAppMessage + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                recepientUserID  : inAppUserList,
                subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
            }

            let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
            //InApp alert end           

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA, FORMAT_BCMS_TEST_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : updateBcmsTestStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA_UNSUCCESSFUL));
        }
    }

     /** 
    * This function will fetch the bcms test participant report of particular asessment from the dataBase 
    */
     async getParticipantReportData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getParticipantReportData : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getParticipantReportData : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testParticipantId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testParticipantId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getParticipantReportData : Execution end. : testParticipantId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_PARTICIPANT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getParticipantReportData : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }


            /**
             * Input Validation : End
             * 
             */

            const GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE = await bcmsTestingDB.getParticipantReportData(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData :GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE : ' +JSON.stringify(GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData : Execution end. :  GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData : Execution end. : Error details :' + GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData : Execution end. : Error details : ' + GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_PARTICIPANT_REPORT_DATA = await getFormatTestParticipantReportData(userIdFromToken, GET_PARTICIPANT_REPORT_DATA_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_PARTICIPANT_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_PARTICIPANT_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData : Execution end. :  FORMAT_PARTICIPANT_REPORT_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_PARTICIPANT_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getParticipantReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will save participant report of particular asessment to the dataBase 
    */
      async saveParticipantReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;

        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveParticipantReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveParticipantReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveParticipantReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testParticipantId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testParticipantId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveParticipantReport : Execution end. : testParticipantId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_PARTICIPANT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveParticipantReport : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.responses || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.responses || bcmsTestingData.responses.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveParticipantReport : Execution end. : responses is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RESPONSES_NULL_EMPTY));
            }

            /**
             * Input Validation : End 
             */

            const SAVE_PARTICIPANT_REPORT_DB_RESPONSE = await bcmsTestingDB.saveParticipantReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_PARTICIPANT_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_PARTICIPANT_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveParticipantReport : Execution end. :  SAVE_PARTICIPANT_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_PARTICIPANT_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveParticipantReport : Execution end. : Error details :' + SAVE_PARTICIPANT_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_PARTICIPANT_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_PARTICIPANT_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveParticipantReport : Execution end. : Error details : ' + SAVE_PARTICIPANT_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }


            const FORMAT_SAVE_PARTICIPANT_REPORT = await getFormatTestParticipantReportData(userIdFromToken, SAVE_PARTICIPANT_REPORT_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SAVE_PARTICIPANT_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SAVE_PARTICIPANT_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveParticipantReport : Execution end. :  FORMAT_SAVE_PARTICIPANT_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }


            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SAVE_PARTICIPANT_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveParticipantReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will submit participant report of particular asessment to the BCManager 
    */
      async submitParticipantReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitParticipantReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitParticipantReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitParticipantReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testParticipantId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testParticipantId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitParticipantReport : Execution end. : testParticipantId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_PARTICIPANT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitParticipantReport : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.templateId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.templateId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitParticipantReport : Execution end. : templateId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEMPLATE_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.reviewComment) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitParticipantReport : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMENT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE = await bcmsTestingDB.submitParticipantReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitParticipantReport : Execution end. :  SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitParticipantReport : Execution end. : Error details :' + SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitParticipantReport : Execution end. : Error details : ' + SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }


            const FORMAT_SUBMIT_PARTICIPANT_REPORT = await getFormatTestParticipantReportData(userIdFromToken, SUBMIT_PARTICIPANT_REPORT_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SUBMIT_PARTICIPANT_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SUBMIT_PARTICIPANT_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitParticipantReport : Execution end. :  FORMAT_SUBMIT_PARTICIPANT_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

             /** Email Logic :Starts */
             const GET_EMAIL_RESPONSE = await bcmsTestingDB.getDataForEmail(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EMAIL_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EMAIL_RESPONSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : submitParticipantReport : Execution end. :  GET_EMAIL_RESPONSE is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : submitParticipantReport : Execution end. : Error details :' + GET_EMAIL_RESPONSE.errorMsg);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EMAIL_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : submitParticipantReport : Execution end. : Error details : ' + GET_EMAIL_RESPONSE.procedureMessage);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }

             let emailResponse        = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

             let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
             let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
             let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
 
             if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                 ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
             }
             if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                 ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
             }
             
            let emailDetails = {
                "TestName"                  : data.TestName,
                "ActualStartDateTime"       : ActualStartDateTime,
                "ActualEndDateTime"         : ActualEndDateTime,
                "Subject"                   : `"${data.BusinessFunctionName}" has submitted BCMS Test-"${data.TestName}" for review.`,
                "Note"                      : "User can start reviewing the data. BCMS Test will be available for Steering committee once it is Published."
            }

            //To: Business Owner
            let toList = [];
            let BODetails  =  {"UserGUID":data.BusinessOwner,"FullName":data.BusinessOwnerName,"EmailID":data.BusinessOwnerEmailID}
            toList.push(BODetails); 

            let bccusers = data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(data.BCCUsersDetails) : []
            //CC: BC Manager, Relevant BCC and Steering committee
            let BCMSArray       = data.BCMMangerUsersEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.BCMMangerUsersEmailIDs.split(',') : [];
            let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
            let BCCArray        = bccusers.map(obj => obj.EmailID);
            let mergedArray     = [...BCMSArray, ...SCArray,...BCCArray];
            let uniqueEmails    = [...new Set(mergedArray)];
            let CCList          = uniqueEmails.join(',');   

            const SEND_EMAIL = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)
            /** Email Logic : Ends */

            //InApp alert starts
            let BCCUsersList  = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');

            let inAppUserList    =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," +data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
            let inappDetails     = {
                inAppContent     : `"${data.BusinessFunctionName}" has submitted BCMS Test-"${data.TestName}" for review.` + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                recepientUserID  : inAppUserList,
                subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
            }

            let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
            //InApp alert ends
         
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_SUBMIT_PARTICIPANT_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitParticipantReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will review participant report of particular asessment by BCManager 
    */
      async reviewParticipantReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let inAppMessage            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewParticipantReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testParticipantId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testParticipantId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : testParticipantId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_PARTICIPANT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.templateId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.templateId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : templateId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEMPLATE_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.reviewStatus || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.reviewStatus) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : reviewStatus is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_STATUS_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.reviewComment || appValidatorObject.isStringEmpty(bcmsTestingData.reviewComment)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewParticipantReport : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const REVIEW_PARTICIPANT_REPORT_DB_RESPONSE = await bcmsTestingDB.reviewParticipantReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REVIEW_PARTICIPANT_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REVIEW_PARTICIPANT_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewParticipantReport : Execution end. :  REVIEW_PARTICIPANT_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_PARTICIPANT_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewParticipantReport : Execution end. : Error details :' + REVIEW_PARTICIPANT_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_PARTICIPANT_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && REVIEW_PARTICIPANT_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewParticipantReport : Execution end. : Error details : ' + REVIEW_PARTICIPANT_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }


            const FORMAT_REVIEW_PARTICIPANT_REPORT = await getFormatTestParticipantReportData(userIdFromToken, REVIEW_PARTICIPANT_REPORT_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REVIEW_PARTICIPANT_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REVIEW_PARTICIPANT_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewParticipantReport : Execution end. :  FORMAT_REVIEW_PARTICIPANT_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

             /** Email Logic :Starts */
             const GET_EMAIL_RESPONSE = await bcmsTestingDB.getDataForEmail(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EMAIL_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EMAIL_RESPONSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewParticipantReport : Execution end. :  GET_EMAIL_RESPONSE is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewParticipantReport : Execution end. : Error details :' + GET_EMAIL_RESPONSE.errorMsg);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EMAIL_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewParticipantReport : Execution end. : Error details : ' + GET_EMAIL_RESPONSE.procedureMessage);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }

            // Case:: Rejected
            if(bcmsTestingData.reviewStatus == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                let emailResponse        = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

                let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
                }
                if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
                }
                
                let emailDetails = {
                    "TestName"                  : data.TestName,
                    "ActualStartDateTime"       : ActualStartDateTime,
                    "ActualEndDateTime"         : ActualEndDateTime,
                    "Subject"                   : `BCMS Test-"${data.TestName}" has been returned for "${data.BusinessFunctionName}" by ${FORMAT_REVIEW_PARTICIPANT_REPORT.userRole}`,
                    "Note"                      : "User can update the data and submit again. BCMS Test will be available for Steering committee once it is Published."
                }

                inAppMessage    = `BCMS Test-"${data.TestName}" has been returned for "${data.BusinessFunctionName}" by ${FORMAT_REVIEW_PARTICIPANT_REPORT.userRole}`;

                //CC: BC Manager, Business Owner and Steering committee
                let BCMSArray       = data.BCMMangerUsersEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.BCMMangerUsersEmailIDs.split(',') : [];
                let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
                let BOArray         = data.BusinessOwnerEmailID;
                let mergedArray     = [...BCMSArray, ...SCArray,BOArray];
                let uniqueEmails    = [...new Set(mergedArray)];
                let CCList          = uniqueEmails.join(',');

                //To: BCC (All relevant business function ) separate  email  
                let toList = data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(data.BCCUsersDetails) : []
                    
                const SEND_EMAIL    = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)
                //InApp alert starts
                let BCCUsersList        = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');
                let inAppUserList       =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," + data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
                let inappDetails     = {
                    inAppContent     : inAppMessage + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                    recepientUserID  : inAppUserList,
                    subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
                }

                let InAPPResponse    = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                //InApp alert ends
            } else {
                let emailResponse        = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

                let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
                }
                if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
                }
                
                let emailDetails = {
                    "TestName"                  : data.TestName,
                    "ActualStartDateTime"       : ActualStartDateTime,
                    "ActualEndDateTime"         : ActualEndDateTime,
                    "Subject"                   : `BCMS Test-"${data.TestName}" has been approved for "${data.BusinessFunctionName}" by ${FORMAT_REVIEW_PARTICIPANT_REPORT.userRole}`,
                    "Note"                      : `Report has been approved by ${FORMAT_REVIEW_PARTICIPANT_REPORT.userRole} . BCMS Test will be available for Steering committee once it is Published.`
                }
                inAppMessage    = `BCMS Test-"${data.TestName}" has been approved for "${data.BusinessFunctionName}" by ${FORMAT_REVIEW_PARTICIPANT_REPORT.userRole}`;
                if(FORMAT_REVIEW_PARTICIPANT_REPORT.userRole == 'BC Manager'){
                    //CC: BC Manager, Business Owner and Steering committee
                    let BCMSArray       = data.BCMMangerUsersEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.BCMMangerUsersEmailIDs.split(',') : [];
                    let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
                    let BOArray         = data.BusinessOwnerEmailID;
                    let mergedArray     = [...BCMSArray, ...SCArray,BOArray];
                    let uniqueEmails    = [...new Set(mergedArray)];
                    let CCList          = uniqueEmails.join(',');
    
                    //To: BCC (All relevant business function ) separate  email  
                    let toList = data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(data.BCCUsersDetails) : []

                    const SEND_EMAIL = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)

                } else if(FORMAT_REVIEW_PARTICIPANT_REPORT.userRole == 'Bussiness Owner'){
                    //CC: Steering committee , Business Owner and BCC (relevant Business function)
                    let bcc = data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(data.BCCUsersDetails) : []
                    let BCCArray        = bcc.map(obj => obj.EmailID);;
                    let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
                    let BOArray         = data.BusinessOwnerEmailID;
                    let mergedArray     = [BOArray, ...SCArray,...BCCArray];
                    let uniqueEmails    = [...new Set(mergedArray)];
                    let CCList          = uniqueEmails.join(',');

                    //To: BC Manager
                    let toList = data.BCMMangerUsersEmailIDs;

                    const SEND_EMAIL = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                }
                /** Email Logic : Ends */

                //InApp alert starts
                let BCCUsersList        = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');
                let inAppUserList       =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," +data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
                let inappDetails     = {
                    inAppContent     : inAppMessage + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                    recepientUserID  : inAppUserList,
                    subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
                }

                let InAPPResponse    = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                //InApp alert ends
                
            }
            
         
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_REVIEW_PARTICIPANT_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewParticipantReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the bcms test observer report of particular asessment from the dataBase 
    */
     async getObserverReportData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getObserverReportData : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getObserverReportData : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getObserverReportData : Execution end. : testObserverId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getObserverReportData : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const GET_OBSERVER_REPORT_DATA_DB_RESPONSE = await bcmsTestingDB.getObserverReportData(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData :GET_OBSERVER_REPORT_DATA_DB_RESPONSE : ' +JSON.stringify(GET_OBSERVER_REPORT_DATA_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_OBSERVER_REPORT_DATA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_OBSERVER_REPORT_DATA_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData : Execution end. :  GET_OBSERVER_REPORT_DATA_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_OBSERVER_REPORT_DATA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData : Execution end. : Error details :' + GET_OBSERVER_REPORT_DATA_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_OBSERVER_REPORT_DATA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OBSERVER_REPORT_DATA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData : Execution end. : Error details : ' + GET_OBSERVER_REPORT_DATA_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_OBSERVER_REPORT_DATA = await getFormatTestObserverReportData(userIdFromToken, GET_OBSERVER_REPORT_DATA_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_OBSERVER_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_OBSERVER_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData : Execution end. :  FORMAT_OBSERVER_REPORT_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_OBSERVER_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getObserverReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

     /** 
    * This function will save observer report of particular asessment to the dataBase 
    */
     async saveObserverReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveObserverReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : testObserverId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverLnkId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverLnkId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : testObserverLnkId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_LNK_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.responses || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.responses || bcmsTestingData.responses.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : responses is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RESPONSES_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.supportTeamResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.supportTeamResponse || bcmsTestingData.supportTeamResponse.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : saveObserverReport : Execution end. : supportTeamResponse is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_TEAMS_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const SAVE_OBSERVER_REPORT_DB_RESPONSE = await bcmsTestingDB.saveObserverReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_OBSERVER_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_OBSERVER_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveObserverReport : Execution end. :  SAVE_OBSERVER_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_OBSERVER_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveObserverReport : Execution end. : Error details :' + SAVE_OBSERVER_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_OBSERVER_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_OBSERVER_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveObserverReport : Execution end. : Error details : ' + SAVE_OBSERVER_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }


            const FORMAT_SAVE_OBSERVER_REPORT = await getFormatTestObserverReportData(userIdFromToken, SAVE_OBSERVER_REPORT_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SAVE_OBSERVER_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SAVE_OBSERVER_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveObserverReport : Execution end. :  FORMAT_SAVE_OBSERVER_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SAVE_OBSERVER_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : saveObserverReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will submit observer report of particular asessment to the BCManager 
    */
      async submitObserverReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitObserverReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitObserverReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitObserverReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitObserverReport : Execution end. : testObserverId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitObserverReport : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.templateId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.templateId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitObserverReport : Execution end. : templateId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEMPLATE_ID_NULL_EMPTY));
            }
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.reviewComment) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : submitObserverReport : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COMMENT_NULL_EMPTY));
            }


            /**
             * Input Validation : End
             */

            const SUBMIT_OBSERVER_REPORT_DB_RESPONSE = await bcmsTestingDB.submitObserverReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SUBMIT_OBSERVER_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SUBMIT_OBSERVER_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitObserverReport : Execution end. :  SUBMIT_OBSERVER_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_OBSERVER_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitObserverReport : Execution end. : Error details :' + SUBMIT_OBSERVER_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (SUBMIT_OBSERVER_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SUBMIT_OBSERVER_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitObserverReport : Execution end. : Error details : ' + SUBMIT_OBSERVER_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }


            const FORMAT_SUBMIT_OBSERVER_REPORT = await getFormatTestObserverReportData(userIdFromToken, SUBMIT_OBSERVER_REPORT_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SUBMIT_OBSERVER_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SUBMIT_OBSERVER_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitObserverReport : Execution end. :  FORMAT_SUBMIT_OBSERVER_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

             /** Email Logic :Starts */

             let emailPayload = {
                testAssessmentId : bcmsTestingData.testAssessmentId
             }
             const GET_EMAIL_RESPONSE = await bcmsTestingDB.getDataForEmail(userIdFromToken, userNameFromToken,emailPayload, accountGUIDFromToken);

             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EMAIL_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EMAIL_RESPONSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : submitObserverReport : Execution end. :  GET_EMAIL_RESPONSE is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : submitObserverReport : Execution end. : Error details :' + GET_EMAIL_RESPONSE.errorMsg);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EMAIL_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : submitObserverReport : Execution end. : Error details : ' + GET_EMAIL_RESPONSE.procedureMessage);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }

            let emailResponse        = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
             
            let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
            }
            if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
            }
			
            let emailDetails = {
                "TestName"                  : data.TestName,
                "ActualStartDateTime"       : ActualStartDateTime,
                "ActualEndDateTime"         : ActualEndDateTime,
                "Subject"                   : `Test Observer Report for BCMS Test-"${data.TestName}" has been submitted for Review`,
                "Note"                      : "User can start reviewing the data. BCMS Test will be available for Steering committee once it is Published."
            }

            //To: BC Manager
            let toList  = data.BCMMangerUsersEmailIDs;
                
            //CC: Steering committee and Test Observer
            let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
            let testObs         = data.TestObserverEmailID
            let mergedArray     = [...SCArray,testObs];
            let uniqueEmails    = [...new Set(mergedArray)];
            let CCList          = uniqueEmails.join(',');
				
			const SEND_EMAIL = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE)               
            /** Email Logic : Ends */

             //InApp alert starts
            let BCCUsersList  = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');

            let inAppUserList    =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," +data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
            let inappDetails     = {
                inAppContent     : `Test Observer Report for BCMS Test-"${data.TestName}" has been submitted for Review` + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                recepientUserID  : inAppUserList,
                subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
            }
 
            let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
             //InApp alert ends

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_SUBMIT_OBSERVER_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : submitObserverReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will review observer report of particular asessment by BCManager 
    */
      async reviewObserverReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
          accountGUIDFromToken      = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewObserverReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : testObserverId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObserverLnkId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObserverLnkId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : testObserverLnkId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVER_LNK_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.templateId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.templateId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : templateId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEMPLATE_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.status || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.status) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : status is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_STATUS_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.reviewComment || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.reviewComment || appValidatorObject.isStringEmpty(bcmsTestingData.reviewComment)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : reviewObserverReport : Execution end. : reviewComment is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.REVIEW_COMMENT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const REVIEW_OBSERVER_REPORT_DB_RESPONSE = await bcmsTestingDB.reviewObserverReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REVIEW_OBSERVER_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REVIEW_OBSERVER_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewObserverReport : Execution end. :  REVIEW_OBSERVER_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_OBSERVER_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewObserverReport : Execution end. : Error details :' + REVIEW_OBSERVER_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (REVIEW_OBSERVER_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && REVIEW_OBSERVER_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewObserverReport : Execution end. : Error details : ' + REVIEW_OBSERVER_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }


            const FORMAT_REVIEW_OBSERVER_REPORT = await getFormatTestObserverReportData(userIdFromToken, REVIEW_OBSERVER_REPORT_DB_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REVIEW_OBSERVER_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REVIEW_OBSERVER_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewObserverReport : Execution end. :  FORMAT_REVIEW_OBSERVER_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

             /** Email Logic :Starts */
             let emailPayload = {
                testAssessmentId : bcmsTestingData.testAssessmentId
             }
             const GET_EMAIL_RESPONSE = await bcmsTestingDB.getDataForEmail(userIdFromToken, userNameFromToken,emailPayload, accountGUIDFromToken);

             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EMAIL_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EMAIL_RESPONSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewObserverReport : Execution end. :  GET_EMAIL_RESPONSE is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewObserverReport : Execution end. : Error details :' + GET_EMAIL_RESPONSE.errorMsg);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }
             if (GET_EMAIL_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EMAIL_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                 logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewObserverReport : Execution end. : Error details : ' + GET_EMAIL_RESPONSE.procedureMessage);
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
             }

            let emailResponse        = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

            let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
            }
            if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
            }
			
            let emailDetails = {
                "TestName"                  : data.TestName,
                "ActualStartDateTime"       : ActualStartDateTime,
                "ActualEndDateTime"         : ActualEndDateTime,
                "Subject"                   : bcmsTestingData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? `Test Observer Report has been returned for BCMS Test-"${data.TestName}"` : `Test Observer Report has been approved for BCMS Test-"${data.TestName}"`,
                "Note"                      : bcmsTestingData.status == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? "User can update the data and submit again. BCMS Test will be available for Steering committee once it is Published." : "Report has been approved. BCMS Test will be available for Steering committee once it is Published."
            }

            //To: Test Observer
            let toList = [];
            let observerDetails  =  {"UserGUID":data.TestObserverID,"FullName":data.TestObserverName,"EmailID":data.TestObserverEmailID}
            toList.push(observerDetails); 

            //CC: BC Manager  and Steering committee
            let BCMArray        = data.BCMMangerUsersEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.BCMMangerUsersEmailIDs.split(',') : [];
            let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
            let mergedArray     = [...SCArray,...BCMArray];
            let uniqueEmails    = [...new Set(mergedArray)];
            let CCList          = uniqueEmails.join(',');
				
			const SEND_EMAIL = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)
            /** Email Logic : Ends */

             //InApp alert starts
            let BCCUsersList  = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');

            let inAppUserList    =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," +data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
            let inappDetails     = {
                inAppContent     : emailDetails.Subject + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                recepientUserID  : inAppUserList,
                subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
            }

            let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
            //InApp alert ends

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_REVIEW_OBSERVER_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : reviewObserverReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch test report details of particular asessment from the dataBase 
    */
    async getPublishReportData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getPublishReportData : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getPublishReportData : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const GET_TEST_REPORT_DB_RESPONSE = await bcmsTestingDB.getPublishReportData(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_TEST_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_TEST_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. :  GET_TEST_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_TEST_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. : Error details :' + GET_TEST_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_TEST_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_TEST_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. : Error details : ' + GET_TEST_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_GET_TEST_REPORT = await getFormatTestReportData(userIdFromToken, GET_TEST_REPORT_DB_RESPONSE);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_TEST_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_TEST_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. :  FORMAT_GET_TEST_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_TEST_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will save test report details of particular asessment from the dataBase 
    */
    async savePublishReportData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : savePublishReportData : Execution started.');

            /**
            * Input Validation : Start
            * 
            */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testReportId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testReportId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : testReportId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_REPORT_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedTestLimitations || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedTestLimitations || appValidatorObject.isStringEmpty(bcmsTestingData.plannedTestLimitations)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : plannedTestLimitations is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PTL_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.postAnalysisTestLimitation || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.postAnalysisTestLimitation || appValidatorObject.isStringEmpty(bcmsTestingData.postAnalysisTestLimitation)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : postAnalysisTestLimitation is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PATL_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedFinancialImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedFinancialImpact || appValidatorObject.isStringEmpty(bcmsTestingData.plannedFinancialImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : plannedFinancialImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PFI_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.postAnalysisFinancialImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.postAnalysisFinancialImpact || appValidatorObject.isStringEmpty(bcmsTestingData.postAnalysisFinancialImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : postAnalysisFinancialImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PAFI_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedCustomerImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedCustomerImpact || appValidatorObject.isStringEmpty(bcmsTestingData.plannedCustomerImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : plannedCustomerImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PCI_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.postAnalysisCustomerImpact || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.postAnalysisCustomerImpact || appValidatorObject.isStringEmpty(bcmsTestingData.postAnalysisCustomerImpact)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : postAnalysisCustomerImpact is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PACI_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.rootCauseAnalysis || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.rootCauseAnalysis || appValidatorObject.isStringEmpty(bcmsTestingData.rootCauseAnalysis)) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : rootCauseAnalysis is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ROOT_CAUSE_ANALYSIS_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.disruptionScenariosData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.disruptionScenariosData || bcmsTestingData.disruptionScenariosData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : disruptionScenariosData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DISRUPTION_SCENARIOS_DATA_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testingComponentsData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testingComponentsData || bcmsTestingData.testingComponentsData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : testingComponentsData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_COMPONENTS_DATA_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.bussinessFunctions || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.bussinessFunctions || bcmsTestingData.bussinessFunctions.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : bussinessFunctions is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.BUSINESS_FUNCTIONS_NULL_EMPTY));
            } 
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testObservations || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testObservations || bcmsTestingData.testObservations.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : testObservations is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_OBSERVATIONS_NULL_EMPTY));
            }

            /** 
            * Fetching particular Publish Report data record from data base to verfy existing target date of test observer with requested target date : Start
            */
            const GET_TEST_REPORT_DB_RESPONSE = await bcmsTestingDB.getPublishReportData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_TEST_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_TEST_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. :  GET_TEST_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_TEST_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. : Error details :' + GET_TEST_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_TEST_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_TEST_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getPublishReportData : Execution end. : Error details : ' + GET_TEST_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if(GET_TEST_REPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] &&  GET_TEST_REPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
                const testObsActions = GET_TEST_REPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];

                let existingActionPlans = testObsActions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? testObsActions : [];
                for (let actionPlanObj of Object.values(bcmsTestingData.testObservations)){
                    actionPlanObj.StartDate = new Date().toISOString().split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                    if (actionPlanObj.TestActionPlanID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let presentDate = new Date().toISOString().split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                        let dateTimeNotValid = await utilityAppObject.checkDateTimeValidation(userIdFromToken, presentDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, actionPlanObj.TargetDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                        if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                            logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                        }
                    } else {
                        let matchedActionPlan = existingActionPlans.find(x => Number(x.TestActionPlanID) == Number(actionPlanObj.TestActionPlanID));
                        matchedActionPlan.StartDate = new Date().toISOString().split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                        matchedActionPlan.TargetDate = matchedActionPlan.TargetDate.toISOString().split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                        
                        let StartDate   = new Date().toISOString().split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] + "T00:00:00.000Z";
                        let endDate     = matchedActionPlan.TargetDate != actionPlanObj.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] ? actionPlanObj.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : matchedActionPlan.TargetDate ;

                        // Checking requested date and time with existing date and time
                        if (matchedActionPlan.StartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != actionPlanObj.StartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] || matchedActionPlan.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != actionPlanObj.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]) {
                            let dateTimeNotValid = await utilityAppObject.checkDateTimeValidationForEdit(userIdFromToken, StartDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, endDate, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, matchedActionPlan.StartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != actionPlanObj.StartDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], matchedActionPlan.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != actionPlanObj.TargetDate.split('T')[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                            if (dateTimeNotValid.flag == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. :' + dateTimeNotValid.message + "(Action Plan)");
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, dateTimeNotValid.message + "(Action Plan)"));
                            }
                        }
                    }
                }
            }

            /** 
            * Fetching particular Publish Report data record from data base to verfy existing target date of test observer with requested target date : Start
            */

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testResult || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testResult || bcmsTestingData.testResult.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : savePublishReportData : Execution end. : testResult is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_RESULT_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            //updating testResult data based on bussinessFunctions data : Start
 
            let totalFunctions =  bcmsTestingData.bussinessFunctions.length;
            let selectedTestResult = {};
           
            //Case : if BCMS test involves one business function and the test result is partically successful
            if(totalFunctions == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&  bcmsTestingData.bussinessFunctions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Result == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
                // Update the test result percentage as per the value provided by the BC Manager
                bcmsTestingData.testResult.forEach(result => {
                    result.percentage = `0%`;
                    if (Number(result.overAllStatusID) == Number(bcmsTestingData.bussinessFunctions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Result)){
                        let percentage = bcmsTestingData.completionPercent != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (bcmsTestingData.completionPercent) : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                        let percentage_value = (Number(percentage) % CONSTANT_FILE_OBJ.APP_CONSTANT.ONE !== CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && percentage.split('.')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) ? Number(percentage).toFixed(2) : percentage ;
                        result.percentage = `${percentage_value}%`;
                    }
                });
            }
            //Case : if BCMS test involves one business function and the test result is not partically successful/BCMS test involves more than one business function
            else{
                // Count the occurrences of each selected value
                 bcmsTestingData.bussinessFunctions.forEach(func => {
                    if (selectedTestResult[func.Result]) {
                    selectedTestResult[func.Result]++;
                    } else {
                    selectedTestResult[func.Result] = 1;
                    }
                });
               
                // Update the test result percentage value
                bcmsTestingData.testResult.forEach(result => {
                    result.percentage = `0%`;
                    if (selectedTestResult[result.overAllStatusID]) {
                    let percentage = ((selectedTestResult[result.overAllStatusID] / totalFunctions) * 100);
                    let percentage_value = percentage == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? percentage : percentage.toFixed(2);
                    result.percentage = `${percentage_value}%`;
                    }
                });
            }
            //updating testResult data based on bussinessFunctions data : End

            const SAVE_TEST_REPORT_DB_RESPONSE = await bcmsTestingDB.savePublishReportData(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_TEST_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_TEST_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : savePublishReportData : Execution end. :  SAVE_TEST_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_TEST_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : savePublishReportData : Execution end. : Error details :' + SAVE_TEST_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_TEST_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_TEST_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : savePublishReportData : Execution end. : Error details : ' + SAVE_TEST_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }


            const FORMAT_SAVE_TEST_REPORT = await getFormatTestReportData(userIdFromToken, SAVE_TEST_REPORT_DB_RESPONSE);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SAVE_TEST_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SAVE_TEST_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : savePublishReportData : Execution end. :  FORMAT_SAVE_TEST_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SAVE_TEST_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : savePublishReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will publish test report of particular asessment from the dataBase 
    */
    async publishTestReport(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : publishTestReport : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : publishTestReport : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : publishTestReport : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }
            /**
             * Input Validation : End
             */

            const PUBLISH_TEST_REPORT_DB_RESPONSE = await bcmsTestingDB.publishTestReport(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == PUBLISH_TEST_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == PUBLISH_TEST_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : publishTestReport : Execution end. :  PUBLISH_TEST_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (PUBLISH_TEST_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : publishTestReport : Execution end. : Error details :' + PUBLISH_TEST_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (PUBLISH_TEST_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && PUBLISH_TEST_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : publishTestReport : Execution end. : Error details : ' + PUBLISH_TEST_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }


            const FORMAT_TEST_REPORT = await getFormatTestReportData(userIdFromToken, PUBLISH_TEST_REPORT_DB_RESPONSE);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_TEST_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_TEST_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : publishTestReport : Execution end. :  FORMAT_TEST_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

            /** Email Logic :Starts */
            const GET_EMAIL_RESPONSE = await bcmsTestingDB.getDataForEmail(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EMAIL_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EMAIL_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewObserverReport : Execution end. :  GET_EMAIL_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (GET_EMAIL_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewObserverReport : Execution end. : Error details :' + GET_EMAIL_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }
            if (GET_EMAIL_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EMAIL_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : reviewObserverReport : Execution end. : Error details : ' + GET_EMAIL_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
            }

            let emailResponse        = GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? GET_EMAIL_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

            let data                    = emailResponse[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            if(data.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualStartDate,data.ActualStartTime);
            }
            if(data.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,data.ActualEndDate,data.ActualEndTime);
            }
			
			 let emailDetails = {
                "TestName"                  : data.TestName,
                "ActualStartDateTime"       : ActualStartDateTime,
                "ActualEndDateTime"         : ActualEndDateTime,
                "Subject"                   : `BCMS Test-"${data.TestName}" report has been published`,
                "Note"                      : "BCMS Test is published, now Steering committee can view the data in the application."
            }

             //TO: BCC (All relevant business function ) and Test Observer will receive email separate separate 
             let testObserverDetails = {"UserGUID":data.TestObserverID,"FullName":data.TestObserverName,"EmailID":data.TestObserverEmailID}
                
             let toList = [];

             if(data.BCCUsersDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                emailResponse.forEach(data => {
                    toList = toList.concat(JSON.parse(data.BCCUsersDetails));
                });
             }
             toList.push(testObserverDetails);

             toList = toList.filter((value, index, self) =>
                 index === self.findIndex((t) => (t.UserGUID == value.UserGUID)
             ))

            //CC:BC Manager, Business Owner and Steering committee
            let BCMSArray       = data.BCMMangerUsersEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.BCMMangerUsersEmailIDs.split(',') : [];
            let SCArray         = data.SteeringCommitteEmailIDs != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL? data.SteeringCommitteEmailIDs.split(',') : [];
            let BOArray         = emailResponse.filter(obj => obj.BusinessOwnerEmailID != null).map(obj => obj.BusinessOwnerEmailID);
            let mergedArray     = [...BCMSArray, ...SCArray,...BOArray];
            let uniqueEmails    = [...new Set(mergedArray)];
            let CCList          = uniqueEmails.join(',');
				
			const SEND_EMAIL = await sendEmailNotification(userIdFromToken,userNameFromToken,emailDetails,toList,CCList,CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)
            /** Email Logic : Ends */

             //InApp alert starts
             let BCCUsersList  = [...new Set(JSON.parse(data.BCCUsersDetails).map(n => n.UserGUID))].join(',');

             let inAppUserList    =  utilityAppObject.removeDuplicateGUIDs(data.TestObserverID + "," + data.SteeringCommitteUserGUIDs +"," + data.BusinessOwner + "," + BCCUsersList + "," + data.BCMMangerUsersUserGUIDs)
             let inappDetails     = {
                 inAppContent     : `BCMS Test-"${data.TestName}" report has been published` + " link:" + ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].Route,
                 recepientUserID  : inAppUserList,
                 subModuleID      : ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].SubModuleID
             }
 
             let InAPPResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
             //InApp alert ends

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, FORMAT_TEST_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : publishTestReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA_UNSUCCESSFUL));
        }
    }

     /** 
    * This function will validate the bcms start and end date time duration
    */
     async validateBcmsTimeDuration(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
         let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
         accountGUIDFromToken = request.body.accountGUIDFromToken;

        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : validateBcmsTimeDuration : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : validateBcmsTimeDuration : Execution started.');

             /**
             * Input Validation : Start
             */

             if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedStartDate || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedStartTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedStartTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedStartDateTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_START_DATE_TIME_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedEndDate || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.plannedEndTime || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.plannedEndTime) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : addBcmsTest : Execution end. : plannedEndDateTime is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PLANNED_END_DATE_TIME_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            //This function will merge date(2024-03-12T00:00:00.000Z)and time(21:08) into format 2024-03-12T21:08:00.000Z
            let plannedStartDateTime    = await utilityAppObject.mergeDateAndTime(userIdFromToken,bcmsTestingData.plannedStartDate,bcmsTestingData.plannedStartTime);
            let plannedEndDateTime      = await utilityAppObject.mergeDateAndTime(userIdFromToken,bcmsTestingData.plannedEndDate,bcmsTestingData.plannedEndTime);

            // calculate the difference between two dates in hours
            let diff = new Date(plannedEndDateTime).getTime() - new Date(plannedStartDateTime).getTime();
            let hoursDifference = diff / (60 * 60 * 1000); // Total hours
       

            if (hoursDifference >= CONSTANT_FILE_OBJ.APP_CONSTANT.THREE && hoursDifference <= CONSTANT_FILE_OBJ.APP_CONSTANT.SEVENTY_TWO) {
                let message = `The duration between the dates is ${hoursDifference} hours.`;
                logger.log('info', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : validateBcmsTimeDuration : Execution end. : The duration between the dates is:'+ hoursDifference +'hours');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, message, []));
                
            } else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : validateBcmsTimeDuration : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_DATE_TIME_DURATION));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : validateBcmsTimeDuration : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This functin will fetch export draft data 
     */
     async downloadTestExportDraft(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData  		= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
         let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
         accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : downloadTestExportDraft : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : downloadTestExportDraft : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : downloadTestExportDraft : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const GET_TEST_REPORT_DB_RESPONSE = await bcmsTestingDB.getPublishReportData(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_TEST_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_TEST_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : downloadTestExportDraft : Execution end. :  GET_TEST_REPORT_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_TEST_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : downloadTestExportDraft : Execution end. : Error details :' + GET_TEST_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_TEST_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_TEST_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : downloadTestExportDraft : Execution end. : Error details : ' + GET_TEST_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const FORMAT_GET_TEST_REPORT = await getFormatExportData(userIdFromToken, GET_TEST_REPORT_DB_RESPONSE, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_TEST_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_TEST_REPORT) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : downloadTestExportDraft : Execution end. :  FORMAT_GET_TEST_REPORT response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_TEST_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : downloadTestExportDraft : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
    * This function will fetch the review comments based on assessmentid from database 
    */
       async getBcmsReviewComments(request, response) {
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
           let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
           accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getBcmsReviewComments : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BcmsTestingBL : getBcmsReviewComments : Execution started.');


             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.testAssessmentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.testAssessmentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getBcmsReviewComments : Execution end. : testAssessmentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TEST_ASSESSMENT_ID_NULL_EMPTY));
            }

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.scheduledTestId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.scheduledTestId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BcmsTestingBL : getBcmsReviewComments : Execution end. : scheduledTestId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SCHEDULE_TEST_ID_NULL_EMPTY));
            }

            /**
             * Input Validation : End
             */

            const GET_REVIEW_COMMENTS = await bcmsTestingDB.getBcmsReviewComments(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_REVIEW_COMMENTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_REVIEW_COMMENTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsReviewComments : Execution end. :  GET_REVIEW_COMMENTS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REVIEW_COMMENTS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsReviewComments : Execution end. : Error details :' + GET_REVIEW_COMMENTS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REVIEW_COMMENTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_REVIEW_COMMENTS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsReviewComments : Execution end. : Error details : ' + GET_REVIEW_COMMENTS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_REVIEW_COMMENTS = await getFormatBCMSReviewComments(userIdFromToken, GET_REVIEW_COMMENTS, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_REVIEW_COMMENTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_REVIEW_COMMENTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsReviewComments : Execution end. :  FORMAT_GET_REVIEW_COMMENTS response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_REVIEW_COMMENTS));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBcmsReviewComments : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function to upload test evidence file 
    */
     async uploadTestEvidence(request, response) {

        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData     = {
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

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution started.');
            // check request body should not be undefined
            if (typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Request body has not found');
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
            bcmsTestingData.OriginalFileName    = request.files.file.name;         
            bcmsTestingData.FileType            = uploadFileExtension;
            bcmsTestingData.FileContent         = request.files.file.data;
            const mimeType                      = await FILE_TYPE.fromBuffer(bcmsTestingData.FileContent);
            const localFilePath                 = path.join(__dirname, '..','..','file-upload', 'evidences', 'temp');

            if (/^[a-zA-Z0-9\s_\-()./]*$/.test(request.files.file.name)) {
                bcmsTestingData.FileName        = Date.now() +"_"+ request.files.file.name;   
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Error Details : File name should not have special characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_NAME_IS_NOT_VALID));
            }
            // Validating file Size
            if (fileSize > limits) {                    
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Error Details : File size has exceeded the allowed limit');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_SIZE_EXCEED + APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE ));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : mimeType : ' + JSON.stringify(mimeType));

            if (mimeType.ext == 'exe') {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

            if (mimeType != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) {
                // Validating file extension
                if (!(allowedExtensions.includes((mimeType.ext)))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));
                }               
                
                // Validating file Mimetype
                if (!(fileMimeType.includes(mimeType.mime))) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Error Details : File extension is not allowed, Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION));                    
                }                
                const fileUploadedResponse = await utilityAppObject.uploadFileToRemoteServer(userIdFromToken, bcmsTestingData.FileContent, destinationPath, request.files.file.name, bcmsTestingData.FileType, localFilePath);     

                if (fileUploadedResponse.uploadFileResponse) { 
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : File dumped into SFTP server successfully in the path : ' + destinationPath);

                    const GET_EVIDENCE_ATTACHMENT_DB_RESPONSE = await bcmsTestingDB.uploadTestEvidence(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_EVIDENCE_ATTACHMENT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_EVIDENCE_ATTACHMENT_DB_RESPONSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. :  GET_EVIDENCE_ATTACHMENT_DB_RESPONSE is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Error details :' + GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    if (GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Error details : ' + GET_EVIDENCE_ATTACHMENT_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                    
                
                    const FORMAT_RISK_ATTACHMENT_DATA = await getFormatEvidenceList(userIdFromToken,GET_EVIDENCE_ATTACHMENT_DB_RESPONSE , 'upload', accountGUIDFromToken);
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RISK_ATTACHMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RISK_ATTACHMENT_DATA) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. :  FORMAT_RISK_ATTACHMENT_DATA response is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Risk evidence uploaded successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_RISK_ATTACHMENT_DATA));
                
                } else if(fileUploadedResponse.uploadFileResponse === false && fileUploadedResponse.SFTPConnection === true){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Uploaded file is malicious ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
                } else {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Failed to connect to sftp server ')
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL_SFTP));
                }    
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Uploaded file is malicious ')
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR));
            }

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : uploadTestEvidence : Execution end. : Got unhandled error : Error Detail : ' + error)
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));

        }
    }

    /** 
    * This function will download evidence of particular attachmentid  from the dataBase 
    */
     async downloadTestEvidence(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let bcmsTestingData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
         let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
         accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {

            bcmsTestingData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BCMSTestingBL : downloadTestEvidence : Execution end. : bcmsTestingData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : downloadTestEvidence : Execution started.');

             /**
             * Input Validation : Start
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == bcmsTestingData.fileContentId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == bcmsTestingData.fileContentId) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : BCMSTestingBL : downloadTestEvidence : Execution end. : fileContentId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_CONTENT_ID_NULL_EMPTY));
            }
            
            /**
             * Input Validation : End
             */

            const GET_DOWNLOAD_RESPONSE = await bcmsTestingDB.downloadTestEvidence(userIdFromToken, userNameFromToken,bcmsTestingData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : downloadTestEvidence : Execution end. :  GET_DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : downloadTestEvidence : Execution end. : Error details :' + GET_DOWNLOAD_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (GET_DOWNLOAD_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DOWNLOAD_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : downloadTestEvidence : Execution end. : Error details : ' + GET_DOWNLOAD_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            const FORMAT_DOWNLOAD_RESPONSE = await getFormatEvidenceList(userIdFromToken, GET_DOWNLOAD_RESPONSE, 'download', accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : downloadTestEvidence : Execution end. :  FORMAT_DOWNLOAD_RESPONSE response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, FORMAT_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : downloadTestEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
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

async function getFormatBCMSTestsList(userIdFromToken, bcmstestsList, accountGUIDFromToken){
    let bcmsTests               = [];
    let bcManagers              = [];
    let bcmsAssessmentStatus    = [];
    let SCUsersList             = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestsList : Execution start. ');
 
        let bcmstestList        = bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let assessmentStatus    = bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let bcmanagersList      = bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let steeringCommittee   = bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmstestsList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        
          // Result Set 1 : BCMS Testing Assessments List
        if(bcmstestList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let testObj of Object.values(bcmstestList)){
                
                let businessApplications    = testObj.CoveredBusinessApplication != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.CoveredBusinessApplication) : [];
                let bccUsers                = testObj.BusinessFunctionsBCCUsers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.BusinessFunctionsBCCUsers) : [];
                let boUsers                 = testObj.BusinessOwnerUsers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.BusinessOwnerUsers) : [];
                
                 // merging  date(2024-03-12)and time(01:51:00.0000000) into format 2024-03-12T01:51:00.000Z
                let ScheduledDate           = await utilityAppObject.formatMergeDateTime(userIdFromToken,testObj.PlannedStartDate,testObj.PlannedStartTime);
                let EndDate                 = await utilityAppObject.formatMergeDateTime(userIdFromToken,testObj.PlannedEndDate,testObj.PlannedEndTime);

                bcmsTests.push({
                    "TestAssessmentID"              : testObj.TestAssessmentID,
                    "TestName"                      : testObj.TestName,
                    "TestTypeID"                    : testObj.TestTypeID,
                    "TestType"                      : testObj.TestType,
                    "TestingScenario"               : testObj.TestScenarioTitle,
                    "TestScenarioDescription"       : testObj.TestScenarioDescription,
                    "TestScope"                     : businessApplications != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? (businessApplications.map(ele => ele.BusinessApplicationName)).join(',') :CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ParticipantOptionID"           : testObj.ParticipantOptionID,
                    "ParticipantOption"             : testObj.ParticipantOption,
                    "Sites"                         : testObj.Sites!= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.Sites): [],
                    "BusinessFunctions"             : testObj.BusinessFunctions!=CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.BusinessFunctions) : [],
                    "TestObserverGUID"              : testObj.TestObserverID,
                    "TestObserver"                  : testObj.TestObserverName,
                    "ReviewerID"                    : testObj.ReviewerID,
                    "ReviewerName"                  : testObj.ReviewerName,
                    "ScheduledDate"                 : ScheduledDate,
                    "EndDate"                       : EndDate,
                    "Duration"                      : await calculateDuration(userIdFromToken,new Date(ScheduledDate),new Date(EndDate)),
                    "TestAssessmentStatusID"        : testObj.TestAssessmentStatusID,
                    "TestAssessmentStatus"          : testObj.TestStatus,
                    "PlannedTestLimitations"        : testObj.PlannedTestLimitations,
                    "PlannedFinancialImpact"        : testObj.PlannedFinancialImpact,
                    "PlannedCustomerImpact"         : testObj.PlannedCustomerImpact,
                    "PlannedOtherImpact"            : testObj.PlannedOtherImpact ? testObj.PlannedOtherImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "DisruptionScenarios"           : testObj.DisruptionScenarios != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.DisruptionScenarios):[],
                    "CoveredBusinessApplication"    : businessApplications,
                    "BCCUsers"                      : bccUsers,
                    "BusinessOwners"                : boUsers

                })
            }
        }

        // Result Set 2 : BCMS Testing Assessment Status List
        if(assessmentStatus.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let status of Object.values(assessmentStatus)){
                bcmsAssessmentStatus.push({
                    "TestAssessmentStatusID": status.TestAssessmentStatusID,
					"TestAssessmentStatus"  : status.QualifiedStatusName
                })
            }
        }

         // Result Set 3 : BC Managers List
         if(bcmanagersList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcManagerObj of Object.values(bcmanagersList)){
                bcManagers.push({
                    "BCManagerGUID": bcManagerObj.AdminGUID,
					"BCManagerName": bcManagerObj.AdminName,
                    "EmailID"      : bcManagerObj.EmailID,
                })
            }
        }

         // Result Set 4 : Steering committee Users List
         if(steeringCommittee.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let SCusers of Object.values(steeringCommittee)){
                SCUsersList.push({
                    "SteeringCommitteUserGUID"  : SCusers.SteeringCommitteUserGUID,
                    "EmailID"                   : SCusers.EmailID,
					"SteeringCommitteUserName"  : SCusers.SteeringCommitteUserName
                })
            }
        }

        /**
         *  Filtering the BCMS Test list based on Users : Start
         */
        if(bcManagers.some(ele => ele.BCManagerGUID == userIdFromToken)){
            // Case : Logged-in User is BC Manager
            bcmsTests = bcmsTests;
        }else if(SCUsersList.some(ele => ele.SteeringCommitteUserGUID == userIdFromToken)){
            // Case : Logged-in User is Steering committee Users(filtered only published)
            bcmsTests = bcmsTests.filter(ele =>ele.TestAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR);
        }else{
            // Case : Logged-in User is Power User(filtered only test which is not in scheduled status &  relevent to the logged-user)
            bcmsTests = bcmsTests.filter(data => {
                return data.TestAssessmentStatusID !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                    ((data.BCCUsers.some(user => user.BCCUserGUID == userIdFromToken)) ||
                    (data.BusinessOwners.some(owner => owner.BusinessOwnerUserGUID == userIdFromToken)) ||
                    (data.TestObserverGUID == userIdFromToken));
            });
        }
        /**
         *  Filtering the BCMS Test list based on Users : End
         */

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestsList : Execution end. ');

        return{
            "BCMSTestsList"             : bcmsTests,
            "BCMSAssessmentStatusList"  : bcmsAssessmentStatus,
            "BCManagersList"            : bcManagers,
            "SteeringCommitteeList"     : SCUsersList
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatBCMSTestsInfo(userIdFromToken, bcmstestinfoList, accountGUIDFromToken){
    let testTypes           = [];
    let testObservers       = [];
    let bussinessFunctions  = [];
    let applications        = [];
    let participantsOptions = [];
    let sites               = [];
    let bcManagers          = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestsInfo : Execution start. ');

        // Result Set 1: Test Types List
        if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let typeObj of Object.values(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                if(typeObj.IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                    testTypes.push({
                        "TestTypeID"    : typeObj.ID,
                        "TestType"      : typeObj.NAME
                    })
                }
            }
        }

        // Result Set 2: Test Observers List
        if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let observerObj of Object.values(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                testObservers.push({
                    "TestObserverGUID": observerObj.TestObserverGUID,
					"TestObserverName": observerObj.TestObserverName
                })
            }
        }

        // Result Set 3: Business Functions List
        if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let businessFuncObj of Object.values(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                bussinessFunctions.push({
                    "BusinessFunctionsID"   : Number(businessFuncObj.BusinessFunctionID),
					"BusinessFunctionsName" : businessFuncObj.BusinessFunctionName,
                    "BusinessFunctionCode"  : businessFuncObj.BusinessFunctionShortCode,
                    "AssociatedSites"       : JSON.parse(businessFuncObj.Sites) || []
                })
            }
        }

        // Result Set 4 : Sites List
        if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let sitesObj of Object.values(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                sites.push({
                    "SiteID"    : Number(sitesObj.SiteID),
					"SiteName"  : sitesObj.SiteName
                })
            }
        }

         // Result Set 5 : Bussiness Applications List
         if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
           applications = await groupBABySiteNBussFun(userIdFromToken,bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR]);
            

        }

         // Result Set 6 : Participants Options List
         if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let participantOptObj of Object.values(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])){
                participantsOptions.push({
                    "ParticipantOptionID"   : participantOptObj.ParticipantOptionID,
					"ParticipantOption"     : participantOptObj.Description
                })
            }
        }

         // Result Set 7 : BC Managers List
         if(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] &&  bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcManagerObj of Object.values(bcmstestinfoList.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])){
                bcManagers.push({
                    "BCManagerGUID": bcManagerObj.BCManagerGUID,
					"BCManagerName": bcManagerObj.BCManagerName
                })
            }
        }

        //Removing duplicate records for the list of sites 
        sites = sites.filter((value, index, self) =>
            index === self.findIndex((t) => (t.SiteID === value.SiteID)
        ));

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestsInfo : Execution end. ');

        //Formating Final ResultSet
        return {
            "TestTypesList"             : testTypes,
            "TestObserversList"         : testObservers,
            "SitesList"                 : sites,
            "BusinessFunctionsList"     : bussinessFunctions,
            "BusinessApplicationsList"  : applications,
            "ParticipantsOptionList"    : participantsOptions,
            "BCManagersList"            : bcManagers
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestsInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatBCMSTestData(userIdFromToken, bcmsTestData, accountGUIDFromToken){
    bcmsDetails             = [];
    actionsList             = [];
    bcmsAssessmentStatus    = [];
    reports                 = [];
    participantDetails      = [];
    observerList            = [];
    bcManagers              = [];
    SCUsersList             = [];
    overAllSummary          = [];
    actionItemsList         = [];
    userRole                = [];
    

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : Execution start. ');

        // Result Set 1 : BCMS Testing Assessment Details
        let testDetails         = (bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ?  bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let reportSection       = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let participants        = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let observer            = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let bcmstatus           = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        let workflow            = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let BCM                 = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        let steeringCommittee   = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        let overall             = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        let actionitem          = bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] && bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bcmsTestData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
        
        let BCCusers                    = [];
        let partiworkflowId             = [];
        let obsWorkflowId               = [];
        let filteredparticipantsList    = [];
        let filteredparticipantIds      = [];

        //Result Set 1 : BCMS Test details
        bcmsDetails = await getBCMSTestDetails(userIdFromToken,testDetails);
     
       
         // Result Set 3 : Test Participants List
         if(participants.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let participantObj of Object.values(participants)){
                let bccUsers = participantObj.BusinessFunctionsBCCUsers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(participantObj.BusinessFunctionsBCCUsers) : []
                if(bccUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                    bccUsers.forEach(data =>{
                        BCCusers.push(data.BCCUserGUID) 
                    })
                }
                partiworkflowId.push(participantObj.TestWorkflowStatusID);
               
                participantDetails.push({
                    "TestParticipantID"         : participantObj.TestParticipantID,
                    "TestParticipantName"       : participantObj.TestParticipantName,
                    "BusinessFunctionsID"       : participantObj.BusinessFunctionsID,
                    "BusinessOwnerGUID"         : participantObj.BusinessOwner,
                    "BusinessOwnerName"         : participantObj.BusinessOwnerName,
                    "BusinessFunctionsBCCUsers" : bccUsers,
                    "BCCUserGUIDs"              : bccUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bccUsers.map(x => x.BCCUserGUID) : '',
                    "BCCUsers"                  : bccUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? bccUsers.map(x => x.BCCUserName) : '',
                    "ScheduledTestID"           : participantObj.ScheduledTestID,
                    "TestWorkflowStatusID"      : participantObj.TestWorkflowStatusID,
                    "TestWorkflowStatusName"    : participantObj.QualifiedStatusName,
                    "QualifiedStatusName"       : participantObj.QualifiedStatusName
                })
            }
            partiworkflowId.sort((a, b) => a - b);
        }

        // Result Set 4 : Test Observer Details
        if(observer.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let obsObj of Object.values(observer)){
                obsWorkflowId.push(obsObj.TestWorkflowStatusID);
                observerList.push({
                    "TestObserverLinkID"        : obsObj.TestObserverLNID,
                    "TestObserverID"            : obsObj.TestObserverID,
                    "ScheduledTestID"           : obsObj.ScheduledTestID,
                    "TestObserverName"          : obsObj.TestObserverName,
                    "TestWorkflowStatusID"      : obsObj.TestWorkflowStatusID,
                    "TestWorkflowStatusName"    : obsObj.QualifiedStatusName,
                    "QualifiedStatusName"       : obsObj.QualifiedStatusName
                })
            }
        }

        userRole            = [];
        let listOnBO        = [];
        let listOnBCC       = [];
        let workFlowIdOnBO  = [];
        let workFlowIdOnBCC = [];

        /**
         *  finding User Role (Test Participant,Test Observer,BC Manager,Bussiness Owner,Steering Committee User) :Start 
        */
        // Case::Role = BC Manager
        if(BCM.some(ele=>ele.AdminGUID == userIdFromToken)){
            userRole.push('BC Manager');

            //checking any business function is under review By BC Manager
            if(participantDetails.some(ele =>[9,10].includes(ele.TestWorkflowStatusID))){
                partiworkflowId = participantDetails.filter(ele =>[9,10].includes(ele.TestWorkflowStatusID)).map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
            }else{
                partiworkflowId = participantDetails.map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
            }

        }
         // Case::Role = Steering Committee User
        if(steeringCommittee.some(ele=>ele.SteeringCommitteUserGUID == userIdFromToken)){
            userRole.push('Steering Committee User');
        }

         // Case::Role = Bussiness Owner
        if(participants.some(ele => ele.BusinessOwner == userIdFromToken)){
            userRole.push('Bussiness Owner');

            //filtering participantDetails for the bussiness owner
            listOnBO = participantDetails.filter(ele => (ele.BusinessOwnerGUID == userIdFromToken));

            //checking any business function is under review By Business Owner
            if(listOnBO.some(ele =>[5,6].includes(ele.TestWorkflowStatusID))){
                workFlowIdOnBO = listOnBO.filter(ele =>[5,6].includes(ele.TestWorkflowStatusID)).map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
            }else{
                workFlowIdOnBO = listOnBO.map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
            }
           
        }

         // Case::Role = Test Observer
        if (bcmsDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TestObserverGUID == userIdFromToken){
            userRole.push('Test Observer');
        }
         // Case::Role = Test Participant
        if(BCCusers.includes(userIdFromToken)){
            userRole.push('Test Participant');

            //filtering participantDetails for the Test participant
            listOnBCC = participantDetails.filter(ele => ele.BCCUserGUIDs.includes(userIdFromToken));
            //checking any business function is under new/rejected status
            if(listOnBCC.some(ele =>[1,3,11].includes(ele.TestWorkflowStatusID))){
                workFlowIdOnBCC = listOnBCC.filter(ele =>[1,3,11].includes(ele.TestWorkflowStatusID)).map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
            }else{
                workFlowIdOnBCC = listOnBCC.map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
            }
            
        }

        /**
        *  finding User Role (Test Participant,Test Observer,BC Manager,Bussiness Owner,Steering Committee User) :End 
        */


        if(userRole.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
            //Case: Logged-In user is having multiple role
            filteredparticipantsList = [...listOnBCC,...listOnBO];
            filteredparticipantIds = [...workFlowIdOnBCC,...workFlowIdOnBO];
     
        }else{
            //Case: Logged-In user is having single role
            if(userRole.includes("Test Participant")){

                participantDetails = participantDetails.filter(ele => ele.BCCUserGUIDs.includes(userIdFromToken));
                //checking any business function is under new/rejected status
                if(participantDetails.some(ele =>[1,3,11].includes(ele.TestWorkflowStatusID))){
                    partiworkflowId = participantDetails.filter(ele =>[1,3,11].includes(ele.TestWorkflowStatusID)).map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
                }else{
                    partiworkflowId = participantDetails.map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
                }
            }
            if(userRole.includes("Bussiness Owner")){
                participantDetails = participantDetails.filter(ele => (ele.BusinessOwnerGUID == userIdFromToken));
                if(participantDetails.some(ele =>[5,6].includes(ele.TestWorkflowStatusID))){
                    partiworkflowId = participantDetails.filter(ele =>[5,6].includes(ele.TestWorkflowStatusID)).map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
                }else{
                    partiworkflowId = participantDetails.map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
                }
            }
            if(userRole.includes("BC Manager")){
                if(participantDetails.some(ele =>[9,10].includes(ele.TestWorkflowStatusID))){
                    partiworkflowId = participantDetails.filter(ele =>[9,10].includes(ele.TestWorkflowStatusID)).map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
                }else{
                    partiworkflowId = participantDetails.map(ele => ele.TestWorkflowStatusID).sort((a, b) => a - b);
                }
            }

            filteredparticipantsList = participantDetails;
            filteredparticipantIds = partiworkflowId;
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : filteredparticipantsList ' + JSON.stringify(filteredparticipantsList));
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : reportSection ' + JSON.stringify(reportSection));
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : bcmsDetails. ' + JSON.stringify(bcmsDetails));
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : filteredparticipantIds. ' + filteredparticipantIds);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : obsWorkflowId ' + obsWorkflowId);
        // Result Set 2 : Report Section List
        if(reportSection.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            for(let section of Object.values(reportSection)){
                let workFlowStatusIdArr = section.WorkFlowStatusIDs.split(",");
                let userTypeArr = section.UserType.split(",");

                if((bcmsDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TestAssessmentStatusID == Number(section.TestAssessmentStausIDs)) 
                        && userTypeArr.some(ele => userRole.includes(ele)) && 
                    (workFlowStatusIdArr.some(ele => filteredparticipantIds.some(id => id == Number(ele)))
                     || workFlowStatusIdArr.some(ele => Number(ele) == (obsWorkflowId[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]))
                    ||  (filteredparticipantsList.every(ele =>[13].includes(Number(ele.TestWorkflowStatusID))) && 
                    (obsWorkflowId[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]) == 14 &&  workFlowStatusIdArr.some(ele => [15,16,17,18].includes(Number(ele)))))
                ){
                    reports.push({
                        "ReportSectionID"           : section.ReportSectionID,
                        "ReportSectionName"         : section.ReportSectionName,
                        "ReportSectionDescription"  : section.ReportSectionDescription,
                        "ButtonName"                : section.ButtonName,
                        "UserType"                  : userRole	// it can be BC Manger,Test Participant,Test Observer,Bussiness owner,steringcommitteeuser
                    })
                }
            }
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : reports. ' + reports);

         // Result Set 5 : BCMS Testing Assessment Status List
        if(bcmstatus.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let status of Object.values(bcmstatus)){
                bcmsAssessmentStatus.push({
                    "TestAssessmentStatusID": status.TestAssessmentStatusID,
					"TestAssessmentStatus"  : status.QualifiedStatusName
                })
            }
        }

        // Result Set 6 : Current Actions List
        if(bcmsDetails &&  bcmsDetails.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && (userRole.length  ==  CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && userRole.includes('BC Manager'))){
            // Case : Test Assessment Status = Scheduled
            if(bcmsDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TestAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
                actionsList.push({
                    "ActionDescription" : "Mark the Test as started. This will send out the notification to all stakeholders about the beginning of the BCMS exercise. ",
					"ActionButtonName"  : "Start Test"
                })
              // Case : Test Assessment Status = Inprogress   
            }else if(bcmsDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TestAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){    
                actionsList.push({
                    "ActionDescription" : "Mark the Test as complete, once it has completed offline. Once done, the reporting section will be enabled.",
                    "ActionButtonName"  : "Mark Complete"
                }) 
            }
        }

          // Result Set 7 : BC Managers List
          if(BCM.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcManagerObj of Object.values(BCM)){
                bcManagers.push({
                    "BCManagerGUID": bcManagerObj.AdminGUID,
					"BCManagerName": bcManagerObj.AdminName,
                    "EmailID"      : bcManagerObj.EmailID
                })
            }
        }

         // Result Set 8 : Steering committee Users List
         if(steeringCommittee.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let SCusers of Object.values(steeringCommittee)){
                SCUsersList.push({
                    "SteeringCommitteUserGUID"  : SCusers.SteeringCommitteUserGUID,
                    "EmailID"                   : SCusers.EmailID,
					"SteeringCommitteUserName"  : SCusers.SteeringCommitteUserName
                })
            }
        }

         //Result Set 9: OverAll Report Summary
         if (overall.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && bcmsDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TestAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
            for (let obj of Object.values(overall)) {
                overAllSummary = JSON.parse(obj.TestResult)
            }
        }

        // Result Set 10: ActionItems
        if (actionitem.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO  && bcmsDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TestAssessmentStatusID == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) {
            for (let obj of Object.values(actionitem)) {
                actionItemsList.push({
                    "TestActionPlanID"      : Number(obj.TestActionPlanID),
                    "TestAssessmentID"      : Number(obj.TestAssessmentID),
                    "TestObservation"       : obj.TestObservation,
                    "IdentifiedActionItem"  : obj.IdentifiedActionItem,
                    "ActionItemOwnerID"     : obj.ActionItemOwnerID,
                    "ActionItemOwner"       : obj.ActionItemOwnerName,
                    "StartDate"             : obj.StartDate,
                    "TargetDate"            : obj.TargetDate
                });
            }
        }

        //sorting report section 
        reports = reports.sort((a, b) => {
            const order = {
              "Participant Feedback": 0,
              "Observer Report": 1,
              "Overall Test Observations & Report": 2
            };
            return order[a.ReportSectionName] - order[b.ReportSectionName];
        });
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : reports12 ' + JSON.stringify(reports));
      
        /** 
         * removing the duplicate Section name from the list (priortizing based on the section name which has button name for take some action) : Start
        */
        const sectionMap = new Map();
        reports.forEach(section => {
          const existingSection = sectionMap.get(section.ReportSectionName);
          if (!existingSection || (existingSection && section.ButtonName && !existingSection.ButtonName)) {
            sectionMap.set(section.ReportSectionName, section);
          }
        });
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : reports123 '+ JSON.stringify(reports));
        
        // Convert the map values to an array
        const filteredSections = Array.from(sectionMap.values());
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : filteredSections ' + JSON.stringify(filteredSections));

        // Update the original data with filtered sections
        reports = filteredSections;
        /** 
         * removing the duplicate Section name from the list (priortizing based on the section name which has button name for take some action) : End
        */

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : Execution end. ');

        return {
            "BCMSTestsList"             : bcmsDetails,
            "BCMSAssessmentStatusList"  : bcmsAssessmentStatus,
            "ReportSections"            : reports,
            "CurrentActions"            : actionsList,
            "TestParticipantsList"      : filteredparticipantsList && filteredparticipantsList.length > 0 ? filteredparticipantsList : participantDetails,
            "TestObserverDetails"       : observerList,
            "BCManagersList"            : bcManagers,
            "SteeringCommitteUsers"     : SCUsersList,
            "OverAllTestResult"         : overAllSummary,
            "ReportSummary"             : actionItemsList
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSTestData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatTestParticipantReportData(userIdFromToken, participantReportData, accountGUIDFromToken){
    let bcmsDetails                     = [];
    let testParticipantData             = [];
    let participantReportQuestionnaire  = [];
    let PRQuestionnaire                 = [];
    let bcManagers                      = [];
    let SCUsersList                     = [];
    let reviewComments                  = [];
    let evidences                       = [];
    let userRole                        = '';
    let attachmentConfig                = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestParticipantReportData : Execution start. ');

        let testDetails         = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let partcipantDetails   = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let PRQuestions         = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let PRResponse          = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let bcm                 = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        let steeringCommittee   = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let comments            = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        let TPEvidences         = participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? participantReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];

       // Result Set 1 : BCMS Testing Assessment Details

       bcmsDetails = await getBCMSTestDetails(userIdFromToken,testDetails);

        // ResultSet 2: participantDetails
        for(let partObj of Object.values(partcipantDetails)){
            let bccUsers = partObj.BusinessFunctionsBCCUsers != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(partObj.BusinessFunctionsBCCUsers) : []

            testParticipantData.push({
                "TestParticipantID"         : partObj.TestParticipantID,
                "TestParticipantName"       : partObj.TestParticipantName,
                "BusinessFunctionsID"       : partObj.BusinessFunctionsID,
                "BusinessOwnerGUID"         : partObj.BusinessOwner,
                "BusinessOwnerName"         : partObj.BusinessOwnerName,
                "BusinessFunctionsBCCUsers" : bccUsers,
                "ScheduledTestID"           : partObj.ScheduledTestID,
                "TestWorkflowStatusID"      : partObj.TestWorkflowStatusID,
                "TestWorkflowStatusName"    : partObj.QualifiedStatusName,
                "QualifiedStatusName"       : partObj.QualifiedStatusName
            })
        }

        // ResultSet 3 : Participant Report Questionaire
        if(PRQuestions.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            let questionnaire = PRQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ParticipantReportData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(PRQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ParticipantReportData) : [];
            PRQuestionnaire = await groupParticipantReportBySection(userIdFromToken,questionnaire,PRResponse,[]);
            participantReportQuestionnaire.push({
                "TemplateID"            : PRQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TemplateID,
                "TemplateName"          : PRQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Description,
                "ParticipantReportData" : PRQuestionnaire
            })
         
        }

          // Result Set 4 : BC Managers List
        if(bcm.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcManagerObj of Object.values(bcm)){
                bcManagers.push({
                    "BCManagerGUID": bcManagerObj.AdminGUID,
					"BCManagerName": bcManagerObj.AdminName,
                    "EmailID"      : bcManagerObj.EmailID,
                })
            }
        }

         // Result Set 5 : Steering committee Users List
        if(steeringCommittee.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let SCusers of Object.values(steeringCommittee)){
                SCUsersList.push({
                    "SteeringCommitteUserGUID"  : SCusers.SteeringCommitteUserGUID,
                    "EmailID"                   : SCusers.EmailID,
					"SteeringCommitteUserName"  : SCusers.SteeringCommitteUserName
                })
            }
        }

        // Result Set 6 : Review Comments List
        if(comments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let cmtObj of Object.values(comments)){
                reviewComments.push({
                    "TestCommentID"     : cmtObj.TestCommentID,
                    "ScheduledTestID"   : cmtObj.ScheduledTestID,
                    "TestAssessmentID"  : cmtObj.TestAssessmentID,
                    "TemplateID"        : cmtObj.TemplateID,
                    "CommentBody"       : cmtObj.CommentBody,
                    "CommentUserGUID"   : cmtObj.CommentedByUserGUID,
                    "CommentUserName"   : cmtObj.CommentedByUserName,
                    "CreatedDate"       : cmtObj.CreatedDate,
                    "FromStatus"        : cmtObj.FromStatus,
                    "ToStatus"          : cmtObj.ToStatus,
                })
            }
        }

        
        // Result Set 7 : Evidence List
        if(TPEvidences.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
          
            for(let evObj of Object.values(TPEvidences)){
                evidences.push({
                    "AttachmentID"  : evObj.EvidenceID,
                    "AttachmentName": evObj.FileName,
                    "FileType"      : evObj.FileType,
                    "FileContentID" : evObj.FileContentID,
                    "CreatedDate"   : evObj.CreatedDate
                })
            }
        }

        // file upload configuration
        attachmentConfig.push({
            "FileSize"          : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE,
            "FileExtensions"    : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST
        })

        //finding User Role (Test Participant,Test Observer,BC Manager,Bussiness Owner)
        if(bcm.some(ele=>ele.AdminGUID == userIdFromToken)){
            userRole = 'BC Manager';
        }else if(testParticipantData.some(ele => ele.BusinessOwnerGUID == userIdFromToken)){
            userRole = 'Bussiness Owner';
        }


        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestParticipantReportData : Execution end. ');

        //Formating Final ResultSet
        return {
            "TestDetails"                       : bcmsDetails,
            "TestParticipantDetails"            : testParticipantData,
            "TestParticipantsReportQuestions"   : participantReportQuestionnaire,
            "BCManagersList"                    : bcManagers,
            "SteeringCommitteeUsers"            : SCUsersList,
            "ReviewComments"                    : reviewComments,
            "userRole"                          : userRole,
            "AttachmentConfiguration"           : attachmentConfig,
            "TestParticipantEvidences"          : evidences

        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestParticipantReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatTestObserverReportData(userIdFromToken, ObserverReportData, accountGUIDFromToken){
    let bcmsDetails                     = [];
    let testObserverData                = [];
    let observerReportQuestionnaire     = [];
    let OBQuestionnaire                 = [];
    let bcManagers                      = [];
    let SCUsersList                     = [];
    let reviewComments                  = [];
    let evidences                       = [];
    let attachmentConfig                = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestObserverReportData : Execution start. ');

        let testDetails         = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let observerDetails     = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let OBQuestions         = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let OBResponse          = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let bcm                 = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        let steeringCommittee   = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        let comments            = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        let supportTeams        = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
        let TOEvidences         = ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] && ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? ObserverReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] : [];
         
       
        // Result Set 1: Test Details List
        bcmsDetails = await getBCMSTestDetails(userIdFromToken,testDetails);

        // ResultSet 2: Observer Details
        for(let obsObj of Object.values(observerDetails)){
            testObserverData.push({
                "TestAssessmentID"          : obsObj.TestAssessmentID,
				"ScheduledTestID"           : obsObj.ScheduledTestID,
				"TestObserverLNID"          : obsObj.TestObserverLNID,
				"TestName"                  : obsObj.TestName,
				"TestObserverID"            : obsObj.TestObserverID,
				"TestObserverName"          : obsObj.TestObserverName,
                "IsTestObserver"            : obsObj.IsTestObserver,
				"ReviewerID"                : obsObj.ReviewedBy,
				"ReviewerName"              : obsObj.ReviewerName,
				"TestWorkflowStatusID"      : obsObj.TestWorkflowStatusID,
				"IsReviewed"                : obsObj.IsReviewed,
				"RespondedBy"               : obsObj.RespondedBy,
                "QualifiedStatusName"       : obsObj.QualifiedStatusName
            })
        }

        // ResultSet 3 : Participant Report Questionaire
        if(OBQuestions.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            let questionnaire = OBQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ObserverReportData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? JSON.parse(OBQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ObserverReportData) : [];
            
            OBQuestionnaire = await groupParticipantReportBySection(userIdFromToken,questionnaire,OBResponse,supportTeams);
            observerReportQuestionnaire.push({
                "TemplateID"            : OBQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TemplateID,
                "TemplateName"          : OBQuestions[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Description,
                "ObserverReportData"    : OBQuestionnaire
            })
         
        }

          // Result Set 4 : BC Managers List
          if(bcm.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcManagerObj of Object.values(bcm)){
                bcManagers.push({
                    "BCManagerGUID": bcManagerObj.AdminGUID,
					"BCManagerName": bcManagerObj.AdminName,
                    "EmailID"      : bcManagerObj.EmailID,
                })
            }
        }

         // Result Set 5 : Steering committee Users List
        if(steeringCommittee.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let SCusers of Object.values(steeringCommittee)){
                SCUsersList.push({
                    "SteeringCommitteUserGUID"  : SCusers.SteeringCommitteUserGUID,
                    "EmailID"                   : SCusers.EmailID,
					"SteeringCommitteUserName"  : SCusers.SteeringCommitteUserName
                })
            }
        }

        // Result Set 6 : Review Comments List
        if(comments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let cmtObj of Object.values(comments)){
                reviewComments.push({
                    "TestCommentID"     : cmtObj.TestCommentID,
                    "ScheduledTestID"   : cmtObj.ScheduledTestID,
                    "TestAssessmentID"  : cmtObj.TestAssessmentID,
                    "TemplateID"        : cmtObj.TemplateID,
                    "CommentBody"       : cmtObj.CommentBody,
                    "CommentUserGUID"   : cmtObj.CommentedByUserGUID,
                    "CommentUserName"   : cmtObj.CommentedByUserName,
                    "CreatedDate"       : cmtObj.CreatedDate,
                    "FromStatus"        : cmtObj.FromStatus,
                    "ToStatus"          : cmtObj.ToStatus,
                })
            }
        }

         // Result Set 7 : Evidence List
         if(TOEvidences.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
          
            for(let evObj of Object.values(TOEvidences)){
                evidences.push({
                    "AttachmentID"  : evObj.EvidenceID,
                    "AttachmentName": evObj.FileName,
                    "FileType"      : evObj.FileType,
                    "FileContentID" : evObj.FileContentID,
                    "CreatedDate"   : evObj.CreatedDate
                })
            }
        }

        // file upload configuration
        attachmentConfig.push({
            "FileSize"          : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.FILE_SIZE,
            "FileExtensions"    : APP_CONFIG_FILE_OBJ.EVIDENCE_UPLOAD.ATTACHMENTS_FILE_EXTENSIONS_LIST
        })

        
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestObserverReportData : Execution end. ' );
        
        //Formating Final ResultSet
        return {
            "TestDetails"                       : bcmsDetails,
            "TestObserverDetails"               : testObserverData,
            "TestObserverReportQuestions"       : observerReportQuestionnaire,
            "BCManagersList"                    : bcManagers,
            "SteeringCommitteeUsers"            : SCUsersList,
            "ReviewComments"                    : reviewComments,
            "AttachmentConfiguration"           : attachmentConfig,
            "TestObserverEvidences"             : evidences
            
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestObserverReportData : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatTestReportData(userIdFromToken, TestReportData) {
    let overAllStatusList   = [];
    let actionItemOwners    = [];
    let actionItems         = [];
    let bussinessFunctions  = [];
    let componentsList      = [];
    let disruptionScenarios = [];
    let overAllReportData   = [];
    let testDetails         = [];
    let bcManagers          = [];
    let SCUsersList         = [];
    let reviewComments      = [];

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestReportData : Execution start. ');

        let testData            = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let overAllData         = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let discruptions        = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let testComponents      = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let functinsList        = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        let actionItemsList     = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let overallStatus       = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        let actionItemOwnerList = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        let bcm                 = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];
        let steeringCommittee   = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] : [];
        let comments            = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] : [];

        // Result Set 1: Test Assessment Details
        testDetails = await getBCMSTestDetails(userIdFromToken, testData);

         // Result Set 2: overall selection status
         if (overallStatus.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(overallStatus)) {
                overAllStatusList.push({
                    "overAllStatusID"    : obj.ID,
                    "overAllStatus"      : obj.Name,
                });
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestReportData : Test Report Data : ' + JSON.stringify(TestReportData));

        //Result Set 3: OverAll Report Data
        if (overAllData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(overAllData)) {
                
                let overAllResult = JSON.parse(JSON.stringify(overAllStatusList));
                overAllResult.forEach(ele =>{
                    ele['percentage'] = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO + '%'
                })
                overAllReportData.push({
                    "TestReportID"                  : obj.TestReportID ? Number(obj.TestReportID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "TestAssessmentID"              : Number(obj.TestAssessmentID),
                    "ReportedBy"                    : obj.ReportedBy ? obj.ReportedBy : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PlannedTestLimitations"        : obj.PlannedTestLimitations ? obj.PlannedTestLimitations : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PostAnalysisTestLimitation"    : obj.PostAnalysisTestLimitation ? obj.PostAnalysisTestLimitation : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PlannedFinancialImpact"        : obj.PlannedFinancialImpact ? obj.PlannedFinancialImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PostAnalysisFinancialImpact"   : obj.PostAnalysisFinancialImpact ? obj.PostAnalysisFinancialImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PlannedCustomerImpact"         : obj.PlannedCustomerImpact ? obj.PlannedCustomerImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PostAnalysisCustomerImpact"    : obj.PostAnalysisCustomerImpact ? obj.PostAnalysisCustomerImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PlannedOtherImpact"            : obj.PlannedOtherImpact ? obj.PlannedOtherImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "PostAnalysisOtherImpact"       : obj.PostAnalysisOtherImpact ? obj.PostAnalysisOtherImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "RootCauseAnalysis"             : obj.RootCauseAnalysis ? obj.RootCauseAnalysis : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, 
                    "TestResult"                    : obj.TestResult != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(obj.TestResult) : overAllResult, 
                    "TestWorkflowStatusID"          : obj.TestWorkflowStatusID,
                    "TestWorkflowStatusName"        : obj.QualifiedStatusName
                });
            }
        }else{
            let overAllResult = JSON.parse(JSON.stringify(overAllStatusList));
    	    overAllReportData.push({
                "TestReportID"                  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "ReportedBy"                    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PlannedTestLimitations"        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PostAnalysisTestLimitation"    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PlannedFinancialImpact"        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PostAnalysisFinancialImpact"   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PlannedCustomerImpact"         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PostAnalysisCustomerImpact"    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PlannedOtherImpact"            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "PostAnalysisOtherImpact"       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "RootCauseAnalysis"             : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, 
                "TestResult"                    : overAllResult, 
            });
        }

        //Result Set 4: Disruption Scenarios
        if (discruptions.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(discruptions)) {
                disruptionScenarios.push({
                    "TestAssessmentID"      : Number(obj.TestAssessmentID),
                    "DisruptionScenariosID" : Number(obj.DisruptionScenariosID),
                    "DisruptionScenarios"   : obj.DisruptionScenariosDescription,
                    "ReportedBy"            : obj.ReportedBy,
                    "IsTested"              : obj.IsTested,
                    "ContinuityProcess"     : obj.ContinuityProcess,
                });
            }
        }

         //Result Set 5: Testing Components
         if (testComponents.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(testComponents)) {
                componentsList.push({
                    "TestingComponentReportID"  : Number(obj.TestingComponentReportID),
                    "TestAssessmentID"          : Number(obj.TestAssessmentID),
                    "ComponentID"               : Number(obj.ComponentID),
                    "Component"                 : obj.ExerciseType,
                    "ReportedBy"                : obj.ReportedBy,
                    "Options"                   : obj.Options,
                    "IsTestUnderTaken"          : obj.IsTestUnderTaken,
                });
            }
        }

         // Result Set 6: Bussiness Functions
         if (functinsList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(functinsList)) {
                bussinessFunctions.push({
                    "ParticipantID"         : Number(obj.ParticipantID),
                    "TestAssessmentID"      : Number(obj.TestAssessmentID),
                    "BusinessFunctionID"    : Number(obj.BusinessFunctionID),
                    "BusinessFunctionsName" : obj.BusinessFunctionsName,
                    "ParticipantOptionID"   : obj.ParticipantOptionID,
                    "RecoveryProcedures"    : obj.RecoveryProcedures,
                    "AdditionalInformation" : obj.AdditionalInformation,
                    "Result"                : obj.Result
                });
            }
        }

        // Result Set 7: ActionItems
        if (actionItemsList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(actionItemsList)) {
                actionItems.push({
                    "TestActionPlanID"      : Number(obj.TestActionPlanID),
                    "TestAssessmentID"      : Number(obj.TestAssessmentID),
                    "TestObservation"       : obj.TestObservation,
                    "IdentifiedActionItem"  : obj.IdentifiedActionItem,
                    "ActionItemOwnerGUID"   : obj.ActionItemOwnerID,
                    "ActionItemOwner"       : obj.ActionItemOwnerName,
                    "StartDate"             : obj.StartDate,
                    "TargetDate"            : obj.TargetDate
                });
            }
        }

       
        // Result Set 8: ActionItem Owners
        if (actionItemOwnerList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(actionItemOwnerList)) {
                actionItemOwners.push({
                    "ActionItemOwnerGUID"      : obj.ActionItemOwnerGUID,
                    "ActionItemOwnerName"      : obj.ActionItemOwnerName,
                });
            }
        }

          // Result Set 9 : BC Managers List
          if(bcm.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let bcManagerObj of Object.values(bcm)){
                bcManagers.push({
                    "BCManagerGUID": bcManagerObj.AdminGUID,
					"BCManagerName": bcManagerObj.AdminName,
                    "EmailID"      : bcManagerObj.EmailID,
                })
            }
        }

         // Result Set 10 : Steering committee Users List
        if(steeringCommittee.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let SCusers of Object.values(steeringCommittee)){
                SCUsersList.push({
                    "SteeringCommitteUserGUID"  : SCusers.SteeringCommitteUserGUID,
                    "EmailID"                   : SCusers.EmailID,
					"SteeringCommitteUserName"  : SCusers.SteeringCommitteUserName
                })
            }
        }

         // Result Set 11 : Review Comments List
         if(comments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let cmtObj of Object.values(comments)){
                reviewComments.push({
                    "TestCommentID"     : cmtObj.TestCommentID,
                    "ScheduledTestID"   : cmtObj.ScheduledTestID,
                    "TestAssessmentID"  : cmtObj.TestAssessmentID,
                    "TemplateID"        : cmtObj.TemplateID,
                    "CommentBody"       : cmtObj.CommentBody,
                    "CommentUserGUID"   : cmtObj.CommentedByUserGUID,
                    "CommentUserName"   : cmtObj.CommentedByUserName,
                    "CreatedDate"       : cmtObj.CreatedDate,
                    "FromStatus"        : cmtObj.FromStatus,
                    "ToStatus"          : cmtObj.ToStatus,
                })
            }
        }
        
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestReportData : Execution end. ');

        //Forming final resultset
        return {
            "BCMSTestDetails"           : testDetails,
            "OverAllStatus"             : overAllStatusList,
            "ActionItemOwnersList"      : actionItemOwners,
            "ActionItemsList"           : actionItems,
            "BussinessFunctionsList"    : bussinessFunctions,
            "TestingComponents"         : componentsList,
            "DisruptionScenarios"       : disruptionScenarios,
            "OverAllReportData"         : overAllReportData,
            "BCManagersList"            : bcManagers,
            "SteeringCommitteeUsers"    : SCUsersList,
            "ReviewComments"            : reviewComments

        }


    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatTestReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getFormatExportData(userIdFromToken, TestReportData, accountGUIDFromToken){
    let bcmsTestData        = [];
    let testLimitations     = [];
    let businessImpact      = [];
    let disruptionScenarios = [];
    let componentsList      = [];
    let bussinessFunctions  = [];
    let overAllResult       = [];
    let overAllStatusList   = [];
    let actionItems         = [];
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatExportData : Execution start. ');

        let testData            = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let overAllData         = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let discruptions        = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let testComponents      = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let functinsList        = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        let actionItemsList     = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let overallStatus       = TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? TestReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];

        // Result Set 1: Test Assessment Details
        bcmsTestData = await getBCMSTestDetails(userIdFromToken, testData);

         // Result Set 2: overall selection status
         if (overallStatus.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (let obj of Object.values(overallStatus)) {
                overAllStatusList.push({
                    "overAllStatusID"    : obj.ID,
                    "overAllStatus"      : obj.Name,
                });
            }
        }

        //Result Set 2 : Test Limitations
        if(overAllData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            let data = overAllData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            testLimitations.push({
                "TestLimitations"               : `Test Limitations: \n(Test elements not included)`,
                "PlannedTestLimitations"        : data.PlannedTestLimitations ? (data.PlannedTestLimitations) : '',
                "PostAnalysisTestLimitation"    : data.PostAnalysisTestLimitation ? (data.PostAnalysisTestLimitation) : '',
                    
            })
            overAllResult = JSON.parse(data.TestResult);
        }else{
            testLimitations.push({
                "TestLimitations"               : `Test Limitations: \n(Test elements not included)`,
                "PlannedTestLimitations"        : '',
                "PostAnalysisTestLimitation"    : '',     
            })
            overAllResult = JSON.parse(JSON.stringify(overAllStatusList));
            overAllResult.forEach(ele =>{
                ele['percentage'] = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO + '%'
            })
            
        }

        //Result Set 3 : Business Impact
          if(overAllData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            let data = overAllData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            businessImpact.push({
                "PlannedFinancialImpact"        : data.PlannedFinancialImpact ? data.PlannedFinancialImpact : '',
                "PostAnalysisFinancialImpact"   : data.PostAnalysisFinancialImpact ? data.PostAnalysisFinancialImpact : '',
                "PlannedCustomerImpact"         : data.PlannedCustomerImpact ? data.PlannedCustomerImpact : '',
                "PostAnalysisCustomerImpact"    : data.PostAnalysisCustomerImpact ? data.PostAnalysisCustomerImpact : '',
                "PlannedOtherImpact"            : data.PlannedOtherImpact ? data.PlannedOtherImpact : '',
                "PostAnalysisOtherImpact"       : data.PostAnalysisOtherImpact ? data.PostAnalysisOtherImpact : '',
                
                    
            })
        }else{
            businessImpact.push({
                "PlannedFinancialImpact"        : '',
                "PostAnalysisFinancialImpact"   : '',
                "PlannedCustomerImpact"         : '',
                "PostAnalysisCustomerImpact"    : '',
                "PlannedOtherImpact"            : '',
                "PostAnalysisOtherImpact"       : '',    
            })
        }

         //Result Set 4: Disruption Scenarios
         if (discruptions.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            Object.values(discruptions).forEach((obj, index)=> {
                disruptionScenarios.push({
                    "Sl_No"                 : Number(index)+1,
                    "DisruptionScenarios"   : obj.DisruptionScenariosDescription,
                    "ReportedBy"            : obj.ReportedBy,
                    "IsTested"              : obj.IsTested == 1? "Yes" : "No",
                    "ContinuityProcess"     : obj.ContinuityProcess,
                });
            });
        }else{
            disruptionScenarios.push({
                "Sl_No"                 : '',
                "DisruptionScenarios"   : '',
                "ReportedBy"            : '',
                "IsTested"              : '',
                "ContinuityProcess"     : '',
            })
        }

        //Result Set 5: Testing Components
        if (testComponents.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            Object.values(testComponents).forEach((obj, index)=> {
                componentsList.push({
                    "Sl_No"                     : Number(index)+1,
                    "Component"                 : obj.ExerciseType,
                    "IsTestUnderTaken"          : obj.IsTestUnderTaken == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? "Yes" : "No",
                });
            });
        }else{
            componentsList.push({
                "Sl_No"                     : '',
                "Component"                 : '',
                "IsTestUnderTaken"          : '',
            });
        }

         // Result Set 6: Details test result for Bussiness Functions
         if (functinsList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            Object.values(functinsList).forEach((obj, index)=> {
                bussinessFunctions.push({
                    "Sl_No"                 : Number(index)+1,
                    "BusinessFunction"      : obj.BusinessFunctionsName,
                    "RecoveryProcedures"    : obj.RecoveryProcedures == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? "Yes" : "No",
                    "AdditionalInformation" : obj.AdditionalInformation,
                    "Result"                : overAllStatusList.find(ele => ele.overAllStatusID == obj.Result).overAllStatus
                });
            });
        }else{
            bussinessFunctions.push({
                "Sl_No"                 : '',
                "BusinessFunction"      : '',
                "RecoveryProcedures"    : '',
                "AdditionalInformation" : '',
                "Result"                : ''
            });
        }


         // Result Set 7: ActionItems
         if (actionItemsList.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            Object.values(actionItemsList).forEach((obj, index)=> {
                actionItems.push({
                    "Sl_No"                 : Number(index)+1,
                    "TestObservation"       : obj.TestObservation,
                    "ActionItem"            : obj.IdentifiedActionItem,
                    "ActionItemOwner"       : obj.ActionItemOwnerName,
                    "TargetDate"            : obj.TargetDate
                });
            });
        }else{
            actionItems.push({
                "Sl_No"                 : '',
                "TestObservation"       : '',
                "ActionItem"            : '',
                "ActionItemOwner"       : '',
                "TargetDate"            : '',
            });
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatExportData : Execution end. ');

        //Formating final resultset
        return {
            "BCMSTestDetails"       : bcmsTestData,
            "TestLimitations"       : testLimitations,
            "BusinessImpact"        : businessImpact,
            "DisruptionScenarios"   : disruptionScenarios,
            "TestComponents"        : componentsList,
            "BusinessFunctions"     : bussinessFunctions,
            "OverAllReport"         : overAllResult,
            "ActionItems"           : actionItems

        }   
    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatExportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getBCMSTestDetails(userIdFromToken, bcmsTestData, accountGUIDFromToken){
    bcmsData = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBCMSTestDetails : Execution start. ');

        if(bcmsTestData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let testObj of Object.values(bcmsTestData)){
                
                let businessApplications    = testObj.CoveredBusinessApplication != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.CoveredBusinessApplication) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                
                 // merging  date(2024-03-12)and time(01:51:00.0000000) into format 2024-03-12T01:51:00.000Z

                let ScheduledDate           = await utilityAppObject.formatMergeDateTime(userIdFromToken,testObj.PlannedStartDate,testObj.PlannedStartTime);
                let EndDate                 = await utilityAppObject.formatMergeDateTime(userIdFromToken,testObj.PlannedEndDate,testObj.PlannedEndTime);
                let ActualStartDateTime     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let ActualEndDateTime       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                if(testObj.ActualStartDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && testObj.ActualStartTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    ActualStartDateTime     = await utilityAppObject.formatMergeDateTime(userIdFromToken,testObj.ActualStartDate,testObj.ActualStartTime);
                }
                if(testObj.ActualEndDate != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && testObj.ActualEndTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    ActualEndDateTime       = await utilityAppObject.formatMergeDateTime(userIdFromToken,testObj.ActualEndDate,testObj.ActualEndTime);
                }
                bcmsData.push({
                    "TestAssessmentID"              : testObj.TestAssessmentID,
                    "TestName"                      : testObj.TestName,
                    "TestTypeID"                    : testObj.TestTypeID,
                    "TestType"                      : testObj.TestType,
                    "TestingScenario"               : testObj.TestScenarioTitle,
                    "TestScenarioDescription"       : testObj.TestScenarioDescription,
                    "ParticipantOptionID"           : testObj.ParticipantOptionID,
                    "ParticipantOption"             : testObj.ParticipantOption,
                    "Sites"                         : testObj.Sites!= CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.Sites): [],
                    "BusinessFunctions"             : testObj.BusinessFunctions!=CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.BusinessFunctions) : [],
                    "TestObserverGUID"              : testObj.TestObserverID,
                    "TestObserver"                  : testObj.TestObserverName,
                    "ReviewerID"                    : testObj.ReviewerID,
                    "ReviewerName"                  : testObj.ReviewerName,
                    "ScheduledDate"                 : ScheduledDate,
                    "EndDate"                       : EndDate,
                    "ActualStartDateTime"           : ActualStartDateTime,
                    "ActualEndDateTime"             : ActualEndDateTime,
                    "TestAssessmentStatusID"        : testObj.TestAssessmentStatusID,
                    "TestAssessmentStatus"          : testObj.TestStatus,
                    "PlannedTestLimitations"        : testObj.PlannedTestLimitations,
                    "PlannedFinancialImpact"        : testObj.PlannedFinancialImpact,
                    "PlannedCustomerImpact"         : testObj.PlannedCustomerImpact,
                    "PlannedOtherImpact"            : testObj.PlannedOtherImpact ? testObj.PlannedOtherImpact : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "DisruptionScenarios"           : testObj.DisruptionScenarios != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(testObj.DisruptionScenarios):[],
                    "CoveredBusinessApplication"    : businessApplications != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? businessApplications :[]

                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBCMSTestDetails : Execution end. ');

        return bcmsData;

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getBCMSTestDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return bcmsData;
    }
}

async function getFormatBCMSReviewComments(userIdFromToken, reviewCommentReponse, accountGUIDFromToken){
    let reviewComments = [];

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSReviewComments : Execution start.');

        let comments = reviewCommentReponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && reviewCommentReponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? reviewCommentReponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

        // Result Set 11 : Review Comments List
        if(comments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let cmtObj of Object.values(comments)){
                reviewComments.push({
                    "TestCommentID"     : cmtObj.TestCommentID,
                    "ScheduledTestID"   : cmtObj.ScheduledTestID,
                    "TestAssessmentID"  : cmtObj.TestAssessmentID,
                    "TemplateID"        : cmtObj.TemplateID,
                    "CommentBody"       : cmtObj.CommentBody,
                    "CommentUserGUID"   : cmtObj.CommentedByUserGUID,
                    "CommentUserName"   : cmtObj.CommentedByUserName,
                    "CreatedDate"       : cmtObj.CreatedDate,
                    "FromStatus"        : cmtObj.FromStatus,
                    "ToStatus"          : cmtObj.ToStatus,
                })
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSReviewComments : Execution end.');

        //Forming resultset
        let actionTrails = [];
        actionTrails.push({                          
            "CommentsHistory" : reviewComments 
        }); 

        return { "actionTrailList" : actionTrails };

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatBCMSReviewComments : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function calculateDuration(userIdFromToken,startDate,endDate){
   
    try {   
        logger.log('info', 'User Id : '+ userIdFromToken +' : calculateDuration : Execution end.');   
       
        let diff = endDate.getTime() - startDate.getTime();
        let totalHours = diff / (60 * 60 * 1000); // Total hours
        let days = Math.floor(totalHours / 8); // Total days (considering 8 hours as 1 day)
        let remainingHours = Math.round(totalHours % 8); // Remaining hours after counting full days
    
        let duration = (days != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? (days + ' days ' ): '') + (remainingHours != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ?  (remainingHours + ' hours') : '');
        
        logger.log('info', 'User Id : '+ userIdFromToken +' : calculateDuration : Execution end.');
        return duration;

    } catch (error) {

        logger.log('error', 'User Id : '+ userIdFromToken +': calculateDuration : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }
}

// Function to group objects with the same SectionID and Section
async function groupParticipantReportBySection(userIdFromToken, reportData, responseData, supportTeams) {
    const sectionsMap = {};
    const questionnaire = [];
    let response = [{
        ResponseID: null,
        SelectedValue: null,
        Comment: null,
        ResponseStatusID: null,
        RespondedBy: null,
        RespondedDate: null
    }]

    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : groupParticipantReportBySection : Execution start. ');

        // Group questions by SectionID
        reportData.forEach(currentQues => {
            let currentQuesResponse = responseData && responseData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? responseData.filter(response => response.QuestionID == currentQues.QuestionID) : [];
            if (currentQues.SectionID) {
                if (currentQues.SectionID in sectionsMap) {
                    sectionsMap[currentQues.SectionID].QuestionsList.push({
                        QuestionID: currentQues.QuestionID,
                        Question: currentQues.Question,
                        ControlType: currentQues.IsSupportTeam ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL: currentQues.ControlType,
                        CommentType: currentQues.CommentType || null,
                        ComponentID: currentQues.ComponentID || null,
                        Component: currentQues.Component || null,
                        Options: currentQues.IsSupportTeam ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL: currentQues.Options,
                        IsSupportTeam : currentQues.IsSupportTeam,
                        SupportTeamList : currentQues.IsSupportTeam ? supportTeams.map(st =>({
                            TestAssessmentID: st.TestAssessmentID,
                            BusinessApplicationsLNID: st.BusinessApplicationsLNID,
                            BusinessApplicationsID: st.BusinessApplicationsID,
                            SupportLeadID: st.SupportLeadID,
                            SupportLeadName: st.SupportLeadName,
                            ControlType: currentQues.ControlType,
                            Options: currentQues.Options,
                            SupportLeadRating: st.SupportLeadRating != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(currentQues.Options).find(ele =>ele.Option == st.SupportLeadRating).OptionID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                        })) : [],
                        Responses: currentQuesResponse.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? currentQuesResponse.map(response => ({
                            ResponseID: response.ResponseID,
                            SelectedValue: response.SelectedValue,
                            Comment: response.Comment,
                            ResponseStatusID: response.ResponseStatusID,
                            RespondedBy: response.RespondedBy,
                            RespondedDate: response.RespondedDate
                        })) : response
                    });
                } else {
                    sectionsMap[currentQues.SectionID] = {
                        SectionID: currentQues.SectionID || null,
                        Section: currentQues.Section || null,
                        QuestionsList: [{
                            QuestionID: currentQues.QuestionID,
                            Question: currentQues.Question,
                            ControlType: currentQues.IsSupportTeam ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL: currentQues.ControlType,
                            CommentType: currentQues.CommentType || null,
                            ComponentID: currentQues.ComponentID || null,
                            Component: currentQues.Component || null,
                            Options: currentQues.IsSupportTeam ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL: currentQues.Options,
                            IsSupportTeam : currentQues.IsSupportTeam,
                            SupportTeamList : currentQues.IsSupportTeam ? supportTeams.map(st =>({
                                TestAssessmentID: st.TestAssessmentID,
                                BusinessApplicationsLNID: st.BusinessApplicationsLNID,
                                BusinessApplicationsID: st.BusinessApplicationsID,
                                SupportLeadID: st.SupportLeadID,
                                SupportLeadName: st.SupportLeadName,
                                ControlType: currentQues.ControlType,
                                Options: currentQues.Options,
                                SupportLeadRating: st.SupportLeadRating != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(currentQues.Options).find(ele =>ele.Option == st.SupportLeadRating).OptionID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                            })) : [],
                            Responses: currentQuesResponse.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? currentQuesResponse.map(response => ({
                                ResponseID: response.ResponseID,
                                SelectedValue: response.SelectedValue,
                                Comment: response.Comment,
                                ResponseStatusID: response.ResponseStatusID,
                                RespondedBy: response.RespondedBy,
                                RespondedDate: response.RespondedDate
                            })) : response
                        }],
                    };
                }
            } else {
                questionnaire.push({
                    SectionID: currentQues.SectionID || null,
                    Section: currentQues.Section || null,
                    QuestionsList: [{
                        QuestionID: currentQues.QuestionID,
                        Question: currentQues.Question,
                        ControlType: currentQues.IsSupportTeam ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL: currentQues.ControlType ,
                        CommentType: currentQues.CommentType,
                        ComponentID: currentQues.ComponentID || null,
                        Component: currentQues.Component || null,
                        Options: currentQues.IsSupportTeam ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL: currentQues.Options,
                        IsSupportTeam : currentQues.IsSupportTeam,
                        SupportTeamList : currentQues.IsSupportTeam ? supportTeams.map(st =>({
                            TestAssessmentID: st.TestAssessmentID,
                            BusinessApplicationsLNID: st.BusinessApplicationsLNID,
                            BusinessApplicationsID: st.BusinessApplicationsID,
                            SupportLeadID: st.SupportLeadID,
                            SupportLeadName: st.SupportLeadName,
                            ControlType: currentQues.ControlType,
                            Options: currentQues.Options,
                            SupportLeadRating: st.SupportLeadRating != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? JSON.parse(currentQues.Options).find(ele =>ele.Option == st.SupportLeadRating).OptionID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                        })) : [],
                        Responses: currentQuesResponse.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? currentQuesResponse.map(response => ({
                            ResponseID: response.ResponseID,
                            SelectedValue: response.SelectedValue,
                            Comment: response.Comment,
                            ResponseStatusID: response.ResponseStatusID,
                            RespondedBy: response.RespondedBy,
                            RespondedDate: response.RespondedDate
                        })) : response
                    }],
                })
            }
        });

        for (const sectionID in sectionsMap) {
            sectionsMap[sectionID].QuestionsList.sort((a, b) => a.QuestionID - b.QuestionID);
        }

        // Convert map to array
        const sections = Object.values(sectionsMap);
        const result = [...sections, ...questionnaire];

        // Sort the main array based on QuestionID
        result.sort((a, b) => {
            const questionID_A = a.QuestionsList ? a.QuestionsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].QuestionID : a.QuestionID;
            const questionID_B = b.QuestionsList ? b.QuestionsList[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].QuestionID : b.QuestionID;
            return questionID_A - questionID_B;
        });

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : groupParticipantReportBySection : Execution end. ');
        return result;

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : groupParticipantReportBySection : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


// Function to group objects with the same applicationID and application
async function groupBABySiteNBussFun(userIdFromToken, BA) {
    const BAMap = {};

    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : groupParticipantReportBySection : Execution start. ');
     
        // Group application by sites and bussiness functions
        BA.forEach(currentBA => {
            if (currentBA.ApplicationID in BAMap) {
                BAMap[currentBA.ApplicationID].AssociatedSites.push({
                    SiteID        : currentBA.SiteID,
                    SiteName     : currentBA.SiteName
                });
                BAMap[currentBA.ApplicationID].AssociatedBussinessFunction.push({
                    BusinessFunctionsID      : currentBA.BusinessFunctionsID,
                    BusinessFunctionName      : currentBA.BusinessFunctionName,
                });
            } else {
                BAMap[currentBA.ApplicationID] = {
                    BusinessApplicationID    : currentBA.ApplicationID,
					BusinessApplicationName  : currentBA.ApplicationName,
                    AssociatedSites: [{
                        SiteID        : currentBA.SiteID,
                        SiteName     : currentBA.SiteName
                    }],
                    AssociatedBussinessFunction: [{
                        BusinessFunctionsID      : currentBA.BusinessFunctionsID,
                        BusinessFunctionName      : currentBA.BusinessFunctionName,
                    }]  
                }
            }
        });
     
        for (const ApplicationID in BAMap) {
          BAMap[ApplicationID].AssociatedSites.sort((a, b) => a.SiteID - b.SiteID);
          BAMap[ApplicationID].AssociatedBussinessFunction.sort((a, b) => a.BusinessFunctionsID - b.BusinessFunctionsID);
          BAMap[ApplicationID].AssociatedSites = BAMap[ApplicationID].AssociatedSites.filter((value, index, self) =>
            index === self.findIndex((t) => (t.SiteID === value.SiteID)
          ));
          BAMap[ApplicationID].AssociatedBussinessFunction = BAMap[ApplicationID].AssociatedBussinessFunction.filter((value, index, self) =>
            index === self.findIndex((t) => (t.BusinessFunctionsID === value.BusinessFunctionsID)
          ))
        }
    
        // Convert map to array
        const applications = Object.values(BAMap);
       

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : groupParticipantReportBySection : Execution end. ');
        return applications;


    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : groupParticipantReportBySection : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}



//Function to send email 
async function sendEmailNotification(userIdFromToken, userNameFromToken, emailDetails, toList, CCList, isSeperateEmail){
    logger.log('info', 'User Id : ' + userIdFromToken + ': BCMSTestingBL : sendEmailNotification : Execution start .' );
    logger.log('info', 'User Id : ' + userIdFromToken + ': BCMSTestingBL : sendEmailNotification : emailDetails' + emailDetails);
    logger.log('info', 'User Id : ' + userIdFromToken + ': BCMSTestingBL : sendEmailNotification : isSeperateEmail' + isSeperateEmail);
    
    if (emailDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        if(isSeperateEmail){
            logger.log('info', 'User Id : ' + userIdFromToken + ': BCMSTestingBL : sendEmailNotification : toList' + JSON.stringify(toList || null));

            if (toList.length) {
                for(let mailObj of Object.values(toList)){
                    try {       
                                                          
                        let emailTemplateObj = {
                            Subject : BCMS_TEMPLATE_NOTIFY.NOTIFY_BCMS["NOTIFY_BCMS_TEMPLATE"].Subject,
                            Body    : BCMS_TEMPLATE_NOTIFY.NOTIFY_BCMS["NOTIFY_BCMS_TEMPLATE"].Body
                        }; 
                        let toccEmails = {
                            "TOEmail"   : mailObj.EmailID,
                            "CCEmail"   : CCList
                        };
                        let templateMaster = {                     
                            recipients          : mailObj.FullName,
                            RISKTRAC_WEB_URL    : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                            TestName            : emailDetails.TestName,                                   
                            ActualStartDate     : emailDetails.ActualStartDateTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? utilityAppObject.formatDateWithTime(userIdFromToken, emailDetails.ActualStartDateTime) : '',
                            ActualEndDate       : emailDetails.ActualEndDateTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? utilityAppObject.formatDateWithTime(userIdFromToken, emailDetails.ActualEndDateTime) : '',
                            subject_text        : emailDetails.Subject,                        
                            note_text           : emailDetails.Note 
                        };
        
                        let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : sendEmailNotification : emailData   : ' + JSON.stringify(emailData || null));
        
                    } catch(error) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ': BCMSTestingBL : sendEmailNotification : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
                    }
                }
            }
        }else{
            try {                                             
                let emailTemplateObj = {
                    Subject : BCMS_TEMPLATE_NOTIFY.NOTIFY_BCMS["NOTIFY_BCMS_TEMPLATE"].Subject,
                    Body    : BCMS_TEMPLATE_NOTIFY.NOTIFY_BCMS["NOTIFY_BCMS_TEMPLATE"].Body
                }; 
                let toccEmails = {
                    "TOEmail"   : toList,
                    "CCEmail"   : CCList
                };
                
                
                let templateMaster = {                     
                    recipients          : "User",
                    RISKTRAC_WEB_URL    : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                    TestName            : emailDetails.TestName,                                   
                    ActualStartDate     : emailDetails.ActualStartDateTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? utilityAppObject.formatDateWithTime(userIdFromToken, emailDetails.ActualStartDateTime) : '',
                    ActualEndDate       : emailDetails.ActualEndDateTime != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? utilityAppObject.formatDateWithTime(userIdFromToken, emailDetails.ActualEndDateTime) : '',
                    subject_text        : emailDetails.Subject,                        
                    note_text           : emailDetails.Note 
                };

                let emailData = await emailNotificationObject.formatDataForSendEmail(userIdFromToken,userNameFromToken, emailTemplateObj, templateMaster, toccEmails,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : sendEmailNotification : emailData   : ' + JSON.stringify(emailData || null));

            } catch(error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ': BCMSTestingBL : sendEmailNotification : Execution end. : Got unhandled error. While sending Email : Error Detail : ' + error);
            }
        }
             
    }
}


async function getFormatEvidenceList(userIdFromToken, evidenceAttachmentsResponse, source, accountGUIDFromToken){
    let evidences = [];
    try{
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatEvidenceList : Execution start.'+ evidenceAttachmentsResponse); 

           // Result Set 1: Uploaded evidence list 
           if(evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            for(let evObj of Object.values(evidenceAttachmentsResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                evidences.push({
                    "AttachmentID"      : evObj.EvidenceID,
                    "AttachmentName"    : evObj.FileName,
                    "CreatedDate"       : evObj.CreatedDate,
                    "AttachmentType"    : evObj.FileType,
                    "FileContentID"     : evObj.FileContentID,
                    "FileContent"       : source == 'download' ? evObj.Content : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "IsVisible"         : evObj.IsVisible,
                    "CreatedBy"         : evObj.CreatedBy      
                })
            }   
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatEvidenceList : Execution end.'); 
        return {
            "attachmentDetails" : evidences
        }

    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BCMSTestingBL : getFormatEvidenceList : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
* This is function will be used to return single instance of class.
*/
function getBCMSTesingBLClassInstance() {
    if (BCMSTesingBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        BCMSTesingBLClassInstance = new BCMSTestingBL();
    }
    return BCMSTesingBLClassInstance;
}

exports.getBCMSTesingBLClassInstance = getBCMSTesingBLClassInstance;
