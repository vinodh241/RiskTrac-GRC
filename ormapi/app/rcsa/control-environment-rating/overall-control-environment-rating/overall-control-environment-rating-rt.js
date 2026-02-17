const OVERALL_CONTROL_ENVIRONMENT_RATING_BL        = require('./overall-control-environment-rating-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class OverallControlEnvironmentRatingRT {
    constructor(app) {      
        this.app = app;
        this.overallControlEnvironmentRatingBlObject = OVERALL_CONTROL_ENVIRONMENT_RATING_BL.getOverallControlEnvironmentRatingBLClassInstance();
        this.overallControlEnvironmentRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/overall-control-environment-rating/get-all-overallcontrolenvironmentrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.getAllOverallControlEnvironmentRating);

        //Get All active records
        this.app.post('/rcsa/overall-control-environment-rating/get-all-active-overallcontrolenvironmentrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.getAllActiveOverallControlEnvironmentRating);

        //Get records by Id
        this.app.post('/rcsa/overall-control-environment-rating/get-overallcontrolenvironmentrating-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.getOverallControlEnvironmentRatingByID);
        
        // //Add a new record
        this.app.post('/rcsa/overall-control-environment-rating/add-overallcontrolenvironmentrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.addOverallControlEnvironmentRating);
        
        //Update an existing record
        this.app.post('/rcsa/overall-control-environment-rating/update-overallcontrolenvironmentrating-data', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.updateOverallControlEnvironmentRating);
        
        //Update Status
        this.app.post('/rcsa/overall-control-environment-rating/update-overallcontrolenvironmentrating-status', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.updateOverallControlEnvironmentRatingStatus);
        
        //Get Config Score And Rating
        this.app.post('/rcsa/overall-control-environment-rating/get-config-score-and-rating', TOKEN_UPDATE_MIDDELWARE, this.overallControlEnvironmentRatingBlObject.getConfigScoreAndRating);
        
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
        thisInstance = new OverallControlEnvironmentRatingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;