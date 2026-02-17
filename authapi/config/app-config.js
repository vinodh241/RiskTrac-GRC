const PATH_OBJ = require('path');


/**
 * Application server related configurations variable.
 */
const APP_SERVER = {
    /**
     * This variable is use for to identify deployed environment, for select MO Application URL
     * Value will as below:
     * PROD         - PROD for Production environment
     * PRE_PROD     - PRE_PROD for Pre-Production (SIT) environment
     * UAT          - UAT for UAT environment
     * QA           - QA for QA environment
     * DEV          - DEV for DEV environment
     */
    ENVIRONMENT_NAME        : "DEV",
    APP_START_PORT          : 9001,         // Port for API server run on
    APP_AUTHENTICATION_MODE : 3,             /**
                                                Values for APP_AUTHENTICATION_MODE
                                                1 - AD (Active Directory) Authentication,
                                                2 - ADFS (Active Directory Federation Services) Authentication, (Not suppoerted right now)
                                                3 - Application Authentication, (Not suppoerted right now)
                                             */
    APP_ADMIN_USER_NAME     : "",
    APP_ADMIN_PASSWORD      : "",
    PATH                    : PATH_OBJ.join(__dirname, '../'),
    ALLOWED_ORIGINS         : (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []).concat(["http://localhost:5000","http://localhost:9001","http://localhost:4200","http://10.0.1.32:8080","http://127.0.0.1:8080","http://10.0.1.32:80","http://127.0.0.1:80"])
};

/**
 * Application security related configurations variable.
 */
const APP_SECURITY = {
    LOGIN_PAGE_EXPIRE_TIME_SECONDS   : 600,          // Login page expiration time in seconds
    ENCRYPTION_SEPARATOR             : "--",        // Encryption separtor will get use in encryption and decryption to separate two or more then two string.
    WRONG_LOGIN_ATTEMPT_NUMBER       : 5,           // Number of wrong login attempts by user.
    USER_ACCOUNT_LOCK_TIME_IN_MIN    : 1           // Account lock time in minutes once wrong login attempts number exceeded.
};

/**
 * JWT token related configurations variable.
 */
const JWT_TOKEN = {
    TOKEN_EXPIRY_TIME_IN_MINUTES          : 600,                // JWT token expiry time (In minutes).
    TOKEN_USES_NOT_BEFORE_IN_MILLISECONDS : 60000                // JWT token uses not before (In Milliseconds), Means after token creation, we can not use token verification for define time. It is to prevent robotic access of application.
};

/**
 * Application log related configurations variable.
 */
const LOG_CONFIG = {
    FILE_SIZE           : 5,                // Maximum size of log file in MB (Megabyte). After that new file will get created for same day.
    ERROR_LOG_FILE_NAME : "error_log",      // Application error log file name.
    
    /**
     * Configure log level, LOG_LEVEL value is
     * info     : Then error log file will have info and error messages
     * error    : Then error log file will have only error messages
     * 
     * For UAT and Production we do not required to write other then error messages 
     */
    LOG_LEVEL   : "info"
};
const FORCE_PASSWORD_CHANGE_AFTER_INTO_DAYS = {
    DAYS    : 45
}
/**
*  Exporting contains of file
*/
module.exports = {
    APP_SERVER          : APP_SERVER,
    APP_SECURITY        : APP_SECURITY,
    JWT_TOKEN           : JWT_TOKEN,
    LOG_CONFIG          : LOG_CONFIG,
    FORCE_PASSWORD_CHANGE_AFTER_INTO_DAYS : FORCE_PASSWORD_CHANGE_AFTER_INTO_DAYS
};