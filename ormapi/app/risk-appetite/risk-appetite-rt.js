const RISK_APPETITE_BL          = require('./risk-appetite-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskAppetiteRT {
    constructor(app) {
        this.app = app;
        this.riskAppetiteBlObject = RISK_APPETITE_BL.getRiskAppetiteBLClassInstance();
        this.riskAppetiteBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {       
        this.app.post('/operational-risk-management/risk-appetite/download-file',                     TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.downloadFile);
        this.app.post('/operational-risk-management/risk-appetite/download-risk-appetite-template',   TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.downloadRiskAppetiteTemplate);
        this.app.post('/operational-risk-management/risk-appetite/get-policy-details',                TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.getPolicyDetails);       
        this.app.post('/operational-risk-management/risk-appetite/get-risk-appetite-list',            TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.getRiskAppetiteList);
        this.app.post('/operational-risk-management/risk-appetite/get-risk-appetite-template-list',   TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.getRiskAppetiteTemplateList); 
        this.app.post('/operational-risk-management/risk-appetite/upload-risk-appetite',              TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.uploadRiskAppetite);
        this.app.post('/operational-risk-management/risk-appetite/upload-risk-appetite-template',     TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.uploadRiskAppetiteTemplate);
        this.app.post('/operational-risk-management/risk-appetite/generate-email',                    TOKEN_UPDATE_MIDDELWARE, this.riskAppetiteBlObject.generateEmail);
        
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
        thisInstance = new RiskAppetiteRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;