const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const RISK_REPORTS_DB       = require('../../data-access/risk-reports-db.js');

var appValidatorObject           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskReportsDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskReportsBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


class RiskReportsBl {
    constructor() {
        appValidatorObject      = new APP_VALIATOR();
        riskReportsDbObject      = new RISK_REPORTS_DB();
    }

    start() {

    }

    /**
     * Get risk report setting details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskReportsSetting(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportsSetting : Execution started.');

            const GET_RISK_REPORT_SETTING_DATA = await riskReportsDbObject.getRiskReportsSetting(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_REPORT_SETTING_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_REPORT_SETTING_DATA){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportsSetting : Execution end. : GET_RISK_REPORT_SETTING_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (GET_RISK_REPORT_SETTING_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportsSetting : Execution end. : Error details :' + GET_RISK_REPORT_SETTING_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_REPORT_SETTING_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_REPORT_SETTING_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportsSetting : Execution end. : Error details : ' + GET_RISK_REPORT_SETTING_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

             //Formatting Resultset of getRiskReportSetting data
            let reportData = GET_RISK_REPORT_SETTING_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let metricData = GET_RISK_REPORT_SETTING_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
           
            const GET_RISK_REPORT_DATA  = await getRiskReportData(userIdFromToken,reportData,metricData, accountGUIDFromToken);
           
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : GET_RISK_REPORT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if(GET_RISK_REPORT_SETTING_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_REPORT_SETTING_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_RISK_REPORT_SETTING_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getUploadedRiskAppetiteFileDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_RISK_REPORT_DATA));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportsSetting : Execution end. : Get Risk Report setting successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_RISK_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportsSetting : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Save risk report setting details to database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRiskReportsSetting(request, response) {
        try {
            var refreshedToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const SET_RISK_REPORT_SETTING_DATA = await riskReportsDbObject.setRiskReportsSetting(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
        
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_RISK_REPORT_SETTING_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_RISK_REPORT_SETTING_DATA){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution end. : SET_RISK_REPORT_SETTING_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_REPORT_SETTING_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution end. : Error details :' + SET_RISK_REPORT_SETTING_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_REPORT_SETTING_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_RISK_REPORT_SETTING_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution end. : Error details : ' + SET_RISK_REPORT_SETTING_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //Formatting Resultset of getRiskReportSetting data
            let reportData = SET_RISK_REPORT_SETTING_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            
            const GET_RISK_REPORT_DATA  = await setRiskReportData(userIdFromToken, reportData, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_REPORT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : GET_RISK_REPORT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution end. : save risk report setting successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, GET_RISK_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportsSetting : Execution end. : Got unhandled error. : Error Detail : ' + error);
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
 * This is function will format the DB response of setRiskReportSetting data.
 */
async function setRiskReportData(userIdFromToken, reportData, accountGUIDFromToken){
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportData : Execution started.');
        let reportDetails = [];
 
        for(const obj of Object.values(reportData)){
            reportDetails.push({
                T0                      : obj.T_0,
                T1                      : obj.T_1,
                T2                      : obj.T_2,
                RiskMetricLevelID       : obj.RiskMetricLevelID,
                RiskMetricLevel         : obj.RiskMetricLevel,
                RiskMetricLevelName     : obj.RiskMetricLevelName,
                Escalation              : obj.Escalation,
                Action                  : obj.Action,
                IsEscalationMandatory   : obj.IsEscalationMandatory,
                IsActionMandatory       : obj.IsActionMandatory
            })
        };
    
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportData : Execution end.');
        return {"reportSettingsData" : reportDetails};
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : setRiskReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format the DB response of getRiskReportSetting data.
 */
 async function getRiskReportData(userIdFromToken, reportData, metricData, accountGUIDFromToken){
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportData : Execution started.');
        let reportDetails  = [];
        let riskMetricData = [];
 
        for(const obj of Object.values(reportData)){
            reportDetails.push({
                T0                      : obj.T_0,
                T1                      : obj.T_1,
                T2                      : obj.T_2,
                RiskMetricLevelID       : obj.RiskMetricLevelID,
                RiskMetricLevel         : obj.RiskMetricLevel,
                RiskMetricLevelName     : obj.RiskMetricLevelName,
                Escalation              : obj.Escalation,
                Action                  : obj.Action,
                IsEscalationMandatory   : obj.IsEscalationMandatory,
                IsActionMandatory       : obj.IsActionMandatory
            })
        };
  
        for(const obj of Object.values(metricData)){
            riskMetricData.push({
                RiskMetricLevelID   : obj.RiskMetricLevelID,
                FWID                : obj.FWID,
                RiskMetricLevel     : obj.RiskMetricLevel,
                RiskMetricLevel     : obj.RiskMetricLevel,
                RiskMetricZone      : obj.RiskMetricZone,
                ColorCode           : obj.ColorCode,
                DefaultColorCode    : obj.DefaultColorCode.trim(),
                Name                : obj.Name,
                Description         : obj.Description,
                CreatedDate         : obj.CreatedDate
             })
         };
    
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportData : Execution end.');

        return {
            "reportSettingsData"    : reportDetails,
            "riskMetricData"        : riskMetricData
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskReportsBl : getRiskReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getRiskReportsBLClassInstance() {
    if (riskReportsBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        riskReportsBLClassInstance = new RiskReportsBl();
    }
    return riskReportsBLClassInstance;
}

exports.getRiskReportsBLClassInstance = getRiskReportsBLClassInstance;