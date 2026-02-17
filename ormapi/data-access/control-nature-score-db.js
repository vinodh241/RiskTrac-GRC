const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ControlNatureScoreDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch ControlNatureScore details from database
     * @param {ControlNatureID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getAllControlNatureScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlNatureScoreDb : getAllControlNatureScore : Execution started.');
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
 
            request.input('ControlNatureID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Input parameters value of ORM.GetControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlNatureScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Output parameters value of ORM.GetControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Input parameters value of ORM.GetControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : ControlNatureID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Input parameters value of ORM.GetControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllControlNatureScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlNatureScore details from database
     * @param {ControlNatureID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getAllActiveControlNatureScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlNatureScoreDb : getAllActiveControlNatureScore : Execution started.');
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
 
            request.input('ControlNatureID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Input parameters value of ORM.GetControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlNatureScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Output parameters value of ORM.GetControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Input parameters value of ORM.GetControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : ControlNatureID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Input parameters value of ORM.GetControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getAllActiveControlNatureScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlNatureScore details from database
     * @param {ControlNatureID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getControlNatureScoreByID(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlNatureScoreDb : getControlNatureScoreByID : Execution started.');
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
 
            request.input('ControlNatureID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Input parameters value of ORM.GetControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlNatureScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Output parameters value of ORM.GetControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : OutMessage    = ' + result.output.OutMessage);
                
               
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Input parameters value of ORM.GetControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : ControlNatureID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : IsActive    = '+binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Input parameters value of ORM.GetControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : getControlNatureScoreByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in ControlNatureScore table
     * @param {NatureOfControl, Score, CreatedBy } binds
     * @returns 
     */
     async addControlNatureScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlNatureScoreDb : addControlNatureScore : Execution started.');
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
            request.input('NatureOfControl',    MSSQL.NVarChar, binds.natureOfControl);
	        request.input('Score',    MSSQL.Int, binds.score);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Input parameters value of ORM.AddControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : NatureOfControl    = ' + binds.natureOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Score    = '+binds.Score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddControlNatureScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Output parameters value of ORM.AddControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Input parameters value of ORM.AddControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : NatureOfControl    = ' + binds.natureOfControl);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Score    = '+binds.Score);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Input parameters value of ORM.AddControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : NatureOfControl    = ' + binds.natureOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Score    = '+binds.Score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : addControlNatureScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ControlNatureScore table
     * @param {ControlNatureID, NatureOfControl, Score, LastUpdatedBy} binds
     * @returns 
     */
     async updateControlNatureScore(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlNatureScoreDb : updateControlNatureScore : Execution started.');
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
            request.input('ControlNatureID',    MSSQL.Int, binds.id);
            request.input('NatureOfControl',    MSSQL.NVarChar, binds.natureOfControl);
            request.input('Score',    MSSQL.Int , binds.score);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Input parameters value of ORM.UpdateControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : NatureOfControl    = ' + binds.natureOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Score    = '+binds.Score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlNatureScore').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Output parameters value of ORM.UpdateControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Input parameters value of ORM.UpdateControlNatureScore procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : ControlNatureID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : NatureOfControl    = ' + binds.natureOfControl);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Score    = '+binds.Score);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Input parameters value of ORM.UpdateControlNatureScore procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : NatureOfControl    = ' + binds.natureOfControl);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Score    = '+binds.Score);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScore : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update ControlNatureScore Status
     * @param {ControlNatureID, IsActive, LastUpdatedBy } binds
     * @returns 
     */
     async updateControlNatureScoreStatus(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlNatureScoreDb : updateControlNatureScoreStatus : Execution started.');
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
            request.input('ControlNatureID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Input parameters value of ORM.UpdateControlNatureScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlNatureScoreStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Output parameters value of ORM.UpdateControlNatureScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Input parameters value of ORM.UpdateControlNatureScoreStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : ControlNatureID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Input parameters value of ORM.UpdateControlNatureScoreStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : ControlNatureID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlNatureScoreDb : updateControlNatureScoreStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}