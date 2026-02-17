
const METRICS_LIBRARY_BL        = require('./metrics-library-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class MetricsLibraryRT {
    constructor(app) {
        this.app = app;
        this.metricsLibraryBlObject = METRICS_LIBRARY_BL.getMetricsLibraryBLClassInstance();
        this.metricsLibraryBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/master/metrics-library/get-metrics-master',          TOKEN_UPDATE_MIDDELWARE, this.metricsLibraryBlObject.getMetricsMaster);
        this.app.post('/business-continuity-management/master/metrics-library/get-metrics-master-info',     TOKEN_UPDATE_MIDDELWARE, this.metricsLibraryBlObject.getMetricsMasterInfo);
        this.app.post('/business-continuity-management/master/metrics-library/add-metric-master',           TOKEN_UPDATE_MIDDELWARE, this.metricsLibraryBlObject.addMetricMaster);
        this.app.post('/business-continuity-management/master/metrics-library/update-metric-master',        TOKEN_UPDATE_MIDDELWARE, this.metricsLibraryBlObject.updateMetricMaster);
        this.app.post('/business-continuity-management/master/metrics-library/delete-metric-master',        TOKEN_UPDATE_MIDDELWARE, this.metricsLibraryBlObject.deleteMetricMaster);
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
        thisInstance = new MetricsLibraryRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;