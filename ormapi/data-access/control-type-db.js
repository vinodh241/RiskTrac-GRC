const MSSQL = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ = require('../utility/message/message-constant.js');

module.exports = class ControlTypeDb {
    constructor() { }
    start() { }

    // Get all (by Id/IsActive)
    async getAllControlType(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : getAllControlType : Execution started.');
        const dbResponseObj = { status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL };
        try {
            const request = new MSSQL.Request(poolConnectionObject);
            request.input('ControlTypeID', MSSQL.Int, binds.id);
            request.input('IsActive', MSSQL.Bit, binds.isActive);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : getAllControlType : Params ready.');
            return request.execute('[ORM].GetControlType').then(result => {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : getAllControlType : Output -> Success=' + result.output.Success + ', OutMessage=' + result.output.OutMessage);
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE; dbResponseObj.procedureSuccess = result.output.Success; dbResponseObj.procedureMessage = result.output.OutMessage; dbResponseObj.recordset = result.recordsets;
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : getAllControlType : Execution end.');
                return dbResponseObj;
            }).catch(error => {
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeDb : getAllControlType : Exec error : ' + error);
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO; dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR; return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeDb : getAllControlType : Unhandled : ' + error);
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO; dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER; return dbResponseObj;
        }
    } 

    // Add/update (bulk JSON) -> [ORM].[RCSA_AddControlType]
    async addControlType(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : addControlType : Execution started.');
        const dbResponseObj = { status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE, procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL };
        try {
            const request = new MSSQL.Request(poolConnectionObject);
            request.input('ControlTypeData', MSSQL.NVarChar(MSSQL.MAX), binds.controlTypeDataJson);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : addControlType : Params ready.');
            return request.execute('[ORM].[RCSA_AddControlType]').then(result => {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : addControlType : Output -> Success=' + result.output.Success + ', OutMessage=' + result.output.OutMessage);
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE; 
                dbResponseObj.procedureSuccess = result.output.Success; 
                dbResponseObj.procedureMessage = result.output.OutMessage; 
                dbResponseObj.recordset = result.recordsets;
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeDb : addControlType : Execution end.');
                return dbResponseObj;
            }).catch(error => {
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeDb : addControlType : Exec error : ' + error);
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO; 
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR; 
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeDb : addControlType : Unhandled : ' + error);
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO; 
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER; 
            return dbResponseObj;
        }
    }    
 

stop() { }
}
