const APP_CONSTANT = {
    UNAUTHORIZED_ACCESS                 : "Unauthorized Access",        // Fail case of Role authentication
    INVALID_SESSION                     : "Invalid Session",            // Fail case of Token authentication
    UNABLE_TO_FETCH                     : "Unable to fetch",            // Case: No record found.
    DATA                                : "data",
    DENY                                : 'deny',
    BINARY                              : 'binary',
    BASE64                              : 'base64',

    /*************************************************************************************************** */
    AD_ERROR_CODE_WORNG_CRDENTIALS                      : "AcceptSecurityContext error, data 52e",
    AD_ERROR_USER_NOT_EXIST                             : "AcceptSecurityContext error, data 525",
    AD_ERROR_USER_NOT_PERMITTED_TO_LOGIN                : "AcceptSecurityContext error, data 530",
    AD_ERROR_USER_NOT_PERMITTED_TO_LOGIN_WORKSTATION    : "AcceptSecurityContext error, data 531",
    AD_ERROR_USER_PASSWORD_EXPIRED                      : "AcceptSecurityContext error, data 532",
    AD_ERROR_USER_ACCOUNT_DISABLED                      : "AcceptSecurityContext error, data 533",
    AD_ERROR_USER_ACCOUNT_EXPIRED                       : "AcceptSecurityContext error, data 701",
    AD_ERROR_CODE_FORCE_PASSWORD_CHANGE                 : "AcceptSecurityContext error, data 773",
    AD_ERROR_USER_ACCOUNT_LOCKED                        : "AcceptSecurityContext error, data 775",
    /*************************************************************************************************** */

    TOKEN_EXPIRED                       : "TOKEN_EXPIRED",
    PAGE_EXPIRED                        : "PAGE_EXPIRED",
    TRUE                                : true,
    FALSE                               : false,
    NULL                                : null,
    ADD                                 : "ADD",
    UPDATE                              : "UPDATE",
    UNDEFINED                           : undefined,
    COMMA                               : ',',
    FORWARD_SLASH                       : '/',
    UNDERSCORE                          : '_',
    AT_SYMBOL                           : '@',
    ONE_MEGABYTE                        : 1024*1024,
    ONE_SECONDE_IN_MILLISECONDS         : 1000,
    ONE_MINUTE_IN_MILLISECONDS          : 60000,
    SIXTY_SECONDS                       : 60,
    AD_AUTHENTICATION_MODE              : 1,
    ADFS_AUTHENTICATION_MODE            : 2,
    APP_AUTHENTICATION_MODE             : 3,
    ZERO                                : 0,
    ONE                                 : 1,
    TWO                                 : 2,
    THREE                               : 3,
    FOUR                                : 4,
    FIVE                                : 5,
    SIX                                 : 6,
    SEVEN                               : 7,
    EIGHT                               : 8,
    NINE                                : 9,
    TEN                                 : 10,
    ELEVEN                              : 11,
    FIFTY                               : 50,
    TWO_HUNDRED                         : 200,
    TWO_HUNDRED_FIFTY_SIX               : 256,
    FIVE_HUNDRED                        : 500,
    TWO_FIFTY_SIX                       : 256,
    MINUS_ONE                           : -1,
    MINUS_FIVE                          : -5,
    DEFAULT_ERROR_LOG_FILE_NAME         : "api_error_log",
    DEFAULT_LOG_LEVEL                   : "info",
    DEFAULT_PORT                        : 8001,
    DEV                                 : "DEV",
    QA                                  : "QA",
    PROD                                : "PROD",
    PRE_PROD                            : "PRE_PROD",
    UAT                                 : "UAT"
}

module.exports = {
    APP_CONSTANT      : APP_CONSTANT
};