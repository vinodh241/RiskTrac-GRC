const MESSAGE_FILE_OBJ = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../utility/constants/constant.js');
const REPORT_DB = require('../../data-access/report-db.js');
const { logger } = require('../../utility/log-manager/log-manager.js');

let reportBLClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let reportDb = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ReportBl {
    constructor() {
        reportDb = new REPORT_DB();
    }

    start() {
    }

    async getReportRiskAppetite(request, response) {
        try {
            let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let RA_DATA             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let REPORT_RA_DATA      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution started.');

            const RiskAppetite_DB_RESPONSE = await reportDb.getReportRiskAppetite(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : RiskAppetite_DB_RESPONSE ' + JSON.stringify(RiskAppetite_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RiskAppetite_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RiskAppetite_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getRiskAppetiteReport : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RiskAppetite_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution end. : Error details :' + RiskAppetite_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RiskAppetite_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RiskAppetite_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution end. : Error details : ' + RiskAppetite_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RiskAppetite_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RiskAppetite_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RiskAppetite_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, dataForIncident));
            }

            /**
            * Formating resultset provided by DB :START.
            *            
            */          
            RA_DATA = RiskAppetite_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            REPORT_RA_DATA = await formatData("RiskAppetiteData", RA_DATA, userIdFromToken, accountGUIDFromToken)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : REPORT_RA_DATA ' + JSON.stringify(REPORT_RA_DATA || null));
            /**
            * Formating resultset provided by DB :END.
            */

            //Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REPORT_RA_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REPORT_RA_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution end. : REPORT_RA_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution end. : Get RiskAppetite Report List successfully.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : REPORT_RA_DATA ' + JSON.stringify(REPORT_RA_DATA || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, REPORT_RA_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    async getReportIncident(request, response) {
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            
            
            let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let REPORT_INCIDENT_DATA = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution started.');

            const Reports_DB_RESPONSE = await reportDb.getReportIncident(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Reports_DB_RESPONSE ' + JSON.stringify(Reports_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == Reports_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == Reports_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : Incident list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (Reports_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : Error details :' + Reports_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (Reports_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && Reports_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : Error details : ' + Reports_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (Reports_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && Reports_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && Reports_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, dataForRiskAppetite));
            }

            REPORT_INCIDENT_DATA = await formatData("IncidentData",Reports_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], userIdFromToken, accountGUIDFromToken)
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : REPORT_INCIDENT_DATA ' + JSON.stringify(REPORT_INCIDENT_DATA || null));
            // Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REPORT_INCIDENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REPORT_INCIDENT_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : REPORT_INCIDENT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : Get Incident Report Data successfully.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : REPORT_INCIDENT_DATA ' + JSON.stringify(REPORT_INCIDENT_DATA || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, REPORT_INCIDENT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBL : getReportIncident : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    
    async getReportKRI(request, response) {
        try {
            let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let REPORT_KRI_Data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution started.');

            const KRI_REPORT_DB_RESPONSE = await reportDb.getReportKRI(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : KRI_REPORT_DB_RESPONSE : ' + JSON.stringify(KRI_REPORT_DB_RESPONSE));

            // logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Reports_DB_RESPONSE ' + JSON.stringify(Reports_DB_RESPONSE || null));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : KRI list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : Error details :' + KRI_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : Error details : ' + KRI_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (KRI_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && KRI_REPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, dataForRiskAppetite));
            }
            /**
            * Formating resultset provided by DB :END.
            */
            REPORT_KRI_Data = await formatKRIData(KRI_REPORT_DB_RESPONSE, userIdFromToken, accountGUIDFromToken)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : REPORT_KRI_Data : ' + JSON.stringify(REPORT_KRI_Data));

            // Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REPORT_KRI_Data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REPORT_KRI_Data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : REPORT_KRI_Data is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : Get KRI Report Data successfully.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : REPORT_KRI_Data ' + JSON.stringify(REPORT_KRI_Data || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, REPORT_KRI_Data));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportKRI : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }


    async getReportRCSA(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            
            let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let REPORT_RCSA_Data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution started.');

            const RCSA_REPORT_DB_RESPONSE = await reportDb.getReportRCSA(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : RCSA_REPORT_DB_RESPONSE : ' + JSON.stringify(RCSA_REPORT_DB_RESPONSE));

            // logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Reports_DB_RESPONSE ' + JSON.stringify(Reports_DB_RESPONSE || null));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_REPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_REPORT_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : RCSA list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RCSA_REPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : Error details :' + RCSA_REPORT_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RCSA_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : Error details : ' + RCSA_REPORT_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RCSA_REPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_REPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RCSA_REPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, dataForRiskAppetite));
            }
            /**
            * Formating resultset provided by DB :END.
            */
            REPORT_RCSA_Data = await formatData("RCSAData",RCSA_REPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], userIdFromToken, accountGUIDFromToken)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : REPORT_RCSA_Data : ' + JSON.stringify(REPORT_RCSA_Data));

            // Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == REPORT_RCSA_Data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == REPORT_RCSA_Data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : REPORT_RCSA_Data is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : Get RCSA Report Data successfully.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : REPORT_RCSA_Data ' + JSON.stringify(REPORT_RCSA_Data || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, REPORT_RCSA_Data));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportBl : getReportRCSA : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
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
 
async function formatKRIData(REPORT_DATA, userIdFromToken, accountGUIDFromToken, callback) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatgetRiskAppetiteData : Execution Start.');
        let data = [];
        let KRIUnitSet = [];
        let reportingFrequencyData = [];


        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            let recordset = REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            dataArr = [];
            KRIUnitSet = [...new Set(recordset.map(obj => obj["Unit"]))];
            recordset.forEach(obj => {
                if (obj.PreviousQuarterData === "Not Measured") {
                    data.push(obj);
                } else {
                    const parsedData = JSON.parse(obj.PreviousQuarterData);
                    data.push({
                        ...obj,
                        PreviousQuarterData: parsedData
                    });
                }
            });
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatgetRiskAppetiteData : data.' + JSON.stringify(data));
        }

        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
                reportingFrequencyData.push({
                    "FrequencyID"           : obj.FrequencyID,
                    "Name"                  : obj.Name,
                    "Description"           : obj.Description,
                    "InUse"                 : obj.InUse,
                    "BufferDays"            : obj.BufferDays,
                    "IsWithinBufferDays"    : obj.IsWithinBufferDays,
                    "Period"                : obj.Period,
                    "PeriodStartDate"       : obj.PeriodStartDate,
                    "PeriodEndDate"         : obj.PeriodEndDate 
                });
            }
        }

        return {
            "KRIData": data,
            "KRI_Units": KRIUnitSet,
            "reportingFrequencyData": reportingFrequencyData 
        }

    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatgetRiskAppetiteData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
    }
}

async function formatData(key, recordset, userIdFromToken, accountGUIDFromToken, callback) {
    try {
        if(key === "RCSAData"){
            const RCSAUnitSet = [...new Set(recordset.map(obj => obj["Unit"]))];
            logger.log('info', 'formatData for RCSA_report : RCSAUnitSet : ' + JSON.stringify(RCSAUnitSet));
            return {
                [key]: recordset,
                "RCSA_Units": RCSAUnitSet
            }
        }
        if(key === "IncidentData"){
            const IncidentUnitSet = [...new Set(recordset.map(obj => obj["IncidentUnitName"]))];
            logger.log('info', 'formatData for Incident_report : IncidentUnitSet : ' + JSON.stringify(IncidentUnitSet));
            return {
                [key]: recordset,
                "Incident_Units": IncidentUnitSet
            }
        }
        if(key === "RiskAppetiteData"){
           const RAUnitSet = [...new Set(recordset.map(obj => obj["UnitName"]))];
            logger.log('info', 'formatData for RA_report : RAUnitSet : ' + JSON.stringify(RAUnitSet));
            return {
                [key]: recordset,
                "RA_Units": RAUnitSet
            } 
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
        callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
    }
}

/**
* This is function will be used to return single instance of class.
*/
function getReportBLClassInstance() {
    if (reportBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        reportBLClassInstance = new ReportBl();
    }
    return reportBLClassInstance;
}

exports.getReportBLClassInstance = getReportBLClassInstance;