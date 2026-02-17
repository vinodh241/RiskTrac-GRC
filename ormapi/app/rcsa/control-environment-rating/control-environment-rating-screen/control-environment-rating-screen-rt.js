const CONTROL_ENVIRONMENT_RATING_SCREEN_BL        = require('./control-environment-rating-screen-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlEnvironmentRatingScreenRT {
    constructor(app) {        
        this.app = app;
        this.controlEnvironmentRatingBlObject = CONTROL_ENVIRONMENT_RATING_SCREEN_BL.getControlEnvironmentRatingScreenBLClassInstance();
        this.controlEnvironmentRatingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        //Get All records
        this.app.post('/rcsa/control-environment-rating-screen/get-data-for-control-environment-rating-screen', TOKEN_UPDATE_MIDDELWARE, this.controlEnvironmentRatingBlObject.getDataForControlEnvironmentRatingScreen);
        
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
        thisInstance = new ControlEnvironmentRatingScreenRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;