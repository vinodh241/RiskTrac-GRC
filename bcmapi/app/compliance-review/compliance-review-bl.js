const MESSAGE_FILE_OBJ              = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ             = require("../../utility/constants/constant.js");
const APP_VALIDATOR                 = require("../../utility/app-validator.js");
const COMPLIANCE_REVIEW_DB          = require("../../data-access/compliance-review-db.js");
const { logger }                    = require("../../utility/log-manager/log-manager.js");

var complianceReviewBLClassInstance      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var complianceReviewDB                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ComplianceReviewBl {
    constructor() {
        complianceReviewDB    = new COMPLIANCE_REVIEW_DB();
        appValidatorObject    = new APP_VALIDATOR();
    }

    start() { }

    /** 
     * This function will fetch the Compliance Reviews lists data from the dataBase 
     */
    async getComplianceReviewsList(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken = request.body.refreshedToken;
        userIdFromToken = request.body.userIdFromToken;
        userNameFromToken = request.body.userNameFromToken;
        let data = request.body
        // userIdFromToken           = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken         = 'kashish.sharma@secureyes.net';
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : Execution started.');

            const GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE = await complianceReviewDB.getComplianceReviewsList(userIdFromToken, userNameFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE : ' + JSON.stringify(GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : Execution end. :  GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : Execution end. : Error details :' + GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : Execution end. : Error details : ' + GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_COMPLIANCE_REVIEWS_LIST = await getFormatComplianceReviewsList(userIdFromToken, GET_COMPLIANCE_REVIEWS_LIST_DB_RESPONSE);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : FORMAT_GET_COMPLIANCE_REVIEWS_LIST : ' + JSON.stringify(FORMAT_GET_COMPLIANCE_REVIEWS_LIST));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_COMPLIANCE_REVIEWS_LIST || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_COMPLIANCE_REVIEWS_LIST) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : Execution end. :  FORMAT_GET_COMPLIANCE_REVIEWS_LIST response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_COMPLIANCE_REVIEWS_LIST));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
     * This function will fetch the Compliance Reviews info data from the dataBase to add a new Compliance Review.
     */
    async getComplianceReviewsInfo(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken = request.body.refreshedToken;
        userIdFromToken = request.body.userIdFromToken;
        userNameFromToken = request.body.userNameFromToken;
        let data = request.body
        // userIdFromToken           = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken         = 'kashish.sharma@secureyes.net';
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : Execution started.');

            const GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE = await complianceReviewDB.getComplianceReviewsInfo(userIdFromToken, userNameFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE : ' + JSON.stringify(GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : Execution end. :  GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : Execution end. : Error details :' + GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : Execution end. : Error details : ' + GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_COMPLIANCE_REVIEWS_INFO = await getFormatComplianceReviewsInfo(userIdFromToken, GET_COMPLIANCE_REVIEWS_INFO_DB_RESPONSE);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : FORMAT_GET_COMPLIANCE_REVIEWS_INFO : ' + JSON.stringify(FORMAT_GET_COMPLIANCE_REVIEWS_INFO));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_COMPLIANCE_REVIEWS_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_COMPLIANCE_REVIEWS_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : Execution end. :  FORMAT_GET_COMPLIANCE_REVIEWS_INFO response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_COMPLIANCE_REVIEWS_INFO));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : getComplianceReviewsInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
     * This function will add a new Compliance Review data to the dataBase.
     */
    async addNewComplianceReview(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken = request.body.refreshedToken;
        userIdFromToken = request.body.userIdFromToken;
        userNameFromToken = request.body.userNameFromToken;
        let data = request.body
        // userIdFromToken           = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken         = 'kashish.sharma@secureyes.net';
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : Execution started.');

            const ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE = await complianceReviewDB.addNewComplianceReview(userIdFromToken, userNameFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE : ' + JSON.stringify(ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : Execution end. :  ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : Execution end. : Error details :' + ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : Execution end. : Error details : ' + ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_ADD_NEW_COMPLIANCE_REVIEW = await formatAddNewComplianceReview(userIdFromToken, ADD_NEW_COMPLIANCE_REVIEW_DB_RESPONSE);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : FORMAT_ADD_NEW_COMPLIANCE_REVIEW : ' + JSON.stringify(FORMAT_ADD_NEW_COMPLIANCE_REVIEW));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_NEW_COMPLIANCE_REVIEW || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_NEW_COMPLIANCE_REVIEW) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : Execution end. :  FORMAT_ADD_NEW_COMPLIANCE_REVIEW response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_ADD_NEW_COMPLIANCE_REVIEW));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : addNewComplianceReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /** 
     * This function will add a new Compliance Review data to the dataBase.
     */
    async viewComplianceReviewDashboard(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        refreshedToken = request.body.refreshedToken;
        userIdFromToken = request.body.userIdFromToken;
        userNameFromToken = request.body.userNameFromToken;
        let data = request.body
        // userIdFromToken           = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        // userNameFromToken         = 'kashish.sharma@secureyes.net';
        try {

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : Execution started.');

            const VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE = await complianceReviewDB.viewComplianceReviewDashboard(userIdFromToken, userNameFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE : ' + JSON.stringify(VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : Execution end. :  VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : Execution end. : Error details :' + VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : Execution end. : Error details : ' + VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD = await formatViewComplianceReviewDashboard(userIdFromToken, VIEW_COMPLIANCE_REVIEW_DASHBOARD_DB_RESPONSE);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD : ' + JSON.stringify(FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : Execution end. :  FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_VIEW_COMPLIANCE_REVIEW_DASHBOARD));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ComplianceReviewBl : viewComplianceReviewDashboard : Execution end. : Got unhandled error. : Error Detail : ' + error);
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

/**
* This is function will be used to return single instance of class.
*/
function getComplianceReviewBLClassInstance() {
    if (complianceReviewBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        complianceReviewBLClassInstance = new ComplianceReviewBl();
    }
    return complianceReviewBLClassInstance;
}

exports.getComplianceReviewBLClassInstance = getComplianceReviewBLClassInstance;