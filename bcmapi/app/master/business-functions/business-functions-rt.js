const BUSINESS_FUNCTION_BL      = require('./business-functions-bl');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BusinessFunctionRT {
    constructor(app) {
        this.app = app;
        this.businessFunctionBlObject = BUSINESS_FUNCTION_BL.getBusinessFunctionsBLClassInstance();
        this.businessFunctionBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/bcm/business-function-master/get-business-function-master',         TOKEN_UPDATE_MIDDELWARE,     this.businessFunctionBlObject.getBusinessFunctionsMaster);
        this.app.post('/bcm/business-function-master/add-business-functions-master',        TOKEN_UPDATE_MIDDELWARE,     this.businessFunctionBlObject.addBusinessFunctionsMaster);
        this.app.post('/bcm/business-function-master/get-business-function-master-info',    TOKEN_UPDATE_MIDDELWARE,     this.businessFunctionBlObject.getBusinessFunctionMasterInfo);
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
        thisInstance = new BusinessFunctionRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;