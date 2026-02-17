const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class RiskMetricLevelsDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch risk metric levels list data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken 
     * @returns 
     */
    async getRiskMetricLevels(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsDb : getRiskMetricLevels : Execution started.');
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
 
            request.input('UserName',    MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier,     accountGUIDFromToken);

            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : No Input parameters value for ORM.GetRiskMetricLevels procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : UserName              = ' + userNameFromToken);

            return request.execute('ORM.GetRiskMetricLevels').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : Output parameters value of ORM.GetRiskMetricLevels procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : No Input parameters value for ORM.GetRiskMetricLevels procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : UserName              = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : No Input parameters value for ORM.GetRiskMetricLevels procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : UserName              = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : getRiskMetricLevels : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * Save risk metric levels details to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} riskMetricData 
     * @returns 
     */
    async setRiskMetricLevels(userIdFromToken,userNameFromToken,riskMetricData, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskMetricLevelsDb : setRiskMetricLevels : Execution started.');
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
 
            request.input('RiskMetricColorCode',    MSSQL.NVarChar,             JSON.stringify(riskMetricData));
            request.input('AccountGUID',            MSSQL.UniqueIdentifier,     accountGUIDFromToken);
            request.input('UserName',               MSSQL.NVarChar,             userNameFromToken);
            request.output('Success',               MSSQL.Bit);
            request.output('OutMessage',            MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Input parameters value for ORM.UpdateRiskMetricLevels procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : RiskMetricColorCode    = ' + JSON.stringify(riskMetricData));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : accountGUIDFromToken   = ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : UserName              = ' + userNameFromToken);

            return request.execute('ORM.UpdateRiskMetricLevels').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Output parameters value of ORM.UpdateRiskMetricLevels procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Input parameters value for ORM.UpdateRiskMetricLevels procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : RiskMetricColorCode   = ' + JSON.stringify(riskMetricData));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : UserName              = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Input parameters value for ORM.UpdateRiskMetricLevels procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : RiskMetricColorCode   = ' + JSON.stringify(riskMetricData));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : UserName              = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskMetricLevelsDb : setRiskMetricLevels : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}