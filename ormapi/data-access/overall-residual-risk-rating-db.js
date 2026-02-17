const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class OverallResidualRiskRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch OverallResidualRiskRating details from database
     * @param {ResidualRiskRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllOverallResidualRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Execution started.');
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
 
            request.input('ResidualRiskRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Input parameters value of ORM.GetResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Output parameters value of ORM.GetResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Input parameters value of ORM.GetResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Input parameters value of ORM.GetResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllOverallResidualRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallResidualRiskRating details from database
     * @param {ResidualRiskRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveOverallResidualRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Execution started.');
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
 
            request.input('ResidualRiskRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Input parameters value of ORM.GetResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Output parameters value of ORM.GetResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Input parameters value of ORM.GetResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Input parameters value of ORM.GetResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getAllActiveOverallResidualRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch OverallResidualRiskRating details from database
     * @param {ResidualRiskRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getOverallResidualRiskRatingByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Execution started.');
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
 
            request.input('ResidualRiskRatingID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Input parameters value of ORM.GetResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : IsActive    = '+ binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Output parameters value of ORM.GetResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Input parameters value of ORM.GetResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : ResidualRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : IsActive    = '+ binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Input parameters value of ORM.GetResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : IsActive    = '+ binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : getOverallResidualRiskRatingByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in OverallResidualRiskRating table
     * @param {OverallInherentRiskRatingID, OverallControlEnvironmentRatingID, ResidualRiskID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addOverallResidualRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Execution started.');
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
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.overallInherentRiskRatingID);
	        request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.overallControlEnvironmentRatingID);
	        request.input('ResidualRiskID',    MSSQL.Int, binds.residualRiskID);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Input parameters value of ORM.AddResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OverallInherentRiskRatingID    = ' + binds.overallInherentRiskRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OverallControlEnvironmentRatingID    = '+ binds.overallControlEnvironmentRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : ResidualRiskID    = '+ binds.residualRiskID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddResidualRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Output parameters value of ORM.AddResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Input parameters value of ORM.AddResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OverallInherentRiskRatingID    = ' + binds.overallInherentRiskRatingID);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OverallControlEnvironmentRatingID    = '+ binds.overallControlEnvironmentRatingID);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : ResidualRiskID    = '+ binds.residualRiskID);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Input parameters value of ORM.AddResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OverallInherentRiskRatingID    = ' + binds.overallInherentRiskRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : OverallControlEnvironmentRatingID    = '+ binds.overallControlEnvironmentRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : ResidualRiskID    = '+ binds.residualRiskID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : addOverallResidualRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update OverallResidualRiskRating table
     * @param {ResidualRiskRatingID, OverallInherentRiskRatingID, OverallControlEnvironmentRatingID, ResidualRiskID, LastUpdatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async updateOverallResidualRiskRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Execution started.');
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
            request.input('ResidualRiskRatingID',    MSSQL.Int, binds.id);
            request.input('OverallInherentRiskRatingID',    MSSQL.Int, binds.overallInherentRiskRatingID);
	        request.input('OverallControlEnvironmentRatingID',    MSSQL.Int, binds.overallControlEnvironmentRatingID);
	        request.input('ResidualRiskID',    MSSQL.Int, binds.residualRiskID);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Input parameters value of ORM.UpdateResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OverallInherentRiskRatingID    = ' + binds.overallInherentRiskRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OverallControlEnvironmentRatingID    = '+ binds.overallControlEnvironmentRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : ResidualRiskID    = '+ binds.residualRiskID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateResidualRiskRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Output parameters value of ORM.UpdateResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Input parameters value of ORM.UpdateResidualRiskRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OverallInherentRiskRatingID    = ' + binds.overallInherentRiskRatingID);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OverallControlEnvironmentRatingID    = '+ binds.overallControlEnvironmentRatingID);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : ResidualRiskID    = '+ binds.residualRiskID);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Input parameters value of ORM.UpdateResidualRiskRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OverallInherentRiskRatingID    = ' + binds.overallInherentRiskRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : OverallControlEnvironmentRatingID    = '+ binds.overallControlEnvironmentRatingID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : ResidualRiskID    = '+ binds.residualRiskID);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ResidualLikelihoodRating Status
     * @param {ResidualRiskRatingID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateOverallResidualRiskRatingStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Execution started.');
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
            request.input('ResidualRiskRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Input parameters value of ORM.UpdateResidualRiskRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : IsActive    = '+ isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateResidualRiskRatingStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Output parameters value of ORM.UpdateResidualRiskRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateOverallResidualRiskRatingStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Input parameters value of ORM.UpdateResidualRiskRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : ResidualRiskRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : IsActive    = '+ isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Input parameters value of ORM.UpdateResidualRiskRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : ResidualRiskRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : IsActive    = '+ isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : OverallResidualRiskRatingDb : updateOverallResidualRiskRatingStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}