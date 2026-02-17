const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../utility/message/message-constant.js");

module.exports = class bcmsTestingDB {
  constructor() {}

  start() {}

   /**
     * This function will fetch all bcms tests from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
   async getBcmsTestsList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Execution started.");
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


            request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Input parameters value for BCM.BCMS_GetBCMSTestList procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : UserName     = "           + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_GetBCMSTestList").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Output parameters value of BCM.BCMS_GetBCMSTestList procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Input parameters value for BCM.BCMS_GetBCMSTestList procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : UserName     = "             + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Input parameters value for BCM.BCMS_GetBCMSTestList procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : UserName     = "           + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestsList : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch info details for create BCMS test from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getBcmsAddTestInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Execution started.");
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

            request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Input parameters value for BCM.BCMS_GetInfoForAddBCMSTest procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : UserName     = "           + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_GetInfoForAddBCMSTest").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Output parameters value of BCM. procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Input parameters value for BCM.BCMS_GetInfoForAddBCMSTest procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : UserName     = "             + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Input parameters value for BCM.BCMS_GetInfoForAddBCMSTest procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : UserName     = "           + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsAddTestInfo : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will create new bcms test
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async addBcmsTest(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Execution started.");
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


            request.input('TestAssessmentID',               MSSQL.BigInt,           bcmsTestingData.testAssessmentId);
            request.input("TestTitle",                      MSSQL.NVarChar,         bcmsTestingData.testTitle);
            request.input("TestScenarioTitle",              MSSQL.NVarChar,         bcmsTestingData.testTitleScenario);
            request.input("TestScenarioDescription",        MSSQL.NVarChar,         bcmsTestingData.testScenarioDescription);
            request.input("PlannedStartDate",               MSSQL.Date,             bcmsTestingData.plannedStartDate.split('T')[0]);
            request.input("PlannedEndDate",                 MSSQL.Date,             bcmsTestingData.plannedEndDate.split('T')[0]);
            request.input("PlannedStartTime",               MSSQL.NVarChar,         bcmsTestingData.plannedStartTime);
            request.input("PlannedEndTime",                 MSSQL.NVarChar,         bcmsTestingData.plannedEndTime);
            request.input("ActualStartDate",                MSSQL.Date,             bcmsTestingData.actualStartDate);
            request.input("ActualEndDate",                  MSSQL.Date,             bcmsTestingData.actualEndDate);
            request.input("ActualStartTime",                MSSQL.Time,             bcmsTestingData.actualStartTime);
            request.input("ActualEndTime",                  MSSQL.Time,             bcmsTestingData.actualEndTime);
            request.input("TestTypeID",                     MSSQL.Int,              bcmsTestingData.testTypeId);
            request.input("TestAssessmentStatusID",         MSSQL.Int,              bcmsTestingData.testAssessmentStatusId);
            request.input("TestObserverID",                 MSSQL.UniqueIdentifier, bcmsTestingData.testObserverGUID);
            request.input("PlannedTestLimitations",         MSSQL.NVarChar,         bcmsTestingData.plannedTestLimitations);
            request.input("PlannedFinancialImpact",         MSSQL.NVarChar,         bcmsTestingData.plannedFinancialImpact);
            request.input("PlannedCustomerImpact",          MSSQL.NVarChar,         bcmsTestingData.plannedCustomerImpact);
            request.input("PlannedOtherImpact",             MSSQL.NVarChar,         bcmsTestingData.plannedOtherImpact);
            request.input("ParticipantsData",               MSSQL.NVarChar,         JSON.stringify(bcmsTestingData.participantsData));
            request.input("DisruptionScenarios",            MSSQL.NVarChar,         JSON.stringify(bcmsTestingData.disruptionScenarios));
            request.input("BusinessApplicationData",        MSSQL.NVarChar,         JSON.stringify(bcmsTestingData.coveredBusinessApplication));
            request.input("UserGUID",                       MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",                       MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Input parameters value for BCM.BCMS_AddTestAssessments procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestTitle = "                     + bcmsTestingData.testTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedStartDate = "              + bcmsTestingData.plannedStartDate.split('T')[0]);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedEndDate = "                + bcmsTestingData.plannedEndDate.split('T')[0]);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedStartTime = "              + bcmsTestingData.plannedStartTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedEndTime = "                + bcmsTestingData.plannedEndTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualStartDate = "               + bcmsTestingData.actualStartDate);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualEndDate = "                 + bcmsTestingData.actualEndDate);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualStartTime = "               + bcmsTestingData.actualStartTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualEndTime = "                 + bcmsTestingData.actualEndTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestAssessmentStatusID = "        + bcmsTestingData.testAssessmentStatusId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestScenarioTitle = "             + bcmsTestingData.testTitleScenario);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestTypeID = "                    + bcmsTestingData.testTypeId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestObserverGUID = "              + bcmsTestingData.testObserverGUID);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestScenarioDescription = "       + bcmsTestingData.testScenarioDescription);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedTestLimitations = "        + bcmsTestingData.plannedTestLimitations);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedFinancialImpact = "        + bcmsTestingData.plannedFinancialImpact);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedCustomerImpact = "         + bcmsTestingData.plannedCustomerImpact);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedOtherImpact = "            + bcmsTestingData.plannedOtherImpact);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ParticipantsData = "              + JSON.stringify(bcmsTestingData.participantsData));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : DisruptionScenarios = "           + JSON.stringify(bcmsTestingData.disruptionScenarios));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : BusinessApplicationData = "       + JSON.stringify(bcmsTestingData.coveredBusinessApplication));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : UserGUID     = "                  + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : UserName     = "                  + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_AddTestAssessments").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Output parameters value of BCM.BCMS_AddTestAssessments procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Input parameters value for BCM.BCMS_AddTestAssessments procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestTitle = "                     + bcmsTestingData.testTitle);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedStartDate = "              + bcmsTestingData.plannedStartDate.split('T')[0]);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedEndDate = "                + bcmsTestingData.plannedEndDate.split('T')[0]);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedStartTime-1 = "              + bcmsTestingData.plannedStartTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedEndTime = "                + bcmsTestingData.plannedEndTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualStartDate = "               + bcmsTestingData.actualStartDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualEndDate = "                 + bcmsTestingData.actualEndDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualStartTime = "               + bcmsTestingData.actualStartTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualEndTime = "                 + bcmsTestingData.actualEndTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestAssessmentStatusID = "        + bcmsTestingData.testAssessmentStatusId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestScenarioTitle = "             + bcmsTestingData.testTitleScenario);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestTypeID = "                    + bcmsTestingData.testTypeId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestObserverGUID = "              + bcmsTestingData.testObserverGUID);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestScenarioDescription = "       + bcmsTestingData.testScenarioDescription);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedTestLimitations = "        + bcmsTestingData.plannedTestLimitations);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedFinancialImpact = "        + bcmsTestingData.plannedFinancialImpact);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedCustomerImpact = "         + bcmsTestingData.plannedCustomerImpact);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedOtherImpact = "            + bcmsTestingData.plannedOtherImpact);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ParticipantsData = "              + JSON.stringify(bcmsTestingData.participantsData));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : DisruptionScenarios = "           + JSON.stringify(bcmsTestingData.disruptionScenarios));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : BusinessApplicationData = "       + JSON.stringify(bcmsTestingData.coveredBusinessApplication));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : UserGUID     = "                  + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : UserName     = "                  + userNameFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Input parameters value for BCM.BCMS_AddTestAssessments procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestTitle = "                     + bcmsTestingData.testTitle);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedStartDate = "              + bcmsTestingData.plannedStartDate.split('T')[0]);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedEndDate = "                + bcmsTestingData.plannedEndDate.split('T')[0]);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedStartTime = "              + bcmsTestingData.plannedStartTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedEndTime = "                + bcmsTestingData.plannedEndTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualStartDate = "               + bcmsTestingData.actualStartDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualEndDate = "                 + bcmsTestingData.actualEndDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualStartTime = "               + bcmsTestingData.actualStartTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ActualEndTime = "                 + bcmsTestingData.actualEndTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestAssessmentStatusID = "        + bcmsTestingData.testAssessmentStatusId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestScenarioTitle = "             + bcmsTestingData.testTitleScenario);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestTypeID = "                    + bcmsTestingData.testTypeId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestObserverGUID = "              + bcmsTestingData.testObserverGUID);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : TestScenarioDescription = "       + bcmsTestingData.testScenarioDescription);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedTestLimitations = "        + bcmsTestingData.plannedTestLimitations);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedFinancialImpact = "        + bcmsTestingData.plannedFinancialImpact);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedCustomerImpact = "         + bcmsTestingData.plannedCustomerImpact);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : PlannedOtherImpact = "            + bcmsTestingData.plannedOtherImpact);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : ParticipantsData = "              + JSON.stringify(bcmsTestingData.participantsData));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : DisruptionScenarios = "           + JSON.stringify(bcmsTestingData.disruptionScenarios));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : BusinessApplicationData = "       + JSON.stringify(bcmsTestingData.coveredBusinessApplication));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : UserGUID     = "                  + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : UserName     = "                  + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : addBcmsTest : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will create new bcms test
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async updateBcmsTest(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Execution started.");
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

            request.input("TestAssessmentID",               MSSQL.BigInt,           bcmsTestingData.testAssessmentId);
            request.input("TestTitle",                      MSSQL.NVarChar,         bcmsTestingData.testTitle);
            request.input("TestScenarioTitle",              MSSQL.NVarChar,         bcmsTestingData.testTitleScenario);
            request.input("TestScenarioDescription",        MSSQL.NVarChar,         bcmsTestingData.testScenarioDescription);
            request.input("PlannedStartDate",               MSSQL.Date,             bcmsTestingData.plannedStartDate.split('T')[0]);
            request.input("PlannedEndDate",                 MSSQL.Date,             bcmsTestingData.plannedEndDate.split('T')[0]);
            request.input("PlannedStartTime",               MSSQL.NVarChar,         bcmsTestingData.plannedStartTime);
            request.input("PlannedEndTime",                 MSSQL.NVarChar,         bcmsTestingData.plannedEndTime);
            request.input("ActualStartDate",                MSSQL.Date,             bcmsTestingData.actualStartDate);
            request.input("ActualEndDate",                  MSSQL.Date,             bcmsTestingData.actualEndDate);
            request.input("ActualStartTime",                MSSQL.Time,             bcmsTestingData.actualStartTime);
            request.input("ActualEndTime",                  MSSQL.Time,             bcmsTestingData.actualEndTime);
            request.input("TestTypeID",                     MSSQL.Int,              bcmsTestingData.testTypeId);
            request.input("TestAssessmentStatusID",         MSSQL.Int,              bcmsTestingData.testAssessmentStatusId);
            request.input("TestObserverID",                 MSSQL.UniqueIdentifier, bcmsTestingData.testObserverGUID);
            request.input("PlannedTestLimitations",         MSSQL.NVarChar,         bcmsTestingData.plannedTestLimitations);
            request.input("PlannedFinancialImpact",         MSSQL.NVarChar,         bcmsTestingData.plannedFinancialImpact);
            request.input("PlannedCustomerImpact",          MSSQL.NVarChar,         bcmsTestingData.plannedCustomerImpact);
            request.input("PlannedOtherImpact",             MSSQL.NVarChar,         bcmsTestingData.plannedOtherImpact);
            request.input("ParticipantsData",               MSSQL.NVarChar,         JSON.stringify(bcmsTestingData.participantsData));
            request.input("DisruptionScenarios",            MSSQL.NVarChar,         JSON.stringify(bcmsTestingData.disruptionScenarios));
            request.input("BusinessApplicationData",        MSSQL.NVarChar,         JSON.stringify(bcmsTestingData.coveredBusinessApplication));
            request.input("UserGUID",                       MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",                       MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Input parameters value for BCM.BCMS_AddTestAssessments procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestAssessmentID = "              + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestTitle = "                     + bcmsTestingData.testTitle);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedStartDate = "              + bcmsTestingData.plannedStartDate.split('T')[0]);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedEndDate = "                + bcmsTestingData.plannedEndDate.split('T')[0]);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedStartTime = "              + bcmsTestingData.plannedStartTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedEndTime = "                + bcmsTestingData.plannedEndTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualStartDate = "               + bcmsTestingData.actualStartDate);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualEndDate = "                 + bcmsTestingData.actualEndDate);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualStartTime = "               + bcmsTestingData.actualStartTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualEndTime = "                 + bcmsTestingData.actualEndTime);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestAssessmentStatusID = "        + bcmsTestingData.testAssessmentStatusId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestScenarioTitle = "             + bcmsTestingData.testTitleScenario);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestTypeID = "                    + bcmsTestingData.testTypeId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestObserverGUID = "              + bcmsTestingData.testObserverGUID);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestScenarioDescription = "       + bcmsTestingData.testScenarioDescription);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedTestLimitations = "        + bcmsTestingData.plannedTestLimitations);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedFinancialImpact = "        + bcmsTestingData.plannedFinancialImpact);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedCustomerImpact = "         + bcmsTestingData.plannedCustomerImpact);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedOtherImpact = "            + bcmsTestingData.plannedOtherImpact);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ParticipantsData = "              + JSON.stringify(bcmsTestingData.participantsData));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : DisruptionScenarios = "           + JSON.stringify(bcmsTestingData.disruptionScenarios));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : BusinessApplicationData = "       + JSON.stringify(bcmsTestingData.coveredBusinessApplication));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : UserGUID     = "                  + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : UserName     = "                  + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : AcocuntGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_AddTestAssessments").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Output parameters value of BCM.BCMS_AddTestAssessments procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Input parameters value for BCM.BCMS_AddTestAssessments procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestAssessmentID = "              + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestTitle = "                     + bcmsTestingData.testTitle);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedStartDate = "              + bcmsTestingData.plannedStartDate.split('T')[0]);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedEndDate = "                + bcmsTestingData.plannedEndDate.split('T')[0]);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedStartTime = "              + bcmsTestingData.plannedStartTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedEndTime = "                + bcmsTestingData.plannedEndTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualStartDate = "               + bcmsTestingData.actualStartDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualEndDate = "                 + bcmsTestingData.actualEndDate);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualStartTime = "               + bcmsTestingData.actualStartTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualEndTime = "                 + bcmsTestingData.actualEndTime);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestAssessmentStatusID = "        + bcmsTestingData.testAssessmentStatusId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestScenarioTitle = "             + bcmsTestingData.testTitleScenario);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestTypeID = "                    + bcmsTestingData.testTypeId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestObserverGUID = "              + bcmsTestingData.testObserverGUID);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestScenarioDescription = "       + bcmsTestingData.testScenarioDescription);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedTestLimitations = "        + bcmsTestingData.plannedTestLimitations);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedFinancialImpact = "        + bcmsTestingData.plannedFinancialImpact);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedCustomerImpact = "         + bcmsTestingData.plannedCustomerImpact);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedOtherImpact = "            + bcmsTestingData.plannedOtherImpact);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ParticipantsData = "              + JSON.stringify(bcmsTestingData.participantsData));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : DisruptionScenarios = "           + JSON.stringify(bcmsTestingData.disruptionScenarios));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : BusinessApplicationData = "       + JSON.stringify(bcmsTestingData.coveredBusinessApplication));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : UserGUID     = "                  + userIdFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : AcocuntGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Input parameters value for BCM.BCMS_AddTestAssessments procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestAssessmentID = "              + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestTitle = "                     + bcmsTestingData.testTitle);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedStartDate = "              + bcmsTestingData.plannedStartDate.split('T')[0]);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedEndDate = "                + bcmsTestingData.plannedEndDate.split('T')[0]);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedStartTime = "              + bcmsTestingData.plannedStartTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedEndTime = "                + bcmsTestingData.plannedEndTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualStartDate = "               + bcmsTestingData.actualStartDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualEndDate = "                 + bcmsTestingData.actualEndDate);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualStartTime = "               + bcmsTestingData.actualStartTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ActualEndTime = "                 + bcmsTestingData.actualEndTime);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestAssessmentStatusID = "        + bcmsTestingData.testAssessmentStatusId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestScenarioTitle = "             + bcmsTestingData.testTitleScenario);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestTypeID = "                    + bcmsTestingData.testTypeId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestObserverGUID = "              + bcmsTestingData.testObserverGUID);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : TestScenarioDescription = "       + bcmsTestingData.testScenarioDescription);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedTestLimitations = "        + bcmsTestingData.plannedTestLimitations);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedFinancialImpact = "        + bcmsTestingData.plannedFinancialImpact);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedCustomerImpact = "         + bcmsTestingData.plannedCustomerImpact);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : PlannedOtherImpact = "            + bcmsTestingData.plannedOtherImpact);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : ParticipantsData = "              + JSON.stringify(bcmsTestingData.participantsData));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : DisruptionScenarios = "           + JSON.stringify(bcmsTestingData.disruptionScenarios));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : BusinessApplicationData = "       + JSON.stringify(bcmsTestingData.coveredBusinessApplication));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : UserGUID     = "                  + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : UserName     = "                  + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : AcocuntGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTest : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch the bcms test details of particular asessment from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async getBcmsTestData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,           bcmsTestingData.testAssessmentId)
            request.input("UserGUID",               MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Input parameters value for BCMS_GetBCMSTestData procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : UserGUID     = "       + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_GetBCMSTestData").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Output parameters value of BCMS_GetBCMSTestData procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Input parameters value for BCMS_GetBCMSTestData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : UserGUID     = "         + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : UserName     = "         + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Input parameters value for BCMS_GetBCMSTestData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : TestAssessmentID = "    + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : UserGUID     = "        + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : UserName     = "        + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsTestData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will update Assessment Status of particular asessment from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async updateBcmsTestStatus(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,           bcmsTestingData.testAssessmentId);
            request.input("CurrentStatusCode",      MSSQL.Int,              bcmsTestingData.currentStatusId);
            request.input("NextStatusCode",         MSSQL.Int,              bcmsTestingData.nextStatusId);
            request.input("UserGUID",               MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Input parameters value for BCMS_UpdateBcmsTestStatus procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : CurrentStatusCode = "  + bcmsTestingData.currentStatusId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : NextStatusCode = "     + bcmsTestingData.nextStatusId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : UserGUID     = "       + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_UpdateBcmsTestStatus").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Output parameters value of BCMS_UpdateBcmsTestStatus procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Input parameters value for BCMS_UpdateBcmsTestStatus procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : CurrentStatusCode = "    + bcmsTestingData.currentStatusId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : NextStatusCode = "       + bcmsTestingData.nextStatusId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : UserGUID     = "         + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : UserName     = "         + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Input parameters value for BCMS_UpdateBcmsTestStatus procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : TestAssessmentID = "    + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : CurrentStatusCode = "   + bcmsTestingData.currentStatusId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : NextStatusCode = "      + bcmsTestingData.nextStatusId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : UserGUID     = "        + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : UserName     = "        + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : updateBcmsTestStatus : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch the bcms test participant report of particular asessment from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async getParticipantReportData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestParticipantID",      MSSQL.BigInt,               bcmsTestingData.testParticipantId);
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Input parameters value for BCM.BCMS_GetParticipantReportData procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : TestParticipantID = "    + bcmsTestingData.testParticipantId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : ScheduledTestID = "      + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : UserGUID = "             + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : UserName     = "         + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_GetParticipantReportData").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Output parameters value of BCM.BCMS_GetParticipantReportData procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Input parameters value for BCM.BCMS_GetParticipantReportData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : TestParticipantID = "  + bcmsTestingData.testParticipantId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : UserGUID = "           + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : UserName     = "       + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Input parameters value for BCM.BCMS_GetParticipantReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId); 
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : TestParticipantID = "  + bcmsTestingData.testParticipantId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : UserGUID = "           + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : UserName     = "       + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getParticipantReportData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will save participant report of particular asessment to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async saveParticipantReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId)
            request.input("TestParticipantID",      MSSQL.BigInt,               bcmsTestingData.testParticipantId)
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("Responses",              MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.responses));
            request.input("EvidenceIDs",            MSSQL.NVarChar,             bcmsTestingData.evidenceIds);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Input parameters value for BCMS_SaveParticipantReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : TestAssessmentID = "    + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : TestParticipantID = "   + bcmsTestingData.testParticipantId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : ScheduledTestID = "     + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Responses = "           + JSON.stringify(bcmsTestingData.responses));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : EvidenceIDs = "         + bcmsTestingData.evidenceIds);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : UserGUID     = "        + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : UserName     = "        + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_SaveParticipantReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Output parameters value of BCMS_SaveParticipantReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Input parameters value for BCMS_SaveParticipantReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : TestAssessmentID = "      + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : TestParticipantID = "     + bcmsTestingData.testParticipantId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : ScheduledTestID = "       + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Responses = "             + JSON.stringify(bcmsTestingData.responses));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : EvidenceIDs = "         + bcmsTestingData.evidenceIds);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : UserGUID     = "          + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : UserName     = "          + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Input parameters value for BCMS_SaveParticipantReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : TestAssessmentID = "      + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : TestParticipantID = "     + bcmsTestingData.testParticipantId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : ScheduledTestID = "       + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Responses = "             + JSON.stringify(bcmsTestingData.responses));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : EvidenceIDs = "         + bcmsTestingData.evidenceIds);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : UserGUID     = "          + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : UserName     = "          + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveParticipantReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will submit participant report of particular asessment to the BCManager 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async submitParticipantReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestParticipantID",      MSSQL.BigInt,               bcmsTestingData.testParticipantId);
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("TemplateID",             MSSQL.BigInt,               bcmsTestingData.templateId);
            request.input("Comment",                MSSQL.NVarChar,             bcmsTestingData.reviewComment);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Input parameters value for BCMS_SubmitParticipantReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TestParticipantID = "  + bcmsTestingData.testParticipantId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Comment = "            + bcmsTestingData.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : UserGUID     = "          + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_SubmitParticipantReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Output parameters value of BCMS_SubmitParticipantReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Input parameters value for BCMS_SubmitParticipantReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TestParticipantID = "  + bcmsTestingData.testParticipantId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TemplateID = "         + bcmsTestingData.templateId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Comment = "            + bcmsTestingData.reviewComment);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : UserGUID     = "          + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : UserName     = "       + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Input parameters value for BCMS_SubmitParticipantReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TestParticipantID = "  + bcmsTestingData.testParticipantId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Comment = "            + bcmsTestingData.reviewComment);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : UserGUID     = "          + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : UserName     = "       + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitParticipantReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will review participant report of particular asessment by BCManager 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async reviewParticipantReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestParticipantID",      MSSQL.BigInt,               bcmsTestingData.testParticipantId);
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("TemplateID",             MSSQL.BigInt,               bcmsTestingData.templateId);
            request.input("ReviewStatus",           MSSQL.Int,                  bcmsTestingData.reviewStatus);
            request.input("ReviewComment",          MSSQL.NVarChar,             bcmsTestingData.reviewComment);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Input parameters value for BCMS_ReviewParticipantReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TestParticipantID = "  + bcmsTestingData.testParticipantId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ReviewStatus = "       + bcmsTestingData.reviewStatus);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ReviewComment = "      + bcmsTestingData.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : UserGUID     = "       + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : AccountGUID     = " + accountGUIDFromToken);
            

            return request.execute("BCM.BCMS_ReviewParticipantReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Output parameters value of BCMS_ReviewParticipantReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Input parameters value for BCMS_ReviewParticipantReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TestParticipantID = "  + bcmsTestingData.testParticipantId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TemplateID = "         + bcmsTestingData.templateId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ReviewStatus = "       + bcmsTestingData.reviewStatus);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ReviewComment = "      + bcmsTestingData.reviewComment);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : UserGUID     = "       + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : UserName     = "       + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Input parameters value for BCMS_ReviewParticipantReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TestParticipantID = "  + bcmsTestingData.testParticipantId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ReviewStatus = "       + bcmsTestingData.reviewStatus);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : ReviewComment = "      + bcmsTestingData.reviewComment);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : UserGUID     = "       + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : UserName     = "       + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewParticipantReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
    

     /**
     * This function will fetch the bcms test observer report of particular asessment from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async getObserverReportData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId)
            request.input("TestObserverID",         MSSQL.UniqueIdentifier,     bcmsTestingData.testObserverId)
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Input parameters value for BCM.BCMS_GetObserverReportData procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : TestObserverID = "     + bcmsTestingData.testObserverId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : ScheduledTestID = "      + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : UserGUID = "             + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : UserName     = "         + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_GetObserverReportData").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Output parameters value of BCM.BCMS_GetObserverReportData procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Input parameters value for BCM.BCMS_GetObserverReportData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : TestObserverID = "     + bcmsTestingData.testObserverId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : UserGUID = "           + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : UserName     = "       + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Input parameters value for BCM.BCMS_GetObserverReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : TestObserverID = "     + bcmsTestingData.testObserverId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : UserGUID = "           + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : UserName     = "       + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getObserverReportData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will save observer report of particular asessment to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async saveObserverReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestObserverID",         MSSQL.UniqueIdentifier,     bcmsTestingData.testObserverId);
            request.input("TestObserverLNID",       MSSQL.BigInt,               bcmsTestingData.testObserverLnkId);
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("Responses",              MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.responses));
            request.input("SupportTeamResponse",    MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.supportTeamResponse));
            request.input("EvidenceIDs",            MSSQL.NVarChar,             bcmsTestingData.evidenceIds);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Input parameters value for BCM.BCMS_SaveObserverReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestAssessmentID = "       + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestObserverID = "         + bcmsTestingData.testObserverId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestObserverLNID = "       + bcmsTestingData.testObserverLnkId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : ScheduledTestID = "        + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Responses = "              + JSON.stringify(bcmsTestingData.responses));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : SupportTeamResponse = "    + JSON.stringify(bcmsTestingData.supportTeamResponse));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : EvidenceIDs = "            + bcmsTestingData.evidenceIds);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : UserGUID     = "           + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : UserName     = "           + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_SaveObserverReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Output parameters value of BCMS_SaveObserverReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Input parameters value for BCMS_SaveObserverReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestObserverID = "       + bcmsTestingData.testObserverId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestObserverLNID = "     + bcmsTestingData.testObserverLnkId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : ScheduledTestID = "      + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Responses = "            + JSON.stringify(bcmsTestingData.responses));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : SupportTeamResponse = "  + JSON.stringify(bcmsTestingData.supportTeamResponse));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : EvidenceIDs = "          + bcmsTestingData.evidenceIds);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : UserGUID     = "         + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : UserName     = "         + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Input parameters value for BCMS_SaveObserverReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestObserverID = "       + bcmsTestingData.testObserverId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : TestObserverLNID = "     + bcmsTestingData.testObserverLnkId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : ScheduledTestID = "      + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Responses = "            + JSON.stringify(bcmsTestingData.responses));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : SupportTeamResponse = "  + JSON.stringify(bcmsTestingData.supportTeamResponse));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : EvidenceIDs = "          + bcmsTestingData.evidenceIds);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : UserGUID     = "         + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : UserName     = "         + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : saveObserverReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will submit observer report of particular asessment to the BCManager 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async submitObserverReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestObserverID",         MSSQL.UniqueIdentifier,     bcmsTestingData.testObserverId);
            request.input("TestObserverLNID",       MSSQL.BigInt,               bcmsTestingData.testObserverLnkId);
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("TemplateID",             MSSQL.BigInt,               bcmsTestingData.templateId);
            request.input("Comment",                MSSQL.NVarChar,             bcmsTestingData.reviewComment);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Input parameters value for BCM.BCMS_SubmitObserverReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestObserverID = "     + bcmsTestingData.testObserverId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestObserverLNID = "   + bcmsTestingData.testObserverLnkId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Comment = "            + bcmsTestingData.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : UserGUID     = "       + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_SubmitObserverReport").then(function (result) {
                    logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Output parameters value of BCM.BCMS_SubmitObserverReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Input parameters value for BCM.BCMS_SubmitObserverReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestObserverID = "     + bcmsTestingData.testObserverId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestObserverLNID = "   + bcmsTestingData.testObserverLnkId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TemplateID = "         + bcmsTestingData.templateId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Comment = "            + bcmsTestingData.reviewComment);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : UserGUID     = "       + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : UserName     = "       + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Input parameters value for BCM.BCMS_SubmitObserverReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestObserverID = "     + bcmsTestingData.testObserverId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TestObserverLNID = "   + bcmsTestingData.testObserverLnkId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Comment = "            + bcmsTestingData.reviewComment);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : UserGUID     = "       + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : UserName     = "       + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : submitObserverReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will review participant report of particular asessment by BCManager 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async reviewObserverReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestObserverID",         MSSQL.UniqueIdentifier,     bcmsTestingData.testObserverId);
            request.input("TestObserverLNID",       MSSQL.BigInt,               bcmsTestingData.testObserverLnkId);
            request.input("ScheduledTestID",        MSSQL.BigInt,               bcmsTestingData.scheduledTestId);
            request.input("TemplateID",             MSSQL.BigInt,               bcmsTestingData.templateId);
            request.input("ReviewStatus",           MSSQL.Int,                  bcmsTestingData.status);
            request.input("ReviewComment",          MSSQL.NVarChar,             bcmsTestingData.reviewComment);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Input parameters value for BCM.BCMS_ReviewObserverReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestObserverID = "     + bcmsTestingData.testObserverId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestObserverLNID = "   + bcmsTestingData.testObserverLnkId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ReviewStatus = "       + bcmsTestingData.status);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ReviewComment = "      + bcmsTestingData.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : UserGUID     = "       + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_ReviewObserverReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Output parameters value of BCM.BCMS_ReviewObserverReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Input parameters value for BCM.BCMS_ReviewObserverReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestObserverID = "     + bcmsTestingData.testObserverId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestObserverLNID = "   + bcmsTestingData.testObserverLnkId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TemplateID = "         + bcmsTestingData.templateId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ReviewStatus = "       + bcmsTestingData.status);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ReviewComment = "      + bcmsTestingData.reviewComment);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : UserGUID     = "       + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : UserName     = "       + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Input parameters value for BCM.BCMS_ReviewObserverReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestObserverID = "     + bcmsTestingData.testObserverId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TestObserverLNID = "   + bcmsTestingData.testObserverLnkId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : TemplateID = "         + bcmsTestingData.templateId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ReviewStatus = "       + bcmsTestingData.status);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : ReviewComment = "      + bcmsTestingData.reviewComment);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : UserGUID     = "       + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : UserName     = "       + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : reviewObserverReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch the details for test report of particular asessment from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async getPublishReportData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("UserGUID",               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Input parameters value for BCM.BCMS_GetOverallTestReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_GetOverallTestReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Output parameters value of BCM.BCMS_GetOverallTestReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Input parameters value for BCM.BCMS_GetOverallTestReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : UserName     = "         + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Input parameters value for BCM.BCMS_GetOverallTestReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : TestAssessmentID = "    + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : UserName     = "        + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getPublishReportData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will save details for test report of particular asessment  
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async savePublishReportData(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         * 
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

            request.input("TestAssessmentID",               MSSQL.BigInt,               bcmsTestingData.testAssessmentId);
            request.input("TestReportID",                   MSSQL.BigInt,               bcmsTestingData.testReportId);
            request.input("PlannedTestLimitations",         MSSQL.NVarChar,             bcmsTestingData.plannedTestLimitations);
            request.input("PostAnalysisTestLimitation",     MSSQL.NVarChar,             bcmsTestingData.postAnalysisTestLimitation)
            request.input("PlannedFinancialImpact",         MSSQL.NVarChar,             bcmsTestingData.plannedFinancialImpact)
            request.input("PostAnalysisFinancialImpact",    MSSQL.NVarChar,             bcmsTestingData.postAnalysisFinancialImpact)
            request.input("PlannedCustomerImpact",          MSSQL.NVarChar,             bcmsTestingData.plannedCustomerImpact)
            request.input("PostAnalysisCustomerImpact",     MSSQL.NVarChar,             bcmsTestingData.postAnalysisCustomerImpact)
            request.input("PlannedOtherImpact",             MSSQL.NVarChar,             bcmsTestingData.plannedOtherImpact)
            request.input("PostAnalysisOtherImpact",        MSSQL.NVarChar,             bcmsTestingData.postAnalysisOtherImpact)
            request.input("RootCauseAnalysis",              MSSQL.NVarChar,             bcmsTestingData.rootCauseAnalysis)
            request.input("DisruptionScenariosData",        MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.disruptionScenariosData))
            request.input("TestingComponentsData",          MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.testingComponentsData))
            request.input("DetailedTestData",               MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.bussinessFunctions))
            request.input("TestObservationsData",           MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.testObservations))
            request.input("TestResult",                     MSSQL.NVarChar,             JSON.stringify(bcmsTestingData.testResult))
            request.input("ReportedBy",                     MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",                       MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Input parameters value for BCMS_SaveOverallTestReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : DATA = "        + JSON.stringify(bcmsTestingData));
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : UserName = "    + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : AccountGUID = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_SaveOverallTestReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Output parameters value of BCMS_SaveOverallTestReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Input parameters value for BCMS_SaveOverallTestReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : DATA = "      + JSON.stringify(bcmsTestingData));
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : UserName = "  + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : AccountGUID = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Input parameters value for BCMS_SaveOverallTestReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : DATA = "      + JSON.stringify(bcmsTestingData));
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : UserName = "  + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : AccountGUID = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : savePublishReportData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will publish test report of particular asessment  
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async publishTestReport(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Execution started.");
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

            request.input("TestAssessmentID",       MSSQL.BigInt,           bcmsTestingData.testAssessmentId);
            request.input("UserGUID",               MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",               MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Input parameters value for BCM.BCMS_PublishOverallTestReport procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : TestAssessmentID = "   + bcmsTestingData.testAssessmentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : UserGUID     = "       + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_PublishOverallTestReport").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Output parameters value of BCM.BCMS_PublishOverallTestReport procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Input parameters value for BCM.BCMS_PublishOverallTestReport procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : UserGUID     = "       + userIdFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : UserName     = "         + userNameFromToken );
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Input parameters value for BCM.BCMS_PublishOverallTestReport procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : TestAssessmentID = "    + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : UserGUID     = "       + userIdFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : UserName     = "        + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : publishTestReport : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
     * This function will fetch all review comments from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getBcmsReviewComments(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Execution started.");
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

        request.input("TestAssessmentID",       MSSQL.BigInt,   bcmsTestingData.testAssessmentId);
        request.input("ScheduledTestID",        MSSQL.BigInt,   bcmsTestingData.scheduledTestId);
        request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",               MSSQL.Bit);
        request.output("OutMessage",            MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Input parameters value for BCM.BCMS_GetTestReviewComments procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : UserName     = "           + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : AccountGUID     = " + accountGUIDFromToken);

        return request.execute("BCM.BCMS_GetTestReviewComments").then(function (result) {
            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Output parameters value of BCM.BCMS_GetTestReviewComments procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Execution end." );

            return dbResponseObj;
        }).catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Input parameters value for BCM.BCMS_GetTestReviewComments procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : UserName     = "             + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
        });
    } catch (error) {
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Input parameters value for BCM.BCMS_GetTestReviewComments procedure." );
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : UserName     = "           + userNameFromToken );
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : AccountGUID     = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getBcmsReviewComments : Execution end. : Error details : " + error );

        dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
    }
}

    /**
     * This function will fetch all review comments from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @returns
     */
    async getDataForEmail(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Execution started.");
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

        request.input("TestAssessmentID",       MSSQL.BigInt,   bcmsTestingData.testAssessmentId);
        request.input("ScheduledTestID",        MSSQL.BigInt,   bcmsTestingData.scheduledTestId);
        request.input("UserName",               MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",               MSSQL.Bit);
        request.output("OutMessage",            MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Input parameters value for BCM.BCMS_GetTestAssessmentEmailData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : UserName     = "           + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : AccountGUID     = " + accountGUIDFromToken);

        return request.execute("BCM.BCMS_GetTestAssessmentEmailData").then(function (result) {
            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Output parameters value of BCM.BCMS_GetTestAssessmentEmailData procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Execution end." );

            return dbResponseObj;
        }).catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Input parameters value for BCM.BCMS_GetTestAssessmentEmailData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : UserName     = "             + userNameFromToken );
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
        });
    } catch (error) {
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Input parameters value for BCM.BCMS_GetTestAssessmentEmailData procedure." );
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : TestAssessmentID = "     + bcmsTestingData.testAssessmentId);
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : ScheduledTestID = "    + bcmsTestingData.scheduledTestId);
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : UserName     = "           + userNameFromToken );
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : AccountGUID     = " + accountGUIDFromToken);
        logger.log( "error", "User Id : " + userIdFromToken + " : bcmsTestingDB : getDataForEmail : Execution end. : Error details : " + error );

        dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
    }
    }

     /**
     * This function will upload crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async uploadTestEvidence(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Execution started.");
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

            request.input('FileName',               MSSQL.NVarChar,     bcmsTestingData.OriginalFileName);
            request.input('FileType',               MSSQL.NVarChar,     bcmsTestingData.FileType)
            request.input('FileContent',            MSSQL.VarBinary,    bcmsTestingData.FileContent);
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Input parameters value for BCM.BCMS_UploadTestAssessmentEvidences procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileName = "           + bcmsTestingData.OriginalFileName);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileType = "           + bcmsTestingData.FileType);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileName = "           + bcmsTestingData.FileName);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_UploadTestAssessmentEvidences").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Output parameters value of BCM.BCMS_UploadTestAssessmentEvidences procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Input parameters value for BCM.BCMS_UploadTestAssessmentEvidences procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileName = "           + bcmsTestingData.OriginalFileName);
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileType = "           + bcmsTestingData.FileType);
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileName = "           + bcmsTestingData.FileName);
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : UserName     = "       + userNameFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Input parameters value for BCM.BCMS_UploadTestAssessmentEvidences procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileName = "           + bcmsTestingData.OriginalFileName);
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileType = "           + bcmsTestingData.FileType);
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : FileName = "           + bcmsTestingData.FileName);
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : UserName     = "       + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : uploadTestEvidence : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

      /**
     * This function will download crisis attachments
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} bcmsTestingData
     * @returns
     */
    async downloadTestEvidence(userIdFromToken, userNameFromToken, bcmsTestingData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Execution started.");
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


            request.input('FileContentID',          MSSQL.BigInt,      bcmsTestingData.fileContentId);
            request.input("UserName",               MSSQL.NVarChar,    userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Input parameters value for BCM.BCMS_DownloadTestAssessmentEvidences procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : FileContentID = "    + bcmsTestingData.fileContentId);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : UserName     = "     + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("BCM.BCMS_DownloadTestAssessmentEvidences").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Output parameters value of BCM.BCMS_DownloadTestAssessmentEvidences procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Input parameters value for BCM.BCMS_DownloadTestAssessmentEvidences procedure." );
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : FileContentID = "    + bcmsTestingData.fileContentId);
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : UserName     = "    + userNameFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Input parameters value for BCM.BCMS_DownloadTestAssessmentEvidences procedure." );
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : FileContentID = "    + bcmsTestingData.fileContentId);
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : UserName     = "    + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : bcmsTestingDB : downloadTestEvidence : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

  stop() {}
};