const SQL_SERVICE_EMITTER   = require('./sql-service-emitter.js');
const CONSTANT_FILE_OBJ     = require('../constants/constant.js');
const EMAIL_UTILITY         = require('../email/emailUtility.js');
const EMAIL_NOTIFICATION    = require('../email-notification.js');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
const UtilityApp            = require('../utility.js');
var cron                    = require('node-cron');
const SRA_NOTIFY_TEMPLATE   = require('../../config/email-template/generic-sra-notify-template.js');
const RMT_NOTIFY_TEMPLATE   = require('../../config/email-template/generic-rmt-notify-template.js');

let sqlServiceEmitter   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let messageQueue        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var notificationObject  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


class MessageQueueUtility {
    constructor() {
        notificationObject  = new EMAIL_NOTIFICATION();
        sqlServiceEmitter   = new SQL_SERVICE_EMITTER();
        utilityAppObject    = new UtilityApp();
        this.setStart();
        if(APP_CONFIG_FILE_OBJ.ACTIVATE_CRON_JOB.enableSRACronJob) {
            this.startSRANotifyOverDueAssessments();
        }
        if(APP_CONFIG_FILE_OBJ.ACTIVATE_CRON_JOB.enableRMTCronJob) {
            this.startRMTnotifyOverDueActionItems();
        }       
    }

    setStart() {
        console.log('cron-job initialized...')
        notificationlogger.log('info', 'MessageQueueUtility : setStart : start.');
        cron.schedule(APP_CONFIG_FILE_OBJ.CRON_JOBS_FREQUENCY.frequency30Sec, () => { // every 30 sec         
            Promise.all([
                sqlServiceEmitter.start({ Count: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE, Timeout: 100000, userName: 'sqldev' },
                    async (EmailAlerts) => {
                        if (EmailAlerts && EmailAlerts.length > 0) {
                            this.sendtoEmailUtility(EmailAlerts);
                        }
                    })
            ]).then(() => {
            }).catch(err => {
                notificationlogger.log('error', 'MessageQueueUtility : setStart :' + err);
            });
        });
    }

    sendtoEmailUtility(EmailAlerts) {
        notificationlogger.log('info', 'MessageQueueUtility : sendtoEmailUtility : EmailAlerts : ' + JSON.stringify(EmailAlerts));
        EmailAlerts.forEach((element, index) => {
            setTimeout(() => {
                // notificationlogger.log('info', 'MessageQueueUtility : sendtoEmailUtility : EmailAlerts : element.EmailAlertsID : ' + element.EmailAlertsID);
                new EMAIL_UTILITY().sendMail(element.EmailAlertsID)
            }, index * 2000)
        });
    }

    startSRANotifyOverDueAssessments() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CRON_JOBS_FREQUENCY.frequencyCustomized, async () => { // every 8am at once  
            // cron.schedule(APP_CONFIG_FILE_OBJ.CRON_JOBS_FREQUENCY.frequency5Min, async () => { // every 30sec     
            // cron.schedule('30 2 * * *', async () => { // every 2:30am 
            // cron.schedule('0 9 * * *', async () => {// Cron expression to run a job every day at 9am
            notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : start.');
           
            let NOTIFY_SRA_OVERDUE_ASSESSMENTS = await sqlServiceEmitter.getSRAOverDueAssessments();
            notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : NOTIFY_SRA_OVERDUE_ASSESSMENTS :' + JSON.stringify(NOTIFY_SRA_OVERDUE_ASSESSMENTS || null));
          
            if (NOTIFY_SRA_OVERDUE_ASSESSMENTS.recordset) {
                let SRA_OVERDUE_RISKS            = NOTIFY_SRA_OVERDUE_ASSESSMENTS.recordset[0];
                let SRA_OVERDUE_RISKS_TOList     = NOTIFY_SRA_OVERDUE_ASSESSMENTS.recordset[1];
                let SRA_OVERDUE_RISKS_CCList     = NOTIFY_SRA_OVERDUE_ASSESSMENTS.recordset[2];
                notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : SRA_OVERDUE_RISKS          :' + JSON.stringify(SRA_OVERDUE_RISKS || null));
                notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : SRA_OVERDUE_RISKS_TOList   :' + JSON.stringify(SRA_OVERDUE_RISKS_TOList || null));
                notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : SRA_OVERDUE_RISKS_CCList   :' + JSON.stringify(SRA_OVERDUE_RISKS_CCList || null));
                let UNIQUE_RISKS = await getUniqueRisks(SRA_OVERDUE_RISKS, "RiskOwnerID", "SiteRiskAssessmentID");
                notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : UNIQUE_RISKS               :' + JSON.stringify(UNIQUE_RISKS || null)); 
                UNIQUE_RISKS.forEach(async (rele) => {
                    let emailTemplateObj = {
                        Subject : SRA_NOTIFY_TEMPLATE.NOTIFY_SRA["NOTIFY_SRA_TEMPLATE"].Subject,
                        Body    : SRA_NOTIFY_TEMPLATE.NOTIFY_SRA["NOTIFY_SRA_TEMPLATE"].Body
                    };
                    let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    let toUserEmailIDs = [];
                    let ccUserEmailIDs = [];               
       
                    if (SRA_OVERDUE_RISKS_TOList.length) {
                        toUserEmailIDs = SRA_OVERDUE_RISKS_TOList.filter(ele => Number(ele.SiteRiskAssessmentID) == Number(rele.SiteRiskAssessmentID) && ele.RiskOwnerID  == rele.RiskOwnerID );
                        let RiskTitleArr =  toUserEmailIDs.map((item, index) => ({ SlNo: index + 1, RiskTitle: item.RiskTitle }));
                        notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : RiskTitleArr : ' + JSON.stringify(RiskTitleArr || null));
                            
                        templateMasterData = {
                            "AssessmentCode"    : rele.AssessmentCode,                              
                            "StartDate"         : utilityAppObject.formatDate('cron-service',rele.StartDate),
                            "EndDate"           : utilityAppObject.formatDate('cron-service',rele.EndDate),
                            "AssessmentName"    : rele.AssessmentName,
                            "RiskTitleArr"      : toUserEmailIDs.map((item, index) => ({ SlNo: index + 1, RiskTitle: item.RiskTitle })),
                            "subject_text"      : "Risks are Pending for Submission",
                            "body_text"         : `Risks are pending for submission for the below Site Risk Assessment. Kindly fill the details and submit for review.<br>`,
                            "table_data"        : `Pending risks are : <br>
                                                    <table border="1" cellpadding="5" cellspacing="0">
                                                        <tr>
                                                            <th style="width: 8%;">Sl No.</th>
                                                            <th style="width: 92%;">Pending Risk Title</th>
                                                        </tr>
                                                        ${RiskTitleArr.map(risk => `<tr style="text-align: center;"><td>${risk.SlNo}</td><td>${risk.RiskTitle}</td></tr>`).join('')}
                                                    </table>`,                            
                            "RISKTRAC_WEB_URL"  : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                        };

                        notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : templateMasterData : ' + JSON.stringify(templateMasterData || null));
                        if (SRA_OVERDUE_RISKS_CCList.length) {
                            ccUserEmailIDs = SRA_OVERDUE_RISKS_CCList.filter(ele => Number(ele.SiteRiskAssessmentID) == Number(rele.SiteRiskAssessmentID));
                        }
                        notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : ccUserEmailIDs : ' + JSON.stringify(ccUserEmailIDs || null));
                        if (toUserEmailIDs.length)  {
                            try {
                                var toEmailIDs = toUserEmailIDs[0].EmailID // .map(ob => ob.EmailID).join(',');
                                var ccEmailIDs = ccUserEmailIDs[0].BCMMangerUsersEmailIDs
                                let toccEmails = {
                                    "TOEmail": utilityAppObject.removeDuplicateEmailIDs(toEmailIDs),
                                    "CCEmail": utilityAppObject.removeDuplicateEmailIDs(ccEmailIDs)
                                }

                                if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                    notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : Email :   emailTemplateObj   : ' + JSON.stringify(emailTemplateObj || null));
                                    notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : Email :   templateMasterData : ' + JSON.stringify(templateMasterData || null));
                                    notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));

                                    await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-SRAOverDueAssessments', emailTemplateObj, templateMasterData, toccEmails);
                                }
                                
                            } catch (error) {
                                notificationlogger.log('info', 'MessageQueueUtility : startSRANotifyOverDueAssessments-EmailNotification : Notification error ' + error);
                            }
                        } else {
                            notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startSRANotifyOverDueAssessments : Execution end. : EmailData is undefined or null.');
                        }
                    }                    
                });                
            }
        });
    }

    startRMTnotifyOverDueActionItems() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CRON_JOBS_FREQUENCY.frequencyCustomized, async () => { // every 8am at once  
            // cron.schedule(APP_CONFIG_FILE_OBJ.CRON_JOBS_FREQUENCY.frequency5Min, async () => { // every 30sec     
            // cron.schedule('30 2 * * *', async () => { // every 2:30am 
            // cron.schedule('0 9 * * *', async () => {// Cron expression to run a job every day at 9am
            let RMT_NOTIFY_FREQUENCY = Number(APP_CONFIG_FILE_OBJ.RMT_FREQUENCY.RMT_FREQUENCY_IN_DAYS);
            notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems : start.');
           
            let NOTIFY_RMT_OVERDUE_ACTION_ITEMS = await sqlServiceEmitter.getRMTOverDueActionItems();
            notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems : NOTIFY_RMT_OVERDUE_ACTION_ITEMS :' + JSON.stringify(NOTIFY_RMT_OVERDUE_ACTION_ITEMS || null));
          
            if (NOTIFY_RMT_OVERDUE_ACTION_ITEMS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length) {
                let ACTION_ITEMS_OVERDUE_LIST   = NOTIFY_RMT_OVERDUE_ACTION_ITEMS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].filter(n => Number(n.NoOfDaysToBreach) <= RMT_NOTIFY_FREQUENCY);
                let templateMasterData          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems : ACTION_ITEMS_OVERDUE_LIST :' + JSON.stringify(ACTION_ITEMS_OVERDUE_LIST || null));

                ACTION_ITEMS_OVERDUE_LIST.forEach(async (rele) => {
                    let emailTemplateObj = {
                        Subject : RMT_NOTIFY_TEMPLATE.NOTIFY_RMT["NOTIFY_RMT_TEMPLATE"].Subject,
                        Body    : RMT_NOTIFY_TEMPLATE.NOTIFY_RMT["NOTIFY_RMT_TEMPLATE"].Body
                    };                                                 
                    templateMasterData = {
                        "ActionItemName"    : rele.IdentifiedActionItem,                              
                        "StartDate"         : utilityAppObject.formatDate('cron-service',rele.StartDate),
                        "EndDate"           : utilityAppObject.formatDate('cron-service',rele.TargetDate),
                        "ModuleName"        : rele.BCMModuleName,
                        "Source"            : rele.ActionItemSource,
                        "RISKTRAC_WEB_URL"  : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        "subject_text"      : "",
                        "body_text"         : "",                                                
                    };
                    if (rele.NoOfDaysToBreach > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && rele.NoOfDaysToBreach <= RMT_NOTIFY_FREQUENCY) {
                        templateMasterData.subject_text = `Action Item is approaching the target date for module - ${rele.BCMModuleName} (${rele.ActionItemSource})`                       
                        templateMasterData.body_text    = 'Action Item is approaching the target date.'
                    } else if (rele.NoOfDaysToBreach <= CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        templateMasterData.subject_text = `Action Item target date has been crossed for module - ${rele.BCMModuleName} (${rele.ActionItemSource})`                       
                        templateMasterData.body_text    = 'The action item has missed its target date.'
                    }                  
                  
                    try {
                        let toEmailIDs = rele.ActionItemOwnerEmailID;
                        let ccEmailIDs = rele.BCMMangerUsersEmailIDs + "," + rele.SourceOwnerEmail + "," + rele.SiteBusinessOwnerEmailID;
                        let toccEmails = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": utilityAppObject.removeDuplicateEmailIDs(ccEmailIDs)
                        }

                        if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                            notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems : Email :   emailTemplateObj   : ' + JSON.stringify(emailTemplateObj || null));
                            notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems : Email :   templateMasterData : ' + JSON.stringify(templateMasterData || null));
                            notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                            await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-RMTOverDueActionItem', emailTemplateObj, templateMasterData, toccEmails);
                        }
                        
                    } catch (error) {
                        notificationlogger.log('info', 'MessageQueueUtility : startRMTnotifyOverDueActionItems-EmailNotification : Notification error ' + error);
                    }
                                     
                });                
            }
        });
    }
    
    sendEmailMessage(message, callback) {
        sqlServiceEmitter.send(message, callback);
    }

    stop() {
        sqlServiceEmitter.stop();
    }
}

// async function formatDate(DateFormat) {
//     logger.log('info', ' : formatDate : DateFormat : ' + DateFormat);
//     try {      
//         let dateValue   = new Date(DateFormat);
//         let day         = dateValue.getUTCDate();
//         let month       = dateValue.getUTCMonth() +1;
//         let year        = dateValue.getUTCFullYear();
//         let newDate     = day + "-" + month + "-" + year ;
//         logger.log('info', 'User Id :  formatDate : newDate : Execution end.'+ newDate);
//         return newDate;
//     } catch (error) {
//         logger.log('error', ' : formatDate : Execution end. : Got unhandled error. : Error Detail : ' + error);
//         return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
//     }
// }

async function getUniqueRisks(arr, comp1, comp2) {
    const unique = arr.map(e => e[comp1] + "_" + e[comp2])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);
    return unique;
}

// async function removeDuplicateEmailIDs(emailString) {
//     const emails = emailString.split(",").map(email => email.trim());
//     const uniqueEmails = [...new Set(emails)];
//     const uniqueEmailString = uniqueEmails.join(",");
//     return uniqueEmailString;
// }

// async function getEmailTemplate(templateKey) {
//     // let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
//     // let emailTemplate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
//     // emailTemplate   = SRA_NOTIFY_TEMPLATE.GENERIC_SRA[templateKey].Body;
//     // emailSubject    = SRA_NOTIFY_TEMPLATE.GENERIC_SRA[templateKey].Subject;

//     return {
//         "Subject": SRA_NOTIFY_TEMPLATE.GENERIC_SRA[templateKey].Body,
//         "Body": SRA_NOTIFY_TEMPLATE.GENERIC_SRA[templateKey].Subject
//     };
// }

function getMessageQueueUtilityClassInstance() {
    if (messageQueue === null) {
        messageQueue = new MessageQueueUtility();
    }
    return messageQueue;
}
module.exports = getMessageQueueUtilityClassInstance;