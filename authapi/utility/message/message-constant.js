const MESSAGE_CONSTANT = {
   /** If user requested unauthorized API, (User Role basis) */
   UNAUTHORIZED_ACCESS                          : "Unauthorized access.",

   /** If token in request does not match with data base token. */
   INVALID_SESSION                              : "Invalid session, please re-login.",

   /** Token is null in request.Or Request body is undefined */ 
   INVALID_REQUEST                              : "Invalid request, missing mandatory parameters.",

   /** Unable to read or parse the request */
   INCORRECT_REQUEST                            : "Invalid request.",

   /** Decryption failed (e.g. missing or invalid private key on server) */
   DECRYPTION_FAILED                            : "Server configuration error. Please contact administrator.",

   /** Page time out, (Page expired) */
   PAGE_EXPIRED                                 : "Webpage has expired, kindly refresh the page.",

   /** Username is null in request body or User name is empty in request body*/
   USER_NAME_NULL_EMPTY                         : "User id cannot be left blank.",

   /** Password is null in request body Or Password is empty in request body*/
   PASSWORD_NULL_EMPTY                          : "Password cannot be left blank.",

   /** Unable to update DB table */
   UNABLE_UPDATE_DB                             : "Unable to update the database, please try again.",

   /** Unbale to fetch from data base. */
   NO_RECORD_FOUND                              : "No records.",

   /** User name or password is incorrect */
   WRONG_CREDENTIALS                            : "Invalid credentials, please try again with valid credentials.",

   ACCOUNT_LOCK                                 : "User account is locked for ",

   /** AD Server unreachable */
   AD_SERVER_UNREACHABLE                        : "AD server is unreachable, please try again or contact the administrator.",

   /** Unable to fetch user id by user name from DB. Means user does not exist in the DB. */
   USER_NOT_EXISTING_IN_DB                      : "User is not authorized to use the application.",

/********************************************************/
   /** (data 525) - Returned when an invalid username is supplied. */
   AD_USER_NOT_EXIST                            : "User account does not exist in AD server. Please contact to administrator.",

   /** (data 530) - Returned when a valid username and password/credential are supplied during times when login is restricted. */
   AD_USER_NOT_PERMITTED_TO_LOGIN               : "User not permitted to logon at this time. Please contact to administrator.",

   /** (data 531) - Returned when a valid username and password/credential are supplied, but the user is restriced from using the workstation where the login was attempted. */
   AD_USER_NOT_PERMITTED_TO_LOGIN_WORKSTATION   : "User not permitted to logon from this workstation. Please contact to administrator.",

   /** (data 532) - Returned when a valid username is supplied, and the supplied password is valid but expired. */
   AD_USER_PASSWORD_EXPIRED                     : "User account password has expired in AD server. Please contact to administrator.",

   /** (data 533) - Returned when a valid username and password/credential are supplied but the account has been disabled. */
   AD_USER_ACCOUNT_DISABLED                     : "User account currently disabled from AD server. Please contact to administrator.",

   /** (data 701) - Returned when a valid username and password/credential are supplied but the account has expired. */
   AD_USER_ACCOUNT_EXPIRED                      : "The user's account has expired from AD server. Please contact to administrator.",

   /** (data 773) - Returned when a valid username and password/credential are supplied, but the user must change their password immediately (user must reset password) */
   AD_USER_PASSWORD_RESET                       : "The user's password must be changed from AD server before logging on the first time.",

   /** (data 775) - Returned when a valid username is supplied, but the account is locked out. */
   AD_USER_ACCOUNT_LOCKED                       : "Account is currently locked out from AD server and may not be logged on to. Please contact to administrator.",
/********************************************************/

   /** Unbale to read user id or other data from token. */
   TOKEN_INVALID                                : "Invalid token, please Re-Login.",

   /** Token expired or malformed token or other token issue. */
   TOKEN_EXPIRED                                : "Session expired, please Re-Login.",

   /** Token refreshed successfully. */
   TOKEN_REFRESHED                              : "Token refreshed successfully.",

   /** Unable to connect AD server. */
   NETWORK_ERROR                                : "Network error, please try again after some time or contact the administrator.",

   /** User is not existing into AD server. */
   USER_NOT_EXISTING_IN_AD                      : "User does not exist, please try again with a valid user.",
   USER_NOT_IN_AD                               : "User does not exist.",

   /** User exist into AD server, but not belonging any group of AD server. */
   USER_NOT_EXISTING_IN_AD_GROUP                : "User cannot be added as it does not belong to any AD group.",

   /** User is not belonging to application's allowed group list. */
   USER_NOT_EXISTING_APP_ALLOWED_GROUP          : "User cannot be added as it does not belong to the application's allowed group.",

   /** Login successful */
   LOGIN_SUCCESS                                : "Login successful.",

   /** Login unsuccessful  */
   LOGIN_UNSUCCESS                              : "The username or password you entered is incorrect. Please try again.",

   /** Logout successful*/
   LOGOUT_SUCCESS                               : "Logout successful.",

   /** Logout unsuccessful*/
   LOGOUT_FAIL                                  : "Logout unsuccessful.",

   /** Unable to fetch user id by user name from DB. Means user does not exist in the DB. */
   USER_NOT_EXISTING_IN_DB                      : "User is not authorized to use the application.",

   /** User authenticated by AD server */
   USER_AUTHENTICATED                           : "User authenticated by AD server.",

   /** Successful on get key api */
   GET_KEY                                      : "Get public key successfully.",

   /** Error on get key api */
   GET_KEY_FAIL                                 : "Get public key unsuccessfull.",

   /** Fetched data successfully from DB */
   GET_DATA                                     : "Data fetch from DB successful.",
   GET_DATA_SUCCESSFUL                          : "Data fetched successfully.",

   /** Fetched data unsuccessfully from DB */
   GET_DATA_UNSUCCESSFUL                        : "Unable to fetch data from database.",

   /** Fetched data unsuccessfully */
   GET_DATA_FAIL                                : "Unable to fetch data.",

   /** Data added successfully into data base */
   ADDED_DATA                                   : "Added successfully.",

   /** Data added unsuccessful into data base */
   ADD_DATA_UNSUCCESSFUL                        : "Unable to add data.",

   /** Data deleted successfully into data base */
   DELETE_DATA                                  : "Deleted successfully.",

   /** Data delete unsuccessful into data base */
   DELETE_DATA_UNSUCCESSFUL                     : "Unable to delete data.",

   /** Update successfully */
   UPDATED_DATA                                 : "Saved successfully.",

   /** Update unsuccessful */
   UPDATED_DATA_UNSUCCESSFUL                    : "Unable to save data.",

   /** Update unsuccessful */
   PROCEDURE_EXECUTION_ERROR                    : "Error on procedure execution.",

   /** Update unsuccessful */
   UNHANDLED_ERROR_DB_LAYER                     : "Got unhandled exception in DB layer.",

   /** UserId and user's email id both are null in request body*/
   USER_ID_AND_EMAIL_ID_NULL_EMPTY              : "Enter User ID's or Email ID's value, at a time both cannot be left blank.",

   /** Email id is not a valid email id */
   EMAIL_ID_INVALID                             : "Email ID value is not a valid email id.",

   /**Account Name is null in request body Or Account Name is empty in request body*/
   ACCOUNT_NULL_EMPTY                           : "Account cannot be left blank.",

   /**Account Subscription is expired */
   SUBSCRIPTION_EXPIRED                         : "Account subscription has been expired. Please renew your account subscription",

   /**Account has not been subscribed */
   ACCOUNT_NOT_SUBSCRIBED                       : "Current account is not subscribed.",

   CHANGE_THE_PASSWORD                          : "Default password is active, try logging in with it",

   DEFAULT_PASSWORD_ERROR                       : "Please enter a correct default password to change the password.",

   PASSWORD_EXPIRED                             : 'Password has been expired, please change the password',

   USER_NOT_ACTIVE                              : "User is not active, please contact the administrator.",

   INVALID_ACCOUNT                              : "Invalid account details"

}

module.exports = {
   MESSAGE_CONSTANT: MESSAGE_CONSTANT,
};