const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class UnitDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Unit details from database
     * @param {UnitID, GroupID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveUnitByGroupID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : UnitDb : getAllActiveUnitByGroupID : Execution started.');
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
 
            request.input('UnitID',    MSSQL.Int, binds.id);
            request.input('GroupID',    MSSQL.Int, binds.groupID);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Input parameters value of ORM.GetUnit procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : UnitID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : GroupID    = ' + binds.groupID);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetUnit').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Output parameters value of ORM.GetUnit procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Input parameters value of ORM.GetUnit procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : UnitID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : GroupID    = ' + binds.groupID);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Input parameters value of ORM.GetUnit procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : UnitID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : GroupID    = ' + binds.groupID);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnitByGroupID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all active Unit details from database
     * @param {UnitID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveUnit(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : UnitDb : getAllActiveUnit : Execution started.');
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
 
            request.input('UnitID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Input parameters value of ORM.GetUnit procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : UnitID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetUnit').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Output parameters value of ORM.GetUnit procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Input parameters value of ORM.GetUnit procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : UnitID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Input parameters value of ORM.GetUnit procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : UnitID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : UnitDb : getAllActiveUnit : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Unit details by ID from database
     * @param {UnitID, CreatedBy } binds
     * @returns 
     */
     async getUnitByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : UnitDb : getUnitByID : Execution started.');
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
 
            request.input('UnitID',    MSSQL.Int, binds.id);           
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Input parameters value of ORM.GetUnit procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : UnitID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetUnit').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Output parameters value of ORM.GetUnit procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Input parameters value of ORM.GetUnit procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : UnitID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Input parameters value of ORM.GetUnit procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : UnitID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : UnitDb : getUnitByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}