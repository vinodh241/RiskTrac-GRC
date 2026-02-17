const SCHEDULE_ASSESSMENT_BL        = require('./schedule-assessment-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ScheduleAssessmentRT{
    constructor(app) {
        this.app = app;
        this.scheduleAssessmentBlObject = SCHEDULE_ASSESSMENT_BL.getScheduleAssessmentBLClassInstance();
        this.scheduleAssessmentBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {
        
        //Get Self Assessment By Schedule Assessment ID 
        this.app.post('/rcsa/scheduleassessment/get-self-assessment-summary-by-schedule-assessment-id-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getSelfAssessmentSummaryByScheduleAssessmentID);

        //Get Self Assessment Screen
        this.app.post('/rcsa/scheduleassessment/get-data-for-self-assessment-screen', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getDataForSelfAssessmentScreen);

        //Get Manage Self Assessment Screen
        this.app.post('/rcsa/scheduleassessment/get-data-for-manage-self-assessment-screen', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getDataForManageSelfAssessmentScreen);
        
        //Get Self Assessment Details By Schedule Inherent ID 
        this.app.post('/rcsa/scheduleassessment/get-self-assessment-details-by-schedule-inherent-id-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getSelfAssessmentDetailsByScheduleInherentID);

        //Get Schedule Assessment Cards
        this.app.post('/rcsa/scheduleassessment/get-all-schedule-assessment-cards-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getAllScheduleAssessmentCards);

        //Get Schedule Assessment By ID
        this.app.post('/rcsa/scheduleassessment/get-all-schedule-assessment-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getScheduleAssessmentByID);

        //Get Self Assessment By Status
        this.app.post('/rcsa/scheduleassessment/get-all-schedule-assessment-summary-by-status-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getSelfAssessmentSummaryByStatus);

        //Manage Schedule Assessment Details
        this.app.post('/rcsa/scheduleassessment/manage-schedule-assessment-details-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.manageScheduleAssessmentDetails);

        //Update Approved Schedule Inherent Risk Reviewer Details
        this.app.post('/rcsa/scheduleassessment/update-approved-schedule-inherent-risk-reviewer-details-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.updateApprovedScheduleInherentRiskReviewerDetails);

        //Update Rejected Schedule Inherent Risk Reviewer Details
        this.app.post('/rcsa/scheduleassessment/update-rejected-schedule-inherent-risk-reviewer-details-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.updateRejectedScheduleInherentRiskReviewerDetails);

        //Get Schedule Inherent Risk Action Trail
        this.app.post('/rcsa/scheduleassessment/get-schedule-inherent-risk-action-trail-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getScheduleInherentRiskActionTrail);
        
        //Get Action Responsible Person
        this.app.post('/rcsa/scheduleassessment/get-action-responsible-person-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getActionResponsiblePerson);

        //Get Residual Risk Response
        this.app.post('/rcsa/scheduleassessment/get-residual-risk-response-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getResidualRiskResponse);

        //Get Residual Risk Response Person
        this.app.post('/rcsa/scheduleassessment/get-residual-risk-responsible-person-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getResidualRiskResponsiblePerson);

        //Get Control Type
        this.app.post('/rcsa/scheduleassessment/get-control-type-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.getControlType);

        //Submit Self Assessment By Schedule Assessment
        this.app.post('/rcsa/scheduleassessment/submit-self-assessment-by-schedule-assessment', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.submitSelfAssessmentsByScheduleAssessment);

        //Upload RCSA
        this.app.post('/rcsa/scheduleassessment/upload-rcsa', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.uploadRCSAEvidence);

        //Download RCSA
        this.app.post('/rcsa/scheduleassessment/download-rcsa', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.downloadRCSAEvidence);

        //Delete RCSA file
        this.app.post('/rcsa/scheduleassessment/delete-rcsa', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.deleteRCSAEvidence);

        // add ad hoc Risk
        this.app.post('/rcsa/scheduleassessment/add-ad-hoc-risk-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleAssessmentBlObject.addaddhocrisk);
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
        thisInstance = new ScheduleAssessmentRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;