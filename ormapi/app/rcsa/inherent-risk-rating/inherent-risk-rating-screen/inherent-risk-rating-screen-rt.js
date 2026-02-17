const INHERENT_RISK_RATING_SCREEN_BL        = require('./inherent-risk-rating-screen-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InherentRiskRatingScreenRT {
    constructor(app) {        
        this.app = app;
        this.inherentRiskRatingBlObject = INHERENT_RISK_RATING_SCREEN_BL.getInherentRiskRatingScreenBLClassInstance();
        this.inherentRiskRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/inherent-risk-rating-screen/get-data-for-inherent-risk-rating-screen', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskRatingBlObject.getDataForInherentRiskRatingScreen);
        
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
        thisInstance = new InherentRiskRatingScreenRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;