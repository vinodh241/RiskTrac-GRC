const MSSQL               = require("mssql");
const CONSTANT_FILE_OBJ   = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ    = require("../../utility/message/message-constant.js");

module.exports = class SteeringCommiteeDB {
  constructor() {}

  start() {}

  /**
   * This function will fetch Steering Commitee master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} accountGUIDFromToken
   * @returns
   */
  async getSteeringCommiteeMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Execution started.");
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

      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Input parameters value for [BCM].[MasterData_GetSteeringCommiteeUsers]	 procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : AccountGUID       = " + accountGUIDFromToken);

      return request.execute("[BCM].[MasterData_GetSteeringCommiteeUsers]").then(function (result) {
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Output parameters value of [BCM].[MasterData_GetSteeringCommiteeUsers]	 procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Success       = " + result.output.Success);
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : OutMessage    = " + result.output.OutMessage);

        dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess  = result.output.Success;
        dbResponseObj.procedureMessage  = result.output.OutMessage;
        dbResponseObj.recordset         = result.recordsets;

        logger.log( "info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Execution end." );

        return dbResponseObj;
      }).catch(function (error) {
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Input parameters value for [BCM].[MasterData_GetSteeringCommiteeUsers] procedure." );
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : UserName        = " + userNameFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : AccountGUID     = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Execution end. : Error details : " + error);

        dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
        return dbResponseObj;
      });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Input parameters value for [BCM].[MasterData_GetSteeringCommiteeUsers] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : UserName        = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : AccountGUID     = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMaster : Execution end. : Error details : " + error);

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
  async getSteeringCommiteeMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Execution started.");
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

      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Input parameters value for [BCM].[MasterData_GetInfoForAddSteeringCommitee]	 procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : AccountGUID       = " + accountGUIDFromToken);

      return request.execute("[BCM].[MasterData_GetInfoForAddSteeringCommitee]").then(function (result) {
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Output parameters value of [BCM].[MasterData_GetInfoForAddSteeringCommitee]	 procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Success       = " + result.output.Success);
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : OutMessage    = " + result.output.OutMessage);

        dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess  = result.output.Success;
        dbResponseObj.procedureMessage  = result.output.OutMessage;
        dbResponseObj.recordset         = result.recordsets;

        logger.log( "info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Execution end." );

        return dbResponseObj;
      }).catch(function (error) {
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Input parameters value for [BCM].[MasterData_GetInfoForAddSteeringCommitee] procedure." );
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : UserName        = " + userNameFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : AccountGUID     = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Execution end. : Error details : " + error);

        dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
        return dbResponseObj;
      });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Input parameters value for [BCM].[MasterData_GetInfoForAddSteeringCommitee] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : UserName        = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : AccountGUID     = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : getSteeringCommiteeMasterInfo : Execution end. : Error details : " + error);

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
   * @param {*} data
   * @returns
   */
  async addSteeringCommiteeMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken, data) {
    logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Execution started.");
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

      request.input("UserName",               MSSQL.NVarChar,           userNameFromToken);
      request.input("SteeringCommiteeUsers",  MSSQL.NVarChar,           JSON.stringify(data));
      request.input("AccountGUID",            MSSQL.UniqueIdentifier,   accountGUIDFromToken);
      request.output("Success",               MSSQL.Bit);
      request.output("OutMessage",            MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Input parameters value for [BCM].[MasterData_AddSteeringCommiteeUsers]	 procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : AccountGUID    = " + accountGUIDFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : data           = " + JSON.stringify(data));

      return request.execute("[BCM].[MasterData_AddSteeringCommiteeUsers]").then(function (result) {
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Output parameters value of [BCM].[MasterData_AddSteeringCommiteeUsers]	 procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Success       = " + result.output.Success);
        logger.log("info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : OutMessage    = " + result.output.OutMessage);

        dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        dbResponseObj.procedureSuccess  = result.output.Success;
        dbResponseObj.procedureMessage  = result.output.OutMessage;
        dbResponseObj.recordset         = result.recordsets;

        logger.log( "info", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Execution end." );

        return dbResponseObj;
      }).catch(function (error) {
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Input parameters value for [BCM].[MasterData_AddSteeringCommiteeUsers] procedure." );
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : UserName        = " + userNameFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : AccountGUID     = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Execution end. : Error details : " + error);

        dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
        return dbResponseObj;
      });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Input parameters value for [BCM].[MasterData_AddSteeringCommiteeUsers] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : UserName        = " + userNameFromToken);
      logger.log("error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : AccountGUID     = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : SteeringCommiteeDB : addSteeringCommiteeMaster : Execution end. : Error details : " + error);

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  stop() {}
};
