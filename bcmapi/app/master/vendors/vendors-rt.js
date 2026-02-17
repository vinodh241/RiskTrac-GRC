const VENDOR_BL                 = require('./vendors-bl');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class VendorRT {
    constructor(app) {
        this.app = app;
        this.vendorBlObject = VENDOR_BL.getVendorBLClassInstance();
        this.vendorBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/bcm/vendor-master-page/get-vendor-details',                 TOKEN_UPDATE_MIDDELWARE, this.vendorBlObject.getVendorDetails);
        this.app.post('/bcm/vendor-master-page/add-vendor-master',                  TOKEN_UPDATE_MIDDELWARE, this.vendorBlObject.addVendorMaster);  
        this.app.post('/bcm/vendor-master-page/get-application-support-details',    TOKEN_UPDATE_MIDDELWARE, this.vendorBlObject.getApplicationSupportDetails);   
        this.app.post('/bcm/vendor-master-page/update-vendor-master',               TOKEN_UPDATE_MIDDELWARE, this.vendorBlObject.updateVendorMaster);     
        
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
        thisInstance = new VendorRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;