const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class OverallControlEnvironmentRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch OverallControlEnvironmentRating details from database
     * @param {OverallControlEnvironmentRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllOverallControlEnvironmentRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Execution started.');
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
 
            request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallControlEnvironmentRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Output parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllOverallControlEnvironmentRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallControlEnvironmentRating details from database
     * @param {OverallControlEnvironmentRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveOverallControlEnvironmentRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Execution started.');
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
 
            request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallControlEnvironmentRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Output parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getAllActiveOverallControlEnvironmentRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallControlEnvironmentRating details from database
     * @param {OverallControlEnvironmentRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getOverallControlEnvironmentRatingByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Execution started.');
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
 
            request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetOverallControlEnvironmentRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Output parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : OutMessage    = ' + result.output.OutMessage);
                
                                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : OverallControlEnvironmentRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : IsActive    = '+binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Input parameters value of ORM.GetOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : IsActive    = '+binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getOverallControlEnvironmentRatingByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in OverallControlEnvironmentRating table
     * @param {RiskRating, Computation, ComputationCode, ColourName, ColourCode, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addOverallControlEnvironmentRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Execution started.');
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
            request.input('ComputationCode',    MSSQL.NVarChar, binds.computationCode);
            request.input('ColourName',    MSSQL.NVarChar, binds.colourName);
	        request.input('ColourCode',    MSSQL.NVarChar, binds.colourCode);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Input parameters value of ORM.AddOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating :  Parameters value are defined and ready to execute.');
    
            return request.execute('[ORM].AddOverallControlEnvironmentRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Output parameters value of ORM.AddOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : OutMessage    = ' + result.output.OutMessage);
                
                                    
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Input parameters value of ORM.AddOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : RiskRating    = ' + binds.riskRating);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Computation    = '+binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ComputationCode    = '+binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ColourName    = '+binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ColourCode    = '+binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Input parameters value of ORM.AddOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : addOverallControlEnvironmentRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update OverallControlEnvironmentRating table
     * @param {OverallControlEnvironmentRatingID, RiskRating, Computation, ComputationCode, ColourName, ColourCode, LastUpdatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async updateOverallControlEnvironmentRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Execution started.');
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
            request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.id);
            request.input('RiskRating',    MSSQL.NVarChar, binds.riskRating);
            request.input('Computation',    MSSQL.NVarChar , binds.computation);
            request.input('ComputationCode',    MSSQL.NVarChar, binds.computationCode);
            request.input('ColourName',    MSSQL.NVarChar, binds.colourName);
	        request.input('ColourCode',    MSSQL.NVarChar , binds.colourCode);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Input parameters value of ORM.UpdateOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating :  Parameters value are defined and ready to execute.');
        
            return request.execute('[ORM].UpdateOverallControlEnvironmentRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Output parameters value of ORM.UpdateOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Input parameters value of ORM.UpdateOverallControlEnvironmentRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : RiskRating    = ' + binds.riskRating);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Computation    = '+binds.computation);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ComputationCode    = '+binds.computationCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ColourName    = '+binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ColourCode    = '+binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Input parameters value of ORM.UpdateOverallControlEnvironmentRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : RiskRating    = ' + binds.riskRating);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Computation    = '+binds.computation);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ComputationCode    = '+binds.computationCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ColourName    = '+binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : ColourCode    = '+binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update InherentLikelihoodRating Status
     * @param {OverallControlEnvironmentRatingID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateOverallControlEnvironmentRatingStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Execution started.');
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
            request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Input parameters value of ORM.UpdateOverallControlEnvironmentRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateOverallControlEnvironmentRatingStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Output parameters value of ORM.UpdateOverallControlEnvironmentRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateOverallControlEnvironmentRatingStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Input parameters value of ORM.UpdateOverallControlEnvironmentRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : OverallControlEnvironmentRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Input parameters value of ORM.UpdateOverallControlEnvironmentRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : OverallControlEnvironmentRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : updateOverallControlEnvironmentRatingStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Get Config Score And Rating from database server
     * @param {ConfigScreen, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getConfigScoreAndRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Execution started.');
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
            request.input('ConfigScreen',    MSSQL.NVarChar, binds.configscreen);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Input parameters value of ORM.GetConfigScoreAndRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : ConfigScreen    = ' + binds.configscreen);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetConfigScoreAndRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Output parameters value of ORM.GetConfigScoreAndRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Input parameters value of ORM.GetConfigScoreAndRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : ConfigScreen    = ' + binds.configscreen);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Input parameters value of ORM.GetConfigScoreAndRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : ConfigScreen    = ' + binds.configscreen);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallControlEnvironmentRatingDb : getConfigScoreAndRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}