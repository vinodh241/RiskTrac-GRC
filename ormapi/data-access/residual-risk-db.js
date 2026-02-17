const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class ResidualRiskDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch ResidualRisk details from database
     * @param {ResidualRiskID, IsActive, CreatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async getAllResidualRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskDb : getAllResidualRisk : Execution started.');
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
 
            request.input('ResidualRiskID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , binds.isActive);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Input parameters value of ORM.GetResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : ResidualRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Output parameters value of ORM.GetResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Input parameters value of ORM.GetResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : ResidualRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : IsActive    = ' + binds.isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Input parameters value of ORM.GetResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : ResidualRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : IsActive    = ' + binds.isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllResidualRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ResidualRisk details from database
     * @param {ResidualRiskID, IsActive, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getAllActiveResidualRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskDb : getAllActiveResidualRisk : Execution started.');
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
 
            request.input('ResidualRiskID',    MSSQL.Int, binds.id);
	        request.input('IsActive',    MSSQL.Bit , 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Input parameters value of ORM.GetResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : ResidualRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Output parameters value of ORM.GetResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Input parameters value of ORM.GetResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : ResidualRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Input parameters value of ORM.GetResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : ResidualRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getAllActiveResidualRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch ResidualRisk details from database
     * @param {ResidualRiskID, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async getResidualRiskByID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskDb : getResidualRiskByID : Execution started.');
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
 
            request.input('ResidualRiskID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Input parameters value of ORM.GetResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : ResidualRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Output parameters value of ORM.GetResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Input parameters value of ORM.GetResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : ResidualRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Input parameters value of ORM.GetResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : ResidualRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : getResidualRiskByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Insert a record in ResidualRisk table
     * @param {Risk, ColourCode, ColourName, CreatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async addResidualRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskDb : addResidualRisk : Execution started.');
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
            request.input('Risk',    MSSQL.NVarChar, binds.risk);
	        request.input('ColourCode',    MSSQL.NVarChar, binds.colourCode);
            request.input('ColourName',    MSSQL.NVarChar , binds.colourName);
	        request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Input parameters value of ORM.AddResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ResidualRiskID    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ColourCode    = ' + binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ColourName    = ' + binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddResidualRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Output parameters value of ORM.AddResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Input parameters value of ORM.AddResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ResidualRiskID    = ' + binds.risk);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ColourCode    = ' + binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ColourName    = ' + binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : CreatedBy    = ' + binds.createdBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Input parameters value of ORM.AddResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ResidualRiskID    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ColourCode    = ' + binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : ColourName    = ' + binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : CreatedBy    = ' + binds.createdBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : addResidualRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ResidualRisk table
     * @param {ResidualRiskID, Risk, ColourCode, ColourName, LastUpdatedBy, accountGUIDFromToken} binds
     * @returns 
     */
     async updateResidualRisk(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskDb : updateResidualRisk : Execution started.');
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
            request.input('ResidualRiskID',    MSSQL.Int, binds.id);
            request.input('Risk',    MSSQL.VarChar, binds.risk);
	        request.input('ColourCode',    MSSQL.NVarChar , binds.colourCode);
            request.input('ColourName',    MSSQL.NVarChar , binds.colourName);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Input parameters value of ORM.UpdateResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ResidualRiskID    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Risk    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ColourCode    = ' + binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ColourName    = ' + binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateResidualRisk').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Output parameters value of ORM.UpdateResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : OutMessage    = ' + result.output.OutMessage);
                
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Input parameters value of ORM.UpdateResidualRisk procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ResidualRiskID    = ' + binds.risk);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Risk    = ' + binds.risk);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ColourCode    = ' + binds.colourCode);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ColourName    = ' + binds.colourName);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
                logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Input parameters value of ORM.UpdateResidualRisk procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ResidualRiskID    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Risk    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ColourCode    = ' + binds.colourCode);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : ColourName    = ' + binds.colourName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : AccountGUID    = ' + binds.accountGUIDFromToken);
            logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRisk : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will Update ResidualRiskStatus Status
     * @param {ResidualRiskID, IsActive, LastUpdatedBy, accountGUIDFromToken } binds
     * @returns 
     */
     async updateResidualRiskStatus(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskDb : updateResidualRiskStatus : Execution started.');
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
            request.input('ResidualRiskID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, isActive);
            request.input('LastUpdatedBy',    MSSQL.NVarChar, binds.lastUpdatedBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Input parameters value of ORM.UpdateResidualRiskStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : ResidualRiskID    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].UpdateResidualRiskStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Output parameters value of ORM.UpdateResidualRiskStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : OutMessage    = ' + result.output.OutMessage);
                

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : RiskCategoryDb : updateResidualRiskStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Input parameters value of ORM.UpdateResidualRiskStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : ResidualRiskID    = ' + binds.risk);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : IsActive    = ' + isActive);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
                logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : AccountGUID    = ' + binds.accountGUIDFromToken);

                logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Input parameters value of ORM.UpdateResidualRiskStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : ResidualRiskID    = ' + binds.risk);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : IsActive    = ' + isActive);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : LastUpdatedBy    = ' + binds.lastUpdatedBy);
            logger.log('info', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : AccountGUID    = ' + binds.accountGUIDFromToken);
            
            logger.log('error', 'User Id : ' + binds.userId + ' : ResidualRiskDb : updateResidualRiskStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    stop() {
    }
}