const { min } = require('moment');
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
    APP_START_PORT          : 9002,         // Port for API server run on
    APP_AUTHENTICATION_MODE : 3,             /**
                                                Values for APP_AUTHENTICATION_MODE
                                                1 - AD (Active Directory) Authentication,
                                                2 - ADFS (Active Directory Federation Services) Authentication, (Not suppoerted right now)
                                                3 - Application Authentication, (Not suppoerted right now)
                                             */
    APP_ADMIN_USER_NAME     : "",
    APP_ADMIN_PASSWORD      : "",
    PATH                    : PATH_OBJ.join(__dirname, '../'),
    ALLOWED_ORIGINS         : (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []).concat(["http://localhost:5000","http://localhost:9002","http://localhost:4200","http://10.0.1.32:8080","http://127.0.0.1:8080","http://10.0.1.32:80","http://127.0.0.1:80"])       // Allowed origins; set ALLOWED_ORIGINS env to add more
};

const MFA_CONFIG = {
    IS_MFA :  false  // MFA authentication for login(otp required) should be false in case of AD auth
}


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
    TOKEN_USES_NOT_BEFORE_IN_MILLISECONDS : 2000                // JWT token uses not before (In Milliseconds), Means after token creation, we can not use token verification for define time. It is to prevent robotic access of application.
};

/**
 * Application log related configurations variable.
 */
const LOG_CONFIG = {
    FILE_SIZE           : 5,                // Maximum size of log file in MB (Megabyte). After that new file will get created for same day.
    ERROR_LOG_FILE_NAME : "error_log",      // Application error log file name.
    NOTIFICATION_ERROR_LOG_FILE_NAME : "notification_log",
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
 * In Docker set AUTH_SERVICE_URL=http://authapi:6001
 */
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:9001";

// Add/Remove whichever the module required in UM(with role Power User or Standard User or FA) 
const MODULE_LIST = [
	{
		"ModuleAbbreviation": "ORM",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false,
        "headColor" : "#E0F4E8",
        "rowColor" : "#F2FFEF"
	},
	{
		"ModuleAbbreviation": "BCM",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false,
        "headColor" : "#F4E0E0",
        "rowColor" : "#FAF7F7"
	},
	{
		"ModuleAbbreviation": "DMS",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false,
        "headColor" : "#E0EEF4",
        "rowColor" : "#EFF8FF"
	}, 
	{
		"ModuleAbbreviation": "TPTrac",
		// "RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false,
        "headColor" : "#E4E0F4",
        "rowColor" : "#F5EFFF"
	}
]

const SU_PU_MODULE_LIST = [
	{
		"ModuleAbbreviation": "ORM",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false
	},
	{
		"ModuleAbbreviation": "BCM",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false
	},
	{
		"ModuleAbbreviation": "DMS",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false,
	}, 
	{
		"ModuleAbbreviation": "TPTrac",
		"RoleID": 5,
		"IsFunctionalAdmin": false,
		"IsSelected": false
	}
]

const UM_ROLE_MODULE_LIST = [
    {
		"ModuleAbbreviation": "UM",
        "ModuleName" : "User Management",
		"RoleID": 3,
	}
]

const SUPER_ADMIN_ROLE_MODULE_LIST = [
    {
		"ModuleAbbreviation": "UM",
        "ModuleName" : "User Management",
		"RoleID": 1,
	},
    {
		"ModuleAbbreviation": "ORM",
        "ModuleName" : "Operational Risk Management",
		"RoleID": 1,
	}
]

// ModuleAbbreviation is coming from DB should not be changed it will affect for login
const Module_List = [
    {
		"ModuleAbbreviation": "ORM",
        "ModuleName" : "ORM",
	},
    {
		"ModuleAbbreviation": "BCM",
        "ModuleName" : "BCM",
	},
    {
		"ModuleAbbreviation": "DMS",
        "ModuleName" : "DMS",
	},
    {
		"ModuleAbbreviation": "TPTrac",
        "ModuleName" : "TPTrac",
	},
    {
		"ModuleAbbreviation": "UM",
        "ModuleName" : "UM",
	}
]

//Module abbreviation for TpTrac should be changed in both TPT_MOD_ABBR and MODULE_LIST (ModuleAbbreviation)
const TPT_MOD_ABBR = {
	ModuleAbbreviation : "TPTrac",
}
// Below are the modules abbreviation that unit validation is required
const ALLOWED_MODULES_ADD_UNITS = {
    AllowedModuleAbbreviation   : ["ORM", "BCM"]
} 

const VALIDATE_MOB_NO = [
	{
		"ValidateMobNo" 		: true,
		"MobNoRange" 			: [6,15],
		"validateEmailIDDomain" : false // if domain validation required or not while add/edit user in user management
	}
]
const LOCAL_PASSWORD = {
	PASSWORD_LEN : 5,
	MINIMUM	     : 5,
	MAXIMUM	     : 15
}

const OTP_CONFIG = {
    WRONG_OTP_ATTEMPT_NUMBER       : 3,
    NUMBER_OF_DIGITS_IN_OTP        : 4,    // Number of digits in OTP(Min = 4,Max = 8 and Default = 6 else Application not support).
    OTP_EXPIRATION_TIME_IN_MINUTES : 2,   // OTP expiry time (In minutes),Expiration time should be less than resend otp time .
    RESEND_OTP_TIME_IN_SECONDS     : 120 //120   // Time required for requesting resend OTP (In seconds), resend otp time should not exceed otp expiration time.
}

const DATE_FORMAT_CONFIG = {
    DATE_FORMAT:  'DD/MM/YYYY'   // This Date format will be default and used in UI overall application,
    // (DD-MM-YYYY,DD-MM-YYYY,MM-DD-YYYY,MM/DD/YYYY) can be used as other date formats
}

const PASSWORD_CONFIG = {
    CHECK_FOR_USER_CREDENTIAL_HISTORY 	: 2,           // check The number of previous passwords cannot be reused. START
    REQUIRED_OTP_FOR_CHANGE_PASSWORD 	: true   //  change password requires OTP verification.
}

const CHANGE_PASSWORD_CONFIG = {
    MIN_LENGTH       : 8,        //Validate that the field has minimum characters
    MAX_LENGTH       : 20,       //Validate that the field has maximum characters
    REGEXP_REFERENCE : "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@$%#^&*()_+|\\-=\\{}'`;:<>?,.\/])[A-Za-z0-9!@$%#^&*()_+|\\-=\\{}'`;:<>?,.\/]*$",
                        /* regular expression used to check password is correct or not ---
                            - ^: Asserts the start of the string.
                            - (?=.*[a-z]): Positive lookahead assertion for at least one lowercase letter (a-z).
                            - (?=.*[A-Z]): Positive lookahead assertion for at least one uppercase letter (A-Z).
                            - (?=.*\d): Positive lookahead assertion for at least one digit (\d).
                            - (?=.*[!@$#%^&*()_+|\\-=\\{}'`;:<>?,.\/]): Positive lookahead assertion for at least one special character from the set !@#$%^&*.
                            - .+: Matches one or more of any character.
                            - $: Asserts the end of the string.
                        */
	TOOL_TIP_MESSAGE : "\n* Password Policy:\n- Password Range min = 8 , max = 20.\n- It should contains minimum 1 uppercase, 1 lowercase, 1 digit & 1 special character.\n- Password should not be same as username.\n- Last (2) passwords cannot be reused.\n- Allowed special characters [!@$#%^&*()_+|\\-=\\{}';:<>?,./].\n"  
}

const OTP_CONFIG_FOR_CHANGE_PASSWORD = {
    OTP_EXPIRATION_TIME_IN_MINUTES :   10,   // OTP 5-20 expiry time (In minutes),Expiration time should be less than resend otp time .
    RESEND_OTP_TIME_IN_SECONDS     :   60    // Time required for requesting resend OTP (In seconds), resend otp time should not exceed otp expiration time.
}

const USER_NAME_CONFIG = {
    MIN_LENGTH       :  6,       //Validate that the field has minimum 6 characters
    MAX_LENGTH       :  50,       //Validate that the field has maximum  8 characters
    REGEXP_REFERENCE :  '^[a-zA-Z][a-zA-Z0-9]*$',
                        /* ^[a-zA-Z][A-Za-z0-9]*$ matches strings that start with a letter and are followed by letters or digits.
                            | acts as an OR operator to allow either of the patterns.
                            ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ matches a standard email address format:
                            [a-zA-Z0-9._%+-]+ allows letters, numbers, and some special characters.
                            @[a-zA-Z0-9.-]+ matches the domain part before the dot.
                            \.[a-zA-Z]{2,}$ ensures a valid top-level domain, with a minimum of two letters.
                        */
    MESSAGE          :  'User Name should contain (A-Z,a-z), (0-9) and 6 - 50 characters long.'  ,
}

const USER_ID_CONFIG = {
    MIN_LENGTH       :  6,       //Validate that the field has minimum characters(6 to 10)
    MAX_LENGTH       :  50,       //Validate that the field has maximum characters(6 to 25)
    REGEXP_REFERENCE :  '^[a-zA-Z][A-Za-z0-9]*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    MESSAGE          :  'User ID range should be 6 to 50 and (A-Z,a-z,0-9,domain) characters allow only.'                   
}

const CRON_JOBS_FREQUENCY = {
    frequency30Sec          : "*/30 * * * * *'",    // 30 Sec 
	frequency1Min           : "*/1 * * * *" ,      // 10 mins  
    frequency10Min          : "*/10 * * * *" ,      // 10 mins    
    frequency6Hr            : "0 */6 * * *" ,       // every 6th hour  
    frequency12Hr           : "*/10 * * * *" ,      // every 12th hour 
    frequencyonceADay       : "0 0 * * *" ,         // once a day
    frequencyEveryDayat1AM  : "0 1 * * *" ,         // Cron job every day at 1am     
    frequencyEveryDayat8AM  : "0 8 * * *",           // Cron job every day 8am  
    frequencyCustomized     : "*/30 * * * * *'",     // Change the desired frequency value here, no need to change in the message-queue-util.js file
}

const SE_GRC_APP_URL = {
    DEV		 : "https://serisktracgrcdev.secureyes.net/", 
    QA       : "https://serisktracgrcqa.secureyes.net/",
    UAT      : "http://192.168.4.80/",
    PROD     : "https://risktrac.amlakint.com/",
    PRE_PROD : "http://risktracdev.secureyes.net:5000",
}

const FUNCTIONALITY_CONFIG = {
    IS_TWOFA :  false   // By default 2FA authentication is disabled.
}

const LOGIN_PAGE_DATA = {
    LOGIN_PAGE_DESC : "SE-TPTRAC provides a comprehensive platform for efficiently managing third party risks throughout the entire supplier life cycle by  defining, assessing, and monitoring  of these  risks in a streamlined manner.",
    LANDING_TEXT    : "SE-GRC",
    LANDING_EMAILID : "tptracsupport@secureyes.net"
}

/**
*  Exporting contains of file
*/
module.exports = {
    APP_SERVER                  	    : APP_SERVER,
    APP_SECURITY                	    : APP_SECURITY,
    JWT_TOKEN                   	    : JWT_TOKEN,
    LOG_CONFIG                  	    : LOG_CONFIG,
    AUTH_SERVICE_URL            	    : AUTH_SERVICE_URL, 
	LOCAL_PASSWORD					    : LOCAL_PASSWORD,
	VALIDATE_MOB_NO					    : VALIDATE_MOB_NO,
	DATE_FORMAT_CONFIG				    : DATE_FORMAT_CONFIG,
	OTP_CONFIG						    : OTP_CONFIG,
	PASSWORD_CONFIG					    : PASSWORD_CONFIG,
	CHANGE_PASSWORD_CONFIG			    : CHANGE_PASSWORD_CONFIG,
	OTP_CONFIG_FOR_CHANGE_PASSWORD	    : OTP_CONFIG_FOR_CHANGE_PASSWORD,
	USER_NAME_CONFIG				    : USER_NAME_CONFIG,
	USER_ID_CONFIG					    : USER_ID_CONFIG,
	TPT_MOD_ABBR					    : TPT_MOD_ABBR,
	CRON_JOBS_FREQUENCY				    : CRON_JOBS_FREQUENCY,
	SE_GRC_APP_URL					    : SE_GRC_APP_URL,
	FUNCTIONALITY_CONFIG			    : FUNCTIONALITY_CONFIG,
	MFA_CONFIG						    : MFA_CONFIG,
    LOGIN_PAGE_DATA                     : LOGIN_PAGE_DATA,
    ALLOWED_MODULES_ADD_UNITS           : ALLOWED_MODULES_ADD_UNITS,
    MODULE_LIST                 	    : MODULE_LIST,
    SU_PU_MODULE_LIST           	    : SU_PU_MODULE_LIST,
    UM_ROLE_MODULE_LIST         	    : UM_ROLE_MODULE_LIST,
    SUPER_ADMIN_ROLE_MODULE_LIST 	    : SUPER_ADMIN_ROLE_MODULE_LIST,
    Module_List                         : Module_List
};