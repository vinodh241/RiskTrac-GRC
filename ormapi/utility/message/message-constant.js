const MESSAGE_CONSTANT = {
   /** If user requested unauthorized API, (User Role basis) */
   UNAUTHORIZED_ACCESS: "Unauthorized access.",

   /** If token in request does not match with data base token. */
   INVALID_SESSION: "Invalid session, please re-login.",

   /** Token is null in request.Or Request body is undefined */
   INVALID_REQUEST: "Please select a valid template file with all mandatory parameters.",

   /** Unable to read or parse the request */
   INCORRECT_REQUEST: "Invalid request.",

   /** Page time out, (Page expired) */
   PAGE_EXPIRED: "Webpage has expired, kindly refresh the page.",

   /** Username is null in request body or User name is empty in request body*/
   USER_NAME_NULL_EMPTY: "User id cannot be left blank.",

   /** Password is null in request body Or Password is empty in request body*/
   PASSWORD_NULL_EMPTY: "Password cannot be left blank.",

   /** Unable to update DB table */
   UNABLE_UPDATE_DB: "Unable to update the database, please try again.",

   /** Unbale to fetch from data base. */
   NO_RECORD_FOUND: "No records.",

   /** User name or password is incorrect */
   WRONG_CREDENTIALS: "Invalid credentials, please try again with valid credentials.",

   /** AD Server unreachable */
   AD_SERVER_UNREACHABLE: "AD server is unreachable, please try again or contact the administrator.",

   /** Unbale to read user id or other data from token. */
   TOKEN_INVALID: "Invalid token, please Re-Login.",

   /** Token expired or malformed token or other token issue. */
   TOKEN_EXPIRED: "Session expired, please Re-Login.",

   /** Token refreshed successfully. */
   TOKEN_REFRESHED: "Token refreshed successfully.",

   /** Unable to connect AD server. */
   NETWORK_ERROR: "Network error, please try again after some time or contact the administrator.",

   /** User is not existing into AD server. */
   USER_NOT_EXISTING_IN_AD: "User does not exist, please try again with a valid user.",

   /** User exist into AD server, but not belonging any group of AD server. */
   USER_NOT_EXISTING_IN_AD_GROUP: "User cannot be added as it does not belong to any AD group.",

   /** User is not belonging to application's allowed group list. */
   USER_NOT_EXISTING_APP_ALLOWED_GROUP: "User cannot be added as it does not belong to the application's allowed group.",

   /** Login successful */
   LOGIN_SUCCESS: "Login successful.",

   /** Login unsuccessful  */
   LOGIN_UNSUCCESS: "Unable to login, Please try again.",

   /** Logout successful*/
   LOGOUT_SUCCESS: "Logout successful.",

   /** Logout unsuccessful*/
   LOGOUT_FAIL: "Logout unsuccessful.",

   /** Unable to fetch user id by user name from DB. Means user does not exist in the DB. */
   USER_NOT_EXISTING_IN_DB: "User is not authorized to use the application.",

   /** Successful on get key api */
   GET_KEY: "Get public key successfully.",

   /** Error on get key api */
   GET_KEY_FAIL: "Get public key unsuccessfull.",

   /** Fetched data successfully from DB */
   GET_DATA: "Data fetch from DB successful.",

   GET_DATA_SUCCESSFUL: "Data fetched successfully.",

   /** Fetched data unsuccessfully from DB */
   GET_DATA_UNSUCCESSFUL: "Unable to fetch data from database.",

   /** Data added successfully into data base */
   ADDED_DATA: "Added successfully.",

   SUBMIT_DATA: "Submitted successfully.",

   /** Data added unsuccessful into data base */
   ADD_DATA_UNSUCCESSFUL: "Unable to add data.",

   /** Data deleted successfully into data base */
   DELETE_DATA: "Deleted successfully.",

   /** Data delete unsuccessful into data base */
   DELETE_DATA_UNSUCCESSFUL: "Unable to delete data.",

   /** Update successfully */
   UPDATED_DATA: "Saved successfully.",

   /** Edited successfully */
   EDITED_DATA: "Updated successfully.",

   /** Update unsuccessful */
   UPDATED_DATA_UNSUCCESSFUL: "Unable to save data.",

   /** Update unsuccessful */
   PROCEDURE_EXECUTION_ERROR: "Error on procedure execution.",

   /** Update unsuccessful */
   UNHANDLED_ERROR_DB_LAYER: "Got unhandled exception in DB layer.",

   /** Download successful */
   DOWNLOAD_DATA: "File Downloaded Successfully.",

   /** Download unsuccessful */
   DOWNLOAD_DATA_UNSUCCESSFUL: "Unable to download file.",

   /** Collection schedule ID is null or empty*/
   COLLECTION_SCHEDULE_ID_NULL_EMPTY: "CollectionScheduleId is undefined or null or empty.",

   /** frameworkID is null or empty*/
   FWID_NULL_EMPTY: "FWID is undefined or null or empty.",

   /** Start Date is null or empty*/
   START_DATE_NULL_EMPTY: "StartDate is undefined or null or empty.",

   /** End Date is null or empty*/
   END_DATE_NULL_EMPTY: "EndDate is undefined or null or empty.",

   /** UnitID is null or empty*/
   UNIT_ID_NULL_EMPTY: "UnitID is undefined or null or empty.",

   /** Node ID is null or empty*/
   NODE_ID_NULL_EMPTY: "NodeID is undefined or null or empty.",

   /** Comment Body is null or empty*/
   COMMENT_BODY_NULL_EMPTY: "Comment Body is undefined or null or empty.",

   /** Action Plan is null or empty*/
   ACTION_PLAN_NULL_EMPTY: "Action Plan is undefined or null or empty.",

   /** Metric Score is null or empty*/
   METRIC_SCORE_NULL_EMPTY: "Metric Score is undefined or null or empty.",

   /** File data is null or empty*/
   NO_FILE_TO_UPLOAD: "No files to upload, Please select a file to upload.",

   /** File upload successful */
   UPLOAD_SUCCESSFUL: "File uploaded successfully.",

   /** File upload failed */
   UPLOAD_FAIL: "Unable to upload file.",

   /** File already exist */
   UPLOAD_FILE_EXIST: "File already exist.",

   NO_ATTACH_FILE_ERROR: "No attach file to upload.",

   UPLOAD_ATTACH_FILE_ERROR: "Unable to upload attached file.",

   /** Attached File extesion undefine or null */
   FILE_EXTENSION_NULL_UNDEFINE: "Atteched file extension is undefine or null. Kindly attach file with extension.",

   /** Attached File extesion is .exe */
   FILE_EXTENSION_EXE: "Atteched file is executable, Executable file is not allowed to attach.",

   /** File extension is not belonging to application's allowed file extesion list. */
   FILE_EXTENSION_NOT_EXISTING_ALLOWED_LIST: "File cannot be upload as file extension does not belong to the application's allowed list.",

   MALICIOUS_ATTACH_FILE_ERROR: "Unable to upload attached file. Attached file might be containing malicious content.",

   ERROR_ALLOWED_FILE_EXTENSION: "Please enter valid file like pdf and xlsx or xls only.",

   /**Checking if Assessment is already exist */
   ASSESSMENT_ALREADY_EXISTS: "Assessment already exists",

   ASSESSMENT_ALREADY_EXISTS_ON_SAME_FWID: "Assessment already exists for same framework and same Quarter",
   
   //**Assessment already exists With Same Framework and Quarter/
   Assessment_Already_Exists_With_Same_Framework_And_Quarter:"Assessment already exists With Same Framework and Quarter",

   /** Risk Appetite documents File upload successful */
   RISK_APPETITE_DOCS_UPLOAD_SUCCESSFUL: "Risk Appetite documents got uploaded successfully.",

   /** evidenceID is null or empty*/
   EVIDENCE_ID_NULL_EMPTY: "EvidenceID is undefined or null or empty.",

   /** metricID is null or empty*/
   METRIC_ID_NULL_EMPTY: "MetricID is undefined or null or empty.",

   /** status ID is null or empty*/
   STATUS_ID_NULL_EMPTY: "StatusID is undefined or null or empty.",

   /**Checking if endDate is less than startDate*/
   END_DATE_LESS_THAN_START_DATE: "EndDate must be greater than or equal to StartDate",

   /**Checking if privious assessment status is completed*/
   PRIVIOUS_ASSESSMENT_STATUS: "Unable to create new assessment as previous assessment is not completed.",

   /**Checking if assessment quater match*/
   ASSESSMENT_QUATER: "Please create assessment in current quater or next quater.",

   /**Checking if generic email is sent*/
   EMAIL_SUCCESSFUL: "Email sent successfully",

   /**Checking if generic email is not sent*/
   EMAIL_UNSUCCESSFUL: "Email not sent",

   NO_RECORD_FOUND_RA: "No Pending Units Found , As all Records have been Submitted for Review"
}

module.exports = {
   MESSAGE_CONSTANT: MESSAGE_CONSTANT,
};