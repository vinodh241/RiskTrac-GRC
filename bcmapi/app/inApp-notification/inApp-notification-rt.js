const INAPP_NOTIFICATION_BL        = require('./inApp-notification-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InAppNotificationRT {
    constructor(app) {
        this.app = app;
        this.inAppNotificationBlObject = INAPP_NOTIFICATION_BL.getInAppNotificationBLClassInstance();
        this.inAppNotificationBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/business-continuity-management/inApp-notification/get-user-alerts',        TOKEN_UPDATE_MIDDELWARE, this.inAppNotificationBlObject.getUserAlerts);
        this.app.post('/business-continuity-management/inApp-notification/update-user-alerts',     TOKEN_UPDATE_MIDDELWARE, this.inAppNotificationBlObject.updateUserAlerts);
        this.app.post('/business-continuity-management/inApp-notification/delete-user-alerts',     TOKEN_UPDATE_MIDDELWARE, this.inAppNotificationBlObject.deleteUserAlerts);
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
        thisInstance = new InAppNotificationRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;