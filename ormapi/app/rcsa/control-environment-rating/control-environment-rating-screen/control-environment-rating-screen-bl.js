const VALIDATOR_OBJECT = require('validator');
const APP_VALIATOR = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../../../utility/constants/constant.js');
const CONTROL_ENVIRONMENT_RATING_SCREEN_DB = require('../../../../data-access/control-environment-rating-screen-db.js');

var appValidatorObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ControlEnvironmentRatingScreenDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ControlEnvironmentRatingScreenBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlEnvironmentRatingScreenBl {
    constructor() {
        appValidatorObject = new APP_VALIATOR();
        ControlEnvironmentRatingScreenDbObject = new CONTROL_ENVIRONMENT_RATING_SCREEN_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Inherent Risk Rating Screen from database server.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForControlEnvironmentRatingScreen(request, response) {
        const A = CONSTANT_FILE_OBJ.APP_CONSTANT;

        let refreshedToken = A.NULL;
        let userIdFromToken = A.NULL;
        let userNameFromToken = A.NULL;
        let accountGUIDFromToken = A.NULL;

        try {
            const binds = {};

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;
            binds.ControlTypeID = 0;
            binds.IsActive = 1;

            logger.log("info", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : getDataForControlEnvironmentRatingScreen : Execution started.`);

            const result = await ControlEnvironmentRatingScreenDbObject.getDataForControlEnvironmentRatingScreen(binds, accountGUIDFromToken);
            const resultControlTypes = await ControlEnvironmentRatingScreenDbObject.getControlType(binds, accountGUIDFromToken);

            // ---------- BASIC CHECKS ----------
            if (!result) {
                logger.log("error", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : result is undefined or null.`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (result.status !== A.ONE) {
                logger.log("error", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : Error details : ${result.errorMsg}`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (result.status === A.ONE && result.procedureSuccess === A.FALSE) {
                logger.log("error", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : Proc failed : ${result.procedureMessage}`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // ---------- FORMAT ----------
            const cleaned = await formatControlEnvironmentRatingScreen(userIdFromToken, result, resultControlTypes, CONSTANT_FILE_OBJ);

            if (cleaned === A.NULL) {
                logger.log("error", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : Formatter returned null.`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // ✅ Set final output shape
            result.recordset = cleaned;

            // ---------- EMPTY CHECK ----------
            const allEmpty = Object.values(cleaned).every(v => Array.isArray(v) && v.length === 0);

            if (result.status === A.ONE && result.procedureSuccess === A.TRUE && allEmpty) {
                logger.log("info", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : No Record in database`);
                return response.status(A.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log("info", `User Id : ${binds.userId} : ControlEnvironmentRatingScreenBl : Data fetched successfully.`);
            return response.status(A.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));

        } catch (error) {
            logger.log("error", `User Id : ${userIdFromToken} : ControlEnvironmentRatingScreenBl : Unhandled Error : ${error}`);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }



    stop() {
    }
}

async function formatControlEnvironmentRatingScreen(userIdFromToken, REPORT_DATA, CONTROL_TYPES_DATA, CONSTANT_FILE_OBJ) {
    const A = CONSTANT_FILE_OBJ.APP_CONSTANT;

    try {
        logger.log('info',
            'User Id : ' + userIdFromToken +
            ' : ControlEnvironmentRatingScreenBl : formatControlEnvironmentRatingScreen : Execution started.'
        );

        let ControlInPace = [];
        let ControlNatureScore = [];
        let ControlAutomationScore = [];
        let ControlFrequencyScore = [];
        let ControlTotalScore = [];
        let ControlTotalScoreConfig = [];
        let OverallControlEnvironmentRating = [];
        let ControlEnvironmentRatingConfig = [];
        let ControlTypes = [];

        // 0: ControlInPace  -> fields: ControlInPaceID, Name
        if (REPORT_DATA.recordset[A.ZERO] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.ZERO])) {
                ControlInPace.push({
                    "ControlInPaceID": obj.ControlInPaceID,
                    "Name": obj.Name,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 1: ControlNatureScore -> fields: ControlNatureID, NatureofControl, Score
        if (REPORT_DATA.recordset[A.ONE] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.ONE])) {
                ControlNatureScore.push({
                    "ControlNatureID": obj.ControlNatureID,
                    "NatureofControl": obj.NatureofControl,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 2: ControlAutomationScore -> fields: ControlAutomationID, LevelOfControl, Score
        if (REPORT_DATA.recordset[A.TWO] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.TWO])) {
                ControlAutomationScore.push({
                    "ControlAutomationID": obj.ControlAutomationID,
                    "LevelOfControl": obj.LevelOfControl,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 3: ControlFrequencyScore -> fields: ControlFrequencyID, Frequency, Score
        if (REPORT_DATA.recordset[A.THREE] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.THREE])) {
                ControlFrequencyScore.push({
                    "ControlFrequencyID": obj.ControlFrequencyID,
                    "Frequency": obj.Frequency,
                    "Score": obj.Score,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 4: ControlTotalScore -> fields: ControlTotalScoreID, Computation, ComputationCode
        if (REPORT_DATA.recordset[A.FOUR] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.FOUR])) {
                ControlTotalScore.push({
                    "ControlTotalScoreID": obj.ControlTotalScoreID,
                    "Computation": obj.Computation,
                    "ComputationCode": obj.ComputationCode,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 5: ControlTotalScoreConfig -> includes array-ified ConfigScreen
        if (REPORT_DATA.recordset[A.FIVE] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.FIVE])) {
                ControlTotalScoreConfig.push({
                    "ConfigScoreAndRatingID": obj.ConfigScoreAndRatingID,
                    "ConfigField": obj.ConfigField,
                    "ConfigDisplay": obj.ConfigDisplay,
                    "IsOperator": obj.IsOperator,
                    "ConfigScoreAndRatingScreenMappingID": obj.ConfigScoreAndRatingScreenMappingID,
                    "ConfigScreen": Array.isArray(obj.ConfigScreen) ? obj.ConfigScreen : (obj.ConfigScreen ? [obj.ConfigScreen] : [])
                });
            }
        }

        // 6: OverallControlEnvironmentRating
        if (REPORT_DATA.recordset[A.SIX] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.SIX])) {
                OverallControlEnvironmentRating.push({
                    "OverallControlEnvironmentRatingID": obj.OverallControlEnvironmentRatingID,
                    "RiskRating": obj.RiskRating,
                    "Computation": obj.Computation,
                    "ComputationCode": obj.ComputationCode,
                    "ColourName": obj.ColourName,
                    "ColourCode": obj.ColourCode,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        // 7: ControlEnvironmentRatingConfig
        if (REPORT_DATA.recordset[A.SEVEN] != A.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[A.SEVEN])) {
                ControlEnvironmentRatingConfig.push({
                    "ConfigScoreAndRatingID": obj.ConfigScoreAndRatingID,
                    "ConfigField": obj.ConfigField,
                    "ConfigDisplay": obj.ConfigDisplay,
                    "IsOperator": obj.IsOperator,
                    "ConfigScoreAndRatingScreenMappingID": obj.ConfigScoreAndRatingScreenMappingID,
                    "ConfigScreen": Array.isArray(obj.ConfigScreen) ? obj.ConfigScreen : (obj.ConfigScreen ? [obj.ConfigScreen] : [])
                });
            }
        }

        // ControlTypes (second query)
        if (CONTROL_TYPES_DATA && CONTROL_TYPES_DATA.recordset && CONTROL_TYPES_DATA.recordset[A.ZERO] != A.NULL) {
            for (const obj of Object.values(CONTROL_TYPES_DATA.recordset[A.ZERO])) {
                ControlTypes.push({
                    "ControlTypeID": obj.ControlTypeID,
                    "ControlType": obj.ControlType,
                    "IsActive": obj.IsActive,
                    "IsDeleted": obj.IsDeleted
                });
            }
        }

        logger.log('info',
            'User Id : ' + userIdFromToken +
            ' : ControlEnvironmentRatingScreenBl : formatControlEnvironmentRatingScreen : Execution end.'
        );

        // Final object (matches your sample output shape)
        return {
            "ControlInPace": ControlInPace,
            "ControlNatureScore": ControlNatureScore,
            "ControlAutomationScore": ControlAutomationScore,
            "ControlFrequencyScore": ControlFrequencyScore,
            "ControlTotalScore": ControlTotalScore,
            "ControlTotalScoreConfig": ControlTotalScoreConfig,
            "OverallControlEnvironmentRating": OverallControlEnvironmentRating,
            "ControlEnvironmentRatingConfig": ControlEnvironmentRatingConfig,
            "ControlTypes": ControlTypes
        };

    } catch (error) {
        logger.log('error',
            'User Id : ' + userIdFromToken +
            ' : ControlEnvironmentRatingScreenBl : formatControlEnvironmentRatingScreen : Execution end. : Got unhandled error. : Error Detail : ' + error
        );
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
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

function successfulResponse(token, message, result) {
    const out = {
        success: 1,
        message,
        result: {
            status: result?.status ?? null,
            errorMsg: result?.errorMsg ?? null,
            procedureSuccess: result?.procedureSuccess ?? null,
            procedureMessage: result?.procedureMessage ?? null
        },
        token,
        error: { errorCode: null, errorMessage: null }
    };

    // ✅ include recordset whether it's an array or an object
    if (result && Object.prototype.hasOwnProperty.call(result, 'recordset')) {
        out.result.recordset = result.recordset;
    }

    return out;
}


/**
 * This is function will be used to return single instance of class.
 */
function getControlEnvironmentRatingScreenBLClassInstance() {
    if (ControlEnvironmentRatingScreenBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        ControlEnvironmentRatingScreenBlClassInstance = new ControlEnvironmentRatingScreenBl();
    }
    return ControlEnvironmentRatingScreenBlClassInstance;
}

exports.getControlEnvironmentRatingScreenBLClassInstance = getControlEnvironmentRatingScreenBLClassInstance;