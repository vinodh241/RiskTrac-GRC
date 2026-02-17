const RISK_RATING_BL            = require('./risk-rating-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskratingRT {
    constructor(app) {
        this.app = app;
        this.riskRatingBlObject = RISK_RATING_BL.getRiskRatingBLClassInstance();
        this.riskRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/master/risk-rating/get-data-for-overall-risk-rating',   TOKEN_UPDATE_MIDDELWARE,    this.riskRatingBlObject.getDataForOverallRiskRating);
        this.app.post('/business-continuity-management/master/risk-rating/manage-overall-risk-rating',         TOKEN_UPDATE_MIDDELWARE,    this.riskRatingBlObject.manageOverallRiskRating); 
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
        thisInstance = new RiskratingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;