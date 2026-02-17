const MSSQL             = require("mssql");
const CONSTANT_FILE_OBJ = require("../utility/constants/constant.js");
const MESSAGE_FILE_OBJ  = require("../utility/message/message-constant.js");

module.exports = class remediationTrackerDB {
  constructor() {}

  start() {}

    /**
     * This function will fetch all the defined Action Items from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async getActionItemList(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Execution started.");
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

        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Input parameters value for  procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : UserName     = "               + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : AccountGUID     = " + accountGUIDFromToken);

        return request.execute("[BCM].[RMT_GetActionItemsList]").then(function (result) {
                logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Output parameters value of  procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : OutMessage    = " + result.output.OutMessage );

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Execution end." );

                return dbResponseObj;
            }).catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Input parameters value for  procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : UserName     = "               + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Execution end. : Error details : " + error );

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Input parameters value for  procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : UserName     = "               + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : AccountGUID     = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemList : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }


        /**
     * This function will fetch action item info from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
        async getActionItemInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Execution started.");
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
    
            request.input("UserName",    MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",    MSSQL.Bit);
            request.output("OutMessage", MSSQL.VarChar);
    
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Input parameters value for  procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : UserName     = "  + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : AccountGUID     = " + accountGUIDFromToken);
    
            return request.execute("[BCM].[RMT_GetActionItemInfo]").then(function (result) {
                    logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Output parameters value of  procedure.");
                    logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Success       = " + result.output.Success );
                    logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : OutMessage    = " + result.output.OutMessage );
    
                    dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess  = result.output.Success;
                    dbResponseObj.procedureMessage  = result.output.OutMessage;
                    dbResponseObj.recordset         = result.recordsets;
    
                    logger.log( "info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Execution end." );
    
                    return dbResponseObj;
                }).catch(function (error) {
                    logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Input parameters value for  procedure." );
                    logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : UserName     = "   + userNameFromToken);
                    logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : AccountGUID     = " + accountGUIDFromToken);
                    logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Execution end. : Error details : " + error );
    
                    dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    return dbResponseObj;
                });
            } catch (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Input parameters value for  procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : UserName     = "  + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : AccountGUID     = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemInfo : Execution end. : Error details : " + error );
    
                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
    
                return dbResponseObj;
            }
        }

    
    /**
     * This function will save the Action Item details to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async saveActionItemDetails(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Execution started.");
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

            request.input("ActionItemID",       MSSQL.BigInt,               remediationData.ActionItemID);
            request.input("BCMModuleID",        MSSQL.BigInt,               remediationData.BCMModuleID);
            request.input("Progress",           MSSQL.NVarChar,             remediationData.Progress);
            request.input("Comment",            MSSQL.NVarChar,             remediationData.Comment);
            request.input("IsMarkedComplete",   MSSQL.Bit,                  remediationData.IsMarkedComplete);
            request.input("UserGUID",           MSSQL.UniqueIdentifier,     remediationData.UserGUID);
            request.input("UserName",           MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Input parameters value for BCM.RMT_SaveActionItemResponse procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : remediationData     = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : UserName             = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : AccountGUID             = " + accountGUIDFromToken);

            return request.execute("BCM.RMT_SaveActionItemResponse").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Output parameters value of BCM.RMT_SaveActionItemResponse procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Input parameters value for BCM.RMT_SaveActionItemResponse procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : remediationData     = " + JSON.stringify(remediationData));
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : AccountGUID             = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Input parameters value for BCM.SRA_saveActionItemDetails procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : remediationData     = " + JSON.stringify(remediationData));
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : UserName            = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : AccountGUID             = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : saveActionItemDetails : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will add new custom Action Item to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async addUpdateNewActionItem(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Execution started.");
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

            request.input("ActionItemID",           MSSQL.BigInt,               remediationData.ActionItemID);
            request.input("BCMModuleID",            MSSQL.BigInt,               remediationData.ActionItemModuleID);
            request.input("SourceID",               MSSQL.BigInt,               remediationData.ActionItemSourceID);
            request.input("IdentifiedActionItem",   MSSQL.NVarChar,             remediationData.ActionItemName);
            request.input("IdentifiedActionPlan",   MSSQL.NVarChar,             remediationData.ActionItemPlan);
            request.input("CriticalityID",          MSSQL.BigInt,               remediationData.CriticalityID);
            request.input("BudgetedCost",           MSSQL.NVarChar,             remediationData.BudgetedCost);
            request.input("StartDate",              MSSQL.DateTime,             remediationData.StartDate);
            request.input("EndDate",                MSSQL.DateTime,             remediationData.EndDate);
            request.input("ActionItemOwnerID",      MSSQL.UniqueIdentifier,     remediationData.ActionItemOwnerGUID);
            request.input("IsBudgetRequired",       MSSQL.Bit,                  remediationData.IsBudgetRequired);
            request.input("UserName",               MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Input parameters value for [BCM].[RMT_AddUpdateActionItem] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemID          = " + remediationData.ActionItemID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : SourceID              = " + remediationData.ActionItemSourceID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : CriticalityID         = " + remediationData.CriticalityID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : StartDate             = " + remediationData.StartDate);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : EndDate               = " + remediationData.EndDate);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserGUID              = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserName              = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : AccountGUID              = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_AddUpdateActionItem]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Output parameters value of [BCM].[RMT_AddUpdateActionItem] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemID          = " + remediationData.ActionItemID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : SourceID              = " + remediationData.ActionItemSourceID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : CriticalityID         = " + remediationData.CriticalityID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : StartDate             = " + remediationData.StartDate);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : EndDate               = " + remediationData.EndDate);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserGUID              = " + userIdFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : AccountGUID              = " + accountGUIDFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Success               = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : OutMessage            = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Input parameters value for [BCM].[RMT_AddUpdateActionItem] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemID          = " + remediationData.ActionItemID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : SourceID              = " + remediationData.ActionItemSourceID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : CriticalityID         = " + remediationData.CriticalityID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : StartDate             = " + remediationData.StartDate);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : EndDate               = " + remediationData.EndDate);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserGUID              = " + userIdFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserName              = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : AccountGUID              = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Input parameters value for [BCM].[RMT_AddUpdateActionItem] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemID          = " + remediationData.ActionItemID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : SourceID              = " + remediationData.ActionItemSourceID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : CriticalityID         = " + remediationData.CriticalityID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : StartDate             = " + remediationData.StartDate);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : EndDate               = " + remediationData.EndDate);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserGUID              = " + userIdFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : UserName              = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : AccountGUID              = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : addUpdateNewActionItem : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will fetch the details of an Action Item from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async getActionItemData(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Execution started.");
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

            request.input("ActionItemID",   MSSQL.BigInt,               remediationData.ActionItemID);
            request.input("UserGUID",       MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",       MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Input parameters value for BCM.RMT_GetActionItemsData procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : remediationData      = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : UserGUID             = " + userIdFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : AccountGUID             = " + accountGUIDFromToken);

            return request.execute("BCM.RMT_GetActionItemsData").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Output parameters value of BCM.RMT_GetActionItemsData procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Input parameters value for BCM.RMT_GetActionItemsData procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : remediationData     = " + JSON.stringify(remediationData));
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : AccountGUID             = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Input parameters value for BCM.RMT_GetActionItemsData procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : remediationData     = " + JSON.stringify(remediationData));
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : UserName            = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : AccountGUID             = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemData : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will save the new updated extension data of an action item to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async requestActionItemExtention(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Execution started.");
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

            request.input("ActionItemID",               MSSQL.BigInt,               remediationData.ActionItemID);
            request.input("BCMModuleID",                MSSQL.BigInt,               remediationData.BCMModuleID);
            request.input("Comment",                    MSSQL.NVarChar,             remediationData.reviewComment);
            request.input("ExtentionExplanation",       MSSQL.NVarChar,             remediationData.ExtentionExplanation); 
            request.input("ExtendedTargetDate",         MSSQL.DateTime,             remediationData.ExtendedTargetDate);             
            request.input("IsExtentionRequested",       MSSQL.Bit,                  remediationData.IsExtentionRequested);
            request.input("CurrentWorkflowStatusID",    MSSQL.BigInt,               remediationData.CurrentWorkflowStatusID);             
            request.input("NextWorkflowStatusID",       MSSQL.BigInt,               remediationData.NextWorkflowStatusID);
            request.input("UserGUID",                   MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Input parameters value for BCM.SRA_requestActionItemExtention procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : remediationData     = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : UserName            = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : AccountGUID            = " + accountGUIDFromToken);

            return request.execute("BCM.RMT_RequestActionItemExtention").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Output parameters value of BCM.SRA_requestActionItemExtention procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Input parameters value for BCM.SRA_requestActionItemExtention procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : remediationData    = " + JSON.stringify(remediationData));
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : UserName           = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : AccountGUID            = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Input parameters value for BCM.SRA_requestActionItemExtention procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : remediationData    = " + JSON.stringify(remediationData));
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : UserName           = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : AccountGUID            = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : requestActionItemExtention : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will download the action item attachment from the dataBase
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async downloadActionItemAttachment(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Execution started.");
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

            request.input("AttachmentID",   MSSQL.BigInt,   remediationData.AttachmentID);
            request.input("ActionItemID",   MSSQL.BigInt,   remediationData.ActionItemID);
            request.input("FileContentID",  MSSQL.BigInt,   remediationData.FileContentID);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Input parameters value for [BCM].[RMT_DownloadActionItemAttachments] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AttachmentID      = " + remediationData.AttachmentID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : ActionItemID      = " + remediationData.ActionItemID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : FileContentID     = " + remediationData.FileContentID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : UserName          = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AccountGUID          = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_DownloadActionItemAttachments]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Output parameters value of [BCM].[RMT_DownloadActionItemAttachments] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AttachmentID      = " + remediationData.AttachmentID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : ActionItemID      = " + remediationData.ActionItemID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : FileContentID     = " + remediationData.FileContentID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Success           = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : OutMessage        = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Input parameters value for [BCM].[RMT_DownloadActionItemAttachments] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AttachmentID     = " + remediationData.AttachmentID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : ActionItemID     = " + remediationData.ActionItemID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : FileContentID    = " + remediationData.FileContentID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AccountGUID          = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Input parameters value for [BCM].[RMT_DownloadActionItemAttachments] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AttachmentID      = " + remediationData.AttachmentID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : ActionItemID      = " + remediationData.ActionItemID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : FileContentID     = " + remediationData.FileContentID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : UserName          = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : AccountGUID          = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : downloadActionItemAttachment : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will upload the action item document to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async uploadActionItemAttachment(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Execution started.");
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

            request.input("ActionItemID",       MSSQL.BigInt,       remediationData.ActionItemID);
            request.input("OriginalFileName",   MSSQL.NVarChar,     remediationData.OriginalFileName);
            request.input("FileName",           MSSQL.NVarChar,     remediationData.FileName);
            request.input("FileType",           MSSQL.NVarChar,     remediationData.FileType);
            request.input("FileContent",        MSSQL.VarBinary,    remediationData.FileContent);
            request.input("UserName",           MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",           MSSQL.Bit);
            request.output("OutMessage",        MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Input parameters value for [BCM].[RMT_AddActionItemAttachment] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : ActionItemID        = " + remediationData.ActionItemID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : OriginalFileName    = " + remediationData.OriginalFileName);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileName            = " + remediationData.FileName);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileType            = " + remediationData.FileType);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : UserName            = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : AccountGUID            = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_AddActionItemAttachment]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Output parameters value of [BCM].[RMT_AddActionItemAttachment] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : ActionItemID        = " + remediationData.ActionItemID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : OriginalFileName    = " + remediationData.OriginalFileName);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileName            = " + remediationData.FileName);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileType            = " + remediationData.FileType);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Success             = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : OutMessage          = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Input parameters value for [BCM].[RMT_AddActionItemAttachment] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : ActionItemID        = " + remediationData.ActionItemID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : OriginalFileName    = " + remediationData.OriginalFileName);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileName            = " + remediationData.FileName);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileType            = " + remediationData.FileType);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : AccountGUID            = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Input parameters value for [BCM].[RMT_AddActionItemAttachment] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : ActionItemID        = " + remediationData.ActionItemID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : OriginalFileName    = " + remediationData.OriginalFileName);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileName            = " + remediationData.FileName);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : FileType            = " + remediationData.FileType);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : UserName            = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : AccountGUID            = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : uploadActionItemAttachment : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will update the source Action Item details to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async updateActionItem(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Execution started.");
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

            request.input("ActionItemID",           MSSQL.BigInt,       remediationData.ActionItemID);
            request.input("BCMModuleID",            MSSQL.BigInt,       remediationData.BCMModuleID);
            request.input("IdentifiedActionItem",   MSSQL.NVarChar,     remediationData.IdentifiedActionItem);
            request.input("IdentifiedActionPlan",   MSSQL.NVarChar,     remediationData.IdentifiedActionPlan);
            request.input("CriticalityID",          MSSQL.BigInt,       remediationData.CriticalityID);
            request.input("BudgetedCost",           MSSQL.NVarChar,     remediationData.BudgetedCost);
            request.input("StartDate",              MSSQL.DateTime,     remediationData.StartDate);
            request.input("EndDate",                MSSQL.DateTime,     remediationData.EndDate);             
            request.input("ActionItemOwnerID",      MSSQL.NVarChar,     remediationData.ActionItemOwnerID);
            request.input("IsBudgetRequired",       MSSQL.Bit,          remediationData.IsBudgetRequired);
            request.input("Progress",               MSSQL.NVarChar,     remediationData.Progress);
            request.input("IsMarkedComplete",       MSSQL.Bit,          remediationData.IsMarkedComplete);  
            request.input("UserName",               MSSQL.NVarChar,     userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",               MSSQL.Bit);
            request.output("OutMessage",            MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Input parameters value for [BCM].[RMT_UpdateActionItem] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemID          = " + remediationData.ActionItemID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Progress              = " + remediationData.Progress);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : CriticalityID         = " + remediationData.CriticalityID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : StartDate             = " + remediationData.StartDate);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : EndDate               = " + remediationData.EndDate);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsMarkedComplete      = " + remediationData.IsMarkedComplete);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : UserName              = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : AccountGUID              = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_UpdateActionItem]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Output parameters value of [BCM].[RMT_UpdateActionItem] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemID          = " + remediationData.ActionItemID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Progress              = " + remediationData.Progress);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : CriticalityID         = " + remediationData.CriticalityID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : StartDate             = " + remediationData.StartDate);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : EndDate               = " + remediationData.EndDate);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsMarkedComplete      = " + remediationData.IsMarkedComplete);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : AccountGUID              = " + accountGUIDFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Success               = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : OutMessage            = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Input parameters value for [BCM].[RMT_UpdateActionItem] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemID          = " + remediationData.ActionItemID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Progress              = " + remediationData.Progress);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : CriticalityID         = " + remediationData.CriticalityID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : StartDate             = " + remediationData.StartDate);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : EndDate               = " + remediationData.EndDate);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsMarkedComplete      = " + remediationData.IsMarkedComplete);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : UserName              = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : AccountGUID              = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Input parameters value for [BCM].[RMT_UpdateActionItem] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemID          = " + remediationData.ActionItemID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BCMModuleID           = " + remediationData.ActionItemModuleID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Progress              = " + remediationData.Progress);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionItem  = " + remediationData.ActionItemName);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IdentifiedActionPlan  = " + remediationData.ActionItemPlan);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : CriticalityID         = " + remediationData.CriticalityID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : BudgetedCost          = " + remediationData.BudgetedCost);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : StartDate             = " + remediationData.StartDate);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : EndDate               = " + remediationData.EndDate);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : ActionItemOwnerID     = " + remediationData.ActionItemOwnerGUID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsBudgetRequired      = " + remediationData.IsBudgetRequired);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : IsMarkedComplete      = " + remediationData.IsMarkedComplete);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : UserName              = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : AccountGUID              = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : updateActionItem : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will delete the action item attachment from the dataBase
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async deleteActionItemAttachment(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Execution started.");
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

            request.input("AttachmentID",   MSSQL.BigInt,   remediationData.AttachmentID);
            request.input("ActionItemID",   MSSQL.BigInt,   remediationData.ActionItemID);
            request.input("FileContentID",  MSSQL.BigInt,   remediationData.FileContentID);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Input parameters value for [BCM].[RMT_DeleteActionItemAttachments] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AttachmentID      = " + remediationData.AttachmentID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : ActionItemID      = " + remediationData.ActionItemID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : FileContentID     = " + remediationData.FileContentID);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : UserName          = " + userNameFromToken);
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AccountGUID          = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_DeleteActionItemAttachments]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Output parameters value of [BCM].[RMT_DeleteActionItemAttachments] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AttachmentID      = " + remediationData.AttachmentID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : ActionItemID      = " + remediationData.ActionItemID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : FileContentID     = " + remediationData.FileContentID);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Success           = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : OutMessage        = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Input parameters value for [BCM].[RMT_DeleteActionItemAttachments] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AttachmentID     = " + remediationData.AttachmentID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : ActionItemID     = " + remediationData.ActionItemID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : FileContentID    = " + remediationData.FileContentID);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : UserName         = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AccountGUID          = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Input parameters value for [BCM].[RMT_DeleteActionItemAttachments] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AttachmentID      = " + remediationData.AttachmentID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : ActionItemID      = " + remediationData.ActionItemID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : FileContentID     = " + remediationData.FileContentID);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : UserName         = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : AccountGUID          = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItemAttachment : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * This function will submit the action item to the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async submitActionItemResponse(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Execution started.");
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

            request.input("ActionItemID",               MSSQL.BigInt,               remediationData.ActionItemID);
            request.input("BCMModuleID",                MSSQL.BigInt,               remediationData.BCMModuleID);
            request.input("Comment",                    MSSQL.NVarChar,             remediationData.reviewComment);  
            request.input("UserGUID",                   MSSQL.UniqueIdentifier,     remediationData.UserGUID); 
            request.input("NextWorkflowStatusID",       MSSQL.BigInt,               remediationData.NextWorkflowStatusID); 
            request.input("CurrentWorkflowStatusID",    MSSQL.BigInt,               remediationData.CurrentWorkflowStatusID);              
            request.input("UserName",                   MSSQL.NVarChar,             userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Input parameters value for [BCM].[RMT_SubmitActionItemResponse] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : remediationData        = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : AccountGUID        = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_SubmitActionItemResponse]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Output parameters value of [BCM].[RMT_SubmitActionItemResponse] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : remediationData     = " + JSON.stringify(remediationData));
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Success             = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : OutMessage          = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Input parameters value for [BCM].[RMT_SubmitActionItemResponse] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : UserName            = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : AccountGUID        = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Input parameters value for [BCM].[RMT_SubmitActionItemResponse] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : UserName            = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : AccountGUID        = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : submitActionItemResponse : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }   

    /**
     * This function will fetch the action item comments from the dataBase 
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} remediationData
     * @returns
     */
    async getActionItemsComments(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Execution started.");
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

            request.input("ActionItemID",   MSSQL.BigInt,   remediationData.ActionItemID);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Input parameters value for BCM.[RMT_GetActionItemsComments] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : remediationData = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : AccountGUID = " + accountGUIDFromToken);

            return request.execute("BCM.[RMT_GetActionItemsComments]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Output parameters value of BCM.[RMT_GetActionItemsComments] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Success       = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : OutMessage    = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Input parameters value for BCM.[RMT_GetActionItemsComments] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : remediationData = " + JSON.stringify(remediationData));
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : UserName        = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : AccountGUID = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Input parameters value for BCM.[RMT_GetActionItemsComments] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : remediationData = " + JSON.stringify(remediationData));
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : UserName        = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : AccountGUID = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : getActionItemsComments : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will review the action item 
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} remediationData
    * @returns
    */
    async reviewActionItemResponse(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Execution started.");
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

            request.input("ActionItemID",               MSSQL.BigInt,           remediationData.ActionItemID);
            request.input("BCMModuleID",                MSSQL.BigInt,           remediationData.BCMModuleID);
            request.input("Comment",                    MSSQL.NVarChar,         remediationData.reviewComment);
            request.input("UserGUID",                   MSSQL.UniqueIdentifier, userIdFromToken);
            request.input("NextWorkflowStatusID",       MSSQL.BigInt,           remediationData.NextWorkflowStatusID);
            request.input("CurrentWorkflowStatusID",    MSSQL.BigInt,           remediationData.CurrentWorkflowStatusID);
            request.input("IsApproved",                 MSSQL.Bit,              remediationData.status);
            request.input("ExtentionRequestID",         MSSQL.BigInt,           remediationData.ExtentionRequestID);
            request.input("EscalationRequestID",        MSSQL.BigInt,           remediationData.EscalationRequestID);
            request.input("IsExtentionRequested",       MSSQL.Bit,              remediationData.IsExtentionRequested);
            request.input("IsEscalated",                MSSQL.Bit,              remediationData.IsEscalated);
            request.input("UserName",                   MSSQL.NVarChar,         userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                   MSSQL.Bit);
            request.output("OutMessage",                MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Input parameters value for [BCM].[RMT_ReviewActionItemResponse] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : remediationData        = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : AccountGUID        = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_ReviewActionItemResponse]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Output parameters value of [BCM].[RMT_ReviewActionItemResponse] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : remediationData      = " + JSON.stringify(remediationData));
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Success              = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : UserGUID             = " + userIdFromToken);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : OutMessage           = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Input parameters value for [BCM].[RMT_ReviewActionItemResponse] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : remediationData      = " + JSON.stringify(remediationData));
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : UserName             = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : AccountGUID        = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Input parameters value for [BCM].[RMT_ReviewActionItemResponse] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : remediationData           = " + JSON.stringify(remediationData));
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : AccountGUID        = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : reviewActionItemResponse : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
    * This function will delete the action item from the database 
    * @param {*} userIdFromToken
    * @param {*} userNameFromToken
    * @param {*} remediationData
    * @returns
    */
    async deleteActionItem(userIdFromToken, userNameFromToken, remediationData, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Execution started.");
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

            request.input("ActionItemID",   MSSQL.BigInt,   remediationData.ActionItemID);
            request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
            request.input("AccountGUID", MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",       MSSQL.Bit);
            request.output("OutMessage",    MSSQL.VarChar);

            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Input parameters value for [BCM].[RMT_DeleteActionItem] procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : remediationData        = " + JSON.stringify(remediationData));
            logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : AccountGUID        = " + accountGUIDFromToken);

            return request.execute("[BCM].[RMT_DeleteActionItem]").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Output parameters value of [BCM].[RMT_DeleteActionItem] procedure.");
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : remediationData     = " + JSON.stringify(remediationData));
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Success             = " + result.output.Success);
                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : OutMessage          = " + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log("info", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Execution end.");

                return dbResponseObj;
            }).catch(function (error) {
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Input parameters value for [BCM].[RMT_DeleteActionItem] procedure.");
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : remediationData      = " + JSON.stringify(remediationData));
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : UserName             = " + userNameFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : AccountGUID        = " + accountGUIDFromToken);
                logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Execution end. : Error details : " + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Input parameters value for [BCM].[RMT_DeleteActionItem] procedure.");
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : remediationData           = " + JSON.stringify(remediationData));
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : UserName                  = " + userNameFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : AccountGUID        = " + accountGUIDFromToken);
            logger.log("error", "User Id : " + userIdFromToken + " : remediationTrackerDB : deleteActionItem : Execution end. : Error details : " + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    stop() {}
};
