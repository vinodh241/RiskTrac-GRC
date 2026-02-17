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

            const result = await request.execute('UM.GetEmailAlertFromQueue');
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

}

function getMessageQueueDataAdapterClassInstance() {
    if (messageQueue === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        messageQueue = new MessageQueueDataAdapter();
    }
    return messageQueue;
}
module.exports = getMessageQueueDataAdapterClassInstance;