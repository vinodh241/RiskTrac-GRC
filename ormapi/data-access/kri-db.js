const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class KriDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch kri master details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async getKriMasterData(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKriMasterData : Execution started.');
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
 
            request.input('UserName',    MSSQL.NVarChar,         userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : No Input parameters value for ORM.KRI_GetKRIMasterData procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetKRIMasterData').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : Output parameters value of ORM.KRI_GetKRIMasterData procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : No Input parameters value for ORM.KRI_GetKRIMasterData procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : No Input parameters value for ORM.KRI_GetKRIMasterData procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMasterData : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will set kri master details 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
    */
    async setKriMasterData(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : setKriMasterData : Execution started.');
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
 
            request.input('MeasurementFrequency',   MSSQL.NVarChar,    JSON.stringify(data.measurementFrequency));
            request.input('Type',                   MSSQL.NVarChar,    JSON.stringify(data.type));
            request.input('ReportingFrequency',     MSSQL.NVarChar,    JSON.stringify(data.reportingFrequency));
            request.input('Status',                 MSSQL.NVarChar,    JSON.stringify(data.status));
            request.input('ThresholdValue',         MSSQL.NVarChar,    JSON.stringify(data.threshold));
            request.input('Reviewers',              MSSQL.NVarChar,    JSON.stringify(data.reviewers));
            request.input('EmailTriggerFrequency',  MSSQL.NVarChar,    JSON.stringify(data.emailData));
            request.input('UserName',               MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Input parameters value for ORM.KRI_AddKRIMasterData procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : MeasurementFrequency    = ' + JSON.stringify(data.measurementFrequency));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Type                    = ' + JSON.stringify(data.type));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Status                  = ' + JSON.stringify(data.status));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : ReportingFrequency      = ' + JSON.stringify(data.reportingFrequency));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : ThresholdValue          = ' + JSON.stringify(data.threshold));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : reviewers               = ' + JSON.stringify(data.reviewers));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : EmailTriggerFrequency   = ' + JSON.stringify(data.EmailTriggerFrequency));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : UserName                = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : AccountGUID                = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_AddKRIMasterData').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Output parameters value of ORM.KRI_AddKRIMasterData procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Input parameters value for ORM.KRI_AddKRIMasterData procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : MeasurementFrequency    = ' + JSON.stringify(data.measurementFrequency));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Type                    = ' + JSON.stringify(data.type));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Status                  = ' + JSON.stringify(data.status));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : ReportingFrequency      = ' + JSON.stringify(data.reportingFrequency));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : ThresholdValue          = ' + JSON.stringify(data.threshold));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : EmailTriggerFrequency   = ' + JSON.stringify(data.EmailTriggerFrequency));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : UserName                = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : AccountGUID                = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Input parameters value for ORM.KRI_AddKRIMasterData procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : MeasurementFrequency    = ' + JSON.stringify(data.measurementFrequency));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Type                    = ' + JSON.stringify(data.type));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Status                  = ' + JSON.stringify(data.status));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : ReportingFrequency      = ' + JSON.stringify(data.reportingFrequency));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : ThresholdValue          = ' + JSON.stringify(data.threshold));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : EmailTriggerFrequency   = ' + JSON.stringify(data.EmailTriggerFrequency));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : UserName                = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : AccountGUID                = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMasterData : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    

    /**
    * This function will fetch Kri self-scoring info from Database 
    * @param {*} userIdFromToken 
    * @param {*} userNameFromToken
    * @param {*} accountGUIDFromToken
    * @returns 
    */
    async getKriInfo(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKriInfo : Execution started.');
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
 
            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : No Input parameters value for ORM.KRI_GetInfoForAddKRIMetrics procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetInfoForAddKRIMetrics').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : Output parameters value of ORM.KRI_GetInfoForAddKRIMetrics procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : No Input parameters value for ORM.KRI_GetInfoForAddKRIMetrics procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : No Input parameters value for ORM.KRI_GetInfoForAddKRIMetrics procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriInfo : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

     /**
    * This function will add Kri data to Database 
    * @param {*} userIdFromToken 
    * @param {*} userNameFromToken
    * @param {*} data
    * @param {*} accountGUIDFromToken
    * @returns 
    */
    async setKri(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : setKri : Execution started.');
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

         const riskId = ((v => (v === '' || isNaN(v) ? null : parseInt(v, 10)))((data.InherentRiskID ?? '').toString().trim()));

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
 
            request.input('KRICode',                MSSQL.NVarChar,         data.kriCode);
            request.input('UnitID',                 MSSQL.Int,              data.unitID);
            request.input('Description',            MSSQL.NVarChar,         data.keyRiskIndicator);
            request.input('MeasurementFrequencyID', MSSQL.Int,              data.measurementFrequencyID);
            request.input('KRITypeID',              MSSQL.Int,              data.kriTpyeID);
            request.input('ReportingFrequencyID',   MSSQL.Int,              data.reportingFrequencyID);
            request.input('ThresholdValue1',        MSSQL.Int,              data.thresholdValue1);
            request.input('ThresholdValue2',        MSSQL.Int,              data.thresholdValue2);
            request.input('ThresholdValue3',        MSSQL.Int,              data.thresholdValue3);
            request.input('ThresholdValue4',        MSSQL.Int,              data.thresholdValue4);
            request.input('ThresholdValue5',        MSSQL.Int,              data.thresholdValue5);
            request.input('ThresholdType',           MSSQL.NVarChar,          (data.thresholdType && (data.thresholdType === 'NUMBER' || data.thresholdType === 'PERCENTAGE')) ? data.thresholdType : 'PERCENTAGE');
            request.input('EmailFrequencyID',       MSSQL.Int,              data.emailfrequencyID);
            request.input('UserName',               MSSQL.NVarChar,         userNameFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier, accountGUIDFromToken);           
            request.input('InherentRiskID', MSSQL.Int, riskId);
                         
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Input parameters value for ORM.KRI_AddKRIMetrics procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : KRICode       			= ' + data.kriCode);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : UnitID       			= ' + data.unitID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Description       		= ' + data.keyRiskIndicator);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : MeasurementFrequencyID	= ' + data.measurementFrequencyID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : KRITypeID       		= ' + data.kriTpyeID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ReportingFrequencyID	= ' + data.reportingFrequencyID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue1       	= ' + data.thresholdValue1);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue2       	= ' + data.thresholdValue2);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue3       	= ' + data.thresholdValue3);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue4       	= ' + data.thresholdValue4);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue5       	= ' + data.thresholdValue5);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdType       	= ' + (data.thresholdType || 'PERCENTAGE'));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : emailfrequencyID     	= ' + data.emailfrequencyID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : UserName       		= ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : AccountGUID       		= ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : InherentRiskID       	= ' + riskId);

            return request.execute('ORM.KRI_AddKRIMetrics').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Output parameters value of ORM.KRI_AddKRIMetrics procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Input parameters value for ORM.KRI_AddKRIMetrics procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : KRICode       			= ' + data.kriCode);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : UnitID       			    = ' + data.unitID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Description       		= ' + data.keyRiskIndicator);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : MeasurementFrequencyID	= ' + data.measurementFrequencyID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : KRITypeID       		    = ' + data.kriTpyeID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ReportingFrequencyID	    = ' + data.reportingFrequencyID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue1       	= ' + data.thresholdValue1);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue2       	= ' + data.thresholdValue2);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue3       	= ' + data.thresholdValue3);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue4       	= ' + data.thresholdValue4);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue5       	= ' + data.thresholdValue5);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdType       	= ' + (data.thresholdType || 'PERCENTAGE'));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : emailfrequencyID        	= ' + data.emailfrequencyID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : UserName       		    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : AccountGUID       		= ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : InherentRiskID       	    = ' + riskId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Input parameters value for ORM.KRI_GetInfoForAddKRIMetrics procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : KRICode       			= ' + data.kriCode);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : UnitID       			    = ' + data.unitID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Description       		= ' + data.keyRiskIndicator);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : MeasurementFrequencyID	= ' + data.measurementFrequencyID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : KRITypeID       		    = ' + data.kriTpyeID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ReportingFrequencyID	    = ' + data.reportingFrequencyID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue1       	= ' + data.thresholdValue1);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue2       	= ' + data.thresholdValue2);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue3       	= ' + data.thresholdValue3);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue4       	= ' + data.thresholdValue4);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdValue5       	= ' + data.thresholdValue5);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : ThresholdType       	= ' + (data.thresholdType || 'PERCENTAGE'));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : UserName       		    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : AccountGUID       		= ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : InherentRiskID       	    = ' + riskId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKri : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
    * This function will fetch Kri data from Database 
    * @param {*} userIdFromToken 
    * @param {*} userNameFromToken
    * @param {*} accountGUIDFromToken
    * @returns 
    */
    async getKri(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKri : Execution started.');
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
 
            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : No Input parameters value for ORM.KRI_GetKRIMetrics procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetKRIMetrics').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : Output parameters value of ORM.KRI_GetKRIMetrics procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : No Input parameters value for ORM.KRI_GetKRIMetrics procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : No Input parameters value for ORM.KRI_GetKRIMetrics procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKri : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
    * This function will delete Kri data from Database 
    * @param {*} userIdFromToken 
    * @param {*} userNameFromToken 
    * @param {*} data
    * @param {*} accountGUIDFromToken
    * @returns 
    */
     async deleteKri(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : deleteKri : Execution started.');
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
 
            request.input('MetricID',    MSSQL.BigInt,      data.metricID)
            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Input parameters value for ORM.KRI_DeleteKRIMetrics procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : MetricID       = ' + data.metricID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_DeleteKRIMetrics').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Output parameters value of ORM.KRI_DeleteKRIMetrics procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Input parameters value for ORM.KRI_DeleteKRIMetrics procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : MetricID       = ' + data.metricID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Input parameters value for ORM.KRI_DeleteKRIMetrics procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : MetricID       = ' + data.metricID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKri : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch self-scoring data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken 
     * @returns 
    */
    async getKriMetricsScoring(userIdFromToken,userNameFromToken, IsOwnUnitData, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKriMetricsScoring : Execution started.');
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
 
            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('IsOwnUnitData',  MSSQL.Bit,      IsOwnUnitData)
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Input parameters value for ORM.KRI_GetKRIMetricsMeasurement procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetKRIMetricsMeasurement').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Output parameters value of ORM.KRI_GetKRIMetricsMeasurement procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                 logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Input parameters value for ORM.KRI_GetKRIMetricsMeasurement procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Input parameters value for ORM.KRI_GetKRIMetricsMeasurement procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriMetricsScoring : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will save self-scoring data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setKriMetricScoring(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : setKriMetricScoring : Execution started.');
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

            request.input('MeasurementData',    MSSQL.NVarChar ,    JSON.stringify(data));
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Input parameters value for ORM.KRI_AddKRIMetricsMeasurement procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : MeasurementData  = ' + JSON.stringify(data));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : UserName          = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : AccountGUID          = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_AddKRIMetricsMeasurement').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Output parameters value of ORM.KRI_AddKRIMetricsMeasurement procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Input parameters value for ORM.KRI_AddKRIMetricsMeasurement procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : MeasurementData  = ' + JSON.stringify(data));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : UserName          = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : AccountGUID          = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Input parameters value for ORM.KRI_AddKRIMetricsMeasurement procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : MeasurementData  = ' + JSON.stringify(data));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : UserName          = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricScoring : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will submit self-scoring data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async setKriMetricsReport(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : setKriMetricsReport : Execution started.');
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
 
            request.input('MeasurementIDs',     MSSQL.NVarChar ,    data.metricIDs);
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Input parameters value for ORM.KRI_AddKRIMetricsReport procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : MeasurementIDs    = ' + data.metricIDs);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : UserName          = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : AccountGUID          = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_AddKRIMetricsReport').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Output parameters value of ORM.KRI_AddKRIMetricsReport procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Input parameters value for ORM.KRI_AddKRIMetricsReport procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : MeasurementIDs   = ' + data.metricIDs);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : UserName         = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : AccountGUID          = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Input parameters value for ORM.KRI_AddKRIMetricsReport procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : MeasurementIDs   = ' + data.metricIDs);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : UserName         = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : setKriMetricsReport : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

     /**
     * This function will fetch kri report data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
    */
      async getKriReport(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKriReport : Execution started.');
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
 
            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Input parameters value for ORM.KRI_GetKRIMetricsReport procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetKRIMetricsReport').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Output parameters value of ORM.KRI_GetKRIMetricsReport procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Input parameters value for ORM.KRI_GetKRIMetricsReport procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Input parameters value for ORM.KRI_GetKRIMetricsReport procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriReport : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch historic scoring data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
    */
    async getKriHistoricalScoring(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKriHistoricalScoring : Execution started.');
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

            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Input parameters value for ORM.KRI_GetKRIHistoricalMetricsMeasurements procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetKRIHistoricalMetricsMeasurements').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Output parameters value of ORM.KRI_GetKRIHistoricalMetricsMeasurements procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Input parameters value for ORM.KRI_GetKRIHistoricalMetricsMeasurements procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Input parameters value for ORM.KRI_GetKRIHistoricalMetricsMeasurements procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalScoring : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch  KRI historic report data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken 
     * @returns 
    */
    async getKriHistoricalReport(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKriHistoricalReport : Execution started.');
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

            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Input parameters value for ORM.KRI_GetKRIHistoricalMetricsReports procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_GetKRIHistoricalMetricsReports').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Output parameters value of ORM.KRI_GetKRIHistoricalMetricsReports procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Input parameters value for ORM.KRI_GetKRIHistoricalMetricsReports procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Input parameters value for ORM.KRI_GetKRIHistoricalMetricsReports procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKriHistoricalReport : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

        /**
     * This function will upload Kri Scoring evidence file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} remarks
     * @param {*} accountGUIDFromToken
     * @param {*} callback 
     */
    uploadKriScoringEvidence(userIdFromToken, userNameFromToken, data, remarks, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : uploadKriScoringEvidence : Execution started.');
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


            request.input('FileName',           MSSQL.NVarChar,     data.fileName);
            request.input('FileType',           MSSQL.NVarChar,     data.fileType)
            request.input('FileContent',        MSSQL.VarBinary,    data.fileContent);
            request.input('Remark',             MSSQL.NVarChar,     remarks)
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Input parameters value for ORM.KRI_UploadMeasurementEvidences procedure.');
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : UserName             = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : AccountGUID             = ' + accountGUIDFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : FileName             = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : FileType             = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Remarks              = ' + remarks);
 

            request.execute('ORM.KRI_UploadMeasurementEvidences').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Output parameters value of ORM.KRI_UploadMeasurementEvidences procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Input parameters value for ORM.KRI_UploadMeasurementEvidences procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : fileName              = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : FileType             = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Remarks              = ' + remarks);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : AccountGUID             = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Input parameters value for ORM.KRI_UploadMeasurementEvidences procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : UserName             = ' + userNameFromToken);
             logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : fileName            = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : FileType             = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Remarks              = ' + remarks);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : AccountGUID             = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : uploadKriScoringEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }

    /**
     * This function delete Kri Scoring evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken    
     * @returns 
     */
    async deleteKriScoringEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : deleteKriScoringEvidence : Execution started.');
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
            


            request.input('MeasurementID',      MSSQL.BigInt,   data.MeasurementID);
            request.input('EvidenceID',         MSSQL.BigInt,   data.EvidenceID);
            request.input('FileContentID',      MSSQL.BigInt,   data.FileContentID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Input parameters value for ORM.KRI_DeleteMeasurementEvidences procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : userName         = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : MeasurementID    = ' + data.MeasurementID); 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : EvidenceID       = ' + data.EvidenceID); 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : FileContentID    = ' + data.FileContentID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : AccountGUID         = ' + accountGUIDFromToken); 

            return request.execute('ORM.KRI_DeleteMeasurementEvidences').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Output parameters value of ORM.KRI_DeleteMeasurementEvidences procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Input parameters value for ORM.KRI_DeleteMeasurementEvidences procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : userName         = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : MeasurementID    = ' + data.MeasurementID); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : EvidenceID       = ' + data.EvidenceID); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : FileContentID    = ' + data.FileContentID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : AccountGUID         = ' + accountGUIDFromToken);  
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Input parameters value for ORM.KRI_DeleteMeasurementEvidences procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : userName         = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : MeasurementID    = ' + data.MeasurementID); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : EvidenceID       = ' + data.EvidenceID); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : FileContentID    = ' + data.FileContentID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : AccountGUID         = ' + accountGUIDFromToken);  
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : deleteKriScoringEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    } 
    
    /**
     * This function get KriScoring evidence data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns
     */
    async downloadKriScoringEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('MeasurementID',      MSSQL.BigInt,   data.MeasurementID);
            request.input('EvidenceID',         MSSQL.BigInt,   data.EvidenceID);
            request.input('FileContentID',      MSSQL.BigInt,   data.FileContentID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Input parameters value for ORM.KRI_DownloadMeasurementEvidences procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : userName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : MeasurementID  = ' + data.MeasurementID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : EvidenceID     = ' + data.EvidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : FileContentID  = ' + data.FileContentID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.KRI_DownloadMeasurementEvidences').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Output parameters value of ORM.KRI_DownloadMeasurementEvidences procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Input parameters value for ORM.KRI_DownloadMeasurementEvidences procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : userName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : MeasurementID  = ' + data.MeasurementID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : EvidenceID     = ' + data.EvidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : FileContentID  = ' + data.FileContentID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Execution end. : Error details : ' + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Input parameters value for ORM.KRI_DownloadMeasurementEvidences procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : userName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : MeasurementID  = ' + data.MeasurementID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : EvidenceID     = ' + data.EvidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : FileContentID  = ' + data.FileContentID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : downloadKriScoringEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    } 

    /**
     * 
     * @param {*} request 
     * @param {*} response
     * @param {*} accountGUIDFromToken
     * @returns 
     */
	async sendEmailReminder(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status:             CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset:          CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg:           CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess:   CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage:   CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);

        request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",       MSSQL.Bit);
        request.output("OutMessage",    MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Input parameters value for ORM.KRI_SendEmailReminder procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : UserName               = " + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : AccountGUID               = " + accountGUIDFromToken);
        

        return request.execute("ORM.KRI_SendEmailReminder").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Output parameters value of ORM.KRI_SendEmailReminder procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : AccountGUID               = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : AccountGUID               = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendEmailReminder : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response
     * @param {*} accountGUIDFromToken
     * @returns 
     */
	async sendKRIReminder(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status:             CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset:          CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg:           CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess:   CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage:   CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);
        request.input("UserName",       MSSQL.NVarChar, userNameFromToken); 
        request.input("MetricID",       MSSQL.NVarChar, data.metricID);
        request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",       MSSQL.Bit);
        request.output("OutMessage",    MSSQL.VarChar);


        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Input parameters value for ORM.KRI_SendKRIReminder procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : UserName      = " + userNameFromToken);
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : metricID      = " + data.metricID);
        logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : AccountGUID      = " + accountGUIDFromToken);
       
        return request.execute("ORM.KRI_SendKRIReminder").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Output parameters value of ORM.KRI_SendKRIReminder procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : AccountGUID      = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : AccountGUID      = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDb : sendKRIReminder : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async reviewReportedKRIData(userIdFromToken, userNameFromToken,binds, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
        status:             CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        recordset:          CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMsg:           CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        procedureSuccess:   CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
        procedureMessage:   CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);

        request.input("KRIReviewData",  MSSQL.NVarChar, JSON.stringify(binds.data)); 
        // request.input("UserGUID",                       MSSQL.NVarChar, binds.userGUID);
        request.input("UserName",       MSSQL.NVarChar, userNameFromToken); 
        request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken); 
        request.output("Success",       MSSQL.Bit);
        request.output("OutMessage",    MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Input parameters value for ORM.ReviewReportedKRIData procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : binds       = " + JSON.stringify(binds || null));
        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : AccountGUID       = " + accountGUIDFromToken);

        return request.execute("ORM.ReviewReportedKRIData").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Output parameters value of ORM.ReviewReportedKRIData procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : reviewReportedKRIData : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async submitKRIReview(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Execution started.");
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
        status:             CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        recordset:          CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMsg:           CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        procedureSuccess:   CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
        procedureMessage:   CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        };

        try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);

        request.input("MetricIDs",      MSSQL.NVarChar, data.metricIDs); 
        request.input("UserName",       MSSQL.NVarChar, userNameFromToken);
        request.input("AccountGUID",    MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output("Success",       MSSQL.Bit);
        request.output("OutMessage",    MSSQL.VarChar);

        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Input parameters value for ORM.SubmitKRIReview procedure.");
        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : data       = " + JSON.stringify(data || null));
        logger.log("info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : AccountGUID       = " + accountGUIDFromToken);

        return request.execute("ORM.SubmitKRIReview").then(function (result) {
            logger.log("info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Output parameters value of ORM.SubmitKRIReview procedure.");
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Success       = " + result.output.Success );
            logger.log( "info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : OutMessage    = " + result.output.OutMessage );

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            logger.log( "info", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );

            return dbResponseObj;
            })
            .catch(function (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Execution end. : Error details : " + error );

            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            return dbResponseObj;
            });
        } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : AccountGUID       = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : KriDB : submitKRIReview : Execution end. : Error details : " + error );

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }

        /**
     * This function will fetch self-scoring data 
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken 
     * @returns 
    */
        async getKRIReportedData(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : getKRIReportedData : Execution started.');
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
     
                request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
                request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
                request.output('Success',    MSSQL.Bit);
                request.output('OutMessage', MSSQL.VarChar);
    
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Input parameters value for ORM.KRI_GetKRIReportedData procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : UserName       = ' + userNameFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : AccounGUID       = ' + accountGUIDFromToken);
    
                return request.execute('ORM.KRI_GetKRIReportedData').then(function (result) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Output parameters value of ORM.KRI_GetKRIReportedData procedure.');
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Success       = ' + result.output.Success);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : OutMessage    = ' + result.output.OutMessage);
    
                    dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset        = result.recordsets;
    
                     logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Execution end.');
    
                    return dbResponseObj;
                })
                .catch(function (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Input parameters value for ORM.KRI_GetKRIReportedData procedure.');
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : UserName       = ' + userNameFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : AccounGUID       = ' + accountGUIDFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Execution end. : Error details : ' + error);
                    
                    dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    
                    return dbResponseObj;
                });
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Input parameters value for ORM.KRI_GetKRIReportedData procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : AccounGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : getKRIReportedData : Execution end. : Error details : ' + error);
    
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
                
                return dbResponseObj;
            }
        }

        /**
         * This function will fetch kri master details from database
         * @param {*} userIdFromToken 
         * @param {*} userNameFromToken
         * @param {*} accountGUIDFromToken 
         * @returns 
         */
        async bulkUploadKRIMetrics(userIdFromToken, userNameFromToken, accountGUIDFromToken, payloadData) {
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriDb : bulkUploadKRIMetrics : Execution started.');
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
    
                request.input('UserName',    MSSQL.NVarChar,         userNameFromToken);
                request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
                request.input('KRIdata',     MSSQL.NVarChar,         JSON.stringify(payloadData));
                request.output('Success',    MSSQL.Bit);
                request.output('OutMessage', MSSQL.VarChar);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : No Input parameters value for ORM.KRI_UploadKRIMetrics procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : UserName       = ' + userNameFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : payloadData    = ' + JSON.stringify(payloadData));


                return request.execute('ORM.KRI_UploadKRIMetrics').then(function (result) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : Output parameters value of ORM.KRI_UploadKRIMetrics procedure.');
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : Success       = ' + result.output.Success);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : OutMessage    = ' + result.output.OutMessage);

                    dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset        = result.recordsets;

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : Execution end.');

                    return dbResponseObj;
                })
                .catch(function (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : No Input parameters value for ORM.KRI_UploadKRIMetrics procedure.');
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : UserName       = ' + userNameFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : AccountGUID    = ' + accountGUIDFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : Execution end. : Error details : ' + error);
                    
                    dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    
                    return dbResponseObj;
                });
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : No Input parameters value for ORM.KRI_UploadKRIMetrics procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriDb : bulkUploadKRIMetrics : Execution end. : Error details : ' + error);

                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
                
                return dbResponseObj;
            }
        }

    stop() {
    }
}