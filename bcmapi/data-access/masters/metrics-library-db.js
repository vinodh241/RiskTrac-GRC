const MSSQL = require("mssql");
const CONSTANT_FILE_OBJ = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ = require("../../utility/message/message-constant.js");

module.exports = class MetricsLibraryDB {
    constructor() { }

    start() { }

    /**
    * This function will fetch metric library master data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @returns
   */
    async getMetricsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Execution started.");
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

            request.input("UserName", MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success", MSSQL.Bit);
            request.output("OutMessage", MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Input parameters value for [BCM].[MetricsLibrary_GetMetricsLibraryMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[MetricsLibrary_GetMetricsLibraryMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Output parameters value of [BCM].[MetricsLibrary_GetMetricsLibraryMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Input parameters value for [BCM].[MetricsLibrary_GetMetricsLibraryMaster] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : UserName       = " + userNameFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : AccountGUID       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Input parameters value for [BCM].[MetricsLibrary_GetMetricsLibraryMaster] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMaster : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch info data for add/update metric library master data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} metricMasterData 
    * @returns
    */
    async getMetricsMasterInfo(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Execution started.");
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

            request.input("CurrentDate",    MSSQL.NVarChar, metricMasterData.currentDate);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Input parameters value for [BCM].[MetricsLibrary_GetMetricsLibraryInfo] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : CurrentDate    = " + metricMasterData.currentDate);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : AccountGUID       = " + accountGUIDFromToken);

            return request.execute("[BCM].[MetricsLibrary_GetMetricsLibraryInfo]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Output parameters value of [BCM].[MetricsLibrary_GetMetricsLibraryInfo] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Input parameters value for [BCM].[MetricsLibrary_GetMetricsLibraryInfo] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : CurrentDate    = " + metricMasterData.currentDate);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : UserName       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : AccountGUID       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Input parameters value for [BCM].[MetricsLibrary_GetMetricsLibraryInfo] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : CurrentDate    = " + metricMasterData.currentDate);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : UserName       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : AccountGUID       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : getMetricsMasterInfo : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will add metric library master data into database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} metricMasterData
    * @returns
    */
    async addMetricMaster(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("MetricsLibraryID",       MSSQL.BigInt,           metricMasterData.MetricID);
            request.input("MetricCode",             MSSQL.NVarChar,         metricMasterData.Metric_Code);
            request.input("MetricTypeID",           MSSQL.BigInt,           metricMasterData.Metric_TypeID);
            request.input("MetricOwnerID",          MSSQL.UniqueIdentifier, metricMasterData.Metric_OwnerID);
            request.input("MetricTitle",            MSSQL.NVarChar,         metricMasterData.Metric_Title);
            request.input("MetricDescription",      MSSQL.NVarChar,         metricMasterData.Metric_Description);
            request.input("TargetTypeID",           MSSQL.Int,              metricMasterData.Target_Type_ID);
            request.input("ThresholdID",            MSSQL.Int,              metricMasterData.Threshold_ID);
            request.input("TargetValue",            MSSQL.NVarChar,         metricMasterData.Target_Value);
            request.input("FrequencyID",            MSSQL.Int,              metricMasterData.Frequency_ID);
            request.input("DataPointNumerator",     MSSQL.NVarChar,         metricMasterData.Datapoint_Numerator);
            request.input("DataPointDenominator",   MSSQL.NVarChar,         metricMasterData.Datapoint_Denominator);
            request.input("Controls",               MSSQL.NVarChar,         JSON.stringify(metricMasterData.Framework_Controls));
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Input parameters value for [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricsLibraryID        = " + metricMasterData.MetricID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricCode              = " + metricMasterData.Metric_Code);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricTypeID            = " + metricMasterData.Metric_TypeID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricOwnerID           = " + metricMasterData.Metric_OwnerID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricTitle             = " + metricMasterData.Metric_Title);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricDescription       = " + metricMasterData.Metric_Description);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : TargetTypeID            = " + metricMasterData.Target_Type_ID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : ThresholdID             = " + metricMasterData.Threshold_ID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : TargetValue             = " + metricMasterData.Target_Value);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : FrequencyID             = " + metricMasterData.Frequency_ID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : DataPointNumerator      = " + metricMasterData.Datapoint_Numerator);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : DataPointDenominator    = " + metricMasterData.Datapoint_Denominator);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Controls                = " + JSON.stringify(metricMasterData.controls));
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : UserName                = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : AccountGUID                = " + accountGUIDFromToken);

            return request.execute("[BCM].[MetricsLibrary_AddMetricsLibraryMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Output parameters value of [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Input parameters value for [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricsLibraryID        = " + metricMasterData.MetricID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricCode              = " + metricMasterData.Metric_Code);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricTypeID            = " + metricMasterData.Metric_TypeID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricOwnerID           = " + metricMasterData.Metric_OwnerID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricTitle             = " + metricMasterData.Metric_Title);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricDescription       = " + metricMasterData.Metric_Description);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : TargetTypeID            = " + metricMasterData.Target_Type_ID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : ThresholdID             = " + metricMasterData.Threshold_ID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : TargetValue             = " + metricMasterData.Target_Value);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : FrequencyID             = " + metricMasterData.Frequency_ID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : DataPointNumerator      = " + metricMasterData.Datapoint_Numerator);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : DataPointDenominator    = " + metricMasterData.Datapoint_Denominator);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Controls                = " + JSON.stringify(metricMasterData.controls));
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : UserName                = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : AccountGUID                = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Input parameters value for [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricsLibraryID        = " + metricMasterData.MetricID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricCode              = " + metricMasterData.Metric_Code);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricTypeID            = " + metricMasterData.Metric_TypeID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricOwnerID           = " + metricMasterData.Metric_OwnerID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricTitle             = " + metricMasterData.Metric_Title);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : MetricDescription       = " + metricMasterData.Metric_Description);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : TargetTypeID            = " + metricMasterData.Target_Type_ID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : ThresholdID             = " + metricMasterData.Threshold_ID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : TargetValue             = " + metricMasterData.Target_Value);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : FrequencyID             = " + metricMasterData.Frequency_ID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : DataPointNumerator      = " + metricMasterData.Datapoint_Numerator);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : DataPointDenominator    = " + metricMasterData.Datapoint_Denominator);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : Controls                = " + JSON.stringify(metricMasterData.controls));
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : UserName                = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : addMetricMaster : AccountGUID                = " + accountGUIDFromToken);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will update metric library master data
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} metricMasterData
    * @returns
    */
    async updateMetricMaster(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("MetricsLibraryID",       MSSQL.BigInt,           metricMasterData.MetricID);
            request.input("MetricCode",             MSSQL.NVarChar,         metricMasterData.Metric_Code);
            request.input("MetricTypeID",           MSSQL.BigInt,           metricMasterData.Metric_TypeID);
            request.input("MetricOwnerID",          MSSQL.UniqueIdentifier, metricMasterData.Metric_OwnerID);
            request.input("MetricTitle",            MSSQL.NVarChar,         metricMasterData.Metric_Title);
            request.input("MetricDescription",      MSSQL.NVarChar,         metricMasterData.Metric_Description);
            request.input("TargetTypeID",           MSSQL.Int,              metricMasterData.Target_Type_ID);
            request.input("ThresholdID",            MSSQL.Int,              metricMasterData.Threshold_ID);
            request.input("TargetValue",            MSSQL.NVarChar,         metricMasterData.Target_Value);
            request.input("FrequencyID",            MSSQL.Int,              metricMasterData.Frequency_ID);
            request.input("DataPointNumerator",     MSSQL.NVarChar,         metricMasterData.Datapoint_Numerator);
            request.input("DataPointDenominator",   MSSQL.NVarChar,         metricMasterData.Datapoint_Denominator);
            request.input("Controls",               MSSQL.NVarChar,         JSON.stringify(metricMasterData.Framework_Controls));
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Input parameters value for [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricsLibraryID        = " + metricMasterData.MetricID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricCode              = " + metricMasterData.Metric_Code);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricTypeID            = " + metricMasterData.Metric_TypeID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricOwnerID           = " + metricMasterData.Metric_OwnerID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricTitle             = " + metricMasterData.Metric_Title);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricDescription       = " + metricMasterData.Metric_Description);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : TargetTypeID            = " + metricMasterData.Target_Type_ID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : ThresholdID             = " + metricMasterData.Threshold_ID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : TargetValue             = " + metricMasterData.Target_Value);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : FrequencyID             = " + metricMasterData.Frequency_ID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : DataPointNumerator      = " + metricMasterData.Datapoint_Numerator);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : DataPointDenominator    = " + metricMasterData.Datapoint_Denominator);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Controls                = " + JSON.stringify(metricMasterData.controls));
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : UserName                = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : AccountGUID                = " + accountGUIDFromToken);

            return request.execute("[BCM].[MetricsLibrary_AddMetricsLibraryMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Output parameters value of [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Input parameters value for [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricsLibraryID        = " + metricMasterData.MetricID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricCode              = " + metricMasterData.Metric_Code);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricTypeID            = " + metricMasterData.Metric_TypeID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricOwnerID           = " + metricMasterData.Metric_OwnerID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricTitle             = " + metricMasterData.Metric_Title);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricDescription       = " + metricMasterData.Metric_Description);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : TargetTypeID            = " + metricMasterData.Target_Type_ID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : ThresholdID             = " + metricMasterData.Threshold_ID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : TargetValue             = " + metricMasterData.Target_Value);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : FrequencyID             = " + metricMasterData.Frequency_ID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : DataPointNumerator      = " + metricMasterData.Datapoint_Numerator);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : DataPointDenominator    = " + metricMasterData.Datapoint_Denominator);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Controls                = " + JSON.stringify(metricMasterData.controls));
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : UserName                = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : AccountGUID                = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Input parameters value for [BCM].[MetricsLibrary_AddMetricsLibraryMaster] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricsLibraryID        = " + metricMasterData.MetricID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricCode              = " + metricMasterData.Metric_Code);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricTypeID            = " + metricMasterData.Metric_TypeID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricOwnerID           = " + metricMasterData.Metric_OwnerID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricTitle             = " + metricMasterData.Metric_Title);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : MetricDescription       = " + metricMasterData.Metric_Description);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : TargetTypeID            = " + metricMasterData.Target_Type_ID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : ThresholdID             = " + metricMasterData.Threshold_ID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : TargetValue             = " + metricMasterData.Target_Value);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : FrequencyID             = " + metricMasterData.Frequency_ID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : DataPointNumerator      = " + metricMasterData.Datapoint_Numerator);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : DataPointDenominator    = " + metricMasterData.Datapoint_Denominator);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Controls                = " + JSON.stringify(metricMasterData.controls));
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : UserName                = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : AccountGUID                = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : updateMetricMaster : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will delete metric library master data from database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} metricMasterData
    * @returns
    */
    async deleteMetricMaster(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("MetricsLibraryID",   MSSQL.BigInt,   metricMasterData.MetricID);
            request.input("UserName",           MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Input parameters value for [BCM].[MetricsLibrary_DeleteMetricsLibraryMaster] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : MetricsLibraryID   = " + metricMasterData.MetricID);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : UserName           = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("[BCM].[MetricsLibrary_DeleteMetricsLibraryMaster]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Output parameters value of [BCM].[MetricsLibrary_DeleteMetricsLibraryMaster] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Input parameters value for [BCM].[MetricsLibrary_DeleteMetricsLibraryMaster] procedure.");
                logger.log(" error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : MetricsLibraryID      = " + metricMasterData.MetricID);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : UserName              = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : AccountGUID           = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Input parameters value for [BCM].[MetricsLibrary_DeleteMetricsLibraryMaster] procedure.");
            logger.log(" error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : MetricsLibraryID      = " + metricMasterData.MetricID);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : UserName              = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : MetricsLibraryDB : deleteMetricMaster : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }


    stop() { }
};
