const PATH                  = require('path');
const FILE_SYSTEM           = require('fs');
const JWT                   = require('jsonwebtoken');
const JWT_REFRESH           = require('jsonwebtoken-refresh');
const JS_ENCRYPT_LIB_OBJ    = require('node-jsencrypt');
const MESSAGE_FILE_OBJ      = require('./message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('./constants/constant.js');
const APP_CONFIG            = require('../config/app-config.js');

// Resolve certs from this file's location (works in Docker and local regardless of cwd)
const CERTS_DIR             = PATH.join(__dirname, '..', 'config', 'certs');
const SECRET_KEY_FILE_PATH  = PATH.join(CERTS_DIR, 'secret.pem');
const PRIVATE_KEY_FILE_PATH = PATH.join(CERTS_DIR, 'private.pem');
const PUBLIC_KEY_FILE_PATH  = PATH.join(CERTS_DIR, 'public.pem');
const AUTH_DB               = require('../data-access/auth-db.js')
const COMMON_DB             = require('./data-base-utility/common-db.js');
const USER_MANAGEMENT_DB    = require('../data-access/user-management-db.js')

var authDbObject        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var commonDbObject      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var userManagementDB    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

module.exports = class UtilityApp {
    constructor() {
        authDbObject        = new AUTH_DB();
        commonDbObject      = new COMMON_DB();
        userManagementDB    = new USER_MANAGEMENT_DB();
    }

    /**
     * This function will return JWT secret: env JWT_SECRET if set, else "secret.pem" file.
     * Use same JWT_SECRET in umapi, ormapi, bcmapi so tokens verify across modules.
     */
    getAppSecretKey(){
        var fromEnv = process.env.JWT_SECRET;
        if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim().length > 0)
            return fromEnv.trim();
        try {
            var key = FILE_SYSTEM.readFileSync(SECRET_KEY_FILE_PATH, "utf8");
            return key;
        } catch (error) {
            logger.log('error', 'UtilityApp : getAppSecretKey : Error details : '+error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }
        
    /**
     * This function will verify json token.
     * Return with refreshed token.(Only expiry time will be refreshed, other data will be same in refreshed token.)
     * @param {*} jwtToken 
     */
    validateToken(jwtToken) {
        var refreshedToken;
        var validateTokenResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            message         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            refreshedToken  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        var secretKey = this.getAppSecretKey();
        // Verifying json web token
        try {
            var decoded = JWT.verify(jwtToken, secretKey);
            if(decoded !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && decoded !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
                // Token verified, and now we have to do token refresh
                try {
                    refreshedToken = this.refreshToken(jwtToken);
                    
                    if(refreshedToken === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        // Case : Error in refresh token
                        logger.log('error', 'UtilityApp : validateToken : Error in refresh token.');
                        validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                        validateTokenResponseObj.message        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        validateTokenResponseObj.refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        validateTokenResponseObj.errorMessage   = "Error in refresh token.";
                        return validateTokenResponseObj;
                    } else{
                        // Case : Refresh token successfull
                        validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                        validateTokenResponseObj.message        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        validateTokenResponseObj.refreshedToken = refreshedToken;
                        validateTokenResponseObj.errorMessage   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        return validateTokenResponseObj;
                    }
                } catch (error) {
                    // Case : Error in refresh token
                    logger.log('error', 'UtilityApp : validateToken : Error in refreshing token : Error details : '+error);
                    validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                    validateTokenResponseObj.refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    validateTokenResponseObj.message        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    validateTokenResponseObj.errorMessage   = "Error in refresh token.";
                    return validateTokenResponseObj;
                }
            }
        } catch (error) {
            logger.log('error', 'UtilityApp : validateToken : Error in token validation : Error details : '+error);
            var message = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if(error.name !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED && error.name === 'TokenExpiredError'){
                message = "Token expired at "+error.expiredAt;
                logger.log('error', 'UtilityApp : validateToken : Error in token validation : Error message : '+message);
                // Case : Token expired
                validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                validateTokenResponseObj.message        = message
                validateTokenResponseObj.refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                validateTokenResponseObj.errorMessage   = "Token expired";
                return validateTokenResponseObj;
            }
            else if(error.name !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED && error.name === 'JsonWebTokenError'){
                message = error.message;
                logger.log('error', 'UtilityApp : validateToken : Error in token validation : Error message : '+message);
                // Case : JsonWebTokenError
                validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                validateTokenResponseObj.message        = message;
                validateTokenResponseObj.refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                validateTokenResponseObj.errorMessage   = "JsonWebTokenError";
                return validateTokenResponseObj;
            }
            else if(error.name !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED && error.name === 'NotBeforeError'){
                message = error.message;
                logger.log('error', 'UtilityApp : validateToken : Error in token validation : Error message : '+message);
                // Case : NotBeforeError
                validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                validateTokenResponseObj.message        = message;
                validateTokenResponseObj.refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                validateTokenResponseObj.errorMessage   = "NotBeforeError";
                return validateTokenResponseObj;
            }
            else {
                // Case : Some other error
                logger.log('error', 'UtilityApp : validateToken : Error in token validation : Unauthorised User from token');
                validateTokenResponseObj.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                validateTokenResponseObj.message        = "Unauthorised User from token";
                validateTokenResponseObj.refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                validateTokenResponseObj.errorMessage   = "Unauthorised User";
                return validateTokenResponseObj;
            }
        }
    }

    /**
     * This function will refresh the token, Means only expiry time will be new other
     * data will be same as old token data.
     * @param {*} token 
     */
    refreshToken(token) {
        try {
            var secretKey       = this.getAppSecretKey();
            var originalDecoded = JWT.decode(token, {complete: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE});
            var expiryTime      = (CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS * APP_CONFIG.JWT_TOKEN.TOKEN_EXPIRY_TIME_IN_MINUTES);
            var refreshtoken    = JWT_REFRESH.refresh(originalDecoded, expiryTime, secretKey);
            return refreshtoken;
        } catch (error) {
            logger.log('error', 'UtilityApp : refreshToken : Error details :'+error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    /**
     * This function will decode the token and get user name and password from payload of token.
     * User name and password is in encrypted format, so it will decrypt User Name and password.
     * Then return User name and password in JSON object name as "userNamePasswordFromTokenObj"
     * @param {*} token 
     */
    decryptUserNamePasswordFromToken(token) {
        var userNamePasswordFromTokenObj = {
            error       : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            userName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            password    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        try {
            var decodedToken = JWT.decode(token, {complete: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE});                         // Decoding token
            
            /**
             * Decrypting user name and password by private key : Start
             */
            var encryptedUserNamePasswordString   = decodedToken.payload.userNamePassword;                          // getting encrypted user name and password from token
            var decryptedUserNamePasswordString   = this.decryptDataByPrivateKey(encryptedUserNamePasswordString);  // decrypted user name and password
            
            /**
             * Separating user name, password and serverPagetime : START
             */
            var separatorString             = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;
            var userNamePasswordStringArray = decryptedUserNamePasswordString.split(separatorString);
            var userName                    = userNamePasswordStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            var password                    = userNamePasswordStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            
            /**
             * Separating user name, password and serverPagetime : END
             */

            /**
             * Decrypting user name and password by private key : End
             */
            if(userName === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || password === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                logger.log('error', 'UtilityApp : Inside decryptUserNamePasswordFromToken method : Error in decryptUserNamePasswordFromToken : userName or password is null.');
                userNamePasswordFromTokenObj.error      = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                userNamePasswordFromTokenObj.userName   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                userNamePasswordFromTokenObj.password   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                return userNamePasswordFromTokenObj;
            }else{
                userNamePasswordFromTokenObj.error      = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                userNamePasswordFromTokenObj.userName   = userName;
                userNamePasswordFromTokenObj.password   = password;
                return userNamePasswordFromTokenObj;
            }
        } catch (error) {
            logger.log('error', 'UtilityApp : decryptUserNamePasswordFromToken : Error details :'+error);
            userNamePasswordFromTokenObj.error      = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            userNamePasswordFromTokenObj.userName   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            userNamePasswordFromTokenObj.password   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            return userNamePasswordFromTokenObj;
        }
    }

    /**
     * This function will decrypt data with private key, data should be encrypted with public key
     * @param {*} data 
     */
    decryptDataByPrivateKey(encryptedData) {
        try {
            var privateKey                  = FILE_SYSTEM.readFileSync(PRIVATE_KEY_FILE_PATH, "utf8");           // Fetching private key value
            var deCryptionObj               = new JS_ENCRYPT_LIB_OBJ();                                            // Creating js encryption object.
            deCryptionObj.setPrivateKey(privateKey);                                                            // Setting private key into js encryption object
            var decryptedData               = deCryptionObj.decrypt(encryptedData);                             // decrypted data
            return decryptedData;
        } catch (error) {
            logger.log('error', 'UtilityApp : decryptDataByPrivateKey : Error details :'+error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    /**
     * This function will encrypt data with public key, data will be decrypted with private key
     * @param {*} clearTextData 
     */
    encryptDataByPublicKey(clearTextData) {
        try {
            var publicKey                  = FILE_SYSTEM.readFileSync(PUBLIC_KEY_FILE_PATH, "utf8");             // Fetching public key value
            var enCryptionObj               = new JS_ENCRYPT_LIB_OBJ();                                            // Creating js encryption object.
            enCryptionObj.setPrivateKey(publicKey);                                                             // Setting public key into js encryption object
            var encryptedData               = enCryptionObj.encrypt(clearTextData);                             // encrypted data
            return encryptedData;
        } catch (error) {
            logger.log('error', 'UtilityApp : encryptDataByPublicKey : Error details :'+error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    /**
     * This function will decode the token and get user id from payload of token.
     * Then return user id in JSON object name as "userIdFromTokenObj"
     * @param {*} token 
     */
    getUserIdFromToken(token){
        var decodedToken;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromTokenObj = {
            error  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            userId : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        try {
            decodedToken                = JWT.decode(token, {complete: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE});          // Decoding token
            userIdFromToken             = decodedToken.payload.userId;                  // getting user id from token
            userIdFromTokenObj.userId   = userIdFromToken;
            
            return userIdFromTokenObj;
        } catch (error) {
            logger.log('error', 'UtilityApp : getUserIdFromToken : Error details :'+error);
            userIdFromTokenObj.error    = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            userIdFromTokenObj.userId   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            return userIdFromTokenObj;
        }
    }

    /**
     * This function will decode the token and get user name from payload of token.
     * Then return user name in JSON object name as "userNameFromTokenObj"
     * @param {*} token 
     */
    getUserNameFromToken(token){
        var decodedToken;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromTokenObj    =   {
                                            error       : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                                            userName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                                        };
        try {
            decodedToken                    = JWT.decode(token, {complete: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE});      // Decoding token
            userNameFromToken               = decodedToken.payload.userName;            // getting user name from token
            userNameFromTokenObj.userName   = userNameFromToken;
            userNameFromTokenObj.error      = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            
            return userNameFromTokenObj;
        } catch (error) {
            logger.log('error', 'UtilityApp : getUserNameFromToken : Error details :'+error);
            userNameFromTokenObj.error      = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            userNameFromTokenObj.userName   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            return userNameFromTokenObj;
        }
    }

    /**
     * This function will return response string for invalid token error.
     */
    invalidTokenResposeString()
    {
        try {
            var responseString = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            responseString = {
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                            errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TOKEN_INVALID
                        }
            };
            return responseString;
        } catch (error) {
            logger.log('error', 'UtilityApp : invalidTokenResposeString : Error details :'+error);
            return responseString;
        }
    }

    /**
     * This function will decode the token and get account name from payload of token.
     * Then return account name in JSON object name as "userNameFromTokenObj"
     * @param {*} token 
     */
    getAccountNameFromToken(token) {
        var decodedToken;
        var accountNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountNameFromTokenObj = {
            error: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            accountName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        try {
            decodedToken = JWT.decode(token, { complete: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE });      // Decoding token
            accountNameFromToken = decodedToken.payload.accountName;            // getting account name from token
            accountNameFromTokenObj.accountName = accountNameFromToken;
            accountNameFromTokenObj.error = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;

            return accountNameFromTokenObj;
        } catch (error) {
            logger.log('error', 'UtilityApp : getAccountNameFromToken : Error details :' + error);
            accountNameFromTokenObj.error = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            accountNameFromTokenObj.accountName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            return accountNameFromTokenObj;
        }
    }

    /**
     * This function will decode the token and get account GUID from payload of token.
     * Then return account GUID in JSON object name as "userNameFromTokenObj"
     * @param {*} token 
     */
    async getAccountGUIDFromToken(token) {
        var decodedToken;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromTokenObj = {
            error: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            accountGUID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            subStartDate: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            subEndDate: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            validAccount: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };
        try {
            decodedToken = JWT.decode(token, { complete: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE });      // Decoding token
            // logger.log('info', 'UtilityApp : getAccountGUIDFromToken :  UserManagement : DECODED_TOKEN : ' + JSON.stringify(decodedToken));
            accountNameFromToken = decodedToken.payload.accountName;            // getting user name from token

            const ACCOUNT_GUID_FROM_NAME = await commonDbObject.getAccountIdByAccountName(accountNameFromToken);
            logger.log('info', 'UtilityApp : getAccountGUIDFromToken :  UserManagement : ACCOUNT_GUID_FROM_NAME : ' + JSON.stringify(ACCOUNT_GUID_FROM_NAME));

            if (ACCOUNT_GUID_FROM_NAME.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ACCOUNT_GUID_FROM_NAME.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && ACCOUNT_GUID_FROM_NAME.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                accountGUIDFromToken = ACCOUNT_GUID_FROM_NAME.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AccountGUID;
                accountGUIDFromTokenObj.accountGUID = accountGUIDFromToken;
                accountGUIDFromTokenObj.subStartDate = ACCOUNT_GUID_FROM_NAME.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubscriptionStartDate;
                accountGUIDFromTokenObj.subEndDate = ACCOUNT_GUID_FROM_NAME.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubscriptionEndDate;
                accountGUIDFromTokenObj.validAccount = ACCOUNT_GUID_FROM_NAME.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ValidAccount;
                accountGUIDFromTokenObj.error = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            } else {
                accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                accountGUIDFromTokenObj.accountGUID = accountGUIDFromToken;
                accountGUIDFromTokenObj.subStartDate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                accountGUIDFromTokenObj.subEndDate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                accountGUIDFromTokenObj.error = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            }
            logger.log('info', 'UtilityApp : getAccountGUIDFromToken :  UserManagement : ACCOUNT_TOKEN_OBJECT : ' + JSON.stringify(accountGUIDFromTokenObj));
            return accountGUIDFromTokenObj;

        } catch (error) {
            logger.log('error', 'UtilityApp : getAccountGUIDFromToken : Error details :' + error);
            accountGUIDFromTokenObj.error = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            accountGUIDFromTokenObj.accountGUID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            return accountGUIDFromTokenObj;
        }
    }

    async decryptDataByPrivateKeyPassword(encryptedData) {
        try {
            logger.log('info', 'UtilityApp : decryptDataByPrivateKey : Execution started');
            let privateKey                  = FILE_SYSTEM.readFileSync(PRIVATE_KEY_FILE_PATH, "utf8");           // Fetching private key value
            let deCryptionObj               = new JS_ENCRYPT_LIB_OBJ();                                            // Creating js encryption object.
            await deCryptionObj.setPrivateKey(privateKey);                                                            // Setting private key into js encryption object
            let decryptedData               = await deCryptionObj.decrypt(encryptedData);                             // decrypted data
            logger.log('info', 'UtilityApp : decryptDataByPrivateKey : decryptedData : ' + decryptedData);
            return decryptedData;
        } catch (error) {
            logger.log('error', 'UtilityApp : decryptDataByPrivateKey : Error details :'+error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    async generateOTP() {
        try{
            logger.log('info', 'generate OTP : Execution Started');
            let OTPLength   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let OTP         = '';
            OTPLength       = APP_CONFIG.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP;

            for (let i = 0; i < OTPLength; i++) {
                OTP += Math.floor(Math.random() * 10)
            }

            logger.log('info', 'generate OTP : Execution End');
            return OTP;

        } catch (error) {
            logger.log('error', 'Error in  generation OTP' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }        
    }

    
    /**
     * This function will format the date in DD.MM.YYYY_HH:MM:SS return it.
     * @param {*} userIdFromToken 
     * @param {*} DateFormat 
     * @returns 
     */
    async formatDate(userId, DateFormat){ 
        try {      
            logger.log('info', 'User Id : '+ userId +' : AuthManagement : formatDate : Execution started.');
            
            let NewDate     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            let date_time   = new Date(DateFormat);
            let date        = ("0" + date_time.getDate()).slice(-2);
            let month       = ("0" + (date_time.getMonth() + 1)).slice(-2); 
            let year        = date_time.getFullYear();   
            let hours       = ("0" + date_time.getHours()).slice(-2);
            let minutes     = ("0" + date_time.getMinutes()).slice(-2); 
            let seconds     = ("0" + date_time.getSeconds()).slice(-2);           
        
            if (APP_CONFIG.DATE_FORMAT_CONFIG.DATE_FORMAT == 'DD-MM-YYYY') {
                NewDate = date + "-" + month + "-" + year + "_" + hours + ":" + minutes + ":" + seconds;
            } else if(APP_CONFIG.DATE_FORMAT_CONFIG.DATE_FORMAT == 'DD/MM/YYYY') {
                NewDate = date + "/" + month + "/" + year + "_" + hours + ":" + minutes + ":" + seconds;   
            } else if(APP_CONFIG.DATE_FORMAT_CONFIG.DATE_FORMAT == 'MM-DD-YYYY') {
                NewDate = month + "-" + date + "-" + year + "_" + hours + ":" + minutes + ":" + seconds;  
            } else if(APP_CONFIG.DATE_FORMAT_CONFIG.DATE_FORMAT == 'MM/DD/YYYY') {
                NewDate = month + "/" + date + "/" + year + "_" + hours + ":" + minutes + ":" + seconds;   
            }

            logger.log('info', 'User Id : '+ userId +' : AuthManagement : formatDate : Execution end.' + NewDate);

            return NewDate;
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthManagement : formatDate : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }


   
    
    async GetTenantAccountByName(accountNameFromToken){
        var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetTenantAccountByName : Execution start.');
    
        const tenantDBObjectData = await authDbObject.getAccountIdByAccountName(accountNameFromToken);
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : tenantDBObjectData : ' + JSON.stringify(tenantDBObjectData));
        
        if(tenantDBObjectData.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetTenantAccountByName : Execution end. : '+tenantDBObjectData.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(tenantDBObjectData.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetTenantAccountByName : Execution end. : '+tenantDBObjectData.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(tenantDBObjectData.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && tenantDBObjectData.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetTenantAccountByName : Execution end. : '+tenantDBObjectData.procedureMessage);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(tenantDBObjectData.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && tenantDBObjectData.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && tenantDBObjectData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            logger.log('info', 'User Id : '+ userIdFromToken +' : UtilityApp : GetTenantAccountByName : Execution end. : No Record in data base : '+tenantDBObjectData.procedureMessage+' : Token : ' + refreshedToken);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND));
        }

    
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetTenantAccountByName : Execution end.');
        return (successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, tenantDBObjectData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]));
    }


    async GetUserDetailsByUserId(userID, tenant_AccountGUID){
        var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetUserDetailsByUserId : Execution start.');
    
        const GET_USER_DETAILS = await commonDbObject.getUserDetailsByUserId( userID, tenant_AccountGUID);
        
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserDetailsByUserId : Execution end. : '+GET_USER_DETAILS.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserDetailsByUserId : Execution end. : '+GET_USER_DETAILS.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserDetailsByUserId : Execution end. : '+GET_USER_DETAILS.procedureMessage);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            logger.log('info', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserDetailsByUserId : Execution end. : No Record in data base : '+GET_USER_DETAILS.procedureMessage+' : Token : ' + refreshedToken);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND));
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetUserDetailsByUserId : Execution end.');
        return (successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, GET_USER_DETAILS));
    }

    async GetUserCredentialHistory(userID, CredentialHistoryRecords, accountNameFromToken){
        var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetUserCredentialHistory : Execution start.');
    
        const GET_USER_CREDENTIAL_HISTORY = await authDbObject.GetUserCredentialHistory( userID, CredentialHistoryRecords, accountNameFromToken);
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetUserCredentialHistory : GET_USER_CREDENTIAL_HISTORY : ' +JSON.stringify(GET_USER_CREDENTIAL_HISTORY));        
        if(GET_USER_CREDENTIAL_HISTORY.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserCredentialHistory : Execution end. : '+GET_USER_CREDENTIAL_HISTORY.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_CREDENTIAL_HISTORY.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserCredentialHistory : Execution end. : '+GET_USER_CREDENTIAL_HISTORY.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_CREDENTIAL_HISTORY.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_CREDENTIAL_HISTORY.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserCredentialHistory : Execution end. : '+GET_USER_CREDENTIAL_HISTORY.procedureMessage);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountNameFromToken + ' : UtilityApp : GetUserDetailsByUserId : Execution end.');
        return (successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, GET_USER_CREDENTIAL_HISTORY.recordset[0]));
    }

    async AddUserCredentialHistory(userIdFromToken, userNameFromToken, accountGUIDFromToken,  userGUID, hashPassword){
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountGUIDFromToken + ' : UtilityApp : AddUserCredentialHistory : Execution start.');
    
        const ADD_USER_CREDENTIAL_HISTORY = await userManagementDB.addUserCredentialHistory(userIdFromToken, userNameFromToken, accountGUIDFromToken,  userGUID, hashPassword);
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountGUIDFromToken + ' : UtilityApp : AddUserCredentialHistory : ADD_USER_CREDENTIAL_HISTORY : ' +JSON.stringify(ADD_USER_CREDENTIAL_HISTORY));        
        if(ADD_USER_CREDENTIAL_HISTORY.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : AddUserCredentialHistory : Execution end. : '+ADD_USER_CREDENTIAL_HISTORY.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(ADD_USER_CREDENTIAL_HISTORY.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : AddUserCredentialHistory : Execution end. : '+ADD_USER_CREDENTIAL_HISTORY.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(ADD_USER_CREDENTIAL_HISTORY.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_USER_CREDENTIAL_HISTORY.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ){
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : AddUserCredentialHistory : Execution end. : '+ADD_USER_CREDENTIAL_HISTORY.procedureMessage);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
       
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountGUIDFromToken + ' : UtilityApp : GetUserDetailsByUserId : Execution end.');
        return (successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, ADD_USER_CREDENTIAL_HISTORY));
    }

    async AddEmailAlerts(userNameFromToken, emailObj){
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        logger.log('info', 'User Id : '+ userNameFromToken +' : UtilityApp : AddEmailAlerts : Execution start.');
    
        const ADD_EMAIL_ALERTS = await commonDbObject.addEmailAlerts(userNameFromToken, emailObj);
        logger.log('info', 'User Id : '+ userNameFromToken +' : UtilityApp : AddEmailAlerts : ADD_EMAIL_ALERTS : ' +JSON.stringify(ADD_EMAIL_ALERTS));        
        if(ADD_EMAIL_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'User Id : '+ userNameFromToken +' : UtilityApp : AddEmailAlerts : Execution end. : '+ADD_EMAIL_ALERTS.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(ADD_EMAIL_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO){
            logger.log('error', 'User Id : '+ userNameFromToken +' : UtilityApp : AddEmailAlerts : Execution end. : '+ADD_EMAIL_ALERTS.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(ADD_EMAIL_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_EMAIL_ALERTS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ){
            logger.log('error', 'User Id : '+ userNameFromToken +' : UtilityApp : AddEmailAlerts : Execution end. : '+ADD_EMAIL_ALERTS.procedureMessage);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
       
        logger.log('info', 'User Id : '+ userNameFromToken +' : UtilityApp : GetUserDetailsByUserId : Execution end.');
        return (successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, ADD_EMAIL_ALERTS));
    }

    async GetUserIDByDetailsByUserName(userName, accountGUIDFromToken) {
        var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountGUIDFromToken + ' : UtilityApp : GetUserIDByDetailsByUserName : Execution start.');
    
        const GET_USER_DETAILS = await authDbObject.getUserIdByUserName(userName, accountGUIDFromToken);
        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountGUIDFromToken + ' : UtilityApp : GET_USER_DETAILS :' +JSON.stringify(GET_USER_DETAILS));
        
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserIDByDetailsByUserName : Execution end. : '+GET_USER_DETAILS.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserIDByDetailsByUserName : Execution end. : '+GET_USER_DETAILS.errorMsg);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE ) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserIDByDetailsByUserName : Execution end. : '+GET_USER_DETAILS.procedureMessage);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if(GET_USER_DETAILS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_DETAILS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            logger.log('info', 'User Id : '+ userIdFromToken +' : UtilityApp : GetUserIDByDetailsByUserName : Execution end. : No Record in data base : '+GET_USER_DETAILS.procedureMessage+' : Token : ' + refreshedToken);
            return (unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND));
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' accountName : ' + accountGUIDFromToken + ' : UtilityApp : GetUserIDByDetailsByUserName : Execution end.');
        return (successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, GET_USER_DETAILS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]));
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