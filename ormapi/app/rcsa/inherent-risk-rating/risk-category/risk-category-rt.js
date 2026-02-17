const RISK_CATEGORY_BL        = require('./risk-category-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskCategoryRT{
    constructor(app) {
        this.app = app;
        this.riskcategoryBlObject = RISK_CATEGORY_BL.getRiskCategoryBLClassInstance();
        this.riskcategoryBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {
        
        //Get All records
        this.app.post('/rcsa/risk-category/get-all-riskcategory-data', TOKEN_UPDATE_MIDDELWARE, this.riskcategoryBlObject.getAllRiskCategory);

        //Get All active records
        this.app.post('/rcsa/risk-category/get-all-active-riskcategory-data', TOKEN_UPDATE_MIDDELWARE, this.riskcategoryBlObject.getAllActiveRiskCategory);

        //Get records by Id
        this.app.post('/rcsa/risk-category/get-riskcategory-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.riskcategoryBlObject.getRiskCategoryByID);
        
        //Add a new record
        this.app.post('/rcsa/risk-category/add-riskcategory-data', TOKEN_UPDATE_MIDDELWARE, this.riskcategoryBlObject.addRiskCategory);
        
        //Update an existing record
        this.app.post('/rcsa/risk-category/update-riskcategory-data', TOKEN_UPDATE_MIDDELWARE, this.riskcategoryBlObject.updateRiskCategory);
        
        //Update Status
        this.app.post('/rcsa/risk-category/update-riskcategory-status', TOKEN_UPDATE_MIDDELWARE, this.riskcategoryBlObject.updateRiskCategoryStatus);
        
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
        thisInstance = new RiskCategoryRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;