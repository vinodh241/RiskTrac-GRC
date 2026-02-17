const INHERENTRISK_BL        = require('./inherent-risk-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InherentRiskRT{
    constructor(app) {
        this.app = app;
        this.inherentRiskBlObject = INHERENTRISK_BL.getInherentRiskBLClassInstance();
        this.inherentRiskBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {
        
        //Get All records
        this.app.post('/rcsa/inherentrisk/get-all-inherentrisk-data', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.getAllInherentRisk);

        //Get All active records
        this.app.post('/rcsa/inherentrisk/get-all-active-inherentrisk-data', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.getAllActiveInherentRisk);

        //Get records by Id
        this.app.post('/rcsa/inherentrisk/get-inherentrisk-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.getInherentRiskByID);
        
        //Add a new record
        this.app.post('/rcsa/inherentrisk/add-inherentrisk-data', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.addInherentRisk);
        
        //Update an existing record
        this.app.post('/rcsa/inherentrisk/update-inherentrisk-data', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.updateInherentRisk);
        
        //Update Status
        this.app.post('/rcsa/inherentrisk/update-inherentrisk-status', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.updateInherentRiskStatus);

        //Get Inherent Risk Screen
        this.app.post('/rcsa/inherentrisk/get-data-for-manage-inherentrisk-screen', TOKEN_UPDATE_MIDDELWARE, this.inherentRiskBlObject.getDataForManageInherentRiskScreen);
        
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
        thisInstance = new InherentRiskRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;