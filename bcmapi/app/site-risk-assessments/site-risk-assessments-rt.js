
const SITE_RISK_ASSESSMENTS_BL  = require('./site-risk-assessments-bl');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class SiteRiskAssessmentsRT {
    constructor(app) {
        this.app = app;
        this.siteRiskAssessmentsBlObject = SITE_RISK_ASSESSMENTS_BL.getSiteRiskAssessmentsBLClassInstance();
        this.siteRiskAssessmentsBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/site-risk-assessments/get-risk-data',                            TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getRiskData);
        this.app.post('/business-continuity-management/site-risk-assessments/save-risk-response',                       TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.saveRiskResponse);
        this.app.post('/business-continuity-management/site-risk-assessments/submit-risk-response',                     TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.submitRiskResponse);
        this.app.post('/business-continuity-management/site-risk-assessments/get-site-risk-assessments-list',           TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getSiteRiskAssessmentsList);
        this.app.post('/business-continuity-management/site-risk-assessments/get-site-risk-assessments-info',           TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getSiteRiskAssessmentsInfo);
        this.app.post('/business-continuity-management/site-risk-assessments/add-site-risk-assessment',                 TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.addSiteRiskAssessment);
        this.app.post('/business-continuity-management/site-risk-assessments/update-site-risk-assessment',              TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.updateSiteRiskAssessment);
        this.app.post('/business-continuity-management/site-risk-assessments/delete-site-risk-assessment',              TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.deleteSiteRiskAssessment);
        this.app.post('/business-continuity-management/site-risk-assessments/add-new-custom-threat',                    TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.addNewCustomThreat);
        this.app.post('/business-continuity-management/site-risk-assessments/update-new-custom-threat',                 TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.updateNewCustomThreat); 
        this.app.post('/business-continuity-management/site-risk-assessments/get-site-risk-assessments-details',        TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getSiteRiskAssessmentsDetails);
        this.app.post('/business-continuity-management/site-risk-assessments/review-risk-response',                     TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.reviewRiskResponse);
        this.app.post('/business-continuity-management/site-risk-assessments/submit-review-risk-response',              TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.submitReviewRiskResponse);
        this.app.post('/business-continuity-management/site-risk-assessments/get-risk-assessment-action-trail',         TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getRiskAssessmentActionTrail);
        this.app.post('/business-continuity-management/site-risk-assessments/get-site-assessments-for-report',          TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getSiteRiskAssessmentsForReport);
        this.app.post('/business-continuity-management/site-risk-assessments/get-overall-risk-rating',                  TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getOverAllRiskRating);
        this.app.post('/business-continuity-management/site-risk-assessments/get-site-risk-assessments-draft-report',   TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.getSiteRiskAssessmentsDraftReport);
        this.app.post('/business-continuity-management/site-risk-assessments/delete-custom-threat',                     TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.deleteCustomThreat); 
        this.app.post('/business-continuity-management/site-risk-assessments/publish-site-assessment',                  TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.publishSiteAssessment);
        this.app.post('/business-continuity-management/site-risk-assessments/upload-risk-evidence',                     TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.uploadRiskEvidence);
        this.app.post('/business-continuity-management/site-risk-assessments/download-risk-evidence',                   TOKEN_UPDATE_MIDDELWARE,    this.siteRiskAssessmentsBlObject.downloadRiskEvidence);
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
        thisInstance = new SiteRiskAssessmentsRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;