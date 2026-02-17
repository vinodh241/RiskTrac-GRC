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
    APP_START_PORT          : 9003,         // Port for API server run on
    APP_AUTHENTICATION_MODE : 3,             /**
                                                Values for APP_AUTHENTICATION_MODE
                                                1 - AD (Active Directory) Authentication,
                                                2 - ADFS (Active Directory Federation Services) Authentication, (Not suppoerted right now)
                                                3 - Application Authentication, (Not suppoerted right now)
                                             */
    APP_ADMIN_USER_NAME     : "",
    APP_ADMIN_PASSWORD      : "",
    PATH                    : PATH_OBJ.join(__dirname, '../'),
    ALLOWED_ORIGINS         : (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []).concat(["https://serisktracgrcqa.secureyes.net","https://serisktracgrcdev.secureyes.net","http://localhost:5000","http://localhost:9003","http://localhost:4200","http://10.0.1.32:8080","http://127.0.0.1:8080","http://10.0.1.32:80","http://127.0.0.1:80"])
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
    DEV: "http://serisktracgrcdev.secureyes.net",
    QA: "https://serisktracgrcqa.secureyes.net",
    UAT: "http://192.168.4.80",
    PROD: "https://risktrac.amlakint.com",
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

const CronJobsFrequency = {
    frequency30Sec : "*/30 * * * * *'", // 30 Sec 
    frequency10Min : "*/2 * * * *" , // 10 mins    
    frequency6Hr : "0 */6 * * *" , // every 6th hour  
    frequency12Hr  : "*/10 * * * *" , // every 12th hour 
    frequencyonceADay : "0 0 * * *" , // once a day
    frequencyEveryDayat1AM : "0 1 * * *" ,  // Cron job every day at 1am     
    frequencyEveryDayat8AM : "0 8 * * *" ,  // Cron job every day 8am
    frequencyTesting : "05 15 * * *" ,  // Cron job every day 8am
    frequencyTwiceADay: "0 1,13 * * *"     // every day 1am and 1pm
}

const BASEURL = {
PATH    : PATH_OBJ.join(__dirname, '../')
};

const FILE_UPLOAD = {
    FRAMEWORK_SHEET_NAME                    : "RAS tracker",
    FILE_SIZE                               : 10,       // Supported maximum file size in MB (Megabyte) to be upload 
    FILE_PATH_SFTP_SERVER                   : '/RiskTrac/orm/',
    
    RISKAPPETITE_FRAMEWORK_DESTINATION_PATH : BASEURL.PATH + "file-upload/risk-appetite/framework/temp",
    RISKAPPETITE_POLICY_DESTINATION_PATH    : BASEURL.PATH + "file-upload/risk-appetite/policy/temp" ,
    RISKAPPETITE_TEMPLATE_DESTINATION_PATH  : BASEURL.PATH + "file-upload/risk-appetite/template/temp",
    EVIDENCE_DESTINATION_PATH               : BASEURL.PATH + "file-upload/evidence/temp",
    EVIDENCE_DESTINATION_PATH_FOR_RCSA      : BASEURL.PATH + "file-upload/rcsa/temp",

    RISK_APPETITE_DOCUMENTS_EXTENSIONS_LIST : [".xlsx", ".pdf",".jpg",".png",".eml"], 
    RISK_APPETITE_TEMPLATE_EXTENSIONS_LIST  : [".xlsx",".jpg",".png",".eml"],
    EVIDENCE_FILE_EXTENSIONS_LIST           : [".xlsx", ".pdf",".docx",".jpeg",".jpg",".png",".eml"],
    EVIDENCE_FILE_EXTENSIONS_LIST_RCSA      : [".xls",".xlsx", ".pdf", ".doc", ".docx", ".jpg", ".jpeg",".png",".eml"],

    RISK_APPETITE_DOCUMENTS_FILE_MIME_TYPES : [  
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // Mime type for .xlsx    
                                                "application/pdf" ,
                                                "image/jpg",                                                               
                                                "image/png",    
                                                "message/rfc822",                                                           
                                              ],
    RISK_APPETITE_TEMPLATE_FILE_MIME_TYPES  : [  
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                                "image/jpg",                                                                // Mime type for .jpg
                                                "image/png",    
                                                "message/rfc822",       
                                              ],
    EVIDENCE_FILE_MIME_TYPES                : [  
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // Mime type for .xlsx    
                                                "application/pdf",                                                          // Mime type for .pdf
                                                "image/jpeg",  
                                                "image/jpg",                                                                // Mime type for .jpg
                                                "image/png",    
                                                "message/rfc822",                                                             // Mime type for .jpeg
                                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"   // Mime type for .docx
                                               ], 
    EVIDENCE_FILE_MIME_TYPES_RCSA           : [  
                                                    "application/x-msi",
                                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // Mime type for .xlsx    
                                                    "application/pdf",                                                          // Mime type for .pdf
                                                    "image/jpeg",
                                                    "image/jpg",                                                                // Mime type for .jpg
                                                    "image/png",    
                                                    "message/rfc822", 
                                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                              ]
};

let SFTP_CONFIG = {
    host        : '10.0.1.30',
    port        : 22,
    username    : 'sftpuser@secureyesdev.com',
    password    : 'IFza31oNLRt/eFyYAE+9SKTHzSFpB3xTkZ+IqlSqE7MTbFjN2X9AsnDxv2XbOdQyW3ro5W6S+Eg/AaPvxEHClKUaezPKZS/Bu3RWGtktip9m56wFTJ/RFvZ9LUNJLkeU1GfOix+WWo8UiliWhlua7Bst6eqpwWnTuoWNSN8jg4HXc7IWUE0tKIo+puTe6p0xEGY367t2Cs6bKRKGcMKncJMHIfzpXupRyAmIJ010s0oHJrg/t2seRfGgYytp6dnjAUGqXnHfNTB0ENTa2SF2kBjvgyjhiTDyvE1o2/CPTvnRh7UpZh5tLOLkdKo7A2+70WWxIq1OD913Nlaz4hxVkaeeU4QLB88l1vchni1UDJij23Ne3hGPux/Ju4a51+j0yuin1QisRRp2V43GDKFDxEPfopZKFDz/76cNYvwNdLjPwNygupVRkmANT54bbXXHNrT6p/uImz+snUpzOaL8uXwijki4c1PyS6zzCzkb3ioWBt5TeOz+XiqNmde9zUOiFtZn18SaWJILsy1ZJFP3omFE0SNDzS/sTHRrBtiYEeRDqLGyTtH3x9bnIgvEVoXzcudo7s4p/jSKzuwerLiqPaImN2TZx3R11wIw2ud5S2zzGT5K26Wtn/r+LN+HKpC+lsiwBdz2yY2YBA41FOMFPJfO/TRy5pB5z+47kyA+Fyw='
};

const ALLOWED_MODULE_ABBREVIATION = {
    ABBREVIATION: 'ORM'
}


const RISK_AGE  = {
    RISK_AGE_IN : 'Day(s)'
}

/**
*  Exporting contains of file
*/
module.exports = {
    APP_SERVER                  : APP_SERVER,
    APP_SECURITY                : APP_SECURITY,
    JWT_TOKEN                   : JWT_TOKEN,
    LOG_CONFIG                  : LOG_CONFIG,
    AUTH_SERVICE_URL            : AUTH_SERVICE_URL,
    FILE_UPLOAD                 : FILE_UPLOAD,
    RISKTRAC_WEB_URL            : RISKTRAC_WEB_URL,
    CronJobsFrequency           : CronJobsFrequency,
    SFTP_CONFIG                 : SFTP_CONFIG,
    ALLOWED_MODULE_ABBREVIATION : ALLOWED_MODULE_ABBREVIATION,
    RISK_AGE                    : RISK_AGE
};