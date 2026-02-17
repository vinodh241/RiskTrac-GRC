const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class RiskReportsDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch risk report setting details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @returns 
     */
    async getRiskReportsSetting(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsDb : getRiskReportsSetting : Execution started.');
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

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : No Input parameters value for ORM.GetRAReportSetting procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.GetRAReportSetting').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : Output parameters value of ORM.GetRAReportSetting procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : No Input parameters value for ORM.GetRAReportSetting procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : No Input parameters value for ORM.GetRAReportSetting procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : getRiskReportsSetting : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will save risk report setting details to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data 
     * @returns 
     */
    async setRiskReportsSetting(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskReportsDb : setRiskReportsSetting : Execution started.');
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

            request.input('ReportSettings',     MSSQL.NVarChar,    JSON.stringify(data));
            request.input('UserName',           MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Input parameters value for ORM.AddRAReportSetting procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : ReportSettings  =' + JSON.stringify(data));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : UserName        =' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : AccountGUID        =' + accountGUIDFromToken);

            return request.execute('ORM.AddRAReportSetting').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Output parameters value of ORM.AddRAReportSetting procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Input parameters value for ORM.AddRAReportSetting procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : ReportSettings =' + JSON.stringify(data));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : UserName       =' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : AccountGUID        =' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Input parameters value for ORM.AddRAReportSetting procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : ReportSettings =' + JSON.stringify(data));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : UserName       =' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : AccountGUID        =' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskReportsDb : setRiskReportsSetting : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}