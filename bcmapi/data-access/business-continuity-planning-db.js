const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../utility/message/message-constant.js");

module.exports = class BusinessContinuityPlansDB {
    constructor() { }

    start() { }

    /**
    * This function will fetch the submit comments history for particalur business continuity plan from the dataBase
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} bcpData
    * @returns
    */
    async getBusinessContinuityPlansList(userIdFromToken, userNameFromToken, bcpData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,           bcpData.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,           bcpData.BusinessFunctionID);
            request.input("UserName",                   MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID",                MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Input parameters value for [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetBusinessContinuityPlanList]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Output parameters value of [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Input parameters value for [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Input parameters value for [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansList : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    
    /**
    * This function will fetch the submit comments history for particalur business continuity plan from the dataBase
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} siteRiskAssessmentData
    * @returns
    */
    async getBusinessContinuityPlansReviewList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Execution started.");
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

            request.input("UserName",       MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Input parameters value for [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetBusinessContinuityPlanList]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Output parameters value of [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Input parameters value for [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Input parameters value for [BCM].[BCP_GetBusinessContinuityPlanList] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessContinuityPlansReviewList : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    

 /**
    * This function will save the Business Function Profile Section of  business continuity plan to the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} businessFunctionProfileData
    * @returns
    */
 async saveBusinessFunctionProfile(userIdFromToken, userNameFromToken, businessFunctionProfileData, accountGUIDFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Execution started.");
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
      

        request.input("BusinessContinuityPlanId",         MSSQL.BigInt,   businessFunctionProfileData.BusinessContinuityPlanID)
        request.input("BusinessFunctionProfileID",        MSSQL.BigInt,   businessFunctionProfileData.BusinessFunctionProfileID)
        request.input("ProfilingQuestions",               MSSQL.NVarChar, JSON.stringify(businessFunctionProfileData.ProfilingQuestions))
        request.input("BusinessFunctionId",               MSSQL.BigInt,   businessFunctionProfileData.BusinessFunctionID)
        request.input("BusinessDescription",              MSSQL.NVarChar, businessFunctionProfileData.BusinessDescription)
        request.input("BusinessProductsServices",         MSSQL.NVarChar, businessFunctionProfileData.BusinessServices)
        request.input("BusinessProcesses",                MSSQL.NVarChar, JSON.stringify(businessFunctionProfileData.CriticalBusinessActivities))
        request.input("Customers",                        MSSQL.NVarChar, JSON.stringify(businessFunctionProfileData.Customers))
        request.input("UserName",                         MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",                         MSSQL.Bit);
        request.output("OutMessage",                      MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Input parameters value for  procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessContinuityPlanId       = " + businessFunctionProfileData.BusinessContinuityPlanID);
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessFunctionProfileID      = " + businessFunctionProfileData.BusinessFunctionProfileID);
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : ProfillingQuestions            = " + JSON.stringify(businessFunctionProfileData.ProfilingQuestions));
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessFunctionId             = " + businessFunctionProfileData.BusinessFunctionID);
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessDescription            = " + businessFunctionProfileData.BusinessDescription);
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessProductsServices       = " + businessFunctionProfileData.BusinessServices);
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessProcesses              = " + JSON.stringify(businessFunctionProfileData.CriticalBusinessActivities));
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Customers                      = " + JSON.stringify(businessFunctionProfileData.Customers));
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : UserName                       = " + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : AccountGUID                       = " + accountGUIDFromToken);

        return request.execute("[BCM].[BCP_AddBusinessFunctionProfile]").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Output parameters value of  procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Success       = " + result.output.Success);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : OutMessage    = " + result.output.OutMessage);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess = result.output.Success;
            dbResponseObj.procedureMessage = result.output.OutMessage;
            dbResponseObj.recordset = result.recordsets;

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Execution end.");

            return dbResponseObj;
        }).catch(function (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Input parameters value for  procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessContinuityPlanId       = " + businessFunctionProfileData.BusinessContinuityPlanId);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessFunctionProfileID      = " + businessFunctionProfileData.BusinessFunctionProfileID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : ProfillingQuestions            = " + JSON.stringify(businessFunctionProfileData.ProfillingQuestions));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessFunctionId             = " + businessFunctionProfileData.BusinessFunctionId);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessDescription            = " + businessFunctionProfileData.BusinessDescription);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessProductsServices       = " + businessFunctionProfileData.BusinessProductsServices);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessProcesses              = " + JSON.stringify(businessFunctionProfileData.BusinessProcesses));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Customers                      = " + JSON.stringify(businessFunctionProfileData.Customers));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : UserName                       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : AccountGUID                       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
        });
    } catch (error) {
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Input parameters value for  procedure.");
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessContinuityPlanId       = " + businessFunctionProfileData.BusinessContinuityPlanId);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessFunctionProfileID      = " + businessFunctionProfileData.BusinessFunctionProfileID);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : ProfillingQuestions            = " + JSON.stringify(businessFunctionProfileData.ProfillingQuestions));
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessFunctionId             = " + businessFunctionProfileData.BusinessFunctionId);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessDescription            = " + businessFunctionProfileData.BusinessDescription);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessProductsServices       = " + businessFunctionProfileData.BusinessProductsServices);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : BusinessProcesses              = " + JSON.stringify(businessFunctionProfileData.BusinessProcesses));
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Customers                      = " + JSON.stringify(businessFunctionProfileData.Customers));
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : UserName     = " + userNameFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : AccountGUID                       = " + accountGUIDFromToken);
        logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveBusinessFunctionProfile : Execution end. : Error details : " + error);

        dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
    }
}

    /**
    * This function will fetch the Business Function Profile Section info of business continuity plan from the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} profileQuestionsData
    * @returns
    */
    async getBusinessProfileQuestions(userIdFromToken, userNameFromToken, profileQuestionsData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Execution started.");
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

            request.input("BusinessContinuityPlanId",       MSSQL.BigInt,       profileQuestionsData.BusinessContinuityPlanID);
            request.input("UserName",                       MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Input parameters value for [BCM].[BCP_GetBusinessFunctionProfile] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : BusinessContinuityPlanId      = " + profileQuestionsData.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : SectionID                     = " + profileQuestionsData.SectionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : UserName                      = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : AccountGUID                      = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetBusinessFunctionProfile]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Output parameters value of [BCM].[BCP_GetBusinessFunctionProfile] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Input parameters value for [BCM].[BCP_GetBusinessFunctionProfile] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : BusinessContinuityPlanId      = " + profileQuestionsData.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : SectionID                     = " + profileQuestionsData.SectionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : UserName                      = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : AccountGUID                      = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Input parameters value for [BCM].[BCP_GetBusinessFunctionProfile] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : BusinessContinuityPlanId      = " + profileQuestionsData.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : SectionID                     = " + profileQuestionsData.SectionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : UserName                      = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : AccountGUID                      = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProfileQuestions : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch all the Sections data of business continuity plan from the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} bcpDetails
    * @returns
    */
    async getCompleteBCPDetails(userIdFromToken, userNameFromToken, bcpDetails, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   bcpDetails.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   bcpDetails.BusinessFunctionID);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Input parameters value for [BCM].[BCP_GetBCPDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : BusinessContinuityPlanId      = " + bcpDetails.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : BusinessFunctionID            = " + bcpDetails.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : UserName                      = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : AccountGUID                      = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetBCPDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Output parameters value of [BCM].[BCP_GetBCPDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Input parameters value for [BCM].[BCP_GetBCPDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : BusinessContinuityPlanId      = " + bcpDetails.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : BusinessFunctionID            = " + bcpDetails.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : UserName                      = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : AccountGUID                      = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Input parameters value for [BCM].[BCP_GetBCPDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : BusinessContinuityPlanId      = " + bcpDetails.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : BusinessFunctionID            = " + bcpDetails.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : UserName                      = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : AccountGUID                      = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getCompleteBCPDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will save the Dependencies Section of business continuity plan to the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} saveDependenciesData
    * @returns
    */
    async saveDependencies(userIdFromToken, userNameFromToken, saveDependenciesData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   saveDependenciesData.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   saveDependenciesData.BusinessFunctionID);
            request.input("TechnologyDependency",       MSSQL.NVarChar, JSON.stringify(saveDependenciesData.TechnologyDependencies));
            request.input("InterdependentProcesses",    MSSQL.NVarChar, JSON.stringify(saveDependenciesData.InterdependentProcesses));
            request.input("SupplierDependency",         MSSQL.NVarChar, JSON.stringify(saveDependenciesData.SupplierDependency));
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Input parameters value for [BCM].[BCP_AddDependencyDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessContinuityPlanId     = " + saveDependenciesData.BusinessContinuityPlanId);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessFunctionID           = " + saveDependenciesData.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : TechnologyDependency         = " + JSON.stringify(saveDependenciesData.TechnologyDependency));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : InterdependentProcesses      = " + JSON.stringify(saveDependenciesData.InterdependentProcesses));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : SupplierDependency           = " + JSON.stringify(saveDependenciesData.SupplierDependency));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : UserName                     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : AccountGUID                     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_AddDependencyDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Output parameters value of [BCM].[BCP_AddDependencyDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessContinuityPlanId     = " + saveDependenciesData.BusinessContinuityPlanId);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessFunctionID           = " + saveDependenciesData.BusinessFunctionID);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : TechnologyDependency         = " + JSON.stringify(saveDependenciesData.TechnologyDependency));
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : InterdependentProcesses      = " + JSON.stringify(saveDependenciesData.InterdependentProcesses));
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : SupplierDependency           = " + JSON.stringify(saveDependenciesData.SupplierDependency));
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : AccountGUID                     = " + accountGUIDFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Input parameters value for [BCM].[BCP_AddDependencyDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessContinuityPlanId     = " + saveDependenciesData.BusinessContinuityPlanId);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessFunctionID           = " + saveDependenciesData.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : TechnologyDependency         = " + JSON.stringify(saveDependenciesData.TechnologyDependency));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : InterdependentProcesses      = " + JSON.stringify(saveDependenciesData.InterdependentProcesses));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : SupplierDependency           = " + JSON.stringify(saveDependenciesData.SupplierDependency));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : AccountGUID                     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Input parameters value for [BCM].[BCP_AddDependencyDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessContinuityPlanId     = " + saveDependenciesData.BusinessContinuityPlanId);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : BusinessFunctionID           = " + saveDependenciesData.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : TechnologyDependency         = " + JSON.stringify(saveDependenciesData.TechnologyDependency));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : InterdependentProcesses      = " + JSON.stringify(saveDependenciesData.InterdependentProcesses));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : SupplierDependency           = " + JSON.stringify(saveDependenciesData.SupplierDependency));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : AccountGUID                     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveDependencies : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch the Dependencies info of business continuity plan from the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} getDependenciesData
    * @returns
    */
    async getDependenciesInfo(userIdFromToken, userNameFromToken, getDependenciesData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Execution started.");
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

            request.input("BusinessContinuityPlanId",         MSSQL.BigInt,       getDependenciesData.BusinessContinuityPlanID);
            request.input("UserName",                         MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                         MSSQL.Bit);
            request.output("OutMessage",                      MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Input parameters value for [BCM].[BCP_GetDependencyDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : BusinessContinuityPlanID       = " + getDependenciesData.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : UserName                       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : AccountGUID                       = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetDependencyDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Output parameters value of [BCM].[BCP_GetDependencyDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Input parameters value for [BCM].[BCP_GetDependencyDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : BusinessContinuityPlanID       = " + getDependenciesData.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : UserName                       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : AccountGUID                       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Input parameters value for [BCM].[BCP_GetDependencyDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : BusinessContinuityPlanID       = " + getDependenciesData.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : UserName                       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : AccountGUID                       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesInfo : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
   * This function will fetch the Dependencies details of business continuity plan from the database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @param {*} getDependenciesData
   * @returns
   */
    async getDependenciesDetails(userIdFromToken, userNameFromToken, getDependenciesData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   getDependenciesData.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   getDependenciesData.BusinessFunctionID);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Input parameters value for [BCM].[BCP_GetDependencyDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : BusinessContinuityPlanID       = " + getDependenciesData.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : BusinessFunctionID             = " + getDependenciesData.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : UserName                       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : AccountGUID                       = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetDependencyDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Output parameters value of [BCM].[BCP_GetDependencyDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Input parameters value for [BCM].[BCP_GetDependencyDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : BusinessContinuityPlanID       = " + getDependenciesData.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : BusinessFunctionID             = " + getDependenciesData.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : UserName                       = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : AccountGUID                       = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Input parameters value for [BCM].[BCP_GetDependencyDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : BusinessContinuityPlanID       = " + getDependenciesData.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : BusinessFunctionID             = " + getDependenciesData.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : UserName                       = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : AccountGUID                       = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getDependenciesDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will save the Risk Mitigation Section of business continuity plan to the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} riskMitigationData
    * @returns
    */
    async saveRiskMitigation(userIdFromToken, userNameFromToken, riskMitigationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   riskMitigationData.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   riskMitigationData.BusinessFunctionID);
            request.input("RiskMitigation",             MSSQL.NVarChar, JSON.stringify(riskMitigationData.RiskMitigationData));
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",                MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Input parameters value for [BCM].[BCP_AddRiskMitigation] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : BusinessContinuityPlanId   = " + riskMitigationData.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : BusinessFunctionID         = " + riskMitigationData.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : RiskMitigation             = " + JSON.stringify(riskMitigationData.RiskMitigationData));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : UserName                   = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : AccountGUID                   = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_AddRiskMitigation]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Output parameters value of [BCM].[BCP_AddRiskMitigation] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Input parameters value for [BCM].[BCP_AddRiskMitigation] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : BusinessContinuityPlanId   = " + riskMitigationData.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : BusinessFunctionID         = " + riskMitigationData.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : RiskMitigation             = " + JSON.stringify(riskMitigationData.RiskMitigationData));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : UserName                   = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : AccountGUID                   = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Input parameters value for [BCM].[BCP_AddRiskMitigation] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : BusinessContinuityPlanId   = " + riskMitigationData.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : BusinessFunctionID         = " + riskMitigationData.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : RiskMitigation             = " + JSON.stringify(riskMitigationData.RiskMitigationData));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : UserName                   = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : AccountGUID                   = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRiskMitigation : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch the Risk Mitigation Section info of business continuity plan from the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} riskMitigationInfoData
    * @returns
    */
    async getRiskMitigationInfo(userIdFromToken, userNameFromToken, riskMitigationInfoData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Execution started.");
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

            request.input("BusinessContinuityPlanId",       MSSQL.BigInt,       riskMitigationInfoData.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",             MSSQL.BigInt,       riskMitigationInfoData.BusinessFunctionID);
            request.input("UserName",                       MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Input parameters value for [BCM].[BCP_GetRiskMitigation] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessContinuityPlanId    = " + riskMitigationInfoData.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessFunctionID          = " + riskMitigationInfoData.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetRiskMitigation]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Output parameters value of [BCM].[BCP_GetRiskMitigation] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessContinuityPlanId    = " + riskMitigationInfoData.BusinessContinuityPlanID);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessFunctionID          = " + riskMitigationInfoData.BusinessFunctionID);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Input parameters value for [BCM].[BCP_GetRiskMitigation] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessContinuityPlanId    = " + riskMitigationInfoData.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessFunctionID          = " + riskMitigationInfoData.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Input parameters value for [BCM].[BCP_GetRiskMitigation] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessContinuityPlanId    = " + riskMitigationInfoData.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : BusinessFunctionID          = " + riskMitigationInfoData.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRiskMitigationInfo : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will save the Staff Contact Details / Call Tree Section of business continuity plan to the database.
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} staffContactData
    * @returns
    */
    async saveStaffContactDetails(userIdFromToken, userNameFromToken, staffContactData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,       staffContactData.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,       staffContactData.BusinessFunctionID);
            request.input("CallTreeDetails",            MSSQL.NVarChar,     JSON.stringify(staffContactData.StaffContactLists));
            request.input("UserName",                   MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Input parameters value for [BCM].[BCP_AddCallTree] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : BusinessContinuityPlanId  = " + staffContactData.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : BusinessFunctionID        = " + staffContactData.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : CallTreeDetails           = " + JSON.stringify(staffContactData.StaffContactLists));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : UserName                  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : AccountGUID                  = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_AddCallTree]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Output parameters value of [BCM].[BCP_AddCallTree] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Input parameters value for [BCM].[BCP_AddCallTree] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : BusinessContinuityPlanId     = " + staffContactData.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : BusinessFunctionID           = " + staffContactData.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : CallTreeDetails              = " + JSON.stringify(staffContactData.StaffContactLists));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : AccountGUID                  = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Input parameters value for [BCM].[BCP_AddCallTree] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : BusinessContinuityPlanId     = " + staffContactData.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : BusinessFunctionID           = " + staffContactData.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : CallTreeDetails              = " + JSON.stringify(staffContactData.StaffContactLists));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : AccountGUID                  = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveStaffContactDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch the submit comments history for particalur business continuity plan from the dataBase
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} getStaffContactInfo
    * @returns
    */
    async getStaffContactInfo(userIdFromToken, userNameFromToken, getStaffContactInfo, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   getStaffContactInfo.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   getStaffContactInfo.BusinessFunctionID);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Input parameters value for [BCM].[BCP_GetCallTreeDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessContinuityPlanId  = " + getStaffContactInfo.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessFunctionID        = " + getStaffContactInfo.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : UserName                  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : AccountGUID                  = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetCallTreeDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Output parameters value of [BCM].[BCP_GetCallTreeDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessContinuityPlanId  = " + getStaffContactInfo.BusinessContinuityPlanID);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessFunctionID        = " + getStaffContactInfo.BusinessFunctionID);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Success                   = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : OutMessage                = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Input parameters value for [BCM].[BCP_GetCallTreeDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessContinuityPlanId  = " + getStaffContactInfo.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessFunctionID        = " + getStaffContactInfo.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : UserName                  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : AccountGUID                  = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Input parameters value for [BCM].[BCP_GetCallTreeDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessContinuityPlanId  = " + getStaffContactInfo.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : BusinessFunctionID        = " + getStaffContactInfo.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : AccountGUID                  = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getStaffContactInfo : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
      
    /**
    * This function will fetch the business function list from the dataBase to intiate review (pg-96)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @returns
    */
    async getInitiateReview(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Input parameters value for [BCM].[BCP_GetInitiateReview] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetInitiateReview]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Output parameters value of [BCM].[BCP_GetInitiateReview] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Input parameters value for [BCM].[BCP_GetInitiateReview] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Input parameters value for [BCM].[BCP_GetInitiateReview] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getInitiateReview : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    
    /**
    * This function will intiate bcp review (pg-96)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @returns
    */
    async initiateReview(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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
            request.input("BusinessFunctionId",         MSSQL.BigInt,       data.BusinessFunctionId);
            request.input("UserName",                   MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Input parameters value for [BCM].BCP_InitiateReview procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : data         = " + JSON.stringify(data)); 
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : AccountGUID         = " + accountGUIDFromToken); 

            return request.execute("[BCM].BCP_InitiateReview").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Output parameters value of [BCM].BCP_InitiateReview procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Input parameters value for [BCM].BCP_InitiateReview procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : data          = " + JSON.stringify(data)); 
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : AccountGUID         = " + accountGUIDFromToken); 
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Input parameters value for [BCM].BCP_InitiateReview procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : data          = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : AccountGUID         = " + accountGUIDFromToken); 
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : initiateReview : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
	
	 /**
    * This function will fetch the business process details from the dataBase (pg-98)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} reviewData
    * @returns
    */
     async getBusinessProcessDetails(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   data.BusinessContinuityPlanID);
            request.input("BusinessFunctionId",         MSSQL.BigInt,   data.BusinessFunctionId);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Input parameters value for [BCM].[BCP_GetBusinessProcessDetails]  procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : AccountGUID     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetBusinessProcessDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Output parameters value of  procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Input parameters value for [BCM].[BCP_GetBusinessProcessDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : AccountGUID     = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Input parameters value for [BCM].[BCP_GetBusinessProcessDetails]  procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : AccountGUID     = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessDetails : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
    * This function will fetch the business process info list from the dataBase (pg-107)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async getBusinessProcessInfoList(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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

            request.input("UserName",                   MSSQL.NVarChar,     userNameFromToken);
            request.input("BusinessFunctionId",         MSSQL.BigInt,       data.BusinessFunctionId);
            request.input("BusinessContinuityPlanID",   MSSQL.BigInt,       data.BusinessContinuityPlanID);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Input parameters value for BCP_GetSiteListBasedOnBusinessFunctions procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : UserName       = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : data           = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : AccountGUID           = " + accountGUIDFromToken);

            return request.execute("BCM.BCP_GetSiteListBasedOnBusinessFunctions").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Output parameters value of BCP_GetSiteListBasedOnBusinessFunctions  procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Input parameters value for BCP_GetSiteListBasedOnBusinessFunctions procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : AccountGUID           = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Input parameters value for BCP_GetSiteListBasedOnBusinessFunctions procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : AccountGUID           = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBusinessProcessInfoList : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

     /**
    * This function will fetch the impact assessment details from the dataBase (pg-100)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} reviewData
    * @returns
    */
    async getImpactAssessmentDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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
            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   data.BusinessContinuityPlanId);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   data.BusinessFunctionID);
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);     
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);     
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Input parameters value for [BCM].[BCP_GetImpactAssessmentDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : data         = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : AccountGUID         = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetImpactAssessmentDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Output parameters value of [BCM].[BCP_GetImpactAssessmentDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : data         = " + JSON.stringify(data));
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Input parameters value for [BCM].[BCP_GetImpactAssessmentDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : data         = " + JSON.stringify(data));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : AccountGUID         = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Input parameters value for [BCM].[BCP_GetImpactAssessmentDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : data         = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : AccountGUID         = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getImpactAssessmentDetails : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch the business process info list from the dataBase (pg-102)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async getResourceRequirementDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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
            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   data.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   data.BusinessFunctionID)
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Input parameters value for [BCM].[BCP_GetResourceRequirements] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : data         = " + JSON.stringify(data)); 
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : AccountGUID         = " + accountGUIDFromToken); 
             

            return request.execute("[BCM].[BCP_GetResourceRequirements]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Output parameters value of [BCM].[BCP_GetResourceRequirements] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : OutMessage    = " + result.output.OutMessage);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : data         = " + JSON.stringify(data)); 


                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Input parameters value for [BCM].[BCP_GetResourceRequirements] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : AccountGUID         = " + accountGUIDFromToken); 
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Execution end. : Error details : " + error);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : data         = " + JSON.stringify(data)); 

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Input parameters value for [BCM].[BCP_GetResourceRequirements] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : Execution end. : Error details : " + error);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : AccountGUID         = " + accountGUIDFromToken); 
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getResourceRequirementDetails : data         = " + JSON.stringify(data)); 

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch the recovery process info details from the dataBase (pg-104)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async getRecoveryProcessDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Execution started.");
        /**
         *  dbResponseObj.status values
         *  1 - Successful operation
         *  0 - Error while connecting database
         *  2 - Error while executing procedure
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
            request.input("BusinessContinuityPlanId",    MSSQL.BigInt,   data.BusinessContinuityPlanId)
            request.input("BusinessFunctionID",          MSSQL.BigInt,   data.BusinessFunctionID)
            request.input("UserName",                    MSSQL.NVarChar, userNameFromToken);
            request.input("UserGUID",                    MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                    MSSQL.Bit);
            request.output("OutMessage",                 MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Input parameters value for [BCM].[BCP_GetRecoveryProcessDetails]  procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : UserName     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : data         = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : AccountGUID         = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetRecoveryProcessDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Output parameters value of [BCM].[BCP_GetRecoveryProcessDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : data          = " + JSON.stringify(data));
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : AccountGUID         = " + accountGUIDFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Input parameters value for [BCM].[BCP_GetRecoveryProcessDetails]  procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : data         = " + JSON.stringify(data));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : UserName     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : AccountGUID         = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Execution end. : Error details : " + error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Input parameters value for [BCM].[BCP_GetRecoveryProcessDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : UserName     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : data         = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : AccountGUID         = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getRecoveryProcessDetails : Execution end. : Error details : " + error);

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
  
    /**
    * This function will save a new process activity data to the database (pg-107)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async saveProcessActivityDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",       MSSQL.BigInt,       data.BusinessContinuityPlanId);
            request.input("BusinessProcessDetailsID",       MSSQL.BigInt,       data.BusinessProcessDetailsID);
            request.input("BusinessProcesses",              MSSQL.NVarChar,     JSON.stringify(data.BusinessProcesses));
            request.input("BusinessProcessDescription",     MSSQL.NVarChar,     data.BusinessProcessDescription);
            request.input("SubBusinessProcesses",           MSSQL.NVarChar,     JSON.stringify(data.SubBusinessProcesses));
            request.input("UserName",                       MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                       MSSQL.Bit);
            request.output("OutMessage",                    MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Input parameters value for [BCM].[BCP_AddBusinessProcessDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : data      = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : UserName  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : AccountGUID  = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_AddBusinessProcessDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Output parameters value of [BCM].[BCP_AddBusinessProcessDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Input parameters value for [BCM].[BCP_AddBusinessProcessDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : data      = " + JSON.stringify(data));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : UserName  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : AccountGUID  = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Input parameters value for [BCM].[BCP_AddBusinessProcessDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : data      = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : UserName  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : AccountGUID  = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveProcessActivityDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will save a new impact assessment data to the database (pg-109)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async saveImpactAssessmentDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   data.BusinessContinuityPlanId);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   data.BusinessFunctionID);
            request.input("ImpactAssessment",           MSSQL.NVarChar, JSON.stringify(data.ImpactAssessment));
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID",                MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Input parameters value for [BCM].[BCP_AddImpactAssessmentDetails] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : data      = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : UserName  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : AccountGUID  = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_AddImpactAssessmentDetails]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Output parameters value of [BCM].[BCP_AddImpactAssessmentDetails] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Input parameters value for [BCM].[BCP_AddImpactAssessmentDetails] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : data      = " + JSON.stringify(data));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : UserName  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : AccountGUID  = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Input parameters value for [BCM].[BCP_AddImpactAssessmentDetails] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : data      = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : UserName  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : AccountGUID  = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveImpactAssessmentDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will save a new resource requirements data to the database (pg-111)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async saveResourceRequirementsDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   data.BusinessContinuityPlanId);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   data.BusinessFunctionID);
            request.input("VitalRecords",               MSSQL.NVarChar, JSON.stringify(data.VitalRecords));
            request.input("CriticalEquipmentSupplies",  MSSQL.NVarChar, JSON.stringify(data.CriticalEquipmentSupplies))             
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Input parameters value for [BCM].[BCP_AddResourceRequirements] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : data      = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : UserName  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : AccountGUID  = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_AddResourceRequirements]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Output parameters value of [BCM].[BCP_AddResourceRequirements] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Input parameters value for [BCM].[BCP_AddResourceRequirements] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : data      = " + JSON.stringify(data));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : UserName  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : AccountGUID  = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Input parameters value for [BCM].[BCP_AddResourceRequirements] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : data      = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : UserName  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : AccountGUID  = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveResourceRequirementsDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will save a new process activity data to the database (pg-113)
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async saveRecoveryProcessDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,   data.BusinessContinuityPlanId);
            request.input("BusinessFunctionID",         MSSQL.BigInt,   data.BusinessFunctionID);
            request.input("RecoveryStaffRequirement",   MSSQL.NVarChar, JSON.stringify(data.RecoveryStaffRequirement));
            request.input("RecoveryStrategies",         MSSQL.NVarChar, JSON.stringify(data.RecoveryStrategies));
            // request.input("SubBusinessProcesses",       MSSQL.NVarChar, JSON.stringify(data.SubBusinessProcesses));              
            request.input("UserName",                   MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Input parameters value for BCM.BCP_AddRecoveryStrategies procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : data      = " + JSON.stringify(data));
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : UserName  = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : AccountGUID  = " + accountGUIDFromToken);

            return request.execute("BCM.BCP_AddRecoveryStrategies").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Output parameters value of BCM.BCP_AddRecoveryStrategies procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Input parameters value for BCM.BCP_AddRecoveryStrategies procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : data      = " + JSON.stringify(data));
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : UserName  = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : AccountGUID  = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Input parameters value for BCM.BCP_AddRecoveryStrategies procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : data      = " + JSON.stringify(data));
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : UserName  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : AccountGUID  = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : saveRecoveryProcessDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will submit and take review action for a BCP to the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} data
    * @returns
    */
    async submitReview(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,           data.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,           data.BusinessFunctionID);
            request.input("Comments",                   MSSQL.NVarChar,         data.reviewComment);
            request.input("BIA",                        MSSQL.VarChar,          data.dropdownValue);
            request.input("IsCoordinator",              MSSQL.Bit,              data.IsCoordinator);
            request.input("IsBcManager",                MSSQL.Bit,              data.IsBCManager);
            request.input("IsBusinessOwner",            MSSQL.Bit,              data.IsBusinessOwner);
            request.input("IsApproved",                 MSSQL.Bit,              data.IsApproved);
            request.input("IsRejected",                 MSSQL.Bit,              data.IsRejected);
            request.input("UserGUID",                   MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",                   MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Input parameters value for [BCM].[BCP_SubmitReview] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BusinessContinuityPlanId     = " + data.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BusinessFunctionID           = " + data.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Comments                     = " + data.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BIA                          = " + data.dropdownValue);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsCoordinator                = " + data.IsCoordinator);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsBcManager                  = " + data.IsBCManager);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsBusinessOwner              = " + data.IsBusinessOwner);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsApproved                   = " + data.IsApproved);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsRejected                   = " + data.IsRejected);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : UserGUID                     = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : UserName                     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : AccountGUID                     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_SubmitReview]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Output parameters value of [BCM].[BCP_SubmitReview] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Input parameters value for [BCM].[BCP_SubmitReview] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BusinessContinuityPlanId     = " + data.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BusinessFunctionID           = " + data.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Comments                     = " + data.reviewComment);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BIA                          = " + data.dropdownValue);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsCoordinator                = " + data.IsCoordinator);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsBcManager                  = " + data.IsBCManager);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsBusinessOwner              = " + data.IsBusinessOwner);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsApproved                   = " + data.IsApproved);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsRejected                   = " + data.IsRejected);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : UserGUID                     = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : AccountGUID                     = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Input parameters value for [BCM].[BCP_SubmitReview] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BusinessContinuityPlanId     = " + data.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BusinessFunctionID           = " + data.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Comments                     = " + data.reviewComment);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : BIA                          = " + data.dropdownValue);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsCoordinator                = " + data.IsCoordinator);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsBcManager                  = " + data.IsBCManager);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsBusinessOwner              = " + data.IsBusinessOwner);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsApproved                   = " + data.IsApproved);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : IsRejected                   = " + data.IsRejected);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : UserGUID                     = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : AccountGUID                     = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : submitReview : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will publish the mentioned BCP
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} payload
    * @returns
    */
    async publishBCP(userIdFromToken, userNameFromToken, payload, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.BigInt,           payload.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,           payload.BusinessFunctionID);
            request.input("Comments",                   MSSQL.NVarChar,         payload.reviewComment);
            request.input("UserGUID",                   MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("UserName",                   MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Input parameters value for [BCM].[BCP_Publish] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : BusinessFunctionID           = " + payload.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Comments                     = " + payload.reviewComment);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : UserGUID                     = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : UserName                     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : AccountGUID                     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_Publish]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Output parameters value of [BCM].[BCP_Publish] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Input parameters value for [BCM].[BCP_Publish] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : BusinessFunctionID           = " + payload.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Comments                     = " + payload.reviewComment);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : UserGUID                     = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : AccountGUID                     = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Input parameters value for [BCM].[BCP_Publish] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : BusinessFunctionID           = " + payload.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Comments                     = " + payload.reviewComment);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : UserGUID                     = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : AccountGUID                     = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : publishBCP : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch consolidated response of selected BCPs
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} payload
    * @returns
    */
    async getBCPConsolidatedReport(userIdFromToken, userNameFromToken, payload, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.NVarChar,             payload.BusinessContinuityPlanID);
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Input parameters value for [BCM].[BCP_GetConsolidatedReportData] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : UserGUID                     = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : UserName                     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : AccountGUID                     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetConsolidatedReportData]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Output parameters value of [BCM].[BCP_GetConsolidatedReportData] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Input parameters value for [BCM].[BCP_GetConsolidatedReportData] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : UserGUID                     = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : AccountGUID                     = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Input parameters value for [BCM].[BCP_GetConsolidatedReportData] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : UserGUID                     = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : AccountGUID                     = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPConsolidatedReport : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch draft response of a BCP
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} payload
    * @returns
    */
    async getBCPDraftResponse(userIdFromToken, userNameFromToken, payload, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Execution started.");
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

            request.input("BusinessContinuityPlanId",   MSSQL.NVarChar,     payload.BusinessContinuityPlanID);
            request.input("BusinessFunctionID",         MSSQL.BigInt,       payload.BusinessFunctionID);
            request.input("UserName",                   MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID",                MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Input parameters value for [BCM].[BCP_GetBCPDocData] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : BusinessFunctionID           = " + payload.BusinessFunctionID);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : UserGUID                     = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : UserName                     = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : AccountGUID                     = " + accountGUIDFromToken);

            return request.execute("[BCM].[BCP_GetBCPDocData]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Output parameters value of [BCM].[BCP_GetBCPDocData] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Input parameters value for [BCM].[BCP_GetBCPDocData] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : BusinessFunctionID           = " + payload.BusinessFunctionID);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : UserGUID                     = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : UserName                     = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : AccountGUID                     = " + accountGUIDFromToken);

                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Input parameters value for [BCM].[BCP_GetBCPDocData] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : BusinessContinuityPlanId     = " + payload.BusinessContinuityPlanID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : BusinessFunctionID           = " + payload.BusinessFunctionID);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : UserGUID                     = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : UserName                     = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : AccountGUID                     = " + accountGUIDFromToken);

            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBCPDraftResponse : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will fetch the BIA Rating master data from the database
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} accountGUIDFromToken
    * @returns
    */
    async getBIARatingMasterData(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Execution started.");
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

            request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.input("UserName",       MSSQL.NVarChar,         userNameFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.NVarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Input parameters value for [BCM].[BCP_GetBIARatingMasterData] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : AccountGUID = " + accountGUIDFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : UserName    = " + userNameFromToken);

            return request.execute("[BCM].[BCP_GetBIARatingMasterData]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Output parameters value of [BCM].[BCP_GetBIARatingMasterData] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Success    = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : OutMessage = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Input parameters value for [BCM].[BCP_GetBIARatingMasterData] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : AccountGUID = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : UserName    = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Input parameters value for [BCM].[BCP_GetBIARatingMasterData] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : AccountGUID = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : UserName    = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : BusinessContinuityPlansDB : getBIARatingMasterData : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    
    stop() { }
};