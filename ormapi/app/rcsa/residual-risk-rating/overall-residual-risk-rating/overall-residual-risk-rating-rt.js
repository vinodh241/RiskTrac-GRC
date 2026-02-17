const OVERALL_RESIDUAL_RISK_RATING_BL        = require('./overall-residual-risk-rating-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class OverallResidualRiskRatingRT {
    constructor(app) {        
        this.app = app;
        this.overallResidualRiskRatingBlObject = OVERALL_RESIDUAL_RISK_RATING_BL.getOverallResidualRiskRatingBLClassInstance();
        this.overallResidualRiskRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/overall-residual-risk-rating/get-all-overallresidualriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallResidualRiskRatingBlObject.getAllOverallResidualRiskRating);

        //Get All active records
        this.app.post('/rcsa/overall-residual-risk-rating/get-all-active-overallresidualriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallResidualRiskRatingBlObject.getAllActiveOverallResidualRiskRating);

        //Get records by Id
        this.app.post('/rcsa/overall-residual-risk-rating/get-overallresidualriskrating-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.overallResidualRiskRatingBlObject.getOverallResidualRiskRatingByID);
        
        //Add a new record
        this.app.post('/rcsa/overall-residual-risk-rating/add-overallresidualriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallResidualRiskRatingBlObject.addOverallResidualRiskRating);
        
        //Update an existing record
        this.app.post('/rcsa/overall-residual-risk-rating/update-overallresidualriskrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallResidualRiskRatingBlObject.updateOverallResidualRiskRating);
        
        //Update Status
        this.app.post('/rcsa/overall-residual-risk-rating/update-overallresidualriskrating-status', TOKEN_UPDATE_MIDDELWARE, this.overallResidualRiskRatingBlObject.updateOverallResidualRiskRatingStatus);
        
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
        thisInstance = new OverallResidualRiskRatingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;