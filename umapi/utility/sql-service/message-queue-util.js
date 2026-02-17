const SQL_SERVICE_EMITTER   = require('./sql-service-emitter.js');
const CONSTANT_FILE_OBJ     = require('../constants/constant.js');
const EMAIL_UTILITY         = require('../../utility/email-utility.js');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
const UtilityApp            = require('../utility.js');
var cron                    = require('node-cron');

let sqlServiceEmitter   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let messageQueue        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class MessageQueueUtility {
    constructor() {
        sqlServiceEmitter   = new SQL_SERVICE_EMITTER();
        utilityAppObject    = new UtilityApp();
        this.setStart();
             
    }

    setStart() {
        console.log('cron-job initialized...')
        notificationlogger.log('info', 'MessageQueueUtility : setStart : start.');
        cron.schedule(APP_CONFIG_FILE_OBJ.CRON_JOBS_FREQUENCY.frequencyCustomized, () => { // every 30 sec         
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

      
    sendEmailMessage(message, callback) {
        sqlServiceEmitter.send(message, callback);
    }

    stop() {
        sqlServiceEmitter.stop();
    }
}


function getMessageQueueUtilityClassInstance() {
    if (messageQueue === null) {
        messageQueue = new MessageQueueUtility();
    }
    return messageQueue;
}
module.exports = getMessageQueueUtilityClassInstance;