const DASHBOARD_BL = require('./dashboard-bl');
const CONSTANT_FILE_OBJ = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE = require('../../utility/middleware/validate-update-token.js');

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
        // Dashboard APIs
        this.app.post('/operational-risk-management/dashbaord/incident/get-dashboard-incident', TOKEN_UPDATE_MIDDELWARE, this.dashboardBlObject.getDashboardIncident);
        this.app.post("/operational-risk-management/dashboard/get-dashboard-kri", TOKEN_UPDATE_MIDDELWARE, this.dashboardBlObject.getDashboardKRI);
        this.app.post('/operational-risk-management/dashboard/get-dashboard-risk-appetite', TOKEN_UPDATE_MIDDELWARE, this.dashboardBlObject.getDashboardRiskAppetite);
        this.app.post('/operational-risk-management/dashboard/get-dashboard-rcsa', TOKEN_UPDATE_MIDDELWARE, this.dashboardBlObject.getDashboardRCSA);
        this.app.post('/operational-risk-management/dashbaord/overall/get-overall-dashboard', TOKEN_UPDATE_MIDDELWARE, this.dashboardBlObject.getOverallDashboardData);
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