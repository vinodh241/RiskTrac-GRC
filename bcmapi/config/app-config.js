const PATH_OBJ              = require('path');


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
    APP_START_PORT          : 9004,         // Port for API server run on
    APP_AUTHENTICATION_MODE : 1,             /**
                                                Values for APP_AUTHENTICATION_MODE
                                                1 - AD (Active Directory) Authentication,
                                                2 - ADFS (Active Directory Federation Services) Authentication, (Not suppoerted right now)
                                                3 - Application Authentication, (Not suppoerted right now)
                                             */
    APP_ADMIN_USER_NAME     : "",
    APP_ADMIN_PASSWORD      : "",
    PATH                    : PATH_OBJ.join(__dirname, '../'),
    ALLOWED_ORIGINS         : (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []).concat(["http://localhost:5000","http://localhost:9004","http://localhost:4200","http://10.0.1.32:8080","http://127.0.0.1:8080","http://10.0.1.32:80","http://127.0.0.1:80"])
};

/**
 * Application security related configurations variable.
 */
const APP_SECURITY = {
    LOGIN_PAGE_EXPIRE_TIME_SECONDS   : 600,          // Login page expiration time in seconds
    ENCRYPTION_SEPARATOR             : "--",        // Encryption separtor will get use in encryption and decryption to separate two or more then two string.
    WRONG_LOGIN_ATTEMPT_NUMBER       : 3,           // Number of wrong login attempts by user.
    USER_ACCOUNT_LOCK_TIME_IN_MIN    : 60           // Account lock time in minutes once wrong login attempts number exceeded.
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
    FILE_SIZE                           : 5,                // Maximum size of log file in MB (Megabyte). After that new file will get created for same day.
    ERROR_LOG_FILE_NAME                 : "error_log",      // Application error log file name.
    NOTIFICATION_ERROR_LOG_FILE_NAME    : "notification_error_log",
    
    /**
     * Configure log level, LOG_LEVEL value is
     * info     : Then error log file will have info and error messages
     * error    : Then error log file will have only error messages
     * 
     * For UAT and Production we do not required to write other then error messages 
     */
    LOG_LEVEL   : "info"
};

/**
 * If AMLAK Auth application deployed into local machine
 */
const AUTH_SERVICE_URL = "http://localhost:9001";

/**
 * If AMLAK Auth application deployed into development VM machine
 */
 
//  const PROD_SERVICE_URL = "http://risktracdev.secureyes.net:5000";

const RISKTRAC_WEB_URL = {
    DEV: "https://serisktracdev.secureyes.net/", 
    QA: "https://serisktracqa.secureyes.net/",
    UAT: "http://192.168.4.80/",
    PROD: "https://risktrac.amlakint.com/",
    PRE_PROD : "http://risktracdev.secureyes.net:5000",
}


// * Seconds: 0-59  */30  --> 30 sec
// * Minutes: 0-59
// * Hours: 0-23
// * Day of Month: 1-31
// * Months: 0-11 (Jan-Dec) <-- currently different from Unix cron!
// * Day of Week: 0-6 (Sun-Sat)

// # * * * * *  command to execute
// # │ │ │ │ │
// # │ │ │ │ │
// # │ │ │ │ └───── day of week (0 - 6) (0 to 6 are Sunday to Saturday, or use names; 7 is Sunday, the same as 0)
// # │ │ │ └────────── month (1 - 12)
// # │ │ └─────────────── day of month (1 - 31)
// # │ └──────────────────── hour (0 - 23)
// # └───────────────────────── min (0 - 59)

const CRON_JOBS_FREQUENCY = {
    frequency30Sec          : "*/30 * * * * *'",    // 30 Sec 
    frequency10Min          : "*/10 * * * *" ,      // 10 mins    
    frequency6Hr            : "0 */6 * * *" ,       // every 6th hour  
    frequency12Hr           : "*/10 * * * *" ,      // every 12th hour 
    frequencyonceADay       : "0 0 * * *" ,         // once a day
    frequencyEveryDayat1AM  : "0 1 * * *" ,         // Cron job every day at 1am     
    frequencyEveryDayat8AM  : "0 8 * * *",           // Cron job every day 8am  
    frequencyCustomized     : "0 8 * * *",     // Change the desired frequency value here, no need to change in the message-queue-util.js file
}

// mark it to true to run the cron job based on module
const ACTIVATE_CRON_JOB = {
    enableRMTCronJob        : false,
    enableSRACronJob        : false,
}
// set the frequency in days based on when an email should get triggere before action item reaching the target date
const RMT_FREQUENCY = {
    RMT_FREQUENCY_IN_DAYS : 5
}

const BASEURL = {
PATH    : PATH_OBJ.join(__dirname, '../')
};

const ALLOWED_MODULE_ABBREVIATION = {
    ABBREVIATION  : 'BCM'
}

const FILE_UPLOAD = {

    FILE_SIZE                               : 10,       // Supported maximum file size in MB (Megabyte) to be upload   
    ATTACHMENTS_DESTINATION_PATH            : BASEURL.PATH + "file-upload/crisis-management/attachments/temp",
    ATTACHMENTS_DESTINATION_PATH_SERVER     : '/RiskTrac/BCM/',
    ATTACHMENTS_FILE_EXTENSIONS_LIST        : [".xlsx", ".pdf",".docx",".jpeg",".jpg",".png"],
    ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER : ["xlsx", "pdf","docx","jpeg","jpg","png"],
    ATTACHMENTS_FILE_MIME_TYPES             : [  
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // Mime type for .xlsx    
                                                "application/pdf",                                                          // Mime type for .pdf
                                                "image/jpeg",  
                                                "image/jpg",                                                                // Mime type for .jpg
                                                "image/png",                                                                // Mime type for .png
                                                "message/rfc822",                                                           // Mime type for .jpeg
                                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"   // Mime type for .docx
                                            ], 
};

const REMEDIATION_TRACKER_FILE_UPLOAD = {
    FILE_SIZE                               : 10,       // Supported maximum file size in MB (Megabyte) to be upload   
    ATTACHMENTS_DESTINATION_PATH            : BASEURL.PATH + "file-upload/remediation-tracker/attachments/temp",
    ATTACHMENTS_DESTINATION_PATH_SERVER     : '/RiskTrac/BCM/',
    ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER : ["xlsx", "pdf","docx","jpeg","jpg","png"],
    ATTACHMENTS_FILE_EXTENSIONS_LIST        : [".xlsx", ".pdf",".docx",".jpeg",".jpg",".png"],
    ATTACHMENTS_FILE_MIME_TYPES             : [  
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // Mime type for .xlsx    
                                                "application/pdf",                                                          // Mime type for .pdf
                                                "image/jpeg",  
                                                "image/jpg",                                                                // Mime type for .jpg
                                                "image/png",                                                                // Mime type for .png
                                                "message/rfc822",                                             // Mime type for .jpeg
                                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"   // Mime type for .docx
                                            ], 
};

const EVIDENCE_UPLOAD = {           // This is used for SRA,Incident and BCMS Testing evidence upload
    FILE_SIZE                               : 10,       // Supported maximum file size in MB (Megabyte) to be upload   
    ATTACHMENTS_DESTINATION_PATH            : BASEURL.PATH + "file-upload/evidences/temp",
    ATTACHMENTS_DESTINATION_PATH_SERVER     : '/RiskTrac/BCM/',
    ATTACHMENTS_FILE_EXTENSIONS_LIST_SERVER : ["xlsx", "pdf","docx","jpeg","jpg","png"],
    ATTACHMENTS_FILE_EXTENSIONS_LIST        : [".xlsx", ".pdf",".docx",".jpeg",".jpg",".png"],
    ATTACHMENTS_FILE_MIME_TYPES             : [  
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // Mime type for .xlsx    
                                                "application/pdf",                                                          // Mime type for .pdf
                                                "image/jpeg",  
                                                "image/jpg",                                                                // Mime type for .jpg
                                                "image/png",                                                                // Mime type for .png
                                                "message/rfc822",                                             // Mime type for .jpeg
                                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"   // Mime type for .docx
                                            ], 
};


const COMPUTATIONAL_FORMULA = {
    RISK_RATING_FORMULA : "likelihoodID * impactID"             // parameters likelihoodID & impactID cannot be modified if it got modified code will break
}

const CLIENT_NAME_CONFIG    = {
    CLIENT_NAME         : "AMLAK"                           // This parameter is used for Crisis Communication for [[recipient_org]] mapping
}

const EXPORT_FILE_LIMIT = {
    SRA_EXPORT_LIMIT        : 5,                            //This paramter is used in SRA for consolidated export report ,if no limit required pass the value as NULL (Default Limit = 5)
    INC_EXPORT_LIMIT        : 100,                          //This paramter is used in Incident for consolidated export report ,if no limit required pass the value as NULL (Default Limit = 100)
    BCP_EXORT_LIMIT         : 5                             // This parameter is used in BCP for consolidated export report, if no limit required pass the value as NULL (Default Limit = 5)
}


let SFTP_CONFIG = {
    host        : '10.0.1.30',
    port        : 22,
    username    : 'sftpuser@secureyesdev.com',
    password    : 'IFza31oNLRt/eFyYAE+9SKTHzSFpB3xTkZ+IqlSqE7MTbFjN2X9AsnDxv2XbOdQyW3ro5W6S+Eg/AaPvxEHClKUaezPKZS/Bu3RWGtktip9m56wFTJ/RFvZ9LUNJLkeU1GfOix+WWo8UiliWhlua7Bst6eqpwWnTuoWNSN8jg4HXc7IWUE0tKIo+puTe6p0xEGY367t2Cs6bKRKGcMKncJMHIfzpXupRyAmIJ010s0oHJrg/t2seRfGgYytp6dnjAUGqXnHfNTB0ENTa2SF2kBjvgyjhiTDyvE1o2/CPTvnRh7UpZh5tLOLkdKo7A2+70WWxIq1OD913Nlaz4hxVkaeeU4QLB88l1vchni1UDJij23Ne3hGPux/Ju4a51+j0yuin1QisRRp2V43GDKFDxEPfopZKFDz/76cNYvwNdLjPwNygupVRkmANT54bbXXHNrT6p/uImz+snUpzOaL8uXwijki4c1PyS6zzCzkb3ioWBt5TeOz+XiqNmde9zUOiFtZn18SaWJILsy1ZJFP3omFE0SNDzS/sTHRrBtiYEeRDqLGyTtH3x9bnIgvEVoXzcudo7s4p/jSKzuwerLiqPaImN2TZx3R11wIw2ud5S2zzGT5K26Wtn/r+LN+HKpC+lsiwBdz2yY2YBA41FOMFPJfO/TRy5pB5z+47kyA+Fyw='
};


/**
*  Exporting contains of file
*/
module.exports = {
    APP_SERVER                      : APP_SERVER,
    APP_SECURITY                    : APP_SECURITY,
    JWT_TOKEN                       : JWT_TOKEN,
    LOG_CONFIG                      : LOG_CONFIG,
    AUTH_SERVICE_URL                : AUTH_SERVICE_URL,
    FILE_UPLOAD                     : FILE_UPLOAD,
    RISKTRAC_WEB_URL                : RISKTRAC_WEB_URL,
    COMPUTATIONAL_FORMULA           : COMPUTATIONAL_FORMULA,
    CRON_JOBS_FREQUENCY             : CRON_JOBS_FREQUENCY,
    CLIENT_NAME_CONFIG              : CLIENT_NAME_CONFIG,
    REMEDIATION_TRACKER_FILE_UPLOAD : REMEDIATION_TRACKER_FILE_UPLOAD,
    EVIDENCE_UPLOAD                 : EVIDENCE_UPLOAD,
    SFTP_CONFIG                     : SFTP_CONFIG,
    EXPORT_FILE_LIMIT               : EXPORT_FILE_LIMIT,
    RMT_FREQUENCY                   : RMT_FREQUENCY,
    ACTIVATE_CRON_JOB               : ACTIVATE_CRON_JOB,
    ALLOWED_MODULE_ABBREVIATION     : ALLOWED_MODULE_ABBREVIATION
};