const RISK_ASSESSMENT_BL = require('./risk-assessment-bl.js');
const CONSTANT_FILE_OBJ = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskAssessmentRT {
    constructor(app) {
        this.app = app;
        this.riskAssessmentBlObject = RISK_ASSESSMENT_BL.getRiskAssessmentBLClassInstance();
        this.riskAssessmentBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/operational-risk-management/risk-assessment/get-info-schedule-risk-assessment', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getInfoForScheduleRiskAssessment);
        this.app.post('/operational-risk-management/risk-assessment/set-risk-assessment', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.setRiskAssessment);
        this.app.post('/operational-risk-management/risk-assessment/get-risk-assessments', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getRiskAssessment);
        this.app.post('/operational-risk-management/risk-assessment/get-risk-metrics', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getRiskMetrics);
        this.app.post('/operational-risk-management/risk-assessment/get-risk-metrics-maker', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getRiskMetricsMaker);
        this.app.post('/operational-risk-management/risk-assessment/set-risk-metrics-draft', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.setRiskMetricsDraft);
        this.app.post('/operational-risk-management/risk-assessment/set-risk-metrics-submit', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.setRiskMetricsSubmit);
        this.app.post('/operational-risk-management/risk-assessment/set-risk-metrics-review-draft', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.setRiskMetricReview);
        this.app.post('/operational-risk-management/risk-assessment/set-risk-metrics-review-submit', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.setRiskMetricsReview);
        this.app.post('/operational-risk-management/risk-assessment/get-risk-assessment-details', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getRiskAsessmentDetails);
        this.app.post('/operational-risk-management/risk-assessment/upload-RiskUnitMaker-evidence', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.uploadRiskUnitMakerEvidence);
        this.app.post('/operational-risk-management/risk-assessment/delete-RiskUnitMaker-evidence', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.deleteRiskUnitMakerEvidence);
        this.app.post('/operational-risk-management/risk-assessment/download-RiskUnitMaker-evidence', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.downloadRiskUnitMakerEvidence);
        this.app.post('/operational-risk-management/risk-assessment/get-Email-Reminder-Data-RA', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getEmailReminderDataRA);
        this.app.post('/operational-risk-management/risk-assessment/get-risk-assessments-view-submitted', TOKEN_UPDATE_MIDDELWARE, this.riskAssessmentBlObject.getRiskAssessmentViewSubmitted);

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
        thisInstance = new RiskAssessmentRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;