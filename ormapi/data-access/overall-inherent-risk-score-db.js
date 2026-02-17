const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class OverallInherentRiskScoreDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch OverallInherentRiskScore details from database
     * @param {OverallInherentRiskScoreID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllOverallInherentRiskScore(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Execution started.');
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
 
            request.input('OverallInherentRiskScoreID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallInherentRiskScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Output parameters value of ORM.GetOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllOverallInherentRiskScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallInherentRiskScore details from database
     * @param {OverallInherentRiskScoreID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveOverallInherentRiskScore(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Execution started.');
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
 
            request.input('OverallInherentRiskScoreID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallInherentRiskScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Output parameters value of ORM.GetOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getAllActiveOverallInherentRiskScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallInherentRiskScore details from database
     * @param {OverallInherentRiskScoreID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getOverallInherentRiskScoreByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Execution started.');
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
 
            request.input('OverallInherentRiskScoreID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallInherentRiskScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Output parameters value of ORM.GetOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : OverallInherentRiskScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Input parameters value of ORM.GetOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : getOverallInherentRiskScoreByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in OverallInherentRiskScore table
     * @param { Computation, ComputationCode, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addOverallInherentRiskScore(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Execution started.');
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
	        request.input('Computation',    MSSQL.NVarChar, binds.computation);
            request.input('ComputationCode',    MSSQL.NVarChar, binds.computationCode);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Input parameters value of ORM.AddOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddOverallInherentRiskScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Output parameters value of ORM.AddOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Input parameters value of ORM.AddOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Computation    = ' + binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : ComputationCode    = ' + binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Input parameters value of ORM.AddOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : addOverallInherentRiskScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update OverallInherentRiskScore table
     * @param {OverallInherentRiskScoreID, Computation, ComputationCode, LastUpdatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async updateOverallInherentRiskScore(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Execution started.');
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
            request.input('OverallInherentRiskScoreID',    MSSQL.Int, binds.id);
            request.input('Computation',    MSSQL.NVarChar , binds.computation);
            request.input('ComputationCode',    MSSQL.NVarChar , binds.computationCode);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Input parameters value of ORM.UpdateOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateOverallInherentRiskScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Output parameters value of ORM.UpdateOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Input parameters value of ORM.UpdateOverallInherentRiskScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Computation    = ' + binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : ComputationCode    = ' + binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Input parameters value of ORM.UpdateOverallInherentRiskScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update InherentLikelihoodScore Status
     * @param {OverallInherentRiskScoreID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateOverallInherentRiskScoreStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Execution started.');
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
            request.input('OverallInherentRiskScoreID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Input parameters value of ORM.UpdateOverallInherentRiskScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateOverallInherentRiskScoreStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Output parameters value of ORM.UpdateOverallInherentRiskScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateOverallInherentRiskScoreStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Input parameters value of ORM.UpdateOverallInherentRiskScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : OverallInherentRiskScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Input parameters value of ORM.UpdateOverallInherentRiskScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : OverallInherentRiskScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskScoreDb : updateOverallInherentRiskScoreStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}