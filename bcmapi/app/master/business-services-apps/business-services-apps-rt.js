const BUSINESS_SERVICES_APPS_BL = require('./business-services-apps-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BusinessServicesAndAppsRT {
    constructor(app) {
        this.app = app;
        this.businessServicesAppsBlObject = BUSINESS_SERVICES_APPS_BL.getBusinessServicesAndAppsBLClassInstance();
        this.businessServicesAppsBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        this.app.post('/business-continuity-management/master/get-businessServicesAndApps-master',                              TOKEN_UPDATE_MIDDELWARE,    this.businessServicesAppsBlObject.getBusinessServicesAppsMaster);
        this.app.post('/business-continuity-management/master/get-businessServicesAndApps-master-info',                         TOKEN_UPDATE_MIDDELWARE,    this.businessServicesAppsBlObject.getBusinessServicesAppsMasterInfo);
        this.app.post('/business-continuity-management/master/businessServicesAndApps/add-businessServicesAndApps-master',      TOKEN_UPDATE_MIDDELWARE,    this.businessServicesAppsBlObject.addBusinessServicesAppsMaster);
        this.app.post('/business-continuity-management/master/businessServicesAndApps/update-businessServicesAndApps-master',   TOKEN_UPDATE_MIDDELWARE,    this.businessServicesAppsBlObject.updateBusinessServicesAppsMaster);
        this.app.post('/business-continuity-management/master/businessServicesAndApps/delete-businessServicesApps-master',      TOKEN_UPDATE_MIDDELWARE,    this.businessServicesAppsBlObject.deleteBusinessServicesAppsMaster);
        this.app.post('/business-continuity-management/master/businessServicesAndApps/add-bulk-business-services-master',       TOKEN_UPDATE_MIDDELWARE,    this.businessServicesAppsBlObject.addBulkBusinessServicesMaster); 
         
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
        thisInstance = new BusinessServicesAndAppsRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;