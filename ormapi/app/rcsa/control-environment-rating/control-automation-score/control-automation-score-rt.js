const CONTROL_AUTOMATION_SCORE_BL        = require('./control-automation-score-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlAutomationScoreRT {
    constructor(app) {        
        this.app = app;
        this.controlAutomationScoreBlObject = CONTROL_AUTOMATION_SCORE_BL.getControlAutomationScoreBLClassInstance();
        this.controlAutomationScoreBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/control-automation-score/get-all-controlautomationscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlAutomationScoreBlObject.getAllControlAutomationScore);

        //Get All active records
        this.app.post('/rcsa/control-automation-score/get-all-active-controlautomationscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlAutomationScoreBlObject.getAllActiveControlAutomationScore);

        //Get records by Id
        this.app.post('/rcsa/control-automation-score/get-controlautomationscore-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.controlAutomationScoreBlObject.getControlAutomationScoreByID);
        
        //Add a new record
        this.app.post('/rcsa/control-automation-score/add-controlautomationscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlAutomationScoreBlObject.addControlAutomationScore);
        
        //Update an existing record
        this.app.post('/rcsa/control-automation-score/update-controlautomationscore-data', TOKEN_UPDATE_MIDDELWARE, this.controlAutomationScoreBlObject.updateControlAutomationScore);
        
        //Update Status
        this.app.post('/rcsa/control-automation-score/update-controlautomationscore-status', TOKEN_UPDATE_MIDDELWARE, this.controlAutomationScoreBlObject.updateControlAutomationScoreStatus);
        
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
        thisInstance = new ControlAutomationScoreRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;