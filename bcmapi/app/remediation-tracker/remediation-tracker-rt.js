
const REMEDIATION_TRACKER_BL    = require('./remediation-tracker-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RemediationTrackerRT {
    constructor(app) {
        this.app = app;
        this.remediationTrackerBlObject = REMEDIATION_TRACKER_BL.getRemediationTrackerBLClassInstance();
        this.remediationTrackerBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/remediation-tracker/get-action-item-List',               TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.getActionItemList);
        this.app.post("/business-continuity-management/remediation-tracker/add-update-new-action-item",         TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.addUpdateNewActionItem);
        this.app.post("/business-continuity-management/remediation-tracker/get-action-item-data",               TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.getActionItemData);
        this.app.post("/business-continuity-management/remediation-tracker/request-action-item-extention",      TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.requestActionItemExtention);
        this.app.post("/business-continuity-management/remediation-tracker/download-action-item-attachment",    TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.downloadActionItemAttachment);
        this.app.post("/business-continuity-management/remediation-tracker/upload-action-item-attachment",      TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.uploadActionItemAttachment);
        this.app.post('/business-continuity-management/remediation-tracker/get-action-item-info',               TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.getActionItemInfo);
        this.app.post('/business-continuity-management/remediation-tracker/update-action-item',                 TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.updateActionItem);
        this.app.post("/business-continuity-management/remediation-tracker/delete-action-item-attachment",      TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.deleteActionItemAttachment);
        this.app.post("/business-continuity-management/remediation-tracker/save-action-item-details",           TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.saveActionItemDetails); 
        this.app.post("/business-continuity-management/remediation-tracker/submit-action-item-response",        TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.submitActionItemResponse);     
        this.app.post("/business-continuity-management/remediation-tracker/get-action-items-comments",          TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.getActionItemsComments);
        this.app.post("/business-continuity-management/remediation-tracker/review-action-item-response",        TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.reviewActionItemResponse);
        this.app.post("/business-continuity-management/remediation-tracker/delete-action-item",                 TOKEN_UPDATE_MIDDELWARE,    this.remediationTrackerBlObject.deleteActionItem);        
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
        thisInstance = new RemediationTrackerRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;