const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class InherentRiskDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all InherentRisk details from database
     * @param {id, isActive, createdBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllInherentRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : getAllInherentRisk : Execution started.');
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
 
            request.input('InherentRiskID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Output parameters value of ORM.GetInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Input parameters value of ORM.GetInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : InherentRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllInherentRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all InherentRisk details from database
     * @param {InherentRiskID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getDataForManageInherentRiskScreen(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : getDataForManageInherentRiskScreen : Execution started.');
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
 
            request.input('InherentRiskID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Input parameters value of ORM.getDataForManageInherentRiskScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].getDataForManageInherentRiskScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Output parameters value of ORM.getDataForManageInherentRiskScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Input parameters value of ORM.getDataForManageInherentRiskScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : InherentRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Input parameters value of ORM.getDataForManageInherentRiskScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getDataForManageInherentRiskScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active InherentRisk details from database
     * @param {InherentRiskID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveInherentRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : getAllActiveInherentRisk : Execution started.');
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
 
            request.input('InherentRiskID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Output parameters value of ORM.GetInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getAllActiveInherentRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch InherentRisk details by ID from database
     * @param {InherentRiskID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getInherentRiskByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : getInherentRiskByID : Execution started.');
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
 
            request.input('InherentRiskID',    MSSQL.Int, binds.id);           
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Output parameters value of ORM.GetInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Input parameters value of ORM.GetInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : InherentRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Input parameters value of ORM.GetInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : getInherentRiskByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in InherentRisk table
     * @param {UnitID, ProcessID, RiskCategoryID, Risk, InherentLikelihoodID, InherentImpactRatingID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addInherentRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : addInherentRisk : Execution started.');
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
            request.input('UnitID',                  MSSQL.Int,      binds.unitID);
            request.input('ProcessID',               MSSQL.Int,      binds.processID  );
            request.input('RiskCategoryID',          MSSQL.Int,      binds.riskCategoryID);
            request.input('Risk',                    MSSQL.VarChar,  binds.risk);
            request.input('InherentLikelihoodID',    MSSQL.Int,      binds.inherentLikelihoodID);
            request.input('InherentImpactRatingID',  MSSQL.Int,      binds.inherentImpactRatingID);
            request.input('CreatedBy',               MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',             MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',                MSSQL.Bit);
            request.output('OutMessage',             MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Input parameters value of ORM.AddInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : UnitID                      = ' + binds.unitID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : ProcessID                   = ' + binds.processID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : RiskCategoryID              = ' + binds.riskCategoryID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Risk                        = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : InherentLikelihoodID        = ' + binds.inherentLikelihoodID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : InherentImpactRatingID      = ' + binds.inherentImpactRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : CreatedBy                   = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : AccountGUID                   = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddInherentRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Output parameters value of ORM.AddInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;
                
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Input parameters value of ORM.AddInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : UnitID                  = ' + binds.unitID);
                // logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : ProcessID    = ' + binds.processID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : RiskCategoryID          = ' + binds.riskCategoryID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Risk                    = ' + binds.risk);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : InherentLikelihoodID    = ' + binds.inherentLikelihoodID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : InherentImpactRatingID  = ' + binds.inherentImpactRatingID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : CreatedBy               = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : AccountGUID                   = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Input parameters value of ORM.AddInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : UnitID    = ' + binds.unitID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : ProcessID    = ' + binds.processID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : RiskCategoryID    = ' + binds.riskCategoryID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Risk    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : InherentLikelihoodID    = ' + binds.inherentLikelihoodID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : InherentImpactRatingID    = ' + binds.inherentImpactRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : AccountGUID                   = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : addInherentRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update InherentRisk table
     * @param {InherentRiskID, UnitID, ProcessID, RiskCategoryID, Risk, InherentLikelihoodID, InherentImpactRatingID, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateInherentRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : updateInherentRisk : Execution started.');
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
            request.input('InherentRiskID',    MSSQL.Int, binds.id);
            request.input('UnitID',    MSSQL.Int, binds.unitID);
            request.input('ProcessID',    MSSQL.Int, binds.processID);
            request.input('RiskCategoryID',    MSSQL.Int, binds.riskCategoryID);
            request.input('Risk',    MSSQL.VarChar, binds.risk);
            request.input('InherentLikelihoodID',    MSSQL.Int, binds.inherentLikelihoodID);
            request.input('InherentImpactRatingID',    MSSQL.Int, binds.inherentImpactRatingID);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('LastUpdatedBy', MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Input parameters value of ORM.UpdateInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : UnitID    = ' + binds.unitID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : ProcessID    = ' + binds.processID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : RiskCategoryID    = ' + binds.riskCategoryID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Risk    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentLikelihoodID    = ' + binds.inherentLikelihoodID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentImpactRatingID    = ' + binds.inherentImpactRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateInherentRisk').then(function (result) {
                
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Output parameters value of ORM.UpdateInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Input parameters value of ORM.UpdateInherentRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : UnitID    = ' + binds.unitID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : ProcessID    = ' + binds.processID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : RiskCategoryID    = ' + binds.riskCategoryID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Risk    = ' + binds.risk);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentLikelihoodID    = ' + binds.inherentLikelihoodID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentImpactRatingID    = ' + binds.inherentImpactRatingID);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Input parameters value of ORM.UpdateInherentRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : UnitID    = ' + binds.unitID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : ProcessID    = ' + binds.processID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : RiskCategoryID    = ' + binds.riskCategoryID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Risk    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentLikelihoodID    = ' + binds.inherentLikelihoodID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : InherentImpactRatingID    = ' + binds.inherentImpactRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update InherentRisk Status
     * @param {InherentRiskID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateInherentRiskStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskDb : updateInherentRiskStatus : Execution started.');
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
            request.input('InherentRiskID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Input parameters value of ORM.UpdateInherentRiskStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateInherentRiskStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Output parameters value of ORM.UpdateInherentRiskStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Input parameters value of ORM.UpdateInherentRiskStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : InherentRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Input parameters value of ORM.UpdateInherentRiskStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : InherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskDb : updateInherentRiskStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}