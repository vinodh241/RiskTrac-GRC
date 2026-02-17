const bcrypt                = require("bcrypt")
const CONSTANT_FILE_OBJ     = require('./constants/constant.js');
const APP_CONFIG_OBJ        = require('../config/app-config.js');

module.exports = class PasswordUtility {
    constructor() {
    }


     /**
     * This function will provided hashed password for the plainTextPassword        
     * @param {*} userIdFromToken
     * @param {*} password 
     */
    async getHashedPassword (userIdFromToken, plainTextPassword) {
        try {
            logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : getHashedPassword : Execution started.');
            
            const HASHED_PASSWORD= await this.generateSaltHashPassword(userIdFromToken, plainTextPassword);
            if(HASHED_PASSWORD != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || HASHED_PASSWORD != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {                
                logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : getHashedPassword : Execution End.');
                return HASHED_PASSWORD;
            } else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : getHashedPassword : Execution End. HASHED_PASSWORD is null or undefined');
                return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;         
            }          
        }
        catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : getHashedPassword Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    
    /**
     * This function will compare the plainTextPassword with hash        
     * @param {*} userIdFromToken
     * @param {*} plainTextPassword
     * @param {*} hash 
     */
    async comparePassword(userIdFromToken, plainTextPassword, hashPassword) {
        try {
            logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : comparePassword : Execution started.');
            
            const result = await bcrypt.compare(plainTextPassword, hashPassword);

            logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : comparePassword : Execution End.' + result);

            return result;
        }
        catch(error){
            logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : comparePassword: Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
       
    }


     /**
     * This function will generate Password         
     * @param {*} userIdFromToken
     */
     async generateSaltHashPassword (userIdFromToken, plainTextPassword) {
        try {
            logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltHashPassword : Execution started.');
            let passwordResponse = {
                randomPassword  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                hashPassword    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result          : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,   
                salt            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,   
            }
            let passwordLength   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let randomPassword   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let hashPassword     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            passwordLength       = APP_CONFIG_OBJ.LOCAL_PASSWORD.PASSWORD_LEN;
            let max              = APP_CONFIG_OBJ.LOCAL_PASSWORD.MAXIMUM;
            let min              = APP_CONFIG_OBJ.LOCAL_PASSWORD.MINIMUM;
            let saltvalue        = Math.floor(Math.random() * (max - min + 1)) + min;           
            const SALT           = await bcrypt.genSalt(saltvalue);

            //if  plainTextPassword is null it will generate the password text randomly
            if (plainTextPassword === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                randomPassword  = Math.random().toString(36).slice(-passwordLength);        
            } else {
                randomPassword  = plainTextPassword;
            }

            if(randomPassword != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && randomPassword != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                hashPassword = await bcrypt.hash(randomPassword, SALT);
                
                passwordResponse.randomPassword     = randomPassword;
                passwordResponse.hashPassword       = hashPassword;   
                passwordResponse.salt               = SALT
                passwordResponse.result             = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;   
                logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltHashPassword : Execution End. Password Generated Successfully');

                return passwordResponse;
            } else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltHashPassword : Execution end. Password Generated unuccessful');
                return passwordResponse;
            }         
        }
        catch(error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltHashPassword : Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }       
    }


    

     /**
     * This function will generate salt and hash the plainTextPassword with salt        
     * @param {*} userIdFromToken
     * @param {*} password 
     */
     async generateSaltAndHash(userIdFromToken, plainTextPassword) {
        try{
            logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltAndHash : Execution started.');
    
            let min = APP_CONFIG_OBJ.LOCAL_PASSWORD.MINIMUM;
            let max = APP_CONFIG_OBJ.LOCAL_PASSWORD.MAXIMUM;
            let response = {
                salt : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                hash : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            }
    
            //generating random number from 5-15 to generate salt
            let saltvalue = Math.floor(Math.random() * (max - min + 1)) + min;
            console.log('saltvalue : '+saltvalue)
            const SALT = await bcrypt.genSalt(saltvalue);
            console.log('SALT : '+SALT)

            if(SALT != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || SALT != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){

                // Hashing password with the generated salt
                const HASH = await bcrypt.hash(plainTextPassword, SALT);

                if(HASH != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || HASH != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){

                    logger.log('info', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltAndHash : Execution end.');
                    
                    response.salt = SALT;
                    response.hash = HASH;
                    
                    return response;
                    
                }else{

                    logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltAndHash : Execution end. HASH value is null or undefined');
                    return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                }

            }else{
                logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltAndHash : Execution end. SALT value is null or undefined');
                return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            }
    
        }catch(error){
            logger.log('error', 'User Id : '+ userIdFromToken +' : PasswordHashUtility : generateSaltAndHash :Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
        
    }
}


