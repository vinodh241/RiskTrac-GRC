const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class InherentRiskRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Inherent Risk Rating details from database
     * @param {CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getDataForInherentRiskRatingScreen(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Execution started.');
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
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Input parameters value of ORM.GetDataForInherentRiskRatingScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetDataForInherentRiskRatingScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Output parameters value of ORM.GetDataForInherentRiskRatingScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Input parameters value of ORM.GetDataForInherentRiskRatingScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Input parameters value of ORM.GetDataForInherentRiskRatingScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentRiskRatingScreenDb : getDataForInherentRiskRatingScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}

