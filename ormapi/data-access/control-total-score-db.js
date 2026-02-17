const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ControlTotalScoreDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch ControlTotalScore details from database
     * @param {ControlTotalScoreID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getAllControlTotalScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlTotalScoreDb : getAllControlTotalScore : Execution started.');
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
 
            request.input('ControlTotalScoreID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Input parameters value of ORM.GetControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlTotalScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Output parameters value of ORM.GetControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : OutMessage    = ' + result.output.OutMessage);
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Input parameters value of ORM.GetControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : ControlTotalScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Input parameters value of ORM.GetControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllControlTotalScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlTotalScore details from database
     * @param {ControlTotalScoreID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getAllActiveControlTotalScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlTotalScoreDb : getAllActiveControlTotalScore : Execution started.');
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
 
            request.input('ControlTotalScoreID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Input parameters value of ORM.GetControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlTotalScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Output parameters value of ORM.GetControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : OutMessage    = ' + result.output.OutMessage);
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Input parameters value of ORM.GetControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : ControlTotalScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Input parameters value of ORM.GetControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getAllActiveControlTotalScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlTotalScore details from database
     * @param {ControlTotalScoreID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getControlTotalScoreByID(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlTotalScoreDb : getControlTotalScoreByID : Execution started.');
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
 
            request.input('ControlTotalScoreID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Input parameters value of ORM.GetControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlTotalScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Output parameters value of ORM.GetControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Input parameters value of ORM.GetControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : ControlTotalScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Input parameters value of ORM.GetControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : getControlTotalScoreByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in ControlTotalScore table
     * @param {Computation, ComputationCode, CreatedBy } binds
     * @returns 
     */
     async addControlTotalScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlTotalScoreDb : addControlTotalScore : Execution started.');
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
            request.input('ComputationCode',MSSQL.NVarChar, binds.computationCode);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Input parameters value of ORM.AddControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddControlTotalScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Output parameters value of ORM.AddControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Input parameters value of ORM.AddControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Computation    = ' + binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : ComputationCode    = ' + binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Input parameters value of ORM.AddControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : addControlTotalScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ControlTotalScore table
     * @param {ControlTotalScoreID, Computation, ComputationCode, LastUpdatedBy} binds
     * @returns 
     */
     async updateControlTotalScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlTotalScoreDb : updateControlTotalScore : Execution started.');
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
            request.input('ControlTotalScoreID',    MSSQL.Int, binds.id);
            request.input('Computation',    MSSQL.NVarChar , binds.computation);
            request.input('ComputationCode',MSSQL.NVarChar, binds.computationCode);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Input parameters value of ORM.UpdateControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlTotalScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Output parameters value of ORM.UpdateControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Input parameters value of ORM.UpdateControlTotalScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : ControlTotalScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Computation    = ' + binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : ComputationCode    = ' + binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Input parameters value of ORM.UpdateControlTotalScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Computation    = ' + binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : ComputationCode    = ' + binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update ControlTotalScore Status
     * @param {ControlTotalScoreID, IsActive, LastUpdatedBy } binds
     * @returns 
     */
     async updateControlTotalScoreStatus(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlTotalScoreDb : updateControlTotalScoreStatus : Execution started.');
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
            request.input('ControlTotalScoreID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Input parameters value of ORM.UpdateControlTotalScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlTotalScoreStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Output parameters value of ORM.UpdateControlTotalScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateControlTotalScoreStatus : Execution end.');

                return dbResponseObj; 
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Input parameters value of ORM.UpdateControlTotalScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : ControlTotalScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Input parameters value of ORM.UpdateControlTotalScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTotalScoreDb : updateControlTotalScoreStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}