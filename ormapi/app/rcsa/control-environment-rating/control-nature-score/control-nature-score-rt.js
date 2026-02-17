const CONTROL_NATURE_SCORE_BL        = require('./control-nature-score-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlNatureScoreRT {
    constructor(app) {        
        this.app = app;
        this.controlNatureScoreBlObject = CONTROL_NATURE_SCORE_BL.getControlNatureScoreBLClassInstance();
        this.controlNatureScoreBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/control-nature-score/get-all-controlnaturescore-data', TOKEN_UPDATE_MIDDELWARE, this.controlNatureScoreBlObject.getAllControlNatureScore);

        //Get All active records
        this.app.post('/rcsa/control-nature-score/get-all-active-controlnaturescore-data', TOKEN_UPDATE_MIDDELWARE, this.controlNatureScoreBlObject.getAllActiveControlNatureScore);

        //Get records by Id
        this.app.post('/rcsa/control-nature-score/get-controlnaturescore-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.controlNatureScoreBlObject.getControlNatureScoreByID);
        
        //Add a new record
        this.app.post('/rcsa/control-nature-score/add-controlnaturescore-data', TOKEN_UPDATE_MIDDELWARE, this.controlNatureScoreBlObject.addControlNatureScore);
        
        //Update an existing record
        this.app.post('/rcsa/control-nature-score/update-controlnaturescore-data', TOKEN_UPDATE_MIDDELWARE, this.controlNatureScoreBlObject.updateControlNatureScore);
        
        //Update Status
        this.app.post('/rcsa/control-nature-score/update-controlnaturescore-status', TOKEN_UPDATE_MIDDELWARE, this.controlNatureScoreBlObject.updateControlNatureScoreStatus);
        
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
        thisInstance = new ControlNatureScoreRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;