const VALIDATOR_OBJECT      = require('validator');
const APP_VALIATOR          = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../../utility/constants/constant.js');
const INHERENT_RISK_RATING_SCREEN_DB    = require('../../../../data-access/inherent-risk-rating-screen-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var InherentRiskRatingScreenDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var InherentRiskRatingScreenBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InherentRiskRatingScreenBl {
    constructor() {
        appValidatorObject  = new APP_VALIATOR();
        InherentRiskRatingScreenDbObject = new INHERENT_RISK_RATING_SCREEN_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Inherent Risk Rating Screen from database server.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getDataForInherentRiskRatingScreen(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution started.');

            const result = await InherentRiskRatingScreenDbObject.getDataForInherentRiskRatingScreen(binds);
            
            //Merging all recordset and return as single recordset

            const resultResponse={
                RiskCategory:[],
                Process:[],
                InherentLikelihoodRating:[],
                InherentImpactRating:[],
                OverallInherentRiskScore:[],
                InherentRiskScoreConfig:[],
                OverallInherentRiskRating:[],
                InherentRiskRatingConfig:[],
                CorporateObjectiveMaster:[] 
            }

            resultResponse.RiskCategory=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.Process=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.InherentLikelihoodRating=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            resultResponse.InherentImpactRating=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            resultResponse.OverallInherentRiskScore=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            resultResponse.InherentRiskScoreConfig=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
            resultResponse.OverallInherentRiskRating=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
            resultResponse.InherentRiskRatingConfig=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            resultResponse.CorporateObjectiveMaster = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];


            var resultArr=[];
            resultArr.push(resultResponse);

            result.recordset=JSON.parse(JSON.stringify(resultArr));

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));   
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    async getDataForInherentRiskRatingScreen(request, response) {
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

            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution started.');

            const result = await InherentRiskRatingScreenDbObject.getDataForInherentRiskRatingScreen(binds);

            // ---- Basic safety checks BEFORE mutating result ----
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result) {
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // ---- Build cleaned merged object (exact positions, extra fields removed) ----
            const cleaned = await formatInherentRiskRatingScreen(userIdFromToken, result, CONSTANT_FILE_OBJ);

            // If helper returned null due to an internal error
            if (cleaned === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Formatter returned null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // Keep old shape: array with one object
            result.recordset = [cleaned];

            // ---- No Record found check (safe after merge) ----
            const allEmpty = Object.values(cleaned).every(arr => Array.isArray(arr) && arr.length === 0);

            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE &&
                result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE &&
                allEmpty) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                    .json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED)
                .json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }    

    stop() {
    }
}
 
async function formatInherentRiskRatingScreen(userIdFromToken, REPORT_DATA, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : InherentRiskRatingScreenBl : formatInherentRiskRatingScreen : Execution started.');

        let RiskCategory                = [];
        let Process                     = [];
        let InherentLikelihoodRating    = [];
        let InherentImpactRating        = [];
        let OverallInherentRiskScore    = [];
        let InherentRiskScoreConfig     = [];
        let OverallInherentRiskRating   = [];
        let InherentRiskRatingConfig    = [];
        let CorporateObjectiveMaster    = [];

        // forming RiskCategory data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                RiskCategory.push({
                    "RiskCategoryID"         : obj.RiskCategoryID,
                    "Category"               : obj.Category,
                    "CorporateObjectiveID"   : obj.CorporateObjectiveID,
                    "CorporateObjectiveName" : obj.CorporateObjectiveName,
                    "IsActive"               : obj.IsActive,
                    "IsDeleted"              : obj.IsDeleted,
                    // "CreatedDate"            : obj.CreatedDate,
                    // "CreatedBy"              : obj.CreatedBy,
                    // "LastUpdatedDate"        : obj.LastUpdatedDate,
                    // "LastUpdatedBy"          : obj.LastUpdatedBy
                });
            }
        }

        // forming Process data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
                Process.push({
                    "ProcessID"       : obj.ProcessID,
                    "Name"            : obj.Name,
                    "IsActive"        : obj.IsActive,
                    "IsDeleted"       : obj.IsDeleted,
                    // "CreatedDate"     : obj.CreatedDate,
                    // "CreatedBy"       : obj.CreatedBy,
                    // "LastUpdatedDate" : obj.LastUpdatedDate,
                    // "LastUpdatedBy"   : obj.LastUpdatedBy
                });
            }
        }

        // forming InherentLikelihoodRating data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                InherentLikelihoodRating.push({
                    "InherentLikelihoodRatingID" : obj.InherentLikelihoodRatingID,
                    "Rating"                     : obj.Rating,
                    "Score"                      : obj.Score,
                    "IsActive"                   : obj.IsActive,
                    "IsDeleted"                  : obj.IsDeleted,
                    // "CreatedDate"                : obj.CreatedDate,
                    // "CreatedBy"                  : obj.CreatedBy,
                    // "LastUpdatedDate"            : obj.LastUpdatedDate,
                    // "LastUpdatedBy"              : obj.LastUpdatedBy
                });
            }
        }

        // forming InherentImpactRating data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
                InherentImpactRating.push({
                    "InherentImpactRatingID" : obj.InherentImpactRatingID,
                    "Rating"                 : obj.Rating,
                    "Score"                  : obj.Score,
                    "IsActive"               : obj.IsActive,
                    "IsDeleted"              : obj.IsDeleted,
                    // "CreatedDate"            : obj.CreatedDate,
                    // "CreatedBy"              : obj.CreatedBy,
                    // "LastUpdatedDate"        : obj.LastUpdatedDate,
                    // "LastUpdatedBy"          : obj.LastUpdatedBy
                });
            }
        }

        // forming OverallInherentRiskScore data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {
                OverallInherentRiskScore.push({
                    "OverallInherentRiskScoreID" : obj.OverallInherentRiskScoreID,
                    "Computation"                : obj.Computation,
                    "ComputationCode"            : obj.ComputationCode,
                    "IsActive"                   : obj.IsActive,
                    "IsDeleted"                  : obj.IsDeleted,
                    // "CreatedDate"                : obj.CreatedDate,
                    // "CreatedBy"                  : obj.CreatedBy,
                    // "LastUpdatedDate"            : obj.LastUpdatedDate,
                    // "LastUpdatedBy"              : obj.LastUpdatedBy
                });
            }
        }

        // forming InherentRiskScoreConfig data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])) {
                InherentRiskScoreConfig.push({
                    "ConfigScoreAndRatingID"              : obj.ConfigScoreAndRatingID,
                    "ConfigField"                          : obj.ConfigField,
                    "ConfigDisplay"                        : obj.ConfigDisplay,
                    "IsOperator"                           : obj.IsOperator,
                    "ConfigScoreAndRatingScreenMappingID"  : obj.ConfigScoreAndRatingScreenMappingID,
                    "ConfigScreen"                         : Array.isArray(obj.ConfigScreen) ? obj.ConfigScreen : (obj.ConfigScreen ? [obj.ConfigScreen] : [])
                });
            }
        }

        // forming OverallInherentRiskRating data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])) {
                OverallInherentRiskRating.push({
                    "OverallInherentRiskRatingID" : obj.OverallInherentRiskRatingID,
                    "RiskRating"                  : obj.RiskRating,
                    "Computation"                 : obj.Computation,
                    "ComputationCode"             : obj.ComputationCode,
                    "ColourName"                  : obj.ColourName,
                    "ColourCode"                  : obj.ColourCode,
                    "IsActive"                    : obj.IsActive,
                    "IsDeleted"                   : obj.IsDeleted,
                    // "CreatedDate"                 : obj.CreatedDate,
                    // "CreatedBy"                   : obj.CreatedBy,
                    // "LastUpdatedDate"             : obj.LastUpdatedDate,
                    // "LastUpdatedBy"               : obj.LastUpdatedBy
                });
            }
        }

        // forming InherentRiskRatingConfig data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN])) {
                InherentRiskRatingConfig.push({
                    "ConfigScoreAndRatingID"              : obj.ConfigScoreAndRatingID,
                    "ConfigField"                          : obj.ConfigField,
                    "ConfigDisplay"                        : obj.ConfigDisplay,
                    "IsOperator"                           : obj.IsOperator,
                    "ConfigScoreAndRatingScreenMappingID"  : obj.ConfigScoreAndRatingScreenMappingID,
                    "ConfigScreen"                         : Array.isArray(obj.ConfigScreen) ? obj.ConfigScreen : (obj.ConfigScreen ? [obj.ConfigScreen] : [])
                });
            }
        }

        // forming CorporateObjectiveMaster data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT])) {
                CorporateObjectiveMaster.push({
                    "CorporateObjectiveID"    : obj.CorporateObjectiveID,
                    "CorporateObjectiveName"  : obj.CorporateObjectiveName,
                    "Description"             : obj.Description,
                    "IsActive"                : obj.IsActive,
                    "IsDeleted"               : obj.IsDeleted
                });
            }
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : InherentRiskRatingScreenBl : formatInherentRiskRatingScreen : Execution end.');

        // final object returned to UI (only whitelisted keys included)
        return {
            "RiskCategory"              : RiskCategory,
            "Process"                   : Process,
            "InherentLikelihoodRating"  : InherentLikelihoodRating,
            "InherentImpactRating"      : InherentImpactRating,
            "OverallInherentRiskScore"  : OverallInherentRiskScore,
            "InherentRiskScoreConfig"   : InherentRiskScoreConfig,
            "OverallInherentRiskRating" : OverallInherentRiskRating,
            "InherentRiskRatingConfig"  : InherentRiskRatingConfig,
            "CorporateObjectiveMaster"  : CorporateObjectiveMaster
        };

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : InherentRiskRatingScreenBl : formatInherentRiskRatingScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


 
function unsuccessfulResponse(refreshedToken, errorMessage){
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : errorMessage
        }
    }
}

function successfulResponse(refreshedToken, successMessage, result){
    result.recordset=result.recordset[0];
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getInherentRiskRatingScreenBLClassInstance() {
    if (InherentRiskRatingScreenBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        InherentRiskRatingScreenBlClassInstance = new InherentRiskRatingScreenBl();
    }
    return InherentRiskRatingScreenBlClassInstance;
}

exports.getInherentRiskRatingScreenBLClassInstance = getInherentRiskRatingScreenBLClassInstance;