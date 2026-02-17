const APP_VALIATOR = require('../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ = require('../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../../utility/constants/constant.js');
const SCHEDULE_ASSESSMENT_DB = require('../../../data-access/schedule-assessment-db.js');
// Retained for backward compatibility; RCSA email content is loaded from DB only (resolveOrmEmailTemplateByCode / resolveOrmEmailTemplate).
const EMAIL_TEMPLATE = require('../../../utility/email-templates-rcsa.js');
const APP_CONFIG_FILE_OBJ = require('../../../config/app-config.js');
const BINARY_DATA = require('../../../utility/binary-data.js');
const { logger } = require('../../../utility/log-manager/log-manager.js');
const SCHEDULE_DB = require('../../../data-access/schedule-db.js');
const INAPP_NOTIFICATION_DB = require('../../../data-access/inApp-notification-db.js');
const { formatDate } = require('../../../utility/commonfunctions/commonfunctions.js');
const { resolveOrmEmailTemplate, resolveOrmEmailTemplateByCode } = require('../../../utility/orm-email-template-resolver.js');


var appValidatorObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleAssessmentDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleAssessmentBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailTemplateObj = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var binarydataObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ScheduleAssessmentBl {
    constructor() {
        appValidatorObject = new APP_VALIATOR();
        ScheduleAssessmentDbObject = new SCHEDULE_ASSESSMENT_DB();
        emailTemplateObj = new EMAIL_TEMPLATE();
        binarydataObject = new BINARY_DATA();
        ScheduleDbObject = new SCHEDULE_DB();
        inAppNotificationDbObject = new INAPP_NOTIFICATION_DB();
    }

    start() {
    }

    /**
     * This function will fetch details of all Self Assessment By Schedule Assessment ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSelfAssessmentSummaryByScheduleAssessmentID(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.scheduleAssessmentID = request.body.scheduleAssessmentID || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution started.');

            const result = await ScheduleAssessmentDbObject.getSelfAssessmentSummaryByScheduleAssessmentID(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
            var templateResult = '';
            if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() != "empty") {
                const templateData = { ...result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] };
                templateData.RISKTRAC_WEB_URL = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                const templateCode = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() === "inprogress"
                    ? "SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE" : "SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE";
                templateResult = await resolveOrmEmailTemplateByCode(templateCode, templateData, userIdFromToken);
                if (!templateResult || !templateResult.Subject) {
                    logger.log('warn', 'ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : No DB template for code=' + templateCode);
                    templateResult = { Subject: '', Body: '' };
                }

                const bindsEmail = {};

                var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                toIDs = Array.from(new Set(toIDs.split(','))).toString();
                bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject = templateResult.Subject;
                bindsEmail.emailContent = templateResult.Body;
                bindsEmail.userId = userIdFromToken;
                bindsEmail.userName = userNameFromToken;
                bindsEmail.createdBy = userIdFromToken || "";

                const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of all Self Assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForSelfAssessmentScreen(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution started.');

            const result = await ScheduleAssessmentDbObject.getDataForSelfAssessmentScreen(binds);

            logger.log('info', 'getDataForSelfAssessmentScreen : DBresponseResult : ' + JSON.stringify(result));

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult = '';
            if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() != "empty") {
                // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
                if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() == "inprogress") {
                    const mapDynamicData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    mapDynamicData["ScheduleAssessmentCode_1"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                    mapDynamicData["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
                    mapDynamicData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult = await resolveOrmEmailTemplateByCode("SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE", mapDynamicData, userIdFromToken);
                }
                if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() == "completed") {
                    const completedData = { ...result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] };
                    completedData.RISKTRAC_WEB_URL = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult = await resolveOrmEmailTemplateByCode("SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE", completedData, userIdFromToken);
                }
                if (!templateResult || !templateResult.Subject) {
                    logger.log('warn', 'ScheduleAssessmentBl : No DB template for inprogress/completed email.');
                    templateResult = { Subject: '', Body: '' };
                }

                const bindsEmail = {};

                var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                // var toCCs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                toIDs = Array.from(new Set(toIDs.split(','))).toString();
                // toCCs=Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                // bindsEmail.toCCs= toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject = templateResult.Subject;
                bindsEmail.emailContent = templateResult.Body;
                bindsEmail.userId = userIdFromToken;
                bindsEmail.userName = userNameFromToken;
                bindsEmail.createdBy = userIdFromToken || "";

                logger.log('info', 'getDataForSelfAssessmentScreen : bindsEmail : ' + JSON.stringify(bindsEmail));
                const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            //Merging all recordset and return as single recordset

            let resultResponse = {
                ScheduleAssessmentCard: [],
                SelfAssessmentSummary: [],
                ScheduleAssessment: []
            }

            resultResponse.ScheduleAssessmentCard = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.SelfAssessmentSummary = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.ScheduleAssessment = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];

            var resultArr = [];
            resultArr.push(resultResponse);

            result.recordset = JSON.parse(JSON.stringify(resultArr));

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA + "|getDataForSelfAssessmentScreen", result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Manage Self Assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForManageSelfAssessmentScreen(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let messageData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            const ZERO = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            const FOURTEEN = CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution started.');

            const result = await ScheduleAssessmentDbObject.getDataForManageSelfAssessmentScreen(binds);
            // logger.log('info', 'getDataForManageSelfAssessmentScreen : complete-rcsa-response :' + JSON.stringify(result));

            // ======= Guards =======
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success: 1,
                    message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL,
                    result: {
                        status: 0,
                        errorMsg: 'Result is null/undefined',
                        procedureSuccess: false,
                        procedureMessage: null
                    },
                    token: refreshedToken || '',
                    error: {
                        errorCode: null,
                        errorMessage: null
                    }
                });
            }

            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success: 1,
                    message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL,
                    result: {
                        status: 0,
                        errorMsg: result.errorMsg || 'DB status != 1',
                        procedureSuccess: false,
                        procedureMessage: null
                    },
                    token: refreshedToken || '',
                    error: {
                        errorCode: null,
                        errorMessage: null
                    }
                });
            }

            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : proc error : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success: 1,
                    message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL,
                    result: {
                        status: 1,
                        errorMsg: null,
                        procedureSuccess: false,
                        procedureMessage: result.procedureMessage
                    },
                    token: refreshedToken || '',
                    error: {
                        errorCode: null,
                        errorMessage: null
                    }
                });
            }

            // ======= Email + In-App (SpecialNote) =======
            let navUrl = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let specialContainer = (result && result.recordset && result.recordset[FOURTEEN]) ? result.recordset[FOURTEEN] : null;
            const hasSpecial = specialContainer && specialContainer[ZERO] && typeof specialContainer[ZERO].SpecialNote === 'string';

            if (hasSpecial && specialContainer[ZERO].SpecialNote.toLowerCase() !== "empty") {
                if (specialContainer[ZERO].SpecialNote.toLowerCase() === "inprogress") {
                    const mappingData = {
                        ...specialContainer[ZERO]
                    };
                    mappingData["ScheduleAssessmentCode_1"] = specialContainer[ZERO].ScheduleAssessmentCode;
                    mappingData["ScheduleAssessmentCode_2"] = specialContainer[ZERO].ScheduleAssessmentCode;
                    mappingData["ScheduleAssessmentID"] = specialContainer[ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    mappingData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

                    messageData = 'RCSA Assessment initiated: ' + specialContainer[ZERO].ScheduleAssessmentCode;
                    navUrl = 'self-assessments';

                    // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
                    let templateResult = await resolveOrmEmailTemplateByCode("SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE", mappingData, userIdFromToken);
                    if (!templateResult || !templateResult.Subject) {
                        logger.log('warn', 'ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : No DB template for SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE');
                        templateResult = { Subject: '', Body: '' };
                    }

                    // Email binds
                    let toIDs = specialContainer[ZERO].ReviewersEmailID || '';
                    let toCCs = (specialContainer[ZERO].RMUsersEmailID || '') + "," + (specialContainer[ZERO].RCSAPowerUsersEmailID || '');
                    toIDs = Array.from(new Set((toIDs || '').split(',').map(s => s.trim()).filter(Boolean))).toString();
                    toCCs = Array.from(new Set((toCCs || '').split(',').map(s => s.trim()).filter(Boolean))).toString();

                    const bindsEmail = {
                        toIDs: toIDs.replace(/,,/g, ",").replace(/^,|,$/g, ""),
                        toCCs: toCCs.replace(/,,/g, ",").replace(/^,|,$/g, ""),
                        emailSubject: templateResult.Subject,
                        emailContent: templateResult.Body,
                        userId: userIdFromToken,
                        userName: userNameFromToken,
                        createdBy: userIdFromToken || ""
                    };
                    logger.log('info', 'getDataForManageSelfAssessmentScreen : bindsEmail :' + JSON.stringify(bindsEmail));
                    const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);

                    // In-app list
                    const RGUID = specialContainer[ZERO].ReviewersGUID || '';
                    const RMGUID = specialContainer[ZERO].RMUsersGUID || '';
                    const PUGUID = specialContainer[ZERO].RCSAPowerUsersGUID || '';
                    let inAppUserList = (RGUID + "," + RMGUID + "," + PUGUID).split(',')
                        .map(x => x && x.trim())
                        .filter(x => x && x !== 'undefined' && x !== 'null')
                        .join(',');

                    const inappDetails = {
                        inAppContent: messageData + " link:" + navUrl,
                        recepientUserID: inAppUserList,
                        subModuleID: 2
                    };

                    const setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(
                        userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

                    // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : inappDetails    : ' + JSON.stringify(inappDetails || null));
                    // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : emailAddResult  : ' + JSON.stringify(emailAddResult || null));
                    // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
                }

                if (specialContainer[ZERO].SpecialNote.toLowerCase() === "completed") {
                    const mappingData = {
                        ...specialContainer[ZERO]
                    };
                    mappingData["ScheduleAssessmentCode_1"] = specialContainer[ZERO].ScheduleAssessmentCode;
                    mappingData["ScheduleAssessmentID"] = specialContainer[ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    mappingData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

                    // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
                    let templateResultCompleted = await resolveOrmEmailTemplateByCode("SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE", mappingData, userIdFromToken);
                    if (!templateResultCompleted || !templateResultCompleted.Subject) {
                        logger.log('warn', 'ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : No DB template for SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE');
                        templateResultCompleted = { Subject: '', Body: '' };
                    }
                    messageData = 'RCSA Assessment has been completed: ' + specialContainer[ZERO].ScheduleAssessmentCode;
                    navUrl = 'schedule-assessments';

                    // Email binds
                    let toIDs = specialContainer[ZERO].ReviewersEmailID || '';
                    let toCCs = (specialContainer[ZERO].RMUsersEmailID || '') + "," + (specialContainer[ZERO].RCSAPowerUsersEmailID || '');
                    toIDs = Array.from(new Set((toIDs || '').split(',').map(s => s.trim()).filter(Boolean))).toString();
                    toCCs = Array.from(new Set((toCCs || '').split(',').map(s => s.trim()).filter(Boolean))).toString();

                    const bindsEmail = {
                        toIDs: toIDs.replace(/,,/g, ",").replace(/^,|,$/g, ""),
                        toCCs: toCCs.replace(/,,/g, ",").replace(/^,|,$/g, ""),
                        emailSubject: templateResultCompleted.Subject,
                        emailContent: templateResultCompleted.Body,
                        userId: userIdFromToken,
                        userName: userNameFromToken,
                        createdBy: userIdFromToken || ""
                    };
                    logger.log('info', 'getDataForManageSelfAssessmentScreen : bindsEmail :' + JSON.stringify(bindsEmail));
                    const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);

                    // In-app list
                    const RGUID = specialContainer[ZERO].ReviewersGUID || '';
                    const RMGUID = specialContainer[ZERO].RMUsersGUID || '';
                    const PUGUID = specialContainer[ZERO].RCSAPowerUsersGUID || '';
                    let inAppUserList = (RGUID + "," + RMGUID + "," + PUGUID).split(',')
                        .map(x => x && x.trim())
                        .filter(x => x && x !== 'undefined' && x !== 'null')
                        .join(',');

                    const inappDetails = {
                        inAppContent: messageData + " link:" + navUrl,
                        recepientUserID: inAppUserList,
                        subModuleID: 2
                    };

                    const setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(
                        userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

                    // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : inappDetails    : ' + JSON.stringify(inappDetails || null));
                    // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : emailAddResult  : ' + JSON.stringify(emailAddResult || null));
                    // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
                }
            }

            // ======= Masters =======
            const RCSA_MASTER_DB_RESPONSE = await ScheduleDbObject.getRCSAMasterData(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : RCSA_MASTER_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success: 1,
                    message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL,
                    result: {
                        status: 0,
                        errorMsg: 'Master data null',
                        procedureSuccess: false,
                        procedureMessage: null
                    },
                    token: refreshedToken || '',
                    error: {
                        errorCode: null,
                        errorMessage: null
                    }
                });
            }

            const PREV_DB_RESPONSE = await ScheduleAssessmentDbObject.getPreviousInherentRiskData(binds);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : PREV_DB_RESPONSE ' + JSON.stringify(PREV_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == PREV_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == PREV_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getPreviousInherentRiskData : PREV_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success: 1,
                    message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL,
                    result: {
                        status: 0,
                        errorMsg: 'Master data null',
                        procedureSuccess: false,
                        procedureMessage: null
                    },
                    token: refreshedToken || '',
                    error: {
                        errorCode: null,
                        errorMessage: null
                    }
                });
            }

            // ======= FORMAT to final recordset buckets =======
            const recordsetObj = await formatGetDataForManageSelfAssessmentScreen(
                userIdFromToken,
                result,
                RCSA_MASTER_DB_RESPONSE,
                PREV_DB_RESPONSE,
                accountGUIDFromToken,
                logger);

            // ======= Return EXACT shape you asked for =======
            const finalPayload = {
                success: 1,
                message: "Data fetch from DB successful.",
                result: {
                    status: 1,
                    recordset: recordsetObj,
                    errorMsg: null,
                    procedureSuccess: true,
                    procedureMessage: "Self Assessment Summary fetched successfully"
                },
                token: refreshedToken || '',
                error: {
                    errorCode: null,
                    errorMessage: null
                }
            };

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : success payload returned.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(finalPayload);

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Got unhandled error. : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success: 1,
                message: MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL,
                result: {
                    status: 0,
                    errorMsg: ('' + error),
                    procedureSuccess: false,
                    procedureMessage: null
                },
                token: refreshedToken || '',
                error: {
                    errorCode: null,
                    errorMessage: null
                }
            });
        }
    }



    /**
     * This function will fetch Self Assessment By Schedule Assessment ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSelfAssessmentDetailsByScheduleInherentID(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.scheduleAssessmentID = request.body.scheduleAssessmentID || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution started.');

            const result = await ScheduleAssessmentDbObject.getSelfAssessmentDetailsByScheduleInherentID(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
            var templateResult = '';
            if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() != "empty") {
                const templateData = { ...result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] };
                templateData.RISKTRAC_WEB_URL = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                const templateCode = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() === "inprogress"
                    ? "SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE" : "SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE";
                templateResult = await resolveOrmEmailTemplateByCode(templateCode, templateData, userIdFromToken);
                if (!templateResult || !templateResult.Subject) {
                    logger.log('warn', 'ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : No DB template for code=' + templateCode);
                    templateResult = { Subject: '', Body: '' };
                }

                const bindsEmail = {};

                var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                toIDs = Array.from(new Set(toIDs.split(','))).toString();
                bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject = templateResult.Subject;
                bindsEmail.emailContent = templateResult.Body;
                bindsEmail.userId = userIdFromToken;
                bindsEmail.userName = userNameFromToken;
                bindsEmail.createdBy = userIdFromToken || "";

                const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of all Schedule Assessment Cards from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllScheduleAssessmentCards(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution started.');

            const result = await ScheduleAssessmentDbObject.getAllScheduleAssessmentCards(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Schedule Assessment by ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduleAssessmentByID(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution started.');

            const result = await ScheduleAssessmentDbObject.getScheduleAssessmentByID(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
            var templateResult = '';
            if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() != "empty") {
                const templateData = { ...result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] };
                templateData.RISKTRAC_WEB_URL = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                const templateCode = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase() === "inprogress"
                    ? "SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE" : "SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE";
                templateResult = await resolveOrmEmailTemplateByCode(templateCode, templateData, userIdFromToken);
                if (!templateResult || !templateResult.Subject) {
                    logger.log('warn', 'ScheduleAssessmentBl : getScheduleAssessmentByID : No DB template for code=' + templateCode);
                    templateResult = { Subject: '', Body: '' };
                }

                const bindsEmail = {};

                var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                toIDs = Array.from(new Set(toIDs.split(','))).toString();
                bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject = templateResult.Subject;
                bindsEmail.emailContent = templateResult.Body;
                bindsEmail.userId = userIdFromToken;
                bindsEmail.userName = userNameFromToken;
                bindsEmail.createdBy = userIdFromToken || "";

                const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of all Self Assessment By Status from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSelfAssessmentSummaryByStatus(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.scheduleInherentRiskStatusID = request.body.scheduleInherentRiskStatusID || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution started.');

            const result = await ScheduleAssessmentDbObject.getSelfAssessmentSummaryByStatus(binds);

            let resultResponse = {
                SelfAssessmentSummary: []
            }

            resultResponse.SelfAssessmentSummary = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            var resultArr = [];
            resultArr.push(resultResponse);

            result.recordset = JSON.parse(JSON.stringify(resultArr));

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA + "|getSelfAssessmentSummaryByStatus", result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update approved schedule inherent risk reviewer details to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateApprovedScheduleInherentRiskReviewerDetails(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            const IsInternalReviewRequired = request.body.IsInternalReviewRequired;

            binds.id = request.body.id || 0;
            binds.reviewerComment = request.body.reviewerComment || "";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;
            binds.IsInternalReviewRequired = request.body.IsInternalReviewRequired || 0;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution started.');

            const result = await ScheduleAssessmentDbObject.updateApprovedScheduleInherentRiskReviewerDetails(binds);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : ' + JSON.stringify(result || null));

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            const templateObject = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            templateObject["ScheduleAssessmentCode_1"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
            templateObject["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
            templateObject["ScheduleAssessmentID"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            templateObject["UnitName"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
            templateObject["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

            // Resolve template by workflow step + reviewer type (DB first; fallback to file-based)
            const reviewerTypeCode = IsInternalReviewRequired === true ? 'INTERNAL' : 'EXTERNAL';
            const specialNote = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote;
            const workflowStepCodeApproved = (specialNote === 'Review-Submit') ? 'RCSA_SELF_ASSESSMENT_SUBMIT' : 'RCSA_SELF_ASSESSMENT_APPROVED';
            let templateResult = await resolveOrmEmailTemplate(workflowStepCodeApproved, reviewerTypeCode, templateObject, userIdFromToken);
            if (!templateResult || !templateResult.Subject) {
                logger.log('warn', 'User Id : ' + (userIdFromToken || 'system') + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : No DB template for step=' + workflowStepCodeApproved + ', reviewerType=' + reviewerTypeCode + '. File-based templates are disabled.');
                templateResult = { Subject: '', Body: '' };
            }

            const bindsEmail = {};

            var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
            var toCCs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
            toIDs = Array.from(new Set(toIDs.split(','))).toString();
            toCCs = Array.from(new Set(toCCs.split(','))).toString();
            bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.toCCs = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.emailSubject = templateResult.Subject;
            bindsEmail.emailContent = templateResult.Body;
            bindsEmail.userId = userIdFromToken;
            bindsEmail.userName = userNameFromToken;
            bindsEmail.createdBy = userIdFromToken || "";

            var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
            var PUGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID;

            const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            let inAppUserList = RMGUID + "," + PUGUID;
            inAppUserList = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

            // templateObject["navUrl"]     = templateObject["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/'  + templateObject["ScheduleAssessmentID"] 
            let inappDetails = {
                inAppContent: 'RCSA Assessment has been Approved for your Department: ' + templateObject["UnitName"] + ": " + templateObject["ScheduleAssessmentCode_1"] + "link:" + 'self-assessments', //templateObject["navUrl"] , 
                recepientUserID: inAppUserList,
                subModuleID: 2
            }

            let setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : updateApprovedScheduleInherentRiskReviewerDetails : inappDetails    : ' + JSON.stringify(inappDetails || null));
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : updateApprovedScheduleInherentRiskReviewerDetails : emailAddResult  : ' + JSON.stringify(emailAddResult || null));
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : updateApprovedScheduleInherentRiskReviewerDetails : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));



            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update rejected schedule inherent risk reviewer details to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateRejectedScheduleInherentRiskReviewerDetails(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            const IsInternalReviewRequired = request.body.IsInternalReviewRequired;

            binds.id = request.body.id || 0;
            binds.reviewerComment = request.body.reviewerComment || "";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;
            binds.IsInternalReviewRequired = request.body.IsInternalReviewRequired || 0;

            //Validating the necessary request values
            var validationMessage = [];

            if (appValidatorObject.isStringUndefined(request.body.reviewerComment) || appValidatorObject.isStringNull(request.body.reviewerComment) || appValidatorObject.isStringEmpty(request.body.reviewerComment)) {
                validationMessage.push('Reviewer Comment');
            }

            if (validationMessage.length > 0) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : ' + validationMessage.join(', ') + ' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution started.');



            const result = await ScheduleAssessmentDbObject.updateRejectedScheduleInherentRiskReviewerDetails(binds);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : result :: ' + JSON.stringify(result || null));

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            const mappedData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            mappedData["ScheduleAssessmentCode_1"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
            mappedData["ScheduleAssessmentID"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            mappedData["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
            mappedData["UnitName"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
            mappedData["InherentRiskID"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleInherentRiskID;
            mappedData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

            // Resolve template by workflow step + reviewer type (DB first; fallback to file-based)
            const reviewerTypeCodeReject = IsInternalReviewRequired === true ? 'INTERNAL' : 'EXTERNAL';
            const specialNoteReject = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote;
            const workflowStepCodeRejected = (specialNoteReject === 'Review-Submit') ? 'RCSA_SELF_ASSESSMENT_SUBMIT' : 'RCSA_SELF_ASSESSMENT_REJECTED';
            let templateResult = await resolveOrmEmailTemplate(workflowStepCodeRejected, reviewerTypeCodeReject, mappedData, userIdFromToken);
            if (!templateResult || !templateResult.Subject) {
                logger.log('warn', 'User Id : ' + (userIdFromToken || 'system') + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : No DB template for step=' + workflowStepCodeRejected + ', reviewerType=' + reviewerTypeCodeReject + '. File-based templates are disabled.');
                templateResult = { Subject: '', Body: '' };
            }


            const bindsEmail = {};
            var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
            var toCCs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
            toIDs = Array.from(new Set(toIDs.split(','))).toString();
            toCCs = Array.from(new Set(toCCs.split(','))).toString();
            bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.toCCs = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.emailSubject = templateResult.Subject;
            bindsEmail.emailContent = templateResult.Body;
            bindsEmail.userId = userIdFromToken;
            bindsEmail.userName = userNameFromToken;
            bindsEmail.createdBy = userIdFromToken || "";

            const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            var PUGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID;
            var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
            // mappedData["navUrl"]                        = mappedData["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/' + mappedData["ScheduleAssessmentID"] 

            let inAppUserList = RMGUID + "," + PUGUID;
            inAppUserList = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

            let inappDetails = {
                inAppContent: 'RCSA Assessment has been Rejected for your Department: ' + mappedData["UnitName"] + ": " + mappedData["ScheduleAssessmentCode_1"] + "link:" + 'self-assessments',  //mappedData["navUrl"] ,                
                recepientUserID: inAppUserList,
                subModuleID: 2
            }

            let setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : updateRejectedScheduleInherentRiskReviewerDetails : inappDetails    : ' + JSON.stringify(inappDetails || null));
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : updateRejectedScheduleInherentRiskReviewerDetails : emailAddResult  : ' + JSON.stringify(emailAddResult || null));
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : updateRejectedScheduleInherentRiskReviewerDetails : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will manage schedule assessment details to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async manageScheduleAssessmentDetails(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        // logger.log('info', 'result-resubmit-scenario : request.body : ' + JSON.stringify(request.body || null));
        // near the top of manageScheduleAssessmentDetails
        const loggerLocal = logger ?? (typeof global !== 'undefined' && global.logger) ?? console;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;


            binds.id = request.body.id || 0; // ScheduleInherentRiskID
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;
            binds.scheduleAssessmentID = request.body.scheduleAssessmentID;
            binds.UnitID = request.body.UnitID
            binds.OverallInherentRiskID = request.body.OverallInherentRiskID
            binds.appetiteResidualRiskRatingID = request.body.appetiteResidualRiskRatingID

            // --- assessment proc inputs ---
            const controlDataInput = request.body.controlData ?? request.body.control ?? null;
            binds.controlData = controlDataInput
                ? (typeof controlDataInput === 'string' ? controlDataInput : JSON.stringify(controlDataInput))
                : null;

            binds.controlAssessmentAndResidualRiskJSONData = request.body.controlAssessmentAndResidualRiskJSONData
                ? JSON.stringify(request.body.controlAssessmentAndResidualRiskJSONData)
                : null;

            binds.overallControlTotalScore = null;
            binds.overallControlEnvironmentRiskRatingID = null;
            binds.residualRiskRatingID = null;
            binds.IsActionPlanRequired = null;

            binds.controlTestingJSONData = request.body.controlTestingJSONData
                ? JSON.stringify(request.body.controlTestingJSONData)
                : null;

            binds.selfComment = request.body.selfComment || '';
            binds.isSubmit = request.body.isSubmit || 0;

            // --- action plan (OPTIONAL) ---
            const apPayload = Array.isArray(request.body.scheduleActionPlanJSONData)
                ? request.body.scheduleActionPlanJSONData
                : [];
            const hasActionPlanPayload = true; // apPayload.length > 0;

            // for ManageScheduleActionPlan proc we only send the JSON string
            binds.scheduleActionPlanJSONData = hasActionPlanPayload ? JSON.stringify(apPayload) : null;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution started.');

            const masterData = await ScheduleAssessmentDbObject.getDataForManageScoreAndRiskRating(binds);

            const formattedMasterData = await formatGetDataForManageScoreAndRiskRating(userIdFromToken, masterData);
            logger.log('info', 'result-resubmit-scenario : formattedMasterData : ' + JSON.stringify(formattedMasterData || null));
            // --- control & residual inputs  
            const controlAssessmentAndResidualRiskJSONData =
                (request.body.controlAssessmentAndResidualRiskJSONData || [])[0] || {};

            const {
                overallControlTotalScore,
                overallControlEnvironmentRiskRatingID,
                ResidualRiskID,
                IsActionPlanRequired
            } = computeAssessmentOutputs(binds, controlAssessmentAndResidualRiskJSONData, formattedMasterData, userIdFromToken, loggerLocal);

            binds.overallControlTotalScore = overallControlTotalScore;
            binds.overallControlEnvironmentRiskRatingID = overallControlEnvironmentRiskRatingID;
            binds.residualRiskRatingID = ResidualRiskID;
            binds.IsActionPlanRequired = IsActionPlanRequired;

            // --- risk treatment (OPTIONAL)  
            // --- risk treatment (accepts array OR pre-stringified JSON) ---
            const rtRaw = request.body.RiskTreatmentJSONData;        // can be [] or "[{...}]"
            let rtArray = [];

            if (Array.isArray(rtRaw)) {
                rtArray = rtRaw;
            } else if (typeof rtRaw === 'string' && rtRaw.trim() !== '') {
                try { rtArray = JSON.parse(rtRaw); } catch (e) { rtArray = []; }
            }

            const hasRiskTreatmentPayload = Array.isArray(rtArray) && rtArray.length > 0;

            // send to proc as JSON string (use the string you received if it was already a string)
            binds.riskTreatmentJSONData =
                hasRiskTreatmentPayload
                    ? (typeof rtRaw === 'string' ? rtRaw : JSON.stringify(rtArray))
                    : null;

            // extra fields from request
            binds.postTreatmentDescription = request.body.PostTreatmentDescription ?? null;

            // normalize IsActionPlanImplemented from boolean/number/string -> bit
            const impl = request.body.IsActionPlanImplemented;
            const implBool = (impl === true) || (impl === 1) || (impl === '1') || (String(impl).toLowerCase() === 'true');

            // compute post-treatment metrics only if payload exists; otherwise nulls + false
            if (hasRiskTreatmentPayload) {
                const firstRT = rtArray[0] || {};

                // computeAssessmentOutputs returns generic names; map them to post-treatment binds
                const {
                    overallControlTotalScore,
                    overallControlEnvironmentRiskRatingID,
                    ResidualRiskID
                } = computeAssessmentOutputs(binds, firstRT, formattedMasterData, userIdFromToken, loggerLocal);

                binds.PostTreatmentControlTotalScore = overallControlTotalScore ?? null;
                binds.PostTreatmentControlRatingID = overallControlEnvironmentRiskRatingID ?? null;
                binds.PostTreatmentResidualRiskRatingID = ResidualRiskID ?? null;
                binds.IsActionPlanImplemented = implBool ? 1 : 0;
            } else {
                binds.PostTreatmentControlTotalScore = null;
                binds.PostTreatmentControlRatingID = null;
                binds.PostTreatmentResidualRiskRatingID = null;
                binds.IsActionPlanImplemented = 0; // false when no RT payload
            }

            // (optional) helpful logs
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : hasRiskTreatmentPayload = ' + hasRiskTreatmentPayload);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : RiskTreatmentJSONData = ' + binds.riskTreatmentJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : PostTreatmentDescription = ' + binds.postTreatmentDescription);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : IsActionPlanImplemented = ' + binds.IsActionPlanImplemented);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : PostTreatmentControlTotalScore = ' + binds.PostTreatmentControlTotalScore);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : PostTreatmentControlRatingID = ' + binds.PostTreatmentControlRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : PostTreatmentResidualRiskRatingID = ' + binds.PostTreatmentResidualRiskRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : IsActionPlanImplemented = ' + binds.IsActionPlanImplemented);


            // 1) call assessment details
            const result = await ScheduleAssessmentDbObject.manageScheduleAssessmentDetails(binds);
            // logger.log('info', 'result-resubmit-scenario : ' + JSON.stringify(result));

            // --- validations for first call ---
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // 2) ONLY NOW call action plan (and only if payload exists)
            let actionPlanResult = null;
            if (hasActionPlanPayload) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Calling manageScheduleActionPlan.');
                actionPlanResult = await ScheduleAssessmentDbObject.manageScheduleActionPlan(binds);

                // validations for second call
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == actionPlanResult || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == actionPlanResult) {
                    logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleActionPlan : result is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                        .json(unsuccessfulResponse(refreshedToken, 'Saving Action Plan failed.'));
                }
                if (actionPlanResult.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleActionPlan : Error details : ' + actionPlanResult.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                        .json(unsuccessfulResponse(refreshedToken, 'Saving Action Plan failed.'));
                }
                if (actionPlanResult.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && actionPlanResult.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleActionPlan : Error details : ' + actionPlanResult.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                        .json(unsuccessfulResponse(refreshedToken, actionPlanResult.procedureMessage || 'Saving Action Plan failed.'));
                }
            }

            // 3) Risk Treatment Plan call(only if payload exists)
            let riskTreatmentResult = null;
            if (hasRiskTreatmentPayload) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Calling manageScheduleRiskTreatmentPlan.');
                riskTreatmentResult = await ScheduleAssessmentDbObject.manageScheduleRiskTreatmentPlan(binds);

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskTreatmentResult || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskTreatmentResult) {
                    logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleRiskTreatmentPlan : result is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                        .json(unsuccessfulResponse(refreshedToken, 'Saving Risk Treatment Plan failed.'));
                }
                if (riskTreatmentResult.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleRiskTreatmentPlan : Error details : ' + riskTreatmentResult.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                        .json(unsuccessfulResponse(refreshedToken, 'Saving Risk Treatment Plan failed.'));
                }
                if (riskTreatmentResult.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && riskTreatmentResult.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleRiskTreatmentPlan : Error details : ' + riskTreatmentResult.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                        .json(unsuccessfulResponse(refreshedToken, riskTreatmentResult.procedureMessage || 'Saving Risk Treatment Plan failed.'));
                }
            }

            // keep original recordset for client compatibility
            const resultRecordSet = result.recordset;

            // submit: email + inapp 
            if (binds.isSubmit) {
                const dynamicObject = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                dynamicObject["ScheduleAssessmentCode_1"] = dynamicObject.ScheduleAssessmentCode;
                dynamicObject["ScheduleAssessmentDescription"] = dynamicObject.ScheduleAssessmentDescription;
                dynamicObject["UnitName"] = dynamicObject.RCSAUnitName;
                dynamicObject["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                dynamicObject["ScheduleAssessmentID"] = dynamicObject.ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
                let templateResult = await resolveOrmEmailTemplateByCode("SELF_ASSESSMENT_RESUBMIT_EMAIL_TEMPLATE", dynamicObject, userIdFromToken);
                if (!templateResult || !templateResult.Subject) {
                    logger.log('warn', 'ScheduleAssessmentBl : manageScheduleAssessmentDetails : No DB template for SELF_ASSESSMENT_RESUBMIT_EMAIL_TEMPLATE');
                    templateResult = { Subject: '', Body: '' };
                }

                const bindsEmail = {};
                var toIDs = dynamicObject.ReviewersEmailID;
                var toCCs = dynamicObject.RMUsersEmailID + "," + dynamicObject.RCSAPowerUsersEmailID;
                toIDs = Array.from(new Set((toIDs || '').split(','))).toString();
                toCCs = Array.from(new Set((toCCs || '').split(','))).toString();

                bindsEmail.toIDs = (toIDs || '').replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs = (toCCs || '').replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject = templateResult.Subject;
                bindsEmail.emailContent = templateResult.Body;
                bindsEmail.userId = userIdFromToken;
                bindsEmail.userName = userNameFromToken;
                bindsEmail.createdBy = userIdFromToken || "";

                const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
                var RGUID = dynamicObject.ReviewersGUID;
                var RMGUID = dynamicObject.RMUsersGUID;
                let inAppUserList = (RGUID + "," + RMGUID).split(',')
                    .filter(item => item && item != 'undefined' && item != 'null')
                    .filter(Boolean).join(',');

                let inappDetails = {
                    inAppContent: 'RCSA Assessment has been Re-Submitted for Review: ' + dynamicObject["UnitName"] + ": " + dynamicObject["ScheduleAssessmentCode_1"] + " link:self-assessments",
                    recepientUserID: inAppUserList,
                    subModuleID: 2
                };

                let setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

                // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : manageScheduleAssessmentDetails : inappDetails    : ' + JSON.stringify(inappDetails || null));
                // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : manageScheduleAssessmentDetails : emailAddResult  : ' + JSON.stringify(emailAddResult || null));
                // logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : manageScheduleAssessmentDetails : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
            }

            const payload = {
                ...result,
                riskTreatment: hasRiskTreatmentPayload ? riskTreatmentResult : null,
                actionPlan: hasActionPlanPayload ? actionPlanResult : null
            };
            payload.recordset = resultRecordSet;


            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(successfulResponse(refreshedToken, binds.isSubmit ? MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, payload));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch schedule inherent risk action trail from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduleInherentRiskActionTrail(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleInherentRiskActiontrail : Execution started.');

            const result = await ScheduleAssessmentDbObject.getScheduleInherentRiskActionTrail(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch action responsible person from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getActionResponsiblePerson(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution started.');

            const result = await ScheduleAssessmentDbObject.getActionResponsiblePerson(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch residual risk response from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getResidualRiskResponse(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution started.');

            const result = await ScheduleAssessmentDbObject.getResidualRiskResponse(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch control type from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getControlType(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getControlType : Execution started.');

            const result = await ScheduleAssessmentDbObject.getControlType(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getControlType : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getControlType : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getControlType : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getControlType : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getControlType : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getControlType : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch residual risk responsible person from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getResidualRiskResponsiblePerson(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution started.');

            const result = await ScheduleAssessmentDbObject.getResidualRiskResponsiblePerson(binds);

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will submit self assessment by schedule assessment to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async submitSelfAssessmentsByScheduleAssessment(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let messageData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution started.');

            const result = await ScheduleAssessmentDbObject.submitSelfAssessmentsByScheduleAssessment(binds);

            logger.log('info', 'submitSelfAssessmentsByScheduleAssessment : result-unit-names : ' + JSON.stringify(result));

            //If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]?.length) {
                const SAMasterData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                SAMasterData["ScheduleAssessmentCode_1"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                SAMasterData["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
                SAMasterData["InherentRiskID"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleInherentRiskID;
                SAMasterData["UnitName"] = formatUnitNames(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName);
                SAMasterData["RCSAUnitName"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
                SAMasterData["RISKTRAC_WEB_URL"] = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                SAMasterData["ScheduleAssessmentID"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                // Email templates must always be fetched from DB. Hardcoded/API-based templates are deprecated.
                let templateResult = await resolveOrmEmailTemplateByCode("SELF_ASSESSMENT_SUBMIT_EMAIL_TEMPLATE", SAMasterData, userIdFromToken);
                if (!templateResult || !templateResult.Subject) {
                    logger.log('warn', 'ScheduleAssessmentBl : addScheduleAssessment : No DB template for SELF_ASSESSMENT_SUBMIT_EMAIL_TEMPLATE');
                    templateResult = { Subject: '', Body: '' };
                }
                if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote == "Submit") {
                    messageData = 'RCSA Assessment has been Submitted for Review: ' + SAMasterData["ScheduleAssessmentCode_1"] + ", Unit : " + SAMasterData["RCSAUnitName"];
                } else {
                    messageData = 'RCSA Assessment has been Re-Submitted for Review: ' + SAMasterData["ScheduleAssessmentCode_1"] + ", Unit : " + SAMasterData["RCSAUnitName"];
                }

                const bindsEmail = {};

                var toIDs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID + "," + result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                toIDs = Array.from(new Set(toIDs.split(','))).toString();
                toCCs = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject = templateResult.Subject;
                bindsEmail.emailContent = templateResult.Body;
                bindsEmail.userId = userIdFromToken;
                bindsEmail.userName = userNameFromToken;
                bindsEmail.createdBy = userIdFromToken || "";

                logger.log('info', 'bindsEmail : ' + JSON.stringify(bindsEmail));

                let emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
                var RGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
                var PUGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID;

                // SAMasterData["navUrl"]                        = SAMasterData["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/637'+ SAMasterData["ScheduleAssessmentID"]  
                let inAppUserList = RGUID + "," + RMGUID + "," + PUGUID;
                inAppUserList = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

                let inappDetails = {
                    inAppContent: messageData + "link:" + 'self-assessments',  //SAMasterData["navUrl"] , 
                    recepientUserID: inAppUserList,
                    subModuleID: 2
                }

                let setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : inappDetails    : ' + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : emailAddResult  : ' + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
            }

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To upload rcsa evidence 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async uploadRCSAEvidence(request, response) {
        try {
            response.setTimeout(1200000);

            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var remarks = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var id = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            var destinationPath = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {
                fileName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            remarks = request.body.remarks;
            id = request.body.id;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution started.');

            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {

                const ALLOWED_FILE_EXTENSION_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_MIME_TYPES

                await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, function (fileUploadResponseObject) {
                    if (fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {

                        data.fileName = fileUploadResponseObject.fileName;
                        data.fileContent = fileUploadResponseObject.fileDataContent;
                        data.fileType = fileUploadResponseObject.fileExtension;

                        ScheduleAssessmentDbObject.uploadRCSAEvidence(id, userIdFromToken, userNameFromToken, data, remarks, accountGUIDFromToken, async function (ADD_RCSA_EVIDENCE) {
                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_RCSA_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_RCSA_EVIDENCE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Upload RAT response is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_RCSA_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Error details : ' + ADD_RCSA_EVIDENCE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_RCSA_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_RCSA_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Error details : ' + ADD_RCSA_EVIDENCE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                            }

                            /**
                             * Formating resultset provided by DB : START.
                             */
                            const FORMAT_DATA_RESULT = await formatEvidencelist(userIdFromToken, ADD_RCSA_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], accountGUIDFromToken);
                            /**
                             * Formating resultset provided by DB : END.
                             */

                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DATA_RESULT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DATA_RESULT) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : FORMAT_DATA_RESULT is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                            }

                            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : RCSA evidence uploaded successfully.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_DATA_RESULT));
                        });
                    }
                    else {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Error on dumping file into server. : Error detail : ' + fileUploadResponseObject.errorMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                });
            }
            else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }

    /**
    * To download RCSA evidence
    * @param {*} request 
    * @param {*} response 
    * @returns 
    */
    async downloadRCSAEvidence(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            evidenceID = request.body.evidenceID;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DOWNLOAD__RESPONSE = await ScheduleAssessmentDbObject.downloadRCSAEvidence(userIdFromToken, userNameFromToken, evidenceID, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD__RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD__RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : DOWNLOAD__RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD__RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            //Formating DB response 
            const RCSA_DOWNLOAD_RESPONSE = await formatDownloadResponse(userIdFromToken, DOWNLOAD__RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : GET_RCSA_FORMAT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : RCSA evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, RCSA_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To delete RCSA evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteRCSAEvidence(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            evidenceID = request.body.evidenceID;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution started.');


            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await ScheduleAssessmentDbObject.deleteRCSAEvidence(userIdFromToken, userNameFromToken, evidenceID, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : DELETE_RESPONSE of RCSA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : RCSA evidence deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    async addaddhocrisk(request, response) {
        var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            // --- Bind inputs expected by DB layer / stored procedure ---
            binds.scheduleAssessmentID = request.body.scheduleAssessmentID || 0; // NEW
            binds.unitID = request.body.unitID || 0;
            binds.processID = request.body.processID;
            binds.riskCategoryID = request.body.riskCategoryID || 0;
            binds.risk = request.body.risk || "";
            binds.inherentLikelihoodID = request.body.inherentLikelihoodID || 0;
            binds.inherentImpactRatingID = request.body.inherentImpactRatingID || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            // Validating the necessary request values
            var validationMessage = [];

            if (request.body.scheduleAssessmentID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.scheduleAssessmentID == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('Schedule Assessment ID');
            }

            if (request.body.unitID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.unitID == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('UnitID');
            }

            if (request.body.riskCategoryID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.riskCategoryID == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('Risk Category ID');
            }

            if (appValidatorObject.isStringUndefined(request.body.risk) || appValidatorObject.isStringNull(request.body.risk) || appValidatorObject.isStringEmpty(request.body.risk)) {
                validationMessage.push('Risk');
            }

            if (request.body.inherentLikelihoodID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.inherentLikelihoodID == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('Inherent Likelihood ID');
            }

            if (request.body.inherentImpactRatingID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.inherentImpactRatingID == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('Inherent Impact Rating ID');
            }

            if (validationMessage.length > 0) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : ' + validationMessage.join(', ') + ' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, "Required parameter(s) missing."));
            }

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : Execution started.');

            const result = await ScheduleAssessmentDbObject.addadhocrisk(binds);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : result ' + JSON.stringify(result));

            // If undefined
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            // if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            // if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentBl : addaddhocrisk : Execution end. : Data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : addaddhocrisk : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }


    stop() {
    }

}

async function formatGetDataForManageSelfAssessmentScreen(userIdFromToken, Currentdata, RCSAData, prevData, accountGUIDFromToken, logger) {
    try {
        // logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageSelfAssessmentScreen : Execution started. :: Currentdata : ' + JSON.stringify(Currentdata || null));

        let ControlType = [];
        let ControlInPace = [];
        let ControlNatureScore = [];
        let ControlAutomationScore = [];
        let ControlFrequencyScore = [];
        let ActionPlanStatus = [];
        let ActionResponsiblePerson = [];
        let ControlVerificationClosure = [];
        let ResidualRiskResponse = [];
        let ResidualRiskResponsiblePerson = [];
        let ControlTestingResult = [];
        let ActionTrailSummary = [];
        let SelfAssessmentInfo = [];
        let Evidence = [];
        let ControlData = [];
        let ActionPlanData = [];
        let prevQuarter = [];
        let preQuarterEvidence = [];

        // Master / other
        let MasterResidualRiskResponse = [];
        let MasterRiskResponsiblePerson = [];
        let MasterActionResponsiblePerson = [];
        let MasterActionPlanStatus = [];
        let MasterControlVerificationClosure = [];
        let MasterReviewers = [];
        let MasterUsersList = [];
        let MasterControlTestingResult = [];
        let ControlsMasterData = [];

        const ZERO = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        const ONE = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        const TWO = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        const THREE = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        const FOUR = CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR;
        const FIVE = CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE;
        const SIX = CONSTANT_FILE_OBJ.APP_CONSTANT.SIX;
        const SEVEN = CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN;
        const EIGHT = CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT;
        const NINE = CONSTANT_FILE_OBJ.APP_CONSTANT.NINE;
        const TEN = CONSTANT_FILE_OBJ.APP_CONSTANT.TEN;
        const ELEVEN = CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN;
        const TWELVE = CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE;
        const FIFTEEN = CONSTANT_FILE_OBJ.APP_CONSTANT.FIFTEEN;
        const SIXTEEN = CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTEEN;
        const NULL = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        // ================= MAIN BUCKETS =====================
        if (Currentdata.recordset[ZERO] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[ZERO])) {
                ControlType.push({
                    "ControlTypeID": obj.ControlTypeID,
                    "ControlType": obj.ControlType,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[ONE] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[ONE])) {
                ControlInPace.push({
                    "ControlInPaceID": obj.ControlInPaceID,
                    "Name": obj.Name,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[TWO] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[TWO])) {
                ControlNatureScore.push({
                    "ControlNatureID": obj.ControlNatureID,
                    "NatureofControl": obj.NatureofControl,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[THREE] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[THREE])) {
                ControlAutomationScore.push({
                    "ControlAutomationID": obj.ControlAutomationID,
                    "LevelOfControl": obj.LevelOfControl,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[FOUR] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[FOUR])) {
                ControlFrequencyScore.push({
                    "ControlFrequencyID": obj.ControlFrequencyID,
                    "Frequency": obj.Frequency,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[FIVE] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[FIVE])) {
                ActionPlanStatus.push({
                    "ActionPlanStatusID": obj.ActionPlanStatusID,
                    "ActionPlanStatus": obj.ActionPlanStatus,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[SIX] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[SIX])) {
                ActionResponsiblePerson.push({
                    "ActionResponsiblePersonID": obj.ActionResponsiblePersonID,
                    "UserGUID": obj.UserGUID,
                    "Description": obj.Description,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[SEVEN] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[SEVEN])) {
                ControlVerificationClosure.push({
                    "ControlVerificationClosureID": obj.ControlVerificationClosureID,
                    "ControlVerificationClosure": obj.ControlVerificationClosure,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[EIGHT] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[EIGHT])) {
                ResidualRiskResponse.push({
                    "ResidualRiskResponseID": obj.ResidualRiskResponseID,
                    "RiskResponse": obj.RiskResponse
                });
            }
        }

        if (Currentdata.recordset[NINE] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[NINE])) {
                ResidualRiskResponsiblePerson.push({
                    "ResidualRiskResponsiblePersonID": obj.ResidualRiskResponsiblePersonID,
                    "ResponsiblePerson": obj.ResponsiblePerson,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted,
                    "UserGUID": obj.UserGUID
                });
            }
        }

        if (Currentdata.recordset[TEN] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[TEN])) {
                ControlTestingResult.push({
                    "ControlTestingResultID": obj.ControlTestingResultID,
                    "ControlTestingResult": obj.ControlTestingResult,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (Currentdata.recordset[ELEVEN] != null) {
            for (const obj of Object.values(Currentdata.recordset[ELEVEN])) {
                // logger.log('info', `User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : 
                //     formatGetDataForManageSelfAssessmentScreen : ActionTrailSummary : `
                //     + JSON.stringify(obj || null));

                ActionTrailSummary.push({
                    "ScheduleInherentActionTrailID": obj.ScheduleInherentActionTrailID,
                    "ScheduleInherentRiskID": obj.ScheduleInherentRiskID,
                    "UnitName": obj.UnitName,
                    "ScheduleInherentRiskStatusID": obj.ScheduleInherentRiskStatusID,
                    "ScheduleInherentStatus": obj.ScheduleInherentStatus,
                    "ActionComment": obj.ActionComment,
                    "CreatedBy": obj.CreatedBy,
                    "CreatedByUser": obj.CreatedByUser,
                    "CreatedDate": formatDate(obj.CreatedDate)
                });
            }
        }

        let selfRow = null;
        let parsedControlData = [];
        let parsedActionPlanData = [];

        if (Currentdata.recordset[TWELVE] != NULL) {
            const list = Object.values(Currentdata.recordset[TWELVE]);
            if (list.length > 0) {
                const obj = list[0];

                // Parse first so counts are correct
                parsedControlData = await toArray(obj.ControlData) || [];
                parsedActionPlanData = await toArray(obj.ActionPlanData) || [];

                SelfAssessmentInfo.push({
                    "ScheduleAssessmentID": obj.ScheduleAssessmentID,
                    "RCSACode": obj.RCSACode,
                    "SchedulePeriod": obj.SchedulePeriod,
                    "ProposedStartDate": obj.ProposedStartDate,
                    "ProposedCompletionDate": obj.ProposedCompletionDate,
                    "ReminderDate": obj.ReminderDate,
                    "ScheduleInherentRiskID": obj.ScheduleInherentRiskID,
                    "Risk": obj.Risk,
                    "RCSAStatusID": obj.RCSAStatusID,
                    "RCSAStatusName": obj.RCSAStatusName,
                    "GroupID": obj.GroupID,
                    "GroupName": obj.GroupName,
                    "UnitID": obj.UnitID,
                    "UnitName": obj.UnitName,
                    "RiskCategoryID": obj.RiskCategoryID,
                    "RiskCategoryName": obj.RiskCategoryName,
                    "ProcessID": obj.ProcessID,
                    "ProcessName": obj.ProcessName,
                    "InherentLikelihoodID": obj.InherentLikelihoodID,
                    "InherentLikelihoodName": obj.InherentLikelihoodName,
                    "InherentImpactRatingID": obj.InherentImpactRatingID,
                    "InherentImpactRatingName": obj.InherentImpactRatingName,
                    "OverallInherentRiskID": obj.OverallInherentRiskID,
                    "OverallInherentRiskScore": obj.OverallInherentRiskScore,
                    "OverallInherentRiskRating": obj.OverallInherentRiskRating,
                    "OverallInherentRiskColor": obj.OverallInherentRiskColor,
                    "ScheduleControlAssessmentAndResidualRiskID": obj.ScheduleControlAssessmentAndResidualRiskID,
                    "IsActionPlanRequired": obj.IsActionPlanRequired,
                    "ActionPlanCount": parsedActionPlanData.length,
                    "ControlInPaceID": obj.ControlInPaceID,
                    "ControlInPaceName": obj.ControlInPaceName,
                    "ControlNatureID": obj.ControlNatureID,
                    "ControlNatureName": obj.ControlNatureName,
                    "ControlAutomationID": obj.ControlAutomationID,
                    "ControlAutomationName": obj.ControlAutomationName,
                    "ControlFrequencyID": obj.ControlFrequencyID,
                    "ControlFrequencyName": obj.ControlFrequencyName,
                    "OverallControlTotalScore": obj.OverallControlTotalScore,
                    "OverallControlEnvironmentRiskRating": obj.OverallControlEnvironmentRiskRating,
                    "OverallControlEnvironmentRatingColourCode": obj.OverallControlEnvironmentRatingColourCode,
                    "ResidualRiskRating": obj.ResidualRiskRating,
                    "ResidualRiskRatingColourCode": obj.ResidualRiskRatingColourCode,
                    "ResidualRiskResponseID": obj.ResidualRiskResponseID,
                    "ResidualRiskResponseName": obj.ResidualRiskResponseName,
                    "ResidualRiskResponsiblePersonID": obj.ResidualRiskResponsiblePersonID,
                    "ResidualRiskResponsiblePersonName": obj.ResidualRiskResponsiblePersonName,
                    "ScheduleControlTestingID": obj.ScheduleControlTestingID,
                    "ControlTestingResultID": obj.ControlTestingResultID,
                    "ControlTestingResultName": obj.ControlTestingResultName,
                    "ControlTestingResultComment": obj.ControlTestingResultComment,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted,
                    "MasterInherentRiskID": obj.MasterInherentRiskID,
                    "SLNO": obj.SLNO,
                    "ScheduleInherentRiskStatusID": obj.ScheduleInherentRiskStatusID,
                    "ScheduleInherentRiskStatusName": obj.ScheduleInherentRiskStatusName,
                    "SelfComment": obj.SelfComment,
                    "ISSubmitEnabled": obj.ISSubmitEnabled,
                    "ISReviewerPanelEnabled": obj.ISReviewerPanelEnabled,
                    "ISSaveEnabled": obj.ISSaveEnabled,
                    "ISRMSaveEnabled": obj.ISRMSaveEnabled,
                    "UnitIDs": obj.UnitIDs,
                    "OverallControlEnvironmentRiskRatingID": obj.OverallControlEnvironmentRiskRatingID,
                    "ResidualRiskRatingID": obj.ResidualRiskRatingID,
                    "ResidualRiskID": obj.ResidualRiskID,
                    "IsInternalReviewer": obj.IsInternalReviewer,
                    "IsInternalReviewRequired": obj.IsInternalReviewRequired,
                    "ScheduleRiskTreatmentPlanID": obj.ScheduleRiskTreatmentPlanID,
                    "PostTreatmentControlInPaceID": obj.PostTreatmentControlInPaceID,
                    "PostTreatmentControlInPaceName": obj.PostTreatmentControlInPaceName,
                    "PostTreatmentComputedControlInPace": obj.PostTreatmentComputedControlInPace,
                    "PostTreatmentControlAutomationID": obj.PostTreatmentControlAutomationID,
                    "PostTreatmentControlAutomationName": obj.PostTreatmentControlAutomationName,
                    "PostTreatmentComputedControlAutomationScore": obj.PostTreatmentComputedControlAutomationScore,
                    "PostTreatmentControlNatureID": obj.PostTreatmentControlNatureID,
                    "PostTreatmentControlNatureName": obj.PostTreatmentControlNatureName,
                    "PostTreatmentComputedControlNatureofControl": obj.PostTreatmentComputedControlNatureofControl,
                    "PostTreatmentComputedControlNatureScore": obj.PostTreatmentComputedControlNatureScore,
                    "PostTreatmentControlFrequencyID": obj.PostTreatmentControlFrequencyID,
                    "PostTreatmentControlFrequencyName": obj.PostTreatmentControlFrequencyName,
                    "PostTreatmentControlFrequencyScore": obj.PostTreatmentControlFrequencyScore,
                    "PostTreatmentControlTotalScore": obj.PostTreatmentControlTotalScore,
                    "PostTreatmentControlRatingID": obj.PostTreatmentControlRatingID,
                    "PostTreatmentControlEnvironmentRiskRating": obj.PostTreatmentControlEnvironmentRiskRating,
                    "PostTreatmentControlEnvironmentRatingColourCode": obj.PostTreatmentControlEnvironmentRatingColourCode,
                    "IsActionPlanImplemented": obj.IsActionPlanImplemented,
                    "PostTreatmentResidualRiskRatingID": obj.PostTreatmentResidualRiskRatingID,
                    "PostTreatmentResidualRiskID": obj.PostTreatmentResidualRiskID,
                    "PostTreatmentResidualRiskRating": obj.PostTreatmentResidualRiskRating,
                    "PostTreatmentResidualRiskRatingColourCode": obj.PostTreatmentResidualRiskRatingColourCode,
                    "PostTreatmentDescription": obj.PostTreatmentDescription
                });
                selfRow = obj;
            }
        }


        if (selfRow) {
            // ControlData
            for (const c of parsedControlData) {
                ControlData.push({
                    "ScheduleControlAssessmentAndResidualRiskID": c.ScheduleControlAssessmentAndResidualRiskID,
                    "ScheduleInherentRiskID": c.ScheduleInherentRiskID,
                    "ScheduleControlID": c.ScheduleControlID,
                    "ControlIDs": c.ControlIDs,
                    "ControlDescription": c.ControlDescription,
                    "ControlTypeID": c.ControlTypeID,
                    "ControlType": c.ControlType,
                    "ControlCode": c.ControlCode
                });
            }

            // ActionPlanData
            for (const a of parsedActionPlanData) {
                let ProjectViability = null;

                if (a.BenefitCostRatio == null) {
                    ProjectViability = null;
                } else if (a.BenefitCostRatio > 1) {
                    ProjectViability = "project is viable";
                } else if (a.BenefitCostRatio < 1) {
                    ProjectViability = "project is not viable";
                } else {
                    ProjectViability = "Break-even";
                }

                ActionPlanData.push({
                    "ScheduleActionPlanID": a.ScheduleActionPlanID,
                    "IdentifiedAction": a.IdentifiedAction,
                    "ActionResponsiblePersonID": a.ActionResponsiblePersonID,
                    "ActionResponsiblePersonName": a.ActionResponsiblePersonName,
                    "Timeline": a.Timeline,
                    "ActionPlanStatusID": a.ActionPlanStatusID,
                    "ActionPlanStatusName": a.ActionPlanStatusName,
                    "ActionPlanComments": a.ActionPlanComments,
                    "ControlVerificationClosureID": a.ControlVerificationClosureID,
                    "ControlVerificationClosureName": a.ControlVerificationClosureName,
                    "TotalCost": a.TotalCost,
                    "TotalBenefit": a.TotalBenefit,
                    "TotalNetBenefit": a.TotalNetBenefit,
                    "TotalPresentValueCost": a.TotalPresentValueCost,
                    "TotalPresentValueBenefit": a.TotalPresentValueBenefit,
                    "BenefitCostRatio": a.BenefitCostRatio,
                    "ProjectViability": ProjectViability,
                    "ControlTypeID": a.ControlTypeID,
                    "ControlType": a.ControlType
                });

            }

        }


        if (Currentdata.recordset[FIFTEEN] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[FIFTEEN])) {
                Evidence.push({
                    "ScheduleAssessmentEvidenceID": obj.ScheduleAssessmentEvidenceID,
                    "ScheduleAssessmentID": obj.ScheduleAssessmentID,
                    "OriginalFileName": obj.OriginalFileName,
                    "FileType": obj.FileType
                });
            }
        }

        if (Currentdata.recordset[SIXTEEN] != NULL) {
            for (const obj of Object.values(Currentdata.recordset[SIXTEEN])) {
                ControlsMasterData.push({
                    "ControlID": obj.ControlID,
                    "ControlCode": obj.ControlCode,
                    "ControlDescription": obj.ControlDescription,
                    "ControlTypeID": obj.ControlTypeID,
                    "ControlType": obj.ControlType,
                    "UnitID": obj.UnitID,
                    "UnitName": obj.UnitName,
                    "IsPublished": obj.IsPublished,
                    "IsActive": obj.IsActive
                });
            }
        }

        // =============== MASTER BUCKETS ==================
        if (RCSAData.recordset[ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[ZERO])) {
                MasterResidualRiskResponse.push({
                    "ResidualRiskResponseID": obj.ResidualRiskResponseID,
                    "RiskResponse": obj.RiskResponse,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (RCSAData.recordset[ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[ONE])) {
                MasterRiskResponsiblePerson.push({
                    "ResidualRiskResponsiblePersonID": obj.ResidualRiskResponsiblePersonID,
                    "ResponsiblePerson": obj.ResponsiblePerson,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted,
                    "UserGUID": obj.UserGUID,
                    "FullName": obj.FullName
                });
            }
        }

        if (RCSAData.recordset[TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[TWO])) {
                MasterActionResponsiblePerson.push({
                    "ActionResponsiblePersonID": obj.ActionResponsiblePersonID,
                    "UserGUID": obj.UserGUID,
                    "Description": obj.Description,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted,
                    "FullName": obj.FullName
                });
            }
        }

        if (RCSAData.recordset[THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[THREE])) {
                MasterActionPlanStatus.push({
                    "ActionPlanStatusID": obj.ActionPlanStatusID,
                    "ActionPlanStatus": obj.ActionPlanStatus,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (RCSAData.recordset[FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[FOUR])) {
                MasterControlVerificationClosure.push({
                    "ControlVerificationClosureID": obj.ControlVerificationClosureID,
                    "ControlVerificationClosure": obj.ControlVerificationClosure,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (RCSAData.recordset[FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[FIVE])) {
                MasterReviewers.push({
                    "ReviewerID": obj.ReviewerID,
                    "UserGUID": obj.UserGUID,
                    "Description": obj.Description,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted,
                    "FullName": obj.FullName
                });
            }
        }

        if (RCSAData.recordset[SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[SIX])) {
                MasterControlTestingResult.push({
                    "ControlTestingResultID": obj.ControlTestingResultID,
                    "ControlTestingResult": obj.ControlTestingResult,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        if (RCSAData.recordset[SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(RCSAData.recordset[SEVEN])) {
                MasterUsersList.push({
                    "UserGUID": obj.UserGUID,
                    "UserName": obj.UserName,
                    "FullName": obj.FullName
                });
            }
        }

        // ======= PREVIOUS QUARTER (prevData) =======
        try {
            // Guards
            if (prevData && prevData.recordset) {
                // prevData.recordset[0] => SelfAssessmentInfo, ControlData, ActionPlanData
                if (prevData.recordset[ZERO] != NULL) {
                    const listPrev = Object.values(prevData.recordset[ZERO] || []);
                    if (listPrev.length > 0) {
                        const p = listPrev[0];

                        // Parse first for correct counts
                        const pControlArr = await toArray(p.ControlData) || [];
                        const pActionArr = await toArray(p.ActionPlanData) || [];

                        // ---- SelfAssessmentInfo (prev)
                        const prevSelfAssessmentInfo = [{
                            "ScheduleAssessmentID": p.ScheduleAssessmentID,
                            "RCSACode": p.RCSACode,
                            "SchedulePeriod": p.SchedulePeriod,
                            "ProposedStartDate": p.ProposedStartDate,
                            "ProposedCompletionDate": p.ProposedCompletionDate,
                            "ReminderDate": p.ReminderDate,
                            "ScheduleInherentRiskID": p.ScheduleInherentRiskID,
                            "Risk": p.Risk,
                            "RCSAStatusID": p.RCSAStatusID,
                            "RCSAStatusName": p.RCSAStatusName,
                            "GroupID": p.GroupID,
                            "GroupName": p.GroupName,
                            "UnitID": p.UnitID,
                            "UnitName": p.UnitName,
                            "RiskCategoryID": p.RiskCategoryID,
                            "RiskCategoryName": p.RiskCategoryName,
                            "ProcessID": p.ProcessID,
                            "ProcessName": p.ProcessName,
                            "InherentLikelihoodID": p.InherentLikelihoodID,
                            "InherentLikelihoodName": p.InherentLikelihoodName,
                            "InherentImpactRatingID": p.InherentImpactRatingID,
                            "InherentImpactRatingName": p.InherentImpactRatingName,
                            "OverallInherentRiskID": p.OverallInherentRiskID,
                            "OverallInherentRiskScore": p.OverallInherentRiskScore,
                            "OverallInherentRiskRating": p.OverallInherentRiskRating,
                            "OverallInherentRiskColor": p.OverallInherentRiskColor,
                            "ScheduleControlAssessmentAndResidualRiskID": p.ScheduleControlAssessmentAndResidualRiskID,
                            // normalized boolean (true/'true'/1/'1' => true; else false)
                            "IsActionPlanRequired": (p.IsActionPlanRequired === true || p.IsActionPlanRequired === 'true' || p.IsActionPlanRequired === 1 || p.IsActionPlanRequired === '1'),
                            "ActionPlanCount": pActionArr.length,
                            "ControlInPaceID": p.ControlInPaceID,
                            "ControlInPaceName": p.ControlInPaceName,
                            "ControlNatureID": p.ControlNatureID,
                            "ControlNatureName": p.ControlNatureName,
                            "ControlAutomationID": p.ControlAutomationID,
                            "ControlAutomationName": p.ControlAutomationName,
                            "ControlFrequencyID": p.ControlFrequencyID,
                            "ControlFrequencyName": p.ControlFrequencyName,
                            "OverallControlTotalScore": p.OverallControlTotalScore,
                            "OverallControlEnvironmentRiskRating": p.OverallControlEnvironmentRiskRating,
                            "OverallControlEnvironmentRatingColourCode": p.OverallControlEnvironmentRatingColourCode,
                            "ResidualRiskRating": p.ResidualRiskRating,
                            "ResidualRiskRatingColourCode": p.ResidualRiskRatingColourCode,
                            "ResidualRiskResponseID": p.ResidualRiskResponseID,
                            "ResidualRiskResponseName": p.ResidualRiskResponseName,
                            "ResidualRiskResponsiblePersonID": p.ResidualRiskResponsiblePersonID,
                            "ResidualRiskResponsiblePersonName": p.ResidualRiskResponsiblePersonName,
                            "ScheduleControlTestingID": p.ScheduleControlTestingID,
                            "ControlTestingResultID": p.ControlTestingResultID,
                            "ControlTestingResultName": p.ControlTestingResultName,
                            "ControlTestingResultComment": p.ControlTestingResultComment,
                            "IsActive": p.IsActive,
                            "IsDeleted": p.IsDeleted,
                            "MasterInherentRiskID": p.MasterInherentRiskID,
                            "SLNO": p.SLNO,
                            "ScheduleInherentRiskStatusID": p.ScheduleInherentRiskStatusID,
                            "ScheduleInherentRiskStatusName": p.ScheduleInherentRiskStatusName,
                            "SelfComment": p.SelfComment,
                            "ISSubmitEnabled": p.ISSubmitEnabled,
                            "ISReviewerPanelEnabled": p.ISReviewerPanelEnabled,
                            "ISSaveEnabled": p.ISSaveEnabled,
                            "ISRMSaveEnabled": p.ISRMSaveEnabled,
                            "UnitIDs": p.UnitIDs,
                            "OverallControlEnvironmentRiskRatingID": p.OverallControlEnvironmentRiskRatingID,
                            "ResidualRiskRatingID": p.ResidualRiskRatingID,
                            "ResidualRiskID": p.ResidualRiskID,
                            "IsInternalReviewer": p.IsInternalReviewer,
                            "IsInternalReviewRequired": p.IsInternalReviewRequired
                        }];

                        // ---- ControlData (prev)
                        const prevControlData = [];
                        for (const c of pControlArr) {
                            prevControlData.push({
                                "ScheduleControlAssessmentAndResidualRiskID": c.ScheduleControlAssessmentAndResidualRiskID,
                                "ScheduleInherentRiskID": c.ScheduleInherentRiskID,
                                "ScheduleControlID": c.ScheduleControlID,
                                "ControlIDs": c.ControlIDs,
                                "ControlDescription": c.ControlDescription,
                                "ControlTypeID": c.ControlTypeID,
                                "ControlType": c.ControlType,
                                "ControlCode": c.ControlCode
                            });
                        }

                        // ---- ActionPlanData (prev)  (includes extended fields)
                        const prevActionPlanData = [];
                        for (const a of pActionArr) {
                            prevActionPlanData.push({
                                "ScheduleActionPlanID": a.ScheduleActionPlanID,
                                "IdentifiedAction": a.IdentifiedAction,
                                "ActionResponsiblePersonID": a.ActionResponsiblePersonID,
                                "ActionResponsiblePersonName": a.ActionResponsiblePersonName,
                                "Timeline": a.Timeline,
                                "ActionPlanStatusID": a.ActionPlanStatusID,
                                "ActionPlanStatusName": a.ActionPlanStatusName,
                                "ActionPlanComments": a.ActionPlanComments,
                                "ControlVerificationClosureID": a.ControlVerificationClosureID,
                                "ControlVerificationClosureName": a.ControlVerificationClosureName,
                                "EstimatedCost": a.EstimatedCost,
                                "EstimatedBenefit": a.EstimatedBenefit,
                                "TotalNetBenefit": a.TotalNetBenefit,
                                "BenefitCostRatio": a.BenefitCostRatio,
                                "ControlTypeID": a.ControlTypeID,
                                "ControlType": a.ControlType
                            });
                        }

                        // Push one consolidated prevQuarter object
                        prevQuarter.push({
                            "SelfAssessmentInfo": prevSelfAssessmentInfo,
                            "ControlData": prevControlData,
                            "ActionPlanData": prevActionPlanData
                        });
                    }
                }

                // prevData.recordset[1] => Evidence for previous quarter
                if (prevData.recordset[ONE] != NULL) {
                    for (const obj of Object.values(prevData.recordset[ONE] || [])) {
                        preQuarterEvidence.push({
                            "ScheduleAssessmentEvidenceID": obj.ScheduleAssessmentEvidenceID,
                            "ScheduleAssessmentID": obj.ScheduleAssessmentID,
                            "OriginalFileName": obj.OriginalFileName,
                            "FileType": obj.FileType
                        });
                    }
                }
            }
        } catch (ePrev) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageSelfAssessmentScreen : prevData handling error : ' + ePrev);
        }

        // Final payload
        let respData = {
            "ControlType": ControlType,
            "ControlInPace": ControlInPace,
            "ControlNatureScore": ControlNatureScore,
            "ControlAutomationScore": ControlAutomationScore,
            "ControlFrequencyScore": ControlFrequencyScore,
            "ActionPlanStatus": ActionPlanStatus,
            "ActionResponsiblePerson": ActionResponsiblePerson,
            "ControlVerificationClosure": ControlVerificationClosure,
            "ResidualRiskResponse": ResidualRiskResponse,
            "ResidualRiskResponsiblePerson": ResidualRiskResponsiblePerson,
            "ControlTestingResult": ControlTestingResult,
            "ActionTrailSummary": ActionTrailSummary,
            "SelfAssessmentInfo": SelfAssessmentInfo,
            "Evidence": Evidence,
            "ControlData": ControlData,
            "ActionPlanData": ActionPlanData,

            "MasterResidualRiskResponse": MasterResidualRiskResponse,
            "MasterRiskResponsiblePerson": MasterRiskResponsiblePerson,
            "MasterActionResponsiblePerson": MasterActionResponsiblePerson,
            "MasterActionPlanStatus": MasterActionPlanStatus,
            "MasterControlVerificationClosure": MasterControlVerificationClosure,
            "MasterReviewers": MasterReviewers,
            "MasterUsersList": MasterUsersList,
            "MasterControlTestingResult": MasterControlTestingResult,
            "ControlsMasterData": ControlsMasterData,
            "prevQuarter": prevQuarter,
            "preQuarterEvidence": preQuarterEvidence
        };

        // logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageSelfAssessmentScreen : Execution end. :: respData : ' + JSON.stringify(respData || null));
        return respData;

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageSelfAssessmentScreen : Execution end. : Got unhandled error. : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function toArray(val, logger, userId = "") {
    try {
        if (val == null) return [];

        // already array
        if (Array.isArray(val)) return val;

        // stringified JSON
        if (typeof val === "string") {
            const t = val.trim();
            if (!t) return [];
            const parsed = JSON.parse(t);
            return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
        }

        // object → wrap in array
        if (typeof val === "object") return [val];

        return [];
    } catch (e) {
        if (logger) {
            logger.log(
                "warn",
                `User Id : ${userId} : toArray parse failed : ${e}`
            );
        }
        return [];
    }
}


async function formatGetDataForManageScoreAndRiskRating(userIdFromToken, data) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageScoreAndRiskRating : Execution started. :: data : ' + JSON.stringify(data || null));

        // Buckets
        let RiskAppetite = [];
        let ControlInPace = [];
        let ControlNature = [];
        let ControlAutomation = [];
        let ControlFrequency = [];
        let OverallInherentRiskRating = [];
        let ControlTotalScore = [];
        let OverallControlEnvironmentRating = [];
        let ResidualRiskRating = [];
        let ResidualRisk = [];
        let ControlTotalScoreConfig = [];
        let ControlEnvironmentRatingConfig = [];

        // Indices / constants (follow your style)
        const ZERO = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;     // 0
        const ONE = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;       // 1
        const TWO = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;       // 2
        const THREE = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;   // 3
        const FOUR = CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR;     // 4
        const FIVE = CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE;     // 5
        const SIX = CONSTANT_FILE_OBJ.APP_CONSTANT.SIX;       // 6
        const SEVEN = CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN;   // 7
        const EIGHT = CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT;   // 8
        const NINE = CONSTANT_FILE_OBJ.APP_CONSTANT.NINE;     // 9
        const TEN = CONSTANT_FILE_OBJ.APP_CONSTANT.TEN;       // 10
        const ELEVEN = CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN; // 11
        const NULL = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        // ================ MAIN BUCKETS =================
        // 0: RiskAppetite
        if (data.recordset[ZERO] != NULL) {
            for (const obj of Object.values(data.recordset[ZERO])) {
                RiskAppetite.push({
                    "RiskAppetiteID": obj.RiskAppetiteID,
                    "UnitID": obj.UnitID,
                    "ResidualRiskID": obj.ResidualRiskID,
                    "AppetiteLevel": obj.AppetiteLevel,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted,
                    "AccountGUID": obj.AccountGUID
                });
            }
        }

        // 1: ControlInPace
        if (data.recordset[ONE] != NULL) {
            for (const obj of Object.values(data.recordset[ONE])) {
                ControlInPace.push({
                    "ControlInPaceID": obj.ControlInPaceID,
                    "Name": obj.Name,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 2: ControlNature
        if (data.recordset[TWO] != NULL) {
            for (const obj of Object.values(data.recordset[TWO])) {
                ControlNature.push({
                    "ControlNatureID": obj.ControlNatureID,
                    "NatureofControl": obj.NatureofControl,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 3: ControlAutomation
        if (data.recordset[THREE] != NULL) {
            for (const obj of Object.values(data.recordset[THREE])) {
                ControlAutomation.push({
                    "ControlAutomationID": obj.ControlAutomationID,
                    "LevelOfControl": obj.LevelOfControl,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 4: ControlFrequency
        if (data.recordset[FOUR] != NULL) {
            for (const obj of Object.values(data.recordset[FOUR])) {
                ControlFrequency.push({
                    "ControlFrequencyID": obj.ControlFrequencyID,
                    "Frequency": obj.Frequency,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 5: OverallInherentRiskRating
        if (data.recordset[FIVE] != NULL) {
            for (const obj of Object.values(data.recordset[FIVE])) {
                OverallInherentRiskRating.push({
                    "OverallInherentRiskRatingID": obj.OverallInherentRiskRatingID,
                    "RiskRating": obj.RiskRating,
                    "ColourName": obj.ColourName,
                    "ColourCode": obj.ColourCode,
                    "IsActive": obj.IsActive
                });
            }
        }

        // 6: ControlTotalScore (formula row(s))
        if (data.recordset[SIX] != NULL) {
            for (const obj of Object.values(data.recordset[SIX])) {
                ControlTotalScore.push({
                    "ControlTotalScoreID": obj.ControlTotalScoreID,
                    "Computation": obj.Computation,
                    "ComputationCode": obj.ComputationCode,
                    "IsActive": obj.IsActive
                });
            }
        }

        // 7: OverallControlEnvironmentRating
        if (data.recordset[SEVEN] != NULL) {
            for (const obj of Object.values(data.recordset[SEVEN])) {
                OverallControlEnvironmentRating.push({
                    "OverallControlEnvironmentRatingID": obj.OverallControlEnvironmentRatingID,
                    "RiskRating": obj.RiskRating,
                    "Computation": obj.Computation,
                    "ComputationCode": obj.ComputationCode,
                    "ColourName": obj.ColourName,
                    "ColourCode": obj.ColourCode,
                    "IsActive": obj.IsActive
                });
            }
        }

        // 8: ResidualRiskRating
        if (data.recordset[EIGHT] != NULL) {
            for (const obj of Object.values(data.recordset[EIGHT])) {
                ResidualRiskRating.push({
                    "ResidualRiskRatingID": obj.ResidualRiskRatingID,
                    "OverallInherentRiskRatingID": obj.OverallInherentRiskRatingID,
                    "OverallInherentRiskRating": obj.OverallInherentRiskRating,
                    "OverallControlEnvironmentRatingID": obj.OverallControlEnvironmentRatingID,
                    "OverallControlEnvironmentRating": obj.OverallControlEnvironmentRating,
                    "ResidualRiskID": obj.ResidualRiskID,
                    "ResidualRisk": obj.ResidualRisk,
                    "IsActive": obj.IsActive
                });
            }
        }

        // 9: ResidualRisk
        if (data.recordset[NINE] != NULL) {
            for (const obj of Object.values(data.recordset[NINE])) {
                ResidualRisk.push({
                    "ResidualRiskID": obj.ResidualRiskID,
                    "Risk": obj.Risk,
                    "ColourName": obj.ColourName,
                    "ColourCode": obj.ColourCode,
                    "IsActive": obj.IsActive
                });
            }
        }

        // 10: ControlTotalScoreConfig
        if (data.recordset[TEN] != NULL) {
            for (const obj of Object.values(data.recordset[TEN])) {
                ControlTotalScoreConfig.push({
                    "ConfigScoreAndRatingID": obj.ConfigScoreAndRatingID,
                    "ConfigField": obj.ConfigField,
                    "ConfigDisplay": obj.ConfigDisplay,
                    "IsOperator": obj.IsOperator,
                    "ConfigScoreAndRatingScreenMappingID": obj.ConfigScoreAndRatingScreenMappingID
                });
            }
        }

        // 11: ControlEnvironmentRatingConfig
        if (data.recordset[ELEVEN] != NULL) {
            for (const obj of Object.values(data.recordset[ELEVEN])) {
                ControlEnvironmentRatingConfig.push({
                    "ConfigScoreAndRatingID": obj.ConfigScoreAndRatingID,
                    "ConfigField": obj.ConfigField,
                    "ConfigDisplay": obj.ConfigDisplay,
                    "IsOperator": obj.IsOperator,
                    "ConfigScoreAndRatingScreenMappingID": obj.ConfigScoreAndRatingScreenMappingID
                });
            }
        }

        // Final payload
        let respData = {
            "RiskAppetite": RiskAppetite,
            "ControlInPace": ControlInPace,
            "ControlNature": ControlNature,
            "ControlAutomation": ControlAutomation,
            "ControlFrequency": ControlFrequency,
            "OverallInherentRiskRating": OverallInherentRiskRating,
            "ControlTotalScore": ControlTotalScore,
            "OverallControlEnvironmentRating": OverallControlEnvironmentRating,
            "ResidualRiskRating": ResidualRiskRating,
            "ResidualRisk": ResidualRisk,
            "ControlTotalScoreConfig": ControlTotalScoreConfig,
            "ControlEnvironmentRatingConfig": ControlEnvironmentRatingConfig
        };

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageScoreAndRiskRating : Execution end. :: respData : ' + JSON.stringify(respData || null));
        return respData;

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatGetDataForManageScoreAndRiskRating : Execution end. : Got unhandled error. : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * Compute overallControlTotalScore, overallControlEnvironmentRiskRatingID,
 * ResidualRiskID, and IsActionPlanRequired from request.body + formattedMasterData.
 *
 * Keep it simple and beginner-friendly.
 */
function computeAssessmentOutputs(binds, data, formattedMasterData, userIdFromToken, logger) {
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : START`);
    const first = data || {};
    const ControlAutomationID = Number(first.ControlAutomationID);
    const ControlNatureID = Number(first.ControlNatureID);
    const ControlFrequencyID = Number(first.ControlFrequencyID);
    const Unit = Number(binds.UnitID);
    const ControlInPaceID = Number(first.ControlInPaceID);
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Input IDs → Automation:${ControlAutomationID}, Nature:${ControlNatureID}, Frequency:${ControlFrequencyID}, Unit:${Unit}, InPace:${ControlInPaceID}`);
    // Helpers
    const pickById = (arr, idField, id) => (arr || []).find(r => Number(r[idField]) === Number(id)) || null;
    const num = v => Number(String(v).trim());
    // Lookups
    const autoRow = pickById(formattedMasterData.ControlAutomation, "ControlAutomationID", ControlAutomationID);
    const natureRow = pickById(formattedMasterData.ControlNature, "ControlNatureID", ControlNatureID);
    const freqRow = pickById(formattedMasterData.ControlFrequency, "ControlFrequencyID", ControlFrequencyID);

    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Lookup Results → AutomationScore:${autoRow?.Score}, NatureScore:${natureRow?.Score}, FrequencyScore:${freqRow?.Score}`);

    const ComputedControlAutomationScore = autoRow ? num(autoRow.Score) : 0;
    const ComputedControlNatureScore = natureRow ? num(natureRow.Score) : 0;
    const ComputedControlFrequencyScore = freqRow ? num(freqRow.Score) : 0;
    const ctlScoreFormula = (formattedMasterData.ControlTotalScore?.[0]?.Computation || "").trim();
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Formula Retrieved Score → "${ctlScoreFormula}"`);

    let expr = ctlScoreFormula
        .replace(/ComputedControlNatureScore/g, String(ComputedControlNatureScore))
        .replace(/ComputedControlAutomationScore/g, String(ComputedControlAutomationScore))
        .replace(/ComputedControlFrequencyScore/g, String(ComputedControlFrequencyScore));
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Formula After Replacement → "${expr}"`);
    if (!/^[\d+\-*/().\s]*$/.test(expr)) {
        logger.log('error', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Invalid formula detected, falling back to simple multiplication`);
        expr = `${ComputedControlNatureScore} * ${ComputedControlAutomationScore} * ${ComputedControlFrequencyScore}`;
    }
    const ControlTotalScore = Function(`return (${expr || "0"})`)();
    const overallControlTotalScore = num(ControlTotalScore);
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Computed Total Score → ${overallControlTotalScore}`);
    const inPlaceName = pickById(formattedMasterData.ControlInPace, "ControlInPaceID", ControlInPaceID)?.Name || "";
    const natureName = natureRow?.NatureofControl || "";

    function ruleMatches(ruleText) {
        logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Evaluating Rule → "${ruleText}"`);
        const rule = String(ruleText || "").toLowerCase().replace(/\s+/g, " ").trim();
        // Between
        if (rule.includes("between")) {
            const m = rule.match(/controltotalscore\s+between\s+'?(\d+)'?\s+and\s+'?(\d+)'?/i);
            if (m) {
                const a = num(m[1]),
                    b = num(m[2]);
                const match = overallControlTotalScore >= a && overallControlTotalScore <= b;
                logger.log('info', `→ Rule Between Match: ${match}`);
                return match;
            }
        }
        // Exact equality
        if (rule.includes("controltotalscore =")) {
            const m = rule.match(/controltotalscore\s*=\s*'?(\d+)'?/i);
            if (m) {
                const match = overallControlTotalScore === num(m[1]);
                logger.log('info', `→ Rule Equality Match: ${match}`);
                return match;
            }
        }
        // Less than
        if (rule.includes("controltotalscore <")) {
            const m = rule.match(/controltotalscore\s*<\s*=?\s*'?(\d+)'?/i);
            if (m) {
                const match = overallControlTotalScore <= num(m[1]);
                logger.log('info', `→ Rule LessThan Match: ${match}`);
                return match;
            }
        }
        // IF logic
        if (rule.startsWith("if")) {
            const condInPaceNo = /computedcontrolinpace\s*=\s*'?no'?/.test(rule) ? (inPlaceName.toLowerCase() === "no") : false;
            const condNatureCorr = /computedcontrolnatureofcontrol\s*=\s*'?corrective'?/.test(rule) ? (natureName.toLowerCase() === "corrective") : false;
            let condScoreLE = false;
            const m = rule.match(/controltotalscore\s*<\s*=?\s*'?(\d+)'?/i);
            if (m)
                condScoreLE = overallControlTotalScore <= num(m[1]);
            const match = condInPaceNo || condNatureCorr || condScoreLE;
            logger.log('info', `→ Rule IF Match: ${match}`);
            return match;
        }
        return false;
    }


    let overallControlEnvironmentRiskRatingID = null;
    for (const row of (formattedMasterData.OverallControlEnvironmentRating || [])) {
        if (ruleMatches(row.Computation)) {
            overallControlEnvironmentRiskRatingID = Number(row.OverallControlEnvironmentRatingID);
            logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Matched overall Control Environment RiskRatingID → ${overallControlEnvironmentRiskRatingID}`);
            break;
        }
    }

    if (!overallControlEnvironmentRiskRatingID) {
        const ineffective = (formattedMasterData.OverallControlEnvironmentRating || [])
            .find(r => String(r.RiskRating).toLowerCase() === "ineffective");
        overallControlEnvironmentRiskRatingID = ineffective ? Number(ineffective.OverallControlEnvironmentRatingID) : null;
        logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Defaulted to Ineffective Rating ID → ${overallControlEnvironmentRiskRatingID}`);
    }

    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : overallControlEnvironmentRiskRatingID → ${(overallControlEnvironmentRiskRatingID || null)}`);
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : binds.OverallInherentRiskID → ${(binds.OverallInherentRiskID || null)}`);

    let ResidualRiskID = null;
    const rrRow = (formattedMasterData.ResidualRiskRating || [])
        .find(r => Number(r.OverallControlEnvironmentRatingID) === Number(overallControlEnvironmentRiskRatingID) &&
            Number(r.OverallInherentRiskRatingID) === Number(binds.OverallInherentRiskID));

    if (rrRow)
        ResidualRiskID = Number(rrRow.ResidualRiskID);
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : Unit → ${Unit || null}`);

    let IsActionPlanRequired = false;

    const appetiteRow = (formattedMasterData.RiskAppetite || [])
        .find(r => Number(r.UnitID) === Number(Unit));

    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : self Assessment ResidualRiskID → ${(ResidualRiskID || null)}`);
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : appetite unit ResidualRiskID → ${appetiteRow?.ResidualRiskID || null}`);

    if (appetiteRow.ResidualRiskID && ResidualRiskID != null) {
        const unitResidualRiskID = Number(appetiteRow.ResidualRiskID);
        logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : appetite unit ResidualRiskID → ${unitResidualRiskID || null}`);
        IsActionPlanRequired = Number(ResidualRiskID) >= unitResidualRiskID;
    }

    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : IsActionPlanRequired → ${IsActionPlanRequired}`);
    logger.log('info', `User Id : ${userIdFromToken} : computeAssessmentOutputs : COMPLETED`);
    return {
        overallControlTotalScore,
        overallControlEnvironmentRiskRatingID,
        ResidualRiskID,
        IsActionPlanRequired
    };
}


function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: errorMessage
        }
    }
}

function successfulResponse(refreshedToken, successMessage, result) {
    //Change the response format for specified API's
    if (successMessage.split("|").length > 1) {
        result.recordset = result.recordset[0];
        successMessage = successMessage.split("|")[0];
    }

    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message: successMessage,
        result: result,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}

/**
 * This is function will format DB response of upload rcsa .
 */
async function formatEvidencelist(userIdFromToken, dbRecordSet, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatEvidencelist : Execution started.');

        let evidences = [];

        // forming uploadedrcsa evidence data for UI.  
        evidences.push({
            "EvidenceID": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EvidenceID,
            "OriginalFileName": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "Remark": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Remark
        });

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatEvidencelist : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData": evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatEvidencelist : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of download rcsa evidence .
 */
async function formatDownloadResponse(userIdFromToken, dbRecordSet, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatDownloadResponse : Execution started.');

        let evidences = [];
        // forming uploadedrcsa evidence data for UI.  
        evidences.push({
            "OriginalFileName": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "FileType": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
            "FileContent": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContent
        });

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatDownloadResponse : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData": evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : formatDownloadResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This function will format the unit names string to a unique string containing unique unit name
 */
function formatUnitNames(commaSeparatedString) {
    try {
        logger.log('info', 'formatUnitNames : Execution Started...');
        const valuesArray = commaSeparatedString.split(',');
        const uniqueValueSet = [...new Set(valuesArray)];
        const stringFromSet = Array.from(uniqueValueSet).join(', ');

        logger.log('info', 'formatUnitNames : stringFromSet : ' + stringFromSet);
        return stringFromSet;
    } catch (error) {
        logger.log('info', 'formatUnitNames : Execution end : Got unhandled error : Error detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getScheduleAssessmentBLClassInstance() {
    if (ScheduleAssessmentBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        ScheduleAssessmentBlClassInstance = new ScheduleAssessmentBl();
    }
    return ScheduleAssessmentBlClassInstance;
}

exports.getScheduleAssessmentBLClassInstance = getScheduleAssessmentBLClassInstance;