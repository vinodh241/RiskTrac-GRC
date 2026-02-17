const INHERENT_IMPACT_RATING_BL        = require('./inherent-impact-rating-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InherentImpactRatingRT {
    constructor(app) {        
        this.app = app;
        this.inherentImpactRatingBlObject = INHERENT_IMPACT_RATING_BL.getInherentImpactRatingBLClassInstance();
        this.inherentImpactRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/inherent-impact-rating/get-all-inherentimpact-data', TOKEN_UPDATE_MIDDELWARE, this.inherentImpactRatingBlObject.getAllInherentImpactRating);

        //Get All active records
        this.app.post('/rcsa/inherent-impact-rating/get-all-active-inherentimpact-data', TOKEN_UPDATE_MIDDELWARE, this.inherentImpactRatingBlObject.getAllActiveInherentImpactRating);

        //Get records by Id
        this.app.post('/rcsa/inherent-impact-rating/get-inherentimpact-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.inherentImpactRatingBlObject.getInherentImpactRatingByID);
        
        //Add a new record
        this.app.post('/rcsa/inherent-impact-rating/add-inherentimpact-data', TOKEN_UPDATE_MIDDELWARE, this.inherentImpactRatingBlObject.addInherentImpactRating);
        
        //Update an existing record
        this.app.post('/rcsa/inherent-impact-rating/update-inherentimpact-data', TOKEN_UPDATE_MIDDELWARE, this.inherentImpactRatingBlObject.updateInherentImpactRating);
        
        //Update Status
        this.app.post('/rcsa/inherent-impact-rating/update-inherentimpact-status', TOKEN_UPDATE_MIDDELWARE, this.inherentImpactRatingBlObject.updateInherentImpactRatingStatus);
        
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
        thisInstance = new InherentImpactRatingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;