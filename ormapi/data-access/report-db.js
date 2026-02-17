const MSSQL = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ = require("../utility/message/message-constant.js");

module.exports = class ReportDb {
  constructor() {}

  start() {}

  /**
   * This function will fetch Risk Appetite  data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getReportRiskAppetite(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log('info', 'User Id : '+ userIdFromToken +' : ReportDb : getReportRiskAppetite : Execution started.');
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    let dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      let request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName", MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Input parameters value for ORM.RA_GetRAReportData procedure.');
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : UserName       = ' + userNameFromToken);
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : AccountGUID       = ' + accountGUIDFromToken);

      return request.execute('ORM.RA_GetRAReportData').then(function (result) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Output parameters value of ORM.RA_GetRAReportData procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Success       = ' + result.output.Success);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : OutMessage    = ' + result.output.OutMessage);

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess = result.output.Success;
        dbResponseObj.procedureMessage = result.output.OutMessage;
        dbResponseObj.recordset = result.recordsets;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Execution end.');

        return dbResponseObj;
      })
      .catch(function (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Input parameters value for ORM.RA_GetRAReportData procedure.');
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : UserName       = ' + userNameFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : AccountGUID       = ' + accountGUIDFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Execution end. : Error details : ' + error);

        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

        return dbResponseObj;
      });
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Input parameters value for ORM.RA_GetRAReportData procedure.');
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : UserName       = ' + userNameFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : AccountGUID       = ' + accountGUIDFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRiskAppetite : Execution end. : Error details : ' + error);
     
      dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getReportIncident(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log('info', 'User Id : '+ userIdFromToken +' : ReportDb : getReportRiskAppetite : Execution started.');

    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    let dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      let request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName", MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Input parameters value for ORM.INC_GetIncidentReportData procedure.');
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : UserName       = ' + userNameFromToken);
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : AccountGUID       = ' + accountGUIDFromToken);

      return request.execute('ORM.INC_GetIncidentReportData').then(function (result) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Output parameters value of ORM.INC_GetIncidentReportData procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Success       = ' + result.output.Success);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : OutMessage    = ' + result.output.OutMessage);

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess = result.output.Success;
        dbResponseObj.procedureMessage = result.output.OutMessage;
        dbResponseObj.recordset = result.recordsets;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Execution end.');

        return dbResponseObj;
      })
      .catch(function (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Input parameters value for ORM.INC_GetIncidentReportData procedure.');
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : UserName       = ' + userNameFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : AccountGUID       = ' + accountGUIDFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Execution end. : Error details : ' + error);

        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

        return dbResponseObj;
      });
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Input parameters value for ORM.INC_GetIncidentReportData procedure.');
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : UserName       = ' + userNameFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : AccountGUID       = ' + accountGUIDFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportIncident : Execution end. : Error details : ' + error);
     
      dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getReportKRI(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log('info', 'User Id : '+ userIdFromToken +' : ReportDb : getReportRiskAppetite : Execution started.');

    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    let dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      let request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName", MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Input parameters value for ORM.KRI_GetKRIReportData procedure.');
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : UserName       = ' + userNameFromToken);
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : AccountGUID       = ' + accountGUIDFromToken);

      return request.execute('ORM.KRI_GetKRIReportData').then(function (result) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Output parameters value of ORM.KRI_GetKRIReportData procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Success       = ' + result.output.Success);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : OutMessage    = ' + result.output.OutMessage);

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess = result.output.Success;
        dbResponseObj.procedureMessage = result.output.OutMessage;
        dbResponseObj.recordset = result.recordsets;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Execution end.');

        return dbResponseObj;
      })
      .catch(function (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Input parameters value for ORM.KRI_GetKRIReportData procedure.');
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : UserName       = ' + userNameFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : AccountGUID       = ' + accountGUIDFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Execution end. : Error details : ' + error);

        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

        return dbResponseObj;
      });
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Input parameters value for ORM.KRI_GetKRIReportData procedure.');
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : UserName       = ' + userNameFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : AccountGUID       = ' + accountGUIDFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportKRI : Execution end. : Error details : ' + error);
     
      dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getReportRCSA(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log('info', 'User Id : '+ userIdFromToken +' : ReportDb : getReportRCSA : Execution started.');

    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    let dbResponseObj = {
      status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      let request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName", MSSQL.NVarChar, userNameFromToken);
      request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success", MSSQL.Bit);
      request.output("OutMessage", MSSQL.VarChar);

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Input parameters value for ORM.RCSA_GetRCSAReportData procedure.');
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : UserName       = ' + userNameFromToken);
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : AccountGUID       = ' + accountGUIDFromToken);

      return request.execute('ORM.RCSA_GetRCSAReportData').then(function (result) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Output parameters value of ORM.RCSA_GetRCSAReportData procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Success       = ' + result.output.Success);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : OutMessage    = ' + result.output.OutMessage);

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess = result.output.Success;
        dbResponseObj.procedureMessage = result.output.OutMessage;
        dbResponseObj.recordset = result.recordsets;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Execution end.');

        return dbResponseObj;
      })
      .catch(function (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Input parameters value for ORM.RCSA_GetRCSAReportData procedure.');
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : UserName       = ' + userNameFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : AccountGUID       = ' + accountGUIDFromToken);
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Execution end. : Error details : ' + error);

        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

        return dbResponseObj;
      });
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Input parameters value for ORM.RCSA_GetRCSAReportData procedure.');
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : UserName       = ' + userNameFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : AccountGUID       = ' + accountGUIDFromToken);
      logger.log('error', 'User Id : ' + userIdFromToken + ' : ReportDb : getReportRCSA : Execution end. : Error details : ' + error);
     
      dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
      dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

      return dbResponseObj;
    }
  }

  stop() {}
};
