const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ControlInPaceDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch ControlInPace details from database
     * @param {ControlInPaceID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getAllControlInPace(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlInPaceDb : getAllControlInPace : Execution started.');
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
 
            request.input('ControlInPaceID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Input parameters value of ORM.GetControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlInPace').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Output parameters value of ORM.GetControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Input parameters value of ORM.GetControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : ControlInPaceID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Input parameters value of ORM.GetControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllControlInPace : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlInPace details from database
     * @param {ControlInPaceID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getAllActiveControlInPace(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlInPaceDb : getAllActiveControlInPace : Execution started.');
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
 
            request.input('ControlInPaceID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Input parameters value of ORM.GetControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlInPace').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Output parameters value of ORM.GetControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Input parameters value of ORM.GetControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : ControlInPaceID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Input parameters value of ORM.GetControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getAllActiveControlInPace : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ControlInPace details from database
     * @param {ControlInPaceID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getControlInPaceByID(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlInPaceDb : getControlInPaceByID : Execution started.');
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
 
            request.input('ControlInPaceID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Input parameters value of ORM.GetControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlInPace').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Output parameters value of ORM.GetControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControgetControlInPaceByIDlInPace : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Input parameters value of ORM.GetControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : ControlInPaceID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : IsActive    = '+binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Input parameters value of ORM.GetControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : getControlInPaceByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in ControlInPace table
     * @param {Name, CreatedBy } binds
     * @returns 
     */
     async addControlInPace(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlInPaceDb : addControlInPace : Execution started.');
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
            request.input('Name',    MSSQL.NVarChar, binds.name);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Input parameters value of ORM.AddControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddControlInPace').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Output parameters value of ORM.AddControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Input parameters value of ORM.AddControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Name    = ' + binds.name);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Input parameters value of ORM.AddControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : addControlInPace : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ControlInPace table
     * @param {ControlInPaceID, Name, LastUpdatedBy} binds
     * @returns 
     */
     async updateControlInPace(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlInPaceDb : updateControlInPace : Execution started.');
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
            request.input('ControlInPaceID',    MSSQL.Int, binds.id);
            request.input('Name',    MSSQL.NVarChar, binds.name);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Input parameters value of ORM.UpdateControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace :  Parameters value are defined and ready to execute.');
        
            return request.execute('[ORM].UpdateControlInPace').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Output parameters value of ORM.UpdateControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Input parameters value of ORM.UpdateControlInPace procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : ControlInPaceID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Name    = ' + binds.name);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Input parameters value of ORM.UpdateControlInPace procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPace : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update Control In Pace Status
     * @param {ControlInPaceID, IsActive, LastUpdatedBy } binds
     * @returns 
     */
     async updateControlInPaceStatus(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlInPaceDb : updateControlInPaceStatus : Execution started.');
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
            request.input('ControlInPaceID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : Input parameters value of ORM.UpdateControlInPaceStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPaceStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateControlInPaceStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPaceStatus : Output parameters value of ORM.UpdateControlInPaceStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPaceStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPaceStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateControlInPaceStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : Input parameters value of ORM.UpdateControlInPaceStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : ControlInPaceID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPaceStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : Input parameters value of ORM.UpdateControlInPaceStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : ControlInPaceID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlInPaceDb : UpdateControlInPaceStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlInPaceDb : updateControlInPaceStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}