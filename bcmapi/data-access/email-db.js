const MSSQL               = require('mssql');
const CONSTANT_FILE_OBJ   = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ    = require('../utility/message/message-constant.js');


module.exports = class EmailDBManager {

    async getEmailAlertData(alertID) {
        notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : Execution started.');

        var dbResponseObj = {
        status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
        procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EmailAlertsID',      MSSQL.BigInt, alertID);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);
            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : input parameters value of [BCM].EmailNotification procedure.');
            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : alertID    = ' + alertID);           

            return request.execute('[BCM].EmailNotification').then(function (result) {
            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : Output parameters value of [BCM].EmailNotification procedure.');
            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : Success 	    = ' + result.output.Success);
            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : OutMessage	    = ' + result.output.OutMessage);

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : dbResponseObj : '+ JSON.stringify(dbResponseObj));
            notificationlogger.log('info', 'EmailDBManager : getEmailAlertData : Execution end.');

            return dbResponseObj;
            })
            .catch(function (error) {
                notificationlogger.log('error', 'EmailDBManager : getEmailAlertData : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });

        } catch (error) {
            notificationlogger.log('error', ' EmailDBManager : getEmailAlertData : Execution end. : Error details : ' + error);
           
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    async updateEmailAlertData(alertID, status) {
        notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : Execution started.');

        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
    
        try {
            var request = new MSSQL.Request(poolConnectionObject);            
            request.input('EmailAlertID',   MSSQL.BigInt, alertID);
            request.input('Status',         MSSQL.NVarChar, status);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : Input parameters value of [BCM].UpdateEmailAlerts procedure.');
            notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : EmailAlertID        = ' + alertID);
            notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : Status 	            = ' + status);

            return request.execute('[BCM].UpdateEmailAlerts').then(function (result) {
            notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : Output parameters value of [BCM].UpdateEmailAlerts procedure.');
            notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : Success 	    = ' + result.output.Success);
            notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : OutMessage	    = ' + result.output.OutMessage);

            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess  = result.output.Success;
            dbResponseObj.procedureMessage  = result.output.OutMessage;
            dbResponseObj.recordset         = result.recordsets;

            //  notificationlogger.log('info', 'EmailDBManager : updateEmailAlertData : Execution end.');

            return dbResponseObj;
            })
            .catch(function (error) {
                notificationlogger.log('error', 'EmailDBManager : updateEmailAlertData : Execution end. : Error details : ' + error.stack);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });

        } catch (error) {
           notificationlogger.log('error', ' EmailDBManager : updateEmailAlertData : Execution end. : Error details : ' + error);
            
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

}