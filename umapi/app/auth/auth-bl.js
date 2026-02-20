const JWT                       = require('jsonwebtoken');
const AXIOS                     = require('axios');
const UTILITY_APP               = require('../../utility/utility.js');
const AUTH_DB                   = require('../../data-access/auth-db.js');
const APP_CONFIG                = require('../../config/app-config.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const MESSAGE_FILE_OBJ          = require('../../utility/message/message-constant.js');
const validatorObject           = require('validator');
const PASSWORD_UTILITY          = require('../../utility/passwordUtility.js');
const EMAIL_UTILITY             = require('../../utility/email-utility.js')
const PUBLIC_KEY_FILE_PATH_UM   = "config/certs/public.pem";
const PATH                      = require('path');
const FILE_SYSTEM               = require('fs');
const appConfig = require('../../config/app-config.js');

// const MOMENT                    = require('moment'); 

var authDbObject                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var authBlClassInstance         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var passwordUtilityObject       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailUtilityObj             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
class AuthBl {
    
    constructor() {
        authDbObject            = new AUTH_DB();
        utilityAppObject        = new UTILITY_APP();
        passwordUtilityObject   = new PASSWORD_UTILITY();
        emailUtilityObj         = new EMAIL_UTILITY();
    }

    start() {

    }

    /**
     * This function will send request to Auth application module to get public key, 
     * if success from Auth module then the success respond with public key to UI
     * else send failure from Auth module response to UI
     * @param {*} request 
     * @param {*} response 
     */
    async getPublicKey(request, response){
        try {
            if (global.logger && global.logger.log) global.logger.log('info', 'AuthBl : getPublicKey : Execution started.');

            var requestBody                 = request.body || {};
            let absolutePathForPublicKey    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let publicKeyUM                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            const API_RESPONSE_OBJ          = await sendRequestToAuthAPIApplication(requestBody, '/auth-management/auth/get-Key');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ  && CONSTANT_FILE_OBJ.APP_CONSTANT.ONE === API_RESPONSE_OBJ.success){
                if (global.logger && global.logger.log) global.logger.log('info', 'AuthBl : getPublicKey : Get public key successfully');
                if (!API_RESPONSE_OBJ.result) API_RESPONSE_OBJ.result = {};

                API_RESPONSE_OBJ.result.OTPLength                           = (APP_CONFIG.OTP_CONFIG && APP_CONFIG.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP) !== undefined ? APP_CONFIG.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP : 6;
                API_RESPONSE_OBJ.result.ResentOTPTime                       = (APP_CONFIG.OTP_CONFIG && APP_CONFIG.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS) !== undefined ? APP_CONFIG.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS : 60;
                API_RESPONSE_OBJ.result.ResentOTPTimeForChangePassword      = (APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD && APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS) !== undefined ? APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS : 60;
                API_RESPONSE_OBJ.result.DateFormat                          = (APP_CONFIG.DATE_FORMAT_CONFIG && APP_CONFIG.DATE_FORMAT_CONFIG.DATE_FORMAT) || 'YYYY-MM-DD';
                API_RESPONSE_OBJ.result.authenticationMode                  = (APP_CONFIG.APP_SERVER && APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE) !== undefined ? APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE : 3;
                API_RESPONSE_OBJ.result.IS_OTP_FOR_CHANGE_PASSWORD          = (APP_CONFIG.PASSWORD_CONFIG && APP_CONFIG.PASSWORD_CONFIG.REQUIRED_OTP_FOR_CHANGE_PASSWORD) !== undefined ? APP_CONFIG.PASSWORD_CONFIG.REQUIRED_OTP_FOR_CHANGE_PASSWORD : false;
                API_RESPONSE_OBJ.result.CHANGE_PASSWORD_CONFIG              = (APP_CONFIG && APP_CONFIG.CHANGE_PASSWORD_CONFIG) || null;
                API_RESPONSE_OBJ.result.USER_NAME_CONFIG                    = (APP_CONFIG && APP_CONFIG.USER_NAME_CONFIG) || null;
                API_RESPONSE_OBJ.result.USER_ID_CONFIG                      = (APP_CONFIG && APP_CONFIG.USER_ID_CONFIG) || null;
                API_RESPONSE_OBJ.result.MFA_CONFIG_IS_MFA                   = (APP_CONFIG.MFA_CONFIG && APP_CONFIG.MFA_CONFIG.IS_MFA) !== undefined ? APP_CONFIG.MFA_CONFIG.IS_MFA : false;
                API_RESPONSE_OBJ.result.LOGIN_PAGE_DATA                     = (APP_CONFIG && APP_CONFIG.LOGIN_PAGE_DATA) || null;

                var appPath = (APP_CONFIG.APP_SERVER && APP_CONFIG.APP_SERVER.PATH) ? APP_CONFIG.APP_SERVER.PATH : process.cwd();
                absolutePathForPublicKey    = PATH.join(appPath, PUBLIC_KEY_FILE_PATH_UM);
                if (!FILE_SYSTEM.existsSync(absolutePathForPublicKey)) {
                    if (global.logger && global.logger.log) global.logger.log('error', 'AuthBl : getPublicKey : Public key file not found : ' + absolutePathForPublicKey);
                    return response.status(200).json({ success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Public key file not found' } });
                }
                publicKeyUM                 = FILE_SYSTEM.readFileSync(absolutePathForPublicKey, "utf8");

                API_RESPONSE_OBJ.result.publicKeyUM     = publicKeyUM;

                return response.status(200).json({
                    success : 1,
                    message : (MESSAGE_FILE_OBJ.MESSAGE_CONSTANT && MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY) || 'OK',
                    result  : API_RESPONSE_OBJ.result,
                    error: { errorCode: null, errorMessage: null }
               });
            } else {
                if (global.logger && global.logger.log) global.logger.log('error', 'AuthBl : getPublicKey : Auth module error or unreachable.');
                return response.status(200).json({
                    success : 0,
                    message : null,
                    result  : null,
                    error   : { errorCode: null, errorMessage: (MESSAGE_FILE_OBJ.MESSAGE_CONSTANT && MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY_FAIL) || 'Get key failed' }
                });
            }
        } catch (err) {
            try { if (global.logger && global.logger.log) global.logger.log('error', 'AuthBl : getPublicKey : ' + (err && err.message || err)); } catch (_) {}
            return response.status(200).json({
                success : 0,
                message : null,
                result  : null,
                error   : { errorCode: null, errorMessage: (MESSAGE_FILE_OBJ.MESSAGE_CONSTANT && MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY_FAIL) || 'Get key failed' }
            });
        }
    }

    /**
     * This function will send request to Auth application module to authenticate user credential
     * if user authenticated then User management application module will check authorization of user,
     * create to token and update into data base. If all are success then then send response as login success
     * else send response as login unsuccessful.
     * @param {*} request 
     * @param {*} response 
     */
    async updateUserLogin(request, response) {
        logger.log('info', 'AuthBl : updateUserLogin : Execution started.');

        try {
            var userId                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userName                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var secretKey               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var token                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var requestBody             = request.body;
            let updateUserDBResponse    = [];
            let accountGUID             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountName             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : UPDATE_USER_LOGIN_REQUEST_BODY: ' + JSON.stringify(requestBody))

            const API_RESPONSE_OBJ = await sendRequestToAuthAPIApplication(requestBody, '/auth-management/auth/login');
            logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : API_RESPONSE_OBJ FOR AUTH API: ' + JSON.stringify(API_RESPONSE_OBJ))
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ONE === API_RESPONSE_OBJ.success){
                userName = API_RESPONSE_OBJ.result.userName;
                accountName = API_RESPONSE_OBJ.result.accountName;
                accountGUID = API_RESPONSE_OBJ.result.accountGUID;

                if (typeof global !== 'undefined' && (global.poolConnectionObject == null || global.poolConnectionObject === undefined)) {
                    logger.log('error', 'AuthBl : updateUserLogin : Database not connected. Cannot complete login.');
                    return response.status(503).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        error   : {
                            errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            errorMessage    : (MESSAGE_FILE_OBJ.MESSAGE_CONSTANT && MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DB_UNAVAILABLE_FOR_LOGIN) || 'Database connection unavailable. Please try again later.'
                        }
                    });
                }

                /**
                 * Fetching User Id from data base by user name : START
                 */
                const USER_ID_BY_USER_NAME_DB_RESPONSE = await authDbObject.getUserIdByUserName(userName, accountGUID);
                logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : USER_ID_BY_USER_NAME_DB_RESPONSE : ' + JSON.stringify(USER_ID_BY_USER_NAME_DB_RESPONSE));
                if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == USER_ID_BY_USER_NAME_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == USER_ID_BY_USER_NAME_DB_RESPONSE)
                {
                    logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : USER_ID_BY_USER_NAME_DB_RESPONSE is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        error   : {
                            errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                        }
                    });
                }
                if(USER_ID_BY_USER_NAME_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_ID_BY_USER_NAME_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && USER_ID_BY_USER_NAME_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    userId = USER_ID_BY_USER_NAME_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID;
                    // accountGUID = USER_ID_BY_USER_NAME_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AccountGUID
                    // logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : AccountGUID and UserID : ' + userId + " " + Account);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Get ID of User successfully');
                    /**
                     * Create JWT token : Start
                     */
                    secretKey = utilityAppObject.getAppSecretKey();
                    try {
                        token = JWT.sign(
                            {
                                userId              : userId,
                                userName            : userName,
                                iat                 : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS),
                                exp                 : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS) + (CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS * APP_CONFIG.JWT_TOKEN.TOKEN_EXPIRY_TIME_IN_MINUTES),
                                accountName         : accountName
                            },
                            secretKey,
                            {
                                algorithm : 'HS256'
                            }
                        );
                        logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Token get generated successfully : Token value is : ' + token);
                    } catch (error) {
                        logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Error in creating JWT token : Execution end. : Error details : ' + error);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    /**
                     * Create JWT token : END
                     */

                    /**
                     * updating user login deatils and token againts userGUID into data base : START
                     */

                    let tokenBody = {
                        userId      : userId,
                        userName    : userName,
                        iat         : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS),
                        exp         : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS) + (CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS * APP_CONFIG.JWT_TOKEN.TOKEN_EXPIRY_TIME_IN_MINUTES),
                        accountName : accountName
                    }

                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : TOKEN_BODY : ' + JSON.stringify(tokenBody));
                    
                    //Adding User Login info to the user login table
                    // updateUserDBResponse = await authDbObject.updateUserLogin(userId, userName, token, accountGUID);
                    // logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : UPDATE_USER before getInfoForUserLogin : ' + JSON.stringify(updateUserDBResponse));

                    // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == updateUserDBResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == updateUserDBResponse) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : updateUserDBResponse is undefined or null.');
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details :' + updateUserDBResponse.errorMsg);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && updateUserDBResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details : ' + updateUserDBResponse.procedureMessage);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }

                    // Fetching User login Info from DB
                    const GET_INFO_USER_LOGIN = await authDbObject.getInfoForUserLogin(userId, userName, accountGUID);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : GET_INFO_USER_LOGIN : ' + JSON.stringify(GET_INFO_USER_LOGIN));

                    if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_USER_LOGIN || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_USER_LOGIN){
                        logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogout : Execution end. : GET_INFO_USER_LOGIN is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }
                    if (GET_INFO_USER_LOGIN.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogout : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }
                    if (GET_INFO_USER_LOGIN.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_USER_LOGIN.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogout : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }

                    // /**
                    //  * First time adding a new user to user login table - START
                    //  */
                    // updateUserDBResponse = await authDbObject.updateUserLogin(userId, userName, token);
                    // logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : updateUserDBResponse : ' + JSON.stringify(updateUserDBResponse));

                    // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == updateUserDBResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == updateUserDBResponse) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : updateUserDBResponse is undefined or null.');
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details :' + updateUserDBResponse.errorMsg);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && updateUserDBResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details : ' + updateUserDBResponse.procedureMessage);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // /**
                    //  * First time adding a user in user login table - END
                    //  */
                    
                    let usersLoginData  = GET_INFO_USER_LOGIN.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    let roleId          = usersLoginData.filter(ele => ele.UserGUID == userId).map(ele => ele.RoleID);
                    if(userId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || roleId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || roleId != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){

                        updateUserDBResponse = await authDbObject.updateUserLogin(userId, userName,token, accountGUID);
                        logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin :  UPDATE_USER after getInfoForUserLogin : ' + JSON.stringify(updateUserDBResponse));

                        if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == updateUserDBResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == updateUserDBResponse){
                            logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogin : Execution end. : updateUserDBResponse is undefined or null.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                        }
                        if (updateUserDBResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                            logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogin : Execution end. : Error details :' + updateUserDBResponse.errorMsg);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                        }
                        if (updateUserDBResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && updateUserDBResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                            logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogin : Execution end. : Error details : ' + updateUserDBResponse.procedureMessage);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                        }        
                    }
                    /**
                    * updating user login deatils and token againts user into data base : END
                    */

                    /**
                     * Fecthing user subscription details from data base : START
                     */
                    const USER_SUBSCRIPTION_DB_RESPONSE = await authDbObject.getUserSubscription(userId, userName, accountGUID);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : USER_SUBSCRIPTION_DB_RESPONSE : ' + JSON.stringify(USER_SUBSCRIPTION_DB_RESPONSE));

                    if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == USER_SUBSCRIPTION_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == USER_SUBSCRIPTION_DB_RESPONSE){
                        logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : USER_SUBSCRIPTION_DB_RESPONSE is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    if(USER_SUBSCRIPTION_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + USER_SUBSCRIPTION_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    if(USER_SUBSCRIPTION_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_SUBSCRIPTION_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + USER_SUBSCRIPTION_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    /**
                    * Fetching user subscription details from data base : END
                    */

                    /**
                     * Fetching user's authorized function list from data base : START
                     */
                     const AUTHORIZED_FUNCTIONS_DB_RESPONSE = await authDbObject.getAllAuthorizedFunctions(userId, userName, accountGUID);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : AUTHORIZED_FUNCTIONS_DB_RESPONSE : ' + JSON.stringify(AUTHORIZED_FUNCTIONS_DB_RESPONSE));

                     if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == AUTHORIZED_FUNCTIONS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == AUTHORIZED_FUNCTIONS_DB_RESPONSE){
                         logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : AUTHORIZED_FUNCTIONS_DB_RESPONSE is null or undefined');
                         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                             success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                             message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             error   : {
                                 errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                 errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                             }
                         });
                     }
                     if(AUTHORIZED_FUNCTIONS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                         logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + AUTHORIZED_FUNCTIONS_DB_RESPONSE.errorMsg);
                         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                             success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                             message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             error   : {
                                 errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                 errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                             }
                         });
                     }
                     if(AUTHORIZED_FUNCTIONS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && AUTHORIZED_FUNCTIONS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                         logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + AUTHORIZED_FUNCTIONS_DB_RESPONSE.procedureMessage);
                         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                             success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                             message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             error   : {
                                 errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                 errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                             }
                         });
                     }
                    /**
                     * Fetching user's authorized function list from data base : END
                     */
                  
                    let userData            = updateUserDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    let rolesData           = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    let modulesData         = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                    let accountsData        = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                    let moduleUserRoleData  = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
                    let userUnitData        = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
                    //logger.log('info', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : USER_SUBSCRIPTION_DB_RESPONSE : ' + JSON.stringify(USER_SUBSCRIPTION_DB_RESPONSE));
                    
                    // Fetching  user subscription details with filtered modules details based on roles of logged-in user
                    const GET_SUBSCRIPTION_DATA = await getSubscriptionData(userId, userData, rolesData, modulesData, accountsData, moduleUserRoleData,userUnitData);
                    //logger.log('info', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : GET_SUBSCRIPTION_DATA : ' + JSON.stringify(GET_SUBSCRIPTION_DATA));
                    
                    if(GET_SUBSCRIPTION_DATA !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        let loginData               = updateUserDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                        let roleData                = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                        let authorizedModuleData    = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                        let userAccountData         = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                        let userModuleRoleData      = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
                        let userUnitData            = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
                        let authorizedFunctionData  = AUTHORIZED_FUNCTIONS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                        let bcmStreeringCommittee   = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] || [];

                        const RECORDSET_DATA        = await formatRecordSetData(userId, loginData, roleData, authorizedModuleData, userAccountData, userModuleRoleData,userUnitData, authorizedFunctionData,bcmStreeringCommittee);
                        logger.log('info', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : RECORDSET_DATA : ' + JSON.stringify(RECORDSET_DATA));
                     
                        if(RECORDSET_DATA !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            logger.log('info', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Login successful. : Execution end. : Token : ' + token);
                            /**
                             * Sending susscessful response to UI
                             */
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                                message : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_SUCCESS,
                                result  : RECORDSET_DATA,
                                token   : token,
                                error   : {
                                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                                }
                            });
                        } else {
                            logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error on manipulating data of formatRecordSetData function.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                error   : {
                                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                                }
                            });

                        }
                    } else {
                        logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error on manipulating data of getSubscriptionData function.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                } else {
                    logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : Execution end. : Error on fetching user ID from database, User is not existing in DB. : User = ' + userName);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        error   : {
                            errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NOT_EXISTING_IN_DB
                        }
                    });
                }
                /**
                 * Fetching User Id from data base by user name : END
                 */
            } else if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO === API_RESPONSE_OBJ.success) {
                let errorMessageFromAuthApplication = API_RESPONSE_OBJ.error.errorMessage;
                let errorCode                       = API_RESPONSE_OBJ.error.errorCode;
                let resultFromAuth                  = API_RESPONSE_OBJ.result;
                logger.log('error', 'AuthBl : updateUserLogin : Execution end. : Error from Auth application module, for more details check Auth application module API log.: Error details : ' + errorMessageFromAuthApplication);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : resultFromAuth ? resultFromAuth : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : errorCode,
                        errorMessage    : errorMessageFromAuthApplication
                    }
                });
            } else {
                logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : Execution end. : Error details : Error from Auth application module, for more details check Auth application module API log.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                    }
                });
            }
        } catch (error) {
            logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                }
            });
        }
    }
    
    /**
     * This function will delete the token for particular user form data base   
     * @param {*} request 
     * @param {*} response 
     */
    async updateUserLogout(request, response) {
        logger.log('info', 'AuthBl : updateUserLogout : Execution started.');

        try {
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var token               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            // check request body should not be undefined
            if(typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) {
                logger.log('error', 'AuthBl : updateUserLogout : Execution end. : Request body has not found');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
        
            token               = request.body.token;        
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken
        
            //check request refreshedToken should not be undefined or null
            if(refreshedToken === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || refreshedToken === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){          
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Token is null or undefined in request body');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            
            // Pass refreshedToken (current token in DB after middleware), not original token, so logout procedure finds the row
            const DB_RESPONSE = await  authDbObject.updateUserLogout(userIdFromToken, userNameFromToken, refreshedToken, accountGUIDFromToken);                
            
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DB_RESPONSE){
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : DB Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : User logout from database successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_SUCCESS, DB_RESPONSE.recordset));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
        }
    }

    // API for fetching all the accounts for the dropdown.
    async getAllAccountsName(request, response) {
        logger.log('info', 'AuthBl : getAllAccountsName : Execution started.');

        try {

            const DB_RESPONSE = await authDbObject.getAllAccountsName();
            logger.log('info', ' : AuthBl : getAllAccountsName : ACCOUNTS_DB_RESPONSE : ' + JSON.stringify(DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DB_RESPONSE) {
                logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : DB Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                
                
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }

            logger.log('info', ' : AuthBl : getAllAccountsName : Execution end. : Accounts fetched from database successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, DB_RESPONSE.recordset));
        } catch (error) {
            logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
        }
    }  

    /**
     * This method will verify userdetails in case of forgot password
     * @param {*} request
     * @param {*} response
     */
    async verifyUserDetails(request,response){
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let authMaster                      = new Object();
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userFirstName                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userLastName                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userEmailID                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let isdefaultPassword               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
      
        try {
        logger.log('info', 'AuthManagement : verifyUserDetails : Execution started.');

        /**
        * Decrypting userID and OTP sent by UI by private key  : Start
        */
        cipherRequestData               = request.body.cipherData;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
        cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
        /**
        * Decrypting userID and OTP sent by UI by private key : END
        */
        
        /**
        * Separating userID and OTP by UI: START
        */
        separatorString                    = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
        cipherRequestDataStringArray       = cipherRequestDataInClearText.split(separatorString);
        authMaster.userName                = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        authMaster.firstName               = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        authMaster.lastName                = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        authMaster.emailId                 = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
        authMaster.newPassword             = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        authMaster.confirmPassword         = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        accountNameFromToken               = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
        
        /**
        * Separating userID and OTP sent by UI : END
        */

        userName = authMaster.userName;

        // Validating Input Request : Start
        if(authMaster.userName == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || authMaster.userName ==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
            logger.log('error', 'AuthManagement : verifyUserDetails : Execution end.: UserId is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NAME_NULL_EMPTY)); 
        }

        if(authMaster.firstName ==CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || authMaster.firstName ==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
            logger.log('error',  'AuthManagement : verifyUserDetails : Execution end.: firstName is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FIRST_NAME_NULL_EMPTY)); 
        }

        if(authMaster.lastName ==CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || authMaster.lastName ==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            logger.log('error', 'AuthManagement : verifyUserDetails : Execution end.: lastName is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LAST_NAME_NULL_EMPTY)); 
        }

        if(authMaster.emailId ==CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || authMaster.emailId ==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || validatorObject.isEmpty(authMaster.emailId.trim())){
            logger.log('error', 'AuthManagement : verifyUserDetails : Execution end.: emailId is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_NULL_EMPTY)); 
        }

        if(!validatorObject.isEmail(authMaster.emailId)) {
            logger.log('error', ' AuthManagement : verifyUserDetails : Execution end : EmailID is not a valid email id.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_INVALID));
        }

        if(authMaster.newPassword !== authMaster.confirmPassword) {
          logger.log('error', 'AuthManagement : verifyUserDetails : Execution end : New Password and Confirm Password should be same.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH)); 
        }

        if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || validatorObject.isEmpty(accountNameFromToken.trim())) {
            logger.log('error', 'AuthManagement : verifyUserDetails : Execution end : Account name/CRN Code is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_NAME_NULL_EMPTY)); 
        }

        // Validating Input Request : End

            
        // Fatching Account ID By Name - START

        let tenant_AccountGUID   = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);
        logger.log('info','AuthManagement : verifyUserDetails : tenant_AccountGUID : ' + JSON.stringify(tenant_AccountGUID));

        if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            logger.log('error', 'AuthManagement : verifyUserDetails : Execution end : Invalid Account name/CRN Code');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
        }

        tenant_AccountGUID       = tenant_AccountGUID.result.AccountGUID;// Fatching Account ID By Name - END           


        //subscription validation
        const USER_SUBSCRIPTION_MASTER_RESPONSE = await authDbObject.getUserSubscriptionDetails(userName, tenant_AccountGUID);

        if (USER_SUBSCRIPTION_MASTER_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_SUBSCRIPTION_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == 0) {
            logger.log('error', 'tenant Id : ' + accountName + ' : updateUserLogin : GetTenantAccountByNameDB : Execution end. : ' + USER_SUBSCRIPTION_MASTER_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));           
        }

        if (USER_SUBSCRIPTION_MASTER_RESPONSE.status === 1 && USER_SUBSCRIPTION_MASTER_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && USER_SUBSCRIPTION_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            const currdate = new Date();
            const subscriptionEndDateObj = new Date(USER_SUBSCRIPTION_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubscriptionEndDate);

            if (currdate > subscriptionEndDateObj) {
                logger.log('error', 'AuthManagement : updateUserLogin : Execution end. :  Subscription has been expired.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,     MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBSCRIPTION_ACCOUNT_EXPIRED));
            }

            if (USER_SUBSCRIPTION_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsActive_Accounts == false) {
                logger.log('error', 'AuthManagement : updateUserLogin : Execution end. :  Account has been disabled');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,     MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_HAS_BEEN_DISABLED));
            }
        }

        // fetching userdetails by username
        const USER_DETAILS = await authDbObject.getUserIdByUserName(userName, tenant_AccountGUID);
        logger.log('info','AuthManagement : verifyUserDetails : USER_DETAILS : ' + JSON.stringify(USER_DETAILS));

        if(USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == 0) {
            logger.log('error', 'tenant Id : '+ accountNameFromToken +' : verifyUserDetails : GetTenantAccountByNameDB : Execution end. : '+USER_DETAILS.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_DETAILS));           
        }

        if(USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsActive == false) {
            logger.log('error', 'AuthManagement : verifyUserDetails : Execution end. : Error on User has been disabled. Contact User Admin.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_HAS_BEEN_DISABLED));
        }
        if(USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE){
            logger.log('error', 'User ID : '+ userName +' : AuthManagement : verifyUserDetails : Execution end : '+USER_DETAILS.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_ID));
        }

        if(USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ){
            logger.log('error', 'User ID : '+ userName +' : AuthManagement : verifyUserDetails : Execution end : '+ USER_DETAILS.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_ID));
        }

        if(USER_DETAILS.recordset.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            logger.log('error', 'User ID : '+ userName +' : AuthManagement : verifyUserDetails : Execution end : '+ USER_DETAILS.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,   MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

       /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
        logger.log('info','AuthManagement : verifyUserDetails : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

        const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        const UserIDFromRes                   = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID  
        const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes,tenant_AccountGUID, {isAuthenticated, isValidated}, 'auth');
        
        if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
        }
        logger.log('info','AuthManagement : verifyUserDetails : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

        /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/
        userFirstName       = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FirstName;
        userLastName        = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastName;
        userEmailID         = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EmailID;
        userName            = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserName;
        isdefaultPassword   = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsDefaultPassword    
        
        //Checking if default password exist against the user
        if(isdefaultPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
            logger.log('error','UserName : '+ userName + 'AuthManagement : verifyUserDetails : Execution end.: default password is exist against the user.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : 'DefaultPasswordReset',
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DEFAULT_PASSWORD_EXIST
                }
           });
        }
        // verifying userName is not matched with DB
        if(userName.toLowerCase() != authMaster.userName.toLowerCase()) {
            logger.log('error','UserName : '+ userName + 'AuthManagement : verifyUserDetails : Execution end.: user name doesnot matches with DB details.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_ID));   
        }

        // verifying emailid is not matched with DB
        if(userEmailID.toLowerCase() != authMaster.emailId.toLowerCase()){
          logger.log('error','UserName : '+ userName + 'AuthManagement : verifyUserDetails : Execution end.: emailid  doesnot matches with DB details.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_DETAILS));  
        }

        // verifying userFirstName is not matched with DB
        if(userFirstName.toLowerCase() != authMaster.firstName.toLowerCase()){
            logger.log('error','UserName : '+ userName + 'AuthManagement : verifyUserDetails : Execution end.: first name doesnot matches with DB details.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_DETAILS));   
        }

        // verifying userlastName is not matched with DB
        if(userLastName.toLowerCase() != authMaster.lastName.toLowerCase()){
            logger.log('error','UserName : '+ userName + 'AuthManagement : verifyUserDetails : Execution end.: last name doesnot matches with DB details.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_DETAILS));  
        }

        let result = {
          userID : USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID
        }
        
        // check The previous passwords cannot be reused. START
        const CredentialHistoryRecords = APP_CONFIG.PASSWORD_CONFIG.CHECK_FOR_USER_CREDENTIAL_HISTORY;

        const GET_USER_CREDENTIAL_HISTORY = await utilityAppObject.GetUserCredentialHistory(result.userID, CredentialHistoryRecords, tenant_AccountGUID);
        logger.log('info', 'User Id : ' + userName + ' : AuthManagement : verifyUserDetails : GET_USER_CREDENTIAL_HISTORY : ' +JSON.stringify(GET_USER_CREDENTIAL_HISTORY));

        try {
            logger.log('info', 'User Id : ' + userName + ' : AuthManagement : verifyUserDetails : check password history START');
            if (GET_USER_CREDENTIAL_HISTORY.result.length !== 0) {
                for (let i = 0; i < GET_USER_CREDENTIAL_HISTORY.result.length; i++) {
                    if (await passwordUtilityObject.comparePassword(result.userID, authMaster.newPassword, GET_USER_CREDENTIAL_HISTORY.result[i].Password)) {
                        logger.log('error', 'User Id : ' + userName + ' : AuthManagement : verifyUserDetails : Execution end. : The previous passwords cannot be reused.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : 'LastPasswordReused',
                                errorMessage    : `The last ${CredentialHistoryRecords} previous passwords cannot be reused.`
                            }
                        });
                    }
                }  
            }

            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
            logger.log('info','AuthManagement : verifyUserDetails : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');
            
            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            const UserIDFromRes                   = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID  
            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes,tenant_AccountGUID, {isAuthenticated, isValidated}, 'auth' );
            
            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
            }
            logger.log('info','AuthManagement : verifyUserDetails : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/
           
            const otpCountAdd           = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            const UserIDFromUser        = USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID;
            const UPDATE_USER_MASTER    = await authDbObject.updateUserMasterForAuth(userName, UserIDFromUser, tenant_AccountGUID , {otpTryCount: otpCountAdd}, 'otp');


            if (UPDATE_USER_MASTER.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                logger.log('error', 'User Id : ' + UserIDFromUser + ' : AuthManagement : verifyUserDetails : Execution end. : Error on fetching user details from database, User is not existing in DB.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SYSTEM_ERROR));
            }

            logger.log('info', 'User Id : ' + userName + ' : AuthManagement : verifyUserDetails : verifyOTP : check password history END');
        } catch (error) {            
            logger.log('error', 'User Id : ' + userName + ' : AuthManagement : verifyUserDetails : Execution end. : get Credential History error:', error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
        }
          // check The previous passwords cannot be reused. END      

        logger.log('info','UserName : '+ userName + 'AuthManagement : verifyUserDetails : Execution End.: User Detials matched with DB details successfully.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.VALID_USER_DETAILS, result)); 

        } catch(error){
            logger.log('error','UserName: '+ userName + 'AuthManagement : verifyUserDetails : Execution end.:'+ error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_USER_ID));     
        }
    }

     /**
     * This method will send OTP on forgot password for particular user.
     * @param {*} request
     * @param {*} response
     */
    async sendOTP(request, response){
        let userID              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let ActionType              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userFirstName       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userEmailID         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let authMaster          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        authMaster              = request.body.authMaster;
        console.log('authMaster: ', authMaster);
        try{
            logger.log('info', 'AuthManagement : sendOTP : Execution started.');

            userID      = authMaster.userID;
            ActionType  = authMaster.Type;
        
            // Validating input parameter is null or undefined
            if(userID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : sendOTP : Execution end. : userID is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Fatching Account ID By Name - START
            let tenant_AccountGUID = await utilityAppObject.GetTenantAccountByName(authMaster.AccountName);

            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : sendOTP : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }
            tenant_AccountGUID = tenant_AccountGUID.result.AccountGUID;

            // Fatching Account ID By Name - END
            
            /**
             * Fetching and validating First Name and EmailID for the User : Start
            */
            const GET_USER_DETAILS = await authDbObject.getUserDetailsByUserId(userID, tenant_AccountGUID);
            logger.log('info', 'AuthManagement : sendOTP : GET_USER_DETAILS : ' +JSON.stringify(GET_USER_DETAILS));

            if(GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : get User details response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
         

            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
            if(APP_CONFIG.FUNCTIONALITY_CONFIG.IS_TWOFA) {
                if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                    if (GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].isAuthenticated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Name : ' + userName + ' : AuthManagement : sendOTP : Execution end : Unauthorized access.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS));
                    }
                }
                else {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : sendOTP : Execution end. : Error on fetching user ID from database, User is not existing in DB.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SYSTEM_ERROR));
                }
            }           
            
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *****************************/   
            userName      = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserName;
            userFirstName = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FirstName;
            userEmailID   = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EmailID;

            // Checking User Email ID is null or empty
            if(userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : email id  is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_NOT_REGISTERED));
            }
            /**
             * Fetching and validating First Name and EmailID for the User : End
            */
            // Fetching Active OTP of the user from the DataBase
            const GET_OTP_RESPONSE = await authDbObject.getUserOTP(userID, tenant_AccountGUID);
            logger.log('info', 'AuthManagement : sendOTP : GET_OTP_RESPONSE : ' +JSON.stringify(GET_OTP_RESPONSE));

            if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : get OTP response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }
            if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }
            if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }

            let currentTime               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let timeDiffInSeconds         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let resendTimeInSeconds       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let OTPCreatedDateTimeFromDB  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if(authMaster.isSendOtp == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                if (GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && 
                    GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    
                    // Case : Active OTP exist Against the User.
                    OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                    resendTimeInSeconds         = APP_CONFIG.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS;
                    timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);
                    // Case : User Requesting Resend OTP before the configured resend OTP Time
                    
                    if(timeDiffInSeconds < resendTimeInSeconds){ 
                        logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : User Requesting for Resend OTP before configured Time :'+ resendTimeInSeconds);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP_REQUEST_TIME + " within  " + `${timeDiffInSeconds}`+ " "  + MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SECONDS ));
                    } else {
                        // Case : User Requesting Resend OTP after the configured resend OTP Time.                  
                        // Generating and sending OTP to the user registered emailid
                        const SEND_NEW_OPT = await sendNewOTP(userID, userName, refreshedToken, userEmailID ,tenant_AccountGUID , ActionType, GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE],  APP_CONFIG.OTP_CONFIG.OTP_EXPIRATION_TIME_IN_MINUTES);
    
                        if(SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                            logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : SEND_NEW_OPT is null or undefined');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                        }                    
                        logger.log('info','User Id : ' + userID + 'AuthManagement : sendOTP : Execution end.: OTP sent Successfully.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SEND_OTP_SUCCESSFUL));
                    }
                
                }
            } else {
                //Case: No Active OTP exist Against the User.

                //Generating and sending OTP to the user registered emailid
                const SEND_NEW_OPT = await sendNewOTP(userID, userName, refreshedToken, userEmailID, tenant_AccountGUID, ActionType, GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE],  APP_CONFIG.OTP_CONFIG.OTP_EXPIRATION_TIME_IN_MINUTES);

                if(SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : SEND_NEW_OPT is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                }
                    
                logger.log('info','User Id : ' + userID + 'AuthManagement : sendOTP : Execution end.: OTP sent Successfully.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SEND_OTP_SUCCESSFUL));
            }
    
        } catch(error){
            logger.log('error', 'AuthManagement : sendOTP : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
        }              
    }

      /**
     * This method will send OTP on forgot password for particular user.
     * @param {*} request
     * @param {*} response
     */
    async sendOTPLogin(request, response){
        let userID              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let ActionType              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userFirstName       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userEmailID         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let authMaster          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        authMaster              = request.body.authMaster;
        try{
            logger.log('info', 'AuthManagement : sendOTPLogin : Execution started.');

            userName = authMaster.userName;
            ActionType = authMaster.Type;
        
            // Validating input parameter is null or undefined
            if(userName == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userName == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : sendOTPLogin : Execution end. : userName is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Fatching Account ID By Name - START
            let tenant_AccountGUID = await utilityAppObject.GetTenantAccountByName(authMaster.AccountName);
            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : sendOTPLogin : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }
            tenant_AccountGUID = tenant_AccountGUID.result.AccountGUID;

            // Fatching Account ID By Name - END
            
            /**
             * Fetching and validating First Name and EmailID for the User : Start
            */
           
           const GET_USER_DETAILS = await authDbObject.getUserIdByUserName(userName, tenant_AccountGUID);

            logger.log('info', 'AuthManagement : sendOTP : GET_USER_DETAILS : ' +JSON.stringify(GET_USER_DETAILS));

            if(GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userName + 'AuthManagement : sendOTP : Execution end. : get User details response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userName + 'AuthManagement : sendOTP : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userName + 'AuthManagement : sendOTP : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
            if(APP_CONFIG.FUNCTIONALITY_CONFIG.IS_TWOFA) {            
                if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                    if (GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].isAuthenticated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Name : ' + userName + ' : AuthManagement : sendOTP : Execution end : Unauthorized access.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS));
                    }
                }
                else {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : sendOTP : Execution end. : Error on fetching user ID from database, User is not existing in DB.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SYSTEM_ERROR));
                }
            }
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *****************************/   
            userName      = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserName;
            userFirstName = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FirstName;
            userEmailID   = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EmailID;
            userID         = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID;
            
            // Checking User Email ID is null or empty
            if(userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userName + 'AuthManagement : sendOTP : Execution end. : email id  is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_NOT_REGISTERED));
            }
            /**
             * Fetching and validating First Name and EmailID for the User : End
            */
            // Fetching Active OTP of the user from the DataBase
            const GET_OTP_RESPONSE = await authDbObject.getUserOTP(userID, tenant_AccountGUID);
            logger.log('info', 'AuthManagement : sendOTP : GET_OTP_RESPONSE : ' +JSON.stringify(GET_OTP_RESPONSE));

            if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : get OTP response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }
            if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }
            if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }

            let currentTime               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let timeDiffInSeconds         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let resendTimeInSeconds       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let OTPCreatedDateTimeFromDB  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if(authMaster.isSendOtp == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                if (GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && 
                    GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    
                    // Case : Active OTP exist Against the User.
                    OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                    resendTimeInSeconds         = APP_CONFIG.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS;
                    timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);
                    // Case : User Requesting Resend OTP before the configured resend OTP Time
                    if(timeDiffInSeconds < resendTimeInSeconds){ 
                        logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : User Requesting for Resend OTP before configured Time :'+ resendTimeInSeconds);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP_REQUEST_TIME + " within  " + `${timeDiffInSeconds}`+ " "  + MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SECONDS ));
                    } else {
                        // Case : User Requesting Resend OTP after the configured resend OTP Time.                  
                        // Generating and sending OTP to the user registered emailid
                        const SEND_NEW_OPT = await sendNewOTP(userID, userName, refreshedToken, userEmailID ,tenant_AccountGUID , ActionType, GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE],  APP_CONFIG.OTP_CONFIG.OTP_EXPIRATION_TIME_IN_MINUTES);
    
                        if(SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                            logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : SEND_NEW_OPT is null or undefined');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                        }                    
                        logger.log('info','User Id : ' + userID + 'AuthManagement : sendOTP : Execution end.: OTP sent Successfully.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SEND_OTP_SUCCESSFUL));
                    }                
                }
            } else {
                //Case: No Active OTP exist Against the User.

                //Generating and sending OTP to the user registered emailid
                const SEND_NEW_OPT = await sendNewOTP(userID, userName, refreshedToken, userEmailID, tenant_AccountGUID, ActionType, GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE],  APP_CONFIG.OTP_CONFIG.OTP_EXPIRATION_TIME_IN_MINUTES);

                if(SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTP : Execution end. : SEND_NEW_OPT is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                }
                    
                logger.log('info','User Id : ' + userID + 'AuthManagement : sendOTP : Execution end.: OTP sent Successfully.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SEND_OTP_SUCCESSFUL));
            }
    
        } catch(error){
            logger.log('error', 'AuthManagement : sendOTP : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
        }              
    }

    /**
     * This method will verify OTP and update password for the User on forgotPassword request.
     * @param {*} request
     * @param {*} response
     */
    async verifyOTPForForgotPassword(request, response){
        let userID                          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let NewPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let OTPFromUser                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;    
        let validatePassword                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;    

        try {

            logger.log('info', 'AuthManagement : verifyOTPForForgotPassword : Execution started.');

            /**
                * Decrypting userID and OTP sent by UI by private key  : Start
                */
            cipherRequestData               = request.body.data;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
            cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
            /**
                * Decrypting userID and OTP sent by UI by private key : END
                */
            
            /**
                * Separating userID and OTP by UI: START
                */
            separatorString                 = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
            cipherRequestDataStringArray    = cipherRequestDataInClearText.split(separatorString);
            userID                          = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            OTPFromUser                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            NewPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            accountNameFromToken            = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            validatePassword                = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            
            /**
            * Separating userID and OTP sent by UI : END
            */

            // Validating input parameter (UserID) is null or undefined
            if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || validatorObject.isEmpty(accountNameFromToken.trim())) {
                logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end : Account name/CRN Code is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_NAME_NULL_EMPTY)); 
            }
            if(userID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end. : userID is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            // Validating input parameter (OTP) is null or undefined
            if(OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end. : OTPFromUser is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));   
            }

            // Validating input parameter (password) is null or undefined
            if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end. : NewPassword is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));                
            }
            if(validatePassword == true || validatePassword == 'true') {
                // Validating password length
                if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH ){
                    logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end. : NewPassword should be minimum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                }

                if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH ){
                    logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                }

                // validation logic ko implement
                const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
                const isValid = regx.test(NewPassword);

                if (!isValid) {
                    logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end. : Enter Valid New Password');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));
                }
            }
            
            // Fatching Account ID By Name - START

            let tenant_AccountGUID = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);

            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }

            tenant_AccountGUID = tenant_AccountGUID.result.AccountGUID;
            // Fatching Account ID By Name - END

            const GET_USER_DETAILS  = await authDbObject.getUserDetailsByUserId(userID,tenant_AccountGUID);
            const UserData          = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : UserData : ' + JSON.stringify(UserData));

            userName                = UserData.UserName
            
            if (APP_CONFIG.OTP_CONFIG.WRONG_OTP_ATTEMPT_NUMBER > UserData.OTPTryCount) {
                // Fetching Active OTP of the user from the DataBase
                const GET_OTP_RESPONSE = await authDbObject.getUserOTP(userID,tenant_AccountGUID);
                logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : GET_OTP_RESPONSE : ' + JSON.stringify(GET_OTP_RESPONSE));

                if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : get OTP response is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }
                if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }
                if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }        

                if(GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                    // Case : Active OTP exist Against the User.
                    let currentTime                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let timeDiffInSeconds           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let expirationTimeInSeconds     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let OPTFromDB                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let OTPCreatedDateTimeFromDB    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let OTPMaster       = {
                        userID          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        OTP             : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        isActive        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                    };

                    OPTFromDB                   = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OTP;
                    OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                    
                    currentTime                 = new Date();
                    expirationTimeInSeconds     = APP_CONFIG.OTP_CONFIG.OTP_EXPIRATION_TIME_IN_MINUTES * CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS;
                    timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);

                    if(timeDiffInSeconds > expirationTimeInSeconds){
                        //Case : OTP is Expired
                        logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. OTP EXPIRED ');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_EXPIRED));
                    } else {
                        if(OTPFromUser == OPTFromDB) { //Case : OTP is Matched                            
                            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. OTP is matched Successfully/ ');
                            
                            //Making OTP inactive against the user 
                            OTPMaster.userID            = userID;
                            OTPMaster.OTP               = OTPFromUser;
                            OTPMaster.isActive          = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;

                            const ADD_OTP_RESPONSE = await authDbObject.addUserOTP(userID, OTPMaster, tenant_AccountGUID);
                            if(ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                                logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : get User details response is null or undefined');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            }
                            if (ADD_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : Error details :' + ADD_OTP_RESPONSE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            }
                            if (ADD_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : Error details : ' + ADD_OTP_RESPONSE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            }

                            /**
                                * Fetching and validating First Name and EmailID for the User : Start
                            */
                            const GET_USER_DETAILS = await authDbObject.getUserDetailsByUserId(userID, tenant_AccountGUID);
                            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));

                            if(GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForForgotPassword : Execution end. : get User details response is null or undefined');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                            }
                            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForForgotPassword : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                            }
                            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForForgotPassword : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                            }

                            let userDetails     = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                         
                            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : userDetails : ' + JSON.stringify(userDetails));

                            // Updating DB with new password 


                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
                            logger.log('info','AuthManagement : verifyOTPForForgotPassword : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                            const UserIDFromRes                   = userID  
                            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userDetails[0].UserName, UserIDFromRes, tenant_AccountGUID , {isAuthenticated,isValidated}, 'auth');
                            
                            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                            }
                            logger.log('info','AuthManagement : verifyOTPForForgotPassword : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');
                
                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/  

                            if(validatePassword == true || validatePassword == 'true') {
                                const UPDATE_NEW_PASSWORD = await updatePassword(userID, NewPassword, "SE-GRC Notification: Password updated", userDetails[0], tenant_AccountGUID);
                                logger.log('info','AuthManagement : verifyOTPForForgotPassword UPDATE_NEW_PASSWORD : '+JSON.stringify(UPDATE_NEW_PASSWORD));

                                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Execution end. : UPDATE_NEW_PASSWORD is null or undefined');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
                                }
                                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                                    logger.log('error', 'User Id : ' + userID + ' : AuthManagement : verifyOTPForForgotPassword : Execution end. : The previous passwords cannot be reused.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.USED_OLD_PWD,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.YOU_CANNOT_USED_OLD_PWD));
                                }
                                logger.log('info','User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : Data Updated in Database Successfully');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_RESET_SUCCESSFUL,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
                            } else {
                                logger.log('info','User Id : ' + userID + 'AuthManagement : verifyOTPForForgotPassword : OTP verified Successfully');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_VERIFIED,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
                            }
                    
                            
                        } else {
                            //Case : OTP is MisMatched                                       
                                            
                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
                            logger.log('info','AuthManagement : verifyOTPForForgotPassword : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                            const UserIDFromRes                   = userID  
                            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes, tenant_AccountGUID , {isAuthenticated,isValidated}, 'auth');
                            
                            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));    
                            }
                            logger.log('info','AuthManagement : verifyOTPForForgotPassword : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/  

                            const otpCountAdd = UserData.OTPTryCount + 1;
                            const UPDATE_USER_MASTER    = await authDbObject.updateUserMasterForAuth(userName, userID, tenant_AccountGUID , {otpTryCount: otpCountAdd}, 'otp')

                            if (UPDATE_USER_MASTER.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                logger.log('error', 'User Id : ' + userID + ' : AuthManagement : verifyOTPForForgotPassword : Execution end. : Error on fetching user details from database, User is not existing in DB.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                               
                            }

                            logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForForgotPassword : Execution end. Invalid OTP ');
                            // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                error   : {
                                    errorCode       : 'InvalidOTP',
                                    errorMessage    : 'Invalid OTP'
                                }
                            });
                        }
                    }
                    
                } else {
                    // Case : No Active OTP exist Against the User.
                    logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForForgotPassword : Execution end. No Active OTP Against the User.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }
                
            } else {
                logger.log('error', 'User Id : ' + userID + ' : AuthManagement : verifyOTPForForgotPassword : Execution end. : Maximum number off wrong attempt reached, redirecting to login page.');
                // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP));
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : refreshedToken,
                    error   : {
                        errorCode       : "maxnumber",
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP
                    }
                });
            }  
            
        } catch(error){
            logger.log('error', 'AuthManagement : verifyOTPForForgotPassword : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
        }
    }

    /**
     * This method will update password for the User on changePassword request.
     * @param {*} request
     * @param {*} response
     */
    async changePassword(request, response){
        var userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let oldPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let NewPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userID                          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let OTPFromUser                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let ConfirmNewPassword              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let SE_GRC_APP_URL                  = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];
        // refreshedToken                      = request.body.refreshedToken; 
        // userIdFromToken                     = request.body.userIdFromToken;
        // accountNameFromToken                = request.body.accountNameFromToken;                     
        try {
    
            logger.log('info', 'AuthManagement : changePassword : Execution started.');
        
            /**
             * Decrypting input Request sent by UI by private key  : Start
             */
            cipherRequestData               = request.body.data;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
            cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
            /**
             * Decrypting input Request sent by UI by private key : END
             */

            /**
             * Separating userIdFromToken and OTP by UI: START
            */              
            
            separatorString                 = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
            cipherRequestDataStringArray    = cipherRequestDataInClearText.split(separatorString);
            userName                        = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            oldPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            NewPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            ConfirmNewPassword              = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            accountNameFromToken            = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];

            if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || validatorObject.isEmpty(accountNameFromToken.trim())) {
                logger.log('error', 'AuthManagement : changePassword : Execution end : Account name/CRN Code is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_NAME_NULL_EMPTY)); 
            }

            let tenant_AccountGUID   = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);

            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : changePassword : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }
            logger.log('info','AuthManagement : changePassword : tenant_AccountGUID : ' + JSON.stringify(tenant_AccountGUID));
            tenant_AccountGUID       = tenant_AccountGUID.result.AccountGUID;     

            let GET_USER_DETAILS     = await utilityAppObject.GetUserIDByDetailsByUserName(userName, tenant_AccountGUID);
            logger.log('info','AuthManagement : changePassword : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));            

            const UserData          = GET_USER_DETAILS.result[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]; 
            logger.log('info', 'AuthManagement : changePassword :UserData :' + JSON.stringify(UserData));
                                    
            userID  = userIdFromToken = UserData.UserGUID 
            
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/

            let IS_2FA_Enable = APP_CONFIG.FUNCTIONALITY_CONFIG.IS_TWOFA;

            if (IS_2FA_Enable) {                
                if (UserData.isAuthenticated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && UserData.isValidated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : changePassword : Execution end : Unauthorized access.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS));
                } else {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : changePassword : Execution end. : Error on fetching user ID from database, User is not existing in DB.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SYSTEM_ERROR));
                }
            }
            if(APP_CONFIG.PASSWORD_CONFIG.REQUIRED_OTP_FOR_CHANGE_PASSWORD == true){
                //Case : otp verification on change password    
                OTPFromUser  = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
                /**
                 * Separating userIdFromToken and OTP sent by UI : END
                 */
                
                if (APP_CONFIG.OTP_CONFIG.WRONG_OTP_ATTEMPT_NUMBER > UserData.OTPTryCount) {            
                    
                    // Validating input parameter (OTP) is null or undefined
                    if(OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'AuthManagement : changePassword : Execution end. : OTPFromUser is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));  
                    }
                    
                    // Validating input parameter (userIdFromToken) is null or undefined
                    if(oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'AuthManagement : changePassword : Execution end. : oldPassword is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                    }

                    // Validating input parameter (password) is null or undefined
                    if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'AuthManagement : changePassword : Execution end. : NewPassword is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                    }
        
                    // Validating password length
                    if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH){
                        logger.log('error', 'AuthManagement : changePassword : Execution end. : NewPassword should be minimum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE + "(" +APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH + ")"));   
                    }

                    if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH ){
                        logger.log('error', 'AuthManagement : changePassword : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE + "(" + APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH + ")"));   
                    }

                    
                    // Validating input parameter (userIdFromToken) is null or undefined
                    if(ConfirmNewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ConfirmNewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                        logger.log( 'error', 'AuthManagement : changePassword : Execution end. : ConfirmNewPassword is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                    }            
                   
                     // to check the password policy
                    const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
                    const isValid = regx.test(NewPassword);

                    if (!isValid) {
                        logger.log('error', 'AuthManagement : changePassword : Execution end. : Enter Valid New Password');                    
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));   
                    } 

                    // Fetching Active OTP of the user from the DataBase
                    const GET_OTP_RESPONSE = await authDbObject.getUserOTP(userIdFromToken,tenant_AccountGUID);
                    logger.log('info', 'AuthManagement : changePassword : GET_OTP_RESPONSE : ' + JSON.stringify(GET_OTP_RESPONSE));
        
                    if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : get OTP response is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }
                    if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }
                    if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }        
        
                    if(GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                        // Case : Active OTP exist Against the User.
                        let currentTime                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let timeDiffInSeconds           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let expirationTimeInSeconds     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let OPTFromDB                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let OTPCreatedDateTimeFromDB    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let passwordFromDB              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let OTPMaster       = {
                            userID          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            OTP             : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            isActive        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                        };
        
                        OPTFromDB                   = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OTP;
                        OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                        
                        currentTime                 = new Date();
                        // timeDiffInSeconds           = Math.floor((currentTime - OTPCreatedDateTimeFromDB) / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS);
                        expirationTimeInSeconds     = APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.OTP_EXPIRATION_TIME_IN_MINUTES * CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS;
                        timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);
                        
                        if(timeDiffInSeconds > expirationTimeInSeconds){
                            //Case : OTP is Expired
                            logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. OTP EXPIRED ');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_EXPIRED));
                        } else {
                            if (OTPFromUser == OPTFromDB){
                                //Case : OTP is Matched
                                logger.log('info', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. OTP is matched Successfully/ ');
                                
                                //Making OTP inactive against the user 
                                OTPMaster.userID            = userIdFromToken;
                                OTPMaster.OTP               = OTPFromUser;
                                OTPMaster.isActive          = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;     
                            
                                /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
                                logger.log('info','AuthManagement : changePassword : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                                const isAuthenticated = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                                const isValidated     = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                                const UserIDFromRes   = UserData.UserGUID  
                                const UserName        = UserData.UserName  
                                
                                const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(UserName, UserIDFromRes, tenant_AccountGUID, {isAuthenticated,isValidated}, 'auth');                               
                                logger.log('info', 'AuthManagement : changePassword : UPDATE_USER_MASTER_FOR_AUTH : ' + JSON.stringify(UPDATE_USER_MASTER_FOR_AUTH));

                                if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                                }
                                logger.log('info','AuthManagement : changePassword : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                                passwordFromDB    = UserData.Password;

                                const authentication = await passwordUtilityObject.comparePassword(userIdFromToken, oldPassword, passwordFromDB);
                                logger.log('info', 'AuthManagement : changePassword : authentication : ' + JSON.stringify(authentication));

                                if(!authentication){
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePassword : Execution end. : old Password not matching with DB');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_PASSWORD));      
                                }

                                if(ConfirmNewPassword != NewPassword) {
                                    logger.log( 'error', 'AuthManagement : changePassword : Execution end. : Password mismatched');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH));   
                                }                               

                                const ADD_OTP_RESPONSE = await authDbObject.addUserOTP(userIdFromToken, OTPMaster, tenant_AccountGUID);
                                logger.log('info', 'AuthManagement : changePassword : ADD_OTP_RESPONSE : ' + JSON.stringify(ADD_OTP_RESPONSE));

                                if(ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : get User details response is null or undefined');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                                }
                                if (ADD_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : Error details :' + ADD_OTP_RESPONSE.errorMsg);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                                }
                                if (ADD_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : Error details : ' + ADD_OTP_RESPONSE.procedureMessage);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                                }
        
                                // Updating DB with new password 
                                const UPDATE_NEW_PASSWORD = await updatePassword(userIdFromToken, NewPassword,"SE-GRC Notification: Change Password",UserData,tenant_AccountGUID);
                                logger.log('info', 'AuthManagement : changePassword : UPDATE_NEW_PASSWORD : ' + JSON.stringify(UPDATE_NEW_PASSWORD));

                                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : UPDATE_NEW_PASSWORD is null or undefined');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
                                }
                                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePassword : Execution end. : The previous passwords cannot be reused.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.YOU_CANNOT_USED_OLD_PWD));
                                }
                                
                                await authDbObject.updateUserLogout(userIdFromToken, null, refreshedToken, tenant_AccountGUID, function(dbResponseObj){
                                    if(dbResponseObj.procedureSuccess === true){
                                        logger.log('info', 'User Id : '+ userIdFromToken +' : AuthManagement : changePassword : Execution end. : Logout successfully');
                                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_SUCCESS));

                                    } else {
                                        logger.log('error', 'User Id : '+ userIdFromToken +' : AuthManagement : changePassword : Execution end. : Logout operation failed');
                                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));                                    
                                       
                                    }
                                });
        
                                logger.log('info','User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Data Updated in Database Successfully');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_CHANGED_SUCCESSFUL,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

                            } else {
                                //Case : OTP is MisMatched
                                logger.log('info','AuthManagement : changePassword : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                                const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                                const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                                const UserIDFromRes                   = UserData.UserGUID  
                                const UserName                        = UserData.UserName  

                                const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(UserName, UserIDFromRes, tenant_AccountGUID, {isAuthenticated,isValidated}, 'auth');
                                
                                if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));                                    
                                }
                                logger.log('info','AuthManagement : changePassword : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                                /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/
                                
                                const otpCountAdd = UserData.OTPTryCount + 1;
                                
                                const UPDATE_USER_MASTER    = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes, tenant_AccountGUID , {otpTryCount: otpCountAdd}, 'otp');


                                if (UPDATE_USER_MASTER.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePassword : Execution end. : Error on fetching user details from database, User is not existing in DB.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));                                    
                                }

                                logger.log('error', 'User Id : ' + userIdFromToken + ': AuthManagement : changePassword : Execution end. Invalid OTP ');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    error   : {
                                        errorCode       : 'InvalidOTP',
                                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP
                                    }
                                });
                            }
                        }                        
                    } else {
                        // Case : No Active OTP exist Against the User.
                        logger.log('error', 'User Id : ' + userIdFromToken + ': AuthManagement : changePassword : Execution end. No Active OTP Against the User.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }         
                } else {
                    logger.log('error', 'User Id : ' + userID + ' : AuthManagement : changePassword : Execution end. : Maximum number off wrong attempt reached, redirecting to login page.');
                    // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP));                                    
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : refreshedToken,
                        error   : {
                            errorCode       : "maxnumber",
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP
                        }
                    });
                }
            } else {
                //Case : update password without OTP verification.
                let passwordFromDB  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                /**
                 * Separating userIdFromToken and OTP by UI: START
                 */              
                
                // Fetching Account ID By Name - END      
                /**
                 * Separating userIdFromToken and OTP sent by UI : END
                 */
                // Validating input parameter (userIdFromToken) is null or undefined                     
                    
                if(oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'AuthManagement : changePassword : Execution end. : oldPassword is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                }

                // Validating input parameter (password) is null or undefined
                if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'AuthManagement : changePassword : Execution end. : NewPassword is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                }
    
                // Validating password length
                if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH){
                    logger.log('error', 'AuthManagement : changePassword : Execution end. : NewPassword should be minimum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                }

                if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH ){
                    logger.log('error', 'AuthManagement : changePassword : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                }

                // Validating input parameter (userIdFromToken) is null or undefined
                if(ConfirmNewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ConfirmNewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                    logger.log( 'error', 'AuthManagement : changePassword : Execution end. : ConfirmNewPassword is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                }   
                // validation logic ko implement 
                const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
                const isValid = regx.test(NewPassword);

                if (!isValid) {
                    logger.log('error', 'AuthManagement : changePassword : Execution end. : Enter Valid New Password');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));   
                } 

                passwordFromDB      = UserData.Password;
                const authentication = await passwordUtilityObject.comparePassword(userIdFromToken, oldPassword, passwordFromDB);

                if(!authentication){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePassword : Execution end. : old password is not matching with Database ');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_PASSWORD));      
                }

                if(ConfirmNewPassword != NewPassword) {
                    logger.log('error', 'AuthManagement : changePassword : Execution end. : New password and confirm new password should is not matched ');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH)); 
                }
                // Updating DB with new password 
                const UPDATE_NEW_PASSWORD = await updatePassword(userIdFromToken, NewPassword, "SE-GRC Notification: Change Password", UserData, tenant_AccountGUID);

                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Execution end. : UPDATE_NEW_PASSWORD is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
                }
                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePassword : Execution end. : The previous passwords cannot be reused.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.YOU_CANNOT_USED_OLD_PWD));
                }

                logger.log('info','User Id : ' + userIdFromToken + 'AuthManagement : changePassword : Data Updated in Database Successfully');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_CHANGED_SUCCESSFUL,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
                
            }

        } catch(error){
            logger.log('error', 'AuthManagement : changePassword : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
        }
    }

    async getUserDetailsByName(request, response){
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let NewPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let ConfirmPassword                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let oldPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        try {
    
            logger.log('info', 'AuthManagement : getUserDetailsByName : Execution started.');
        
            /**
             * Decrypting input Request sent by UI by private key  : Start
             */
            cipherRequestData               = request.body.data;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
            cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
            /**
             * Decrypting input Request sent by UI by private key : END
             */
            separatorString                 = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
            cipherRequestDataStringArray    = cipherRequestDataInClearText.split(separatorString);
            userName                        = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            accountNameFromToken            = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            NewPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            oldPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            ConfirmPassword                 = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];

            if(userName == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userName == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : userName is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating input parameter (password) is null or undefined
            if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : accountNameFromToken is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

             // Validating input parameter (userIdFromToken) is null or undefined
             if(oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : oldPassword is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating input parameter (password) is null or undefined
            if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : NewPassword is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating password length
            if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : NewPassword should be minimum '+ APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
            }

            if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
            }

            if(ConfirmPassword != NewPassword) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : Password mis matched');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH));   
            }

            // validation logic ko implement
            const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
            const isValid = regx.test(NewPassword);

            if (!isValid) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end. : Enter Valid New Password');                    
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));   
            }

            let tenant_AccountGUID   = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);

            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }
            logger.log('info','AuthManagement : getUserDetailsByName : tenant_AccountGUID : ' + JSON.stringify(tenant_AccountGUID));
            tenant_AccountGUID       = tenant_AccountGUID.result.AccountGUID;     

            let GET_USER_DETAILS     = await utilityAppObject.GetUserIDByDetailsByUserName(userName, tenant_AccountGUID);
            logger.log('info','AuthManagement : getUserDetailsByName : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));            
            if(GET_USER_DETAILS.result.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            const UserData          = GET_USER_DETAILS.result[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]; 
            logger.log('info', 'AuthManagement : getUserDetailsByName :UserData :' + JSON.stringify(UserData));


            const CredentialHistoryRecords      = APP_CONFIG.PASSWORD_CONFIG.CHECK_FOR_USER_CREDENTIAL_HISTORY;
            const GET_USER_CREDENTIAL_HISTORY   = await utilityAppObject.GetUserCredentialHistory(UserData.UserGUID, CredentialHistoryRecords, tenant_AccountGUID);
            logger.log('info', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : getUserDetails : GET_USER_CREDENTIAL_HISTORY : '+ JSON.stringify(GET_USER_CREDENTIAL_HISTORY));

            try {
                logger.log('info', 'User Id : ' +  UserData.UserGUID  + ' : AuthManagement : getUserDetails : check password history START');
                if (GET_USER_CREDENTIAL_HISTORY.result.length !== 0) {
                    for (let i = 0; i < GET_USER_CREDENTIAL_HISTORY.result.length; i++) {
                        if (await passwordUtilityObject.comparePassword(UserData.UserGUID, NewPassword, GET_USER_CREDENTIAL_HISTORY.result[i].Password)) {
                            logger.log('info', 'User Id : ' + UserData.UserGUID + ` : AuthManagement : updatePassword : check password [${i}] : ` + CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse('PrevPasswordChangeError', 'Last -' + `${CredentialHistoryRecords} `+ ' passwords cannot be used.'));
                            
                        }
                    }
                } else {
                    logger.log('error', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : getUserDetails : check password history.');
                }
                logger.log('info', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : getUserDetails : check password history END');

            } catch (error) {
                logger.log('error', 'User Id : ' + userID + ' : AuthManagement : getUserDetails : Execution end. : get Credential History error:', error);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Error in checking the password history'));

            }

            if (!await passwordUtilityObject.comparePassword(UserData.UserGUID, oldPassword, GET_USER_DETAILS.result[0].Password)) {
                logger.log('info', 'User Id : ' + UserData.UserGUID + ` : AuthManagement : getUserDetails : Old password is not matched in Database ` + CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Old password is not matched in Database'));  
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OLD_PASSWORD_ERROR));                          
                // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                //     success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                //     message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                //     result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                //     token   : refreshedToken,
                //     error   : {
                //         errorCode       : 'InvalidPassword',
                //         errorMessage    : "Old password is not matched in Database"
                //     }
                // });
            }


            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            const UserIDFromRes                   = UserData.UserGUID
            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes, tenant_AccountGUID, {isAuthenticated, isValidated}, 'auth' );
                           
            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
            }
    
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, {userID: UserData.UserGUID}));
                                    
        } catch(error){
            logger.log('error', 'AuthManagement : getUserDetailsByName : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
        }
    }
    
    async getPasswordHistoryData(request, response){
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let NewPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let userNameFromToken               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let accountGUIDFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let ConfirmPassword                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let oldPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken;

        try {
    
            logger.log('info', 'AuthManagement : getPasswordHistoryData : Execution started.');
        
            /**
             * Decrypting input Request sent by UI by private key  : Start
             */
            cipherRequestData               = request.body.password.data;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
            cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
            /**
             * Decrypting input Request sent by UI by private key : END
             */

            separatorString                 = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
            cipherRequestDataStringArray    = cipherRequestDataInClearText.split(separatorString);
            userName                        = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            accountNameFromToken            = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            NewPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            ConfirmPassword                 = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            oldPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];

            if(userName == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userName == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : userName is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating input parameter (password) is null or undefined
            if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : accountNameFromToken is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating input parameter (userIdFromToken) is null or undefined
            if(oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : oldPassword is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating input parameter (password) is null or undefined
            if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : NewPassword is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            // Validating password length
            if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : NewPassword should be minimum '+ APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
            }

            if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
            }

            if(ConfirmPassword != NewPassword) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : Password mis matched');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH));   
            }

            // validation logic ko implement
            const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
            const isValid = regx.test(NewPassword);

            if (!isValid) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end. : Enter Valid New Password');                    
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));   
            }

            let tenant_AccountGUID   = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);

            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }
            logger.log('info','AuthManagement : getPasswordHistoryData : tenant_AccountGUID : ' + JSON.stringify(tenant_AccountGUID));
            tenant_AccountGUID       = tenant_AccountGUID.result.AccountGUID;     

            let GET_USER_DETAILS     = await utilityAppObject.GetUserIDByDetailsByUserName(userName, tenant_AccountGUID);
            logger.log('info','AuthManagement : getPasswordHistoryData : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));            
            if(GET_USER_DETAILS.result.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            const UserData          = GET_USER_DETAILS.result[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]; 
            logger.log('info', 'AuthManagement : getPasswordHistoryData :UserData :' + JSON.stringify(UserData));


            const CredentialHistoryRecords      = APP_CONFIG.PASSWORD_CONFIG.CHECK_FOR_USER_CREDENTIAL_HISTORY;
            const GET_USER_CREDENTIAL_HISTORY   = await utilityAppObject.GetUserCredentialHistory(UserData.UserGUID, CredentialHistoryRecords, tenant_AccountGUID);
            logger.log('info', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : updatePassword : GET_USER_CREDENTIAL_HISTORY : '+ JSON.stringify(GET_USER_CREDENTIAL_HISTORY));

            try {
                logger.log('info', 'User Id : ' +  UserData.UserGUID  + ' : AuthManagement : updatePassword : check password history START');
                if (GET_USER_CREDENTIAL_HISTORY.result.length !== 0) {
                    for (let i = 0; i < GET_USER_CREDENTIAL_HISTORY.result.length; i++) {
                        if (await passwordUtilityObject.comparePassword(UserData.UserGUID, NewPassword, GET_USER_CREDENTIAL_HISTORY.result[i].Password)) {
                            logger.log('info', 'User Id : ' + UserData.UserGUID + ` : AuthManagement : getPasswordHistoryData : check password [${i}] : ` + CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Last -' + `${CredentialHistoryRecords} `+ ' passwords cannot be used.'));                            
                        }
                    }
                } else {
                    logger.log('error', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : getPasswordHistoryData : check password history.');
                }
                logger.log('info', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : getPasswordHistoryData : check password history END');

            } catch (error) {
                logger.log('error', 'User Id : ' + UserData.UserGUID + ' : AuthManagement : getPasswordHistoryData : Execution end. : get Credential History error:', error);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Error in checking the password history'));

            }

            if (!await passwordUtilityObject.comparePassword(UserData.UserGUID, oldPassword, GET_USER_DETAILS.result[0].Password)) {
                logger.log('info', 'User Id : ' + UserData.UserGUID + ` : AuthManagement : getPasswordHistoryData : Old password is not matched in Database ` + CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Old password is not matched in Database'));  
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OLD_PASSWORD_ERROR));                          
                // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                //     success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                //     message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                //     result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                //     token   : refreshedToken,
                //     error   : {
                //         errorCode       : 'InvalidPassword',
                //         errorMessage    : "Old password is not matched in Database"
                //     }
                // });
            }

            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            const UserIDFromRes                   = UserData.UserGUID
            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes, tenant_AccountGUID, {isAuthenticated, isValidated}, 'auth' );
                           
            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
            }
    
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, {userID: UserData.UserGUID}));
                                    
        } catch(error){
            logger.log('error', 'AuthManagement : getPasswordHistoryData : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL));
        }
    }
     /**
     * This method will send OTP on forgot password for particular user.
     * @param {*} request
     * @param {*} response
     */
    async sendOTPForChangePassword(request, response){
        let userID                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userFirstName           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userEmailID             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let authMaster              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let tenant_AccountGUID      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        accountGUIDFromToken    = request.body.accountGUIDFromToken;

        authMaster              = request.body.authMaster;
        try{
            logger.log('info', 'AuthManagement : sendOTPForChangePassword : Execution started.');

            userID = authMaster.userID;
        
            // Validating input parameter is null or undefined
            if(userID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : sendOTPForChangePassword : Execution end. : userID is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            tenant_AccountGUID = accountGUIDFromToken;

            /**
             * Fetching and validating First Name and EmailID for the User : Start
            */
            const GET_USER_DETAILS = await authDbObject.getUserDetailsByUserId(userID, tenant_AccountGUID);
            logger.log('info', 'AuthManagement : sendOTPForChangePassword : GET_USER_DETAILS : ' +JSON.stringify(GET_USER_DETAILS));

            if(GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : get User details response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
            }
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
            if(APP_CONFIG.FUNCTIONALITY_CONFIG.IS_TWOFA) {
                if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                    if (GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].isAuthenticated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Name : ' + userName + ' : AuthManagement : sendOTPForChangePassword : Execution end : Unauthorized access.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS));
                    }
                }
                else {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : sendOTPForChangePassword : Execution end. : Error on fetching user ID from database, User is not existing in DB.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SYSTEM_ERROR));
                }
            }
            
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *****************************/   
            userName      = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserName;
            userFirstName = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FirstName;
            userEmailID   = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EmailID;

            // Checking User Email ID is null or empty
            if(userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : email id  is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_INVALID));
            }
            /**
             * Fetching and validating First Name and EmailID for the User : End
            */
            // Fetching Active OTP of the user from the DataBase
            const GET_OTP_RESPONSE = await authDbObject.getUserOTP(userID, tenant_AccountGUID);
            logger.log('info', 'AuthManagement : sendOTPForChangePassword : GET_OTP_RESPONSE : ' +JSON.stringify(GET_OTP_RESPONSE));

            if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : get OTP response is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }
            if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }
            if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESEND_OTP));
            }

            let currentTime               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let timeDiffInSeconds         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let resendTimeInSeconds       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let OTPCreatedDateTimeFromDB  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if(authMaster.isSendOtp == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                if (GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && 
                    GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].IsActive == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    
                    // Case : Active OTP exist Against the User.
                    OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                    resendTimeInSeconds         = APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS;
                    timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);
                    
                    // Case : User Requesting Resend OTP before the configured resend OTP Time
                    if(timeDiffInSeconds < resendTimeInSeconds){ 
                        logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : User Requesting for Resend OTP before configured Time :'+ resendTimeInSeconds);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP_REQUEST_TIME + " within  " + `${timeDiffInSeconds}`+ " "  + MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SECONDS ));
                    } else {
                        // Case : User Requesting Resend OTP after the configured resend OTP Time.                  
                        // Generating and sending OTP to the user registered emailid
                        const SEND_NEW_OPT = await sendNewOTP(userID, userName, refreshedToken, userEmailID ,tenant_AccountGUID , 'ChangePWD', GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE],  APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.OTP_EXPIRATION_TIME_IN_MINUTES);
    
                        if(SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                            logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : SEND_NEW_OPT is null or undefined');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                        }                    
                        logger.log('info','User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end.: OTP sent Successfully.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SEND_OTP_SUCCESSFUL));
                    }                
                } 
            } else {
                //Case: No Active OTP exist Against the User.

                //Generating and sending OTP to the user registered emailid
                const SEND_NEW_OPT = await sendNewOTP(userID, userName, refreshedToken, userEmailID, tenant_AccountGUID, 'ChangePWD', GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE], APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.OTP_EXPIRATION_TIME_IN_MINUTES);

                if(SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SEND_NEW_OPT == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end. : SEND_NEW_OPT is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                }
                    
                logger.log('info','User Id : ' + userID + 'AuthManagement : sendOTPForChangePassword : Execution end.: OTP sent Successfully.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SEND_OTP_SUCCESSFUL));
            }
    
        } catch(error){
            logger.log('error', 'AuthManagement : sendOTPForChangePassword : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
        }              
    }

    /**
     * This method will update password for the User on changePasswordUser request.
     * @param {*} request
     * @param {*} response
     */
    async changePasswordUser(request, response){
        var userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let oldPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let NewPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userID                          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let OTPFromUser                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let ConfirmNewPassword              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let tenant_AccountGUID              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let SE_GRC_APP_URL                  = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];

        refreshedToken                      = request.body.refreshedToken; 
        userIdFromToken                     = request.body.userIdFromToken;
        accountGUIDFromToken                = request.body.accountGUIDFromToken;                     
        try {
    
            logger.log('info', 'AuthManagement : changePasswordUser : Execution started.');
        
            /**
             * Decrypting input Request sent by UI by private key  : Start
             */
            cipherRequestData               = request.body.password.data;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
            cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
            /**
             * Decrypting input Request sent by UI by private key : END
             */

            /**
             * Separating userIdFromToken and OTP by UI: START
            */              
            
            separatorString                 = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
            cipherRequestDataStringArray    = cipherRequestDataInClearText.split(separatorString);
            userName                        = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            oldPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            NewPassword                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            ConfirmNewPassword              = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            accountNameFromToken            = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            
            if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || validatorObject.isEmpty(accountNameFromToken.trim())) {
                logger.log('error', 'AuthManagement : changePasswordUser : Execution end : Account name/CRN Code is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_NAME_NULL_EMPTY)); 
            }

            tenant_AccountGUID   = accountGUIDFromToken;  

            let GET_USER_DETAILS     = await utilityAppObject.GetUserIDByDetailsByUserName(userName, tenant_AccountGUID);
            logger.log('info','AuthManagement : changePasswordUser : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));            

            const UserData          = GET_USER_DETAILS.result[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]; 
            logger.log('info', 'AuthManagement : changePasswordUser :UserData :' + JSON.stringify(UserData));
                                    
            userID  = userIdFromToken = UserData.UserGUID    

            
            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/

            let IS_2FA_Enable = APP_CONFIG.FUNCTIONALITY_CONFIG.IS_TWOFA;

            if (IS_2FA_Enable) {                
                if (UserData.isAuthenticated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && UserData.isValidated == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : changePasswordUser : Execution end : Unauthorized access.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS));
                } else {
                    logger.log('error', 'User Name : ' + userName + ' : AuthManagement : changePasswordUser : Execution end. : Error on fetching user ID from database, User is not existing in DB.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SYSTEM_ERROR));
                }
            }
            if(APP_CONFIG.PASSWORD_CONFIG.REQUIRED_OTP_FOR_CHANGE_PASSWORD == true){
                //Case : otp verification on change password    
                OTPFromUser  = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
                /**
                 * Separating userIdFromToken and OTP sent by UI : END
                 */
                if (APP_CONFIG.OTP_CONFIG.WRONG_OTP_ATTEMPT_NUMBER > UserData.TryCount) {            
                    
                    // Validating input parameter (OTP) is null or undefined
                    if(OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : OTPFromUser is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));  
                    }
                    
                    // Validating input parameter (userIdFromToken) is null or undefined
                    if(oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : oldPassword is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                    }

                    // Validating input parameter (password) is null or undefined
                    if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : NewPassword is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                    }
        
                    // Validating password length
                    if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH){
                        logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : NewPassword should be minimum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                    }

                    if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH ){
                        logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                    }

                    // validation logic ko implement
                    const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
                    const isValid = regx.test(NewPassword);

                    if (!isValid) {
                        logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : Enter Valid New Password');                    
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));   
                    } 

                    // Fetching Active OTP of the user from the DataBase
                    const GET_OTP_RESPONSE = await authDbObject.getUserOTP(userIdFromToken,tenant_AccountGUID);
                    logger.log('info', 'AuthManagement : changePasswordUser : GET_OTP_RESPONSE : ' + JSON.stringify(GET_OTP_RESPONSE));
        
                    if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                        logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : get OTP response is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }
                    if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }
                    if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }        
        
                    if(GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                        // Case : Active OTP exist Against the User.
                        let currentTime                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let timeDiffInSeconds           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let expirationTimeInSeconds     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let OPTFromDB                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let OTPCreatedDateTimeFromDB    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let passwordFromDB              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        let OTPMaster       = {
                            userID          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            OTP             : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            isActive        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                        };
        
                        OPTFromDB                   = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OTP;
                        OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                        
                        currentTime                 = new Date();
                        // timeDiffInSeconds           = Math.floor((currentTime - OTPCreatedDateTimeFromDB) / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS);
                        expirationTimeInSeconds     = APP_CONFIG.OTP_CONFIG_FOR_CHANGE_PASSWORD.OTP_EXPIRATION_TIME_IN_MINUTES * CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS;
                        timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);
                        if(timeDiffInSeconds > expirationTimeInSeconds){
                            //Case : OTP is Expired
                            logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. OTP EXPIRED ');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_EXPIRED));
                        } else {
                            if (OTPFromUser == OPTFromDB){
                                //Case : OTP is Matched
                                logger.log('info', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. OTP is matched Successfully/ ');
                                
                                //Making OTP inactive against the user 
                                OTPMaster.userID            = userIdFromToken;
                                OTPMaster.OTP               = OTPFromUser;
                                OTPMaster.isActive          = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;     
                            
                                /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
                                logger.log('info','AuthManagement : changePasswordUser : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                                const isAuthenticated = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                                const isValidated     = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                                const UserIDFromRes   = UserData.UserGUID  
                                const UserName        = UserData.UserName  
                                
                                const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(UserName, UserIDFromRes, tenant_AccountGUID, {isAuthenticated,isValidated}, 'auth');                               
                                logger.log('info', 'AuthManagement : changePasswordUser : UPDATE_USER_MASTER_FOR_AUTH : ' + JSON.stringify(UPDATE_USER_MASTER_FOR_AUTH));

                                if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                                }
                                logger.log('info','AuthManagement : changePasswordUser : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                                passwordFromDB    = UserData.Password;

                                const authentication = await passwordUtilityObject.comparePassword(userIdFromToken, oldPassword, passwordFromDB);
                                logger.log('info', 'AuthManagement : changePasswordUser : authentication : ' + JSON.stringify(authentication));

                                if(!authentication){
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePasswordUser : Execution end. : old Password not matching with DB');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_PASSWORD));      
                                }

                                if(ConfirmNewPassword != NewPassword) {
                                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : New password and confirm new password should be same');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH )); 
                                }

                                const ADD_OTP_RESPONSE = await authDbObject.addUserOTP(userIdFromToken,OTPMaster, tenant_AccountGUID);
                                logger.log('info', 'AuthManagement : changePasswordUser : ADD_OTP_RESPONSE : ' + JSON.stringify(ADD_OTP_RESPONSE));

                                if(ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : get User details response is null or undefined');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                                }
                                if (ADD_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : Error details :' + ADD_OTP_RESPONSE.errorMsg);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                                }
                                if (ADD_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : Error details : ' + ADD_OTP_RESPONSE.procedureMessage);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                                }
        
                                // Updating DB with new password 
                                const UPDATE_NEW_PASSWORD = await updatePassword(userIdFromToken, NewPassword,"SE-GRC Notification: Change Password",UserData,tenant_AccountGUID);
                                logger.log('info', 'AuthManagement : changePasswordUser : UPDATE_NEW_PASSWORD : ' + JSON.stringify(UPDATE_NEW_PASSWORD));

                                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : UPDATE_NEW_PASSWORD is null or undefined');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
                                }
                                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePasswordUser : Execution end. : The previous passwords cannot be reused.');      
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.YOU_CANNOT_USED_OLD_PWD));
                                }
                                
                                await authDbObject.updateUserLogout(userIdFromToken, null, refreshedToken, tenant_AccountGUID, function(dbResponseObj){
                                    if(dbResponseObj.procedureSuccess === true){
                                        logger.log('info', 'User Id : '+ userIdFromToken +' : AuthManagement : changePasswordUser : Execution end. : Logout successfully');
                                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_SUCCESS, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

                                    } else {
                                        logger.log('error', 'User Id : '+ userIdFromToken +' : AuthManagement : changePasswordUser : Execution end. : Logout operation failed');
                                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));                                    
                                       
                                    }
                                });
        
                                logger.log('info','User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Data Updated in Database Successfully');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_CHANGED_SUCCESSFUL, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

                            } else {
                                //Case : OTP is MisMatched
                                logger.log('info','AuthManagement : changePasswordUser : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                                const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                                const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                                const UserIDFromRes                   = UserData.UserID  
                                const UserName                        = UserData.UserName  

                                const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(UserName, UserIDFromRes, tenant_AccountGUID, {isAuthenticated,isValidated}, 'auth');
                                
                                if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));                                    
                                }
                                logger.log('info','AuthManagement : changePasswordUser : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                                /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/
                                const otpCountAdd = UserData.OTPTryCount + 1;
                                const UPDATE_USER_MASTER    = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes, tenant_AccountGUID , {otpTryCount: otpCountAdd}, 'otp');


                                if (UPDATE_USER_MASTER.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePasswordUser : Execution end. : Error on fetching user details from database, User is not existing in DB.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));                                    
                                }

                                logger.log('error', 'User Id : ' + userIdFromToken + ': AuthManagement : changePasswordUser : Execution end. Invalid OTP ');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    token   : refreshedToken,
                                    error   : {
                                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP
                                    }
                                });
                            }
                        }                        
                    } else {
                        // Case : No Active OTP exist Against the User.
                        logger.log('error', 'User Id : ' + userIdFromToken + ': AuthManagement : changePasswordUser : Execution end. No Active OTP Against the User.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                    }         
                } else {
                    logger.log('error', 'User Id : ' + userID + ' : AuthManagement : changePasswordUser : Execution end. : Maximum number off wrong attempt reached, redirecting to login page.');
                    // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP));                                    
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : refreshedToken,
                        error   : {
                            errorCode       : "maxnumber",
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP
                        }
                    });
                }
            } else {
                //Case : update password without OTP verification.
                let passwordFromDB  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                /**
                 * Separating userIdFromToken and OTP by UI: START
                 */              
                
                // Fetching Account ID By Name - END      
                /**
                 * Separating userIdFromToken and OTP sent by UI : END
                 */
                // Validating input parameter (userIdFromToken) is null or undefined
              
                if(oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || oldPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : oldPassword is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                }

                // Validating input parameter (password) is null or undefined
                if(NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || NewPassword == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : NewPassword is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
                }
    
                // Validating password length
                if(NewPassword.length < APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH){
                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : NewPassword should be minimum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MIN_LENGTH+' characters');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                }

                if(NewPassword.length > APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH ){
                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : NewPassword should be miximum '+APP_CONFIG.CHANGE_PASSWORD_CONFIG.MAX_LENGTH+' characters');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_LENGTH_NOT_IN_RANGE));   
                }

                // validation logic ko implement 
                const regx = new RegExp(APP_CONFIG.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE);
                const isValid = regx.test(NewPassword);

                if (!isValid) {
                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : Enter Valid New Password');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ENTER_VALID_NEW_PASSWORD));   
                } 

                passwordFromDB      = UserData.Password;
                const authentication = await passwordUtilityObject.comparePassword(userIdFromToken, oldPassword, passwordFromDB);

                if(!authentication){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePasswordUser : Execution end. : old password is not matching with Database ');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_PASSWORD));      
                }

                if(ConfirmNewPassword != NewPassword) {
                    logger.log('error', 'AuthManagement : changePasswordUser : Execution end. : New password and confirm new password should be same');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DOES_NOT_MATCH )); 
                }
                // Updating DB with new password 
                const UPDATE_NEW_PASSWORD = await updatePassword(userIdFromToken, NewPassword, "SE-GRC Notification: Change Password", UserData, tenant_AccountGUID);

                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Execution end. : UPDATE_NEW_PASSWORD is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
                }
                if(UPDATE_NEW_PASSWORD == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE){
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : AuthManagement : changePasswordUser : Execution end. : The previous passwords cannot be reused.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.USED_OLD_PWD,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.YOU_CANNOT_USED_OLD_PWD));
                }
                logger.log('info','User Id : ' + userIdFromToken + 'AuthManagement : changePasswordUser : Data Updated in Database Successfully');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_CHANGED_SUCCESSFUL,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));  
            }
        } catch(error){
            logger.log('error', 'AuthManagement : changePasswordUser : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
        }
    }

    /**
     * This method will verify OTP and update password for the User on forgotPassword request.
     * @param {*} request
     * @param {*} response
     */
    async verifyOTPForLogin(request, response){
        let userID                          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let NewPassword                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let OTPFromUser                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;   
        let userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
        let accountGUIDFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  

        refreshedToken                      = request.body.refreshedToken; 
        userIdFromToken                     = request.body.userIdFromToken;
        accountGUIDFromToken                = request.body.accountGUIDFromToken;       

        try {

            logger.log('info', 'AuthManagement : verifyOTPForLogin : Execution started. 2');

            /**
                * Decrypting userID and OTP sent by UI by private key  : Start
                */
            cipherRequestData               = request.body.OTP.data;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
            cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
            /**
                * Decrypting userID and OTP sent by UI by private key : END
                */
            
            /**
                * Separating userID and OTP by UI: START
                */
            separatorString                 = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
            cipherRequestDataStringArray    = cipherRequestDataInClearText.split(separatorString);
            userName                        = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            OTPFromUser                     = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            accountNameFromToken            = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];

            /**
            * Separating userID and OTP sent by UI : END
            */


            // Validating input parameter (UserID) is null or undefined
            if(userName == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userName == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : verifyOTPForLogin : Execution end. : userName is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            // Validating input parameter (OTP) is null or undefined
            if(OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || OTPFromUser == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : verifyOTPForLogin : Execution end. : OTPFromUser is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));   
            }
            if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                logger.log('error', 'AuthManagement : verifyOTPForLogin : Execution end. : accountNameFromToken is null or undefined');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));   
            }    
          
            let tenant_AccountGUID = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);
            if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'AuthManagement : verifyOTPForLogin : Execution end : Invalid Account name/CRN Code');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
            }
            tenant_AccountGUID = tenant_AccountGUID.result.AccountGUID;

            let GET_USER_DETAILS     = await utilityAppObject.GetUserIDByDetailsByUserName(userName, tenant_AccountGUID);
            logger.log('info','AuthManagement : changePassword : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));            


            // Fatching Account ID By Name - END

            const UserData  = GET_USER_DETAILS.result[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            userID = UserData.UserGUID
            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : UserData : ' + JSON.stringify(UserData));

            if (APP_CONFIG.OTP_CONFIG.WRONG_OTP_ATTEMPT_NUMBER > UserData.OTPTryCount) {
                // Fetching Active OTP of the user from the DataBase
                const GET_OTP_RESPONSE = await authDbObject.getUserOTP(UserData.UserGUID,tenant_AccountGUID);
                logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : GET_OTP_RESPONSE : ' + JSON.stringify(GET_OTP_RESPONSE));

                if(GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. : get OTP response is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }
                if (GET_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. : Error details :' + GET_OTP_RESPONSE.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }
                if (GET_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. : Error details : ' + GET_OTP_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,  MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }        

                if(GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                    // Case : Active OTP exist Against the User.
                    let currentTime                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let timeDiffInSeconds           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let expirationTimeInSeconds     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let OPTFromDB                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let OTPCreatedDateTimeFromDB    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let OTPMaster       = {
                        userID          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        OTP             : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        isActive        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                    };

                    OPTFromDB                   = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OTP;
                    OTPCreatedDateTimeFromDB    = GET_OTP_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastUpdatedDate;
                    
                    currentTime                 = new Date();
                    expirationTimeInSeconds     = APP_CONFIG.OTP_CONFIG.OTP_EXPIRATION_TIME_IN_MINUTES * CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS;
                    timeDiffInSeconds           = await validateDateTimeDiff(OTPCreatedDateTimeFromDB);

                    if(timeDiffInSeconds > expirationTimeInSeconds){
                        //Case : OTP is Expired
                        logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. OTP EXPIRED ');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_EXPIRED));
                    } else {
                        if(OTPFromUser == OPTFromDB) { //Case : OTP is Matched                            
                            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. OTP is matched Successfully/ ');
                            
                            //Making OTP inactive against the user 
                            OTPMaster.userID            = userID;
                            OTPMaster.OTP               = OTPFromUser;
                            OTPMaster.isActive          = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;

                            const ADD_OTP_RESPONSE = await authDbObject.addUserOTP(userID, OTPMaster, tenant_AccountGUID);
                            if(ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. : get User details response is null or undefined');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            }
                            if (ADD_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. : Error details :' + ADD_OTP_RESPONSE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            }
                            if (ADD_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Execution end. : Error details : ' + ADD_OTP_RESPONSE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            }

                            /**
                                * Fetching and validating First Name and EmailID for the User : Start
                            */
                            const GET_USER_DETAILS = await authDbObject.getUserDetailsByUserId(userID, tenant_AccountGUID);
                            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : GET_USER_DETAILS : ' + JSON.stringify(GET_USER_DETAILS));

                            if(GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || GET_USER_DETAILS == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                                logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForLogin : Execution end. : get User details response is null or undefined');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                            }
                            if (GET_USER_DETAILS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForLogin : Execution end. : Error details :' + GET_USER_DETAILS.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                            }
                            if (GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForLogin : Execution end. : Error details : ' + GET_USER_DETAILS.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
                            }

                            let userDetails     = GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                         
                            logger.log('info', 'User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : userDetails : ' + JSON.stringify(userDetails));

                            // Updating DB with new password 


                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
                            logger.log('info','AuthManagement : verifyOTPForLogin : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                            const UserIDFromRes                   = userID  
                            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userDetails[0].UserName, UserIDFromRes, tenant_AccountGUID , {isAuthenticated,isValidated}, 'auth');
                            logger.log('info','AuthManagement : verifyOTPForLogin : UPDATE_USER_MASTER_FOR_AUTH : ' + JSON.stringify(UPDATE_USER_MASTER_FOR_AUTH));
                            
                            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                            }
                            logger.log('info','AuthManagement : verifyOTPForLogin : 1 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');
                
                            logger.log('info','User Id : ' + userID + 'AuthManagement : verifyOTPForLogin : Data Updated in Database Successfully');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_VERIFIED, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
                            
                        } else {
                            //Case : OTP is MisMatched                                       
                                            
                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - START *****************************/
                            logger.log('info','AuthManagement : verifyOTPForLogin : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - START');

                            const isAuthenticated                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                            const isValidated                     = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                            const UserIDFromRes                   = userID  
                            const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, UserIDFromRes, tenant_AccountGUID , {isAuthenticated,isValidated}, 'auth');
                            logger.log('info','AuthManagement : verifyOTPForLogin : UPDATE_USER_MASTER_FOR_AUTH : ' + JSON.stringify(UPDATE_USER_MASTER_FOR_AUTH));
                            
                            if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));    
                            }
                            logger.log('info','AuthManagement : verifyOTPForLogin : 2 In userMaster Table isAuthenticated or isValidated update value as ZERO - END');

                            /* In userMaster Table isAuthenticated or isValidated update value as ZERO - END *************************************/  

                            const otpCountAdd = UserData.OTPTryCount + 1;
                            const UPDATE_USER_MASTER    = await authDbObject.updateUserMasterForAuth(userName, userID, tenant_AccountGUID , {otpTryCount: otpCountAdd}, 'otp')

                            if (UPDATE_USER_MASTER.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                logger.log('error', 'User Id : ' + userID + ' : AuthManagement : verifyOTPForLogin : Execution end. : Error on fetching user details from database, User is not existing in DB.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                            }

                            logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForLogin : Execution end. Invalid OTP ');
                            // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                token   : refreshedToken,
                                error   : {
                                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP
                                }
                            });
                        }
                    }
                    
                } else {
                    // Case : No Active OTP exist Against the User.
                    logger.log('error', 'User Id : ' + userID + ': AuthManagement : verifyOTPForLogin : Execution end. No Active OTP Against the User.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
                }
                
            } else {
                logger.log('error', 'User Id : ' + userID + ' : AuthManagement : verifyOTPForLogin : Execution end. : Maximum number off wrong attempt reached, redirecting to login page.');
                // return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP));
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : refreshedToken,
                    error   : {
                        errorCode       : "maxnumber",
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.OTP_LOCKUP
                    }
                });
            }  
            
        } catch(error){
            logger.log('error', 'AuthManagement : verifyOTPForLogin : Execution end : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_OTP));
        }
    }

    /**
     * This method will verify userdetails in case of forgot password
     * @param {*} request
     * @param {*} response
     */
    async verifyAccountDetails(request,response){
        let refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let authMaster                      = new Object();
        let userName                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataInClearText    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let separatorString                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let cipherRequestDataStringArray    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountNameFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
      
        try {
        logger.log('info', 'AuthManagement : verifyAccountDetails : Execution started.');

        /**
        * Decrypting userID and OTP sent by UI by private key  : Start
        */
        cipherRequestData               = request.body.cipherData;            // Getting cipher stirng, Which have userName,OTP, password and serverPageTime in encrypted formet.
        cipherRequestDataInClearText    = utilityAppObject.decryptDataByPrivateKey(cipherRequestData);
        /**
        * Decrypting userID and OTP sent by UI by private key : END
        */
        
        /**
        * Separating userID and OTP by UI: START
        */
        separatorString                    = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;          
        cipherRequestDataStringArray       = cipherRequestDataInClearText.split(separatorString);
        accountNameFromToken               = cipherRequestDataStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        
        /**
        * Separating userID and OTP sent by UI : END
        */


        // Validating Input Request : Start      
        if(accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || accountNameFromToken == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || validatorObject.isEmpty(accountNameFromToken.trim())) {
            logger.log('error', 'AuthManagement : verifyAccountDetails : Execution end : Account name/CRN Code is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_NAME_NULL_EMPTY)); 
        }

        // Validating Input Request : End
            
        // Fatching Account ID By Name - START

        let tenant_AccountGUID   = await utilityAppObject.GetTenantAccountByName(accountNameFromToken);
        logger.log('info','AuthManagement : verifyAccountDetails : tenant_AccountGUID : ' + JSON.stringify(tenant_AccountGUID));

        if(tenant_AccountGUID.result == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            logger.log('error', 'AuthManagement : verifyAccountDetails : Execution end : CRN Code');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME)); 
        }   
        tenant_AccountGUID       = tenant_AccountGUID.result.AccountGUID;        

        logger.log('error', 'AuthManagement : verifyAccountDetails :Account details verified successfully');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_DETAILS_VERIFIED, {AccountGUID : tenant_AccountGUID})); 
        } catch(error){
            logger.log('error','accountNameFromToken: '+ accountNameFromToken + 'AuthManagement : verifyAccountDetails : Execution end.:'+ error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_ACCOUNT_NAME));     
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
 * Send API request to Auth application auth module
 * @param {*} requestBody 
 * @param {*} endPoint 
 * @returns 
 */
async function sendRequestToAuthAPIApplication(requestBody, endPoint) {
    const log = (global.logger && global.logger.log) ? (...a) => { try { global.logger.log(...a); } catch (_) {} } : () => {};
    try {
        log('info', 'AuthBl : sendRequestToAuthAPIApplication : Execution started.');
        log('info', 'AuthBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint);
        log('info', 'AuthBl : sendRequestToAuthAPIApplication : Sending request to API URL with requestBody value = ' + JSON.stringify(requestBody));
        
        const AUTH_SERVICE_BASE_URL = (APP_CONFIG && APP_CONFIG.AUTH_SERVICE_URL) ? APP_CONFIG.AUTH_SERVICE_URL : 'http://localhost:9001';
        const HEADERS               = { 'Content-Type': 'application/json'};
        
        return AXIOS.post(AUTH_SERVICE_BASE_URL + endPoint, {reqPayload: requestBody || {}}, {headers: HEADERS})
        .then((response) => {
            log('info', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Response Received for API URL : ' + endPoint);
            log('info', 'AuthBl : sendRequestToAuthAPIApplication : Response Received for API URL with response value = ' + JSON.stringify(response.data));
            return response.data;
        })
        .catch((error) => {
            log('error', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
            log('error', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Error occured while processing request for API URL : ' + endPoint + ' : Error details : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        });
    } catch (error) {
        log('error', 'AuthBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
        log('error', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Got unhandled error. : Error details : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to fetch modules details based on roles of logged-in user.
 */
async function getSubscriptionData(userId, userData, rolesData, modulesData, accountsData, moduleUserRoleData,userUnitData){
    try {
        logger.log('info', 'User ID : ' + userId + ' : AuthBl : getSubscriptionData : Execution started.');

        let userRole       = [];
        let moduleAccessed = [];
        let result         = [];

        userRole = rolesData.filter(ele => ele.RoleID == userData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RoleID);
       
        let roleName = userRole.map(element => element.Name);
      
        let modulesForSA = APP_CONFIG.SUPER_ADMIN_ROLE_MODULE_LIST.map(ele => ele.ModuleAbbreviation);
        let modulesForUM = APP_CONFIG.UM_ROLE_MODULE_LIST.map(ele => ele.ModuleAbbreviation);
        let modulesForPU_SU = APP_CONFIG.SU_PU_MODULE_LIST.map(ele => ele.ModuleAbbreviation);

        if( roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.SUPER_ADMIN){
            moduleAccessed = modulesData.filter(ele =>modulesForSA.includes(ele.Abbreviation));
        }else if(roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.USER_MANAGEMENT){
            moduleAccessed = modulesData.filter(ele =>modulesForUM.includes(ele.Abbreviation));
        }else if(roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.POWER_USER || roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.STANDARD_USER){
            moduleAccessed = modulesData.filter(ele =>modulesForPU_SU.includes(ele.Abbreviation));
        }
     
        result.push(rolesData, moduleAccessed, accountsData, moduleUserRoleData,userUnitData);
      
        logger.log('info', 'User ID : ' + userId + ' : AuthBl : getSubscriptionData : Execution end.');

        return result;
    } catch (error) {
        logger.log('error', 'User ID : ' + userId + ' : AuthBl : getSubscriptionData : Execution end. : Got unhandled error. : Error details : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format the data .
 */
async function formatRecordSetData(userId, loginData, roleData, authorizedModuleData, userAccountData, userModuleRoleData,userUnitData, authorizedFunctionData,bcmStreeringCommittee){
    try {
        logger.log('info', 'User Id : '+ userId +' : AuthBl : formatRecordSetData : Execution started.');

        let dataSet = {
            "loginData"                 : loginData,
            "roleData"                  : roleData,
            "authorizedModuleData"      : authorizedModuleData,
            "userAccountData"           : userAccountData,
            "userModuleRoleData"        : userModuleRoleData,
            "userUnitData"              : userUnitData,
            "authorizedFunctionData"    : authorizedFunctionData,
            "bcmStreeringCommittee"     : bcmStreeringCommittee,
            "moduleList"                : appConfig.Module_List
        };

        return dataSet;
    } catch (error) {
        logger.log('error', 'User Id : '+ userId +' : AuthBl : formatRecordSetData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
    
}


// This function will sendNewOTP to users email
async function sendNewOTP(userID, userName, refreshedToken, userEmailID, tenant_AccountGUID, ActionType, GET_USER_DETAILS, OtpExpiryTime){
    try{
        logger.log('info','User Id : ' + userID + 'AuthManagement : sendNewOTP : Execution started.');
        let OTP                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let OTPCreatedDateTime  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let DynemicEmailSubject  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let OTPExpirationTime   = OtpExpiryTime;
        let SE_GRC_APP_URL      = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];
        let OTPMaster       = {
            userID          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            OTP             : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            createdDateTime : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            isActive        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        // Generating OTP 
        OTP = await utilityAppObject.generateOTP();

        // Checking OTP is null or not
        if(OTP == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || OTP == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            logger.log('error', 'User Id : ' + userID + ': AuthManagement : sendNewOTP : Execution end. : Failed to Generate OTP');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_GENERATE_OTP));
        }
        logger.log('info','User Id : ' + userID + ': AuthManagement : sendNewOTP : OTP generated Successfully');
        logger.log('info','User Id : ' + userID + ': AuthManagement : sendNewOTP : OTPExpirationTime in minutes from APP_CONFIG :  ' + OTPExpirationTime);


        OTPCreatedDateTime  = new Date();
        let RequestDateTime = await utilityAppObject.formatDate(userID,  OTPCreatedDateTime);

        /**
         * Storing OTP in Database :Start
         */
        OTPMaster.userID            = userID;
        OTPMaster.OTP               = OTP;
        OTPMaster.createdDateTime   = OTPCreatedDateTime;
        OTPMaster.isActive          = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;

        const ADD_OTP_RESPONSE = await authDbObject.addUserOTP(userID, OTPMaster, tenant_AccountGUID);
        if(ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || ADD_OTP_RESPONSE == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            logger.log('error', 'User Id : ' + userID + ': AuthManagement : sendNewOTP : Execution end. : get User details response is null or undefined');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
        }
        if (ADD_OTP_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userID + ': AuthManagement : sendNewOTP : Execution end. : Error details :' + ADD_OTP_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
        }
        if (ADD_OTP_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_OTP_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userID + ': AuthManagement : sendNewOTP : Execution end. : Error details : ' + ADD_OTP_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_SEND_OTP));
        }
        logger.log('info','User Id : ' + userID + 'AuthManagement : sendNewOTP : OTP Added to Database Successfully');
        /**
         * Storing OTP in Database :End
         */
        DynemicEmailSubject = `SE-GRC Notification: OTP`;

        if (ActionType == 'login') { DynemicEmailSubject = `SE-GRC Notification: OTP for Login`};
        if (ActionType == 'ChangePWD') { DynemicEmailSubject = `SE-GRC Notification: OTP for Change Password`};
        if (ActionType == 'ForgotPWD') { DynemicEmailSubject = `SE-GRC Notification: OTP for Reset Password`};
            
        /**
         * Sending OTP to Registered EmailID of the User :Start
         */
        try { 
            logger.log('info', 'User Id : ' + userID + 'AuthManagement : sendNewOTP : Email data formation logic started.');
            let templateMasterObj = {
                EmailSubject        : DynemicEmailSubject,
                TOEmail             : userEmailID,
                CCEmail             : "",
                EmailAttachment     : [],
                EmailContent        : `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body><div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear ${GET_USER_DETAILS[0].FirstName} ${GET_USER_DETAILS[0].LastName},<br><br>
                Your One-Time Password (OTP) is: <br> <strong > <span style = "background: #a3e860; font-size: 6vh;"> ${OTPMaster.OTP} </span></strong> 
                 </p> This OTP is valid for <strong>${OTPExpirationTime} </strong> minutes from the time you have placed the request. Please do not share it with anyone. <br><p>Please click <a href=${SE_GRC_APP_URL}>here</a> to access the application. </p>
                OTP Request Date & Time: <strong>${RequestDateTime}</strong><br></div></div></body></html>`,
            }
            let emailAlertsresponse = await utilityAppObject.AddEmailAlerts(userID, templateMasterObj);
            logger.log('info','UserManagementBl : resetPassword : emailAlertsresponse : ' + JSON.stringify(emailAlertsresponse));

        } catch (error) {
            logger.log('error', 'User Id : ' + userID + ' : AuthManagement : sendNewOTP : Error in Email data formation logic. : Error detail : ' + error);
        }
        /**
         * Sending OTP to Registered EmailID of the User :End
         */
        logger.log('info','User Id : ' + userID + ': AuthManagement : sendNewOTP : Execution end.');

        return CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;

    } catch (error) {
        logger.log('error', 'User Id : ' + userID + ': AuthManagement : sendNewOTP : Error in generating and Storing New OTP. : Error detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function updatePassword(userID, NewPassword, requestType, userDetails, tenant_AccountGUID){
    try{
        logger.log('info','User Id : ' + userID + 'AuthManagement : updatePassword : Execution started.');

        let userFullName        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userEmailID         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let saltAndHashPassword = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userName            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let salt                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let hashPassword        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let passwordResponse    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let templateMasterObj   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let SE_GRC_APP_URL      = APP_CONFIG.SE_GRC_APP_URL[APP_CONFIG.APP_SERVER.ENVIRONMENT_NAME];

        let userMaster = {
            salt            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            hashPassword    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            isDefaultPwd    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        }
        
        userName        = userDetails.UserName
        userFullName    = userDetails.FirstName + " " + userDetails.LastName;
        userEmailID     = userDetails.EmailID;

        // Checking User Email ID is null or empty
        if(userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || userEmailID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            logger.log('error', 'User Id : ' + userID + ': AuthManagement : updatePassword : Execution end. : email id  is null or undefined');
            return (unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_INVALID));
        }

        passwordResponse = await passwordUtilityObject.generateSaltHashPassword(userID, NewPassword) 
        if(passwordResponse.result) {
            userMaster.hashPassword     = passwordResponse.hashPassword
            userMaster.salt             = passwordResponse.salt
              templateMasterObj = {
                EmailContent        : `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head><body><div><div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"><p style="margin-top:0;margin-bottom:0;">Dear ${userFullName},<br><br>Your Password has been changed successfully. </p> <br><p>Please click <a href=${SE_GRC_APP_URL}>here</a> to access the application. </p><br> <br> </div></div></body></html>	`,
                EmailSubject        : requestType,
                TOEmail             : userEmailID,
                CCEmail             : "",
                EmailAttachment     : [],
            }                        
            // sendEmailResponse = await emailUtilityObj.sendEMailNotification(templateMasterObj);      
            // logger.log('info', 'User Id : '+ userID +' : UserManagementBl : formatSendEmailToResetPassword : sendEmailResponse : ' + JSON.stringify(sendEmailResponse));
        }
        
        // if(!sendEmailResponse){
        //     logger.log('error', 'User Id : ' + userID + ': AuthManagement : updatePassword : Error in reset the password or to send an email with default password. : Error detail : ' + error);
        //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_RESET_PASSWORD));
        // } 
        let emailAlertsresponse = await utilityAppObject.AddEmailAlerts(userID, templateMasterObj);
        logger.log('info', 'User Id : ' + userID + ': AuthManagement : updatePassword : emailAlertsresponse' + JSON.stringify(emailAlertsresponse));

        userMaster.isDefaultPwd = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        userMaster.AccountGUID = tenant_AccountGUID;

        const CredentialHistoryRecords      = APP_CONFIG.PASSWORD_CONFIG.CHECK_FOR_USER_CREDENTIAL_HISTORY;
        const GET_USER_CREDENTIAL_HISTORY   = await utilityAppObject.GetUserCredentialHistory(userID, CredentialHistoryRecords, tenant_AccountGUID);
        logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : GET_USER_CREDENTIAL_HISTORY : '+ JSON.stringify(GET_USER_CREDENTIAL_HISTORY));

        try {
            logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : check password history START');
            if (GET_USER_CREDENTIAL_HISTORY.result.length !== 0) {
                for (let i = 0; i < GET_USER_CREDENTIAL_HISTORY.result.length; i++) {
                    if (await passwordUtilityObject.comparePassword(userID, NewPassword, GET_USER_CREDENTIAL_HISTORY.result[i].Password)) {
                        logger.log('info', 'User Id : ' + userID + ` : AuthManagement : updatePassword : check password [${i}] : ` + CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE);
                        return CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
                    }
                }
            } else {
                logger.log('error', 'User Id : ' + userID + ' : AuthManagement : updatePassword : check password history.');
            }
            logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : check password history END');

            logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : AddUserCredentialHistory : check password history START.');
            const ADD_USER_CREDENTIAL_HISTORY = await utilityAppObject.AddUserCredentialHistory(userID, userName, tenant_AccountGUID, userID, userMaster.hashPassword );
            logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : ADD_USER_CREDENTIAL_HISTORY : '+ JSON.stringify(ADD_USER_CREDENTIAL_HISTORY));
            logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : AddUserCredentialHistory : check password history End.');
        } catch (error) {
            logger.log('error', 'User Id : ' + userID + ' : AuthManagement : updatePassword : Execution end. : get Credential History error:', error);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FAILED_TO_UPDATE_PASSWORD));
        }
        
        const UPDATE_USER_MASTER_FOR_AUTH     = await authDbObject.updateUserMasterForAuth(userName, userID,tenant_AccountGUID, {hashPassword:  userMaster.hashPassword,  salt: userMaster.salt,  isDefaultPwd: userMaster.isDefaultPwd}, 'password');
        logger.log('info', 'User Id : ' + userID + ' : AuthManagement : updatePassword : UPDATE_USER_MASTER_FOR_AUTH : '+ JSON.stringify(UPDATE_USER_MASTER_FOR_AUTH));
        
        if (UPDATE_USER_MASTER_FOR_AUTH.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER_FOR_AUTH.procedureSuccess !== CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            return status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
        }

        logger.log('info','User Id : ' + userID + 'AuthManagement : updatePassword : Execution end.');
        return CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;

    }catch(error){
        logger.log('error', 'User Id : ' + userID + ': AuthManagement : updatePassword : Error in updating Password. : Error detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

async function validateDateTimeDiff(DateFromDB) {           
    let DateDB              = new Date(DateFromDB);  
    // let timezoneOffsetDB    = DateDB.getTimezoneOffset(); 
    // let utcDateDB           = new Date(DateDB.getTime() + timezoneOffsetDB * 60000);  
    let currDate            = new Date();  
    // Corrected: Using Math.floor properly and calculating the time difference in seconds
    let timeDiffInSeconds   = Math.floor((currDate.getTime() - DateDB.getTime()) / 1000); 
    
    return timeDiffInSeconds;  
}


/**
 * This is function will be used to return single instance of class.
 */
function getAuthBlClassInstance( ) {
    if( authBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) {
        authBlClassInstance = new AuthBl();
    }
    return authBlClassInstance;
}

exports.getAuthBlClassInstance = getAuthBlClassInstance;