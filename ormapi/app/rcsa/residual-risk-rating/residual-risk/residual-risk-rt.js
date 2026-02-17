const RESIDUAL_RISK_RATING_BL        = require('./residual-risk-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ResidualRiskRT {
    constructor(app) {        
        this.app = app;
        this.residualRiskBlObject = RESIDUAL_RISK_RATING_BL.getResidualRiskBLClassInstance();
        this.residualRiskBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        //Get All records
        this.app.post('/rcsa/residual-risk/get-all-residualrisk-data', TOKEN_UPDATE_MIDDELWARE, this.residualRiskBlObject.getAllResidualRisk);

        //Get All active records
        this.app.post('/rcsa/residual-risk/get-all-active-residualrisk-data', TOKEN_UPDATE_MIDDELWARE, this.residualRiskBlObject.getAllActiveResidualRisk);

        //Get records by Id
        this.app.post('/rcsa/residual-risk/get-residualrisk-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.residualRiskBlObject.getResidualRiskByID);
        
        //Add a new record
        this.app.post('/rcsa/residual-risk/add-residualrisk-data', TOKEN_UPDATE_MIDDELWARE, this.residualRiskBlObject.addResidualRisk);
        
        //Update an existing record
        this.app.post('/rcsa/residual-risk/update-residualrisk-data', TOKEN_UPDATE_MIDDELWARE, this.residualRiskBlObject.updateResidualRisk);
        
        //Update Status
        this.app.post('/rcsa/residual-risk/update-residualrisk-status', TOKEN_UPDATE_MIDDELWARE, this.residualRiskBlObject.updateResidualRiskStatus);
        
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
        thisInstance = new ResidualRiskRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;