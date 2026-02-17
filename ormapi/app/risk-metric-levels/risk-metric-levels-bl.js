const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const RISK_METRIC_LEVELS_DB = require('../../data-access/risk-metric-levels-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskMetricLevelsDbObject        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskMetricLevelsBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


class RiskMetricLevelsBl {
    constructor() {
        appValidatorObject          = new APP_VALIATOR();
        riskMetricLevelsDbObject    = new RISK_METRIC_LEVELS_DB();
    }

    start() {

    }

    /**
     * Get risk metric levels list data from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskMetricLevels(request, response) {
        try {

            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let metricData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
            
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution started.');

            const GET_RISK_METRIC_RESPONSE = await riskMetricLevelsDbObject.getRiskMetricLevels(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_METRIC_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_METRIC_RESPONSE){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : GET_RISK_METRIC_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_METRIC_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : Error details :' + GET_RISK_METRIC_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_METRIC_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_METRIC_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : Error details : ' + GET_RISK_METRIC_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
            * Formating resultset provided by DB :START.
            */
             metricData   = GET_RISK_METRIC_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
             
             const GET_RISK_METRIC = await getRiskMeticData(userIdFromToken,metricData);
             /**
             * Formating resultset provided by DB :END.
             */

             // Checking for null or undefined of formatted resultset data
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_METRIC || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_METRIC){
                 logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : GET_RISK_METRIC is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if(GET_RISK_METRIC_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_METRIC_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_RISK_METRIC_RESPONSE.recordset.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND,GET_RISK_METRIC));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : Risk Metric fetch successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA,GET_RISK_METRIC));

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMetricLevels : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

    }

    /**
     * Save risk metric levels details to database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRiskMetricLevels(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var riskMetricData              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            riskMetricData          = request.body.riskMetricData;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskMetricData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskMetricData){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const SAVE_RISK_METRIC_RESPONSE = await riskMetricLevelsDbObject.setRiskMetricLevels(userIdFromToken,userNameFromToken,riskMetricData, accountGUIDFromToken);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_RISK_METRIC_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_RISK_METRIC_RESPONSE){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution end. : SAVE_RISK_METRIC_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RISK_METRIC_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution end. : Error details :' + SAVE_RISK_METRIC_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SAVE_RISK_METRIC_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_RISK_METRIC_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution end. : Error details : ' + SAVE_RISK_METRIC_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            /**
            * Formating resultset provided by DB :START.
            */
             let metricData   = SAVE_RISK_METRIC_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
          
             const GET_RISK_METRIC = await getRiskMeticData(userIdFromToken,metricData);
             /**
             * Formating resultset provided by DB :END.
             */

             // Checking for null or undefined of formatted resultset data
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_METRIC || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_METRIC){
                 logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution end. : GET_RISK_METRIC is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution end. :Risk Metric updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA,GET_RISK_METRIC));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : setRiskMetricLevels : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
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
 * This is function will be used to Format result of getMetricData.
 */
async function getRiskMeticData(userIdFromToken,metricData){
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMeticData : Execution started.');

        let riskMetricData = [];
        for(const obj of Object.values(metricData)){
            riskMetricData.push({
                RiskMetricLevelID   : obj.RiskMetricLevelID,
                FWID                : obj.FWID,
                RiskMetricLevel     : obj.RiskMetricLevel,
                RiskMetricZone      : obj.RiskMetricZone,
                ColorCode           : obj.ColorCode,
                DefaultColorCode    : obj.DefaultColorCode ? obj.DefaultColorCode.trim() : null,
                Name                : obj.Name,
                Description         : obj.Description,
                CreatedDate         : obj.CreatedDate
             })
         };
         logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMeticData : Execution end.');
         
         return{
             "riskMetricData":riskMetricData
         } 
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsBl : getRiskMeticData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
    
}

/**
 * This is function will be used to return single instance of class.
 */
function getRiskMetricLevelsBLClassInstance() {
    if (riskMetricLevelsBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        riskMetricLevelsBlClassInstance = new RiskMetricLevelsBl();
    }
    return riskMetricLevelsBlClassInstance;
}

exports.getRiskMetricLevelsBLClassInstance = getRiskMetricLevelsBLClassInstance;