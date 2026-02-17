const USER_MANAGEMENT_BL = require("./user-management-bl.js");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class UserManagementRT {
  constructor(app) {
    this.app = app;
    this.userManagementBlObject =
      USER_MANAGEMENT_BL.getUserManagementBLClassInstance();
    this.userManagementBlObject.start();
  }

  /**
   * This function will be used to initialize controller specific operation
   */
  start() {

    this.app.post("/auth-management/user-management/get-user-details-from-ad", this.userManagementBlObject.getUserDetailsFromAD);
  }

  /**
   * This function will be used to stop service of controller in case any.
   */
  stop() { }
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
