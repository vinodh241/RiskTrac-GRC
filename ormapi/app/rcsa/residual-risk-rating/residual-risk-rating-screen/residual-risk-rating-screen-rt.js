const RESIDUAL_RISK_RATING_SCREEN_BL        = require('./residual-risk-rating-screen-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ResidualRiskRatingScreenRT {
    constructor(app) {        
        this.app = app;
        this.residualRiskRatingBlObject = RESIDUAL_RISK_RATING_SCREEN_BL.getResidualRiskRatingScreenBLClassInstance();
        this.residualRiskRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/residual-risk-rating-screen/get-data-for-residual-risk-rating-screen', TOKEN_UPDATE_MIDDELWARE, this.residualRiskRatingBlObject.getDataForResidualRiskRatingScreen);
        
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
        thisInstance = new ResidualRiskRatingScreenRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;