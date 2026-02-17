const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ControlEnvironmentRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Inherent Risk Rating details from database
     * @param {CreatedBy } binds
     * @returns 
     */
     async getDataForControlEnvironmentRatingScreen(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Execution started.');
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
 
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID',  MSSQL.UniqueIdentifier,  accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Input parameters value of ORM.GetDataForControlEnvironmentRatingScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetDataForControlEnvironmentRatingScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Output parameters value of ORM.GetDataForControlEnvironmentRatingScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Input parameters value of ORM.GetDataForControlEnvironmentRatingScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Input parameters value of ORM.GetDataForControlEnvironmentRatingScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getDataForControlEnvironmentRatingScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

/**
     * This function will fetch all Inherent Risk Rating details from database
     * @param {CreatedBy } binds
     * @returns 
     */
     async getControlType(binds, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ binds.userId +' : ControlEnvironmentRatingScreenDb : getControlType : Execution started.');
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

            request.input('ControlTypeID', MSSQL.Int, binds.ControlTypeID || 0);
            request.input('IsActive', MSSQL.Bit, binds.IsActive || 1);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getControlType : Input parameters value of ORM.GetControlType procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getControlType : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getControlType :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlType').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : getControlType : Output parameters value of ORM.GetControlType procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : Input parameters value of ORM.GetControlType procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : Input parameters value of ORM.GetControlType procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ControlEnvironmentRatingScreenDb : GetControlType : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }


    stop() {
    }
}

