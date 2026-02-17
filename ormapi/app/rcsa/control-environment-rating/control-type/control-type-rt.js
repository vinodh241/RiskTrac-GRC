const CONTROL_TYPE_BL        = require('./control-type-bl.js');
const CONSTANT_FILE_OBJ      = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE= require('../../../../utility/middleware/validate-update-token.js');

let thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlTypeRT {
    constructor(app) {
        this.app = app;
        this.controlTypeBlObject = CONTROL_TYPE_BL.getControlTypeBLClassInstance();
        this.controlTypeBlObject.start();
    }

    start() {
        // Get all
        this.app.post('/rcsa/control-type/get-all-controltype-data', TOKEN_UPDATE_MIDDELWARE, this.controlTypeBlObject.getAllControlType);
        // Add 
        this.app.post('/rcsa/control-type/add-controltype-data', TOKEN_UPDATE_MIDDELWARE, this.controlTypeBlObject.addControlType);
        // Update
        this.app.post('/rcsa/control-type/update-controltype-data', TOKEN_UPDATE_MIDDELWARE, this.controlTypeBlObject.updateControlType);        
    }

    stop() {}
}

function getInstance(app) {
    if (thisInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) thisInstance = new ControlTypeRT(app);
    return thisInstance;
}

exports.getInstance = getInstance;
