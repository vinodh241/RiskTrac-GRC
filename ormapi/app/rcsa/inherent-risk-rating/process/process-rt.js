const PROCESS_BL        = require('./process-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ProcessRT{
    constructor(app) {
        this.app = app;
        this.processBlObject = PROCESS_BL.getProcessBLClassInstance();
        this.processBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {
        
        //Get All records
        this.app.post('/rcsa/process/get-all-process-data', TOKEN_UPDATE_MIDDELWARE, this.processBlObject.getAllProcess);

        //Get All active records
        this.app.post('/rcsa/process/get-all-active-process-data', TOKEN_UPDATE_MIDDELWARE, this.processBlObject.getAllActiveProcess);

        //Get records by Id
        this.app.post('/rcsa/process/get-process-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.processBlObject.getProcessByID);
        
        //Add a new record
        this.app.post('/rcsa/process/add-process-data', TOKEN_UPDATE_MIDDELWARE, this.processBlObject.addProcess);
        
        //Update an existing record
        this.app.post('/rcsa/process/update-process-data', TOKEN_UPDATE_MIDDELWARE, this.processBlObject.updateProcess);
        
        //Update Status
        this.app.post('/rcsa/process/update-process-status', TOKEN_UPDATE_MIDDELWARE, this.processBlObject.updateProcessStatus);
        
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
        thisInstance = new ProcessRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;