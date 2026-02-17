const CONTROL_LIBRARY_BL = require('./control_library-bl');
const CONSTANT_FILE_OBJ = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE = require('../../../utility/middleware/validate-update-token.js');

let controlLibraryRouteInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlLibraryRT {
    constructor(app) {
        this.app = app;
        // Works with either exported name (back-compat alias provided in BL file)
        this.controlLibraryBLObject = CONTROL_LIBRARY_BL.getControlLibraryBLClassInstance();
        this.controlLibraryBLObject.start();
    }

    start() {
        // Get All records
        this.app.post('/rcsa/controllibrary/get-all-control-library-data', TOKEN_UPDATE_MIDDELWARE, this.controlLibraryBLObject.getAllControlLibraryData);
        // Get Master Data        
        this.app.post('/rcsa/controllibrary/get-control-library-master-data', TOKEN_UPDATE_MIDDELWARE, this.controlLibraryBLObject.getControlMasterData);
        // Add a new Control
        this.app.post('/rcsa/controllibrary/add-control-data', TOKEN_UPDATE_MIDDELWARE, this.controlLibraryBLObject.addControlData);
        // update control 
        this.app.post('/rcsa/controllibrary/update-control-data', TOKEN_UPDATE_MIDDELWARE, this.controlLibraryBLObject.updateControlData);
        // bulk upload controls to Librarey 
        this.app.post('/rcsa/controllibrary/add-bulk-control-data', TOKEN_UPDATE_MIDDELWARE, this.controlLibraryBLObject.addBulkControlData);
    }

    stop() { }
}

/**
 * Return singleton instance of the route class
 * @param {*} app
 */
function getInstance(app) {
    if (controlLibraryRouteInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        controlLibraryRouteInstance = new ControlLibraryRT(app);
    }
    return controlLibraryRouteInstance;
}

exports.getInstance = getInstance;
