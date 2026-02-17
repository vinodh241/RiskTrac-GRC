const REPORT_BL = require("./report-bl");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const TOKEN_UPDATE_MIDDELWARE = require("../../utility/middleware/validate-update-token.js");

let thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ReportRT {
  constructor(app) {
    this.app = app;
    this.reportBlObject = REPORT_BL.getReportBLClassInstance();
    this.reportBlObject.start();
  }

  /**
   * This function will be used to initialize controller specific operation
   */
  start() {
    this.app.post('/operational-risk-management/report/get-report-risk-appetite', TOKEN_UPDATE_MIDDELWARE, this.reportBlObject.getReportRiskAppetite);
    this.app.post('/operational-risk-management/report/get-report-incident', TOKEN_UPDATE_MIDDELWARE, this.reportBlObject.getReportIncident);
    this.app.post('/operational-risk-management/report/get-report-kri', TOKEN_UPDATE_MIDDELWARE, this.reportBlObject.getReportKRI);
    this.app.post('/operational-risk-management/report/get-report-rcsa', TOKEN_UPDATE_MIDDELWARE, this.reportBlObject.getReportRCSA);
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
    thisInstance = new ReportRT(app);
  }
  return thisInstance;
}

exports.getInstance = getInstance;
