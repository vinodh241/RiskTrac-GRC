const USER_MANAGEMENT_BL        = require('./user-management-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class UserManagementRT {
    constructor(app) {
        this.app = app;
        this.userManagementBlObject = USER_MANAGEMENT_BL.getUserManagementBLClassInstance();
        this.userManagementBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/user-management/user-management/get-user-details-from-ad',  TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.getUserDetailsFromAD);
        this.app.post('/user-management/user-management/get-users',                 TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.getUsers);
        this.app.post('/user-management/user-management/delete-user',               TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.deleteUser);
        this.app.post('/user-management/user-management/get-assigned-user-info',    TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.getAssignedUserInfo);
        this.app.post('/user-management/user-management/add-assign-user',           TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.addAssignUser);
        this.app.post('/user-management/user-management/reset-password',            TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.resetPassword);
        this.app.post('/user-management/user-management/enable-disable-user',       TOKEN_UPDATE_MIDDELWARE,    this.userManagementBlObject.enableDisableUser);

        

        
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
        thisInstance = new UserManagementRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;