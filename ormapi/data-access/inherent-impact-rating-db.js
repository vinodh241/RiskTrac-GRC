const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class InherentImpactRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Inherent Impact Rating details from database
     * @param {InherentImpactRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllInherentImpactRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentImpactRatingDb : getAllInherentImpactRating : Execution started.');
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
 
            request.input('InherentImpactRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Input parameters value of ORM.GetInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentImpactRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Output parameters value of ORM.GetInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Input parameters value of ORM.GetInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Input parameters value of ORM.GetInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllInherentImpactRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all Inherent Impact Rating details from database
     * @param {InherentImpactRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveInherentImpactRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Execution started.');
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
 
            request.input('InherentImpactRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Input parameters value of ORM.GetInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentImpactRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Output parameters value of ORM.GetInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Input parameters value of ORM.GetInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Input parameters value of ORM.GetInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getAllActiveInherentImpactRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Inherent Impact Rating details from database
     * @param {InherentImpactRatingID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getInherentImpactRatingByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentImpactRatingDb : getInherentImpactRatingByID : Execution started.');
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
 
            request.input('InherentImpactRatingID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Input parameters value of ORM.GetInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentImpactRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Output parameters value of ORM.GetInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Input parameters value of ORM.GetInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : InherentImpactRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Input parameters value of ORM.GetInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : getInherentImpactRatingByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Insert a record in InherentImpactRating table
     * @param {Rating, Score, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async addInherentImpactRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentImpactRatingDb : addInherentImpactRating : Execution started.');
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
 
            request.input('Rating',    MSSQL.VarChar, binds.rating);
            request.input('Score',    MSSQL.Int , binds.score);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Input parameters value of ORM.AddInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddInherentImpactRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Output parameters value of ORM.AddInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Input parameters value of ORM.AddInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Rating    = ' + binds.rating);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Input parameters value of ORM.AddInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : addInherentImpactRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update InherentImpactRating table
     * @param {InherentImpactRatingID, Rating, Score, LastUpdatedBy,accountGUIDFromToken } binds
     * @returns 
     */
     async updateInherentImpactRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentImpactRatingDb : updateInherentImpactRating : Execution started.');
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
            request.input('InherentImpactRatingID',    MSSQL.Int, binds.id);
            request.input('Rating',    MSSQL.VarChar, binds.rating);
            request.input('Score',    MSSQL.Int , binds.score);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Input parameters value of ORM.UpdateInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateInherentImpactRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Output parameters value of ORM.UpdateInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Input parameters value of ORM.UpdateInherentImpactRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Rating    = ' + binds.rating);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Input parameters value of ORM.UpdateInherentImpactRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update InherentImpactRating Status
     * @param {InherentImpactRatingID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateInherentImpactRatingStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Execution started.');
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
            request.input('InherentImpactRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Input parameters value of ORM.updateInherentImpactRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].updateInherentImpactRatingStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Output parameters value of ORM.updateInherentImpactRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Input parameters value of ORM.updateInherentImpactRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : InherentImpactRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Input parameters value of ORM.updateInherentImpactRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : InherentImpactRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentImpactRatingDb : updateInherentImpactRatingStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}

