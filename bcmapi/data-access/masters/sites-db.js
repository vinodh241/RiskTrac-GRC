const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../../utility/message/message-constant.js");

module.exports = class SiteDB {
  constructor() {}

  start() {}

  

    /**
     * This function will fetch site master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getSiteMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Execution started.");
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

            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Input parameters value for BCM.Site_GetSiteMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Site_GetSiteMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Output parameters value of BCM.Site_GetSiteMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Input parameters value for BCM.Site_GetSiteMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Input parameters value for BCM.Site_GetSiteMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch info for add/update site master data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
     async getSiteMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Execution started.");
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
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Input parameters value for BCM.Site_GetMasterInfo procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Site_GetMasterInfo").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Output parameters value of BCM.Site_GetMasterInfo procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Input parameters value for BCM.Site_GetMasterInfo procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : UserName       = " + userNameFromToken );
                logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Input parameters value for BCM.Site_GetMasterInfo procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : UserName       = " + userNameFromToken );
            logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : getSiteMasterInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will add site master to the database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} siteMasterData
     * @returns
     */
     async addSiteMaster(userIdFromToken, userNameFromToken,siteMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Execution started.");
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

            request.input("SiteID",             MSSQL.BigInt,               siteMasterData.siteId);
            request.input("SiteName",           MSSQL.NVarChar,             siteMasterData.siteName);
            request.input("SiteShortCode",      MSSQL.NVarChar,             siteMasterData.siteShortCode);
            request.input("SiteAddress",        MSSQL.NVarChar,             siteMasterData.siteAddress);
            request.input("CityID",             MSSQL.Int,                  siteMasterData.cityId);
            request.input("BCChampionGUID",     MSSQL.UniqueIdentifier,     siteMasterData.bcChampionGUID);
            request.input("SiteAdminID",        MSSQL.UniqueIdentifier,     siteMasterData.siteAdminId);
            request.input("UserName",           MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID",        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Input parameters value for BCM.Site_AddSiteMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteID         = " + siteMasterData.siteId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteName       = " + siteMasterData.siteName);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteShortCode  = " + siteMasterData.siteShortCode);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteAddress    = " + siteMasterData.siteAddress);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : CityID         = " + siteMasterData.cityId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : BCChampionGUID = " + siteMasterData.bcChampionGUID);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteAdminID    = " + siteMasterData.siteAdminId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Site_AddSiteMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Output parameters value of BCM.Site_AddSiteMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Input parameters value for BCM.Site_AddSiteMaster  procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteID         = " + siteMasterData.siteId);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteName       = " + siteMasterData.siteName);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteShortCode  = " + siteMasterData.siteShortCode);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteAddress    = " + siteMasterData.siteAddress);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : CityID         = " + siteMasterData.cityId);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : BCChampionGUID = " + siteMasterData.bcChampionGUID);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteAdminID    = " + siteMasterData.siteAdminId);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Input parameters value for BCM.Site_AddSiteMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteID         = " + siteMasterData.siteId);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteName       = " + siteMasterData.siteName);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteShortCode  = " + siteMasterData.siteShortCode);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteAddress    = " + siteMasterData.siteAddress);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : CityID         = " + siteMasterData.cityId);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : BCChampionGUID = " + siteMasterData.bcChampionGUID);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : SiteAdminID    = " + siteMasterData.siteAdminId);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : addSiteMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
   * This function will update site master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} siteMasterData
   * @returns
   */
     async updateSiteMaster(userIdFromToken, userNameFromToken,siteMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Execution started.");
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

            request.input("SiteID",             MSSQL.BigInt,               siteMasterData.siteId);
            request.input("SiteName",           MSSQL.NVarChar,             siteMasterData.siteName);
            request.input("SiteShortCode",      MSSQL.NVarChar,             siteMasterData.siteShortCode);
            request.input("SiteAddress",        MSSQL.NVarChar,             siteMasterData.siteAddress);
            request.input("CityID",             MSSQL.Int,                  siteMasterData.cityId);
            request.input("BCChampionGUID",     MSSQL.UniqueIdentifier,     siteMasterData.bcChampionGUID);
            request.input("SiteAdminID",        MSSQL.UniqueIdentifier,     siteMasterData.siteAdminId);
            request.input("UserName",           MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Input parameters value for BCM.Site_AddSiteMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteID         = " + siteMasterData.siteId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteName       = " + siteMasterData.siteName);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteShortCode  = " + siteMasterData.siteShortCode);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteAddress    = " + siteMasterData.siteAddress);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : CityID         = " + siteMasterData.cityId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : BCChampionGUID = " + siteMasterData.bcChampionGUID);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteAdminID    = " + siteMasterData.siteAdminId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Site_AddSiteMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Output parameters value of BCM.Site_AddSiteMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Input parameters value for BCM.Site_AddSiteMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteID         = " + siteMasterData.siteId);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteName       = " + siteMasterData.siteName);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteShortCode  = " + siteMasterData.siteShortCode);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteAddress    = " + siteMasterData.siteAddress);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : CityID         = " + siteMasterData.cityId);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : BCChampionGUID = " + siteMasterData.bcChampionGUID);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteAdminID    = " + siteMasterData.siteAdminId);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Input parameters value for BCM.Site_AddSiteMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteID         = " + siteMasterData.siteId);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteName       = " + siteMasterData.siteName);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteShortCode  = " + siteMasterData.siteShortCode);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteAddress    = " + siteMasterData.siteAddress);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : CityID         = " + siteMasterData.cityId);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : BCChampionGUID = " + siteMasterData.bcChampionGUID);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : SiteAdminID    = " + siteMasterData.siteAdminId);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : updateSiteMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
   * This function will delete site master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} siteMasterData
   * @returns
   */
      async deleteSiteMaster(userIdFromToken, userNameFromToken,siteMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Execution started.");
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

            request.input("SiteID",             MSSQL.BigInt,   siteMasterData.siteId);
            request.input("UserName",           MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Input parameters value for BCM.Site_DeleteSiteMaster procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : SiteID         = " + siteMasterData.siteId);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("BCM.Site_DeleteSiteMaster").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Output parameters value of BCM.Site_DeleteSiteMaster procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Input parameters value for BCM.Site_DeleteSiteMaster procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : SiteID         = " + siteMasterData.siteId);
                logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Input parameters value for BCM.Site_DeleteSiteMaster procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : SiteID         = " + siteMasterData.siteId);
            logger.log("error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : SiteDB : deleteSiteMaster : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    



  stop() {}
};
