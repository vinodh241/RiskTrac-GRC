const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ControlAutomationScoreDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch ControlAutomationScore details from database
     * @param {ControlAutomationID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getAllControlAutomationScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlAutomationScoreDb : getAllControlAutomationScore : Execution started.');
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
 
            request.input('ControlAutomationID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Input parameters value of ORM.GetControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : AccountGUID    = ' + accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlAutomationScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Output parameters value of ORM.GetControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Input parameters value of ORM.GetControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : ControlAutomationID       = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Input parameters value of ORM.GetControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllControlAutomationScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlAutomationScore details from database
     * @param {ControlAutomationID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getAllActiveControlAutomationScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Execution started.');
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
 
            request.input('ControlAutomationID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Input parameters value of ORM.GetControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlAutomationScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Output parameters value of ORM.GetControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Input parameters value of ORM.GetControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : ControlAutomationID       = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Input parameters value of ORM.GetControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getAllActiveControlAutomationScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlAutomationScore details from database
     * @param {ControlAutomationID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getControlAutomationScoreByID(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlAutomationScoreDb : getControlAutomationScoreByID : Execution started.');
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
 
            request.input('ControlAutomationID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Input parameters value of ORM.GetControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlAutomationScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Output parameters value of ORM.GetControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Input parameters value of ORM.GetControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : ControlAutomationID       = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Input parameters value of ORM.GetControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : getControlAutomationScoreByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in ControlAutomationScore table
     * @param {LevelOfControl, Score, CreatedBy } binds
     * @returns 
     */
    async addControlAutomationScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlAutomationScoreDb : addControlAutomationScore : Execution started.');
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
            request.input('LevelOfControl',    MSSQL.NVarChar, binds.levelOfControl);
	        request.input('Score',    MSSQL.Int, binds.score);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Input parameters value of ORM.AddControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : LevelOfControl       = ' + binds.levelOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddControlAutomationScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Output parameters value of ORM.AddControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Input parameters value of ORM.AddControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : LevelOfControl       = ' + binds.levelOfControl);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {            
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Input parameters value of ORM.AddControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : LevelOfControl       = ' + binds.levelOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : addControlAutomationScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ControlAutomationScore table
     * @param {ControlAutomationID, LevelOfControl, Score, LastUpdatedBy} binds
     * @returns 
     */
    async updateControlAutomationScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlAutomationScoreDb : updateControlAutomationScore : Execution started.');
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
            request.input('ControlAutomationID',    MSSQL.Int, binds.id);
            request.input('LevelOfControl',    MSSQL.NVarChar, binds.levelOfControl);
            request.input('Score',    MSSQL.Int , binds.score);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Input parameters value of ORM.UpdateControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : LevelOfControl       = ' + binds.levelOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlAutomationScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Output parameters value of ORM.UpdateControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Input parameters value of ORM.UpdateControlAutomationScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : ControlAutomationID       = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : LevelOfControl       = ' + binds.levelOfControl);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Input parameters value of ORM.UpdateControlAutomationScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : LevelOfControl       = ' + binds.levelOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update ControlAutomationScore Status
     * @param {ControlAutomationID, IsActive, LastUpdatedBy } binds
     * @returns 
     */
    async updateControlAutomationScoreStatus(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Execution started.');
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
            request.input('ControlAutomationID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Input parameters value of ORM.UpdateControlAutomationScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : IsActive       = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlAutomationScoreStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Output parameters value of ORM.UpdateControlAutomationScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Input parameters value of ORM.UpdateControlAutomationScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : ControlAutomationID       = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : IsActive       = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Input parameters value of ORM.UpdateControlAutomationScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : ControlAutomationID       = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : IsActive       = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ControlAutomationScoreDb : updateControlAutomationScoreStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}