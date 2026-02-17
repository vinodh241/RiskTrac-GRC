const OVERALL_INHERENT_RISK_RATING_BL        = require('./overall-inherent-risk-rating-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class OverallInherentRiskRatingRT {
    constructor(app) {        
        this.app = app;
        this.overallInherentRiskRatingBlObject = OVERALL_INHERENT_RISK_RATING_BL.getOverallInherentRiskRatingBLClassInstance();
        this.overallInherentRiskRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/overall-inherent-risk-rating/get-all-overallinherentriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskRatingBlObject.getAllOverallInherentRiskRating);

        //Get All active records
        this.app.post('/rcsa/overall-inherent-risk-rating/get-all-active-overallinherentriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskRatingBlObject.getAllActiveOverallInherentRiskRating);

        //Get records by Id
        this.app.post('/rcsa/overall-inherent-risk-rating/get-overallinherentriskrating-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskRatingBlObject.getOverallInherentRiskRatingByID);
        
        //Add a new record
        this.app.post('/rcsa/overall-inherent-risk-rating/add-overallinherentriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskRatingBlObject.addOverallInherentRiskRating);
        
        //Update an existing record
        this.app.post('/rcsa/overall-inherent-risk-rating/update-overallinherentriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskRatingBlObject.updateOverallInherentRiskRating);
        
        //Update Status
        this.app.post('/rcsa/overall-inherent-risk-rating/update-overallinherentriskrating-status', TOKEN_UPDATE_MIDDELWARE, this.overallInherentRiskRatingBlObject.updateOverallInherentRiskRatingStatus);
        
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
        thisInstance = new OverallInherentRiskRatingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;