const AUTH_BL = require("./auth-bl.js");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class AuthRt {
  constructor(app) {
    this.app = app;
    this.authBlObject = AUTH_BL.getAuthBlClassInstance();
    this.authBlObject.start();
  }

  /**
   * This function will be used to initialize controller specific operation
   */
  start() {
    this.app.post("/auth-management/auth/get-Key", this.authBlObject.getPublicKey);
    this.app.post("/auth-management/auth/login", this.authBlObject.updateUserLogin);
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
    thisInstance = new AuthRt(app);
  }
  return thisInstance;
}

exports.getInstance = getInstance;
