const MSSQL               = require("mssql");
const CONSTANT_FILE_OBJ   = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ    = require("../../utility/message/message-constant.js");

module.exports = class RiskRatingDB {
  constructor() {}

  start() {}

  /**
   * This function will fetch Steering Commitee master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async getDataForOverallRiskRating(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status            : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",     MSSQL.NVarChar,         userNameFromToken);
      request.input("AccountGUID",  MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Input parameters value for [BCM].[MasterData_GetDataForOverallRiskRating]	 procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : AccountGUID    = " + accountGUIDFromToken);

      return request.execute("[BCM].[MasterData_GetDataForOverallRiskRating]").then(function (result) {
        logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Output parameters value of [BCM].[MasterData_GetDataForOverallRiskRating]	 procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Success       = " + result.output.Success);
        logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : OutMessage    = " + result.output.OutMessage);

        dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess  = result.output.Success;
        dbResponseObj.procedureMessage  = result.output.OutMessage;
        dbResponseObj.recordset         = result.recordsets;

        logger.log( "info", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Execution end." );

        return dbResponseObj;
      }).catch(function (error) {
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Input parameters value for [BCM].[MasterData_GetDataForOverallRiskRating] procedure." );
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : UserName        = " + userNameFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : AccountGUID     = " + accountGUIDFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Execution end. : Error details : " + error);

        dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
        return dbResponseObj;
      });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Input parameters value for [BCM].[MasterData_GetDataForOverallRiskRating] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : UserName        = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : AccountGUID     = " + accountGUIDFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : getDataForOverallRiskRating : Execution end. : Error details : " + error);

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch Steering Commitee master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async manageOverallRiskRating(userIdFromToken, userNameFromToken, accountGUIDFromToken, data) {
    logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status            : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
      request.input("AccountGUID",            MSSQL.UniqueIdentifier,     accountGUIDFromToken);
      request.input("LikelihoodRatingData",   MSSQL.NVarChar,             JSON.stringify(data.LikelihoodRatingData))
      request.input("ImpactRatingData",       MSSQL.NVarChar,             JSON.stringify(data.ImpactRatingData))
      request.input("OverallRiskRating",      MSSQL.NVarChar,             JSON.stringify(data.OverallRiskRating))
      request.input("OverallRiskScore",       MSSQL.NVarChar,             JSON.stringify(data.OverallRiskScore))
      request.output("Success",               MSSQL.Bit);
      request.output("OutMessage",            MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Input parameters value for [BCM].[MasterData_ManageOverallRiskRating]	 procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : AccountGUID    = " + accountGUIDFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : data           = " + JSON.stringify(data));

      return request.execute("[BCM].[MasterData_ManageOverallRiskRating]").then(function (result) {
        logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Output parameters value of [BCM].[MasterData_ManageOverallRiskRating]	 procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Success       = " + result.output.Success);
        logger.log("info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : OutMessage    = " + result.output.OutMessage);

        dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess  = result.output.Success;
        dbResponseObj.procedureMessage  = result.output.OutMessage;
        dbResponseObj.recordset         = result.recordsets;

        logger.log( "info", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Execution end." );

        return dbResponseObj;
      }).catch(function (error) {
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Input parameters value for [BCM].[MasterData_ManageOverallRiskRating] procedure." );
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : UserName        = " + userNameFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : AccountGUID     = " + accountGUIDFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Execution end. : Error details : " + error);

        dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
        return dbResponseObj;
      });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Input parameters value for [BCM].[MasterData_ManageOverallRiskRating] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : UserName        = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : AccountGUID     = " + accountGUIDFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : RiskRatingDB : manageOverallRiskRating : Execution end. : Error details : " + error);

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  stop() {}
};
