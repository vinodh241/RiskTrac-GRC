const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ControlFrequencyScoreDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch ControlFrequencyScore details from database
     * @param {ControlFrequencyID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getAllControlFrequencyScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Execution started.');
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
 
            request.input('ControlFrequencyID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Input parameters value of ORM.GetControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlFrequencyScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Output parameters value of ORM.GetControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Input parameters value of ORM.GetControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Input parameters value of ORM.GetControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllControlFrequencyScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlFrequencyScore details from database
     * @param {ControlFrequencyID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getAllActiveControlFrequencyScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Execution started.');
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
 
            request.input('ControlFrequencyID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Input parameters value of ORM.GetControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : IsActive    = ' + 1);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlFrequencyScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Output parameters value of ORM.GetControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Input parameters value of ORM.GetControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : IsActive    = ' + 1);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Input parameters value of ORM.GetControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : IsActive    = ' + 1);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getAllActiveControlFrequencyScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlFrequencyScore details from database
     * @param {ControlFrequencyID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getControlFrequencyScoreByID(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Execution started.');
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
 
            request.input('ControlFrequencyID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Input parameters value of ORM.GetControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlFrequencyScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Output parameters value of ORM.GetControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Input parameters value of ORM.GetControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : ControlFrequencyID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Input parameters value of ORM.GetControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : getControlFrequencyScoreByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in ControlFrequencyScore table
     * @param {Frequency, Score, CreatedBy } binds
     * @returns 
     */
    async addControlFrequencyScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlFrequencyScoreDb : addControlFrequencyScore : Execution started.');
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
            request.input('Frequency',    MSSQL.NVarChar, binds.frequency);
	        request.input('Score',    MSSQL.Int, binds.score);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Input parameters value of ORM.AddControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : FrequencyID    = ' + binds.frequency);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddControlFrequencyScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Output parameters value of ORM.AddControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Input parameters value of ORM.AddControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : FrequencyID    = ' + binds.frequency);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Input parameters value of ORM.AddControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : FrequencyID    = ' + binds.frequency);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : addControlFrequencyScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ControlFrequencyScore table
     * @param {ControlFrequencyID, Frequency, Score, LastUpdatedBy} binds
     * @returns 
     */
    async updateControlFrequencyScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlFrequencyScoreDb : updateControlFrequencyScore : Execution started.');
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
            request.input('ControlFrequencyID',    MSSQL.Int, binds.id);
            request.input('Frequency',    MSSQL.NVarChar, binds.frequency);
            request.input('Score',    MSSQL.Int , binds.score);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Input parameters value of ORM.UpdateControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : FrequencyID    = ' + binds.frequency);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlFrequencyScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Output parameters value of ORM.UpdateControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Input parameters value of ORM.UpdateControlFrequencyScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : FrequencyID    = ' + binds.frequency);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Input parameters value of ORM.UpdateControlFrequencyScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : FrequencyID    = ' + binds.frequency);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update ControlFrequencyScore Status
     * @param {ControlFrequencyID, IsActive, LastUpdatedBy } binds
     * @returns 
     */
    async updateControlFrequencyScoreStatus(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Execution started.');
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
            request.input('ControlFrequencyID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Input parameters value of ORM.UpdateControlFrequencyScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlFrequencyScoreStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Output parameters value of ORM.UpdateControlFrequencyScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Input parameters value of ORM.UpdateControlFrequencyScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : ControlFrequencyID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Input parameters value of ORM.UpdateControlFrequencyScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : ControlFrequencyID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlFrequencyScoreDb : updateControlFrequencyScoreStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}