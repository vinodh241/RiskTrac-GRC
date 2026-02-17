const MSSQL = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ = require('../utility/message/message-constant.js');

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

            const result = await request.execute('ORM.GetEmailAlertFromQueue');
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

    async getIncidentOverDueRecommendation() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getIncidentOverDueRecommendation : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'IncidentOverDueRecommendations'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('ORM.INC_OverDueRecommendation').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getIncidentOverDueRecommendation :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getIncidentOverDueRecommendation : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getIncidentOverDueRecommendation : Execution end. : Error details : ' + error);
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

    async getOverDueCollection() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getOverDueCollection : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'RiskAppetiteOverDueRecommendation'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('[ORM].[RA_OverDueCollection]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getOverDueCollection :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getOverDueCollection : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getOverDueCollection : Execution end. : Error details : ' + error);
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

    async getKRIOverDueMetric() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getKRIOverDueMetric : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'KRIOverDueRecommendation'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('[ORM].[KRI_NotifyKRIMetricUnits]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getOverDueCollection :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getKRIOverDueMetric : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getKRIOverDueMetric : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : getKRIOverDueMetric : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async startKRINotifyReport() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : startKRINotifyReport : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'KRINotfyReccomendation'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('[ORM].[KRI_NotifyReportMetricUnits]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    notificationlogger.log('info', `MessageQueueDataAdapter : startKRINotifyReport :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : startKRINotifyReport : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : startKRINotifyReport : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : startKRINotifyReport : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async startUpdateReportingFrequency() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : startUpdateReportingFrequency : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'UpdateReportingFrequency'
            };
            try {
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                let currentDateTime = new Date().toISOString();
                request.input('UserName', MSSQL.NVarChar, 'Cron-Service');
                request.input('CurrentDate', MSSQL.DateTime2, currentDateTime);
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);

                notificationlogger.log('info', 'MessageQueueDataAdapter : startUpdateReportingFrequency : currentDateTime : ' + currentDateTime);

                request.execute('[ORM].[KRI_UpdateReportingFrequency]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    notificationlogger.log('info', `MessageQueueDataAdapter : startUpdateReportingFrequency :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : startUpdateReportingFrequency : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : startUpdateReportingFrequency : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : startUpdateReportingFrequency : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async getKRIAutoEmailReminder() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getKRIAutoEmailReminder : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'AutoEmailReminder'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('ORM.[KRI_AutoEmailReminder]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getKRIAutoEmailReminder :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getKRIAutoEmailReminder : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getKRIAutoEmailReminder : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : getKRIAutoEmailReminder : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async getNotifyBufferRemainder() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getNotifyBufferRemainder : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'NotifyBufferRemainder'
            };
            try {
                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('ORM.[KRI_NotifyBufferReminder]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    // notificationlogger.log('info', `MessageQueueDataAdapter : getNotifyBufferRemainder :  dbResponseObj : ${JSON.stringify(dbResponseObj || null)}`);
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getNotifyBufferRemainder : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getNotifyBufferRemainder : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : getNotifyBufferRemainder : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async getUnReportedKRIEmail() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : getUnReportedKRIEmail : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'UnRepotedKRIEmail'
            };

            try {

                let UserName = 'Cron-Service';
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('UserName', MSSQL.NVarChar, UserName || 'Cron-Service');
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('ORM.[KRI_AutoEmailEscalation]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    notificationlogger.log('info', 'MessageQueueDataAdapter : getUnReportedKRIEmail : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : getUnReportedKRIEmail : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : getUnReportedKRIEmail : Execution end. : Error details : ' + error);
                resolve(dbResponseObj);
            }
        });
    }

    async autoEmailRemainderRCSAAssessment() {
        notificationlogger.log('info', 'MessageQueueDataAdapter : autoEmailRemainderRCSAAssessment : Execution started.');
        return new Promise(function (resolve, reject) {
            var dbResponseObj = {
                status: 0,
                recordset: null,
                errorMsg: null,
                procedureSuccess: false,
                procedureMessage: null,
                resultKey: 'AutoEmailRemainderRCSAAssessment'
            };

            try {

                let UserName = 'Cron-Service';
                let date = new Date()
                var request = new MSSQL.Request(poolConnectionObjectNotification);
                request.input('SystemDate', MSSQL.DateTime, date || new Date());
                request.output('Success', MSSQL.Bit);
                request.output('OutMessage', MSSQL.NVarChar);
                request.execute('ORM.[RCSA_GetAutoReminderData]').then(function (result) {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    notificationlogger.log('info', 'MessageQueueDataAdapter : autoEmailRemainderRCSAAssessment : Execution end.');
                    resolve(dbResponseObj);
                }).catch(function (error) {
                    notificationlogger.log('error', 'MessageQueueDataAdapter : autoEmailRemainderRCSAAssessment : Execution end. : Error details : ' + error);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = "Error on procedure execution";
                    resolve(dbResponseObj);
                });

            } catch (error) {
                dbResponseObj.status = 0;
                dbResponseObj.errorMsg = "Unable to connect database, Possible reason : database server is down or network error. Please contact to system admin, Or try after some time.";
                notificationlogger.log('error', 'MessageQueueDataAdapter : autoEmailRemainderRCSAAssessment : Execution end. : Error details : ' + error);
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