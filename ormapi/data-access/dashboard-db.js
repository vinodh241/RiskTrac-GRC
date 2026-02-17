const MSSQL = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ = require("../utility/message/message-constant.js");

module.exports = class DashboardDb {
  constructor() {}

  start() {}

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async getIncidentDashboardData(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",     MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID",  MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Input parameters value for ORM.INC_getIncidentDashboardData procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : AccountGUID       = " + accountGUIDFromToken);

      return request
        .execute("ORM.INC_GetIncidentDashBoardData")
        .then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Output parameters value of ORM.INC_getIncidentDashboardData procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Success       = " + result.output.Success);
          logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : OutMessage    = " + result.output.OutMessage);

          dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess = result.output.Success;
          dbResponseObj.procedureMessage = result.output.OutMessage;
          dbResponseObj.recordset = result.recordsets;

          logger.log("info", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Execution end.");
          return dbResponseObj;
        })
        .catch(function (error) {
          logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Input parameters value for ORM.INC_getIncidentDashboardData procedure.");
          logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : UserName       = " + userNameFromToken);
          logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : AccountGUID       = " + accountGUIDFromToken);
          logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Execution end. : Error details : " + error);

          dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

          return dbResponseObj;
        });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Input parameters value for ORM.INC_getIncidentDashboardData procedure.");
      logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : UserName       = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : AccountGUID       = " + accountGUIDFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : IncidentsDashboardDb : getIncidentDashboardData : Execution end. : Error details : " + error);

      dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async getDashboardKRI(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDb : getReportKRI : Execution started." );
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",     MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID",  MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Input parameters value for ORM.INC_GetIncidentDashBoardReportData procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : AccountGUID       = " + accountGUIDFromToken);

      return request
        .execute("ORM.KRI_GetKRIDashBoardData")
        .then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Output parameters value of ORM.INC_GetIncidentDashBoardReportData procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Success       = " + result.output.Success);
          logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : OutMessage    = " + result.output.OutMessage);

          dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess = result.output.Success;
          dbResponseObj.procedureMessage = result.output.OutMessage;
          dbResponseObj.recordset = result.recordsets;

          logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Execution end.");

          return dbResponseObj;
        })
        .catch(function (error) {
          logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Input parameters value for ORM.KRI_GetKRIReportData procedure.");
          logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : UserName       = " + userNameFromToken);
          logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : AccountGUID       = " + accountGUIDFromToken);
          logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Execution end. : Error details : " + error);

          dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

          return dbResponseObj;
        });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Input parameters value for ORM.KRI_GetKRIReportData procedure.");
      logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : UserName       = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : AccountGUID       = " + accountGUIDFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardKRI : Execution end. : Error details : " + error);

      dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async getDashboardRCSA(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",     MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID",  MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Input parameters value for ORM.INC_GetIncidentDashBoardReportData procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : AccountGUID       = " + accountGUIDFromToken);

      return request
        .execute("ORM.RCSA_GetRCSADashboardData")
        .then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Output parameters value of ORM.INC_GetIncidentDashBoardReportData procedure.");
          logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Success       = " + result.output.Success );
          logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : OutMessage    = " + result.output.OutMessage );

          dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess = result.output.Success;
          dbResponseObj.procedureMessage = result.output.OutMessage;
          dbResponseObj.recordset = result.recordsets;

          logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Execution end." );

          return dbResponseObj;
        })
        .catch(function (error) {
          logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
          logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : UserName       = " + userNameFromToken );
          logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : AccountGUID       = " + accountGUIDFromToken);
          logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Execution end. : Error details : " + error );

          dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
      logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : UserName       = " + userNameFromToken );
      logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : AccountGUID       = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDb : getDashboardRCSA : Execution end. : Error details : " + error );

      dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

/**
 * This function will fetch Risk Appetite  data from database
 * @param {*} userIdFromToken 
 * @param {*} userNameFromToken
 * @param {*} accountGUIDFromToken 
 * @returns 
 */	
  async getDashboardRiskAppetite(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log('info', 'User Id : '+ userIdFromToken +' : DashboardDb : getDashboardRiskAppetite : Execution started.');
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
        status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
        procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
    };

    try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);

        request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
        request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output('Success',    MSSQL.Bit);
        request.output('OutMessage', MSSQL.VarChar);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Input parameters value for ORM.RA_GetRADashBoardData procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : UserName       = ' + userNameFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : AccountGUID       = ' + accountGUIDFromToken);
        
        return request.execute('ORM.RA_GetRADashBoardData').then(function (result) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Output parameters value of ORM.RA_GetRADashBoardData procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Success       = ' + result.output.Success);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : OutMessage    = ' + result.output.OutMessage);

            dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess = result.output.Success;
            dbResponseObj.procedureMessage = result.output.OutMessage;
            dbResponseObj.recordset        = result.recordsets;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Execution end.');

            return dbResponseObj;
        })
        .catch(function (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Input parameters value for ORM.INC_getDashboardRiskAppetite procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Execution end. : Error details : ' + error);
            
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            
            return dbResponseObj;
        });
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Input parameters value for ORM.INC_getDashboardRiskAppetite procedure.');
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : UserName       = ' + userNameFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : AccountGUID       = ' + accountGUIDFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getDashboardRiskAppetite : Execution end. : Error details : ' + error);

        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
        
        return dbResponseObj;
    }
}

 /**
   * This function will fetch Overall dashboard data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async getOverallDashboardData(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
    logger.log('info', 'User Id : '+ userIdFromToken +' : DashboardDb : getOverallDashboardData : Execution started.');
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
        status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
        procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
    };
 
    try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);
        request.input('Year',        MSSQL.NVarChar,    data.Year);
        request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
        request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output('Success',    MSSQL.Bit);
        request.output('OutMessage', MSSQL.VarChar);
 
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Input parameters value for ORM.GetOverallDashboardData procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : data           = ' + JSON.stringify(data));
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : UserName       = ' + userNameFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : AccounGUID     = ' + accountGUIDFromToken);
       
        return request.execute('ORM.GetOverallDashboardData').then(function (result) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Output parameters value of ORM.GetOverallDashboardData procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : data          = ' + JSON.stringify(data));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Success       = ' + result.output.Success);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : OutMessage    = ' + result.output.OutMessage);
 
            dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess = result.output.Success;
            dbResponseObj.procedureMessage = result.output.OutMessage;
            dbResponseObj.recordset        = result.recordsets;
 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Execution end.');
 
            return dbResponseObj;
        })
        .catch(function (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Input parameters value for ORM.GetOverallDashboardData procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : data           = ' + JSON.stringify(data));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : AccounGUID     = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Execution end. : Error details : ' + error);
           
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
           
            return dbResponseObj;
        });
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Input parameters value for ORM.GetOverallDashboardData procedure.');
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : data           = ' + JSON.stringify(data));
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : UserName       = ' + userNameFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : AccounGUID     = ' + accountGUIDFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardDb : getOverallDashboardData : Execution end. : Error details : ' + error);
 
        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
       
        return dbResponseObj;
    }
  }
 

  stop() {}
};
