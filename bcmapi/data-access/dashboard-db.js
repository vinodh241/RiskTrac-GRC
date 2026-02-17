const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../utility/message/message-constant.js");

module.exports = class dashboardDB {
  constructor() {}

  start() {}

   /**
     * This function will fetch all data for global dashboard from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} dashboardData
     * @returns
     */
    async getGlobalDashboardData(userIdFromToken, userNameFromToken,dashboardData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("Year",                   MSSQL.NVarChar, dashboardData.selectedYears);
            request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",            MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Input parameters value for BCM.BCM_GetGlobalDashboardData procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Year     = "           + dashboardData.selectedYears);
            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCM_GetGlobalDashboardData").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Output parameters value of BCM.BCM_GetGlobalDashboardData procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Input parameters value for BCM.BCM_GetGlobalDashboardData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Year     = "           + dashboardData.selectedYears);
                logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : UserName     = "       + userNameFromToken );
                logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Input parameters value for BCM.BCM_GetGlobalDashboardData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Year     = "           + dashboardData.selectedYears);
            logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : UserName     = "       + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : dashboardDB : getGlobalDashboardData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all dashboard info from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getDashboardInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Input parameters value for [BCM].[BCM_GetCustomDashboardInfo] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCM_GetCustomDashboardInfo]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Output parameters value of [BCM].[BCM_GetCustomDashboardInfo] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Input parameters value for [BCM].[BCM_GetCustomDashboardInfo] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Input parameters value for [BCM].[BCM_GetCustomDashboardInfo] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : dashboardDB : getDashboardInfo : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

}