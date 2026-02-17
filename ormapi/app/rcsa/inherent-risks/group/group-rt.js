const GROUP_BL        = require('./group-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class GroupRT{
    constructor(app) {
        this.app = app;
        this.groupBlObject = GROUP_BL.getGroupBLClassInstance();
        this.groupBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All active records
        this.app.post('/rcsa/group/get-all-active-group-data', TOKEN_UPDATE_MIDDELWARE, this.groupBlObject.getAllActiveGroup);

        //Get records by Id
        this.app.post('/rcsa/group/get-group-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.groupBlObject.getGroupByID);
        
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
        thisInstance = new GroupRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;