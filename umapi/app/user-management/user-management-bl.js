const AXIOS = require('axios');
const VALIDATOR_OBJECT = require('validator');
const APP_CONFIG = require('../../config/app-config.js');
const APP_VALIATOR = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../utility/constants/constant.js');
const USER_MANAGEMENT_DB = require('../../data-access/user-management-db.js');
const PASSWORD_UTILITY = require('../../utility/passwordUtility.js');
const EMAIL_UTILITY = require('../../utility/email-utility.js');
const UtilityApp = require('../../utility/utility.js');
const AUTH_DB = require('../../data-access/auth-db.js');

var appValidatorObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var userManagementDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var userManagementBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var passwordUtilityObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailUtilityObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var authDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class UserManagementBl {
    constructor() {
        appValidatorObject = new APP_VALIATOR();
        userManagementDbObject = new USER_MANAGEMENT_DB();
        passwordUtilityObj = new PASSWORD_UTILITY();
        emailUtilityObj = new EMAIL_UTILITY();
        utilityAppObj = new UtilityApp();
        authDbObject = new AUTH_DB();
    }

    start() {

    }

    /**
     * Get existing users details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getUsers(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUserDbResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUsersData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution started.');

            getUserDbResponse = await userManagementDbObject.getUsers(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : GET_USERS : ' + JSON.stringify(getUserDbResponse));

            let rolesDetails = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let usersDetails = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            let userModulesDetails = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            let unitsDetails = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            let roleDetailsTPT = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
            let ModulesMaster = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];

            getUsersData = await getResult(ModulesMaster, rolesDetails, usersDetails, userModulesDetails, unitsDetails, roleDetailsTPT);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, getUserDbResponse.recordset));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : Get Users List data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, getUsersData));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUsers : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Delete user data from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteUser(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userMaster = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            userMaster = request.body.userMaster;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == userMaster || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == userMaster) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            const getUserDbResponse = await userManagementDbObject.deleteUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : User Deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, getUserDbResponse.recordset));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : deleteUser : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Assigned users Info from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAssignedUserInfo(request, response) {
        try {

            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let AllResponse = [];
            let getUserDataDbResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution started.');

            const getUserDbResponse = await userManagementDbObject.getAssignedUserInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            // logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : getUserDbResponse : '+JSON.stringify(getUserDbResponse));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, getUserDbResponse.recordset));
            }

            // resultset 0-5
            for (let i = 0; i < getUserDbResponse.recordset.length - CONSTANT_FILE_OBJ.APP_CONSTANT.ONE; i++) {
                if (getUserDbResponse.recordset[i]) {
                    AllResponse.push(getUserDbResponse.recordset[i]);
                }
            }

            getUserDataDbResponse = await userManagementDbObject.getUsers(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl :getUserDataDbResponse :  GET_USERS : ' + JSON.stringify(getUserDataDbResponse));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDataDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDataDbResponse) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : getUserDataDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDataDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details :' + getUserDataDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDataDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details :' + getUserDataDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDataDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDataDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details : ' + getUserDataDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDataDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDataDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && getUserDataDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, getUserDataDbResponse.recordset));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDataDbResponse : AllResponse : ' + JSON.stringify(AllResponse));
            let emailDomian = getUserDataDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EmailID;
            emailDomian = emailDomian.includes('@') ? emailDomian.split('@')[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].toLowerCase() : '';
            // resultset 6
            AllResponse.push([{ DomainName: "", EmailDomain: emailDomian }]);

            const dbModules = getUserDbResponse.recordset[1]; // result set 1
            const allowedAbbr = dbModules.map(m => m.Abbreviation);


            // resultset 7        
            const filteredModuleList = APP_CONFIG.MODULE_LIST.filter(m =>
                allowedAbbr.includes(m.ModuleAbbreviation)
            );
            AllResponse.push(filteredModuleList);

            // resultset 8
            AllResponse.push({ authenticationMode: APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE });
            // resultset 9
            AllResponse.push(APP_CONFIG.VALIDATE_MOB_NO);
            //resultset 10
            AllResponse.push(APP_CONFIG.USER_NAME_CONFIG);


            // resultset 11
            const filteredTPTMod = allowedAbbr.includes(APP_CONFIG.TPT_MOD_ABBR.ModuleAbbreviation)
                ? APP_CONFIG.TPT_MOD_ABBR
                : null;
            AllResponse.push(filteredTPTMod);

            // resultset 12
            const filteredAllowedUnits = {
                AllowedModuleAbbreviation:
                    APP_CONFIG.ALLOWED_MODULES_ADD_UNITS.AllowedModuleAbbreviation
                        .filter(a => allowedAbbr.includes(a))
            };
            AllResponse.push(filteredAllowedUnits);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Get Users List data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, AllResponse));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getAssignedUserInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Add Assign users Info to database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addAssignUser(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userMaster = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let adUserName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userGUID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let isUserManager = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUserDbResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNames = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userEmailID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userMobileNo = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let usersList = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let assignedModules = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let assignedGroupsUnits = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let emailID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let mobileNum = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let authenticationMode = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let passwordResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let sendEmailResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userListFiltered = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userDetailsName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let addUserCredentialhistory = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let templateMasterObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let SE_GRC_APP_URL = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];
            let IsUserEnabled = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let CRNCodeFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            userMaster = request.body.userMaster;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            CRNCodeFromToken = request.body.accountNameFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution started.');
            logger.log('info', ' : UserManagementBl : addAssignUser : userMaster : ' + JSON.stringify(userMaster));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == userMaster || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == userMaster) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            adUserName = userMaster.adUserName;
            accountGUID = accountGUIDFromToken;
            userGUID = userMaster.userGUID;
            isUserManager = userMaster.isUserManager;
            emailID = userMaster.emailID;
            mobileNum = userMaster.mobileNumber;
            authenticationMode = userMaster.authenticationMode || APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE;
            /**
             * Validating input parameters : START
             */
            if (authenticationMode == 1) {
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == adUserName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == adUserName || appValidatorObject.isStringEmpty(adUserName.trim())) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : adUserName is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NAME_NULL_EMPTY));
                }
                if (!VALIDATOR_OBJECT.isEmail(adUserName)) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : adUserName is not valid.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NAME_INVALID));
                }
            }
            if (authenticationMode == 3) {
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == adUserName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == adUserName || appValidatorObject.isStringEmpty(adUserName.trim())) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : userName is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NAME_NULL_EMPTY));
                }
                if (!new RegExp(APP_CONFIG.USER_NAME_CONFIG.REGEXP_REFERENCE).test(adUserName)) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : ' + `${APP_CONFIG.USER_NAME_CONFIG.MESSAGE}`);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, `${APP_CONFIG.USER_NAME_CONFIG.MESSAGE}`));
                }
            }

            if (!VALIDATOR_OBJECT.isEmail(emailID)) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : emailid is not valid.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_INVALID));
            }

            if ((APP_CONFIG.VALIDATE_MOB_NO[0].ValidateMobNo == true && (mobileNum.length < APP_CONFIG.VALIDATE_MOB_NO[0].MobNoRange[0] || mobileNum.length > APP_CONFIG.VALIDATE_MOB_NO[0].MobNoRange[1]))) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Mobile number is not valid.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, `Mobile number should be - ${APP_CONFIG.VALIDATE_MOB_NO[0].MobNoRange[0]} - ${APP_CONFIG.VALIDATE_MOB_NO[0].MobNoRange[1]}` + ' digits'));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == accountGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == accountGUID || appValidatorObject.isStringEmpty(accountGUID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : accountGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_GUID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == isUserManager || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == isUserManager) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : isUserManager is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IS_USER_MANAGER_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            /**
            * Fetching user list from data base to check user existence : END
            */
            const GET_USER_DATA_RESPONSE = await userManagementDbObject.getUsers(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : GET_USERS_BEFORE_ADD_NEW_USER : ' + JSON.stringify(GET_USER_DATA_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_USER_DATA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_USER_DATA_RESPONSE ||
                GET_USER_DATA_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || GET_USER_DATA_RESPONSE.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE
            ) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : GET_USER_DATA_RESPONSE of getuserlist is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            // Checking case : - Add assign user, - Edit assign user
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == userGUID) { // add assign user - case
                usersList = GET_USER_DATA_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : usersList : ' + JSON.stringify(usersList));

                userNames = usersList.map(ele => ele.UserName);
                userEmailID = usersList.map(ele => ele.EmailID);
                userMobileNo = usersList.map(ele => ele.MobileNumber);

                // Checking user name existence with DB.
                if (userNames.includes(adUserName)) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : User already exists.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, authenticationMode == 3 ? MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NAME_ALREADY_EXISTS : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_ALREADY_EXISTS));
                } else {
                    // Checking email id existence with DB.
                    if (userEmailID.includes(emailID)) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : emailid already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_ALREADY_EXISTS));
                    }
                    // Checking mobile number existence with DB.
                    if (userMobileNo.includes(mobileNum)) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : mobile number already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MOBILE_NUMBER_ALREADY_EXISTS));
                    }
                    //Genrate default random password, salt and hash the password, send email default password

                    if (authenticationMode == 3) {
                        passwordResponse = await passwordUtilityObj.generateSaltHashPassword(userIdFromToken, null)
                        if (passwordResponse.result) {
                            userMaster.hashPassword = passwordResponse.hashPassword
                            userMaster.salt = passwordResponse.salt
                            userMaster.isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                        }
                    } else {
                        userMaster.hashPassword = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        userMaster.salt = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        userMaster.isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    }

                    // Checking : Is user is user manager.
                    if (isUserManager == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {   // Case : User is User Manager
                        getUserDbResponse = await userManagementDbObject.assignUserManager(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken);
                    }
                    else {  // Case : User is not User Manager
                        assignedModules = [];
                        assignedGroupsUnits = [];
                        assignedModules = userMaster.assignedModules;
                        assignedGroupsUnits = userMaster.assignedGroupsUnits;

                        /**
                         * Validating input parameters : START
                         */
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedModules ||
                            CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedModules ||
                            assignedModules.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                            appValidatorObject.isStringEmpty(assignedModules.trim())
                        ) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Modules details is undefined or null or empty.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MODULES_MISSING));
                        }

                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedGroupsUnits ||
                            CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedGroupsUnits ||
                            assignedGroupsUnits.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                            appValidatorObject.isStringEmpty(assignedGroupsUnits.trim())
                        ) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Group unit details is undefined or null or empty.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GROUPS_UNITS_MISSING));
                        }
                        /**
                         * Validating input parameters : END
                         */

                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : ADD_USER_PAYLOAD : ' + JSON.stringify(userMaster));
                        getUserDbResponse = await userManagementDbObject.addAssignUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : getUserDbResponse : ' + JSON.stringify(getUserDbResponse));
                    }

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : getUserDbResponse is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    if (getUserDbResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }


                    let GET_USER_DATA_BY_NAME = await utilityAppObj.GetUserIDByDetailsByUserName(adUserName, accountGUIDFromToken);
                    logger.log('info', 'UserManagementBl : addAssignUser : GET_USER_DATA_BY_NAME : ' + JSON.stringify(GET_USER_DATA_BY_NAME));

                    if (authenticationMode == 3) {
                        if (passwordResponse.result) {
                            let EMAIL_SENT_EDIT_USER = await sendEmailAddEditUser(userNameFromToken, GET_USER_DATA_BY_NAME.result[0].UserGUID, accountGUIDFromToken, userMaster, 'created', authenticationMode, passwordResponse.randomPassword, CRNCodeFromToken);
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : EMAIL_SENT_EDIT_USER : ' + JSON.stringify(EMAIL_SENT_EDIT_USER));
                        }
                    } else {
                        let EMAIL_SENT_EDIT_USER = await sendEmailAddEditUser(userNameFromToken, GET_USER_DATA_BY_NAME.result[0].UserGUID, accountGUIDFromToken, userMaster, 'created', authenticationMode, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CRNCodeFromToken);
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : EMAIL_SENT_EDIT_USER : ' + JSON.stringify(EMAIL_SENT_EDIT_USER));
                    }

                    let emailAlertsresponse = await utilityAppObj.AddEmailAlerts(userNameFromToken, templateMasterObj);
                    logger.log('info', 'User Id : ' + userIdFromToken + ': UserManagementBl : addAssignUser : emailAlertsresponse' + JSON.stringify(emailAlertsresponse));

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Data added successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, getUserDbResponse.recordset));

                }

                /**
                 * Fetching user list from data base to check user existence : END
                 */
            } else {    // edit assign user - case

                usersList = GET_USER_DATA_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : usersList : ' + JSON.stringify(usersList));

                userListFiltered = usersList.filter(ele => ele.UserGUID == userGUID)
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : userListFiltered : ' + JSON.stringify(userListFiltered));
                if (userListFiltered && userListFiltered.length && authenticationMode == 3) {
                    userMaster.hashPassword = userListFiltered[0].Password;
                    userMaster.salt = userListFiltered[0].Salt;
                    userMaster.isDefaultPwd = userListFiltered[0].IsDefaultPassword;
                } else {
                    userMaster.hashPassword = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    userMaster.salt = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    userMaster.isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                }
                IsUserEnabled = userListFiltered[0].IsUserEnabled;
                userEmailID = usersList.filter(ele => ele.UserGUID != userGUID).map(ele => ele.EmailID);
                userMobileNo = usersList.filter(ele => ele.UserGUID != userGUID).map(ele => ele.MobileNumber);

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == userGUID || appValidatorObject.isStringEmpty(userGUID.trim())) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : userGUID is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_GUID_NULL_EMPTY));
                } else {
                    if (userEmailID.includes(emailID)) { // emailid is already existing
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : emailid already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_ALREADY_EXISTS));
                    }
                    // Checking mobile number existence with DB.
                    if (userMobileNo.includes(mobileNum)) { // mobile number is already existing
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : mobile number already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MOBILE_NUMBER_ALREADY_EXISTS));
                    }

                    // Checking : Is user is user manager.
                    if (isUserManager == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {   // Case : User is User Manager
                        getUserDbResponse = await userManagementDbObject.assignUserManager(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken);
                    }
                    else {  // Case : User is not User Manager
                        assignedModules = [];
                        assignedGroupsUnits = [];
                        assignedModules = userMaster.assignedModules;
                        assignedGroupsUnits = userMaster.assignedGroupsUnits;

                        /**
                         * Validating input parameters : START
                         */
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedModules ||
                            CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedModules ||
                            assignedModules.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                            appValidatorObject.isStringEmpty(assignedModules.trim())
                        ) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Modules details is undefined or null or empty.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MODULES_MISSING));
                        }

                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedGroupsUnits ||
                            CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedGroupsUnits ||
                            assignedGroupsUnits.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                            appValidatorObject.isStringEmpty(assignedGroupsUnits.trim())
                        ) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Group unit details is undefined or null or empty.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GROUPS_UNITS_MISSING));
                        }
                        /**
                         * Validating input parameters : END
                         */

                        getUserDbResponse = await userManagementDbObject.addAssignUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken);
                        assignedModules = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        assignedGroupsUnits = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    }

                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : getUserDbResponse is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    if (getUserDbResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }

                    let EMAIL_SENT_EDIT_USER = await sendEmailAddEditUser(userNameFromToken, userGUID, accountGUIDFromToken, userMaster, 'updated', authenticationMode, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, CRNCodeFromToken);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : EMAIL_SENT_EDIT_USER : ' + JSON.stringify(EMAIL_SENT_EDIT_USER));

                    if (EMAIL_SENT_EDIT_USER != CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Failed to add data to Email alerts ');
                    }

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Data added successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, getUserDbResponse.recordset));
                }


            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch deatils from AD server by UserID or User's email.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getUserDetailsFromAD(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userMaster = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let emailId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var requestBody = request.body;

            userMaster = request.body.userMaster;
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution started.');

            if (userMaster === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || userMaster === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Invalid request, missing mandatory parameters.');

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            /**
             * Validating input parameters : START
             */
            userId = userMaster.userId;
            emailId = userMaster.emailId;

            /** User id & Email id both should not be undefined or null or empty.  */
            if (
                (appValidatorObject.isStringUndefined(userId) || appValidatorObject.isStringNull(userId) || appValidatorObject.isStringEmpty(userId.trim()))
                && (appValidatorObject.isStringUndefined(emailId) || appValidatorObject.isStringNull(emailId) || appValidatorObject.isStringEmpty(emailId.trim()))
            ) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : User Id and Email Id both are undefined or null or empty, Atleast provide value one of parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_ID_AND_EMAIL_ID_NULL_EMPTY));
            }

            /** Validation eamil id value */
            if (
                (!appValidatorObject.isStringUndefined(emailId) && !appValidatorObject.isStringNull(emailId) && !appValidatorObject.isStringEmpty(emailId.trim()))
                && (!VALIDATOR_OBJECT.isEmail(emailId))
            ) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Email ID value is not a valid email id.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_INVALID));
            }
            /**
             * Validating input parameters : END
             */

            // Sending API request to User Management module of Auth application to get details of user from AD server by UserId or User's EmailId.
            const API_RESPONSE_OBJ = await sendRequestToAuthAPIApplication(requestBody, '/auth-management/user-management/get-user-details-from-ad');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ONE === API_RESPONSE_OBJ.success) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : User details fetched successfully from AD server.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, API_RESPONSE_OBJ.result));

            } else if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO === API_RESPONSE_OBJ.success) {
                let errorMessageFromAuthApplication = API_RESPONSE_OBJ.error.errorMessage;
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Error from Auth application module, for more details check Auth application module API log. : Error details : ' + errorMessageFromAuthApplication);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, errorMessageFromAuthApplication));
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Error details : Error from Auth application module, for more details check Auth application module API log.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : getUserDetailsFromAD : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    async resetPassword(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userMaster = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let passwordResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let FORMAT_EMAIL_RESPONSE = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let sendEmailResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let SE_GRC_APP_URL = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];
            let templateMasterObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let authenticationMode = APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE

            userMaster = request.body.userMaster;
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            accountNameFromToken = request.body.accountNameFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : resetPassword : Execution started.');

            let GET_USER_DETAILS = await authDbObject.getUserDetailsByUserId(userMaster.UserGUID, accountGUIDFromToken);
            logger.log('info', 'UserManagementBl : resetPassword : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));

            if (GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userID + 'UserManagementBl : resetPassword : Execution end. : get User details response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'UserManagementBl : resetPassword : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'UserManagementBl : resetPassword : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            GET_USER_DETAILS = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            logger.log('info', 'UserManagementBl : resetPassword : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));

            if (GET_USER_DETAILS && GET_USER_DETAILS.length) {
                passwordResponse = await passwordUtilityObj.generateSaltHashPassword(userIdFromToken, null)
                if (passwordResponse.result) {
                    templateMasterObj = {
                        EmailContent: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body><div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear ${GET_USER_DETAILS[0].FirstName} ${GET_USER_DETAILS[0].LastName},<br><br>User for SE-GRC has been successfully reset. Please find the user details as below : </p> <br><table border="1" cellpadding="5" cellspacing="0">  
                        <tr><th>User Name</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th> Mobile number</th><th>Default Password</th> <th>CRN Code</th></tr><tr><td>${GET_USER_DETAILS[0].UserName}</td><td>${GET_USER_DETAILS[0].FirstName}</td><td>${GET_USER_DETAILS[0].MiddleName}</td><td>${GET_USER_DETAILS[0].LastName}</td><td>${GET_USER_DETAILS[0].MobileNumber}</td><td>${passwordResponse.randomPassword}</td><td>${accountNameFromToken} </td> </tr></table>
                        <p>Please click <a href=${SE_GRC_APP_URL}> here</a> to access the application. </p>${authenticationMode == 3 ? 'Note: This is the default password for login to SE-GRC Portal.' : ''} </div></div></body></html>	`,
                        EmailSubject: 'SE-GRC Notification: User password reset',
                        TOEmail: GET_USER_DETAILS[0].EmailID,
                        CCEmail: "",
                        EmailAttachment: []
                    }
                    // sendEmailResponse = await emailUtilityObj.sendEMailNotification(templateMasterObj);      
                    // logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : formatSendEmailToResetPassword : sendEmailResponse : ' + JSON.stringify(sendEmailResponse));
                }

                // if(!sendEmailResponse){
                //     logger.log('error', 'User Id : ' + userID + ': UserManagementBl : resetPassword : Error in reset the password or to send an email with default password. : Error detail : ' + error);
                //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESET_PASSWORD));
                // }

            }
            let isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            let salt = passwordResponse.salt;
            let hashPassword = passwordResponse.hashPassword;
            let setTryCount = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;

            const UPDATE_USER_MASTER_FOR_AUTH = await authDbObject.updateUserMasterForAuth(GET_USER_DETAILS[0].UserName, GET_USER_DETAILS[0].UserGUID, accountGUIDFromToken, { isDefaultPwd, salt, hashPassword, setTryCount }, 'passwordTryCount');

            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
            }
            logger.log('info', 'UserManagementBl : resetPassword : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

            let emailAlertsresponse = await utilityAppObj.AddEmailAlerts(userNameFromToken, templateMasterObj);
            logger.log('info', 'UserManagementBl : resetPassword : emailAlertsresponse : ' + JSON.stringify(emailAlertsresponse));

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_GENERATED_SUCCESSFUL, FORMAT_EMAIL_RESPONSE));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : resetPassword : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_GENERATED_UNSUCCESSFUL));
        }
    }

    async enableDisableUser(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUserDbResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let sendEmailResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let passwordResponse = {};
            let templateMasterObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let SE_GRC_APP_URL = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];
            let authenticationMode = APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE;
            let accountNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            accountNameFromToken = request.body.accountNameFromToken;
            data = request.body.userMaster;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution started.');

            let GET_USER_DETAILS = await authDbObject.getUserDetailsByUserId(data.UserGUID, accountGUIDFromToken);
            logger.log('info', 'UserManagementBl : enableDisableUser : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));

            if (GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'User Id : ' + userID + 'UserManagementBl : enableDisableUser : Execution end. : get User details response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'UserManagementBl : enableDisableUser : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'UserManagementBl : enableDisableUser : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            GET_USER_DETAILS = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            logger.log('info', 'UserManagementBl : enableDisableUser : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));

            if (GET_USER_DETAILS && GET_USER_DETAILS.length) {
                if (data.isEnabled) {
                    if (authenticationMode == 3) {
                        passwordResponse = await passwordUtilityObj.generateSaltHashPassword(userIdFromToken, null);
                        if (passwordResponse.result) {
                            templateMasterObj = {
                                EmailContent: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body><div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear ${GET_USER_DETAILS[0].FirstName} ${GET_USER_DETAILS[0].LastName},<br><br>User for SE-GRC has been successfully Activated. Please find the user details as below : </p> <br><table border="1" cellpadding="5" cellspacing="0">  <tr><th>User Name</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th> Mobile number</th><th>Default Password</th><th>CRN Code</th> </tr>
                                <tr><td>${GET_USER_DETAILS[0].UserName}</td><td>${GET_USER_DETAILS[0].FirstName}</td><td>${GET_USER_DETAILS[0].MiddleName}</td><td>${GET_USER_DETAILS[0].LastName}</td><td>${GET_USER_DETAILS[0].MobileNumber}</td>	<td>${passwordResponse.randomPassword}</td><td> ${accountNameFromToken} </td> </tr></table><p>Please click <a href=${SE_GRC_APP_URL}>here</a> to access the application. </p>${authenticationMode == 3 ? 'Note: This is the default password for login to SE-GRC Portal.' : ''} </div></div></body></html>	`,
                                EmailSubject: 'SE-GRC Notification: User Activated.',
                                TOEmail: GET_USER_DETAILS[0].EmailID,
                                CCEmail: "",
                                EmailAttachment: []
                            }
                        } else {
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_GENERATE_PASSWORD));
                        }
                    } else {
                        templateMasterObj = {
                            EmailContent: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body><div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear ${GET_USER_DETAILS[0].FirstName} ${GET_USER_DETAILS[0].LastName},<br><br>User for SE-GRC has been successfully Activated. Please find the user details as below : </p> <br><table border="1" cellpadding="5" cellspacing="0">  <tr><th>User Name</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th> Mobile number</th></tr><tr><td>${GET_USER_DETAILS[0].UserName}</td><td>${GET_USER_DETAILS[0].FirstName}</td><td>${GET_USER_DETAILS[0].MiddleName}</td><td>${GET_USER_DETAILS[0].LastName}</td><td>${GET_USER_DETAILS[0].MobileNumber}</td> </tr></table><br><br><p>Please click <a href=${SE_GRC_APP_URL}>here</a> to access the application. </p><br> </div></div></body></html>	`,
                            EmailSubject: 'SE-GRC Notification: User Activated.',
                            TOEmail: GET_USER_DETAILS[0].EmailID,
                            CCEmail: "",
                            EmailAttachment: []
                        }
                        passwordResponse.salt = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        passwordResponse.hashPassword = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                    }

                    // sendEmailResponse = await emailUtilityObj.sendEMailNotification(templateMasterObj);      
                    // logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : formatSendEmailToenableDisableUser : sendEmailResponse : ' + JSON.stringify(sendEmailResponse));
                    let isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                    let salt = passwordResponse.salt;
                    let hashPassword = passwordResponse.hashPassword;
                    let setTryCount = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                    const UPDATE_USER_MASTER_FOR_AUTH = await authDbObject.updateUserMasterForAuth(GET_USER_DETAILS[0].UserName, GET_USER_DETAILS[0].UserGUID, accountGUIDFromToken, { isDefaultPwd, salt, hashPassword, setTryCount }, 'passwordTryCount');

                    if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }
                    logger.log('info', 'UserManagementBl : enableDisableUser : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                } else {
                    let isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    let salt = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let hashPassword = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    const UPDATE_USER_MASTER_FOR_AUTH = await authDbObject.updateUserMasterForAuth(GET_USER_DETAILS[0].UserName, GET_USER_DETAILS[0].UserGUID, accountGUIDFromToken, { isDefaultPwd, salt, hashPassword }, 'password');

                    if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }
                    logger.log('info', 'UserManagementBl : enableDisableUser : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');
                    templateMasterObj = {
                        EmailContent: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body><div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear ${GET_USER_DETAILS[0].FirstName} ${GET_USER_DETAILS[0].LastName},<br><br>Your access for SE-GRC has been revoked. Please contact user manager for more details.  </p><br><br><br> <br></div></div></body></html>	`,
                        EmailSubject: 'SE-GRC Notification: User Deactivated.',
                        TOEmail: GET_USER_DETAILS[0].EmailID,
                        CCEmail: "",
                        EmailAttachment: []
                    }
                }
                // if(!sendEmailResponse){
                //     logger.log('error', 'User Id : ' + userID + ': UserManagementBl : enableDisableUser : Error in reset the password or to send an email with default password. : Error detail : ' + error);
                //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESET_PASSWORD));
                // }
            }

            let emailAlertsresponse = await utilityAppObj.AddEmailAlerts(userNameFromToken, templateMasterObj);
            logger.log('info', 'UserManagementBl : resetPassword : emailAlertsresponse : ' + JSON.stringify(emailAlertsresponse));

            getUserDbResponse = await userManagementDbObject.enableDisableUser(userIdFromToken, userNameFromToken, accountGUIDFromToken, data);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : GET_USERS : ' + JSON.stringify(getUserDbResponse));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution end. : Get Users List data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, getUserDbResponse));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : enableDisableUser : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
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
 * Sending resultsets of roles and users along with modules and units based on UserGUID
 * @param {*} rolesDetails 
 * @param {*} usersDetails 
 * @param {*} userModulesDetails 
 * @param {*} unitsDetails 
 * @returns 
 */
async function getResult(ModulesMaster, rolesDetails, usersDetails, userModulesDetails, unitsDetails, roleDetailsTPT) {
    logger.log('info', 'User Id :: UserManagementBl : getResult : Execution started.');

    let userModule = [];
    let unitsData = [];
    let usersData = [];

    // 🔹 1. Build allowed module abbreviations from ModulesMaster
    const allowedAbbr = (ModulesMaster || [])
        .map(m => m.Abbreviation)
        .filter(abbr => !!abbr);

    // 🔹 2. Filter MODULE_LIST using ModulesMaster
    const filteredModuleList = APP_CONFIG.MODULE_LIST.filter(m =>
        allowedAbbr.includes(m.ModuleAbbreviation)
    );

    // 🔹 3. Filter TPT_MOD_ABBR using ModulesMaster
    const filteredTPTModAbbr =
        allowedAbbr.includes(APP_CONFIG.TPT_MOD_ABBR.ModuleAbbreviation)
            ? APP_CONFIG.TPT_MOD_ABBR
            : null;

    // filter users where user role is not superadmin 
    usersData = usersDetails.filter(ele => (ele.DefaultRoleID != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE));
    logger.log('info', 'User Id :: UserManagementBl : getResult : usersData : ' + JSON.stringify(usersData));

    usersData.forEach(element => {
        userModule = userModulesDetails.filter(ele => ele.UserGUID == element.UserGUID);
        unitsData = unitsDetails.filter(ele => ele.UserGUID == element.UserGUID);

        if (userModule && userModule.length) {

            // only keep modules in filteredModuleList
            userModule = userModule.filter(module =>
                filteredModuleList.some(selected => selected.ModuleAbbreviation === module.ModuleAbbreviation)
            );

            // mark user's assigned modules as selected
            userModule = userModule.map(module => ({
                ...module,
                IsSelected: true
            }));

            // add missing modules (not assigned but allowed)
            let missingModules = filteredModuleList.filter(module =>
                !userModule.some(selected => selected.ModuleAbbreviation === module.ModuleAbbreviation)
            );

            userModule.push(...missingModules);

            element['Modules'] = userModule.sort((a, b) => {
                const abbrA = a.ModuleAbbreviation || '';
                const abbrB = b.ModuleAbbreviation || '';
                return abbrA.localeCompare(abbrB);
            });

        } else {
            // user has no modules → return full filtered list but unselected
            element['Modules'] = filteredModuleList.map(m => ({
                ...m,
                IsSelected: false
            }));
        }

        element['Units'] = unitsData && unitsData.length ? unitsData : [];
    });

    return {
        Roles: rolesDetails,
        Users: usersData,
        AllowedModuleList: filteredModuleList,
        roleDetailsTPT: roleDetailsTPT,
        modAbbreviationTPT: filteredTPTModAbbr,    
        authenticationMode: APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE
    }
}


/**
 * Send API request to Auth application user management module
 * @param {*} requestBody 
 * @param {*} endPoint 
 * @returns 
 */
async function sendRequestToAuthAPIApplication(requestBody, endPoint) {
    try {
        logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution started.');
        logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint);
        // logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL with requestBody value = ' + JSON.stringify(requestBody));

        const AUTH_SERVICE_BASE_URL = APP_CONFIG.AUTH_SERVICE_URL;
        const HEADERS = { 'Content-Type': 'application/json' };

        return AXIOS.post(AUTH_SERVICE_BASE_URL + endPoint, { reqPayload: requestBody }, { headers: HEADERS })
            .then((response) => {
                logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution end. : Response Received for API URL : ' + endPoint);
                // logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Response Received for API URL with response value = ' + JSON.stringify(response.data));
                return response.data;
            })
            .catch((error) => {
                logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
                logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution end. : Error occured while processing request for API URL : ' + endPoint + ' : Error details : ' + error);
                return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            })
    } catch (error) {
        logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
        logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution end. : Got unhandled error. : Error details : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function sendEmailAddEditUser(userNameFromToken, userGUID, accountGUIDFromToken, userMaster, type, authenticationMode, password, CRNCodeFromToken) {
    try {
        let templateMasterObj = {};
        let modulesAccess = [];
        let unitAccess = [];
        let TPTracRoleData = [];
        let roleData = [];
        let userData = [];
        let moduleData = [];
        let SE_GRC_APP_URL = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];

        logger.log('info', 'User Id : ' + userNameFromToken + ' : UserManagementBl : sendEmailAddEditUser : Execution started. : userMaster : ' + JSON.stringify(userMaster));
        const GET_USER_DATA = await authDbObject.getUserDetailsByUserId(userGUID, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userNameFromToken + ' : UserManagementBl : sendEmailAddEditUser : GET_USER_DATA : ' + JSON.stringify(GET_USER_DATA));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_USER_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_USER_DATA ||
            GET_USER_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || GET_USER_DATA.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            logger.log('error', 'User Id : ' + userNameFromToken + ' : UserManagementBl : sendEmailAddEditUser : Execution end. : GET_USER_DATA of getuserlist is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        roleData = GET_USER_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        userData = GET_USER_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        modulesAccess = GET_USER_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        unitAccess = GET_USER_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
        TPTracRoleData = GET_USER_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        logger.log('info', 'User Id : ' + userNameFromToken + ' : UserManagementBl : sendEmailAddEditUser : userData : ' + JSON.stringify(userData));

        if (userData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserType != "UserManagement") {
            moduleData = modulesAccess.map(item => {
                let roleName = "";
                if (item.ModuleAbbreviation == APP_CONFIG.TPT_MOD_ABBR.ModuleAbbreviation) {
                    const role = TPTracRoleData.find(role => role.AuditorRoleID === item.RoleID);
                    roleName = role ? role.AuditorRoleName : "";
                } else {
                    if (!item.IsFunctionalAdmin) {
                        const role = roleData.find(role => role.RoleID === item.RoleID);
                        roleName = role ? role.Description : "";
                    } else {
                        roleName = 'Functional Admin'
                    }
                }
                return {
                    Role: roleName,
                    ModuleName: item.ModuleName,
                    ModuleAbbreviation: item.ModuleAbbreviation
                };
            });

            unitAccess = unitAccess.map((item, index) => ({ SlNo: index + 1, GroupName: item.GroupName, UnitName: item.UnitName }));
            moduleData = moduleData.map((item, index) => ({ SlNo: index + 1, ModuleAbbreviation: item.ModuleAbbreviation, ModuleName: item.ModuleName, Role: item.Role }));
        } else {
            moduleData = [{ SlNo: "1", ModuleAbbreviation: 'UM', ModuleName: 'User Management', Role: "User Manager" }]
        }

        templateMasterObj = {
            EmailContent: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body> <div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">
                                Dear ${userMaster.firstName} ${userMaster.lastName},<br><br>User for SE-GRC has been successfully ${type}. Please find the user details as below: : </p> <br> 
                                <table border="1" cellpadding="5" cellspacing="0">  
                                <tr><th>User Name</th><th>First Name</th><th>Middle Name</th><th>Last Name</th><th> Mobile number</th> ${authenticationMode === 3 && type === "created" ? '<th>Default Password</th>' : ''} ${authenticationMode === 3 && type === "created" ? '<th>CRN Code</th>' : ''}</tr>
                                <tr><td>${userMaster.adUserName}</td><td>${userMaster.firstName}</td><td>${userMaster.middleName}</td><td>${userMaster.lastName}</td><td>${userMaster.mobileNumber}</td>  ${authenticationMode === 3 && type === "created" ? `<td>${password}</td>` : ''} 
                                ${authenticationMode === 3 && type === "created" ? `<td>${CRNCodeFromToken}</td>` : ''}
                                </tr></table> <br>

                                Please find the below assigned role details : <br>
                                <table border="1" cellpadding="5" cellspacing="0">
                                    <tr>
                                        <th style="width: 10%;">Sl No.</th>
                                        <th>Module Abbreviation</th>
                                        <th>Module</th>
                                        <th>Role</th>
                                    </tr>
                                    ${moduleData.map(mod => `<tr style="text-align: center;"><td>${mod.SlNo}</td><td>${mod.ModuleAbbreviation}</td><td>${mod.ModuleName}</td><td>${mod.Role}</td></tr>`).join('')} 
                                </table> <br>
                                Please find the below assigned modules details : <br>
                                <table border="1" cellpadding="5" cellspacing="0">
                                    <tr>
                                        <th style="width: 10%;">Sl No.</th>
                                        <th style="width: 45%;">Group</th>
                                        <th style="width: 45%;">Unit</th>
                                    </tr>
                                    ${unitAccess.map(ob => `<tr style="text-align: center;"><td>${ob.SlNo}</td><td>${ob.GroupName}</td><td>${ob.UnitName}</td></tr>`).join('')} 
                                </table> <br>                               
                                <p>Please click <a href=${SE_GRC_APP_URL}>here</a> to access the application. </p>
                                ${authenticationMode == 3 && type != 'updated' ? 'Note: This is the default password for login to SE-GRC Portal.' : ''}  </div></div></body></html>	`,
            EmailSubject: `SE-GRC Notification: User details ${type}.`,
            TOEmail: userMaster.emailID,
            CCEmail: "",
            EmailAttachment: [],
        }
        let emailAlertsresponse = await utilityAppObj.AddEmailAlerts(userNameFromToken, templateMasterObj);
        logger.log('info', 'User Id : ' + userNameFromToken + ': UserManagementBl : addAssignUser : emailAlertsresponse' + JSON.stringify(emailAlertsresponse));


        return CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
    }
    catch (error) {
        logger.log('error', 'User Id : ' + userNameFromToken + ' : UserManagementBl : sendEmailAddEditUser Execution End ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
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