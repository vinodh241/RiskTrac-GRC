
const BCMS_TESTING_BL           = require('./bcms-testing-bl');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BCMSTestingRT {
    constructor(app) {
        this.app = app;
        this.bcmsTestingBlObject = BCMS_TESTING_BL.getBCMSTesingBLClassInstance();
        this.bcmsTestingBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/bcms-testing/get-bcms-tests-list',           TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getBcmsTestsList);
        this.app.post('/business-continuity-management/bcms-testing/get-bcms-add-test-info',        TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getBcmsAddTestInfo);
        this.app.post('/business-continuity-management/bcms-testing/add-bcms-test',                 TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.addBcmsTest);
        this.app.post('/business-continuity-management/bcms-testing/update-bcms-test',              TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.updateBcmsTest);
        this.app.post('/business-continuity-management/bcms-testing/get-bcms-test-data',            TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getBcmsTestData);
        this.app.post('/business-continuity-management/bcms-testing/update-bcms-test-status',       TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.updateBcmsTestStatus);
        this.app.post('/business-continuity-management/bcms-testing/get-participant-report-data',   TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getParticipantReportData);
        this.app.post('/business-continuity-management/bcms-testing/save-participant-report',       TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.saveParticipantReport);
        this.app.post('/business-continuity-management/bcms-testing/submit-participant-report',     TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.submitParticipantReport);
        this.app.post('/business-continuity-management/bcms-testing/review-participant-report',     TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.reviewParticipantReport);
        this.app.post('/business-continuity-management/bcms-testing/get-observer-report-data',      TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getObserverReportData);
        this.app.post('/business-continuity-management/bcms-testing/save-observer-report',          TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.saveObserverReport);
        this.app.post('/business-continuity-management/bcms-testing/submit-observer-report',        TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.submitObserverReport);
        this.app.post('/business-continuity-management/bcms-testing/review-observer-report',        TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.reviewObserverReport);
        this.app.post('/business-continuity-management/bcms-testing/get-publish-report-data',       TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getPublishReportData);
        this.app.post('/business-continuity-management/bcms-testing/save-publish-report-data',      TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.savePublishReportData);
        this.app.post('/business-continuity-management/bcms-testing/publish-test-report',           TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.publishTestReport);
        this.app.post('/business-continuity-management/bcms-testing/validate-bcms-time-duration',   TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.validateBcmsTimeDuration);
        this.app.post('/business-continuity-management/bcms-testing/download-test-export-draft',    TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.downloadTestExportDraft);
        this.app.post('/business-continuity-management/bcms-testing/get-bcms-review-comments',      TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.getBcmsReviewComments);
        this.app.post('/business-continuity-management/bcms-testing/upload-bcmstest-evidence',      TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.uploadTestEvidence);
        this.app.post('/business-continuity-management/bcms-testing/download-bcmstest-evidence',    TOKEN_UPDATE_MIDDELWARE, this.bcmsTestingBlObject.downloadTestEvidence);
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
        thisInstance = new BCMSTestingRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;