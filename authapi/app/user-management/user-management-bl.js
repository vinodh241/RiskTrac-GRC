const AD_CONFIG = require('../../config/ad-config.js');
const UTILITY_APP = require('../../utility/utility.js');
const APP_VALIATOR = require('../../utility/app-validator.js');
const ACTIVE_DIRECTORY = require('activedirectory2').promiseWrapper;
const MESSAGE_FILE_OBJ = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../utility/constants/constant.js');

var utilityAppObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var userManagementBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class UserManagementBl {
    constructor() {
        utilityAppObject = new UTILITY_APP();
        appValidatorObject = new APP_VALIATOR();
    }

    start() {

    }

    /**
     * This function will fetch deatils from AD server by UserID or User's email.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getUserDetailsFromAD(request, response) {
        try {
            let adQuery = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let activeDirectoryObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userMaster = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let adUserName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let firstName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let lastName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let mobileNumber = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let emailId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let resultData = [];

            // check request body should not be undefined
            if (typeof request.body.reqPayload === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthBl : updateUserLogin : Request body has not found : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            userMaster = request.body.reqPayload.userMaster;
            userIdFromToken = request.body.reqPayload.userIdFromToken;
            refreshedToken = request.body.reqPayload.refreshedToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution started.');

            if (userMaster === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || userMaster === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Invalid request, missing mandatory parameters.');

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            userId = userMaster.userId;
            emailId = userMaster.emailId;

            /**
             * AD authentication logic : START
             */
            let ldapConfig = {
                url: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                baseDN: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                username: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                password: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };

            let cipherAdPassword = AD_CONFIG.AD_CONFIG.password;
            let clearTextAdPassword = utilityAppObject.decryptDataByPrivateKey(cipherAdPassword);

            ldapConfig.url = AD_CONFIG.AD_CONFIG.url;
            ldapConfig.baseDN = AD_CONFIG.AD_CONFIG.baseDN;
            ldapConfig.username = AD_CONFIG.AD_CONFIG.username;
            ldapConfig.password = clearTextAdPassword;
            ldapConfig.attributes = AD_CONFIG.AD_CONFIG.attributes;

            activeDirectoryObj = new ACTIVE_DIRECTORY(ldapConfig); // creating active directory object with our configuration
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : AD connected successful.');

            let adQueryForUserId = "(userPrincipalName=*XYZ*)";
            let adQueryForEmailId = "(mail=*XYZ*)";

            /** Setting AD query as per value provide for UserId or EmailId */
            if (!appValidatorObject.isStringUndefined(userId) && !appValidatorObject.isStringNull(userId) && !appValidatorObject.isStringEmpty(userId.trim())) {
                // Search user details by user id.
                adQuery = adQueryForUserId.replace(/XYZ/g, userId);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Search user details by user id : adQuery value : ' + adQuery);
            } else {
                // Search user details by email id.
                adQuery = adQueryForEmailId.replace(/XYZ/g, emailId);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Search user details by email id : adQuery value : ' + adQuery);
            }

            activeDirectoryObj.findUsers(adQuery, CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE).then(function (adQueryResultObject) {
                if ((!adQueryResultObject) || (adQueryResultObject.length == 0)) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Find users query result from AD server is null or empty.');

                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NOT_IN_AD));

                } else {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : User found into AD server');
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : User found into AD server : adQueryResultObject = ' + JSON.stringify(adQueryResultObject));

                    if (adQueryResultObject[0].userPrincipalName !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                        adUserName = adQueryResultObject[0].userPrincipalName;
                    }

                    if (adQueryResultObject[0].givenName !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                        firstName = adQueryResultObject[0].givenName;
                    }

                    if (adQueryResultObject[0].sn !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                        lastName = adQueryResultObject[0].sn;
                    }

                    if (adQueryResultObject[0].mobile !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                        mobileNumber = adQueryResultObject[0].mobile;
                    }

                    if (adQueryResultObject[0].mail !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                        userEmail = adQueryResultObject[0].mail;
                    }

                    const title = adQueryResultObject[0].title || adQueryResultObject[0].jobTitle || null;

                    /** Creating result data */
                    var data = [{
                        "firstName": firstName,
                        "lastName": lastName,
                        "mobileNumber": mobileNumber,
                        "userEmail": userEmail,
                        "adUserName": adUserName,
                        "Designation": title
                    }];
                    resultData[0] = data;

                    // Sending succesful response 
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : User details fetched successfuly from AD server.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, resultData));
                }
            }).catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Error in find users from AD server. : Error Detail : ' + JSON.stringify(error));

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_FAIL));
            });
            /**
             * AD authentication logic : END
             */
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Got unhandled error. : Error Detail : ' + error);

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_FAIL));
        }
    }

    stop() {
    }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: errorMessage
        }
    }
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
        }
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getUserManagementBLClassInstance() {
    if (userManagementBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        userManagementBlClassInstance = new UserManagementBl();
    }
    return userManagementBlClassInstance;
}

exports.getUserManagementBLClassInstance = getUserManagementBLClassInstance;