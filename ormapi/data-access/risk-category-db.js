const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class RiskCategoryDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Risk Category details from database
     * @param {RiskCategoryID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllRiskCategory(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : RiskCategoryDb : getAllRiskCategory : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
 
            request.input('RiskCategoryID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.TinyInt , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Input parameters value of ORM.GetRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetRiskCategory').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Output parameters value of ORM.GetRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Input parameters value of ORM.GetRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : RiskCategoryID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Input parameters value of ORM.GetRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllRiskCategory : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active Risk Category details from database
     * @param {RiskCategoryID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveRiskCategory(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : RiskCategoryDb : getAllActiveRiskCategory : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
 
            request.input('RiskCategoryID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Input parameters value of ORM.GetRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetRiskCategory').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Output parameters value of ORM.GetRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Input parameters value of ORM.GetRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : RiskCategoryID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Input parameters value of ORM.GetRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getAllActiveRiskCategory : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Risk Category details By ID from database
     * @param {RiskCategoryID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getRiskCategoryByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : RiskCategoryDb : getRiskCategoryByID : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
 
            request.input('RiskCategoryID',    MSSQL.Int, binds.id);           
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Input parameters value of ORM.GetRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetRiskCategory').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Output parameters value of ORM.GetRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Input parameters value of ORM.GetRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : RiskCategoryID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Input parameters value of ORM.GetRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : getRiskCategoryByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in Risk Category table
     * @param {Category, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addRiskCategory(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : RiskCategoryDb : addRiskCategory : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('Category', MSSQL.NVarChar, binds.category);
            request.input('CorporateObjectiveID', MSSQL.Int, binds.CorporateObjectiveID);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Input parameters value of ORM.AddRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Category    = ' + binds.category);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : CorporateObjectiveID    = ' + binds.CorporateObjectiveID || 0);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddRiskCategory').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Output parameters value of ORM.AddRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Input parameters value of ORM.AddRiskCategory procedure.');
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Category    = ' + binds.category);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : CorporateObjectiveID    = ' + binds.CorporateObjectiveID || 0);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Input parameters value of ORM.AddRiskCategory procedure.');
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Category    = ' + binds.category);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : CorporateObjectiveID    = ' + binds.CorporateObjectiveID || 0);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : addRiskCategory : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update Risk Category table
     * @param {RiskCategoryID, Category, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateRiskCategory(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : RiskCategoryDb : updateRiskCategory : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('RiskCategoryID', MSSQL.Int, binds.id);
            request.input('Category', MSSQL.NVarChar, binds.category);
            request.input('CorporateObjectiveID', MSSQL.Int, binds.CorporateObjectiveID);
            request.input('LastUpdatedBy', MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Input parameters value of ORM.UpdateRiskCategory procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Category    = ' + binds.category);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : CorporateObjectiveID    = ' + binds.CorporateObjectiveID || 0);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateRiskCategory').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Output parameters value of ORM.UpdateRiskCategory procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Input parameters value of ORM.UpdateRiskCategory procedure.');
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : RiskCategoryID    = ' + binds.id);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Category    = ' + binds.category);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : CorporateObjectiveID    = ' + binds.CorporateObjectiveID || 0);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Input parameters value of ORM.UpdateRiskCategory procedure.');
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : RiskCategoryID    = ' + binds.id);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Category    = ' + binds.category);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : CorporateObjectiveID    = ' + binds.CorporateObjectiveID || 0);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategory : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update Risk Category Status
     * @param {RiskCategoryID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateRiskCategoryStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : RiskCategoryDb : updateRiskCategoryStatus : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {

            var isActive=binds.isActive==true?1:0;
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            request.input('RiskCategoryID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Input parameters value of ORM.UpdateRiskCategoryStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateRiskCategoryStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Output parameters value of ORM.UpdateRiskCategoryStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Input parameters value of ORM.UpdateRiskCategoryStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : RiskCategoryID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Input parameters value of ORM.UpdateRiskCategoryStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : RiskCategoryID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateRiskCategoryStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}