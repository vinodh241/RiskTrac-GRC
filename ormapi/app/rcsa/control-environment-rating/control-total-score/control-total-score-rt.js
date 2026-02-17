const CONTROL_TOTAL_SCORE_BL        = require('./control-total-score-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlTotalScoreRT {
    constructor(app) {
        this.app = app;
        this.controlTotalScoreBlObject = CONTROL_TOTAL_SCORE_BL.getControlTotalScoreBLClassInstance();
        this.controlTotalScoreBlObject.start();
    }
 
    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/control-total-score/get-all-controltotalscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlTotalScoreBlObject.getAllControlTotalScore);

        //Get All active records
        this.app.post('/rcsa/control-total-score/get-all-active-controltotalscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlTotalScoreBlObject.getAllActiveControlTotalScore);

        //Get records by Id
        this.app.post('/rcsa/control-total-score/get-controltotalscore-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.controlTotalScoreBlObject.getControlTotalScoreByID);
        
        //Add a new record
        this.app.post('/rcsa/control-total-score/add-controltotalscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlTotalScoreBlObject.addControlTotalScore);
        
        //Update an existing record
        this.app.post('/rcsa/control-total-score/update-controltotalscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlTotalScoreBlObject.updateControlTotalScore);
        
        //Update Status
        this.app.post('/rcsa/control-total-score/update-controltotalscore-status', TOKEN_UPDATE_MIDDELWARE, this.controlTotalScoreBlObject.updateControlTotalScoreStatus);
        
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
        thisInstance = new ControlTotalScoreRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;
