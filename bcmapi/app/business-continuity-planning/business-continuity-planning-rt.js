const BUSINESS_CONTINUITY_PLANS_BL  = require('./business-continuity-planning-bl.js');
const CONSTANT_FILE_OBJ             = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE       = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BusinessContinuityPlansRT {
    constructor(app) {
        this.app = app;
        this.businessContinuityPlansBlObject = BUSINESS_CONTINUITY_PLANS_BL.getBusinessContinuityPlansBLClassInstance();
        this.businessContinuityPlansBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/business-continuity-management/business-continuity-planning/get-business-continuity-plans-list',    TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBusinessContinuityPlansList);
        this.app.post('/business-continuity-management/business-continuity-planning/get-initiate-review',                   TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getInitiateReview);  
        this.app.post('/business-continuity-management/business-continuity-planning/initiate-review',                       TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.initiateReview);        
        this.app.post('/business-continuity-management/business-continuity-planning/get-business-process-details',          TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBusinessProcessDetails);
        this.app.post('/business-continuity-management/business-continuity-planning/get-business-process-info-list',        TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBusinessProcessInfoList);
        this.app.post('/business-continuity-management/business-continuity-planning/get-impact-assessment-details',         TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getImpactAssessmentDetails);
        this.app.post('/business-continuity-management/business-continuity-planning/get-resource-requirement-details',      TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getResourceRequirementDetails);
        this.app.post('/business-continuity-management/business-continuity-planning/get-recovery-process-details',          TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getRecoveryProcessDetails);
        this.app.post('/business-continuity-management/business-continuity-planning/save-process-activity-details',         TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveProcessActivityDetails);   
        this.app.post('/business-continuity-management/business-continuity-planning/save-impact-assessmentdetails',         TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveImpactAssessmentDetails);
        this.app.post('/business-continuity-management/business-continuity-planning/save-resource-requirements-details',    TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveResourceRequirementsDetails); 
        this.app.post('/business-continuity-management/business-continuity-planning/save-recovery-process-details',         TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveRecoveryProcessDetails);  
        this.app.post('/business-continuity-management/business-continuity-plans/get-business-profile-questions',           TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBusinessProfileQuestions);
        this.app.post('/business-continuity-management/business-continuity-plans/save-business-function-profile',           TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveBusinessFunctionProfile);
        this.app.post('/business-continuity-management/business-continuity-plans/get-business-continuity-plans-review-list',TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBusinessContinuityPlansReviewList);
        this.app.post('/business-continuity-management/business-continuity-plans/get-dependencies-info',                    TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getDependenciesInfo);
        this.app.post('/business-continuity-management/business-continuity-plans/save-dependencies',                        TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveDependencies);
        this.app.post('/business-continuity-management/business-continuity-plans/get-risk-mitigation-info',                 TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getRiskMitigationInfo);
        this.app.post('/business-continuity-management/business-continuity-plans/get-overall-risk-rating',                  TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getOverAllRiskRating);
        this.app.post('/business-continuity-management/business-continuity-plans/save-risk-mitigation',                     TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveRiskMitigation);
        this.app.post('/business-continuity-management/business-continuity-plans/get-staff-contact-info',                   TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getStaffContactInfo);
        this.app.post('/business-continuity-management/business-continuity-plans/save-staff-contact',                       TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.saveStaffContactDetails);
        this.app.post('/business-continuity-management/business-continuity-plans/get-complete-BCP-details',                 TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getCompleteBCPDetails);
        this.app.post('/business-continuity-management/business-continuity-planning/submit-review',                         TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.submitReview);
        this.app.post('/business-continuity-management/business-continuity-planning/get-review-comments',                   TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getReviewComments);
        this.app.post('/business-continuity-management/business-continuity-planning/publish-BCP',                           TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.publishBCP);
        this.app.post('/business-continuity-management/business-continuity-planning/get-bcp-consolidated-report',           TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBCPConsolidatedReport);
        this.app.post('/business-continuity-management/business-continuity-planning/get-complete-bcp-draft-report',         TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBCPDraftResponse);
        this.app.post('/business-continuity-management/business-continuity-planning/get-bia-rating-master-data',           TOKEN_UPDATE_MIDDELWARE,    this.businessContinuityPlansBlObject.getBIARatingMasterData);
        
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
        thisInstance = new BusinessContinuityPlansRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;