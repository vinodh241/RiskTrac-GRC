const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class RiskAppetiteDb {
    constructor() {
    }

    start() {
    }    

    /**
     * This function get files data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async downloadFile(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : downloadFile : Execution started.');
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
 
            request.input('FileID',        MSSQL.BigInt,   data.fileId);
            request.input('FileType',      MSSQL.NVarChar, data.fileType);
            request.input('UserName',      MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',   MSSQL.NVarChar, accountGUIDFromToken);
            request.output('Success',      MSSQL.Bit);
            request.output('OutMessage',   MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Input parameters value for ORM.DownloadUploadedFile procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : FileID      = ' + data.fileId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : FileType    = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.DownloadUploadedFile').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Output parameters value of ORM.DownloadUploadedFile procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Input parameters value for ORM.DownloadUploadedFile procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : FileID      = ' + data.fileId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : FileType    = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Input parameters value for ORM.DownloadUploadedFile procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : FileID      = ' + data.fileId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : FileType    = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadFile : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function get risk appetite template data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken     
     * @returns 
     */
    async downloadRiskAppetiteTemplate(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Execution started.');
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

            request.input('TemplateID',         MSSQL.BigInt, data.templateId);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Input parameters value for ORM.DownloadFrameworkTemplates procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.DownloadFrameworkTemplates').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Output parameters value of ORM.DownloadFrameworkTemplates procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Input parameters value for ORM.DownloadFrameworkTemplates procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : AccountGUID    = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Input parameters value for ORM.DownloadFrameworkTemplates procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : downloadRiskAppetiteTemplate : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch policy details from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getPolicyDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : getPolicyDetails : Execution started.');
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


            request.input('FWID',        MSSQL.Int ,     data.fwid);
            request.input('UserName',    MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Input parameters value for ORM.GetRiskMetric procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : UserName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : FWID        = ' + data.fwid);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.GetRiskMetric').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Output parameters value of ORM.GetRiskMetric procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Input parameters value for ORM.GetRiskMetric procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : UserName   = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : FWID       = ' + data.fwid);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Input parameters value for ORM.GetRiskMetric procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : UserName   = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : FWID = ' + data.fwid);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getPolicyDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch risk appetite list details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getRiskAppetiteList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : getRiskAppetiteList : Execution started.');
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
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : No Input parameters value for ORM.GetUploadedFile procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : UserName   = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : AccountGUID   = ' + accountGUIDFromToken);

            return request.execute('ORM.GetUploadedFile').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : Output parameters value of ORM.GetUploadedFile procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : No Input parameters value for ORM.GetUploadedFile procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : UserName   = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : AccountGUID   = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : No Input parameters value for ORM.GetUploadedFile procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : UserName   = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : AccountGUID   = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteList : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch risk appetite template list details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getRiskAppetiteTemplateList(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : getRiskAppetiteTemplateList : Execution started.');
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
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : No Input parameters value for ORM.GetFrameworkTemplates procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : UserName   = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : AccountGUID   = ' + accountGUIDFromToken);

            return request.execute('ORM.GetFrameworkTemplates').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : Output parameters value of ORM.GetFrameworkTemplates procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : No Input parameters value for ORM.GetFrameworkTemplates procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : UserName   = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : AccountGUID   = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : No Input parameters value for ORM.GetFrameworkTemplates procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : UserName   = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : AccountGUID   = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteTemplateList : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }  

    /**
     * This function will upload risk appetite file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} policyName
     * @param {*} accountGUIDFromToken
     * @param {*} callback 
     */
    uploadRiskAppetite(userIdFromToken, userNameFromToken, data, policyName, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : uploadRiskAppetite : Execution started.');
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
      
            request.input('FileType',                   MSSQL.VarChar,      data.fileType);
            request.input('PolicyName',                 MSSQL.NVarChar,     policyName);
            request.input('FrameworkFileName',          MSSQL.NVarChar,     data.frameworkFileName);
            request.input('FrameworkUniqueFileName',    MSSQL.NVarChar,     data.frameworkUniqueFileName);
            request.input('FrameworkFileContent',       MSSQL.VarBinary,    data.frameworkFileContent);
            request.input('PolicyFileName',             MSSQL.NVarChar,     data.policyFileName);
            request.input('PolicyUniqueFileName',       MSSQL.NVarChar,     data.policyUniqueFileName);
            request.input('PolicyFileContent',          MSSQL.VarBinary,    data.policyFileContent);
            request.input('FileLocation',               MSSQL.NVarChar,     data.fileLocation);
            request.input('Status',                     MSSQL.VarChar,      CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
            request.input('UploadTryCount',             MSSQL.Int,          CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
            request.input('UserName',                   MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',                MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',                   MSSQL.Bit);
            request.output('OutMessage',                MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Input parameters value for ORM.UploadRAFramework procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : UserName                  = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FileType                  = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyName                = ' + policyName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FrameworkFileName         = ' + data.frameworkFileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FrameworkUniqueFileName   = ' + data.frameworkUniqueFileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyFileName            = ' + data.policyFileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyUniqueFileName      = ' + data.policyUniqueFileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FileLocation              = ' + data.fileLocation);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : AccountGUID               = ' + accountGUIDFromToken);

            request.execute('ORM.UploadRAFramework').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Output parameters value of ORM.UploadRAFramework procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Input parameters value for ORM.UploadRAFramework procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : UserName                  = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FileType                  = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyName                = ' + policyName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FrameworkFileName         = ' + data.frameworkFileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FrameworkUniqueFileName   = ' + data.frameworkUniqueFileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyFileName            = ' + data.policyFileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyUniqueFileName      = ' + data.policyUniqueFileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FileLocation              = ' + data.fileLocation);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : AccountGUID               = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Input parameters value for ORM.UploadRAFramework procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : UserName                  = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FileType                  = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyName                = ' + policyName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FrameworkFileName         = ' + data.frameworkFileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FrameworkUniqueFileName   = ' + data.frameworkUniqueFileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyFileName            = ' + data.policyFileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : PolicyUniqueFileName      = ' + data.policyUniqueFileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : FileLocation              = ' + data.fileLocation);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : AccountGUID               = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetite : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    } 
    
    /**
     * This function will upload risk appetite template file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @param {*} callback 
     */
    uploadRiskAppetiteTemplate(userIdFromToken, userNameFromToken, data, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Execution started.');
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

            request.input('Name',           MSSQL.NVarChar,     data.fileName);
            request.input('FileContent',    MSSQL.VarBinary,    data.fileContent);
            request.input('UserName',       MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Input parameters value for ORM.UploadFrameworkTemplate procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : UserName  = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Name      = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : AccountGUID  = ' + accountGUIDFromToken);

            request.execute('ORM.UploadFrameworkTemplate').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Output parameters value of ORM.UploadFrameworkTemplate procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Input parameters value for ORM.UploadFrameworkTemplate procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : UserName = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Name     = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : AccountGUID  = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Input parameters value for ORM.UploadFrameworkTemplate procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : UserName = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Name     = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : AccountGUID  = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : uploadRiskAppetiteTemplate : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }
    
    /**
     * This function will fetch risk appetite list details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken 
     * @param {*} callback 
     */
    getRiskAppetiteListForUpload(userIdFromToken, userNameFromToken, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAppetiteDb : getRiskAppetiteListForUpload : Execution started.');
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

            request.input('UserName',       MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Input parameters value for ORM.GetUploadedFile procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : UserName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : AccountGUID    = ' + accountGUIDFromToken);

            request.execute('ORM.GetUploadedFile').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Output parameters value of ORM.GetUploadedFile procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Input parameters value for ORM.GetUploadedFile procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : UserName   = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Input parameters value for ORM.GetUploadedFile procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : UserName   = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteDb : getRiskAppetiteListForUpload : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }

    stop() {
    }
}