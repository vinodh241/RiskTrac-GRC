const VALIDATOR_OBJECT      = require('validator');
const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const RISK_ASSESSMENT_DB    = require('../../data-access/risk-assessment-db.js');
const EMAIL_TEMPLATE_OBJ    = require('../../utility/email-templates.js');
const EMAIL_NOTIFICATION    = require('../../utility/email-notification.js');
const INAPP_NOTIFICATION_DB = require('../../data-access/inApp-notification-db.js');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
const BINARY_DATA           = require('../../utility/binary-data.js');
const RA_COLLECTION_FORM_PUBLISH_OBJ    = require('../../config/email-template/ra_collection_form_publishing.js');
const { logger }            = require('../../utility/log-manager/log-manager.js');
const UtilityApp            = require('../../utility/utility.js');
const RISK_APPETITE_DB      = require('../../data-access/risk-appetite-db.js');
const ROUTE_LIST_OBJ        = require('../../utility/enum/enum.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskAssessmentDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskAssessmentBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var templateObject                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var notificationObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var binarydataObject                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskAppetiteDbObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskAssessmentBl {
    constructor() {
        appValidatorObject          = new APP_VALIATOR();
        riskAssessmentDbObject      = new RISK_ASSESSMENT_DB();
        templateObject              = new EMAIL_TEMPLATE_OBJ();    
        notificationObject          = new EMAIL_NOTIFICATION();
        inAppNotificationDbObject   = new INAPP_NOTIFICATION_DB();
        binarydataObject            = new BINARY_DATA();
        utilityAppObject            = new UtilityApp();
        riskAppetiteDbObject        = new RISK_APPETITE_DB();
    }

    start() {
    }

    /**
     * Get framework,users and units Info from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getInfoForScheduleRiskAssessment(request, response) {
        try {

            var refreshedToken                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userData                         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitData                         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let policyData                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let quaterData                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let dataMaster                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            dataMaster          = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution started.');

            const GET_RISK_ASSESSMENT_INFO = await riskAssessmentDbObject.getInfoForScheduleRiskAssessment(userIdFromToken,userNameFromToken,dataMaster, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : GET_RISK_ASSESSMENT_INFO.' + JSON.stringify(GET_RISK_ASSESSMENT_INFO));
                
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_ASSESSMENT_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_ASSESSMENT_INFO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution end. : GET_RISK_ASSESSMENT_INFO is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_ASSESSMENT_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution end. : Error details :' + GET_RISK_ASSESSMENT_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_ASSESSMENT_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_ASSESSMENT_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution end. : Error details : ' + GET_RISK_ASSESSMENT_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
            * Formating resultset provided by DB :START.
            */
             userData   = GET_RISK_ASSESSMENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
             unitData   = GET_RISK_ASSESSMENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
             policyData = GET_RISK_ASSESSMENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]; 
             quaterData = GET_RISK_ASSESSMENT_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];            
             const GET_RA_INFO_DETAILS = await getRADetails(userIdFromToken,policyData, userData, unitData, quaterData);
             /**
             * Formating resultset provided by DB :END.
             */

             // Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_INFO_DETAILS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_INFO_DETAILS) {
                 logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution end. : GET_RA_INFO_DETAILS is undefined or null.');
                 return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution end. : Get Response data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA,GET_RA_INFO_DETAILS));

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getInfoForScheduleRiskAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

    }
 
    /** 
    * Save assessment details to database
    * @param {*} request 
    * @param {*} response 
    * @returns 
    */
    async setRiskAssessment(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let fwid                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let startDate                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let endDate                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let collectionScheduleID        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setRAResponse               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken; 
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            fwid                    = data.fwid;
            startDate               = data.startDate;
            endDate                 = data.endDate;
            collectionScheduleID    = data.collectionScheduleID;           
            /**
             * Validating input parameters : START
             */

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == fwid || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == fwid || appValidatorObject.isStringEmpty(fwid.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : fwid is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FWID_NULL_EMPTY));                
            }
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == startDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == startDate || appValidatorObject.isStringEmpty(startDate.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : startDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.START_DATE_NULL_EMPTY));                
            }
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == endDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == endDate || appValidatorObject.isStringEmpty(endDate.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : endDate is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.END_DATE_NULL_EMPTY));                
            } 
            if(endDate < startDate )  {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : EndDate must be greater than or equal to StartDate.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.END_DATE_LESS_THAN_START_DATE));                
            }       
            /**
             * Validating input parameters : END
             */
            
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == collectionScheduleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == collectionScheduleID || appValidatorObject.isStringEmpty(collectionScheduleID.trim())){
               // restriction to schedule a new Assessment  : START
               const GET_RISK_ASSESSMENT_DATA = await riskAssessmentDbObject.getRiskAssessment(userIdFromToken,userNameFromToken, accountGUIDFromToken);
               let assessmentDetails          = GET_RISK_ASSESSMENT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
               
               logger.log('info', 'setRiskAssessment : getRiskAssessment inside setRiskAssessment : ' + JSON.stringify(GET_RISK_ASSESSMENT_DATA));
              
            //    Condition 1: when one assessment is in progress User can't create new assessment
                for(const obj of Object.values(assessmentDetails)){
                    if(obj.StatusID < CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE)
                    {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : previous quarter assessment is not completed.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PRIVIOUS_ASSESSMENT_STATUS));
                    }                           
                };
               // Condition 2: user can crate assessment in current quater or next quater
                let CreatedDate = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                if(assessmentDetails != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && assessmentDetails.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)
                {
                    CreatedDate = assessmentDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].CreatedDate;
                }                
                else
                {
                    CreatedDate = new Date();
                }  
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment : CreatedDate    : ' + CreatedDate);            
                const CURRENT_QUATER     = await getCurrentQuater(userIdFromToken,CreatedDate);              
                const NEXT_QUATER        = await getNextQuater(userIdFromToken,CreatedDate); 
                const START_DATE_QUATER  = await getCurrentQuater(userIdFromToken,startDate); 
                const PREVIOUS_QUATER    = await getPreviousQuarter(userIdFromToken,CreatedDate); 
                           
                if(START_DATE_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]     != CURRENT_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] 
                    && START_DATE_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]  != CURRENT_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] 
                    && START_DATE_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != NEXT_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] 
                    && START_DATE_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]  != NEXT_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] 
                    && START_DATE_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != PREVIOUS_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] 
                    && START_DATE_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]  != PREVIOUS_QUATER[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])
                {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Assessment can create in current quater or next quater.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_QUATER));
                }

                setRAResponse = await riskAssessmentDbObject.setRiskAssessment(userIdFromToken,userNameFromToken,data, accountGUIDFromToken); // Sechdule new assessment
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment : setRAResponse      : ' + JSON.stringify(setRAResponse || null));

                if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == setRAResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == setRAResponse){
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : setRAResponse is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                if (setRAResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && setRAResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && (setRAResponse.procedureMessage == MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_ALREADY_EXISTS || setRAResponse.procedureMessage == MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.Assessment_Already_Exists_With_Same_Framework_And_Quarter)) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Error details : ' + setRAResponse.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_ALREADY_EXISTS_ON_SAME_FWID));
                }
                if (setRAResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Error details :' + setRAResponse.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                if (setRAResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && setRAResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Error details : ' + setRAResponse.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                // restriction to schedule a new Assessment : END                    
                
                let EmailData   	            = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                EmailData["FrameworkName"]      = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName;       
                EmailData["FrameworkName_1"]    = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName;       
                EmailData["FrameworkName_2"]    = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName;
                EmailData["Quarter"]            = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].QtrName;
                EmailData["Year"]               = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Year;     
                EmailData["StartDate"]          = utilityAppObject.formatDate(userIdFromToken, setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate);       
                EmailData["EndDate"]            = utilityAppObject.formatDate(userIdFromToken, setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate);       
                EmailData["RISKTRAC_WEB_URL"]   = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                let NAV_LINK                    = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                let emailListTo 	    = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                let emailListCc         = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];                    
                let senderEmailTo       = await filterEmailIds(userIdFromToken, emailListTo);     
                let senderEmailCc       = await filterEmailIds(userIdFromToken, emailListCc);
               
                let EmailDataTo = [
                    {
                        EmailID: senderEmailTo
                        // EmailID:  'naganandan.p@secureyes.net',
                        // UserGUID: 'AD88C7AD-5A8B-ED11-AEE5-000C296CF4F3'
                    }
                ];
                let EmailDataCc = [
                    {
                        EmailID: senderEmailCc
                        // EmailID:  'naganandan.p@secureyes.net',
                        // UserGUID: 'AD88C7AD-5A8B-ED11-AEE5-000C296CF4F3'
                    }
                ];
                  
                // RA_COLLECTION_FORM_PUBLISH_OBJ.RA_COLLECTION_FORM_PUBLISHING["RA_COLLECTION_FORM_PUBLISHING_TEMPLATE"];
                let emailTemplateObj = {
                    "Subject": "Risk Assessment ([[FrameworkName]]) has been initiated.",
                    "Body": `<!DOCTYPE html>
                    <html>
                    <body>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <div>
                        <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                        <p style="margin-top:0;margin-bottom:0;"> 
                            Dear,
                        </p>
                        <br>        
                        <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) has been initiated for your unit. Request you to complete it as per the schedule.</p>
                        <br>    
                        <p style="margin-top:0;margin-bottom:0;">
                            Title: [[FrameworkName_2]]<br>
                            Assessment Quarter - Q[[Quarter]]-[[Year]] StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
                            You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                        </p>
                        <br> 
                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
                        </div>
                    </div>
                    </body>
                    </html>`
                }        
                /**
                 * Sending email notification : START
                 */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment : Execution end. : EmailDataTo is undefined or null.');
                    } else {
                        var toEmailIDs = await filterEmailIds(userIdFromToken, EmailDataTo);
                        var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCc);
                        let toccEmails = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": ccEmailIDs
                        }
                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, EmailData, toccEmails);

                        // Inapp notification add for schdule new assessment : start
                        var senderGUIDTO = await filterUserGUIDs(userIdFromToken, emailListTo);
                        var senderGUIDCC = await filterUserGUIDs(userIdFromToken, emailListCc);

                        emailListTo = emailListTo.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );

                        const emailListToNew = emailListTo.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.RA_ROUTES.RA_SUBMIT_PAGE;
                            return { ...obj, routeLink };
                        });

                        const emailListCcNew = emailListCc.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.RA_ROUTES.RA_REVIEW_PAGE;
                            return { ...obj, routeLink };
                        });

                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);
                        logger.log('info', ': riskAssessmentBL : setRiskAssessment : ToCcList: ' + JSON.stringify(ToCcList));

                        ToCcList.forEach(async obj => {                            
                            let inappDetails = {
                                inAppContent     : 'Risk Assessment : ' + EmailData["FrameworkName"] + ' has been initiated.'+ " link:" + obj.routeLink,
                                recepientUserID  : obj.UserGUID,
                                subModuleID      : 1    
                            }
                            let AddInAppAlert = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);     
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment : AddInAppAlert : ' + JSON.stringify(AddInAppAlert || null)); 

                        });
                        // Inapp notification add for schdule new assessment : end
                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment-EmailNotification : Notification error ' + error);
                }
                /**
                 * Sending email notification : END
                 */    
            } else {                

                if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == collectionScheduleID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == collectionScheduleID || appValidatorObject.isStringEmpty(collectionScheduleID.trim())){
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : collectionScheduleID is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COLLECTION_SCHEDULE_ID_NULL_EMPTY));                
                }
                let emailTemplateObj = {
                    "Subject": "Risk Assessment ([[FrameworkName]]) has been modified",
                    "Body": `<!DOCTYPE html>
                    <html>
                    <body>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;"> 
                                Dear,
                            </p>
                            <br>        
                            <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) has been modified by the ORM team.</p>
                            <br>    
                            <p style="margin-top:0;margin-bottom:0;">
                                Title: [[FrameworkName_2]]<br>
                                Assessment Quarter -  Q[[Quater]]-[[Year]] StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
                                You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                            </p>
                            <br> 
                            <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
                            </div>
                        </div>
                    </body>
                    </html>`
                }                 
                setRAResponse               = await riskAssessmentDbObject.updateRiskAssessment(userIdFromToken, userNameFromToken, data, accountGUIDFromToken); // Edit Sechdule assessment
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment : setRAResponse : ' + JSON.stringify(setRAResponse || null));
                
                if (setRAResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && setRAResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE && (setRAResponse.procedureMessage == MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_ALREADY_EXISTS || setRAResponse.procedureMessage == MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.Assessment_Already_Exists_With_Same_Framework_And_Quarter)) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Error details : ' + setRAResponse.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ASSESSMENT_ALREADY_EXISTS_ON_SAME_FWID));
                }

                let assessmentDetails        = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                
                assessmentDetails["FrameworkName"]      = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName;
                assessmentDetails["FrameworkName_1"]    = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName;
                assessmentDetails["FrameworkName_2"]    = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName;
                assessmentDetails["UnitName"]           = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UnitName;
                assessmentDetails["Quater"]             = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Quater;
                assessmentDetails["Year"]               = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Year;
                // assessmentDetails["Name"] = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name;
                assessmentDetails["StartDate"]          = utilityAppObject.formatDate(userIdFromToken, setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate);
                assessmentDetails["EndDate"]            = utilityAppObject.formatDate(userIdFromToken, setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate);
                assessmentDetails["RISKTRAC_WEB_URL"]   = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                let NAV_LINK                            = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

                let EmailData                 = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                let EmailDataCc               = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                // EMail for edit assessment : start
                try {
                    if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailData || EmailData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : EmailData is undefined or null or empty.');                       
                    }
                    else {
                        var toEmailIDs = await filterEmailIds(userIdFromToken, EmailData);
                        var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCc);
                        let toccEmails = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": ccEmailIDs                           
                        }
                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, assessmentDetails, toccEmails);
                        // Inapp notification add for schdule new assessment : start
                        EmailData = EmailData.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );

                        const emailListToNew = EmailData.map(obj => {
                            const routeLink = ROUTE_LIST_OBJ.RA_ROUTES.RA_SUBMIT_PAGE;
                            return { ...obj, routeLink };
                        });

                        const emailListCcNew = EmailDataCc.map(obj => {
                            const routeLink = ROUTE_LIST_OBJ.RA_ROUTES.RA_REVIEW_PAGE;
                            return { ...obj, routeLink };
                        });                       
                        
                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);
                        logger.log('info', ': riskAssessmentBL : setRiskAssessment : updateRiskAssessment : ToCcList: ' + JSON.stringify(ToCcList));
                        
                        for(const obj of ToCcList) {  
                            let messageData = assessmentDetails[0].UnitName ? assessmentDetails[0].UnitName : assessmentDetails[0].FrameworkName;
                            let inappDetails = {
                                inAppContent: 'Risk Assessment :' + messageData + '  has been modified'+ " link:" + obj.routeLink,
                                recepientUserID: obj.UserGUID,
                                subModuleID: 1
                            };
                            setRAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskAssessment : setRAResponse : ' + JSON.stringify(setRAResponse || null));
                        }
                    }
                } catch (error) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment-EmailNotification : Notification error ' + error);
                }
                // EMail for edit assessment : end
            }           
                  
            logger.log('info', 'setRAResponse : ' + JSON.stringify(setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]));
            //Formatting Resultset of getRiskAssessment data
            let assessmentDetails       = setRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];          
            const GET_ASSESSMENT_DATA   = await getAssessmentData(userIdFromToken,assessmentDetails);

            logger.log('info', 'setRiskAssessment : format getRiskAssessment : ' + JSON.stringify(GET_ASSESSMENT_DATA));
            
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ASSESSMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ASSESSMENT_DATA){
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : GET_ASSESSMENT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Assessment scheduled successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, GET_ASSESSMENT_DATA));
             
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }
    
    /**
     * Get  Risk Assessment details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskAssessment(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;


            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution started.');

            const GET_RISK_ASSESSMENT_DATA = await riskAssessmentDbObject.getRiskAssessment(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : GET_RISK_ASSESSMENT_DATA.' + JSON.stringify(GET_RISK_ASSESSMENT_DATA));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_ASSESSMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_ASSESSMENT_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : GET_RISK_ASSESSMENT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_ASSESSMENT_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : Error details :' + GET_RISK_ASSESSMENT_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_ASSESSMENT_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_ASSESSMENT_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : Error details : ' + GET_RISK_ASSESSMENT_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const RALIST_DB_RESPONSE = await riskAppetiteDbObject.getRiskAppetiteList(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RALIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RALIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : RA list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RALIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Error details :' + RALIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RALIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RALIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Error details : ' + RALIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            //Formatting Resultset of getRiskAssessment data
            let assessmentDetails       = GET_RISK_ASSESSMENT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', 'RiskAssessmentBl : getRiskAssessment : assessmentDetails : ' + JSON.stringify(assessmentDetails));

            const GET_ASSESSMENT_DATA   = await getRiskAssessmentData(userIdFromToken, assessmentDetails, RALIST_DB_RESPONSE.recordset[0]);
            logger.log('info', 'RiskAssessmentBl : getRiskAssessment : GET_ASSESSMENT_DATA : ' + JSON.stringify(GET_ASSESSMENT_DATA));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ASSESSMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ASSESSMENT_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : GET_ASSESSMENT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            // No Record found in database.
            if (GET_RISK_ASSESSMENT_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_ASSESSMENT_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_RISK_ASSESSMENT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_ASSESSMENT_DATA));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : Risk Assessments fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_ASSESSMENT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get  Risk Assessment details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskAssessmentViewSubmitted(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;


            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution started.');

            const GET_RISK_ASSESSMENT_DATA = await riskAssessmentDbObject.getRiskAssessmentViewSubmitted(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : GET_RISK_ASSESSMENT_DATA.' + JSON.stringify(GET_RISK_ASSESSMENT_DATA));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_ASSESSMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_ASSESSMENT_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : GET_RISK_ASSESSMENT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_ASSESSMENT_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : Error details :' + GET_RISK_ASSESSMENT_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_ASSESSMENT_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_ASSESSMENT_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : Error details : ' + GET_RISK_ASSESSMENT_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const RALIST_DB_RESPONSE = await riskAppetiteDbObject.getRiskAppetiteList(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RALIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RALIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : RA list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RALIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Error details :' + RALIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RALIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RALIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Error details : ' + RALIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            //Formatting Resultset of getRiskAssessmentViewSubmitted data
            let assessmentDetails       = GET_RISK_ASSESSMENT_DATA.recordset;
            logger.log('info', 'RiskAssessmentBl : getRiskAssessmentViewSubmitted : assessmentDetails : ' + JSON.stringify(assessmentDetails));

            const GET_ASSESSMENT_DATA   = await getRiskViewSubmittedData(userIdFromToken, assessmentDetails, RALIST_DB_RESPONSE.recordset[0]);
            logger.log('info', 'RiskAssessmentBl : getRiskAssessmentViewSubmitted : GET_ASSESSMENT_DATA : ' + JSON.stringify(GET_ASSESSMENT_DATA));
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_ASSESSMENT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_ASSESSMENT_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : GET_ASSESSMENT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            // No Record found in database.
            if (GET_RISK_ASSESSMENT_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_ASSESSMENT_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_RISK_ASSESSMENT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_ASSESSMENT_DATA));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : Risk Assessments fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_ASSESSMENT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentViewSubmitted : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Risk metrics from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskMetrics(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution started.');

            const GET_RISK_DATA = await riskAssessmentDbObject.getRiskMetrics(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : GET_RISK_DATA ' + JSON.stringify(GET_RISK_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : GET_RISK_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (GET_RISK_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : Error details :' + GET_RISK_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : Error details : ' + GET_RISK_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }


            const GET_RA_COLLECTIONS = await formRACollectionsDataForReviewer(userIdFromToken, GET_RISK_DATA);
            logger.log('info', 'RiskAssessmentBl : getRiskMetrics : GET_RA_COLLECTIONS : ' + JSON.stringify(GET_RA_COLLECTIONS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : Assessments fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_RA_COLLECTIONS));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetrics : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Risk metrics from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskMetricsMaker(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution started.');

            const GET_RISK_DATA_MAKER =  await riskAssessmentDbObject.getRiskMetricsMaker(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker :GET_RISK_DATA_MAKER: '+JSON.stringify(GET_RISK_DATA_MAKER || null));
          

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_DATA_MAKER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_DATA_MAKER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution end. : GET_RISK_DATA_MAKER is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (GET_RISK_DATA_MAKER.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution end. : Error details :' + GET_RISK_DATA_MAKER.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA_MAKER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_DATA_MAKER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution end. : Error details : ' + GET_RISK_DATA_MAKER.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const GET_RA_COLLECTIONS = await formRACollectionsDataForMaker(userIdFromToken,GET_RISK_DATA_MAKER);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker :GET_RA_COLLECTIONS: '+JSON.stringify(GET_RA_COLLECTIONS || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution end. : Assessments fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_RA_COLLECTIONS));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskMetricsMaker : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Save self-scoring assessment details to database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRiskMetricsDraft(request, response) {
        try {
            var refreshedToken                      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const SET_RISK_METRIC_DRAFT_RESPONSE = await riskAssessmentDbObject.setRiskMetricsDraft(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
            logger.log('info', ' : RiskAssessmentBl : setRiskMetricsDraft : SET_RISK_METRIC_DRAFT_RESPONSE : ' + JSON.stringify(SET_RISK_METRIC_DRAFT_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_RISK_METRIC_DRAFT_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_RISK_METRIC_DRAFT_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : SET_RISK_METRIC_DRAFT_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRIC_DRAFT_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : Error details :' + SET_RISK_METRIC_DRAFT_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRIC_DRAFT_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_RISK_METRIC_DRAFT_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : Error details : ' + SET_RISK_METRIC_DRAFT_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

 
            const GET_RA_COLLECTIONS = await formRACollectionsDataForMaker(userIdFromToken,SET_RISK_METRIC_DRAFT_RESPONSE);
            logger.log('info', ' : RiskAssessmentBl : setRiskMetricsDraft : GET_RA_COLLECTIONS : ' + JSON.stringify(GET_RA_COLLECTIONS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : RA_Collections updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, GET_RA_COLLECTIONS));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsDraft : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Add reviewed self-scoring assessment details to database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRiskMetricsSubmit(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitId                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let collectionScheduleId    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setRAResponse           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             = request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            data                        = request.body.data;
            accountGUIDFromToken        = request.body.accountGUIDFromToken;         
            let inappDetails            = {}        
            let messageData             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let inAppData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let senderEmailCc           = [];
            let senderEmailTo           = [];
            // userIdFromToken     = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken   = 'naganandan.p@secureyesdev.com';    
 
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution started.');
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            unitId                  = data.unitId;
            collectionScheduleId    = data.collectionScheduleId;
            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == collectionScheduleId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == collectionScheduleId || appValidatorObject.isStringEmpty(collectionScheduleId.trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : collectionScheduleId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COLLECTION_SCHEDULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == unitId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == unitId || appValidatorObject.isStringEmpty(unitId.trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : unitId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNIT_ID_NULL_EMPTY));                
            }
            /**
             * Validating input parameters : END
             */
            const SET_RISK_METRIC_SUBMIT_RESPONSE = await riskAssessmentDbObject.setRiskMetricsSubmit(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsSubmit : SET_RISK_METRIC_SUBMIT_RESPONSE   : ' + JSON.stringify(SET_RISK_METRIC_SUBMIT_RESPONSE || null));
           
 
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_RISK_METRIC_SUBMIT_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_RISK_METRIC_SUBMIT_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : SET_RISK_METRIC_SUBMIT_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRIC_SUBMIT_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : Error details :' + SET_RISK_METRIC_SUBMIT_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRIC_SUBMIT_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_RISK_METRIC_SUBMIT_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : Error details : ' + SET_RISK_METRIC_SUBMIT_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }      
            const GET_RA_COLLECTIONS = await formRACollectionsDataForMaker(userIdFromToken,SET_RISK_METRIC_SUBMIT_RESPONSE);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
           
            // logger.log('error', 'User Id : ' + userIdFromToken);
            const metricData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            metricData["FrameworkName"]     = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricData["FrameworkName_1"]   = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricData["FrameworkName_2"]   = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricData["StartDate"]         = utilityAppObject.formatDate(userIdFromToken, SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricData["EndDate"]           = utilityAppObject.formatDate(userIdFromToken, SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricData["UnitName"]          = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SubmittedUnit                  //formatUnitName(SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricData["Quater"]            = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].QtrName;
            metricData["Year"]              = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Yeardata;
            metricData["RISKTRAC_WEB_URL"]  = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            let NAV_LINK                    = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
 
            if (SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] && SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN].length > 0) {
                let emailListTo = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];
                senderEmailTo = await filterEmailIds(userIdFromToken, emailListTo);
 
                if (SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN] && SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN].length > 0) {
                    let emailListCc = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];
                    senderEmailCc = await filterEmailIds(userIdFromToken, emailListCc);
                }
            }
             
            let EmailDataTo = [];
            if (senderEmailTo) {
                EmailDataTo = [
                    {
                        EmailID: senderEmailTo
                    }
                ];
            }
 
            let EmailDataCc = [];
            if (senderEmailCc) {
                EmailDataCc = [
                    {
                        EmailID: senderEmailCc
                    }
                ];
            }
 
            let emailTemplateObj ={};         
 
            let isResubmit = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].every(obj => obj.IsResubmit == false  ||  obj.IsResubmit == null)
 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsSubmit : isResubmit : ' + isResubmit);
            if (isResubmit) {
                emailTemplateObj = { 
                    "Subject": "Assessment ([[FrameworkName]]) submitted for Review. ",
                    "Body": `<!DOCTYPE html>
                    <html>
                    <body>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;">
                                Dear Reviewer,
                            </p>
                            <br>        
                            <p style="margin-top:0;margin-bottom:0;">An assessment under framework ([[FrameworkName_1]]) has been submitted by the unit. Requesting you to review the same</p>
                            <br>    
                            <p style="margin-top:0;margin-bottom:0;">
                                Title: [[FrameworkName_2]]<br>
                                From the Unit: [[UnitName]]<br>
                                Assessment Quarter - Q[[Quater]]-[[Year]] StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
                                You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                            </p>
                            <br>
                            <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p>
                            </div>
                        </div>
                    </body>
                    </html>`
                }            
            } else {
                emailTemplateObj = {
                    "Subject": "Assessment ([[FrameworkName]]) Resubmitted for Review. ",
                    "Body": `<!DOCTYPE html>
                    <html>
                    <body>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;">
                                Dear Reviewer,
                            </p>
                            <br>        
                            <p style="margin-top:0;margin-bottom:0;">An assessment under framework ([[FrameworkName_1]]) has been Resubmitted by the unit. Requesting you to review the updated changes.</p>
                            <br>    
                            <p style="margin-top:0;margin-bottom:0;">
                                Title: [[FrameworkName_2]]<br>
                                From the Unit: [[UnitName]]<br>
                                Assessment Quarter - Q[[Quater]]-[[Year]] StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
                                You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                            </p>
                            <br>
                            <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p>
                            </div>
                        </div>
                    </body>
                </html>`
                }
            }
            /**
             * Sending email notification : START
             */
            try {
                //CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataCc || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataCc || EmailDataCc.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                if (!EmailDataTo && EmailDataTo.length == 0) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : EmailData is undefined or null.');
                } else {
                    var toEmailIDs = await filterEmailIds(userIdFromToken, EmailDataTo); 
                    var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCc);
 
                    let toccEmails = {
                        "TOEmail": toEmailIDs,
                        "CCEmail": ccEmailIDs
                    }
 
                    await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, metricData, toccEmails);
 
                    // Inapp notification add for schdule new assessment : start
                    let userGUIDToList = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];
                    let userGUIDCcList = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];
 
                    if(isResubmit){
                        inAppData = 'Assessment :' + metricData["FrameworkName"] + ' submitted for Review by unit : ' +  metricData["UnitName"]   + " link:"                        
                    } else {
                        inAppData = 'Assessment :' + metricData["FrameworkName"] + ' Resubmitted for Review by unit : ' +  metricData["UnitName"] + " link:"                        
                    }
                    userGUIDToList = userGUIDToList.filter((obj, index, self) =>
                        index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                    );
                    
                    const toUserGUIDs           = new Set(userGUIDToList.map(obj => obj.UserGUID));
                    const filteredListCcNew     = userGUIDCcList.filter(obj => !toUserGUIDs.has(obj.UserGUID));
                    const ToCcList              = userGUIDToList.concat(filteredListCcNew);
                    logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : ToCcList : ' + JSON.stringify(ToCcList || null));                        
                   
                    for(let obj of ToCcList) {                     
                        inappDetails = {
                            inAppContent : inAppData + ROUTE_LIST_OBJ.RA_ROUTES.RA_REVIEW_PAGE,
                            recepientUserID : obj.UserGUID,
                            subModuleID      : 1
                        }
                        setRAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                    };              
                    logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : setRAResponse : ' + JSON.stringify(setRAResponse || null));                        
                    // Inapp notification add for schdule new assessment : end
                }
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsSubmit-EmailNotification : Notification error ' + error);
            }
            /**            
            * Sending email notification : END
            */
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : RA_Collections updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, GET_RA_COLLECTIONS));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsSubmit : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To Approve or Reject a single or multiple risk metric
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRiskMetricReview(request, response) {
        try {
            var refreshedToken                          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken                         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const SET_RISK_METRIC_REVIEW_RESPONSE = await riskAssessmentDbObject.setRiskMetricReview(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
            logger.log('info', 'RiskAssessmentBl : setRiskMetricReview : SET_RISK_METRIC_REVIEW_RESPONSE : ' + JSON.stringify(SET_RISK_METRIC_REVIEW_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_RISK_METRIC_REVIEW_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_RISK_METRIC_REVIEW_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution end. : SET_RISK_METRIC_REVIEW_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRIC_REVIEW_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution end. : Error details :' + SET_RISK_METRIC_REVIEW_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRIC_REVIEW_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_RISK_METRIC_REVIEW_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution end. : Error details : ' + SET_RISK_METRIC_REVIEW_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const GET_RA_COLLECTIONS = await formRACollectionsDataForReviewer(userIdFromToken,SET_RISK_METRIC_REVIEW_RESPONSE);
            logger.log('info', 'RiskAssessmentBl : setRiskMetricReview : GET_RA_COLLECTIONS : ' + JSON.stringify(GET_RA_COLLECTIONS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricReview : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution end. : RA_Collections updated successfully');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, GET_RA_COLLECTIONS));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To Submit risk metrics for a unit  to database once reviewed
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setRiskMetricsReview(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitId                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let collectionScheduleId    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setRAResponse           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var senderEmailTo           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmailCc           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             = request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            data                        = request.body.data;
            accountGUIDFromToken        = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution started.');
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            unitId                  = data.unitId;
            collectionScheduleId    = data.collectionScheduleId;
            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == collectionScheduleId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == collectionScheduleId || appValidatorObject.isStringEmpty(collectionScheduleId.trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : collectionScheduleId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COLLECTION_SCHEDULE_ID_NULL_EMPTY));
            }
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == unitId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == unitId || appValidatorObject.isStringEmpty(unitId.trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : unitId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNIT_ID_NULL_EMPTY));                
            }
            /**
             * Validating input parameters : END
             */            
            const SET_RISK_METRICS_REVIEW_RESPONSE = await riskAssessmentDbObject.setRiskMetricsReview(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsReview : SET_RISK_METRICS_REVIEW_RESPONSE : ' + JSON.stringify(SET_RISK_METRICS_REVIEW_RESPONSE));            
            //  console.log("SET_RISK_METRICS_REVIEW_RESPONSE: ",JSON.stringify(SET_RISK_METRICS_REVIEW_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_RISK_METRICS_REVIEW_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_RISK_METRICS_REVIEW_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : SET_RISK_METRICS_REVIEW_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRICS_REVIEW_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : Error details :' + SET_RISK_METRICS_REVIEW_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_RISK_METRICS_REVIEW_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_RISK_METRICS_REVIEW_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : Error details : ' + SET_RISK_METRICS_REVIEW_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            //Formatting Resultset of getRiskAssessment Collections
            const GET_RA_COLLECTIONS = await formRACollectionsDataForReviewer(userIdFromToken,SET_RISK_METRICS_REVIEW_RESPONSE);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            const metricReviewData  = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            metricReviewData["RISKTRAC_WEB_URL"]    = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            metricReviewData["FrameworkName"]       = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricReviewData["FrameworkName_1"]     = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricReviewData["FrameworkName_2"]     = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Name || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricReviewData["StartDate"]           = utilityAppObject.formatDate(userIdFromToken, SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricReviewData["EndDate"]             = utilityAppObject.formatDate(userIdFromToken, SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricReviewData["UnitName"]            = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewedUnit;
            metricReviewData["Quater"]              = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].QtrName;  // formatUnitName(SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            metricReviewData["Year"]                = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Yeardata;  // formatUnitName(SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsReview : metricReviewData : ' + JSON.stringify(metricReviewData || null));
            let NAV_LINK                            = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            let emailListTo         = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];
            let emailListCc         = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];
            senderEmailTo           = await filterEmailIds(userIdFromToken, emailListTo);
            senderEmailCc           = await filterEmailIds(userIdFromToken, emailListCc);
            
            let EmailDataTo = [
                {
                    EmailID: senderEmailTo
                    // EmailID: 'naganandan.p@secureyes.net',
                    // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                }
            ];
            let EmailDataCc = [
                {
                    EmailID: senderEmailCc
                    // EmailID: 'naganandan.p@secureyes.net',
                    // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                }
            ];
            
            let emailTemplateObj = {};

            let UnitDetails = SET_RISK_METRICS_REVIEW_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(obj => obj.ParentNodeID != null && obj.StatusName !== 'Not Started')  
            let dataArr = UnitDetails.filter(obj => obj.UnitID == data.unitId)  

            if (dataArr.every(obj=> obj.StatusName == 'Approved') ) {
                emailTemplateObj = {
                    "Subject": "Assessment ([[FrameworkName]]) has been Approved.",
                    "Body": `<!DOCTYPE html>
                    <html>
                    <body>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;"> 
                                Dear,
                            </p>
                            <br>        
                            <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) submitted by your unit has been Approved.</p>
                            <br>    
                            <p style="margin-top:0;margin-bottom:0;">
                                Title: [[FrameworkName_2]]<br>
                                Unit Name: [[UnitName]]<br>
                                Assessment Quarter Q[[Quater]]-[[Year]] - StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
                                You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                            </p>
                            <br> 
                            <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p>
                            </div>
                        </div>
                    </body>
                </html>`
                }
            } else {
                emailTemplateObj = {
                    "Subject": "Assessment ([[FrameworkName]]) has been Rejected", 
                    "Body": `<!DOCTYPE html>
                    <html>
                    <body>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;"> 
                                Dear,
                            </p>
                            <br>        
                            <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) submitted by your unit has been Rejected. Kindly review the same and resubmit the details.</p>
                            <br>    
                            <p style="margin-top:0;margin-bottom:0;">
                                Title: [[FrameworkName_2]]<br>
                                Unit Name: [[UnitName]]<br>
                                Assessment Quarter Q[[Quater]]-[[Year]] - StartDate: [[StartDate]] EndDate: [[EndDate]]<br><br>
                                You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                            </p>
                            <br> 
                            <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p>
                            </div>
                        </div>
                    </body>
                </html>`
                }
            }            

            /**
             * Sending email notification : START
             */
            try {
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataCc || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataCc || EmailDataCc.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : EmailData is undefined or null.');
                } else {
                    var toEmailIDs = await filterEmailIds(userIdFromToken, EmailDataTo);
                    var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCc);
                    let toccEmails = {
                        "TOEmail": toEmailIDs,
                        "CCEmail": ccEmailIDs
                    }
                    await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, metricReviewData, toccEmails);
                    logger.log('info', 'metricReviewData: ' + JSON.stringify(metricReviewData))
                    // Inapp notification add for schdule new assessment : start
                    
                    emailListTo = emailListTo.filter((obj, index, self) =>
                        index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                    );

                    const toUserGUIDs           = new Set(emailListTo.map(obj => obj.UserGUID));
                    const filteredListCcNew     = emailListCc.filter(obj => !toUserGUIDs.has(obj.UserGUID));
                    const ToCcList              = emailListTo.concat(filteredListCcNew);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsReview : ToCcList : ' + JSON.stringify(ToCcList || null));

                    let inappDetails  = {}

                    for(let obj of ToCcList) {                 
                        if(dataArr.every(obj=> obj.StatusName == 'Approved')) {                        
                            inappDetails = {
                                inAppContent     :  metricReviewData["FrameworkName"] + ' has been Approved for the unit: '+ metricReviewData["UnitName"] + " link:" + ROUTE_LIST_OBJ.RA_ROUTES.RA_REVIEW_PAGE,
                                recepientUserID  : obj.UserGUID,
                                subModuleID      : 1
                            }
                        } else {
                            inappDetails = {
                                inAppContent     : metricReviewData["FrameworkName"] + ' has been Rejected for the unit: '+metricReviewData["UnitName"] + " link:" + ROUTE_LIST_OBJ.RA_ROUTES.RA_REVIEW_PAGE,
                                recepientUserID  : obj.UserGUID,
                                subModuleID      : 1
                            }  
                        }
                        setRAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                    }; 

                    // Inapp notification add for schdule new assessment : end
                }
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : setRiskMetricsReview-EmailNotification : Notification error ' + error);
            }
            /**
            * Sending email notification : END
            */
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : RA_Collections updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, GET_RA_COLLECTIONS));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : setRiskMetricsReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Risk metrics from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskAsessmentDetails(request, response) {
        try {
            var refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let collectionScheduleId  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution started.');
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            collectionScheduleId    = data.collectionScheduleId;

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == collectionScheduleId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == collectionScheduleId || appValidatorObject.isStringEmpty(collectionScheduleId.trim())) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : collectionScheduleId is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.COLLECTION_SCHEDULE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const GET_RISK_DATA_MAKER = await riskAssessmentDbObject.getRiskAsessmentDetails(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
            logger.log('info', 'historical assessment page risk metrics DB data : ' + JSON.stringify(GET_RISK_DATA_MAKER));
            

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RISK_DATA_MAKER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RISK_DATA_MAKER) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : GET_RISK_DATA_MAKER is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            if (GET_RISK_DATA_MAKER.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : Error details :' + GET_RISK_DATA_MAKER.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_RISK_DATA_MAKER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_RISK_DATA_MAKER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : Error details : ' + GET_RISK_DATA_MAKER.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

                //Formatting Resultset of getRiskAssessment Collections

            
            const GET_RA_COLLECTIONS = await formRACollectionsDataForHistorical(userIdFromToken,GET_RISK_DATA_MAKER);
           
            logger.log('info', ': RiskAssessmentBl : getRiskAsessmentDetails : GET_RA_COLLECTIONS: ' + JSON.stringify(GET_RA_COLLECTIONS));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_RA_COLLECTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_RA_COLLECTIONS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : GET_RA_COLLECTIONS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : Assessments fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, GET_RA_COLLECTIONS));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getRiskAsessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    async uploadRiskUnitMakerEvidence(request, response) {
        try {
    
            response.setTimeout(1200000);
    
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var remarks                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var destinationPath         = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {
                fileName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                CollectionID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                EvidenceID: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            };
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            remarks                 = request.body.remarks;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
    
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution started.');
    
            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                const ALLOWED_FILE_EXTENSION_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_MIME_TYPES
    
                    await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, function (fileUploadResponseObject) {
                        if (fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
    
                            data.fileName = fileUploadResponseObject.fileName;
                            data.fileContent = fileUploadResponseObject.fileDataContent;
                            data.fileType = fileUploadResponseObject.fileExtension;
                            data.CollectionID = request.body.CollectionID;
                            data.EvidenceID = request.body.EvidenceID || null;
    
                            riskAssessmentDbObject.uploadRiskUnitMakerEvidence(userIdFromToken, userNameFromToken, data, remarks, accountGUIDFromToken, async function (ADD_RISKUNITMAKER_EVIDENCE) {
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_RISKUNITMAKER_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_RISKUNITMAKER_EVIDENCE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : Upload RAT response is undefined or null.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                                }
                                if (ADD_RISKUNITMAKER_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : Error details : ' + ADD_RISKUNITMAKER_EVIDENCE.errorMsg);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                                }
                                if (ADD_RISKUNITMAKER_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_RISKUNITMAKER_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : Error details : ' + ADD_RISKUNITMAKER_EVIDENCE.procedureMessage);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                                }

                                /**
                                 * Formating resultset provided by DB : START.
                                 */
                                const FORMAT_DATA_RESULT = await formatEvidencelist(userIdFromToken, ADD_RISKUNITMAKER_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

                                /**
                                 * Formating resultset provided by DB : END.
                                 */
    
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DATA_RESULT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DATA_RESULT) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : FORMAT_DATA_RESULT is undefined or null.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                                }
    
                                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : KRISCORING evidence uploaded successfully.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_DATA_RESULT));
                            });
                        } else {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : Error on dumping file into server. : Error detail : ' + fileUploadResponseObject.errorMessage);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                        }
                    });
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : uploadRiskUnitMakerEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }    

    /**
     * To delete Risk Unit Maker evidence
     * @param {*} request
     * @param {*} response
     * @returns
     */
    async deleteRiskUnitMakerEvidence(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let EvidenceID              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             = request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            data                        = request.body.data;
            accountGUIDFromToken        = request.body.accountGUIDFromToken

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            EvidenceID = data.EvidenceID;

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EvidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EvidenceID || appValidatorObject.isStringEmpty(EvidenceID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : EvidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await riskAssessmentDbObject.deleteRiskUnitMakerEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : DELETE_RESPONSE of Incident is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : Incident evidence deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : deleteRiskUnitMakerEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    } 
    
    async downloadRiskUnitMakerEvidence(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let EvidenceID              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            EvidenceID = data.EvidenceID;

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EvidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EvidenceID || appValidatorObject.isStringEmpty(EvidenceID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : EvidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DOWNLOAD_RESPONSE = await riskAssessmentDbObject.downloadRiskUnitMakerEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : Error details : ' + DOWNLOAD_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : Error details : ' + DOWNLOAD_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            //Formating DB response
            const RISKUNITMAKER_DOWNLOAD_RESPONSE = await formatDownloadResponse(userIdFromToken, DOWNLOAD_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RISKUNITMAKER_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RISKUNITMAKER_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : RISKUNITMAKER_DOWNLOAD_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : RiskUnitMaker evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, RISKUNITMAKER_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : downloadRiskUnitMakerEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }      

       /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getEmailReminderDataRA(request, response) {
        try {
            var refreshedToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let RA_Email_Data             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let Email_Reminder_Data       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken                = request.body.refreshedToken;
            var data                      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            userIdFromToken               = request.body.userIdFromToken;
            userNameFromToken             = request.body.userNameFromToken;
            accountGUIDFromToken          = request.body.accountGUIDFromToken;
            data                          = request.body.data;

            let senderEmailTo             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let senderEmailCc             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setRAResponse             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let inappDetails              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA :data.' + JSON.stringify(data));    
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution started.');
    
            let RA_MASTER_DB_RESPONSE = await riskAssessmentDbObject.getEmailReminderDataRA(userIdFromToken, userNameFromToken,data, accountGUIDFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : RA_MASTER_DB_RESPONSE ' + JSON.stringify(RA_MASTER_DB_RESPONSE || null));            
    
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RA_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. : Error details :' + RA_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. : Error details : ' + RA_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND_RA));
            }    

            const masterData      = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let unitsNameArray    = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].map(item => item.Name);
            let uniqueUnitsName   = [...new Set(unitsNameArray)];
            let formatUnitsString = uniqueUnitsName.join(', ');

            masterData["FrameworkName"]       = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["FrameworkName_1"]     = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["FrameworkName_2"]     = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FrameworkName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["StartDate"]           = utilityAppObject.formatDate(userIdFromToken, RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].StartDate) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["EndDate"]             = utilityAppObject.formatDate(userIdFromToken, RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EndDate) || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["UnitNames"]           = formatUnitsString;
            masterData["RISKTRAC_WEB_URL"]    = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];

            let emailListTo         = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            let emailListCc         = RA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            senderEmailTo           = await filterEmailIds(userIdFromToken, emailListTo);
            senderEmailCc           = await filterEmailIds(userIdFromToken, emailListCc);
               
            let EmailDataTo = [
                {
                    EmailID: senderEmailTo
                    // EmailID: 'naganandan.p@secureyes.net',
                    // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                }
            ];
            let EmailDataCc = [
                {
                    EmailID: senderEmailCc
                    // EmailID: 'naganandan.p@secureyes.net',
                    // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                }
            ];
            
            let emailTemplateObj = {};
            
            emailTemplateObj = {
                Subject: "Risk Assessment ([[FrameworkName]]) Pending for Submission",
                Body: `<!DOCTYPE html>
                            <html>
                            <body>
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                </head>
                                <div>
                                    <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                                    <p style="margin-top:0;margin-bottom:0;">
                                        Dear,
                                    </p>
                                    <br>        
                                    <p style="margin-top:0;margin-bottom:0;">A Risk Assessment under framework ([[FrameworkName_1]]) has been pending for submission/closure beyond the defined target date. Requesting you to Submit the same.</p>
                                    <br>    
                                    <p style="margin-top:0;margin-bottom:0;">
                                        Title: [[FrameworkName_2]]<br>
                                        From the Unit: [[UnitNames]]<br>
                                        Assessment Quarter: Q[[Quater]]-[[Year]], Assessment StartDate: [[StartDate]], Assessment EndDate: [[EndDate]]<br><br>
                                        You can review the details through this link <a href=[[RISKTRAC_WEB_URL]]>RISKTRAC_WEB_URL</a>
                                    </p>
                                    <br><br>
                                    <p style="margin-top:0;margin-bottom:0;">Kindly discuss with relevant parties in case of any clarifications.</p>
                                    </div>
                                </div>
                            </body>
                        </html>`
            } 
            /**
             * Sending email notification : START
             */
            try {
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataCc || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataCc || EmailDataCc.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. : EmailData is undefined or null.');
                } else {
                    var toEmailIDs = await filterEmailIds(userIdFromToken, EmailDataTo);
                    var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCc);
                    let toccEmails = {
                        "TOEmail": toEmailIDs,
                        "CCEmail": ccEmailIDs
                    }
                    await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, masterData, toccEmails);

                    emailListTo = emailListTo.filter((obj, index, self) =>
                        index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                    );

                    const emailListToNew = emailListTo.map(obj => {
                        const routeLink = ROUTE_LIST_OBJ.RA_ROUTES.RA_SUBMIT_PAGE;          
                        return { ...obj, routeLink };
                    });                    
                        
                    const emailListCcNew = emailListCc.map(obj => {
                        const routeLink =  ROUTE_LIST_OBJ.RA_ROUTES.RA_REVIEW_PAGE;
                        return { ...obj, routeLink };
                    });
                    
                    const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                    const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));
                    const ToCcList              = emailListToNew.concat(filteredListCcNew);

                    logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getEmailReminderDataRA : ToCcList : ' + JSON.stringify(ToCcList || null));                        

                    ToCcList.forEach(async obj => {                        
                        inappDetails = {
                            inAppContent : 'Risk Assessment ('+masterData["FrameworkName"] +') Pending for Submission' + 'link:' +   obj.routeLink, //'submit-risk-assessments',
                            recepientUserID : obj.UserGUID,
                            subModuleID      : 1
                        }
                        setRAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);
                    });              
                    logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getEmailReminderDataRA : setRAResponse : ' + JSON.stringify(setRAResponse || null));     

                }
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA-EmailNotification : Notification error ' + error);
            }
            /**
            * Sending email notification : END
            */
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. : Get RiskAppetite Dashboard List successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_SUCCESSFUL, RA_MASTER_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getEmailReminderDataRA : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
        }
    }

    stop() {
    }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : errorMessage
        }
    }
}

function successfulResponse(refreshedToken, successMessage, result) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}

/**
 * This is function will format DB response of upload incident .
 */
async function formatEvidencelist(userIdFromToken,dbRecordSet) { 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution started.'); 

        let evidences = []; 

        // forming uploadedincident evidence data for UI.  
        if (dbRecordSet.length > 0) {
            evidences.push({
                "EvidenceID": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EvidenceID,
                "FileName": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileName,
                "Remark": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Remark,
                "FileType": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
                "FileContentID": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContentID,
            });
        }
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of download incident evidence .
 */
async function formatDownloadResponse(userIdFromToken,dbRecordSet) { 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formatDownloadResponse : Execution started.'); 

        let evidences = []; 
        // forming uploadedincident evidence data for UI. 
        if (dbRecordSet.length > 0) {
            evidences.push({
                "FileName": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileName,
                "FileType": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
                "FileContent": dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContent
            });
        } 

        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formatDownloadResponse : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formatDownloadResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format the DB response of getRiskPolicy details.
 */
async function getRADetails(userIdFromToken, policyData, userData, unitData, quaterData) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRADetails : Execution started.');
        let users           = [];
        let units           = [];
        let usersDetails    = [];
        let unitDetails     = [];
       
        users = userData.filter(ele => ele.UserGUID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        units = unitData.filter(ele => ele.UnitID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
    
        //fetching unitid and unitname for the Units object
        for(const obj of Object.values(units)) {
            unitDetails.push({
                "unitID"  :obj.UnitID,
                "unitName":obj.Name
            })
        };
    
        //fetching userid and username for the users object
        for(const obj of Object.values(users)) {
            let userName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if (obj.FirstName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)
            {
                userName = obj.FirstName +' '+ obj.LastName;
            }
            usersDetails.push({
                "userGUID"      : obj.UserGUID,
                "FirstName"     : obj.FirstName,
                "MiddleName"    : obj.MiddleName,
                "LastName"      : obj.LastName,
                "userName"      : userName
            })
        };
    
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRADetails : Execution end.');

        return{
            "frameworkData" :policyData,
            "userData"      :usersDetails,
            "unitData"      :unitDetails,
            "quaterData"    :quaterData
        } 
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRADetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
    
}

/**
 * This is function will format the DB response of getRiskAssessment data.
 */
async function getAssessmentData(userIdFromToken,assessmentDetails) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getAssessmentData : Execution started.');
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getAssessmentData : assessmentDetails : ' + JSON.stringify(assessmentDetails));
        let assessments = [];
        for(const obj of Object.values(assessmentDetails)) {
            let userName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if (obj.FirstName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)
            {
                userName = obj.FirstName +' '+ obj.LastName;
            }           
            assessments.push({
                CollectionScheduleID    : obj.CollectionScheduleID,         
                StartDate               : obj.StartDate,
                EndDate                 : obj.EndDate,
                ReviewerGUID            : obj.ReviewerGUID, 
                FirstName               : obj.FirstName,
                MiddleName              : obj.MiddleName,
                LastName                : obj.LastName,
                ReviewerName            : obj.userName,
                ReviewerEmailID         : obj.ReviewerName,
                UnitID                  : obj.UnitID,
                UnitName                : obj.UnitName,
                StatusID                : obj.StatusID,
                StatusName              : obj.StatusName,
                FWID                    : obj.FWID,
                FrameworkName           : obj.FrameworkName,
                FileID                  : obj.FrameworkFileID,
                FrameworkFileName       : obj.FrameworkFileName,
                PolicyFileName          : obj.PolicyFileName,
                QuaterID                : obj.QuaterID,
                Quater                  : obj.Quater,
                Year                    : obj.Year,
                UnitIDs                 : obj.UnitIDs,
                UnitNames               : obj.UnitNames,
                ReminderDate            : obj.ReminderDate,

            })
    };
    logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getAssessmentData : assessments : ' + JSON.stringify(assessments));
    logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getAssessmentData : Execution end');
    return{
        "assessments":assessments
    }
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getAssessmentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
   
}


async function getRiskViewSubmittedData(userIdFromToken, assessmentDetails, frameworkDataResponse) {
    // console.log('✌️frameworkDataResponse --->', frameworkDataResponse);
        try {
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskViewSubmittedData : Execution started.');
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskViewSubmittedData : assessmentDetails : ' + JSON.stringify(assessmentDetails));
            let assessments     = [];
            let frameworkData   = 0;
            let reviewedData    = [];
    
            for(const obj of Object.values(assessmentDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                let userName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                if (obj.FirstName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    userName = obj.FirstName +' '+ obj.LastName;
                }           
                assessments.push({
                    CollectionScheduleID    : obj.CollectionScheduleID,         
                    StartDate               : obj.StartDate,
                    EndDate                 : obj.EndDate,
                    ReviewerGUID            : obj.ReviewerGUID, 
                    FirstName               : obj.FirstName,
                    MiddleName              : obj.MiddleName,
                    LastName                : obj.LastName,
                    ReviewerName            : obj.userName,
                    ReviewerEmailID         : obj.ReviewerName,
                    UnitID                  : obj.UnitID,
                    UnitName                : obj.UnitName,
                    StatusID                : obj.StatusID,
                    StatusName              : obj.StatusName,
                    FWID                    : obj.FWID,
                    FrameworkName           : obj.FrameworkName,
                    FileID                  : obj.FrameworkFileID,
                    FrameworkFileName       : obj.FrameworkFileName,
                    PolicyFileName          : obj.PolicyFileName,
                    QuaterID                : obj.QuaterID,
                    Quater                  : obj.Quater,
                    Year                    : obj.Year,
                    UnitIDs                 : obj.UnitIDs,
                    UnitNames               : obj.UnitNames,
                    ReminderDate            : obj.ReminderDate,
    
                })
            };
    
            if(frameworkDataResponse != null) {
                frameworkData = frameworkDataResponse && frameworkDataResponse.length ? frameworkDataResponse.length : 0
            }
            if(assessmentDetails != null) {
               reviewedData = assessmentDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            }
    
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskViewSubmittedData : assessments : ' + JSON.stringify(assessments));
            logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskViewSubmittedData : Execution end');
            
            return {
                "assessments"   : assessments,
                "frameworkData" : frameworkData,
                "reviewedData"  : reviewedData
            }
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskViewSubmittedData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
       
    }

async function getRiskAssessmentData(userIdFromToken, assessmentDetails, frameworkDataResponse) {
// console.log('✌️frameworkDataResponse --->', frameworkDataResponse);
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentData : Execution started.');
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentData : assessmentDetails : ' + JSON.stringify(assessmentDetails));
        let assessments     = [];
        let frameworkData   = 0;

        for(const obj of Object.values(assessmentDetails)) {
            let userName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            if (obj.FirstName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                userName = obj.FirstName +' '+ obj.LastName;
            }           
            assessments.push({
                CollectionScheduleID    : obj.CollectionScheduleID,         
                StartDate               : obj.StartDate,
                EndDate                 : obj.EndDate,
                ReviewerGUID            : obj.ReviewerGUID, 
                FirstName               : obj.FirstName,
                MiddleName              : obj.MiddleName,
                LastName                : obj.LastName,
                ReviewerName            : obj.userName,
                ReviewerEmailID         : obj.ReviewerName,
                UnitID                  : obj.UnitID,
                UnitName                : obj.UnitName,
                StatusID                : obj.StatusID,
                StatusName              : obj.StatusName,
                FWID                    : obj.FWID,
                FrameworkName           : obj.FrameworkName,
                FileID                  : obj.FrameworkFileID,
                FrameworkFileName       : obj.FrameworkFileName,
                PolicyFileName          : obj.PolicyFileName,
                QuaterID                : obj.QuaterID,
                Quater                  : obj.Quater,
                Year                    : obj.Year,
                UnitIDs                 : obj.UnitIDs,
                UnitNames               : obj.UnitNames,
                ReminderDate            : obj.ReminderDate,

            })
        };

        if(frameworkDataResponse != null) {
            frameworkData = frameworkDataResponse && frameworkDataResponse.length ? frameworkDataResponse.length : 0
        }
      

        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentData : assessments : ' + JSON.stringify(assessments));
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getRiskAssessmentData : Execution end');
        
        return {
            "assessments"   : assessments,
            "frameworkData" : frameworkData
        }
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getAssessmentData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
   
}

/**
 * This is function will format the DB response of getRiskMetricsMaker data.
 */
async function formRACollectionsDataForMaker(userIdFromToken, SET_RISK_METRIC_SUBMIT_RESPONSE) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : formRACollectionsDataForMaker : Execution started.');
        //Formatting Resultset of getRiskAssessment Collections
        let frameworkData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        let riskMetricData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        let riskMetricDataHistorical = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        let userUnitsData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
        let quarterData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        let riskReportData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        let riskMetricLevelsData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
        let EvidenceData = SET_RISK_METRIC_SUBMIT_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

        let scoringHeaders = [];
        let previousScores = [];
        let unitUsers = [];
        let unitIDs = [];
        let frameworkdetails = [];
        let riskMetricDetails = [];
        let evidences = [];
        let prevHeader = [];

        // Evidences Data
        if (EvidenceData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            evidences = EvidenceData;
        }


        // forming framework details data for UI.
        for (const obj of Object.values(frameworkData)) {
            frameworkdetails.push({
                "CollectionScheduleID": obj.CollectionScheduleID,
                "Name": obj.Name,
                "StartDate": obj.StartDate,
                "EndDate": obj.EndDate,
                "RemainingDays": await getRemainingDays(obj.EndDate),
                "UnitID" : obj.UnitID
            })
        };

        /*
        *filtering riskMetricData based on the unit to which user belongs to
        */
        for (const obj of Object.values(userUnitsData)) {
            unitIDs.push(obj.UnitID);
        }
        riskMetricDetails = riskMetricData //.filter(ele => unitIDs.includes(ele.UnitID)); commented this on jira AMK-1397

        // forming data for risk name as Parent Risk array
        riskAppetiteData = riskMetricDetails.filter(ele => ele.ParentNodeID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);

        for (const obj of Object.values(riskMetricDetails)) {
            let appetiteObj = riskAppetiteData.filter(ele => ele.NodeID == obj.ParentNodeID);
            obj['ParentRisk'] = appetiteObj && appetiteObj.length ? appetiteObj.map(ele => ele.CaptionData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        };

        // forming data for riskMetricData to send UI.
        riskMetricDetails = riskMetricDetails.filter(ele => ele.ParentNodeID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        for (const obj of Object.values(riskMetricDetails)) {

            let evidencesArry = evidences.filter(ele => Number(ele.NodeID) == Number(obj.NodeID));

            unitUsers.push({
                "Risk": obj.ParentRisk != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.ParentRisk[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "NodeID": obj.NodeID,
                "CaptionData": obj.CaptionData,
                "Limit1": obj.Limit1 ? obj.Limit1.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "Limit2": obj.Limit2 ? obj.Limit2.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "Limit3": obj.Limit3 ? obj.Limit3.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "MetricScore": obj.MetricScore,
                "Remarks": obj.Remarks,
                "ActionPlan": obj.ActionPlan,
                "UnitID": obj.UnitID,
                "UnitName": obj.UnitName,
                "Status": obj.StatusID,
                "StatusName": obj.StatusName,
                "IsReviewer": obj.IsReviewer ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "IsMaker": obj.IsMaker ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "MeasurmentTypeID": obj.MeasurmentTypeID,
                "MeasurmentType": obj.MeasurmentType,
                "IsReviewed": obj.IsReviewed,
                "RiskMetricLevelID": obj.RiskMetricLevelID,
                "RiskMetricLevel": obj.RiskMetricLevel,
                "ColorCode": obj.ColorCode,
                "CommentData": obj.CommentData ? JSON.parse(obj.CommentData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "evidences": evidencesArry
            })
        };

            logger.log('info', 'previous scoring data for UI : unitUsers' + JSON.stringify(unitUsers));

        // forming PreviousScoring data to send UI.
        if (unitUsers && unitUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            for (const obj of (unitUsers)) {
                previousScores = riskMetricDataHistorical.filter(ele => ele.NodeID == obj.NodeID);
                let scoresArr = [];
                if (previousScores && previousScores.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    scoresArr = previousScores.map(ele => JSON.parse(ele.previousScoring)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                }

                obj['PreviousScoring'] = (scoresArr && scoresArr.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? scoresArr : [];
            };

            const filteredData = unitUsers.filter(item => item.PreviousScoring.length > 0);

            logger.log('info', 'User Id ::: formRACollectionsDataForHistorical : unitUsers : ' + JSON.stringify(unitUsers || null));
            logger.log('info', 'User Id ::: formRACollectionsDataForHistorical : filteredData : ' + JSON.stringify(filteredData || null));

            if (filteredData && filteredData.length) {
                if (filteredData[0].PreviousScoring[0] != []) {
                    let quaterYear = filteredData[0].PreviousScoring[0];
                    const previousQuarter = quaterYear.Quater;
                    const previousYear = quaterYear.Year;
                    if (previousQuarter !== undefined && previousYear !== undefined) {
                        let preYear = previousYear.toString().substring(2, 4);
                        const prevcaption = 'Q' + previousQuarter + '-' + preYear;
                        prevHeader.push({
                            "Caption": prevcaption,
                            "year": previousYear,
                            "Quarter": previousQuarter
                        });
                    }
                }
            }
            // logger.log('info', 'previous scoring data for UI : ' + JSON.stringify(scoresArr));
        }

        // Forming data for previousScoringHeader to send UI.
        for (const obj of quarterData) {
            scoringHeaders = quarterData.map((ele) => {
                return {
                    "Caption": "Q" + ele.Quater + CONSTANT_FILE_OBJ.APP_CONSTANT.HYPEN + (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY + ele.Year).substring(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO, CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR),
                    "year": (ele.Year) ? (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY + ele.Year) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY,
                    "Quarter": (ele.Quater) ? ele.Quater.toString() : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY
                }
            })
            scoringHeaders = scoringHeaders.filter((value, index, self) =>
                index === self.findIndex((t) => (t.Caption === value.Caption)
            ))
            scoringHeaders.sort((a, b) => (a.year - b.year || a.Quarter.localeCompare(b.Quarter)));
        }

        // Forming data for reportdetails to send UI.
        let reportDetails = [];
        for (const obj of Object.values(riskReportData)) {
            reportDetails.push({
                T0: obj.T_0,
                T1: obj.T_1,
                T2: obj.T_2,
                RiskMetricLevelID: obj.RiskMetricLevelID,
                RiskMetricLevel: obj.RiskMetricLevel,
                IsEscalationMandatory: obj.IsEscalationMandatory,
                IsActionMandatory: obj.IsActionMandatory,
                ReportingStructureID: obj.ReportingStructureID

            })
        };




        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : formRACollectionsDataForMaker : Execution end.');
        return {
            "frameworkData": frameworkdetails,
            "previousScoringHeader": prevHeader,
            "riskMetricData": unitUsers,
            "riskReportData": reportDetails,
            "riskMetricLevelsData": riskMetricLevelsData
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : formRACollectionsDataForMaker : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

/**
 * This is function will format the DB response of getRiskMetrics data.
 * This is for Historical Risk Assessments page.
 */
async function formRACollectionsDataForHistorical(userIdFromToken,GET_RISK_DATA_MAKER) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForHistorical : Execution started.');

        // logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForHistorical : GET_RISK_DATA_MAKER:'+ JSON.stringify(GET_RISK_DATA_MAKER || null));

        let frameworkData               = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        let riskMetricData              = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        let riskMetricDataHistorical    = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        let userUnitsData               = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
        let quarterData                 = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        let riskReportData              = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        let riskMetricLevelsData        = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
        let EvidenceData                = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

        let scoringHeaders      =   [];
        let previousScores      =   [];
        let unitUsers           =   [];
        let frameworkdetails    =   [];
        let riskMetricDetails   =   [];
        let riskAppetiteData    =   [];
        let evidences           =   [];
        let prevHeader          =   [];
        let pastScoreData       =   [];
        let dataArr             =   [];

        // forming framework details data for UI.
        for(const obj of Object.values(frameworkData)) {
            frameworkdetails.push({
                "CollectionScheduleID"  : obj.CollectionScheduleID,
                "Name"                  : obj.Name,
                "StartDate"             : obj.StartDate,
                "EndDate"               : obj.EndDate,
                "RemainingDays"         : await getRemainingDays(obj.EndDate),
            })
        };

        // Evidences Data
        if (EvidenceData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            evidences = EvidenceData;
        }

            
        // forming data for risk name as Parent Risk array
        riskAppetiteData    = riskMetricData.filter(ele => ele.ParentNodeID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForHistorical : riskMetricData : ' + JSON.stringify(riskMetricData));
        for(const obj of Object.values(riskMetricData)) {
            let appetiteObj   = riskAppetiteData.filter(ele => ele.NodeID == obj.ParentNodeID);
            obj['ParentRisk'] = appetiteObj && appetiteObj.length ? appetiteObj.map(ele => ele.CaptionData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        };
        
        // forming data for riskMetricData to send UI.
        riskMetricDetails = riskMetricData.filter(ele => ele.ParentNodeID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        for(const obj of Object.values(riskMetricDetails)) {
            let evidencesArry = evidences.filter(ele => Number(ele.NodeID) == Number(obj.NodeID));

            unitUsers.push({
                "Risk"              : obj.ParentRisk != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.ParentRisk[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "NodeID"            : obj.NodeID,
				"CaptionData"       : obj.CaptionData,
				"Limit1"            : obj.Limit1 ? obj.Limit1.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
				"Limit2"            : obj.Limit2 ? obj.Limit2.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
				"Limit3"            : obj.Limit3 ? obj.Limit3.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
				"MetricScore"       : obj.MetricScore,
				"Remarks"           : obj.Remarks,
				"ActionPlan"        : obj.ActionPlan,
				"UnitID"            : obj.UnitID,
				"UnitName"          : obj.UnitName,
				"Status"            : obj.StatusID,
				"StatusName"        : obj.StatusName,
                "IsReviewer"        : obj.IsReviewer ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
				"IsMaker"           : obj.IsMaker,
                "MeasurmentTypeID"  : obj.MeasurmentTypeID,
                "MeasurmentType"    : obj.MeasurmentType,
                "IsReviewed"        : obj.IsReviewed,
                "RiskMetricLevelID" : obj.RiskMetricLevelID,
                "RiskMetricLevel"   : obj.RiskMetricLevel,
				"ColorCode"         : obj.ColorCode,
                "CommentData"       : obj.CommentData ? JSON.parse(obj.CommentData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "evidences"         : evidencesArry,
                "reminderDate"      : obj.ReminderDate,
                "Quater"            : obj.Quater,
                "Year"              : obj.Year,
                "CollectionID"      : obj.CollectionID,
                "NodeID"            : obj.NodeID,
            })
            
        };
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForHistorical : riskMetricDataHistorical : ' + JSON.stringify(riskMetricDataHistorical || null));
        
        if (unitUsers && unitUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'formRACollectionsDataForHistorical : unitUsers : ' + JSON.stringify(unitUsers || null));
            for(const obj of unitUsers) {
                previousScores = riskMetricDataHistorical.filter(ele => ele.NodeID == obj.NodeID);
                logger.log('info', 'formRACollectionsDataForHistorical : previousScores : ' + JSON.stringify(previousScores || null));
                let scoresArr = [];

                if (previousScores && previousScores.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
                    if (previousScores[0].previousScoring != null) {
                        scoresArr = previousScores.map(ele => JSON.parse(ele.previousScoring)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);           
                    }                        
                }

                logger.log('info', 'formRACollectionsDataForHistorical : scoresArr : ' + JSON.stringify(scoresArr || null));

                // obj['PreviousScoringFromDB'] = (scoresArr && scoresArr.length > 0 && scoresArr != null  ) ? (((Number(scoresArr[0].Quater) <= Number(obj.Quater)) && (Number(scoresArr[0].CollectionID) != Number(obj.CollectionID))) ? scoresArr : []) : [];       
                obj['PreviousScoring'] = (scoresArr && scoresArr.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? scoresArr : [];
                // console.log( 'obj ==== ',JSON.stringify(obj))
                logger.log('info', 'formRACollectionsDataForHistorical : obj : ' + JSON.stringify(obj || null));
            };       
            
            const filteredData = unitUsers.filter(item => item.PreviousScoring.length > 0);            
            
            logger.log('info', 'User Id ::: formRACollectionsDataForHistorical : unitUsers : ' + JSON.stringify(unitUsers || null));
            logger.log('info', 'User Id ::: formRACollectionsDataForHistorical : filteredData : ' + JSON.stringify(filteredData || null));
            
            if (filteredData && filteredData.length ) {  
                if ( filteredData[0].PreviousScoring[0] != []) {
                    let quaterYear  = filteredData[0].PreviousScoring[0];
                    const previousQuarter = quaterYear.Quater;
                    const previousYear = quaterYear.Year;
                    if (previousQuarter !== undefined && previousYear !== undefined) {
                        let preYear = previousYear.toString().substring(2, 4);
                        const prevcaption = 'Q'+ previousQuarter +'-'+ preYear; 
                        prevHeader.push({
                            "Caption": prevcaption,
                            "year": previousYear,
                            "Quarter": previousQuarter
                        });
                    }
                }
            } 
        }
       
       // Forming data for previousScoringHeader to send UI.
       for(const obj of quarterData) {
            scoringHeaders= quarterData.map((ele) => {
                return {
                    "Caption"   : "Q" + ele.Quater + CONSTANT_FILE_OBJ.APP_CONSTANT.HYPEN + (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY + ele.Year).substring(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO,CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR),
                    "year"      : (ele.Year) ? (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY + ele.Year): CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY,
                    "Quarter"   : ele.Quater.toString()
                }
            })
            scoringHeaders = scoringHeaders.filter((value, index, self) =>
               index === self.findIndex((t) => (t.Caption === value.Caption)
            ))
            scoringHeaders.sort((a,b)=> (a.year - b.year || a.Quarter.localeCompare(b.Quarter) ));
        }

        // Forming data for reportDetails to send UI.
        let reportDetails =[];
        for(const obj of Object.values(riskReportData)) {
            reportDetails.push({
                T0                      : obj.T_0,
                T1                      : obj.T_1,
                T2                      : obj.T_2,
                RiskMetricLevelID       : obj.RiskMetricLevelID,
                RiskMetricLevel         : obj.RiskMetricLevel,
                IsEscalationMandatory   : obj.IsEscalationMandatory,
                IsActionMandatory       : obj.IsActionMandatory,
                ReportingStructureID    : obj.ReportingStructureID

            })
        };
    	    
        
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForHistorical : Execution end.');

        // Forming final data to send UI.
        return{
            "frameworkData"         : frameworkdetails,
            "previousScoringHeader" : prevHeader,
            "riskMetricData"        : unitUsers,
            "riskReportData"        : reportDetails,
            "riskMetricLevelsData"  : riskMetricLevelsData
        }
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForHistorical : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
    
}

/**
 * This function will format the DB response of getRiskMetrics data.
 * This is fro reviewer, so there is no need to filter riskMetric data on unit basis.
 * Reviewer should get data for all the unit.
 */ 
// START
async function formRACollectionsDataForReviewer(userIdFromToken, GET_RISK_DATA_MAKER) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : formRACollectionsDataForReviewer : Execution started.');

        // logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : formRACollectionsDataForReviewer : GET_RISK_DATA_MAKER:'+ JSON.stringify(GET_RISK_DATA_MAKER || null));

        let frameworkData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        let riskMetricData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        let riskMetricDataHistorical = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        let userUnitsData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
        let quarterData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        let riskReportData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        let riskMetricLevelsData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
        let EvidenceData = GET_RISK_DATA_MAKER.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

        let scoringHeaders = [];
        let previousScores = [];
        let unitUsers = [];
        let frameworkdetails = [];
        let riskMetricDetails = [];
        let riskAppetiteData = [];
        let evidences = [];

        // forming framework details data for UI.
        for (const obj of Object.values(frameworkData)) {
            frameworkdetails.push({
                "CollectionScheduleID"  : obj.CollectionScheduleID,
                "Name"                  : obj.Name,
                "StartDate"             : obj.StartDate,
                "EndDate"               : obj.EndDate,
                "RemainingDays"         : await getRemainingDays(obj.EndDate),
                "UnitID"                : obj.UnitID
            })
        };

        // Evidences Data
        if (EvidenceData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            evidences = EvidenceData;
        }


        // forming data for risk name as Parent Risk array
        riskAppetiteData = riskMetricData.filter(ele => ele.ParentNodeID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        for (const obj of Object.values(riskMetricData)) {
            let appetiteObj = riskAppetiteData.filter(ele => ele.NodeID == obj.ParentNodeID);
            obj['ParentRisk'] = appetiteObj && appetiteObj.length ? appetiteObj.map(ele => ele.CaptionData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        };

        // forming data for riskMetricData to send UI.
        riskMetricDetails = riskMetricData.filter(ele => ele.ParentNodeID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        for (const obj of Object.values(riskMetricDetails)) {
            let evidencesArry = evidences.filter(ele => Number(ele.NodeID) == Number(obj.NodeID));

            unitUsers.push({
                "Risk": obj.ParentRisk != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.ParentRisk[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "NodeID": obj.NodeID,
                "CaptionData": obj.CaptionData,
                "Limit1": obj.Limit1 ? obj.Limit1.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "Limit2": obj.Limit2 ? obj.Limit2.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "Limit3": obj.Limit3 ? obj.Limit3.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "MetricScore": obj.MetricScore,
                "Remarks": obj.Remarks,
                "ActionPlan": obj.ActionPlan,
                "UnitID": obj.UnitID,
                "UnitName": obj.UnitName,
                "Status": obj.StatusID,
                "StatusName": obj.StatusName,
                "IsReviewer": obj.IsReviewer ? CONSTANT_FILE_OBJ.APP_CONSTANT.ONE : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "IsMaker": obj.IsMaker,
                "MeasurmentTypeID": obj.MeasurmentTypeID,
                "MeasurmentType": obj.MeasurmentType,
                "IsReviewed": obj.IsReviewed,
                "RiskMetricLevelID": obj.RiskMetricLevelID,
                "RiskMetricLevel": obj.RiskMetricLevel,
                "ColorCode": obj.ColorCode,
                "CommentData": obj.CommentData ? JSON.parse(obj.CommentData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "evidences": evidencesArry,
                "reminderDate": obj.ReminderDate
            })
        };

        // forming PreviousScoring data to send UI.
        if (unitUsers && unitUsers.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'formRACollectionsDataForReviewer : unitUsers : ' + JSON.stringify(unitUsers));
            for (const obj of (unitUsers)) {
                previousScores = riskMetricDataHistorical.filter(ele => ele.NodeID == obj.NodeID);
                let scoresArr = [];
                if (previousScores && previousScores.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    scoresArr = previousScores.map(ele => JSON.parse(ele.previousScoring)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                }
                // console.log("scoresArr",scoresArr);
                obj['PreviousScoring'] = (scoresArr && scoresArr.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) ? scoresArr : [];
                logger.log('info', 'formRACollectionsDataForReviewer : obj : ' + JSON.stringify(obj));
            };
        }

        // Forming data for previousScoringHeader to send UI.
        for (const obj of quarterData) {
            scoringHeaders = quarterData.map((ele) => {
                return {
                    "Caption": "Q" + ele.Quater + CONSTANT_FILE_OBJ.APP_CONSTANT.HYPEN + (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY + ele.Year).substring(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO, CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR),
                    "year": (ele.Year) ? (CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY + ele.Year) : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY,
                    "Quarter": ele.Quater.toString()
                }
            })
            scoringHeaders = scoringHeaders.filter((value, index, self) =>
                index === self.findIndex((t) => (t.Caption === value.Caption)
                ))
            scoringHeaders.sort((a, b) => (a.year - b.year || a.Quarter.localeCompare(b.Quarter)));
        }

        // Forming data for reportDetails to send UI.
        let reportDetails = [];
        for (const obj of Object.values(riskReportData)) {
            reportDetails.push({
                T0: obj.T_0,
                T1: obj.T_1,
                T2: obj.T_2,
                RiskMetricLevelID: obj.RiskMetricLevelID,
                RiskMetricLevel: obj.RiskMetricLevel,
                IsEscalationMandatory: obj.IsEscalationMandatory,
                IsActionMandatory: obj.IsActionMandatory,
                ReportingStructureID: obj.ReportingStructureID

            })
        };


        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : formRACollectionsDataForReviewer : Execution end.');

        // Forming final data to send UI.
        return {
            "frameworkData": frameworkdetails,
            "previousScoringHeader": scoringHeaders,
            "riskMetricData": unitUsers,
            "riskReportData": reportDetails,
            "riskMetricLevelsData": riskMetricLevelsData
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : formRACollectionsDataForReviewer : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}


// END


// function for getting remaining days
async function getRemainingDays(EndDate) {
    const todaysDate = new Date();
    const endDate    = new Date(EndDate);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    // Calculating the no. of days between two dates
    const diffInDays = Math.round((endDate - todaysDate) / oneDay);
    return diffInDays;
}



/**
 * This function will return the Unit Names of submitted RA collection forms
 */
function formatUnitName(arrayOfObjects) {
    try {
        logger.log('info', 'formatUnitName : Execution started.' + arrayOfObjects);
        const unitNamesArray = arrayOfObjects.map((obj) => obj.UnitName);
        const uniqueUnitNamesArray = [...new Set(unitNamesArray)];

        const UnitNames = uniqueUnitNamesArray.join(', ');
         return UnitNames;
    } catch (error) {
        logger.log('error','formatUnitName : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * 
 */
function formatReviewerAction(arrayOfObjects) {
    try {
        logger.log('info', 'formatReviewerAction : Execution started.' + arrayOfObjects);
        const StatusNameArray = arrayOfObjects.map((obj) => {
            if (obj.StatusName === "Approved")
                return obj;
        });
        logger.log('info', 'StatusNameArray :' + StatusNameArray);
        return StatusNameArray;
        
    } catch (error) {
        logger.log('error','formatReviewerAction : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


/**
 * This function will return the Status names of apporved or rejected RA collection forms
 */
// function formatStatusName(arrayOfObjects){
//     try {
//         logger.log('info', 'User Id : '+ userIdFromToken +'  : formatStatusName : Execution started.');
//         const isTrue = arrayOfObjects.every((val) => val.StatusName === "Approved")
//         return isTrue;
//     } catch (error) {
//         logger.log('info', 'User Id : '+ userIdFromToken +'  : formatStatusName : Execution ended.');
//         return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
//     }
// }

// function checkStatusName(arrayOfObjects) {
//     try {
//         logger.log('info', 'User Id: ' + userIdFromToken + ' : checkStatusName: Execution started.');
//         const unitStatusMap = {};

//         arrayOfObjects.forEach(item => {
//             const unitName = item.UnitName;
//             const statusName = item.StatusName;

//             if (!unitStatusMap[unitName]) {
//                 unitStatusMap[unitName] = [];
//             }

//             unitStatusMap[unitName].push(statusName);
//         });

//         for (const unitName in unitStatusMap) {
//             const statuses = unitStatusMap[unitName];
//             const allApprovedOrNotStarted = statuses.every(status => status === "Approved" || status === "Not Started");

//             if (!allApprovedOrNotStarted) {
//                 logger.log('info', `Not all statuses for unit '${unitName}' are 'Approved' or 'Not Started'.`);
//                 return false; // Return false if any unit doesn't meet the condition
//             }
//         }

//         logger.log('info', 'All statuses are either "Approved" or "Not Started" for all units.');
//         return true; 
//     } catch (error) {
//         logger.log('info', 'User Id: ' + userIdFromToken + ' : formatStatusName: Execution ended.');
//         return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
//     }
// }


/**
 * This is function will filter emailid from  DB response object .
 */
 async function filterEmailIds(userIdFromToken,emailList) { 
    try {
       // console.log("emailList",emailList);
            let allEmail        = []; 
            let isEmail         = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;  
            var senderEmail     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            for(var i= CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ; i< emailList.length ; i++)
            {
                if (emailList[i].EmailID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)
                    {
                        allEmail.push(emailList[i].EmailID); 
                        isEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;          
                    }        
            }

            if (isEmail == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE)
            {
                senderEmail = allEmail.join(",");
            } 
       
        return senderEmail;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : filterEmailIds : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will return current Qarter from startDate .
 */
async function getCurrentQuater(userIdFromToken, CreatedDate) {
    try {
        logger.log('info', 'User Id: ' + userIdFromToken + ' : RiskAssessmentBl: getCurrentQuater: Execution started.');
        var currentDate = new Date(CreatedDate);
        let month = currentDate.getMonth();
        let quaterDetails = [];
        let quater = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let year = new Date(currentDate).getFullYear();

        if (month == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || month == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || month == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO)
            quater = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        else if (month == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE || month == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR || month == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE)
            quater = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        else if (month == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX || month == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN || month == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT)
            quater = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        else
            quater = CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR;

        quaterDetails.push(quater,year);
        logger.log('info', 'User Id: ' + userIdFromToken + ' : RiskAssessmentBl: getCurrentQuater: quaterDetails: ' + JSON.stringify(quaterDetails));
        return quaterDetails;
    } catch (error) {
        logger.log('error', 'User Id: ' + userIdFromToken + ' : RiskAssessmentBl: getCurrentQuater: Execution end. : Got unhandled error. : Error Detail: ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will return current Year from startDate .
 */
 async function getNextQuater(userIdFromToken,CreatedDate) { 
    try {     
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getNextQuater : Execution started.');
        var currentDate = new Date(CreatedDate);
        let month       = currentDate.getMonth();
        let quater      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let nextQuater  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let nextYear    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let nextquaterDetails      = []
        let  year        = new Date(currentDate).getFullYear();      
            if (month == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || month == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || month == CONSTANT_FILE_OBJ.APP_CONSTANT.TWO)
            quater  = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            else if (month == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE || month == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR || month == CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE)
            quater  = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            else if (month == CONSTANT_FILE_OBJ.APP_CONSTANT.SIX || month == CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN || month == CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT)
            quater  = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
            else quater  = CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR;
         if (quater == CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR) 
         {
            nextYear    = year+CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            // nextQuater  = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE +','+ nextYear; 
            nextquaterDetails.push(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,nextYear) 
         } 
         else{
            nextQuater  = quater+CONSTANT_FILE_OBJ.APP_CONSTANT.ONE; 
            // nextQuater  = nextQuater +','+ year; 
            // nextQuater = [nextQuater, year];
            nextquaterDetails.push(nextQuater,year) 
                
         }
         logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentBl : getNextQuater : nextquaterDetails : ' + JSON.stringify(nextquaterDetails)); 
        return nextquaterDetails;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : getNextQuater : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will return previous quarter based on created date .
 */
async function getPreviousQuarter(userIdFromToken, CreatedDate) {
    try {
      logger.log('info', 'User Id: ' + userIdFromToken + ' : RiskAssessmentBl: getPreviousQuarter: Execution started.');
  
      var currentDate = new Date(CreatedDate);
      let month = currentDate.getMonth();
      let quarter = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let previousQuarter = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let previousYear = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
      let year = new Date(currentDate).getFullYear();
      let previousQuarterData = []
  
      if (month === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || month === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || month === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
        quarter = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        previousQuarter = CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR;
        previousYear = year - CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
      } else if (month === CONSTANT_FILE_OBJ.APP_CONSTANT.THREE || month === CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR || month === CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE) {
        quarter = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        previousQuarter = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
        previousYear = year;
      } else if (month === CONSTANT_FILE_OBJ.APP_CONSTANT.SIX || month === CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN || month === CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT) {
        quarter = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        previousQuarter = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
        previousYear = year;
      } else {
        quarter = CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR;
        previousQuarter = CONSTANT_FILE_OBJ.APP_CONSTANT.THREE;
        previousYear = year;
      }
  
    //   previousQuarterData = previousQuarter + ',' + previousYear;
      previousQuarterData.push(previousQuarter,previousYear) 
      logger.log('info', 'User Id: ' + userIdFromToken + ' : RiskAssessmentBl: getPreviousQuarter: previousQuarterData: ' + JSON.stringify(previousQuarterData));
      
      return previousQuarterData;
    } catch (error) {
      logger.log('error', 'User Id: ' + userIdFromToken + ' : RiskAssessmentBl: getPreviousQuarter: Execution end. : Got unhandled error. : Error Detail: ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
  }
  
/**
 * This is function will filter UserGUID from  DB response object .
 */
 async function filterUserGUIDs(userIdFromToken,emailList) { 
    try {
       // console.log("emailList",emailList);
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : filterUserGUIDs : Execution started.');
            let alluserGUID        = [];          
            var senderGUID     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            for(var i= CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ; i< emailList.length ; i++)
            {
                if (emailList[i].UserGUID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)
                    {
                        alluserGUID.push(emailList[i].UserGUID); 
                        senderGUID = alluserGUID.join(",");  
                    }        
            }
       
        return senderGUID;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : RiskAssessmentBl : filterUserGUIDs : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}




/**
 * This is function will be used to return single instance of class.
 */
function getRiskAssessmentBLClassInstance() {
    if (riskAssessmentBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        riskAssessmentBlClassInstance = new RiskAssessmentBl();
    }
    return riskAssessmentBlClassInstance;
}

exports.getRiskAssessmentBLClassInstance = getRiskAssessmentBLClassInstance;