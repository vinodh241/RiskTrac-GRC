const MSSQL                 = require('mssql');
const CONSTANT_FILE_OBJ     = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ      = require('../utility/message/message-constant.js');

let messageQueue = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
class MessageQueueDataAdapter {
    constructor() {
    }

    async getMessageFromQueue(master) {
        notificationlogger.log('info', 'MessageQueueDataAdapter : receive : Execution started.');
        var dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            var request = new MSSQL.Request(poolConnectionObjectNotification);

            request.input('UserName', MSSQL.NVarChar, master.userName);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            const result = await request.execute('BCM.GetEmailAlertFromQueue');
            if (result) {
                // notificationlogger.log('info', 'MessageQueueDataAdapter : receive : result : result : ' + JSON.stringify(result || null));
                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;
                return dbResponseObj;
            }

        } catch (error) {
            notificationlogger.log('error', 'MessageQueueDataAdapter : receive : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }

    
    async getSRANotifyOverDueAssessments() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getSRANotifyOverDueAssessments : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status              : 0,
                recordset           : null,
                errorMsg            : null,
                procedureSuccess    : false,
                procedureMessage    : null,
                resultKey           : 'SRANotifyRiskOverDueList'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('[BCM].[SRA_NotifyOverDueAssessments]').then(function (result) {
                    dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess  = result.output.Success;
                    dbResponseObj.procedureMessage  = result.output.OutMessage;
                    dbResponseObj.recordset         = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getSRANotifyOverDueAssessments :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getSRANotifyOverDueAssessments : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getSRANotifyOverDueAssessments : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : getIncidentOverDueRecommendation : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async getRMTnotifyOverDueActionItems() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getRMTnotifyOverDueActionItems : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status              : 0,
                recordset           : null,
                errorMsg            : null,
                procedureSuccess    : false,
                procedureMessage    : null,
                resultKey           : 'RMTNotifyRiskOverDueList'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('[BCM].[RMT_OverDueActionItems]').then(function (result) {
                    dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess  = result.output.Success;
                    dbResponseObj.procedureMessage  = result.output.OutMessage;
                    dbResponseObj.recordset         = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getRMTnotifyOverDueActionItems :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getRMTnotifyOverDueActionItems : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getRMTnotifyOverDueActionItems : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : getIncidentOverDueRecommendation : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }
}

function getMessageQueueDataAdapterClassInstance() {
    if (messageQueue === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        messageQueue = new MessageQueueDataAdapter();
    }
    return messageQueue;
}
module.exports = getMessageQueueDataAdapterClassInstance;