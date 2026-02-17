const SCHEDULE_BL        = require('./schedule-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');


var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ScheduleRT{
    constructor(app) {
        this.app = app;
        this.scheduleBlObject = SCHEDULE_BL.getScheduleBLClassInstance();
        this.scheduleBlObject.start();
    }/**
     * This function will be used to initialize controller specific operation
     */
    start() {
        //Get Schedule Period
        this.app.post('/rcsa/schedule/get-schedule-period-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getSchedulePeriod);

        //Get Data For Schedule Assessment Screen
        this.app.post('/rcsa/schedule/get-data-for-schedule-assessment-screen', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getDataForScheduleAssessmentScreen);

        //Get Data For Manage Schedule Assessment Screen
        this.app.post('/rcsa/schedule/get-data-for-manage-schedule-assessment-screen', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getDataForManageScheduleAssessmentScreen);

        //Get All Active Reviewer
        this.app.post('/rcsa/schedule/get-all-active-reviewer-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getAllActiveReviewer);

        //Get Reviewer By ID
        this.app.post('/rcsa/schedule/get-reviewer-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getReviewerByID);

        //Add Schedule Assessment
        this.app.post('/rcsa/schedule/add-schedule-assessment-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.addScheduleAssessment);

        //Update Schedule Assessment
        this.app.post('/rcsa/schedule/update-schedule-assessment-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.updateScheduleAssessment);

        //Update Schedule Assessment
        this.app.post('/rcsa/schedule/update-schedule-assessment-status-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.updateScheduleAssessmentStatus);

        //Get All Active Schedule
        this.app.post('/rcsa/schedule/get-all-active-schedule-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getAllActiveSchedule);

        //Get All Schedule
        this.app.post('/rcsa/schedule/get-all-schedule-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getAllSchedule);

        //Get Schedule By ID
        this.app.post('/rcsa/schedule/get-schedule-by-id-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getScheduleByID);

        //Get Schedule Assessment Years
        this.app.post('/rcsa/schedule/get-schedule-assessment-years-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getScheduleAssessmentYears);

        //Get Snapshot For InProgress Schedule Assessment
        this.app.post('/rcsa/schedule/get-snapshot-for-inprogress-schedule-assessment-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getSnapshotForInProgressScheduleAssessment);

        //Get Snapshot For InProgress Schedule Assessment Details
        this.app.post('/rcsa/schedule/get-snapshot-for-inprogress-schedule-assessment-details-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getSnapshotForInProgressScheduleAssessmentDetails);

        //Get In Progress Schedule Assessment For Dashboard
        this.app.post('/rcsa/schedule/get-inprogress-schedule-assessment-for-dashboard-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getInProgressScheduleAssessmentForDashboard);

        //Get Scheduled Action Plan Snapshot
        this.app.post('/rcsa/schedule/get-scheduled-action-plan-snapshot-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getScheduledActionPlanSnapshot);

        //Get Scheduled Action Plan Snapshot Details
        this.app.post('/rcsa/schedule/get-scheduled-action-plan-snapshot-details-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getScheduledActionPlanSnapshotDetails);

        //Get Completed Schedule Assessment For Dashboard
        this.app.post('/rcsa/schedule/get-completed-schedule-assessment-for-dashboard-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getCompletedScheduleAssessmentForDashboard);

        //Get All Active Action Plan Status
        this.app.post('/rcsa/schedule/get-all-active-action-plan-status-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getAllActiveActionPlanStatus);

        //Get All Active Control Testing Result
        this.app.post('/rcsa/schedule/get-all-active-control-testing-result-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getAllActiveControlTestingResult);

        //Get All Active Control Verification Closure
        this.app.post('/rcsa/schedule/get-all-active-control-verification-closure-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getAllActiveControlVerificationClosure);

        this.app.post('/rcsa/schedule/get-rcsa-master-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getRCSAMasterData);

        this.app.post('/rcsa/schedule/add-rcsa-master-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.addRCSAMasterData);

        this.app.post('/rcsa/schedule/get-reminder-email-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getReminderEmailData);

        this.app.post('/rcsa/schedule/add-bulk-inherent-risk', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.addBulkInherentRisk);

        this.app.post('/rcsa/schedule/get-risk-register-data', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getRiskRegisterData);

        this.app.post('/rcsa/schedule/add-corporate-objective', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.addCorporateObjective);

        this.app.post('/rcsa/schedule/update-corporate-objective', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.updateCorporateObjective);

        // New endpoints for Schedule RCSA - ALL vs Individual mode enhancement
        //Get Departments and Units for Schedule Assessment (Individual mode)
        this.app.post('/rcsa/schedule/get-departments-and-units-for-schedule', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getDepartmentsAndUnitsForSchedule);

        //Get Existing Scheduled Cycles for a given period
        this.app.post('/rcsa/schedule/get-existing-scheduled-cycles', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getExistingScheduledCycles);

        //Get Assessment Unit Mappings (for edit pre-selection)
        this.app.post('/rcsa/schedule/get-schedule-assessment-units', TOKEN_UPDATE_MIDDELWARE, this.scheduleBlObject.getScheduleAssessmentUnits);
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
        thisInstance = new ScheduleRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;