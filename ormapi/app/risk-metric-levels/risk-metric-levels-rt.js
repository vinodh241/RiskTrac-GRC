const RISK_METRIC_LEVELS_BL     = require('./risk-metric-levels-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskMetricLevelsRT {
    constructor(app) {
        this.app = app;
        this.riskMetricLevelsBlObject = RISK_METRIC_LEVELS_BL.getRiskMetricLevelsBLClassInstance();
        this.riskMetricLevelsBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/operational-risk-management/risk-metric-levels/get-risk-metric-levels', TOKEN_UPDATE_MIDDELWARE, this.riskMetricLevelsBlObject.getRiskMetricLevels);
        this.app.post('/operational-risk-management/risk-metric-levels/set-risk-metric-levels', TOKEN_UPDATE_MIDDELWARE, this.riskMetricLevelsBlObject.setRiskMetricLevels);
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
        thisInstance = new RiskMetricLevelsRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;