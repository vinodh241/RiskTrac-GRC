const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class GroupDb {
    constructor() {
    }

    start() {
    }

    
    /**
     * This function will fetch all active Group details from database
     * @param {GroupID, IsActive, CreatedBy , accountGUIDFromToken} binds
     * @returns 
     */
     async getAllActiveGroup(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : GroupDb : getAllActiveGroup : Execution started.');
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
 
            request.input('GroupID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Input parameters value of ORM.GetGroup procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetGroup').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Output parameters value of ORM.GetGroup procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Input parameters value of ORM.GetGroup procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : ControlTotalScoreID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Input parameters value of ORM.GetGroup procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : ControlTotalScoreID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : GroupDb : getAllActiveGroup : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Group details by ID from database
     * @param {GroupID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getGroupByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : GroupDb : getGroupByID : Execution started.');
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
 
            request.input('GroupID',    MSSQL.Int, binds.id);           
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Input parameters value of ORM.GetGroup procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : GroupID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetGroup').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Output parameters value of ORM.GetGroup procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Input parameters value of ORM.GetGroup procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : GroupID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Input parameters value of ORM.GetGroup procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : GroupID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : GroupDb : getGroupByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}