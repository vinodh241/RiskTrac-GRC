const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ProcessDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Process details from database
     * @param {ProcessID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllProcess(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ProcessDb : getAllProcess : Execution started.');
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
 
            request.input('ProcessID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Input parameters value of ORM.GetProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetProcess').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Output parameters value of ORM.GetProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Input parameters value of ORM.GetProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : ProcessID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Input parameters value of ORM.GetProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : getAllProcess : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active Process details from database
     * @param {ProcessID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveProcess(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ProcessDb : getAllActiveProcess : Execution started.');
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
 
            request.input('ProcessID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Input parameters value of ORM.GetProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetProcess').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Output parameters value of ORM.GetProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Input parameters value of ORM.GetProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : ProcessID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Input parameters value of ORM.GetProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : getAllActiveProcess : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Process details by ID from database
     * @param {ProcessID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getProcessByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ProcessDb : getProcessByID : Execution started.');
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
 
            request.input('ProcessID',    MSSQL.Int, binds.id);           
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Input parameters value of ORM.GetProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetProcess').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Output parameters value of ORM.GetProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Input parameters value of ORM.GetProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : ProcessID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Input parameters value of ORM.GetProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : getProcessByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in Process table
     * @param {Name, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addProcess(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ProcessDb : addProcess : Execution started.');
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
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Input parameters value of ORM.AddProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddProcess').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Output parameters value of ORM.AddProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Input parameters value of ORM.AddProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Name    = ' + binds.name);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Input parameters value of ORM.AddProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : addProcess : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update Process table
     * @param {ProcessID, Name, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateProcess(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ProcessDb : updateProcess : Execution started.');
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
            request.input('ProcessID',    MSSQL.Int, binds.id);
            request.input('Name',    MSSQL.NVarChar, binds.name);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Input parameters value of ORM.UpdateProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateProcess').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Output parameters value of ORM.UpdateProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Input parameters value of ORM.UpdateProcess procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : ProcessID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Name    = ' + binds.name);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Input parameters value of ORM.UpdateProcess procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Name    = ' + binds.name);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcess : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update Process Status
     * @param {ProcessID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateProcessStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ProcessDb : updateProcessStatus : Execution started.');
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
            request.input('ProcessID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : Input parameters value of ORM.UpdateProcessStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateProcessStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus : Output parameters value of ORM.UpdateProcessStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : Input parameters value of ORM.UpdateProcessStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : ProcessID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : Input parameters value of ORM.UpdateProcessStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : ProcessID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ProcessDb : UpdateProcessStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ProcessDb : updateProcessStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}