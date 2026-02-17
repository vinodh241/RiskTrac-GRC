const CONTROL_FREQUENCY_SCORE_BL        = require('./control-frequency-score-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlFrequencyScoreRT {
    constructor(app) {        
        this.app = app;
        this.controlFrequencyScoreBlObject = CONTROL_FREQUENCY_SCORE_BL.getControlFrequencyScoreBLClassInstance();
        this.controlFrequencyScoreBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/control-frequency-score/get-all-controlfrequencyscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlFrequencyScoreBlObject.getAllControlFrequencyScore);

        //Get All active records
        this.app.post('/rcsa/control-frequency-score/get-all-active-controlfrequencyscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlFrequencyScoreBlObject.getAllActiveControlFrequencyScore);

        //Get records by Id
        this.app.post('/rcsa/control-frequency-score/get-controlfrequencyscore-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.controlFrequencyScoreBlObject.getControlFrequencyScoreByID);
        
        //Add a new record
        this.app.post('/rcsa/control-frequency-score/add-controlfrequencyscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlFrequencyScoreBlObject.addControlFrequencyScore);
        
        //Update an existing record
        this.app.post('/rcsa/control-frequency-score/update-controlfrequencyscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlFrequencyScoreBlObject.updateControlFrequencyScore);
        
        //Update Status
        this.app.post('/rcsa/control-frequency-score/update-controlfrequencyscore-status', TOKEN_UPDATE_MIDDELWARE, this.controlFrequencyScoreBlObject.updateControlFrequencyScoreStatus);
        
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
        thisInstance = new ControlFrequencyScoreRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;