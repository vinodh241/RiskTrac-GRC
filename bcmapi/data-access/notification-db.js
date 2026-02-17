const MSSQL                 = require('mssql');
const CONSTANT_FILE_OBJ     = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ      = require('../utility/message/message-constant.js');


module.exports = class NotificationDBManager {
    constructor() {
    }

    start() {
    }

    async addNotification(userIdFromToken,notificationMaster) {
        notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Execution started.');        
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
          
            request.input('ToIDs',          MSSQL.NVarChar,     notificationMaster.recepientEmailID);
            request.input('FromID',         MSSQL.NVarChar,     notificationMaster.senderEmailID);
            request.input('CCIDs',          MSSQL.NVarChar,     notificationMaster.CCIDs);           
            request.input('EmailSubject',   MSSQL.NVarChar,     notificationMaster.subject);          
            request.input('EmailContent',   MSSQL.NVarChar,     notificationMaster.emailContent);
            request.input('EmailAttachment',MSSQL.NVarChar,     JSON.stringify(notificationMaster.attachments))
            request.input('RetryCount',     MSSQL.Int,          CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO);
            request.input('RetryStatus',    MSSQL.NVarChar,     CONSTANT_FILE_OBJ.APP_CONSTANT.OPEN);            
            request.input('UserName',       MSSQL.NVarChar,     notificationMaster.userName);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Input parameters value for [BCM].AddEmailAlerts procedure.');            
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : recepientEmailID  ='+ notificationMaster.recepientEmailID);
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : senderEmailID     ='+ notificationMaster.senderEmailID);
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : CCIDs             ='+ notificationMaster.CCIDs);
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : subject           ='+ notificationMaster.subject);
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : emailContent      ='+ notificationMaster.emailContent);
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : attachments       ='+ JSON.stringify(notificationMaster.attachments));
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : userName          ='+ notificationMaster.userName);    
           
            return request.execute('[BCM].AddEmailAlerts').then(function (result) {
                notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Output parameters value of [BCM].AddEmailAlerts procedure.');
                notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Success 	    = ' + result.output.Success);
                notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : OutMessage	= ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : recepientEmailID  ='+ notificationMaster.recepientEmailID);
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : senderEmailID     ='+ notificationMaster.senderEmailID);
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : CCIDs             ='+ notificationMaster.CCIDs);
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : subject           ='+ notificationMaster.subject);
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : emailContent      ='+ notificationMaster.emailContent);
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : attachments       ='+ JSON.stringify(notificationMaster.attachments));
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : userName          ='+ notificationMaster.userName); 
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });

        } catch (error) {

            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : recepientEmailID  ='+ notificationMaster.recepientEmailID);
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : senderEmailID     ='+ notificationMaster.senderEmailID);
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : CCIDs             ='+ notificationMaster.CCIDs);
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : subject           ='+ notificationMaster.subject);
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : emailContent      ='+ notificationMaster.emailContent);
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : attachments       ='+ JSON.stringify(notificationMaster.attachments));
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : userName          ='+ notificationMaster.userName); 
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : NotificationDBManager : addNotification : Execution end. : Error details : ' + error);
            
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }
    stop() {
    }
}