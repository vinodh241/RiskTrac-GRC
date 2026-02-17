const SQL_SERVICE_EMITTER = require('./sql-service-emitter.js');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
const EMAIL_UTILITY = require('../email/emailUtility.js');
const EMAIL_NOTIFICATION = require('../../utility/email-notification.js');
const APP_CONFIG_FILE_OBJ = require('../../config/app-config.js');
const UtilityApp = require('../../utility/utility.js');

/**
 * for Tempory purpose added below template here, once same template details coming from db then we will need to Remove this.
 */
// config\email-template\schedule-incident-template.js
const SCHEDULE_ASSESSMENT_OBJ = require('../../config/email-template/schedule-assessment-template.js');
const INCIDENT_TEMPLATES_OBJ = require('../../config/email-template/schedule-incident-template.js');
const KRI_TEMPLATES_OBJ = require('../../config/email-template/kri-email-template.js');
const KRI_BTN_QUARTER_TEMPLATE_OBJ = require('../../config/email-template/kri-btn-enables-reporting.js');
const KRI_REPORTING_FREQUENCY_TEMPLATE_OBJ = require('../../config/email-template/kri-update-reporting-frequency.js');
const KRI_AUTO_EMAIL_REMINDER_TEMPLATE_OBJ = require('../../config/email-template/kri-auto-email-reminder-template.js');
const KRI_UNREPORTED_EMAIL_OBJ = require('../../config/email-template/unreported-kri-template.js');
const NOTIFY_BUFFER_REMINDER_TEMPLATE_OBJ = require('../../config/email-template/notify-buffer-remainder-template.js');
const AUTO_EMAIL_REMAINDER_RCSA_ASSESSMENT_OBJ = require('../../config/email-template/send-email-manually-rcsa.js');




var cron = require('node-cron');
const { log } = require('gulp-util');

let sqlServiceEmitter = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let messageQueue = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var notificationObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class MessageQueueUtility {
    constructor() {
        notificationObject = new EMAIL_NOTIFICATION();
        sqlServiceEmitter = new SQL_SERVICE_EMITTER();
        utilityAppObject = new UtilityApp();
        this.setStart();
        this.startIncidentOverDueRecommendation();
        this.startRAOverDueCollection();
        this.startKRINotifyReport();
        // this.startUpdateKRIAutoEmailReminder();   // --> Currently Disabled as per the requirement for ZRA
        this.startUpdateUnReportedKRIEmail();
        this.startUpdateNotifyBufferReminder();
        this.startAutoEmailRemainderRCSAAssessment();
        const today = new Date();
        if (today.getDate() === 1) {
            this.startUpdateKRIReportingReport();
            this.startKRIOverDueMetric();
        }
    }

    setStart() {
        notificationlogger.log('info', 'MessageQueueUtility : setStart : start.');
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequency10Min, () => { // every 30 sec           
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
        EmailAlerts.forEach((element, index) => {
            setTimeout(() => {
                // notificationlogger.log('info', 'MessageQueueUtility : sendtoEmailUtility : EmailAlerts : element.EmailAlertsID : ' + element.EmailAlertsID);
                new EMAIL_UTILITY().sendMail(element.EmailAlertsID)
            }, index * 2000)
        });
    }

    startIncidentOverDueRecommendation() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => { // every 8:00am
            let incident_OverDue_Recommendation = await sqlServiceEmitter.getIncidentOverDueRecommendation();
            notificationlogger.log('info', 'MessageQueueUtility : startIncidentOverDueRecommendation : Email : incident_OverDue_Recommendation : ' + JSON.stringify(incident_OverDue_Recommendation || null));

            let IncidentOverDueRecommendations = incident_OverDue_Recommendation.recordset;

            if (IncidentOverDueRecommendations && IncidentOverDueRecommendations.length) {
                for (let itr of IncidentOverDueRecommendations.length) {
                    let Recommendations = await getUnique(IncidentOverDueRecommendations[itr], 'RecommendationID');
                    notificationlogger.log('info', 'MessageQueueUtility : startIncidentOverDueRecommendation : Email : Recommendations : ' + JSON.stringify(Recommendations || null));

                    for (let rele of Recommendations) {
                        let templateKey = 'SCHEDULE_INCIDENT_EMAIL_TEMPLATE';

                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                            let templateMasterData = {
                                "RecommendationCode": rele.RecommendationCode,
                                "RecommendationCode_1": rele.RecommendationCode,
                                "RecommendationID_1": rele.RecommendationID,
                                "IncidentCode": rele.IncidentCode,
                                "IncidentCode_1": rele.IncidentCode,
                                "IncidentCode_2": rele.IncidentCode,
                                "IncidentTitle": rele.IncidentTitle,
                                "UnitName": rele.PendingUnitName,
                                "ReporterName": rele.ReporterName,
                                "ReportingDate": await formatDate(rele.ReportingDate),
                                "RISKTRAC_WEB_URL": APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                            };

                            let toUserEmailIDs = rele.TOList && rele.TOList != null ? JSON.parse(rele.TOList) : [];
                            let ccUserEmailIDs = rele.CCList && rele.CCList != null ? JSON.parse(rele.CCList) : [];

                            if (toUserEmailIDs.length > 0) {
                                const EmailData = {
                                    "toUserEmailIDs": toUserEmailIDs,
                                    "ccUserEmailIDs": ccUserEmailIDs
                                };

                                try {
                                    let emailTemplateObj = await getEmailTemplate(templateKey);

                                    if (!EmailData || EmailData.toUserEmailIDs.length === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                        notificationlogger.log('info', 'MessageQueueUtility : startIncidentOverDueRecommendation : Execution end. : EmailData is undefined or null.');
                                    } else {
                                        let toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                                        let ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);
                                        let toccEmails = {
                                            "TOEmail": toEmailIDs,
                                            "CCEmail": ccEmailIDs
                                        };

                                        notificationlogger.log('info', 'MessageQueueUtility : startIncidentOverDueRecommendation : Email : templateMasterData   : ' + JSON.stringify(templateMasterData || null));
                                        notificationlogger.log('info', 'MessageQueueUtility : startIncidentOverDueRecommendation : Email : toccEmails           : ' + JSON.stringify(toccEmails || null));

                                        if (emailTemplateObj && templateMasterData && toccEmails.TOEmail) {
                                            await notificationObject.formatDataForSendEmail('0000', 'Cron-Service', emailTemplateObj, templateMasterData, toccEmails);
                                        }
                                    }
                                } catch (error) {
                                    notificationlogger.log('info', 'MessageQueueUtility : startIncidentOverDueRecommendation-EmailNotification : Notification error ' + error);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    startRAOverDueCollection() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => { // every 2:30am
            notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : start.');

            let risk_Appitite_OverDueCollection = await sqlServiceEmitter.getOverDueCollection();
            notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : risk_Appitite_OverDueCollection :' + JSON.stringify(risk_Appitite_OverDueCollection || null));

            if (risk_Appitite_OverDueCollection) {
                let RiskAppetite_OverDueCollection = risk_Appitite_OverDueCollection.recordset;
                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : RiskAppetite_OverDueCollection :' + JSON.stringify(RiskAppetite_OverDueCollection || null));

                if (RiskAppetite_OverDueCollection && RiskAppetite_OverDueCollection.length > 0) {
                    let Collections = await getUnique(RiskAppetite_OverDueCollection[0], 'CollectionScheduleID');
                    notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Collections :' + JSON.stringify(Collections || null));

                    Collections.forEach(async (rele) => {
                        let templateKey = 'SCHEDULE_ASSESSMENT_EMAIL_TEMPLATE';
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                            let toList = rele.ToList != null ? JSON.parse(rele.ToList) : [];
                            let ccList = rele.CCList != null ? JSON.parse(rele.CCList) : [];

                            let toUserEmailIDs = rele.ToList != null ? JSON.parse(rele.ToList) : []
                            let ccUserEmailIDs = rele.CCList != null ? JSON.parse(rele.CCList) : []

                            let uniqueUnitNamesArray = [...new Set(toList.map(item => item.Name))];
                            const unitNames = `(${uniqueUnitNamesArray.join(', ')})`;

                            // notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection :: unitNames ::' + unitNames);
                            templateMasterData = rele;
                            templateMasterData = {
                                // "Name": RiskAppetite_OverDueCollection[0].Name,
                                "FrameworkName": rele.FrameworkName,
                                "FrameworkName_1": rele.FrameworkName,
                                "FrameworkName_2": rele.FrameworkName,
                                "StartDate": await formatDate(rele.StartDate),
                                "EndDate": await formatDate(rele.EndDate),
                                "UnitName": unitNames,
                                "Quater": rele.Quater,
                                "Year": rele.Year,
                                "RISKTRAC_WEB_URL": APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                            };

                            notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : templateMasterData : ' + JSON.stringify(templateMasterData || null));

                            if (toUserEmailIDs && toUserEmailIDs.length > 0) {

                                toUserEmailIDs = toList.filter(ele => ele.CollectionScheduleID == rele.CollectionScheduleID);
                                ccUserEmailIDs = ccList.filter(ele => ele.CollectionScheduleID == rele.CollectionScheduleID);

                                if (toUserEmailIDs && toUserEmailIDs.length > 0) {
                                    const EmailData = {
                                        "toUserEmailIDs": toUserEmailIDs,
                                        "ccUserEmailIDs": ccUserEmailIDs
                                    }

                                    // notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : EmailData :'+JSON.stringify(EmailData || null));

                                    try {
                                        let emailTemplateObj = await getEmailTemplate(templateKey);

                                        if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                            notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startOverDueCollection : Execution end. : EmailData is undefined or null.');
                                        } else {
                                            var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                                            var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);
                                            let toccEmails = {
                                                "TOEmail": toEmailIDs,
                                                "CCEmail": ccEmailIDs
                                            }

                                            if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Email :   emailTemplateObj   : ' + JSON.stringify(emailTemplateObj || null));
                                                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Email :   templateMasterData : ' + JSON.stringify(templateMasterData || null));
                                                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));

                                                await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-RAOverDueCollection', emailTemplateObj, templateMasterData, toccEmails);
                                            }
                                        }
                                    } catch (error) {
                                        notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection-EmailNotification : Notification error ' + error);
                                    }
                                }
                            }
                        }

                    });
                }
            }
        });
    }

    startKRIOverDueMetric() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => {
            notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric : start.');
            let templateKey = 'KRI_EMAIL_TEMPLATE';
            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueUnitNamesArray = [];
            let unitNameKRICodeMap = {};
            let KRI_Metric = await sqlServiceEmitter.getKRIOverDueMetric();
            notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric : KRI_Metric :' + JSON.stringify(KRI_Metric || null));

            let KRI_Over_Due_Metric = KRI_Metric.recordset;

            notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric : KRI_Over_Due_Metric :' + JSON.stringify(KRI_Over_Due_Metric || null));

            if (KRI_Over_Due_Metric && KRI_Over_Due_Metric.length) {
                try {
                    for (let i = 0; i < KRI_Over_Due_Metric.length; i++) {
                        if (KRI_Over_Due_Metric[i].length) {
                            KRI_Over_Due_Metric[i].forEach(async (metric) => {
                                const { UnitName, KRICode, Period, KRIType, MetricID, TOList, CCList } = metric;
                                if (!unitNameKRICodeMap[UnitName]) {
                                    unitNameKRICodeMap[UnitName] = {
                                        KRICodeCSV: KRICode,
                                        Period,
                                        MetricID,
                                        TOList,
                                        CCList,
                                        RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                                    };
                                } else {
                                    unitNameKRICodeMap[UnitName].KRICodeCSV += `, ${KRICode}`;
                                }
                            });
                            uniqueUnitNamesArray = Object.keys(unitNameKRICodeMap).map((UnitName) => ({ UnitName, ...unitNameKRICodeMap[UnitName], }));
                            notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric : uniqueUnitNamesArray : ' + JSON.stringify(uniqueUnitNamesArray || null));

                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                                for (let item = 0; item < uniqueUnitNamesArray.length; item++) {
                                    templateMasterData = {
                                        Period: uniqueUnitNamesArray[item].Period,
                                        UnitName: uniqueUnitNamesArray[item].UnitName,
                                        RISKTRAC_WEB_URL: uniqueUnitNamesArray[item].RISKTRAC_WEB_URL,
                                        KRICode: uniqueUnitNamesArray[item].KRICodeCSV,
                                        UnitName_1: uniqueUnitNamesArray[item].UnitName,
                                    };

                                    let toList = uniqueUnitNamesArray[item].TOList && uniqueUnitNamesArray[item].TOList != null ? JSON.parse(uniqueUnitNamesArray[item].TOList) : [];
                                    let ccList = uniqueUnitNamesArray[item].CCList && uniqueUnitNamesArray[item].CCList != null ? JSON.parse(uniqueUnitNamesArray[item].CCList) : [];

                                    const EmailData = {
                                        "toUserEmailIDs": toList,
                                        "ccUserEmailIDs": ccList
                                    }

                                    notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRIOverDueMetric : EmailData          : ' + JSON.stringify(EmailData));
                                    notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRIOverDueMetric : templateMasterData : ' + JSON.stringify(templateMasterData));

                                    let emailTemplateObj = await getEmailTemplate(templateKey);

                                    if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                        notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRIOverDueMetric : Execution end. : EmailData is undefined or null.');
                                    } else {
                                        var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                                        var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);

                                        notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRIOverDueMetric : toEmailIDs:.' + JSON.stringify(toEmailIDs));
                                        notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRIOverDueMetric : ccEmailIDs:.' + JSON.stringify(ccEmailIDs));

                                        let toccEmails = {
                                            "TOEmail": toEmailIDs,
                                            "CCEmail": ccEmailIDs
                                        }

                                        if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                            notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                                            await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-KRINOTIFYREPORT', emailTemplateObj, templateMasterData, toccEmails);
                                        }
                                    }
                                }
                            }
                        }
                    }

                } catch (error) {
                    notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric-EmailNotification : Notification error ' + error);
                }
            }
        });
    }

    startKRINotifyReport() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => {
            notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : start.');
            let KRI_Metric = await sqlServiceEmitter.startKRINotifyReport();
            notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : KRI_Metric :' + JSON.stringify(KRI_Metric || null));
            if (KRI_Metric) {
                let KRI_Notify_Report = KRI_Metric.recordset;

                let toUserEmailIDs = []
                let ccUserEmailIDs = []
                toUserEmailIDs = KRI_Notify_Report[1]

                ccUserEmailIDs = KRI_Notify_Report[2]

                if (toUserEmailIDs && toUserEmailIDs.length > 0) {
                    const EmailData = {
                        "toUserEmailIDs": toUserEmailIDs,
                        "ccUserEmailIDs": ccUserEmailIDs
                    }

                    notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : EmailData :' + JSON.stringify(EmailData || null));

                    try {
                        let KRI_DB_DATA = KRI_Notify_Report[0];

                        let unitNames = [];
                        if (KRI_Notify_Report && KRI_Notify_Report.length > 0 || KRI_DB_DATA) {
                            let Metrics = await getUnique(KRI_Notify_Report[0], 'MetricID');
                            notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : Metrics :' + JSON.stringify(Metrics || null));
                            Metrics.forEach(async (metric) => {
                                if (!unitNames.includes(metric.UnitName))
                                    unitNames.push(metric.UnitName);
                            });
                        }
                        notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRINotifyReport :unitNames' + JSON.stringify(unitNames));

                        let templateKey = 'KRI_BUTTON_EMAIL_TEMPLATE';
                        let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                            templateMasterData = {
                                "QuarterID": KRI_DB_DATA[0].Period,
                                "Unit Name": unitNames.join(", "),
                                "RISKTRAC_WEB_URL": APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                            };
                        }
                        notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRINotifyReport :templateMasterData' + JSON.stringify(templateMasterData));

                        notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRINotifyReport :emailTemplateObj' + templateKey);
                        let emailTemplateObj = await getEmailTemplate(templateKey);
                        if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                            notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRINotifyReport : Execution end. : EmailData is undefined or null.');
                        } else {
                            var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                            notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRINotifyReport : toEmailIDs:.' + JSON.stringify(toEmailIDs));
                            var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);
                            notificationlogger.log('info', 'MessageQueueUtility MessageQueueUtility : startKRINotifyReport : toEmailIDs:.' + JSON.stringify(ccEmailIDs));
                            let toccEmails = {
                                "TOEmail": toEmailIDs,
                                "CCEmail": ccEmailIDs
                            }

                            if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : Email :   emailTemplateObj   : ' + JSON.stringify(emailTemplateObj || null));
                                notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : Email :   templateMasterData : ' + JSON.stringify(templateMasterData || null));
                                notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));

                                await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-KRINOTIFYREPORT', emailTemplateObj, templateMasterData, toccEmails);

                            }
                        }
                    } catch (error) {
                        notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport-EmailNotification : Notification error ' + error);
                    }
                }
                notificationlogger.log('info', 'MessageQueueUtility : startKRINotifyReport : KRI_Notify_Report :' + JSON.stringify(KRI_Notify_Report[0] || null));
            }
        });
    }

    startUpdateKRIReportingReport() {
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyTwiceADay, async () => {
            try {
                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : start.');

                let UPDATE_KRI_REPORTING = await sqlServiceEmitter.startUpdateReportingKRIReport();
                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : UPDATE_KRI_REPORTING :' + JSON.stringify(UPDATE_KRI_REPORTING || null));

                let UPDATE_KRI_REPORTING_DATA = UPDATE_KRI_REPORTING.recordset[0];
                notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : UPDATE_KRI_REPORTING_DATA :' + JSON.stringify(UPDATE_KRI_REPORTING_DATA || null));

                if (UPDATE_KRI_REPORTING_DATA && UPDATE_KRI_REPORTING_DATA.length) {

                    UPDATE_KRI_REPORTING_DATA.forEach(async (rele) => {
                        let templateKey = 'KRI_UPDATE_REPORTING_EMAIL_TEMPLATE';
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {

                            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                            let toUserEmailIDs = rele.ToList != null ? rele.ToList : []
                            let ccUserEmailIDs = rele.CCList != null ? rele.CCList : []

                            templateMasterData = {
                                "CurrentReportingFrequency": rele.CurrentReportingFrequency,
                                "NewReportingFrequency": rele.NewReportingFrequency,
                                "KRIUnits": rele.KRIUnits,
                                "NewReportingFrequency_1": rele.NewReportingFrequency,
                                "RISKTRAC_WEB_URL": APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME]
                            };

                            notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : templateMasterData : ' + JSON.stringify(templateMasterData || null));

                            if (toUserEmailIDs && toUserEmailIDs.length) {
                                try {
                                    let emailTemplateObj = await getEmailTemplate(templateKey);
                                    let toccEmails = {
                                        "TOEmail": toUserEmailIDs,
                                        "CCEmail": ccUserEmailIDs
                                    }

                                    if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                        notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Email :   emailTemplateObj   : ' + JSON.stringify(emailTemplateObj || null));
                                        notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Email :   templateMasterData : ' + JSON.stringify(templateMasterData || null));
                                        notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                                        await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-RAOverDueCollection', emailTemplateObj, templateMasterData, toccEmails);
                                    }

                                } catch (error) {
                                    notificationlogger.log('info', 'MessageQueueUtility : startOverDueCollection-EmailNotification : Notification error ' + error);
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                notificationlogger.log('error', 'MessageQueueUtility : startOverDueCollection : Error occurred. Error details: ' + error);
            }
        });
    }

    startUpdateKRIAutoEmailReminder() {
        notificationlogger.log('info', 'MessageQueueUtility : startUpdateKRIAutoEmailReminder : start.');

        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => {
            notificationlogger.log('info', 'MessageQueueUtility : startUpdateKRIAutoEmailReminder : start.');

            let templateKey = 'KRI_AUTO_EMAIL_REMINDER_TEMPLATE';
            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueUnitNamesArray = [];
            let unitNameKRICodeMap = {};

            let GET_KRI_MERTRICS_AUTO_REMINDER = await sqlServiceEmitter.startUpdateKRIAutoEmailReminder();
            notificationlogger.log('info', 'MessageQueueUtility : startUpdateKRIAutoEmailReminder : GET_KRI_MERTRICS_AUTO_REMINDER :' + JSON.stringify(GET_KRI_MERTRICS_AUTO_REMINDER || null));

            let KRI_AUTO_REMINDER_METRICS = GET_KRI_MERTRICS_AUTO_REMINDER.recordset;
            notificationlogger.log('info', 'MessageQueueUtility : startUpdateKRIAutoEmailReminder : KRI_AUTO_REMINDER_METRICS :' + JSON.stringify(KRI_AUTO_REMINDER_METRICS || null));

            if (KRI_AUTO_REMINDER_METRICS && KRI_AUTO_REMINDER_METRICS.length) {
                try {
                    for (let itr = 0; itr < KRI_AUTO_REMINDER_METRICS.length; itr++) {
                        if (KRI_AUTO_REMINDER_METRICS[itr].length) {
                            KRI_AUTO_REMINDER_METRICS[itr].forEach(async (metric) => {
                                const { UnitName, KRICode, Period, KRIType, MetricID, TOList, CCList, MeasurementFrequency } = metric;
                                if (!unitNameKRICodeMap[UnitName]) {
                                    unitNameKRICodeMap[UnitName] = {
                                        KRICodeCSV: KRICode,
                                        Period,
                                        MeasurementFrequency,
                                        MetricID,
                                        TOList,
                                        CCList,
                                        UnitName,
                                        RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                                    };
                                } else {
                                    unitNameKRICodeMap[UnitName].KRICodeCSV += `, ${KRICode}`;
                                }
                            });
                            uniqueUnitNamesArray = Object.keys(unitNameKRICodeMap).map((UnitName) => ({ UnitName, ...unitNameKRICodeMap[UnitName], }));
                            notificationlogger.log('info', 'MessageQueueUtility : startUpdateKRIAutoEmailReminder : uniqueUnitNamesArray : ' + JSON.stringify(uniqueUnitNamesArray || null));

                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                                for (let item = 0; item < uniqueUnitNamesArray.length; item++) {
                                    templateMasterData = {
                                        Period: uniqueUnitNamesArray[item].Period,
                                        UnitName: uniqueUnitNamesArray[item].UnitName,
                                        RISKTRAC_WEB_URL: uniqueUnitNamesArray[item].RISKTRAC_WEB_URL,
                                        KRICode: uniqueUnitNamesArray[item].KRICodeCSV,
                                        UnitName_1: uniqueUnitNamesArray[item].UnitName,
                                    };

                                    let toList = uniqueUnitNamesArray[item].TOList && uniqueUnitNamesArray[item].TOList != null ? JSON.parse(uniqueUnitNamesArray[item].TOList) : [];
                                    let ccList = uniqueUnitNamesArray[item].CCList && uniqueUnitNamesArray[item].CCList != null ? JSON.parse(uniqueUnitNamesArray[item].CCList) : [];

                                    const EmailData = {
                                        "toUserEmailIDs": toList,
                                        "ccUserEmailIDs": ccList
                                    }

                                    notificationlogger.log('info', 'MessageQueueUtility  : startUpdateKRIAutoEmailReminder : EmailData          : ' + JSON.stringify(EmailData));
                                    notificationlogger.log('info', 'MessageQueueUtility  : startUpdateKRIAutoEmailReminder : templateMasterData : ' + JSON.stringify(templateMasterData));

                                    let emailTemplateObj = await getEmailTemplate(templateKey);

                                    if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateKRIAutoEmailReminder : Execution end. : EmailData is undefined or null.');
                                    } else {
                                        var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                                        var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);

                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateKRIAutoEmailReminder : toEmailIDs:.' + JSON.stringify(toEmailIDs));
                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateKRIAutoEmailReminder : ccEmailIDs:.' + JSON.stringify(ccEmailIDs));

                                        let toccEmails = {
                                            "TOEmail": toEmailIDs,
                                            "CCEmail": ccEmailIDs
                                        }

                                        if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                            notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                                            await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-KRINOTIFYREPORT', emailTemplateObj, templateMasterData, toccEmails);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    notificationlogger.log('info', 'MessageQueueUtility : startKRIOverDueMetric-EmailNotification : Notification error ' + error);
                }
            }
        });
    }

    startUpdateNotifyBufferReminder() {
        notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferReminder : start.');

        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => {
            notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferReminder : start.');

            let templateKey = 'NOTIFY_BUFFER_REMAINDER_TEMPLATE';
            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueUnitNamesArray = [];
            let unitNameKRICodeMap = {};

            let GET_NOTIFY_BUFFER_REMAINDER_METRICS = await sqlServiceEmitter.startUpdateNotifyBufferReminder();


            notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferReminder : GET_NOTIFY_BUFFER_REMAINDER_METRICS :' + JSON.stringify(GET_NOTIFY_BUFFER_REMAINDER_METRICS || null));

            let NOTIFY_BUFFER_REMAINDER_METRICS = GET_NOTIFY_BUFFER_REMAINDER_METRICS.recordset;

            notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferReminder : NOTIFY_BUFFER_REMAINDER_METRICS :' + JSON.stringify(NOTIFY_BUFFER_REMAINDER_METRICS || null));

            if (NOTIFY_BUFFER_REMAINDER_METRICS && NOTIFY_BUFFER_REMAINDER_METRICS.length) {
                try {
                    for (let itr = 0; itr < NOTIFY_BUFFER_REMAINDER_METRICS.length; itr++) {
                        if (NOTIFY_BUFFER_REMAINDER_METRICS[itr].length) {
                            NOTIFY_BUFFER_REMAINDER_METRICS[itr].forEach(async (metric) => {
                                const { UnitName, KRICode, Period, KRIType, MetricID, TOList, CCList, MeasurementFrequency } = metric;
                                if (!unitNameKRICodeMap[UnitName]) {
                                    unitNameKRICodeMap[UnitName] = {
                                        KRICodeCSV: KRICode,
                                        Period,
                                        MeasurementFrequency,
                                        MetricID,
                                        TOList,
                                        CCList,
                                        UnitName,
                                        RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                                    };
                                } else {
                                    unitNameKRICodeMap[UnitName].KRICodeCSV += `, ${KRICode}`;
                                }
                            });
                            uniqueUnitNamesArray = Object.keys(unitNameKRICodeMap).map((UnitName) => ({ UnitName, ...unitNameKRICodeMap[UnitName], }));

                            notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferReminder : uniqueUnitNamesArray : ' + JSON.stringify(uniqueUnitNamesArray || null));

                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                                for (let item = 0; item < uniqueUnitNamesArray.length; item++) {
                                    templateMasterData = {
                                        Period: uniqueUnitNamesArray[item].Period,
                                        UnitName: uniqueUnitNamesArray[item].UnitName,
                                        RISKTRAC_WEB_URL: uniqueUnitNamesArray[item].RISKTRAC_WEB_URL,
                                        KRICode: uniqueUnitNamesArray[item].KRICodeCSV,
                                        UnitName_1: uniqueUnitNamesArray[item].UnitName,
                                    };

                                    let toList = uniqueUnitNamesArray[item].TOList && uniqueUnitNamesArray[item].TOList != null ? JSON.parse(uniqueUnitNamesArray[item].TOList) : [];

                                    let ccList = uniqueUnitNamesArray[item].CCList && uniqueUnitNamesArray[item].CCList != null ? JSON.parse(uniqueUnitNamesArray[item].CCList) : [];


                                    const EmailData = {
                                        "toUserEmailIDs": toList,
                                        "ccUserEmailIDs": ccList
                                    }

                                    notificationlogger.log('info', 'MessageQueueUtility  : startUpdateNotifyBufferReminder : EmailData          : ' + JSON.stringify(EmailData));
                                    notificationlogger.log('info', 'MessageQueueUtility  : startUpdateNotifyBufferReminder : templateMasterData : ' + JSON.stringify(templateMasterData));

                                    let emailTemplateObj = await getEmailTemplate(templateKey);

                                    if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateNotifyBufferReminder : Execution end. : EmailData is undefined or null.');
                                    } else {
                                        var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);

                                        var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);


                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateNotifyBufferReminder : toEmailIDs:.' + JSON.stringify(toEmailIDs));
                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateNotifyBufferReminder : ccEmailIDs:.' + JSON.stringify(ccEmailIDs));

                                        let toccEmails = {
                                            "TOEmail": toEmailIDs,
                                            "CCEmail": ccEmailIDs
                                        }

                                        if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                            notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferRemainder : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                                            await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-KRINOTIFYREPORT', emailTemplateObj, templateMasterData, toccEmails);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    notificationlogger.log('info', 'MessageQueueUtility : startUpdateNotifyBufferReminder : Notification error ' + error);
                }
            }
        });
    }

    startUpdateUnReportedKRIEmail() {
        notificationlogger.log('info', 'MessageQueueUtility : startUpdateUnReportedKRIEmail : start.');
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => {
            let templateKey = 'KRI_UNREPORTED_EMAIL';
            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uniqueUnitNamesArray = [];
            let unitNameKRICodeMap = {};

            let GET_UNREPORTED_KRI_MERTRICS = await sqlServiceEmitter.startUpdateUnReportedKRIEmail();
            // notificationlogger.log('info', 'MessageQueueUtility : startUpdateUnReportedKRIEmail : GET_UNREPORTED_KRI_METRICS :' + JSON.stringify(GET_UNREPORTED_MERTRICS || null));

            let UNREPORTED_KRI_MERTRICS = GET_UNREPORTED_KRI_MERTRICS.recordset;

            // notificationlogger.log('info', 'MessageQueueUtility : startUpdateUnReportedKRIEmail : GET_UNREPORTED_KRI_METRICS :' + JSON.stringify(UNREPORTED_MERTRICS || null));

            if (UNREPORTED_KRI_MERTRICS && UNREPORTED_KRI_MERTRICS.length) {
                try {

                    for (let itr = 0; itr < UNREPORTED_KRI_MERTRICS.length; itr++) {
                        if (UNREPORTED_KRI_MERTRICS[itr].length) {
                            UNREPORTED_KRI_MERTRICS[itr].forEach(async (metric) => {

                                const { UnitName, KRICode, Period, KRIType, MetricID, TOList, CCList, MeasurementFrequency } = metric;

                                if (!unitNameKRICodeMap[UnitName]) {
                                    unitNameKRICodeMap[UnitName] = {
                                        KRICodeCSV: KRICode,
                                        Period,
                                        MeasurementFrequency,
                                        MetricID,
                                        TOList,
                                        CCList,
                                        UnitName,
                                        RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                                    };

                                } else {
                                    unitNameKRICodeMap[UnitName].KRICodeCSV += `, ${KRICode}`;
                                }
                            });

                            uniqueUnitNamesArray = Object.keys(unitNameKRICodeMap).map((UnitName) => ({ UnitName, ...unitNameKRICodeMap[UnitName], }));
                            // notificationlogger.log('info', 'MessageQueueUtility : startUpdateUnReportedKRIEmail : uniqueUnitNamesArray : ' + JSON.stringify(uniqueUnitNamesArray || null));

                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                                for (let item = 0; item < uniqueUnitNamesArray.length; item++) {
                                    templateMasterData = {
                                        Period: uniqueUnitNamesArray[item].Period,
                                        UnitName: uniqueUnitNamesArray[item].UnitName,
                                        RISKTRAC_WEB_URL: uniqueUnitNamesArray[item].RISKTRAC_WEB_URL,
                                        KRICode: uniqueUnitNamesArray[item].KRICodeCSV,
                                        UnitName_1: uniqueUnitNamesArray[item].UnitName,
                                    };

                                    let toList = uniqueUnitNamesArray[item].TOList && uniqueUnitNamesArray[item].TOList != null ? JSON.parse(uniqueUnitNamesArray[item].TOList) : [];
                                    let ccList = uniqueUnitNamesArray[item].CCList && uniqueUnitNamesArray[item].CCList != null ? JSON.parse(uniqueUnitNamesArray[item].CCList) : [];

                                    const EmailData = {
                                        "toUserEmailIDs": toList,
                                        "ccUserEmailIDs": ccList
                                    }

                                    // notificationlogger.log('info', 'MessageQueueUtility  : startUpdateUnReportedKRIEmail : EmailData          : ' + JSON.stringify(EmailData));
                                    // notificationlogger.log('info', 'MessageQueueUtility  : startUpdateUnReportedKRIEmail : templateMasterData : ' + JSON.stringify(templateMasterData));

                                    let emailTemplateObj = await getEmailTemplate(templateKey);

                                    if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                        notificationlogger.log('info', 'MessageQueueUtility  : startUpdateUnReportedKRIEmail : Execution end. : EmailData is undefined or null.');
                                    } else {
                                        var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                                        var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);

                                        // notificationlogger.log('info', 'MessageQueueUtility  : startUpdateUnReportedKRIEmail : toEmailIDs:.' + JSON.stringify(toEmailIDs));
                                        // notificationlogger.log('info', 'MessageQueueUtility  : startUpdateUnReportedKRIEmail : ccEmailIDs:.' + JSON.stringify(ccEmailIDs));

                                        let toccEmails = {
                                            "TOEmail": toEmailIDs,
                                            "CCEmail": ccEmailIDs
                                        }

                                        if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                            // notificationlogger.log('info', 'MessageQueueUtility : startUpdateUnReportedKRIEmail : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                                            await notificationObject.formatDataForSendEmail('000000', 'Cron-Service-KRINOTIFYREPORT', emailTemplateObj, templateMasterData, toccEmails);
                                        }
                                    }
                                }
                            }
                        }
                    }

                } catch (error) {
                    notificationlogger.log('info', 'MessageQueueUtility : startUnReportedKRI-EmailNotification : Notification error ' + error);
                }
            }
        });
    }

    startAutoEmailRemainderRCSAAssessment() {
        notificationlogger.log('info', 'MessageQueueUtility : startAutoEmailRemainderRCSAAssessment : start.');
        notificationlogger.log('info', 'MessageQueueUtility : startAutoEmailRemainderRCSAAssessment : frequency:'+ APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM);
        
        cron.schedule(APP_CONFIG_FILE_OBJ.CronJobsFrequency.frequencyEveryDayat8AM, async () => {
            let templateKey = 'SEND_EMAIL_MANUALLY_RCSA_EMAIL_TEMPLATE';
            let templateMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            let GET_RCSA_ASSESSMENT = await sqlServiceEmitter.startAutoEmailRemainderRCSAAssessment();
            notificationlogger.log('info', 'MessageQueueUtility : startAutoEmailRemainderRCSAAssessment : GET_RCSA_ASSESSMENT :' + JSON.stringify(GET_RCSA_ASSESSMENT || null));

            let RCSA_ASSESSMENT = GET_RCSA_ASSESSMENT.recordset[1];
            // console.log("RCSA Assessment: ", RCSA_ASSESSMENT)
            let data = {};

            notificationlogger.log('info', 'MessageQueueUtility : startAutoEmailRemainderRCSAAssessment : RCSA_ASSESSMENT :' + JSON.stringify(RCSA_ASSESSMENT || null));
            try {

                if (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY !== templateKey) {
                    for (let item = 0; item < RCSA_ASSESSMENT.length; item++) {
                        const {
                            ScheduleAssessmentCode,
                            ScheduleAssessmentDescription,
                            SchedulePeriod,
                            ProposedStartDate,
                            ProposedCompletionDate,
                            RCSAPendingUnitName,
                            ReviewersEmailID,
                            RMUsersEmailID
                        } = RCSA_ASSESSMENT[item];

                        templateMasterData = {
                            ScheduleAssessmentCode: ScheduleAssessmentCode,
                            SchedulePeriod: SchedulePeriod,
                            ProposedStartDate: formatDate(ProposedStartDate),
                            ProposedCompletionDate: formatDate(ProposedCompletionDate),
                            RCSAPendingUnitName: formatUnitNames(RCSAPendingUnitName),
                            RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        };

                        notificationlogger.log('info', 'MessageQueueUtility  : startAutoEmailRemainderRCSAAssessment : templateMasterData          : ' + JSON.stringify(templateMasterData));
                        // console.log("Template master data: ", templateMasterData);


                        let toList = ReviewersEmailID ? ReviewersEmailID : [];
                        // console.log("To list data: ", toList);

                        let ccList = RMUsersEmailID ? RMUsersEmailID : [];
                        // console.log("cc list data: ", ccList);

                        const EmailData = {
                            toUserEmailIDs: toList,
                            ccUserEmailIDs: ccList
                        }

                        notificationlogger.log('info', 'MessageQueueUtility  : startAutoEmailRemainderRCSAAssessment : EmailData          : ' + JSON.stringify(EmailData));
                        notificationlogger.log('info', 'MessageQueueUtility  : startAutoEmailRemainderRCSAAssessment : templateMasterData : ' + JSON.stringify(templateMasterData));

                        let emailTemplateObj = await getEmailTemplate(templateKey);

                        if (!EmailData || EmailData.toUserEmailIDs.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                            notificationlogger.log('info', 'MessageQueueUtility  : startAutoEmailRemainderRCSAAssessment : Execution end. : EmailData is undefined or null.');
                        } else {
                            // var toEmailIDs = await filterEmailIds(EmailData.toUserEmailIDs);
                            // var ccEmailIDs = await filterEmailIds(EmailData.ccUserEmailIDs);

                            notificationlogger.log('info', 'MessageQueueUtility  : startAutoEmailRemainderRCSAAssessment : toEmailIDs:.' + JSON.stringify(EmailData.toUserEmailIDs));
                            notificationlogger.log('info', 'MessageQueueUtility  : startAutoEmailRemainderRCSAAssessment : ccEmailIDs:.' + JSON.stringify(EmailData.toUserEmailIDs));

                            let toccEmails = {
                                "TOEmail": EmailData.toUserEmailIDs,
                                "CCEmail": EmailData.toUserEmailIDs
                            }

                            if (emailTemplateObj && templateMasterData && toccEmails && toccEmails.TOEmail && toccEmails.TOEmail !== '') {
                                notificationlogger.log('info', 'MessageQueueUtility : startAutoEmailRemainderRCSAAssessment : Email :   toccEmails         : ' + JSON.stringify(toccEmails || null));
                                await notificationObject.formatDataForSendEmail('000000', 'Cron-Service', emailTemplateObj, templateMasterData, toccEmails);
                            }
                        }
                    }
                }
            } catch (error) {
                notificationlogger.log('info', 'MessageQueueUtility : startAutoEmailRemainderRCSA-Assessment : Notification error ' + error);
            }
        }
        );
    }

    sendEmailMessage(message, callback) {
        sqlServiceEmitter.send(message, callback);
    }

    stop() {
        sqlServiceEmitter.stop();
    }
}


async function getUnique(arr, comp) {
    const unique = arr.map(e => e[comp])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);
    return unique;
}

function formatDate(DateFormat) {
    try {
        let dateValue = new Date(DateFormat);
        let day = dateValue.getUTCDate();
        let month = dateValue.getUTCMonth() + 1;
        let year = dateValue.getUTCFullYear();
        let newDate = day + "-" + month + "-" + year;
        console.log("Formatted Date: ", newDate)
        logger.log('info', 'User Id :  formatDate : newDate : Execution end. ' + newDate);
        return newDate;
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ': formatDate : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    }

}

/**
 * This is function will filter emailid from  DB response object .
 */
async function filterEmailIds(emailList) {
    try {
        let allEmail = [];
        let isEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        var senderEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        for (var i = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO; i < emailList.length; i++) {
            if (emailList[i].EmailID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                allEmail.push(emailList[i].EmailID);
                isEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            }
        }

        if (isEmail == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            senderEmail = allEmail.join(", ");
        }

        return senderEmail;
    } catch (error) {
        notificationlogger.log('info', 'MessageQueueUtility : filterEmailIds : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

function formatUnitNames(commaSeparatedString) {
    try {
        logger.log('info', 'formatUnitNames : Execution Started...');
        const valuesArray = commaSeparatedString.split(',');
        const uniqueValueSet = [...new Set(valuesArray)];
        const stringFromSet = Array.from(uniqueValueSet).join(', ');

        logger.log('info', 'formatUnitNames : stringFromSet : ' + stringFromSet);
        return stringFromSet;
    } catch (error) {
        logger.log('info', 'formatUnitNames : Execution end : Got unhandled error : Error detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function getEmailTemplate(templateKey) {
    let emailSubject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let emailTemplate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    if (templateKey == 'SCHEDULE_ASSESSMENT_EMAIL_TEMPLATE') {
        emailSubject = SCHEDULE_ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Subject;
        emailTemplate = SCHEDULE_ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Body;
    } else if (templateKey == 'SCHEDULE_INCIDENT_EMAIL_TEMPLATE') {
        emailSubject = INCIDENT_TEMPLATES_OBJ.INCIDENT_TEMPLATES[templateKey].Subject;
        emailTemplate = INCIDENT_TEMPLATES_OBJ.INCIDENT_TEMPLATES[templateKey].Body;
    } else if (templateKey == 'KRI_EMAIL_TEMPLATE') {
        emailSubject = KRI_TEMPLATES_OBJ.KRI_TEMPLATE[templateKey].Subject;
        emailTemplate = KRI_TEMPLATES_OBJ.KRI_TEMPLATE[templateKey].Body;
    } else if (templateKey == 'KRI_UPDATE_REPORTING_EMAIL_TEMPLATE') {
        emailSubject = KRI_REPORTING_FREQUENCY_TEMPLATE_OBJ.KRI_UPDATE_REPORTING[templateKey].Subject;
        emailTemplate = KRI_REPORTING_FREQUENCY_TEMPLATE_OBJ.KRI_UPDATE_REPORTING[templateKey].Body;
    } else if (templateKey == 'KRI_AUTO_EMAIL_REMINDER_TEMPLATE') {
        emailSubject = KRI_AUTO_EMAIL_REMINDER_TEMPLATE_OBJ.KRI_AUTO_REMINDER_TEMPLATE[templateKey].Subject;
        emailTemplate = KRI_AUTO_EMAIL_REMINDER_TEMPLATE_OBJ.KRI_AUTO_REMINDER_TEMPLATE[templateKey].Body;
    } else if (templateKey == 'NOTIFY_BUFFER_REMAINDER_TEMPLATE') {
        emailSubject = NOTIFY_BUFFER_REMINDER_TEMPLATE_OBJ.NOTIFY_BUFFER_REMAINDER_TEMPLATE[templateKey].Subject;
        emailTemplate = NOTIFY_BUFFER_REMINDER_TEMPLATE_OBJ.NOTIFY_BUFFER_REMAINDER_TEMPLATE[templateKey].Body;
    } else if (templateKey == 'KRI_UNREPORTED_EMAIL') {
        emailSubject = KRI_UNREPORTED_EMAIL_OBJ.KRI_UNREPORTED_EMAIL_TEMPLATE[templateKey].Subject;
        emailTemplate = KRI_UNREPORTED_EMAIL_OBJ.KRI_UNREPORTED_EMAIL_TEMPLATE[templateKey].Body;
    } else if (templateKey == 'SEND_EMAIL_MANUALLY_RCSA_EMAIL_TEMPLATE') {
        emailSubject = AUTO_EMAIL_REMAINDER_RCSA_ASSESSMENT_OBJ.SEND_EMAIL_MANUALLY_RCSA[templateKey].Subject;
        emailTemplate = AUTO_EMAIL_REMAINDER_RCSA_ASSESSMENT_OBJ.SEND_EMAIL_MANUALLY_RCSA[templateKey].Body;
    } else {
        emailTemplate = KRI_BTN_QUARTER_TEMPLATE_OBJ.KRI_BUTTON_REPORTING[templateKey].Body;
        emailSubject = KRI_BTN_QUARTER_TEMPLATE_OBJ.KRI_BUTTON_REPORTING[templateKey].Subject;
    }

    return {
        "Subject": emailSubject,
        "Body": emailTemplate
    };
}

function getMessageQueueUtilityClassInstance() {
    if (messageQueue === null) {
        messageQueue = new MessageQueueUtility();
    }
    return messageQueue;
}
module.exports = getMessageQueueUtilityClassInstance;