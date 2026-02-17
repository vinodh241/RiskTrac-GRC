const UNIT_BL        = require('./unit-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class UnitRT{
    constructor(app) {
        this.app = app;
        this.unitBlObject = UNIT_BL.getUnitBLClassInstance();
        this.unitBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {
        
        //Get All records
        this.app.post('/rcsa/unit/get-all-active-unit-by-groupid-data', TOKEN_UPDATE_MIDDELWARE, this.unitBlObject.getAllActiveUnitByGroupID);

        //Get All active records
        this.app.post('/rcsa/unit/get-all-active-unit-data', TOKEN_UPDATE_MIDDELWARE, this.unitBlObject.getAllActiveUnit);

        //Get records by Id
        this.app.post('/rcsa/unit/get-unit-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.unitBlObject.getUnitByID);
        
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
        thisInstance = new UnitRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;