
const CRISIS_COMMUNICATION_BL   = require('./crisis-communication-bl');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class CrisisCommuncationRT {
    constructor(app) {
        this.app = app;
        this.crisisCommuncationBlObject = CRISIS_COMMUNICATION_BL.getCrisisCommunicationBLClassInstance();
        this.crisisCommuncationBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/crisis-communications/get-crisis-communications-list',   TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.getCrisisCommunicationsList);
        this.app.post('/business-continuity-management/crisis-communications/get-create-crisis-message-info',   TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.getCreateCrisisMessageInfo);
        this.app.post('/business-continuity-management/crisis-communications/create-crisis-message',            TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.createCrisisMessage);
        this.app.post('/business-continuity-management/crisis-communications/update-crisis-message',            TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.updateCrisisMessage);
        this.app.post('/business-continuity-management/crisis-communications/get-crisis-communication-data',    TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.getCrisisCommunicationData);
        this.app.post('/business-continuity-management/crisis-communications/upload-crisis-attachment',         TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.uploadCrisisAttachment);
        this.app.post('/business-continuity-management/crisis-communications/download-crisis-attachment',       TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.downloadCrisisAttachment);
        this.app.post('/business-continuity-management/crisis-communications/send-crisis-communication',        TOKEN_UPDATE_MIDDELWARE, this.crisisCommuncationBlObject.sendCrisisCommunication);
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
        thisInstance = new CrisisCommuncationRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;