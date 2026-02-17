const COMPLIANCE_REVIEW_PLANS_BL    = require('./compliance-review-bl.js');
const CONSTANT_FILE_OBJ             = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE       = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ComplianceReviewRT {
    constructor(app) {
        this.app = app;
        this.complianceReviewBlObject = COMPLIANCE_REVIEW_PLANS_BL.getComplianceReviewBLClassInstance();
        this.complianceReviewBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        // this.app.post('/business-continuity-management/compliance-review/get-resource-requirement-info-list',    TOKEN_UPDATE_MIDDELWARE,    this.complianceReviewBlObject.getResourceRequirementInfoList);
        this.app.post('/business-continuity-management/compliance-review/get-compliance-reviews-list',              TOKEN_UPDATE_MIDDELWARE,    this.complianceReviewBlObject.getComplianceReviewsList);
        this.app.post('/business-continuity-management/compliance-review/get-compliance-reviews-info',              TOKEN_UPDATE_MIDDELWARE,    this.complianceReviewBlObject.getComplianceReviewsInfo);
        this.app.post('/business-continuity-management/compliance-review/view-compliance-review-dashboard',         TOKEN_UPDATE_MIDDELWARE,    this.complianceReviewBlObject.viewComplianceReviewDashboard);
        this.app.post('/business-continuity-management/compliance-review/add-new-compliance-review',                TOKEN_UPDATE_MIDDELWARE,    this.complianceReviewBlObject.addNewComplianceReview);
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
        thisInstance = new ComplianceReviewRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;