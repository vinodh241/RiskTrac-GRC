const CONTROL_IN_PACE_BL        = require('./control-in-pace-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlInPaceRT {
    constructor(app) {        
        this.app = app;
        this.controlInPaceBlObject = CONTROL_IN_PACE_BL.getControlInPaceBLClassInstance();
        this.controlInPaceBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/control-in-place/get-all-controlinpace-data', TOKEN_UPDATE_MIDDELWARE, this.controlInPaceBlObject.getAllControlInPace);

        //Get All active records
        this.app.post('/rcsa/control-in-place/get-all-active-controlinpace-data', TOKEN_UPDATE_MIDDELWARE, this.controlInPaceBlObject.getAllActiveControlInPace);

        //Get records by Id
        this.app.post('/rcsa/control-in-place/get-controlinpace-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.controlInPaceBlObject.getControlInPaceByID);
        
        //Add a new record
        this.app.post('/rcsa/control-in-place/add-controlinpace-data', TOKEN_UPDATE_MIDDELWARE, this.controlInPaceBlObject.addControlInPace);
        
        //Update an existing record
        this.app.post('/rcsa/control-in-place/update-controlinpace-data', TOKEN_UPDATE_MIDDELWARE, this.controlInPaceBlObject.updateControlInPace);
        
        //Update Status
        this.app.post('/rcsa/control-in-place/update-controlinpace-status', TOKEN_UPDATE_MIDDELWARE, this.controlInPaceBlObject.updateControlInPaceStatus);
        
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
        thisInstance = new ControlInPaceRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;