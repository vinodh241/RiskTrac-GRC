const EMAIL_TEMPLATE_OBJ    = require('../utility/email-templates.js');
const NOTIFICATION_DB       = require('../data-access/notification-db.js');
const CONSTANT_FILE_OBJ     = require('../utility/constants/constant.js');

module.exports = class EmailNotification {
    constructor() {
    }
 
    /**
     * This function will send email notification to sender        
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken 
     * @param {*} data 
     */
    async formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData, toccEmails) {
        try {
            notificationlogger.log('info', 'User Id : ' + userIdFromToken + ' : EmailNotification : formatDataForSendEmail : Execution started...');
            // console.log("toccEmails",toccEmails)
            // const TEMPLATE_KEY    = data.templateKey; 
            const NOTIFICATION_RESPONSE = await this.sendEmailNotification(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData, toccEmails);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == NOTIFICATION_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == NOTIFICATION_RESPONSE) {
                notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : EmailNotification :formatDataForSendEmail : Execution end. : Notification response is undefined or null.');
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != NOTIFICATION_RESPONSE) {
                if (NOTIFICATION_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    notificationlogger.log('info', 'User Id : ' + userIdFromToken + ': EmailNotification : formatDataForSendEmail : ' + NOTIFICATION_RESPONSE.errorMsg);
                }
                if (NOTIFICATION_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                    notificationlogger.log('info', 'User Id : ' + userIdFromToken + ': EmailNotification : formatDataForSendEmail : ' + NOTIFICATION_RESPONSE.errorMsg);
                }
                if (NOTIFICATION_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && NOTIFICATION_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    notificationlogger.log('info', 'User Id : ' + userIdFromToken + ': EmailNotification : formatDataForSendEmail : Error in procedure execution' + NOTIFICATION_RESPONSE.procedureMessage);
                }
                notificationlogger.log('info', 'User Id : ' + userIdFromToken + ': EmailNotification : formatDataForSendEmail : Notification data added successfully');
            }

        } catch (error) {
            notificationlogger.log('error', 'User Id : ' + userIdFromToken + ' : EmailNotification : formatDataForSendEmail : Notification error ' + error);
        }
    }

    /**
     * This is function send email notification and return result.
     */
    async sendEmailNotification(userIdFromToken, userNameFromToken, emailTemplateObj, templateMasterData, toccEmails)
    {
        try {
        notificationlogger.log('info', 'User Id : '+ userIdFromToken +' : EmailNotification : sendEmailNotification : Execution started.');
        
            const NOTIFICATION_MASTER = {
                senderEmailID       : '',
                recepientEmailID    : toccEmails.TOEmail, 
                CCIDs               : toccEmails.CCEmail
            }; 
            var templateObject                  = new EMAIL_TEMPLATE_OBJ();
            const preparedTemplate              = templateObject.prepareTemplates(userIdFromToken,userNameFromToken, emailTemplateObj, templateMasterData);
            NOTIFICATION_MASTER.userName        = userNameFromToken;
            NOTIFICATION_MASTER.emailContent    = preparedTemplate.Body;
            NOTIFICATION_MASTER.subject         = preparedTemplate.Subject;

            let notificationResponse            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            if(NOTIFICATION_MASTER.recepientEmailID != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || NOTIFICATION_MASTER.recepientEmailID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)
            {
                var notificationDBObj  = new NOTIFICATION_DB();
                notificationResponse   = await notificationDBObj.addNotification(userIdFromToken, NOTIFICATION_MASTER);
            }
            return notificationResponse; 

        } catch (error) {
            notificationlogger.log('error', 'User Id : '+ userIdFromToken +' : EmailNotification : sendEmailNotification : Notification error ' + error);
        }
    }
}


