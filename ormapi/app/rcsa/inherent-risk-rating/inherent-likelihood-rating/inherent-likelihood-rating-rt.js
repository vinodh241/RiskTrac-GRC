const INHERENT_LIKELIHOOD_RATING_BL        = require('./inherent-likelihood-rating-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InherentLikeliHoodRatingRT {
    constructor(app) {
        this.app = app;
        this.inherentLikeliHoodRatingBlObject = INHERENT_LIKELIHOOD_RATING_BL.getInherentLikelihoodRatingBLClassInstance();
        this.inherentLikeliHoodRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/inherent-likelihood-rating/get-all-inherent-data', TOKEN_UPDATE_MIDDELWARE, this.inherentLikeliHoodRatingBlObject.getAllInherentLikelihoodRating);

        //Get All active records
        this.app.post('/rcsa/inherent-likelihood-rating/get-all-active-inherent-data', TOKEN_UPDATE_MIDDELWARE, this.inherentLikeliHoodRatingBlObject.getAllActiveInherentLikelihoodRating);

        //Get records by Id
        this.app.post('/rcsa/inherent-likelihood-rating/get-inherent-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.inherentLikeliHoodRatingBlObject.getInherentLikelihoodRatingByID);
        
        //Add a new record
        this.app.post('/rcsa/inherent-likelihood-rating/add-inherent-data', TOKEN_UPDATE_MIDDELWARE, this.inherentLikeliHoodRatingBlObject.addInherentLikelihoodRating);
        
        //Update an existing record
        this.app.post('/rcsa/inherent-likelihood-rating/update-inherent-data', TOKEN_UPDATE_MIDDELWARE, this.inherentLikeliHoodRatingBlObject.updateInherentLikelihoodRating);
        
        //Update Status
        this.app.post('/rcsa/inherent-likelihood-rating/update-inherent-status', TOKEN_UPDATE_MIDDELWARE, this.inherentLikeliHoodRatingBlObject.updateInherentLikelihoodRatingStatus);
        
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
        thisInstance = new InherentLikeliHoodRatingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;