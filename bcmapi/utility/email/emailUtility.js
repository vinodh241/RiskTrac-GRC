const NODE_MAILER           = require("nodemailer");
const EMAIL_CONFIG          = require('../../config/email-config.js');
const EMAIL_DB              = require('../../data-access/email-db.js');
const CONSTANT_FILE_OBJ     = require('../constants/constant.js');
const UTILITY_APP           = require('../utility.js');
const fileSystem            = require('fs');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js')

let emailDBObj          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let utilityAppObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
module.exports = class EmailUtility {
    constructor() {
        emailDBObj      = new EMAIL_DB();
        utilityAppObject = new UTILITY_APP();
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
                    
                    let senderConfig    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let senderEmail     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let authUser        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let mailConfig      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    // email config details for QA environment
                    if(EMAIL_CONFIG.ENVIRONMENT_NAME.envName == CONSTANT_FILE_OBJ.APP_CONSTANT.QA ) {
                        senderConfig    = EMAIL_CONFIG.QA_SENDER_CONFIG;
                        senderEmail     = EMAIL_CONFIG.QA_SENDER_CONFIG.senderEmail;
                        authUser        = EMAIL_CONFIG.QA_MAIL_CONFIG.auth.user;
                        mailConfig      = EMAIL_CONFIG.QA_MAIL_CONFIG;
                    } 
                    // email config details for Production environment
                    else if(EMAIL_CONFIG.ENVIRONMENT_NAME.envName == CONSTANT_FILE_OBJ.APP_CONSTANT.PROD) {
                        senderConfig    = EMAIL_CONFIG.PROD_SENDER_CONFIG;
                        senderEmail     = EMAIL_CONFIG.PROD_SENDER_CONFIG.senderEmail;
                        authUser        = EMAIL_CONFIG.PROD_MAIL_CONFIG.auth.user;
                        mailConfig      = EMAIL_CONFIG.PROD_MAIL_CONFIG;
                    }
                    else {
                        notificationlogger.log('error', 'EmailUtility : sendMail : environment is not QA or PROD.'); 
                        return;      
                    }             

                  
                    const EMAIL_CONTENT = {
                        from        : senderConfig && senderEmail ? senderEmail : authUser,
                        to          : RECORD.ToIDs,
                        cc          : RECORD.CCIDs || [],
                        subject     : RECORD.EmailSubject,
                        html        : RECORD.EmailContent,
                        attachments : JSON.parse(RECORD.EmailAttachment)
                    };
                
                    notificationlogger.log('info', 'EmailUtility : sendMail : emailContent : ' + JSON.stringify(EMAIL_CONTENT));
                    notificationlogger.log('info', 'EmailUtility : sendMail : emailContent-subject : ' +  EMAIL_CONTENT.subject);
                    notificationlogger.log('info', 'EmailUtility : sendMail : emailContent-to : ' +  EMAIL_CONTENT.to);
                    notificationlogger.log('info', 'EmailUtility : sendMail : emailContent-cc : ' +  EMAIL_CONTENT.cc);
                    
                    

                    if(EMAIL_CONTENT.from != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let finalmailConfig = JSON.parse(JSON.stringify(mailConfig))
                        let encryptedPassword   = mailConfig.auth.pass;
                        finalmailConfig.auth.pass    = utilityAppObject.decryptDataByPrivateKey(encryptedPassword);
                        // notificationlogger.log('info', 'EmailUtility : sendMail :  finalmailConfig : ' + JSON.stringify(finalmailConfig || null));
                        // notificationlogger.log('info', 'EmailUtility : sendMail :  finalmailConfig.auth.pass : ' + finalmailConfig.auth.pass);
                        const TRANSPORTER       = NODE_MAILER.createTransport(finalmailConfig);
                       
                        TRANSPORTER.sendMail(EMAIL_CONTENT,  (error, info)=> {
                            let status = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                            if (error) {                                               
                                notificationlogger.log('error', 'EmailUtility : sendMail : Failed to Sent : ' +JSON.stringify(error));
                                status = CONSTANT_FILE_OBJ.APP_CONSTANT.FAILED;
                            } else {                       
                                notificationlogger.log('info', 'EmailUtility : sendMail : Successfully Sent : ' +JSON.stringify(info));
                                status = CONSTANT_FILE_OBJ.APP_CONSTANT.SUCCESS;

                                // //Unlinking file attachments
                                // if(EMAIL_CONTENT.attachments.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                                //     for(let file of EMAIL_CONTENT.attachments){
                                //         if (fileSystem.existsSync(file.path)) {
                                //             fileSystem.unlinkSync(file.path);
                                //         }    
                                //     }
                                // }
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