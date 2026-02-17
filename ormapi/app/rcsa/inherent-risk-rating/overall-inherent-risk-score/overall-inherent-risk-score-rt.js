const OVERALL_INHERENT_RISK_SCORE_BL        = require('./overall-inherent-risk-score-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class OverallInherentRiskScoreRT {
    constructor(app) {        
        this.app = app;
        this.overallInherentRiskScoreBlObject = OVERALL_INHERENT_RISK_SCORE_BL.getOverallInherentRiskScoreBLClassInstance();
        this.overallInherentRiskScoreBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/overall-inherent-risk-score/get-all-overallinherentriskscore-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskScoreBlObject.getAllOverallInherentRiskScore);

        //Get All active records
        this.app.post('/rcsa/overall-inherent-risk-score/get-all-active-overallinherentriskscore-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskScoreBlObject.getAllActiveOverallInherentRiskScore);

        //Get records by Id
        this.app.post('/rcsa/overall-inherent-risk-score/get-overallinherentriskscore-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskScoreBlObject.getOverallInherentRiskScoreByID);
        
        //Add a new record
        this.app.post('/rcsa/overall-inherent-risk-score/add-overallinherentriskscore-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskScoreBlObject.addOverallInherentRiskScore);
        
        //Update an existing record
        this.app.post('/rcsa/overall-inherent-risk-score/update-overallinherentriskscore-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskScoreBlObject.updateOverallInherentRiskScore);
        
        //Update Status
        this.app.post('/rcsa/overall-inherent-risk-score/update-overallinherentriskscore-status', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskScoreBlObject.updateOverallInherentRiskScoreStatus);

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
        thisInstance = new OverallInherentRiskScoreRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;
