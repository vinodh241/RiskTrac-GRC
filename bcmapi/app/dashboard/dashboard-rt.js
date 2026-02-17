
const DASHBOARD_BL              = require('./dashboard-bl');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class DashboardRT {
    constructor(app) {
        this.app = app;
         this.dashboardBlObject = DASHBOARD_BL.getDashboardBLClassInstance();
         this.dashboardBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/dashboard/get-global-dashboard-data',  TOKEN_UPDATE_MIDDELWARE, this.dashboardBlObject.getGlobalDashboardData);
       
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
        thisInstance = new DashboardRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;