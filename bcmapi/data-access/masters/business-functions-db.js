const MSSQL                 = require("mssql");
const CONSTANT_FILE_OBJ     = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ      = require("../../utility/message/message-constant.js");

module.exports = class BusinessFunctionsDb {
  constructor() {}

  start() {}

  

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getBusinessFunctionsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Execution started.");
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

      request.input("UserName",     MSSQL.NVarChar,     userNameFromToken);
      request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Input parameters value for [BCM].[BusinessFunctions_GetBusinessFunctionsMaster]    procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : AccountGUID       = " + accountGUIDFromToken);

      return request.execute("[BCM].[BusinessFunctions_GetBusinessFunctionsMaster]").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Output parameters value of  [BCM].[BusinessFunctions_GetBusinessFunctionsMaster]  procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Success       = " + result.output.Success );
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Execution end." );

            return dbResponseObj;
        }).catch(function (error) {
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Input parameters value for [BCM].[BusinessFunctions_GetBusinessFunctionsMaster] procedure." );
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : UserName       = " + userNameFromToken );
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : AccountGUID       = " + accountGUIDFromToken);
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Input parameters value for [BCM].[BusinessFunctions_GetBusinessFunctionsMaster] procedure." );
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : UserName       = " + userNameFromToken );
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : AccountGUID       = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getBusinessFunctionsMaster : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async addBusinessFunctionsMaster(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Execution started.");
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
      request.input("BusinessFunctionsID",    MSSQL.BigInt,       data.BusinessFunctionsID);
      request.input("FBCCID",                 MSSQL.NVarChar,     data.FBCCID);
      request.input("BusinessGroupID",        MSSQL.BigInt,       data.BusinessGroupID);
      request.input("Name",                   MSSQL.NVarChar,     data.Name);
      request.input("UnitID",                 MSSQL.BigInt,       data.UnitID); 
      request.input("ShortCode",              MSSQL.NVarChar,     data.ShortCode);      
      request.input("Sites",                  MSSQL.NVarChar,     JSON.stringify(data.Sites));      
      request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
      request.input("AccountGUID",            MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success",               MSSQL.Bit);
      request.output("OutMessage",            MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Input parameters value for [BCM].[BusinessFunctions_AddBusinessFunctionMaster] procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : data           = " + JSON.stringify(data));
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : AccountGUID           = " + accountGUIDFromToken);

      return request.execute("[BCM].[BusinessFunctions_AddBusinessFunctionMaster]").then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Output parameters value of  [BCM].[BusinessFunctions_AddBusinessFunctionMaster]  procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Success       = " + result.output.Success );
          logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : OutMessage    = " + result.output.OutMessage );

          dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess  = result.output.Success;
          dbResponseObj.procedureMessage  = result.output.OutMessage;
          dbResponseObj.recordset         = result.recordsets;

          logger.log( "info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Execution end." );

          return dbResponseObj;
        }).catch(function (error) {
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Input parameters value for  [BCM].[BusinessFunctions_AddBusinessFunctionMaster] procedure." );
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : UserName       = " + userNameFromToken );
          logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : data           = " + JSON.stringify(data));
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : AccountGUID           = " + accountGUIDFromToken);
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Input parameters value for  [BCM].[BusinessFunctions_AddBusinessFunctionMaster] procedure." );
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : UserName       = " + userNameFromToken );
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : AccountGUID           = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : addBusinessFunctionsMaster : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch incident master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getGroupInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Execution started.");
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

      request.input("UserName",     MSSQL.NVarChar,     userNameFromToken);
      request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Input parameters value for [BCM].[BusinessFunctions_GetGroupInfo]    procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : AccountGUID       = " + accountGUIDFromToken);

      return request.execute("[BCM].[BusinessFunctions_GetGroupInfo]").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Output parameters value of  [BCM].[BusinessFunctions_GetGroupInfo]  procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Success       = " + result.output.Success );
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Execution end." );

            return dbResponseObj;
        }).catch(function (error) {
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Input parameters value for [BCM].[BusinessFunctions_GetGroupInfo] procedure." );
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : UserName       = " + userNameFromToken );
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : AccountGUID       = " + accountGUIDFromToken);
          logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Input parameters value for [BCM].[BusinessFunctions_GetGroupInfo] procedure." );
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : UserName       = " + userNameFromToken );
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : AccountGUID       = " + accountGUIDFromToken);
      logger.log( "error", "User Id : " + userIdFromToken + " : BusinessFunctionsDb : getGroupInfo : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

 

  stop() {}
};
