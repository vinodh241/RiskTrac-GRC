const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class OverallInherentRiskRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch OverallInherentRiskRating details from database
     * @param {OverallInherentRiskRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllOverallInherentRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Execution started.');
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
 
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallInherentRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Output parameters value of ORM.GetOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllOverallInherentRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallInherentRiskRating details from database
     * @param {OverallInherentRiskRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveOverallInherentRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Execution started.');
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
 
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallInherentRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Output parameters value of ORM.GetOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getAllActiveOverallInherentRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallInherentRiskRating details from database
     * @param {OverallInherentRiskRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getOverallInherentRiskRatingByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Execution started.');
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
 
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallInherentRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Output parameters value of ORM.GetOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : OverallInherentRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : IsActive    = '+binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Input parameters value of ORM.GetOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : getOverallInherentRiskRatingByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in OverallInherentRiskRating table
     * @param {RiskRating, Computation, ComputationCode, ColourName, ColourCode, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addOverallInherentRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Execution started.');
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
            request.input('RiskRating',    MSSQL.NVarChar, binds.riskRating);
	        request.input('Computation',    MSSQL.NVarChar, binds.computation);
            request.input('ComputationCode',    MSSQL.NVarChar , binds.computationCode);
            request.input('ColourName',    MSSQL.NVarChar , binds.colourName);
	        request.input('ColourCode',    MSSQL.NVarChar, binds.colourCode);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Input parameters value of ORM.AddOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddOverallInherentRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Output parameters value of ORM.AddOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Input parameters value of ORM.AddOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : RiskRating    = ' + binds.riskRating);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Computation    = '+binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ComputationCode    = '+binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ColourName    = '+binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ColourCode    = '+binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Input parameters value of ORM.AddOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : addOverallInherentRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update OverallInherentRiskRating table
     * @param {OverallInherentRiskRatingID, RiskRating, Computation, ComputationCode, ColourName, ColourCode, LastUpdatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async updateOverallInherentRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Execution started.');
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
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.id);
            request.input('RiskRating',    MSSQL.VarChar, binds.riskRating);
            request.input('Computation',    MSSQL.NVarChar , binds.computation);
            request.input('ComputationCode',    MSSQL.NVarChar , binds.computationCode);
            request.input('ColourName',    MSSQL.NVarChar , binds.colourName);
	        request.input('ColourCode',    MSSQL.NVarChar , binds.colourCode);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Input parameters value of ORM.UpdateOverallInherentRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateOverallInherentRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Output parameters value of ORM.UpdateOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Input parameters value of ORM.UpdateOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : RiskRating    = ' + binds.riskRating);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Computation    = '+binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ComputationCode    = '+binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ColourName    = '+binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ColourCode    = '+binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Input parameters value of ORM.UpdateOverallInherentRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : OverallInherentRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : RiskRating    = ' + binds.riskRating);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Computation    = '+binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ComputationCode    = '+binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ColourName    = '+binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : ColourCode    = '+binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update InherentLikelihoodRating Status
     * @param {OverallInherentRiskRatingID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateOverallInherentRiskRatingStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus : Execution started.');
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
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : Input parameters value of ORM.UpdateOverallInherentRiskRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateOverallInherentRiskRatingStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus : Output parameters value of ORM.UpdateOverallInherentRiskRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateOverallInherentRiskRatingStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : Input parameters value of ORM.UpdateOverallInherentRiskRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : OverallInherentRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : Input parameters value of ORM.UpdateOverallInherentRiskRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : OverallInherentRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : UpdateOverallInherentRiskRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallInherentRiskRatingDb : updateOverallInherentRiskRatingStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}