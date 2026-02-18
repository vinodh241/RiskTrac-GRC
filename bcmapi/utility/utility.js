const PATH                  = require('path');
const FILE_SYSTEM           = require('fs');
const JWT                   = require('jsonwebtoken');
const JWT_REFRESH           = require('jsonwebtoken-refresh');
const JS_ENCRYPT_LIB_OBJ    = require('node-jsencrypt');
const MESSAGE_FILE_OBJ      = require('./message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('./constants/constant.js');
const APP_CONFIG            = require('../config/app-config.js');
const UNIQID                = require('uniqid');
const FILE_TYPE             = require('file-type');
const EXCELJS_OBJ           = require('exceljs');
const Client                = require('ssh2-sftp-client');
const pdf                   = require('pdf-parse');
const CERTS_DIR             = PATH.join(__dirname, '..', 'config', 'certs');
const SECRET_KEY_FILE_PATH  = PATH.join(CERTS_DIR, 'secret.pem');
const PRIVATE_KEY_FILE_PATH = PATH.join(CERTS_DIR, 'private.pem');
const PUBLIC_KEY_FILE_PATH  = PATH.join(CERTS_DIR, 'public.pem');
const COMMON_DB             = require('./data-base-utility/common-db.js');

var commonDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

module.exports = class UtilityApp {
    constructor() {
        commonDbObject = new COMMON_DB()
    }

    formatDate1(userIdFromToken, DateFormat) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : formatDate : Execution started.' + DateFormat);
        try {      
            let dateValue   = new Date(DateFormat);
            let day         = dateValue.getUTCDate();
            let month       = dateValue.getUTCMonth() +1;
            let year        = dateValue.getUTCFullYear();
            let newDate     = day + "-" + month + "-" + year ;
            logger.log('info', 'User Id : '+ userIdFromToken +' : formatDate : Execution end.' + newDate);
            return newDate;
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': formatDate : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;    
        }    
    }

    formatDate(userIdFromToken, DateFormat) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : formatDate : Execution started.' + DateFormat);
        try {      
            let dateValue   = new Date(DateFormat);
            let options = { month: 'long', day: '2-digit', year: 'numeric' };
            let newDate     = dateValue.toLocaleDateString('en-US', options);
            logger.log('info', 'User Id : '+ userIdFromToken +' : formatDate : Execution end.' + newDate);
            return newDate;
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': formatDate : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;    
        }    
    }

    formatDateWithTime(userIdFromToken, DateTimeFormat) {

        logger.log('info', 'User Id : '+ userIdFromToken +' : formatDateWithTime : Execution started.' + DateTimeFormat);
        try {      
            let dateValue = new Date(DateTimeFormat);
            let dateFormat = dateValue.getUTCDate() + ' ' + dateValue.toLocaleString('default', { month: 'long' }) + ', ' + dateValue.getUTCFullYear() + ' - ';
            let timeString = ((DateTimeFormat || '').split('T')[1]).split('.')[0]
            const [hours, minutes] = timeString.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const hour12 = (hours % 12) || 12;
            let time = `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
            let newDate = dateFormat + time;
            logger.log('info', 'User Id : '+ userIdFromToken +' : formatDateWithTime : Execution end.' + newDate);
            return newDate;
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': formatDateWithTime : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;    
        }    
    }

    async isPDFFileValid(buffer) {
        return pdf(buffer).then(function(data) {
            if(!data.text.trim()) {
                return { isValidPDF: false, info: null };
            }
            return { isValidPDF: true, info: data.info };
        }, (err) => {
            return { isValidPDF: false, info: null };
        });
    }

    async uploadFileToRemoteServer(userIdFromToken, uploadedFileObject, SFTPfilePath, OriginalFileName, uploadedFileExtension, localFilePath) {
        const sftp                      = new Client();
        const SFTP_CONNECTION_CONFIG    = {
            host        : APP_CONFIG.SFTP_CONFIG.host,
            port        : APP_CONFIG.SFTP_CONFIG.port,
            username    : APP_CONFIG.SFTP_CONFIG.username,
            password    : this.decryptDataByPrivateKey(APP_CONFIG.SFTP_CONFIG.password)
        };
        // Ensure the local directory exists
        if (!FILE_SYSTEM.existsSync(localFilePath)) {
            try {
                FILE_SYSTEM.mkdirSync(localFilePath, { recursive: true });
                logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : Created directory:`);
            } catch (error) {
                logger.log('error', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : Failed to create directory:. Error: ${error.message}`);
                return { uploadFileResponse: false, SFTPConnection: false };
            }
        }

        const localAPIFilePathWithName = PATH.join(localFilePath, OriginalFileName);
        logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : Local file path: ${localAPIFilePathWithName}`);

        try {
            if (uploadedFileExtension === '.pdf') {
                const res = await this.isPDFFileValid(uploadedFileObject);
                if (!res.isValidPDF) {
                    logger.log('info', 'User Id : '+ userIdFromToken + ' : BinaryData : uploadFileToRemoteServer : uploaded file is having malicious content');
                    return { uploadFileResponse : false, SFTPConnection: true};
                }
            }
            // Write the uploaded file to the local path
            FILE_SYSTEM.writeFileSync(localAPIFilePathWithName, uploadedFileObject);
            logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : File successfully written to: ${localAPIFilePathWithName}`);

            // Check if the file actually exists
            if (FILE_SYSTEM.existsSync(localFilePath)) {
                logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : File confirmed at path: ${localAPIFilePathWithName}`);
            } else {
                logger.log('error', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : File not found at path: ${localAPIFilePathWithName}`);
                return { uploadFileResponse: false, SFTPConnection: false };
            }

            // Read the file data from local API server
            // const fileDataObject = FILE_SYSTEM.readFileSync(localAPIFilePathWithName);

            // Upload the file to SFTP server
           
            // connect to sftp server
            await sftp.connect(SFTP_CONNECTION_CONFIG);
            logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : SFTP server connected successfully.`);
            await sftp.fastPut(localAPIFilePathWithName, SFTPfilePath + OriginalFileName); // taking the file from APi server and dump file to sftp location
            // await sftp.put(fileDataObject, SFTPfilePath + OriginalFileName); // dump file to sftp location
            logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : File uploaded to SFTP server at path: ${SFTPfilePath}`);
            FILE_SYSTEM.unlinkSync(localAPIFilePathWithName) //deleting the file to from local API server
            return { uploadFileResponse: true, SFTPConnection: true };

        } catch (error) {
            logger.log('error', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : Error occurred. ${error.stack}`);
            return { uploadFileResponse: false, SFTPConnection: false };
        } finally {
            await sftp.end();
            logger.log('info', `User Id : ${userIdFromToken} : BinaryData : uploadFileToRemoteServer : Execution finished.`);
        }
    }

    removeDuplicateEmailIDs(emailString) {
        const emails = emailString.split(",").map(email => email.trim());
        const uniqueEmails = [...new Set(emails)];
        const uniqueEmailString = uniqueEmails.join(",");
        return uniqueEmailString;
    }

    removeDuplicateGUIDs(emailString) {
        let inAppUserList   = emailString.split(',')
                            .filter(item => item && item !== 'undefined' && item != 'null')
                            .filter((value, index, self) => self.indexOf(value) === index)
                            .join(',');
       
        return inAppUserList;
    }

    /**
     * This function will read "secret.pem"  file and return secretkey
     */
    getAppSecretKey(){
        try {
            var key                         = FILE_SYSTEM.readFileSync(SECRET_KEY_FILE_PATH, "utf8");
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
     * This function will merge date(2024-03-12T00:00:00.000Z)and time(21:08) into format 2024-03-12T21:08:00.000Z
     * @param {*} userIdFromToken
     * @param {*} dateValue
     * @param {*} timeValue
     */
    async mergeDateAndTime(userIdFromToken, dateValue, timeValue){
        try {   
            logger.log('info', 'User Id : '+ userIdFromToken +' : mergeDateAndTime : Execution end.');   
            let date = dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
            let dateTimeArr = dateValue.includes('T') ? dateValue.split('T')[1].split('.')[0].split(':') : ['00','00'];
            let hours = timeValue.split(':')[0];
            let minutes = timeValue.split(':')[1];
        
            dateTimeArr[0] = hours;
            dateTimeArr[1] = minutes;

            let time = dateTimeArr[0] + ':' + dateTimeArr[1] + ':' + dateTimeArr[2];
            let formatDate = date+ "T" + time  +'.000Z';

            logger.log('info', 'User Id : '+ userIdFromToken +' : mergeDateAndTime : Execution end.');
            return formatDate.toString();
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': mergeDateAndTime : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
        }
    }

    /**
    * This function with merge date(2024-03-12)and time(01:51:00.0000000) into format 2024-03-12T01:51:00.000Z
    * @param {*} userIdFromToken
    * @param {*} dateValue
    * @param {*} timeValue
    */
    async formatMergeDateTime(userIdFromToken,dateValue,timeValue){
        try {   
            logger.log('info', 'User Id : '+ userIdFromToken +' : formatMergeDateTime : Execution end.');   
           
            let date = (dateValue.toISOString()).split('T')[0];
            let time = (timeValue.toISOString()).split('T')[1].split('.')[0];
        
            let formatDate = date + "T" + time  +'.000Z';

            logger.log('info', 'User Id : '+ userIdFromToken +' : formatMergeDateTime : Execution end.');
            return formatDate;
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': formatMergeDateTime : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
        }
    }

    /**
     * This function to split 2024-03-12T01:51:00.000Z into format (2024-03-12)and time(01:51)
     * @param {*} userIdFromToken
     * @param {*} dateValue
     */
    async formatSplitDateTime(userIdFromToken, dateValue){
        try {   
            logger.log('info', 'User Id : '+ userIdFromToken +' : formatSplitDateTime : Execution end.');
           
            let date = (dateValue.toISOString()).split('T')[0];
            let time = (dateValue.toISOString()).split('T')[1].split('.')[0].substring(0,5);
            let result = {date: date, time: time};
            
            logger.log('info', 'User Id : '+ userIdFromToken +' : formatSplitDateTime : Execution end' + JSON.stringify(result) + '.');
    
            return result;
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': formatSplitDateTime : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    /**
     * This function with date/time validation
     * @param {*} userIdFromToken
     * @param {*} startDateValue
     * @param {*} startTimeValue
     * @param {*} endDateValue
     * @param {*} endTimeValue
     * @param {*} includeTime
     * @param {*} includePast
     */
    async checkDateTimeValidation(userIdFromToken, startDateValue, startTimeValue, endDateValue, endTimeValue, includeTime, includePast, actionPlan){
        try {   
            logger.log('info', 'User Id : '+ userIdFromToken +' : checkDateTimeValidation : Execution starts.');   

            let dateFormat      = new Date().toISOString().split('T')[0]
            let presentDateTime = dateFormat + "T00:00:00.000Z";
            if(!startDateValue.includes('T'))   startDateValue  = startDateValue + "T00:00:00.000Z";
            if(!endDateValue.includes('T'))     endDateValue    = endDateValue + "T00:00:00.000Z";

            logger.log('info', 'User Id : '+ userIdFromToken +' : checkDateTimeValidation : presentDateTime, startDateValue, startTimeValue, endDateValue, endTimeValue, includeTime' + presentDateTime+ startDateValue+ startTimeValue+ endDateValue+ endTimeValue+ includeTime);

            if (!includePast && (startDateValue < presentDateTime || endDateValue < presentDateTime)) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PRESENT_DATE_TIME_ERROR};
            }

            if (startDateValue > endDateValue) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DATE_DIFFERENCE_ERROR};
            }

            if ((!includeTime && startDateValue === endDateValue) && !actionPlan) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SAME_DATE};
            }

            if (includeTime && startDateValue === endDateValue && ((startTimeValue > endTimeValue) || (startTimeValue == endTimeValue))) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TIME_DIFFERENCE_ERROR};
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : checkDateTimeValidation : Execution ends.');  
            return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.VALID_DATE_TIME};

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': checkDateTimeValidation : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    /**
     * This function with date/time validation
     * @param {*} userIdFromToken
     * @param {*} startDateValue
     * @param {*} startTimeValue
     * @param {*} endDateValue
     * @param {*} endTimeValue
     * @param {*} includeTime
     * @param {*} includePast
     */
    async checkDateTimeValidationForEdit(userIdFromToken, startDateValue, startTimeValue, endDateValue, endTimeValue, includeTime, includePast, isStartDateModified, isEndDateModified, actionPlan){
        try {   
            logger.log('info', 'User Id : '+ userIdFromToken +' : checkDateTimeValidationForEdit : Execution starts.');   

            let dateFormat      = new Date().toISOString().split('T')[0]
            let presentDateTime = dateFormat + "T00:00:00.000Z";
            if(!startDateValue.includes('T'))   startDateValue  = startDateValue + "T00:00:00.000Z";
            if(!endDateValue.includes('T'))     endDateValue    = endDateValue + "T00:00:00.000Z";

            logger.log('info', 'User Id : '+ userIdFromToken +' : checkDateTimeValidationForEdit : presentDateTime, startDateValue, startTimeValue, endDateValue, endTimeValue, includeTime, includePast, isStartDateModified, isEndDateModified, actionPlan : ' + presentDateTime + startDateValue + startTimeValue+ endDateValue + endTimeValue + includeTime +  includePast + isStartDateModified + isEndDateModified + actionPlan);

            if (!includePast && (isStartDateModified && (startDateValue < presentDateTime))) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.START_DATE_TIME_ERROR};
            }

            if (!includePast && (isEndDateModified && (endDateValue < presentDateTime))) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.END_DATE_TIME_ERROR};
            }

            if (startDateValue > endDateValue) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DATE_DIFFERENCE_ERROR};
            }

            if ((!includeTime && startDateValue === endDateValue) && !actionPlan) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SAME_DATE};
            }

            if (includeTime && startDateValue === endDateValue && ((startTimeValue > endTimeValue) || (startTimeValue == endTimeValue))) {
                return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TIME_DIFFERENCE_ERROR};
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : checkDateTimeValidationForEdit : Execution ends.');  
            return {flag: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.VALID_DATE_TIME};

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +': checkDateTimeValidationForEdit : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    // Convert 24-hours time to 12-hours format time
    convertTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = (hours % 12) || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
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
            logger.log('error', 'UtilityApp(ORM) : getAccountNameFromToken : Error details :' + error);
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
            logger.log('info', 'UtilityApp(BCM) : getAccountGUIDFromToken :  BCM : DECODED_TOKEN : ' + JSON.stringify(decodedToken));
            accountNameFromToken = decodedToken.payload.accountName;            // getting user name from token

            const ACCOUNT_GUID_FROM_NAME = await commonDbObject.getAccountIdByAccountName(accountNameFromToken);
            logger.log('info', 'UtilityApp(BCM) : getAccountGUIDFromToken :  BCM : ACCOUNT_GUID_FROM_NAME : ' + JSON.stringify(ACCOUNT_GUID_FROM_NAME));

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
            logger.log('info', 'UtilityApp(BCM) : getAccountGUIDFromToken :  BCM : ACCOUNT_TOKEN_OBJECT : ' + JSON.stringify(accountGUIDFromTokenObj));
            return accountGUIDFromTokenObj;

        } catch (error) {
            logger.log('error', 'UtilityApp(BCM) : getAccountGUIDFromToken : Error details :' + error);
            accountGUIDFromTokenObj.error = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            accountGUIDFromTokenObj.accountGUID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            return accountGUIDFromTokenObj;
        }
    }
  
}
