const NODE_MAILER           = require("nodemailer");
const EMAIL_CONFIG          = require('../config/email-config.js');
const CONSTANT_FILE_OBJ     = require('./constants/constant.js');
const UTILITY_APP           = require('./utility.js');
const fileSystem            = require('fs');
const EMAIL_DB              = require('./../data-access/email-db.js');

let utilityAppObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let emailDBObj          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

module.exports = class EmailUtility {
    constructor() {
        emailDBObj      = new EMAIL_DB();
        utilityAppObject = new UTILITY_APP();
    }

    async sendEMailNotification(emailObj) {
        try{
            let status = {};

            logger.log('info', 'EmailUtility : sendEMailNotification : Execution start.');
            logger.log('info', 'EmailUtility : sendEMailNotification : emailObj : '  + JSON.stringify(emailObj));

            if (emailObj) {      
                let senderConfig    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let senderEmail     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let authUser        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let mailConfig      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                // email config details for All the environments
                if(EMAIL_CONFIG.SENDER_CONFIG && EMAIL_CONFIG.MAIL_CONFIG) {
                    senderConfig    = EMAIL_CONFIG.SENDER_CONFIG;
                    senderEmail     = EMAIL_CONFIG.SENDER_CONFIG.senderEmail;
                    authUser        = EMAIL_CONFIG.MAIL_CONFIG.auth.user;
                    mailConfig      = EMAIL_CONFIG.MAIL_CONFIG;
                } else {
                    logger.log('error', 'EmailUtility : sendEMailNotification : environment is not QA or PROD.'); 
                    return;      
                } 

                const EMAIL_CONTENT = {
                    from        : senderConfig && senderEmail ? senderEmail : authUser,
                    to          : emailObj.TOEmail,
                    cc          : emailObj.CCIDs || '',
                    subject     : emailObj.EmailSubject,
                    html        : emailObj.EmailContent,
                    attachments : emailObj.EmailAttachment && emailObj.EmailAttachment.length ? JSON.parse(emailObj.EmailAttachment) : []
                };
            
                logger.log('info', 'EmailUtility : sendEMailNotification : EMAIL_CONTENT : ' + JSON.stringify(EMAIL_CONTENT));          

                if (EMAIL_CONTENT.from != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    let finalmailConfig = JSON.parse(JSON.stringify(mailConfig));
                    let encryptedPassword = mailConfig.auth.pass;
                    finalmailConfig.auth.pass = await utilityAppObject.decryptDataByPrivateKey(encryptedPassword);
                    const TRANSPORTER = NODE_MAILER.createTransport(finalmailConfig);
                
                    try {
                        await new Promise((resolve, reject) => {
                            TRANSPORTER.sendMail(EMAIL_CONTENT, (error, info) => {
                                if (error) {
                                    logger.log('error', 'EmailUtility : sendEMailNotification : Failed to Send : ' + JSON.stringify(error));
                                    reject(error); 
                                } else {
                                    logger.log('info', 'EmailUtility : sendEMailNotification : Successfully Sent.');
                                    resolve(info); 
                                }
                            });
                        });
                        
                        //  unlink attachments once email sent
                        if (emailObj.EmailAttachment && emailObj.EmailAttachment.length > 0) {
                            let Attachment = JSON.parse(emailObj.EmailAttachment)
                            Attachment.forEach(att => {
                                if (att.path && fileSystem.existsSync(att.path)) {
                                    fileSystem.unlinkSync(att.path);                                  
                                }
                            });
                        } 

                        status = {"isSend" : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE};
                                     
                        
                    } catch (error) {
                        status = {"isSend" : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO};
                        logger.log('error', 'EmailUtility : sendEMailNotification : error in sending an email' + error);
                    }
                } else {
                    logger.log('error', 'EmailUtility : sendEMailNotification : sender email should not be null');
                }   
            }
            return status;
        } catch (error) {
            logger.log('error', 'EmailUtility : sendEMailNotification : Execution end. : Got unhandled error. : Error Detail : ' + error);       
        }
    }

    async sendMail(emailObj) {

        try{
            notificationlogger.log('info', 'EmailUtility : sendMail : Execution start.');
            notificationlogger.log('info', 'EmailUtility : sendMail : emailObj : '  + JSON.stringify(emailObj));

            const RESULT = await emailDBObj.getEmailAlertData(emailObj);

            notificationlogger.log('info', 'EmailUtility : sendMail : RESULT : '  + JSON.stringify(RESULT || null));

            if (RESULT) {
                switch (RESULT.status) {
                    case CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO :
                        break;
                    case CONSTANT_FILE_OBJ.APP_CONSTANT.ONE :
                        if (!RESULT.procedureSuccess) {
                            notificationlogger.log('error', 'EmailUtility : sendMail : Error in procedure execution : '+ RESULT.procedureMessage);
                        } else {
                            notificationlogger.log('info', 'EmailUtility : sendMail : ' + RESULT.procedureMessage);
                        }
                        break;               
                    case CONSTANT_FILE_OBJ.APP_CONSTANT.TWO :
                        break;
                    default:
                        notificationlogger.log('info', 'EmailUtility : sendMail :  errorMsg : ' + RESULT.errorMsg + ' : procedureMessage : ' +RESULT.procedureMessage);
                }
                
                if (RESULT.recordset && RESULT.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && 
                    RESULT.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]) {

                    const RECORD = RESULT.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    // notificationlogger.log('info', 'EmailUtility : sendMail : RECORD ' + JSON.stringify(RECORD));
                        
                    let senderConfig    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let senderEmail     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let authUser        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let mailConfig      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    // email config details for All the environments
                    if(EMAIL_CONFIG.SENDER_CONFIG && EMAIL_CONFIG.MAIL_CONFIG) {
                        senderConfig    = EMAIL_CONFIG.SENDER_CONFIG;
                        senderEmail     = EMAIL_CONFIG.SENDER_CONFIG.senderEmail;
                        authUser        = EMAIL_CONFIG.MAIL_CONFIG.auth.user;
                        mailConfig      = EMAIL_CONFIG.MAIL_CONFIG;
                    } else {
                        logger.log('error', 'EmailUtility : sendEMailNotification : environment is not QA or PROD.'); 
                        return;      
                    } 
    
                    const EMAIL_CONTENT = {
                        from        : senderConfig && senderEmail ? senderEmail : authUser,
                        to          : RECORD.ToIDs,
                        cc          : RECORD.CCIDs || '',
                        subject     : RECORD.EmailSubject,
                        html        : RECORD.EmailContent,
                        attachments : []
                    };
                    
                    if(EMAIL_CONTENT.from != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let finalmailConfig         = JSON.parse(JSON.stringify(mailConfig))
                        let encryptedPassword       = mailConfig.auth.pass;
                        finalmailConfig.auth.pass   = utilityAppObject.decryptDataByPrivateKey(encryptedPassword);
                        
                        const TRANSPORTER       = NODE_MAILER.createTransport(finalmailConfig);
                        notificationlogger.log('info', 'EmailUtility : sendMail : emailContent : ' + JSON.stringify(EMAIL_CONTENT));
                        TRANSPORTER.sendMail(EMAIL_CONTENT,  (error, info)=> {
                            let status = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                            if (error) {                                               
                                notificationlogger.log('error', 'EmailUtility : sendMail : Failed to Sent : ' +JSON.stringify(error));
                                status = CONSTANT_FILE_OBJ.APP_CONSTANT.FAILED;
                            } else {                       
                                notificationlogger.log('info', 'EmailUtility : sendMail : Successfully Sent : ' +JSON.stringify(info));
                                status = CONSTANT_FILE_OBJ.APP_CONSTANT.SUCCESS;
                            }

                            notificationlogger.log('info', 'EmailUtility : sendMail : status : ' +status);
                            emailDBObj.updateEmailAlertData(emailObj, status).then(updateResult =>{                        
                                notificationlogger.log('info', 'EmailUtility : sendMail : updateResult : ' + JSON.stringify(updateResult));
                                switch (updateResult.status) {
                                    case CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO:
                                        break;
                                    case CONSTANT_FILE_OBJ.APP_CONSTANT.ONE:
                                        if (updateResult.procedureSuccess) {
                                            notificationlogger.log('info', 'EmailUtility : sendMail : Execution end. : procedureMessage : ' + updateResult.procedureMessage);
                                            
                                        } else {                                   
                                            notificationlogger.log('error', 'EmailUtility : sendMail : Error in Update procedure execution : ' +updateResult.procedureMessage);
                                        }
                                        break;                               
                                    case CONSTANT_FILE_OBJ.APP_CONSTANT.TWO:
                                        break;
                                    default:
                                        notificationlogger.log('info', 'EmailUtility : sendMail : errorMsg : ' + updateResult.errorMsg + ' : procedureMessage : ' + updateResult.procedureMessage);
                                }
                            });
                        });
                    }
                    else{
                        notificationlogger.log('error', 'EmailUtility : sendMail : sender email should not null');        
                    }
                }
            }
        } catch (error) {
            notificationlogger.log('error', 'EmailUtility : sendMail : Execution end. : Got unhandled error. : Error Detail : ' + error);       
        }
    }
}


