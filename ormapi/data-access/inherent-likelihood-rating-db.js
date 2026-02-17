const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class InherentLikelihoodRatingDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch all Inherent Likelihood Rating details from database
     * @param {InherentLikelihoodRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllInherentLikelihoodRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Execution started.');
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
 
            request.input('InherentLikelihoodRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentLikelihoodRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Output parameters value of ORM.GetInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllInherentLikelihoodRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch all Inherent Likelihood Rating details from database
     * @param {InherentLikelihoodRatingID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveInherentLikelihoodRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Execution started.');
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
 
            request.input('InherentLikelihoodRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentLikelihoodRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Output parameters value of ORM.GetInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getAllActiveInherentLikelihoodRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch InherentLikelihoodRating details from database
     * @param {id, isActive, createdBy, accountGUIDFromToken } binds
     * @returns 
     */
    async getInherentLikelihoodRatingByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Execution started.');
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
 
            request.input('InherentLikelihoodRatingID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetInherentLikelihoodRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Output parameters value of ORM.GetInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : InherentLikelihoodRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Input parameters value of ORM.GetInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : getInherentLikelihoodRatingByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in InherentLikelihoodRating table
     * @param {Rating, Score, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
    async addInherentLikelihoodRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Execution started.');
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

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Input parameters value of ORM.AddInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddInherentLikelihoodRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Output parameters value of ORM.AddInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Input parameters value of ORM.AddInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Rating    = ' + binds.rating);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Input parameters value of ORM.AddInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : addInherentLikelihoodRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update InherentLikelihoodRating table
     * @param {InherentLikelihoodRatingID, Rating, Score, LastUpdatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async updateInherentLikelihoodRating(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Execution started.');
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
            request.input('InherentLikelihoodRatingID',    MSSQL.Int, binds.id);
            request.input('Rating',    MSSQL.VarChar, binds.rating);
            request.input('Score',    MSSQL.Int , binds.score);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Input parameters value of ORM.UpdateInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateInherentLikelihoodRating').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Output parameters value of ORM.UpdateInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Input parameters value of ORM.UpdateInherentLikelihoodRating procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Rating    = ' + binds.rating);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Score    = ' + binds.score);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Input parameters value of ORM.UpdateInherentLikelihoodRating procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Rating    = ' + binds.rating);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Score    = ' + binds.score);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRating : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function will Update InherentLikelihoodRating Status
     * @param {InherentLikelihoodRatingID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateInherentLikelihoodRatingStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Execution started.');
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
            request.input('InherentLikelihoodRatingID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Input parameters value of ORM.UpdateInherentLikelihoodRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateInherentLikelihoodRatingStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Output parameters value of ORM.UpdateInherentLikelihoodRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Input parameters value of ORM.UpdateInherentLikelihoodRatingStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : InherentLikelihoodRatingID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Input parameters value of ORM.UpdateInherentLikelihoodRatingStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : InherentLikelihoodRatingID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : InherentLikelihoodRatingDb : updateInherentLikelihoodRatingStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}

