
const CRISIS_COMMS_BL           = require('./crisis-comms-template-bl');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class CRISISCOMMSRT {
    constructor(app) {
        this.app = app;
        this.crisisCommsBlObject = CRISIS_COMMS_BL.getCrisisCommsBLClassInstance();
        this.crisisCommsBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/master/crisis-comms/get-crisis-comms-master',         TOKEN_UPDATE_MIDDELWARE,this.crisisCommsBlObject.getCrisisCommsMaster);
        this.app.post('/business-continuity-management/master/crisis-comms/get-crisis-comms-master-info',    TOKEN_UPDATE_MIDDELWARE,this.crisisCommsBlObject.getCrisisCommsMasterInfo);
        this.app.post('/business-continuity-management/master/crisis-comms/add-crisis-comms-master',         TOKEN_UPDATE_MIDDELWARE,this.crisisCommsBlObject.addCrisisCommsMaster);
        this.app.post('/business-continuity-management/master/crisis-comms/update-crisis-comms-master',      TOKEN_UPDATE_MIDDELWARE,this.crisisCommsBlObject.updateCrisisCommsMaster);
        this.app.post('/business-continuity-management/master/crisis-comms/delete-crisis-comms-master',      TOKEN_UPDATE_MIDDELWARE,this.crisisCommsBlObject.deleteCrisisCommsMaster);
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
        thisInstance = new CRISISCOMMSRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;