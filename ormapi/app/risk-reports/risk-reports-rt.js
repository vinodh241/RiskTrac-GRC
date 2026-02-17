const RISK_REPORTS_BL           = require('./risk-reports-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskReportsRT {
    constructor(app) {
        this.app = app;
        this.riskReportsBlObject = RISK_REPORTS_BL.getRiskReportsBLClassInstance();
        this.riskReportsBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/operational-risk-management/risk-reports/get-risk-reports-setting',     TOKEN_UPDATE_MIDDELWARE, this.riskReportsBlObject.getRiskReportsSetting);
        this.app.post('/operational-risk-management/risk-reports/set-risk-reports-setting',     TOKEN_UPDATE_MIDDELWARE, this.riskReportsBlObject.setRiskReportsSetting);
 
    }

    /**
     * This function will be used to stop service of controller in case any.
     */
    stop() {

    }
}

/**
 * This is function will be used to return single instance of class.
 * @param {*} app 
 */
function getInstance(app) {
    if (thisInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        thisInstance = new RiskReportsRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;