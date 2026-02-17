const APP_CONFIG = require('../../config/app-config.js');

const MESSAGE_CONSTANT = {
   /** If user requested unauthorized API, (User Role basis) */
   UNAUTHORIZED_ACCESS: "Unauthorized access.",

   /** If token in request does not match with data base token. */
   INVALID_SESSION: "Invalid session, please re-login.",

   /** Token is null in request.Or Request body is undefined */
   INVALID_REQUEST: "Invalid request, missing mandatory parameters.",

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

   GET_RISK_RATING_UNSUCCESSFUL: "Unable to fetch the risk rating. Please select other combinations.",

   /** Data added successfully into data base */
   ADDED_DATA: "Added successfully.",

   /** Data submitted successfully  */
   SUBMIT_DATA: "Submitted successfully.",

   /** Data submit unsuccessful  */
   SUBMIT_DATA_UNSUCCESSFUL: "Unable to submit data.",

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

    /** Edited successfully */
   EDITED_DATA_UNSUCCESSFUL: "Unable to update.",

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

   /**Checking if generic email is sent*/
   EMAIL_SUCCESSFUL: "Email sent successfully",

   /**Checking if generic email is not sent*/
   EMAIL_UNSUCCESSFUL: "Email not sent",

   /**Checking is Input parameter is null or empty */
   INVALID_INPUT_REQUEST :"Invalid input request",

   /** File data is null or empty*/
   NO_FILE_TO_UPLOAD: "No files to upload, Please select a file to upload.",

   /** File upload successful */
   UPLOAD_SUCCESSFUL: "File uploaded successfully.",

   /** File upload failed */
   UPLOAD_FAIL: "Unable to upload file.",

   UPLOAD_FAIL_SFTP: "Unable to upload file to sftp server.",

   /** File already exist */
   UPLOAD_FILE_EXIST: "File already exist.",

   NO_ATTACH_FILE_ERROR: "No attach file to upload.",

   UPLOAD_ATTACH_FILE_ERROR: "Unable to upload attached file.",

   /** Attached File extesion undefine or null */
   FILE_EXTENSION_NULL_UNDEFINED: "Atteched file extension is undefined or null. Kindly attach file with extension.",

   /** Attached File extesion is .exe */
   FILE_EXTENSION_EXE: "Atteched file is executable, Executable file is not allowed to attach.",

   /** File extension is not belonging to application's allowed file extesion list. */
   FILE_EXTENSION_NOT_EXISTING_ALLOWED_LIST: "File cannot be upload as file extension does not belong to the application's allowed list.",

   MALICIOUS_ATTACH_FILE_ERROR: "Unable to upload attached file. Attached file might be containing malicious content.",

   ATTACHMENT_ERROR_ALLOWED_FILE_EXTENSION: "Please upload valid file like xlsx, pdf, docx, jpeg, jpg, png only ",

   FILE_SIZE_EXCEED: `File size has exceeded the limit of ${APP_CONFIG.REMEDIATION_TRACKER_FILE_UPLOAD.FILE_SIZE} mb`,

   FILE_NAME_IS_NOT_VALID : `File name should not have special characters.`, 

   REVIEW_DATA: "Review Initiated successfully.",


   /** Validation error messages for Threat Library Master */
   RISK_ID_NULL_EMPTY                  : "Risk Id cannot be null or empty",
   RISK_TITLE_NULL_EMPTY               : "Risk Title cannot be null or empty",
   RISK_DESCRIPTION_NULL_EMPTY         : "Risk Description cannot be null or empty",
   RISK_CODE_NULL_EMPTY                : "Risk Code cannot be null or empty",
   THREAT_CATEGORY_ID_NULL_EMPTY       : "Threat category id cannot be null or empty",
   IMPACTS_NULL_EMPTY                  : "Impact id cannot be null or empty",
   RISK_OWNER_ID_NULL_EMPTY            : "Risk owner id cannot be null or empty",
   CURRENT_DATE_NULL_EMPTY             : "current date cannot be null or empty",
   CONTROL_EFFECTIVENESS_ID_NULL_EMPTY : "control effectiveness id date cannot be null or empty",

   /** Validation error messages for Site Master */
   SITE_ID_NULL_EMPTY         : "Site id cannot be null or empty",
   SITE_NAME_NULL_EMPTY       : "Site name cannot be null or empty",
   SHORT_CODE_NULL_EMPTY      : "Site short code cannot be null or empty",
   SITE_ADDRESS_NULL_EMPTY    : "Site address cannot be null or empty",
   CITY_ID_NULL_EMPTY         : "City id cannot be null or empty",
   COUNTRY_ID_NULL_EMPTY      : "Country id cannot be null or empty",
   SITE_BCC_ID_NULL_EMPTY     : "Site BCC id cannot be null or empty ",
   ADMIN_HEAD_ID_NULL_EMPTY   : "Admin head id cannot be null or empty",

   /** Validation error messages for Crisis Comms template Master */
   EMAIL_TEMPLATE_NAME_NULL_EMPTY: "Email template name cannot be null or empty",
   EMAIL_TEMPLATE_ID_NULL_EMPTY  : "Email template id cannot be null or empty",
   EMAIL_TITLE_NULL_EMPTY        : "Email title cannot be null or empty",
   EMAIL_CONTENT_NULL_EMPTY      : "Email content cannot be null or empty",
   ACTION_LINK_ID_NULL_EMPTY     : "Action link id cannot be null or empty",
   CRITICALITY_ID_NULL_EMPTY     : "Criticality id cannot be null or empty",

   /** Validation error messages for Business Services And Apps Master */
   APPLICATION_ID_UNDEFINED          : "Application id cannot be undefined",
   APPLICATION_ID_NULL_EMPTY         : "Application id cannot be null or empty or undefined",
   APPLICATION_NAME_NULL_EMPTY       : "Application Name cannot be null or empty or undefined",
   RTO_VALUE_NULL_EMPTY              : "RTO value cannot be null or empty or undefined",
   RPO_VALUE_NULL_EMPTY              : "RPO value cannot be null or empty or undefined",
   APPLICATION_TYPE_ID_NULL_EMPTY    : "Application Type ID cannot be null or empty or undefined",
   BUSINESS_FUNCTION_ID_NULL_EMPTY   : "Business Function ID cannot be null or empty or undefined",
   RTO_ID_NULL_EMPTY                 : "RTO id cannot be null or empty or undefined",
   RPO_ID_NULL_EMPTY                 : "RPO id cannot be null or empty or undefined",
   BUSINESS_OWNER_ID_NULL_EMPTY      : "Business Owner ID cannot be null or empty or undefined",
   IT_OWNER_ID_NULL_EMPTY            : "IT Owner ID cannot be null or empty or undefined",
   SUPPORT_LEAD_ID_NULL_EMPTY        : "Support Lead ID cannot be null or empty or undefined",
   SITES_NULL_EMPTY                  : "Sites cannot be null or empty or undefined",
   SUPPORT_TEAM_NULL_EMPTY           : "Support Team cannot be null or empty or undefined",

    /** Validation error messages for Site Risk Assessments(SRA) */
   ASSESSMENT_NAME_NULL_EMPTY             : "assessment name cannot be null,empty or undefined",
   ASSESSMENT_CODE_NULL_EMPTY             : "assessment code cannot be null,empty or undefined",
   RISKS_NULL_EMPTY                       : "risks cannot be null,empty or undefined",
   START_DATE_NULL_EMPTY                  : "start date cannot be null,empty or undefined",
   END_DATE_NULL_EMPTY                    : "end date cannot be null,empty or undefined",
   CONTROL_EFFECTIVENESS_ID_NULL_EMPTY    : "controlEffectivenessId cannot be null,empty or undefined",
   INHERENT_LIKELIHOOD_ID_NULL_EMPTY      : "Inherent likelihood id cannot be null,empty or undefined",
   INHERENT_IMPACT_ID_NULL_EMPTY          : "Inherent impact id cannot be null,empty or undefined",
   RESIDUAL_LIKELIHOOD_ID_NULL_EMPTY      : "Residual likelihood id cannot be null,empty or undefined",
   RESIDUAL_IMPACT_ID_NULL_EMPTY          : "Residual impact id cannot be null,empty or undefined",
   OVERALL_RESIDUAL_RATING_ID_NULL_EMPTY  : "OverAll Residual rating id cannot be null,empty or undefined",
   OVERALL_INHERENT_RATING_ID_NULL_EMPTY  : "OverAll Inherent rating id cannot be null,empty or undefined",
   STRATEGY_ID_NULL_EMPTY                 : "RiskTreatment StrategyId cannot be null,empty or undefined",
   ACTION_PLANS_NULL_EMPTY                : "Action Planes cannot be null,empty or undefined",
   TOLERATE_DESCRIPTION_NULL_EMPTY        : "Tolerate Description cannot be null,empty or undefined",
   REVIEW_COMMENTS_NULL_EMPTY             : "Review Comments cannot be null,empty or undefined",
   THREAT_RISK_ID_NULL_EMPTY              : "ThreatRiskId cannot be null,empty or undefined",
   SITE_RISK_ASSESSMENT_ID_NULL_EMPTY     : "SiteRiskAssessmentId cannot be null,empty or undefined",
   SCHEDULE_RISK_ASSESSMENT_ID_NULL_EMPTY : "ScheduleRiskAssessmentId cannot be null,empty or undefined",
   RISK_RATING_TYPE_NULL_EMPTY            : "riskRatingType cannot be null,empty",
   INVALID_RISK_RATING_TYPE               : "Invalid risk rating type",

   /** Validation error messages for Vendor  Master */
   SUPPORT_TEAMS_ID_NULL_EMPTY         : "Support teams cannot be null or empty",
   VENDOR_ID_NULL_EMPTY                : "vendor id cannot be null or empty",
   VENDOR_NAME_ID_NULL_EMPTY           : "vendor name cannot be null or empty",

   /** Validation error messages for SRA review  response */
   SCHEDULE_ASSESSMENT_RISK_ID_NULL_EMPTY  : "schedule assessment risk id cannot be null or empty",
   REVIEW_STATUS_NULL_EMPTY                : "review status cannot be null or empty",
   RISK_REVIEW_COMMENT_NULL_EMPTY          : "risk review comment cannot be null or empty",
   
   /** Validation error messages for Incident Report */
   INCIDENT_ID_NULL_EMPTY                          : "incidentId cannot be null,empty or undefined",
   INCIDENT_CODE_NULL_EMPTY                        : "incidentCode cannot be null,empty or undefined",
   INCIDENT_STATUS_ID_NULL_EMPTY                   : "incidentStatusId cannot be null,empty or undefined",
   INCIDENT_START_DATE_NULL_EMPTY                  : "incidentStartDate cannot be null,empty or undefined",
   INCIDENT_START_TIME_NULL_EMPTY                  : "incidentStartTime cannot be null,empty or undefined",
   INCIDENT_END_DATE_NULL_EMPTY                    : "incidentEndDate cannot be null,empty or undefined",
   INCIDENT_END_TIME_NULL_EMPTY                    : "incidentEndTime cannot be null,empty or undefined",
   INCIDENT_TITLE_NULL_EMPTY                       : "incidentTitle cannot be null,empty or undefined",
   INCIDENT_NATURE_ID_NULL_EMPTY                   : "incidentNatureId cannot be null,empty or undefined",
   INCIDENT_CLASSIFICATION_ID_NULL_EMPTY           : "incidentClassificationId cannot be null,empty or undefined",
   INCIDENT_LOCATION_ID_NULL_EMPTY                 : "incidentLocationId cannot be null,empty or undefined",
   INCIDENT_DESCRIPTION_NULL_EMPTY                 : "incidentDescription cannot be null,empty or undefined",
   POST_INCIDENT_EVALUATION_CONCLUSION_NULL_EMPTY  : "postIncidentEvaluationConclusion cannot be null,empty or undefined",
   ACTION_TAKEN_NULL_EMPTY                         : "actionTaken cannot be null,empty or undefined",
   ACTION_PLAN_NULL_EMPTY                          : "actionPlan cannot be null,empty or undefined",
   INCIDENT_REVIEW_DECISION_NULL_EMPTY             : "reviewDecision cannot be null,empty or undefined",
   INCIDENT_REVIEW_COMMENT_NULL_EMPTY              : "reviewComment cannot be null,empty or undefined",

   /** Validation error messages for Crisis Communications */
   COMMUNICATION_ID_NULL_EMPTY      : "communication id cannot be null,empty or undefined",
   COMMUNICATION_CODE_NULL_EMPTY    : "communication code cannot be null,empty or undefined",
   COMMUNICATION_TITLE_NULL_EMPTY   : "communication title cannot be null,empty or undefined",
   CATEGORY_ID_NULL_EMPTY           : "category id cannot be null,empty or undefined",
   INCIDENT_ID_NULL_EMPTY           : "incident id cannot be null,empty or undefined",
   TEMPLATE_ID_NULL_EMPTY           : "template id cannot be null,empty or undefined",
   EMAIL_CONTENT_NULL_EMPTY         : "email content cannot be null,empty or undefined",
   RECIPENTS_DATA_NULL_EMPTY        : "recipents data cannot be null,empty or undefined",
   ATTACHMENT_ID_NULL_EMPTY         : "attachment id cannot be null,empty or undefined",
   RECIPENT_TYPE_ID_NULL_EMPTY      : "recipent type id cannot be null,empty or undefined",

   /** Validation error messages for BCMS Testing*/

   TEST_ASSESSMENT_ID_NULL_EMPTY          : "bcms test assessment Id cannnot be null,empty or undefined",
   CURRENT_STATUS_ID_NULL_EMPTY           : "current status Id cannnot be null,empty or undefined",
   NEXT_STATUS_ID_NULL_EMPTY              : "next status Id cannnot be null,empty or undefined",
   TEST_PARTICIPANT_ID_NULL_EMPTY         : "bcms test participant Id cannnot be null,empty or undefined",
   TEST_OBSERVER_ID_NULL_EMPTY            : "bcms test observer Id cannnot be null,empty or undefined",
   TEST_OBSERVER_LNK_ID_NULL_EMPTY        : "test observer link Id cannnot be null,empty or undefined",
   COMMENT_NULL_EMPTY                     : "comment cannnot be null,empty or undefined",
   REVIEW_STATUS_NULL_EMPTY               : "review status cannnot be null,empty or undefined",
   REVIEW_COMMENT_NULL_EMPTY              : "review comment cannnot be null,empty or undefined",
   TEST_TITLE_NULL_EMPTY                  : "test title cannnot be null,empty or undefined",
   PLANNED_START_DATE_TIME_NULL_EMPTY     : "planned start date cannnot be null,empty or undefined",
   PLANNED_END_DATE_TIME_NULL_EMPTY       : "planned end date cannnot be null,empty or undefined",
   TEST_SCENARIO_NULL_EMPTY               : "test scenario cannnot be null,empty or undefined",
   TEST_SCENARIO_DESCRIPTION_NULL_EMPTY   : "test scenario description cannnot be null,empty or undefined",
   TEST_OBSERVER_GUID_NULL_EMPTY          : "test observer GUID cannnot be null,empty or undefined",
   PLANNED_TEST_LIMITATIONS_NULL_EMPTY    : "planned test limitations cannnot be null,empty or undefined",
   PLANNED_FINANCIAL_IMPACT_NULL_EMPTY    : "planned financial impact cannnot be null,empty or undefined",
   PLANNED_CUSTOMER_IMPACT_NULL_EMPTY     : "planned customer impact cannnot be null,empty or undefined",
   PARTICIPANTS_NULL_EMPTY                : "participants cannnot be null,empty or undefined",
   PARTICIPANT_OPTION_ID_NULL_EMPTY       : "participant option id cannot be null,empty or undefined",
   DISRUPTION_SCENARIOS_NULL_EMPTY        : "discruption scenarios cannnot be null,empty or undefined",
   TEST_ASSESSMENT_STATUS_ID_NULL_EMPTY   : "testAssessmentStatusId cannnot be null,empty or undefined",
   SCHEDULE_TEST_ID_NULL_EMPTY            : "scheduledTestId cannnot be null,empty or undefined",
   RESPONSES_NULL_EMPTY                   : "responses cannnot be null, empty or undefined",
   SUPPORT_TEAMS_NULL_EMPTY               : "support teams response cannnot be null, empty or undefined",
   INVALID_DATE_TIME_DURATION             : "Date Time Duration should be betweeen 3 to 72 hours",
   TEST_REPORT_ID_NULL_EMPTY              : "test report id cannot be null,empty or undefined",
   PTL_NULL_EMPTY                         : "planned Test Limitations cannot be null,empty or undefined",
   PATL_NULL_EMPTY                         : "post Analysis Test Limitation cannot be null,empty or undefined",
   PFI_NULL_EMPTY                         : "planned Financial Impact cannot be null,empty or undefined",
   PAFI_NULL_EMPTY                        : "post Analysis Financial Impact cannot be null,empty or undefined",
   PCI_NULL_EMPTY                         : "planned Customer Impact cannot be null,empty or undefined",
   PACI_NULL_EMPTY                        : "post Analysis Customer Impact cannot be null,empty or undefined",
   POI_NULL_EMPTY                         : "planned Other Impact cannot be null,empty or undefined",
   PAOI_NULL_EMPTY                        : "post Analysis Other Impact cannot be null,empty or undefined",
   ROOT_CAUSE_ANALYSIS_NULL_EMPTY         : "root Cause Analysis cannot be null,empty or undefined",
   TEST_COMPONENTS_DATA_NULL_EMPTY        : "testing Components Data cannot be null,empty or undefined",
   BUSINESS_FUNCTIONS_NULL_EMPTY          : "bussiness functions cannot be null,empty or undefined",
   TEST_OBSERVATIONS_NULL_EMPTY           : "test observations cannot be null,empty or undefined",
   TEST_RESULT_NULL_EMPTY                 : "test result cannot be null,empty or undefined",
   DISRUPTION_SCENARIOS_DATA_NULL_EMPTY   : "discruption scenario data cannot be null,empty or undefined",
		

   /** Validation error messages for Business Continuity Planning(BCP) */

   BUSINESS_CONTINUITY_PLAN_ID_NULL_EMPTY       : "business continuity plan Id cannot be null, empty or undefined",
   PROFILING_QUESTIONS_NULL_EMPTY               : "profiling questions cannot be null, empty or undefined",
   BUSINESS_FUNCTION_ID_NULL_EMPTY              : "business function Id cannot be null, empty or undefined",
   BUSINESS_DESCRIPTION_NULL_EMPTY              : "business description cannot be null, empty or undefined",
   BUSINESS_SERVICES_NULL_EMPTY                 : "business services cannot be null, empty or undefined",
   BUSINESS_PROCESSES_NULL_EMPTY                : "business processes cannot be null, empty or undefined",
   CUSTOMERS_NULL_EMPTY                         : "customers cannot be null, empty or undefined",
   PROCESS_DATA_NULL_EMPTY                      : "process cannot be null, empty or undefined",
   IMPACT_DATA_NULL_EMPTY                       : "impact cannot be null, empty or undefined",
   RESOURCE_DATA_NULL_EMPTY                     : "resource cannot be null, empty or undefined",
   RECOVERY_DATA_NULL_EMPTY                     : "recovery cannot be null, empty or undefined",

   /** Common Validation error messages for Date Time */
   
   PRESENT_DATE_TIME_ERROR    : "Start/End Date cannot be less than Present Date.",
   START_DATE_TIME_ERROR      : "Start  Date cannot be less than Present Date.",
   END_DATE_TIME_ERROR        : "End Date cannot be less than Present Date.",
   DATE_DIFFERENCE_ERROR      : "End Date cannot be less than Start Date.",
   TIME_DIFFERENCE_ERROR      : "End Time connot be less than or equal to Start Time.",
   SAME_DATE                  : "Start Date and End Date cannot be Same.",
   VALID_DATE_TIME            : "Valid",

   /** Validation error messages for Remediation Tracker(RMT) */

   ACTION_ITEM_ID_NULL_EMPTY           : "action item Id cannot be null, empty or undefined",
   ACTION_ITEM_MODULE_ID_NULL_EMPTY    : "action item module Id cannot be null, empty or undefined",
   ACTION_ITEM_SOURCE_ID_NULL_EMPTY    : "action item source Id cannot be null, empty or undefined",
   RMT_START_DATE_NULL_EMPTY           : "start date cannot be null, empty or undefined",
   RMT_END_DATE_NULL_EMPTY             : "end date cannot be null, empty or undefined",
   ACTION_ITEM_OWNER_ID_NULL_EMPTY     : "action item owner Id cannot be null, empty or undefined",
   BUDGET_REQUIRED_NULL_EMPTY          : "budget required cannot be null, empty or undefined",
   CRITICALITY_ID_NULL_EMPTY           : "criticality Id cannot be null, empty or undefined",
   ACTION_ITEM_NAME_NULL_EMPTY         : "action item name cannot be null, empty or undefined",
   ACTION_ITEM_PLAN_NULL_EMPTY         : "action item plan cannot be null, empty or undefined",
   BUDGETED_COST_NULL_EMPTY            : "budgeted cost cannot be null, empty or undefined",
   USER_ID_NULL_EMPTY                  : "user Id cannot be null, empty or undefined",
   MARKED_COMPLETE_NULL_EMPTY          : "is marked complete cannot be null, empty or undefined",
   RMT_COMMENT_NULL_EMPTY              : "comment cannot be null, empty or undefined",
   PROGRESS_NULL_EMPTY                 : "progress cannot be null empty or undefined",
   CURRENT_WORKFLOW_ID_NULL_EMPTY      : "current workflow status Id cannot be null, empty or undefined",
   NEXT_WORKFLOW_ID_NULL_EMPTY         : "next workflow status Id cannot be null, empty or undefined",
   EXTENSION_REQUESTED_NULL_EMPTY      : "is extension requested cannot be null, empty or undefined",
   EXTENDED_TARGET_DATE_NULL_EMPTY     : "extended target date cannot be null, empty or undefined",
   EXTENSION_EXPLANATION_NULL_EMPTY    : "extension explanation cannot be null, empty or undefined",
   ATTACHMENT_ID_NULL_EMPTY            : "attachment Id cannot be null, empty or undefined",
   FILE_CONTENT_ID_NULL_EMPTY          : "file content Id cannot be null, empty or undefined",
   ACTION_ITEM_STATUS_NULL_EMPTY       : "status cannot be null, empty or undefined",
   EXTENSION_REQUEST_ID_NULL_EMPTY     : "extension request Id cannot be null, empty or undefined",
   ESCALATION_REQUEST_ID_NULL_EMPTY    : "escalation request Id cannot be null, empty or undefined",
   IS_ESCALATED_NULL_EMPTY             : "is escalated cannot be null, empty or undefined",

   /** Validation error messages for Metrics Library Master Page */

   METRICS_CURRENT_DATE_NULL_EMPTY     : "current date cannot be null, empty or undefined",
   METRIC_CODE_NULL_EMPTY              : "metric code cannot be null, empty or undefined",
   METRIC_TITLE_NULL_EMPTY             : "metric title cannot be null, empty or undefined",
   METRIC_DESCRIPTION_NULL_EMPTY       : "metric description cannot be null, empty or undefined",
   TARGET_VALUE_NULL_EMPTY             : "target value cannot be null, empty or undefined",
   METRIC_NUMERATOR_NULL_EMPTY         : "datapoint numerator cannot be null, empty or undefined",
   METRIC_DENOMINATOR_NULL_EMPTY       : "datapoint denominator cannot be null, empty or undefined",
   METRIC_TYPE_ID_NULL_EMPTY           : "metric type Id cannot be null, empty or undefined",
   TARGET_TYPE_ID_NULL_EMPTY           : "target type Id cannot be null, empty or undefined",
   THRESHOLD_ID_NULL_EMPTY             : "threshold Id cannot be null, empty or undefined",
   FREQUENCY_ID_NULL_EMPTY             : "frequency Id cannot be null, empty or undefined",
   FRAMEWORK_CONTROLS_NULL_EMPTY       : "framework controls cannot be null, empty or undefined",
   METRIC_ID_NULL_EMPTY                : "metric Id cannot be null, empty or undefined",

}

module.exports = {
   MESSAGE_CONSTANT: MESSAGE_CONSTANT,
};