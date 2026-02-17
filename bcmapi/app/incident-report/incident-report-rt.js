const INCIDENT_REPORT_BL        = require('./incident-report-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js')

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class IncidentReportRT {
    constructor(app) {
        this.app = app;
        this.IncidentReportBLObject = INCIDENT_REPORT_BL.getIncidentReportBLClassInstance();
        this.IncidentReportBLObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
  
        this.app.post('/business-continuity-management/incident-reports/download-incident-consolidated-reports',    TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.getIncidentConsolidatedReportData);
        this.app.post('/business-continuity-management/incident-reports/get-incidents-report-list',                 TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.getIncidentsReportList);
        this.app.post('/business-continuity-management/incident-reports/get-create-incident-info',                  TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.getIncidentReportInfo);
        this.app.post('/business-continuity-management/incident-reports/create-new-incident-report',                TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.createNewIncidentReport);
        this.app.post('/business-continuity-management/incident-reports/update-incident-report',                    TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.updateIncidentReport);
        this.app.post('/business-continuity-management/incident-reports/get-incident-report-data',                  TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.getIncidentReportData);
        this.app.post('/business-continuity-management/incident-reports/get-incident-action-trials',                TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.getIncidentActionTrails);
        this.app.post('/business-continuity-management/incident-reports/submit-incident-report-for-review',         TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.submitIncidentReportForReview);
        this.app.post('/business-continuity-management/incident-reports/review-incident-report',                    TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.reviewIncidentReport);
        this.app.post('/business-continuity-management/incident-reports/upload-incident-evidence',                  TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.uploadIncidentEvidence);
        this.app.post('/business-continuity-management/incident-reports/download-incident-evidence',                TOKEN_UPDATE_MIDDELWARE, this.IncidentReportBLObject.downloadIncidentEvidence);
        
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
    if(thisInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        thisInstance = new IncidentReportRT(app)
    }
    return thisInstance
}

exports.getInstance = getInstance;