const fs = require('fs');
const path = require('path');
const APP_VALIATOR = require('../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ = require('../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../../utility/constants/constant.js');
const CONTROL_LIBRARY_DB = require('../../../data-access/control_library-db.js');
const { isBlank, trimOrEmpty, isValidInt, isValidJsonArrayString, safeParseJsonArray} = require('../../../utility/commonfunctions/commonfunctions.js');
const { 
    validationErrorResponse, 
    businessRuleErrorResponse, 
    databaseErrorResponse, 
    translateDbError,
    ERROR_CODES 
} = require('../../../utility/response-helpers.js');


let appValidatorObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let controlLibraryDBobject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let controlLibraryBLClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlLibraryBL {
    constructor() {
        appValidatorObject = new APP_VALIATOR();
        controlLibraryDBobject = new CONTROL_LIBRARY_DB();
    }

    start() { }

    /**
     * Fetch Control Library details from DB
     * @param {*} request
     * @param {*} response
     */
    getAllControlLibraryData = async (request, response) => {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || null;
            binds.createdBy = userIdFromToken || '';
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : Execution started.`);

            const result = await controlLibraryDBobject.getAllControlLibraryData(binds);

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : result : ${JSON.stringify(result)}`);

            // Undefined / Null
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : Execution end. : result is undefined or null.`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : Execution end. : Error details : ${result.errorMsg}`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : Execution end. : Error details : ${result.procedureMessage}`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No records
            if (
                result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE &&
                result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO
            ) {
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : Execution end. : No Record in data base`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : getAllControlLibraryData : Execution end. : Data fetched successfully.`);
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : getAllControlLibraryData : Execution end. : Got unhandled error. : Error Detail : ${error}`);
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    };


    /**
     * @param {*} request  Express request object
     * @param {*} response Express response object
     * @returns {Promise<*>} JSON response containing status, token, message and data
     */
    getControlMasterData = async (request, response) => {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || null;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log(
                "info",
                `User Id : ${binds.userId} : ControlLibraryBL : getControlMasterData : Execution started.`
            );

            const result = await controlLibraryDBobject.getControlMasterData(binds);

            // Merge recordsets into structured object
            // Merge recordsets into structured object based on new index mapping
            const resultResponse = {
                ControlTypes: result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] || [],
                Groups: result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] || [],
                Units: result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] || [],
                Users: result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] || []
            };


            result.recordset = JSON.parse(JSON.stringify([resultResponse]));

            // Undefined or null
            if (
                result === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ||
                result === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            ) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : getControlMasterData : result is undefined or null.`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(
                            refreshedToken,
                            MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL
                        )
                    );
            }

            // Not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : getControlMasterData : Error : ${result.errorMsg}`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(
                            refreshedToken,
                            MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL
                        )
                    );
            }

            // Procedure failed
            if (
                result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE
            ) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : getControlMasterData : Error : ${result.procedureMessage}`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(
                            refreshedToken,
                            result.procedureMessage
                        )
                    );
            }

            // No records
            if (
                result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE &&
                result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length ===
                CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO
            ) {
                logger.log(
                    "info",
                    `User Id : ${binds.userId} : ControlLibraryBL : getControlMasterData : No record found.`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        successfulResponse(
                            refreshedToken,
                            MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND,
                            result
                        )
                    );
            }

            logger.log(
                "info",
                `User Id : ${binds.userId} : ControlLibraryBL : getControlMasterData : Data fetched successfully.`
            );
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(
                    successfulResponse(
                        refreshedToken,
                        MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA + "|getControlMasterData",
                        result
                    )
                );
        } catch (error) {
            logger.log(
                "error",
                `User Id : ${userIdFromToken} : ControlLibraryBL : getControlMasterData : Unhandled error : ${error}`
            );
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(
                    unsuccessfulResponse(
                        refreshedToken,
                        MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL
                    )
                );
        }
    };


    addControlData = async (request, response) => {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            // pull token fields
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            // binds expected by ORM.RCSA_AddUpdateControlData
            binds.unitID = request.body.unitID || 0;
            binds.groupID = request.body.groupID || 0;
            binds.controlID = (request.body.controlID === undefined ? null : request.body.controlID);
            binds.controlTypeID = request.body.controlTypeID || 0;
            binds.controlDescription = request.body.controlDescription || '';
            binds.createdBy = userIdFromToken || '';
            // meta
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            // validation
            const validationMessage = [];
            if (request.body.unitID === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.unitID === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('UnitID');
            }
            if (request.body.groupID === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.groupID === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('GroupID');
            }
            if (request.body.controlTypeID === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.controlTypeID === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                validationMessage.push('ControlTypeID');
            }
            if (appValidatorObject.isStringUndefined(request.body.controlDescription) ||
                appValidatorObject.isStringNull(request.body.controlDescription) ||
                appValidatorObject.isStringEmpty(request.body.controlDescription)) {
                validationMessage.push('ControlDescription');
            }

            if (validationMessage.length > 0) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : ${validationMessage.join(', ')} parameter(s) is missing`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, "Required parameter(s) missing."));
            }

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : Execution started.`);
            const result = await controlLibraryDBobject.addControlData(binds);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : result ${JSON.stringify(result)}`);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : Execution end. : result is undefined or null.`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : Execution end. : Error details : ${result.errorMsg}`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : Execution end. : Error details : ${result.procedureMessage}`);
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryBL : addControlData : Execution end. : Data added/updated successfully.`);
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));

        } catch (error) {
            logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addControlData : Execution end. : Got unhandled error. : Error Detail : ${error}`);
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    };

    updateControlData = async (request, response) => {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            // ---- read & trim ----
            refreshedToken = trimOrEmpty(request.body.refreshedToken);
            userIdFromToken = trimOrEmpty(request.body.userIdFromToken);
            userNameFromToken = trimOrEmpty(request.body.userNameFromToken);
            accountGUIDFromToken = trimOrEmpty(request.body.accountGUIDFromToken);

            const binds = {};

            binds.controlID = request.body.controlID;
            binds.unitID = request.body.unitID;
            binds.groupID = request.body.groupID;
            binds.controlTypeID = request.body.controlTypeID;
            binds.controlDescription = trimOrEmpty(request.body.controlDescription);
            binds.isActive = request.body.isActive;
            binds.createdBy = userIdFromToken;

            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            // ---- validation ----
            const validationMessage = [];

            if (isBlank(refreshedToken)) validationMessage.push("refreshedToken");
            if (isBlank(userIdFromToken)) validationMessage.push("userIdFromToken");
            if (isBlank(userNameFromToken)) validationMessage.push("userNameFromToken");
            if (isBlank(accountGUIDFromToken)) validationMessage.push("accountGUIDFromToken");

            if (!isValidInt(binds.controlID)) validationMessage.push("controlID");
            if (!isValidInt(binds.unitID)) validationMessage.push("unitID");
            if (!isValidInt(binds.groupID)) validationMessage.push("groupID");
            if (!isValidInt(binds.controlTypeID)) validationMessage.push("controlTypeID");

            if (isBlank(binds.controlDescription)) validationMessage.push("controlDescription");

            if (validationMessage.length > 0) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : updateControlData : Missing/Invalid => ${validationMessage.join(', ')}`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(
                            refreshedToken,
                            "Required parameter(s) missing or invalid."
                        )
                    );
            }

            logger.log(
                "info",
                `User Id : ${binds.userId} : ControlLibraryBL : updateControlData : Execution started.`
            );

            // ---- DB call ----
            const result = await controlLibraryDBobject.updateControlData(binds);

            // ---- result checks ----
            if (result === undefined || result === null) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : updateControlData : result is undefined/null`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(
                            refreshedToken,
                            MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL
                        )
                    );
            }

            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : updateControlData : Error : ${result.errorMsg}`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(
                            refreshedToken,
                            MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL
                        )
                    );
            }

            if (
                result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE
            ) {
                logger.log(
                    "error",
                    `User Id : ${binds.userId} : ControlLibraryBL : updateControlData : Proc error : ${result.procedureMessage}`
                );
                return response
                    .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(
                        unsuccessfulResponse(refreshedToken, result.procedureMessage)
                    );
            }

            result.recordset =
                result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log(
                "info",
                `User Id : ${binds.userId} : ControlLibraryBL : updateControlData : Updated successfully.`
            );

            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(
                    successfulResponse(
                        refreshedToken,
                        MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA,
                        result
                    )
                );
        } catch (error) {
            logger.log(
                "error",
                `User Id : ${userIdFromToken} : ControlLibraryBL : updateControlData : Unhandled error => ${error}`
            );
            return response
                .status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(
                    unsuccessfulResponse(
                        refreshedToken,
                        MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL
                    )
                );
        }
    };

    addBulkControlData = async (request, response) => {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            // read + trim
            refreshedToken = trimOrEmpty(request.body.refreshedToken);
            userIdFromToken = trimOrEmpty(request.body.userIdFromToken);
            userNameFromToken = trimOrEmpty(request.body.userNameFromToken);
            accountGUIDFromToken = trimOrEmpty(request.body.accountGUIDFromToken);

            // payload (stringified JSON array expected)
            const controlsDataRaw = request.body.ControlsData; // STRING containing JSON array

            // mandatory validation
            const missing = [];
            if (isBlank(refreshedToken))
                missing.push('Token');
            if (isBlank(userIdFromToken))
                missing.push('userId');
            if (isBlank(userNameFromToken))
                missing.push('userName');
            if (isBlank(accountGUIDFromToken))
                missing.push('accountGUID');
            if (isBlank(controlsDataRaw))
                missing.push('ControlsData');

            if (missing.length > 0) {
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Missing => ${missing.join(', ')}`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, "Required parameter(s) missing or invalid."));
            }

            // ControlsData must be valid JSON array
            if (!isValidJsonArrayString(controlsDataRaw)) {
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : ControlsData is not a valid JSON array string`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(validationErrorResponse(refreshedToken, "Invalid data format: ControlsData must be a valid JSON array string.", null, 'ControlsData', 'Invalid JSON format'));
            }

            // Build binds (for both master lookup & insert)
            const binds = {};
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;
            binds.createdBy = userNameFromToken;

            logger.log('info', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Execution started.`);

            // logger.log('info', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : binds : ${ JSON.stringify(binds) || null}`);

            // 1) Get master data (Units, Groups, ControlTypes, etc.)
            const BULK_UPLOAD_INFO = await controlLibraryDBobject.getControlMasterData(binds);

            if (!BULK_UPLOAD_INFO || BULK_UPLOAD_INFO.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                const msg = BULK_UPLOAD_INFO && BULK_UPLOAD_INFO.errorMsg ? BULK_UPLOAD_INFO.errorMsg : 'Unable to fetch master data';
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Master data fetch failed : ${msg}`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(databaseErrorResponse(refreshedToken, 'Unable to fetch master data. Please try again or contact support.', msg));
            }

            // 2) Transform & validate rows against master, split into valid/invalid
            const BULK_UPLOAD_PAYLOAD = await formatPayloadControlBulkData(userIdFromToken, controlsDataRaw, BULK_UPLOAD_INFO, accountGUIDFromToken);

            if (!BULK_UPLOAD_PAYLOAD) {
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Payload formatting returned null`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const validCount = BULK_UPLOAD_PAYLOAD.validData.length;
            const invalidCount = BULK_UPLOAD_PAYLOAD.inValidData.length;

            if (validCount === 0) {
                const outputMessage = `Number of records successfully added: 0, Number of records failed to add: ${invalidCount}`;
                logger.log('info', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : No valid rows`);
                const payloadOut = {
                    ...BULK_UPLOAD_PAYLOAD
                };
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(successfulResponse(refreshedToken, outputMessage, payloadOut));
            }

            // 4) Call DB proc to add bulk controls with ONLY valid rows
            const insertBinds = {
                ControlsData: BULK_UPLOAD_PAYLOAD.validData,
                CreatedBy: userIdFromToken,
                accountGUIDFromToken
            };

            const result = await controlLibraryDBobject.addBulkControlData(insertBinds);
            // logger.log('info', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : DB result => ${JSON.stringify(result || null)}`);

            if (!result) {
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : DB result null/undefined`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(databaseErrorResponse(refreshedToken, 'Database operation failed. Please try again.', 'DB result is null or undefined'));
            }
            if (result.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                const errorMsg = result.errorMsg || 'Database operation failed';
                const userFriendlyMsg = translateDbError(errorMsg);
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Status=${result.status} Err=${errorMsg}`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(databaseErrorResponse(refreshedToken, userFriendlyMsg, errorMsg));
            }
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                const dbErrorMsg = result.procedureMessage || 'Database procedure failed';
                const userFriendlyMsg = translateDbError(dbErrorMsg);
                logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : ProcError=${dbErrorMsg}`);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(databaseErrorResponse(refreshedToken, userFriendlyMsg, dbErrorMsg));
            }

            // DB returns inserted/affected rows in result.recordset[0]
            const dbRows = (result.recordset && result.recordset[0]) ? result.recordset[0] : [];

            const outputMessage = `Number of records successfully added: ${validCount}, Number of records failed to add: ${invalidCount}`;

            const responsePayload = {
                validData: BULK_UPLOAD_PAYLOAD.validData,
                inValidData: BULK_UPLOAD_PAYLOAD.inValidData,
                dbOutput: dbRows
            };

            logger.log('info', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Completed.`);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(successfulResponse(refreshedToken, outputMessage, responsePayload));

        } catch (error) {
            logger.log('error', `User Id : ${userIdFromToken} : ControlLibraryBL : addBulkControlData : Unhandled error : ${error}`);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    };

    stop() { }
}

async function formatPayloadControlBulkData(userIdFromToken, payloadData, bulkInfoData, accountGUIDFromToken) {
    try {
        logger.log('info', `User Id: ${userIdFromToken} : ControlLibraryBL: formatPayloadControlBulkData: start`);
        const parsed = safeParseJsonArray(payloadData);
        if (!parsed) return null;    
        
        const controlTypes = bulkInfoData.recordset[0] || [];
        const groups = bulkInfoData.recordset[1] || [];
        const units = bulkInfoData.recordset[2] || [];        

        const validData = [];
        const inValidData = [];

        // normalize & trim each input row
        const cleaned = parsed.map(row => {
            const obj = {
                unitname: trimOrEmpty(row.unitname),
                groupname: trimOrEmpty(row.groupname),
                controltype: trimOrEmpty(row.controltype),
                controldescription: trimOrEmpty(row.controldescription)
            };
            return obj;
        });

        cleaned.forEach((row, index) => {
            const rowNumber = index + 2; // +2 because Excel row 1 is header, so data starts at row 2
            const missing = [];
            if (isBlank(row.unitname)) missing.push('Unit Name');
            if (isBlank(row.groupname)) missing.push('Group Name');
            if (isBlank(row.controltype)) missing.push('Control Type');
            if (isBlank(row.controldescription)) missing.push('Control Description');

            if (missing.length > 0) {
                const failureReason = `Row ${rowNumber}: Missing required field(s): ${missing.join(', ')}`;
                inValidData.push({ 
                    ...row, 
                    'Row Number': rowNumber,
                    'Failure reason': failureReason 
                });
                return;
            }

            const unit = units.find(u => u.Name === row.unitname);
            const group = groups.find(g => g.Name === row.groupname);
            const ctype = controlTypes.find(t => t.ControlType === row.controltype);

            const failed = [];
            if (!unit) failed.push(`Unit '${row.unitname}'`);
            if (!group) failed.push(`Group '${row.groupname}'`);
            if (!ctype) failed.push(`Control Type '${row.controltype}'`);

            if (failed.length > 0) {
                const failureReason = `Row ${rowNumber}: Invalid reference(s) - ${failed.join(', ')} not found in master data`;
                inValidData.push({ 
                    ...row, 
                    'Row Number': rowNumber,
                    'Failure reason': failureReason 
                });
                return;
            }

            // This structure is what the proc expects inside @ControlsData:
            validData.push({
                unitname: row.unitname,
                groupname: row.groupname,
                controltype: row.controltype,
                controldescription: row.controldescription
            });
        });

        logger.log('info', `User Id: ${userIdFromToken} : ControlLibraryBL: formatPayloadControlBulkData: done valid=${validData.length} invalid=${inValidData.length}`);
        return { validData, inValidData };
    } catch (error) {
        logger.log('error', `User Id: ${userIdFromToken} : ControlLibraryBL: formatPayloadControlBulkData: error: ${error}`);
        return null;
    }
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

function getControlLibraryBLClassInstance() {
    if (controlLibraryBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        controlLibraryBLClassInstance = new ControlLibraryBL();
    }
    return controlLibraryBLClassInstance;
}

// Back-compat export (also export the camelCase variant your RT file used)
exports.getControlLibraryBLClassInstance = getControlLibraryBLClassInstance;