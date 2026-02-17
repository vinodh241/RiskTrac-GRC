const MESSAGE_FILE_OBJ = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const DASHBOARD_DB = require("../../data-access/dashboard-db.js");
const { logger } = require("../../utility/log-manager/log-manager.js");
const RISK_METRIC_LEVELS_DB = require('../../data-access/risk-metric-levels-db.js');
const INAPP_NOTIFICATION_DB = require('../../data-access/inApp-notification-db.js');

var dashboardBLClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var dashboardDb = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskMetricLevelsDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class DashboardBl {
  constructor() {
    dashboardDb = new DASHBOARD_DB();
    riskMetricLevelsDbObject = new RISK_METRIC_LEVELS_DB();
    inAppNotificationDbObject = new INAPP_NOTIFICATION_DB();
  }

  start() { }

  async getDashboardKRI(request, response) {
    try {
      var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let KRI_Dashboard_Data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      refreshedToken = request.body.refreshedToken;
      userIdFromToken = request.body.userIdFromToken;
      userNameFromToken = request.body.userNameFromToken;
      accountGUIDFromToken = request.body.accountGUIDFromToken;
      // userIdFromToken         ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
      // userNameFromToken       =   'kashish.sharma@secureyes.net'

      logger.log("info", "User Id : " + userIdFromToken + " : DashboardBL : getReportKRI : Execution started.");

      const KRI_DASHBOARD_DB_RESPONSE = await dashboardDb.getDashboardKRI(userIdFromToken, userNameFromToken, accountGUIDFromToken);


      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_DASHBOARD_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_DASHBOARD_DB_RESPONSE) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : KRI list db response is undefined or null.");
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (KRI_DASHBOARD_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : Error details :" + KRI_DASHBOARD_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (KRI_DASHBOARD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_DASHBOARD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : Error details : " + KRI_DASHBOARD_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (KRI_DASHBOARD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_DASHBOARD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && KRI_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log("info", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : No Record in data base");
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, KRI_DASHBOARD_DB_RESPONSE));
      }
      /**
       * Formating resultset provided by DB :END.
       */
      const KRI_DATA = KRI_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]
      const KRI_COLOR_Data = KRI_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]
      const REPORTING_FREQUENCY_DATA = KRI_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]

      KRI_Dashboard_Data = await formatKRIData("KRIData", KRI_DATA, KRI_COLOR_Data, REPORTING_FREQUENCY_DATA, userIdFromToken);

      // Checking for null or undefined of formatted resultset data
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_Dashboard_Data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_Dashboard_Data) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : KRI_DASHBOARD_DB_RESPONSE is undefined or null.");
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      logger.log("info", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : Get Reports Dashboard Data successfully.");
      // logger.log("info", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : KRI_DASHBOARD_DB_RESPONSE " + JSON.stringify(KRI_Dashboard_Data || null));
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, KRI_Dashboard_Data));
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : getDashboardKRI : Execution end. : Got unhandled error. : Error Detail : " + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * Get Incident Dashboard details
   * @param {*} request
   * @param {*} response
   * @returns
   */
  async getDashboardIncident(request, response) {
    try {
      var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      // var userIdFromToken     = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'; //CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      // var userNameFromToken   = 'naganandan.p@secureyes.net';//CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let totalIncidents = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      refreshedToken = request.body.refreshedToken;
      userIdFromToken = request.body.userIdFromToken;
      userNameFromToken = request.body.userNameFromToken;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      logger.log("info", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution started.");

      const INCIDENT_LIST_DB_RESPONSE = await dashboardDb.getIncidentDashboardData(userIdFromToken, userNameFromToken, accountGUIDFromToken);
      // logger.log("info", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : INCIDENT_LIST_DB_RESPONSE " + JSON.stringify(INCIDENT_LIST_DB_RESPONSE || null));
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == INCIDENT_LIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == INCIDENT_LIST_DB_RESPONSE) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution end. : Incident list db response is undefined or null.");
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (INCIDENT_LIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution end. : Error details :" + INCIDENT_LIST_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (INCIDENT_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && INCIDENT_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log("error", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution end. : Error details : " + RiskAppetite_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (INCIDENT_LIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && INCIDENT_LIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && INCIDENT_LIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log("info", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution end. : No Record in data base");
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, INCIDENT_LIST_DB_RESPONSE));
      }

      /**
       * Formating resultset provided by DB :START.
       *
       */
      totalIncidents = INCIDENT_LIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

      logger.log("info", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution end. : Get Incident Dashboard List successfully.");
      // logger.log("info", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : totalIncidents " + JSON.stringify(totalIncidents || null));
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, totalIncidents));
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : DashboardBl : getDashboardIncident : Execution end. : Got unhandled error. : Error Detail : " + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  async getDashboardRiskAppetite(request, response) {
    try {
      var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let RA_DATA = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let RA_Dashboard_DATA = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let RA_COLOR_DATA = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      refreshedToken = request.body.refreshedToken;
      userIdFromToken = request.body.userIdFromToken;
      userNameFromToken = request.body.userNameFromToken;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution started.');

      const RiskAppetite_DB_RESPONSE = await dashboardDb.getDashboardRiskAppetite(userIdFromToken, userNameFromToken, accountGUIDFromToken);
      // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : RiskAppetite_DB_RESPONSE ' + JSON.stringify(RiskAppetite_DB_RESPONSE || null));


      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RiskAppetite_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RiskAppetite_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (RiskAppetite_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : Error details :' + RiskAppetite_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (RiskAppetite_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RiskAppetite_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : Error details : ' + RiskAppetite_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (RiskAppetite_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RiskAppetite_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RiskAppetite_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, RiskAppetite_DB_RESPONSE));
      }

      const GET_RISK_METRIC_RESPONSE = await riskMetricLevelsDbObject.getRiskMetricLevels(userIdFromToken, userNameFromToken, accountGUIDFromToken);
      // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : GET_RISK_METRIC_RESPONSE ' + JSON.stringify(GET_RISK_METRIC_RESPONSE || null));

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_METRIC_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_METRIC_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : GET_RISK_METRIC_RESPONSE is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      /**
      * Formating resultset provided by DB :START.
      *            
      */
      RA_DATA = RiskAppetite_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
      RA_COLOR_DATA = GET_RISK_METRIC_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
      RA_Dashboard_DATA = await formatgetRiskAppetiteData(RA_DATA, RA_COLOR_DATA, userIdFromToken);
      /**
      * Formating resultset provided by DB :END.
      */
      //Checking for null or undefined of formatted resultset data
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RA_Dashboard_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RA_Dashboard_DATA) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : RA_Dashboard_DATA is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
    
      logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : Get RiskAppetite Dashboard List successfully.');
      // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : RA_Dashboard_DATA ' + JSON.stringify(RA_Dashboard_DATA || null));
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, RA_Dashboard_DATA));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  async getDashboardRCSA(request, response) {
    try {
      var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      refreshedToken = request.body.refreshedToken;
      userIdFromToken = request.body.userIdFromToken;
      userNameFromToken = request.body.userNameFromToken;
      accountGUIDFromToken = request.body.accountGUIDFromToken;
      // userIdFromToken        ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
      // userNameFromToken      ='kashish.sharma@secureyes.net'

      logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRCSA : Execution started.');

      const RCSA_DB_RESPONSE = await dashboardDb.getDashboardRCSA(userIdFromToken, userNameFromToken, accountGUIDFromToken);
      // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRCSA : RCSA_DB_RESPONSE ' + JSON.stringify(RCSA_DB_RESPONSE || null));

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRCSA : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (RCSA_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRCSA : Execution end. : Error details :' + RCSA_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (RCSA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRCSA : Execution end. : Error details : ' + RCSA_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (RCSA_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RCSA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRCSA : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, RCSA_DB_RESPONSE));
      }

      /**
      * Formating resultset provided by DB :START.
      *            
      */
      // let RCSA_Dashboard_DATA = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      let RCSAData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      RCSAData = RCSA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
      // RCSA_Dashboard_DATA = await formatData("RCSAData", RCSA_DATA, userIdFromToken);

      let OverallInherentRiskRating_MasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      OverallInherentRiskRating_MasterData = RCSA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
      // OverallInherentRiskRating_MASTERDATA = await formatData("OverallInherentRiskRating", OverallInherentRiskRating, userIdFromToken);

      let OverallControlEnvironmentRating_MasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      OverallControlEnvironmentRating_MasterData = RCSA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
      // OverallControlEnvironmentRating_MASTERDATA = await formatData("OverallControlEnvironmentRating", OverallControlEnvironmentRating, userIdFromToken);

      let ResidualRisk_MasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      ResidualRisk_MasterData = RCSA_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
      // ResidualRisk_MASTERDATA = await formatData("OverallControlEnvironmentRating", OverallControlEnvironmentRating, userIdFromToken);

      let RCSA_Dashboard_DATA = {
        "RCSAData": RCSAData,
        "OverallInherentRiskRating_MasterData": OverallInherentRiskRating_MasterData,
        "OverallControlEnvironmentRating_MasterData": OverallControlEnvironmentRating_MasterData,
        "ResidualRisk_MasterData": ResidualRisk_MasterData
      }


      /**
      * Formating resultset provided by DB :END.
      */
      //Checking for null or undefined of formatted resultset data
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_Dashboard_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_Dashboard_DATA) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : RA_Dashboard_DATA is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : Get RiskAppetite Dashboard List successfully.');
      // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : RA_Dashboard_DATA ' + JSON.stringify(RCSA_Dashboard_DATA || null));
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, RCSA_Dashboard_DATA));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getDashboardRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * Get Overall Dashboard details
   * @param {*} request
   * @param {*} response
   * @returns
   */
  async getOverallDashboardData(request, response) {
    let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    // let accountNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken = request.body.refreshedToken;
      userIdFromToken = request.body.userIdFromToken;
      userNameFromToken = request.body.userNameFromToken;
      data = request.body.data;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution started.');

      const OVERALL_DASHBOARD_DB_RESPONSE = await dashboardDb.getOverallDashboardData(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
      // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : OVERALL_DASHBOARD_DB_RESPONSE ' + JSON.stringify(OVERALL_DASHBOARD_DB_RESPONSE || null));

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == OVERALL_DASHBOARD_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == OVERALL_DASHBOARD_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (OVERALL_DASHBOARD_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution end. : Error details :' + OVERALL_DASHBOARD_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (OVERALL_DASHBOARD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && OVERALL_DASHBOARD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution end. : Error details : ' + OVERALL_DASHBOARD_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      // if (OVERALL_DASHBOARD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && OVERALL_DASHBOARD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && OVERALL_DASHBOARD_DB_RESPONSE.recordset.every(n => ).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
      //     logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution end. : No Record in data base');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND,OVERALL_DASHBOARD_DB_RESPONSE));
      // }
      const KRI_DATA = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
      const KRI_COLOR_DATA = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
      const INCIDENT_DATA = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
      const RCSA_DATA = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
      const RA_DATA = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
      const RA_COLOR_DATA = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
      const GET_USER_ALERTS = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
      const CURRENCY_TYPE = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

      const OVERALL_DASHBOARD_DATA = await formatOverallData(RCSA_DATA, INCIDENT_DATA, RA_DATA, RA_COLOR_DATA, KRI_DATA, KRI_COLOR_DATA, GET_USER_ALERTS, CURRENCY_TYPE, userIdFromToken);

      let OverallInherentRiskRating_MasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      OverallInherentRiskRating_MasterData = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];

      let OverallControlEnvironmentRating_MasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      OverallControlEnvironmentRating_MasterData = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];

      let ResidualRisk_MasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      ResidualRisk_MasterData = OVERALL_DASHBOARD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];

      OVERALL_DASHBOARD_DATA['OverallInherentRiskRating_MasterData'] = OverallInherentRiskRating_MasterData;
      OVERALL_DASHBOARD_DATA['OverallControlEnvironmentRating_MasterData'] = OverallControlEnvironmentRating_MasterData;
      OVERALL_DASHBOARD_DATA['ResidualRisk_MasterData'] = ResidualRisk_MasterData;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == OVERALL_DASHBOARD_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == OVERALL_DASHBOARD_DATA) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution end. : OVERALL_DASHBOARD_DATA is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, OVERALL_DASHBOARD_DATA));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : getOverallDashboardData : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  stop() { }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
  return {
    success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
    message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    token: refreshedToken,
    error: {
      errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMessage: errorMessage,
    },
  };
}

function successfulResponse(refreshedToken, successMessage, result) {
  return {
    success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
    message: successMessage,
    result: result,
    token: refreshedToken,
    error: {
      errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    },
  };
}
/**
 * This is function will format the DB response of getDashboardRiskAppetite details.
 */


async function formatgetRiskAppetiteData(RA_DATA, RA_COLOR_DATA, userIdFromToken, callback) {
  try {
    logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatgetRiskAppetiteData : Execution Start.');

    logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatgetRiskAppetiteData : Execution end.');

    return {
      "Formatted_DATA": RA_DATA,
      "RISK_COLOR_DATA": RA_COLOR_DATA
    }

  } catch (error) {
    logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatgetRiskAppetiteData : Execution end. : Got unhandled error. : Error Detail : ' + error);
    callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
  }
}

async function formatData(key, recordset, userIdFromToken, callback) {
  try {
    return {
      [key]: recordset,
    };
  } catch (error) {
    logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : formatData : Execution end. : Got unhandled error. : Error Detail : " + error);
    callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
  }
}


async function formatKRIData(key, recordset, colorData, reportingFrequencyData, userIdFromToken, callback) {
  try {
    let data = [];
    recordset.forEach(obj => {
      if (obj.PreviousQuarterData === "Not Measured") {
        data.push({
          ...obj,
          IsReported: obj.IsReported[0]
        });
      } else {
        const parsedData = JSON.parse(obj.PreviousQuarterData);
        data.push({
          ...obj,
          PreviousQuarterData: parsedData,
          IsReported: obj.IsReported[0]
        });
      }
    });

    return {
      [key]: data,
      "KRIColorData": colorData,
      "reportingFrequencyData": reportingFrequencyData
    };
  } catch (error) {
    logger.log("error", "User Id : " + userIdFromToken + " : DashboardBL : formatData : Execution end. : Got unhandled error. : Error Detail : " + error);
    callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
  }
}


async function formatOverallData(RCSA_DATA, INCIDENT_DATA, RA_DATA, RA_COLOR_DATA, KRI_DATA, KRI_COLOR_DATA, userAlsertsData, CURRENCY_TYPE, userIdFromToken, callback) {
  try {
    // console.log('RCSA_DATA overall' + JSON.stringify(RCSA_DATA))
    logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatOverallData : Execution Start.');
    let userAlerts = [];
    let data = [];
    let RAInApp = [];
    let RCSAInApp = [];
    let INCInApp = [];
    let KRIInApp = [];
    let currencyType = [];

    KRI_DATA.forEach(obj => {
      if (obj.PreviousQuarterData === "Not Measured") {
        data.push({
          ...obj,
          IsReported: obj.IsReported[0]
        });
      } else {
        const parsedData = JSON.parse(obj.PreviousQuarterData);
        data.push({
          ...obj,
          PreviousQuarterData: parsedData,
          IsReported: obj.IsReported[0]
        });
      }
    });

    if (userAlsertsData.length) {
      for (const obj of Object.values(userAlsertsData)) {
        userAlerts.push({
          AlertID: obj.AlertID,
          AlertDate: obj.AlertDate,
          ToUserGUID: obj.ToUserGUID,
          InAppMessage: obj.InAppMessage,
          IsRead: obj.IsRead,
          IsInAppNotification: obj.IsInAppNotification,
          TotalCount: obj.TotalCount,
          UnReadCount: obj.UnReadCount,
          SubModuleID: obj.SubModuleID,
        })
      };
      userAlerts.map(item => {
        const inAppMessage = item.InAppMessage;
        const splitText = inAppMessage.split("link:");
        item.message = splitText[0];
        item.link = splitText[1];

      });
      RAInApp = userAlerts.filter(obj => obj.SubModuleID == 1);
      RCSAInApp = userAlerts.filter(obj => obj.SubModuleID == 2);
      INCInApp = userAlerts.filter(obj => obj.SubModuleID == 3);
      KRIInApp = userAlerts.filter(obj => obj.SubModuleID == 4);
    }

    for (obj of Object.values(CURRENCY_TYPE)) {
      currencyType.push({
        "AccountName": obj.AccountName,
        "Currency": obj.Currency
      })
    }

    // logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : userAlerts  :: ' +JSON.stringify(userAlerts || null));

    let resp = {
      "RCSA_DATA": RCSA_DATA.length ? RCSA_DATA : [],
      "INCIDENT_DATA": INCIDENT_DATA.length ? INCIDENT_DATA : [],
      "RA_DATA": RA_DATA.length ? RA_DATA : [],
      "RA_COLOR_DATA": RA_COLOR_DATA,
      "KRI_DATA": data,
      "KRI_COLOR_DATA": KRI_COLOR_DATA,
      "RAInApp": RAInApp,
      "RCSAInApp": RCSAInApp,
      "INCInApp": INCInApp,
      "KRIInApp": KRIInApp,
      "CurrencyType": currencyType
    }
    // logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatOverallData : resp ' + JSON.stringify(resp));
    logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatOverallData : Execution end.');
    return resp;
  } catch (error) {
    logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBl : formatOverallData : Execution end. : Got unhandled error. : Error Detail : ' + error);
    callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
  }
}


/**
 * This is function will be used to return single instance of class.
 */
function getDashboardBLClassInstance() {
  if (dashboardBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    dashboardBLClassInstance = new DashboardBl();
  }
  return dashboardBLClassInstance;
}

exports.getDashboardBLClassInstance = getDashboardBLClassInstance;
