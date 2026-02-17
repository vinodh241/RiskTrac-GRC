const PATH                  = require('path');
const FILE_SYSTEM           = require('fs');
// const JWT                   = require('jsonwebtoken');
// const JWT_REFRESH           = require('jsonwebtoken-refresh');
const JS_ENCRYPT_LIB_OBJ    = require('node-jsencrypt');
const MESSAGE_FILE_OBJ      = require('./message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('./constants/constant.js');
const APP_CONFIG            = require('../config/app-config.js');

const SECRET_KEY_FILE_PATH  = "/config/certs/secret.pem";
const PRIVATE_KEY_FILE_PATH = "/config/certs/private.pem"; 
const PUBLIC_KEY_FILE_PATH  = "/config/certs/public.pem";

module.exports = class UtilityApp {
    constructor() {
    }

    /**
     * This function will read "secret.pem"  file and return secretkey
     */
    getAppSecretKey(){
        try {
            var absolutePathForSecretKey    = PATH.join(process.cwd(),SECRET_KEY_FILE_PATH);
            var key                         = FILE_SYSTEM.readFileSync(absolutePathForSecretKey, "utf8");
            return key;
        } catch (error) {
            logger.log('error', 'UtilityApp : getAppSecretKey : Error details :'+error);
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
            var absolutePathForPrivateKey   = PATH.join(process.cwd(),PRIVATE_KEY_FILE_PATH);                      // Fetching absolute path for private key
            var privateKey                  = FILE_SYSTEM.readFileSync(absolutePathForPrivateKey, "utf8");       // Fetching private key value
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
            var absolutePathForPublicKey   = PATH.join(process.cwd(),PUBLIC_KEY_FILE_PATH);                        // Fetching absolute path for public key
            var publicKey                  = FILE_SYSTEM.readFileSync(absolutePathForPublicKey, "utf8");         // Fetching public key value
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
                            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                            errorMessage: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TOKEN_INVALID
                        }
            };
            return responseString;
        } catch (error) {
            logger.log('error', 'UtilityApp : invalidTokenResposeString : Error details :'+error);
            return responseString;
        }
    }
}