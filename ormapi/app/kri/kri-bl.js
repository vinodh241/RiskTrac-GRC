const MOMENT                = require('moment');
const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const KRI_DB                = require('../../data-access/kri-db.js');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
const BINARY_DATA           = require('../../utility/binary-data.js');
const EMAIL_NOTIFICATION    = require('../../utility/email-notification.js');
const INAPP_NOTIFICATION_DB = require('../../data-access/inApp-notification-db.js');
const ROUTE_LIST_OBJ        = require('../../utility/enum/enum.js');
const { 
    validationErrorResponse, 
    businessRuleErrorResponse, 
    databaseErrorResponse, 
    translateDbError,
    ERROR_CODES 
} = require('../../utility/response-helpers.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var kriDbObject                     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var kriBLClassInstance              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var binarydataObject                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var notificationObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class KriBl {
    constructor() {
        appValidatorObject          = new APP_VALIATOR();
        kriDbObject                 = new KRI_DB();
        binarydataObject            = new BINARY_DATA();
        notificationObject          = new EMAIL_NOTIFICATION();
        inAppNotificationDbObject   = new INAPP_NOTIFICATION_DB();
    }

    start() {
    }

    /**
     * Get Kri master details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKriMasterData(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution started.');

            const GET_KRI_MASTER = await kriDbObject.getKriMasterData(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : GET_KRI_MASTER.' + JSON.stringify(GET_KRI_MASTER));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_KRI_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_KRI_MASTER) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : GET_KRI_MASTER is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_KRI_MASTER.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : Error details :' + GET_KRI_MASTER.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_KRI_MASTER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_KRI_MASTER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : Error details : ' + GET_KRI_MASTER.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const KRI_MASTER_DATA_RESPONSE = await formatGetKriMasterData(userIdFromToken,GET_KRI_MASTER, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_MASTER_DATA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_MASTER_DATA_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : KRI_MASTER_DATA_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : Get KRI master details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, KRI_MASTER_DATA_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Set KRI master details 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setKriMasterData(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = {
                type                    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                measurementFrequency    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                reportingFrequency      : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                status                  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                threshold               : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                reviewers               : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                emailData               : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;           

            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             = request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            data.type                   = request.body.type;
            data.measurementFrequency   = request.body.measurementFrequency;
            data.reportingFrequency     = request.body.reportingFrequency;
            data.status                 = request.body.status; 
            data.threshold              = request.body.thresholdValue;
            data.reviewers              = request.body.KRIReviewers;
            data.emailData              = request.body.EmailData;
            accountGUIDFromToken        = request.body.accountGUIDFromToken;
           

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution started.');

            /**
             * Validating input parameters for status master data : START
             */
            if (data.status != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || data.status != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                if (data.status[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].statusID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || data.status[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].statusID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution end. : StatusID is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.STATUS_ID_NULL_EMPTY));
                }
            }
            /**
            * Validating input parameters for status master data : END
            */

            const SET_KRI_MASTER = await kriDbObject.setKriMasterData(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_KRI_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_KRI_MASTER) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution end. : SET_KRI_MASTER is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_KRI_MASTER.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution end. : Error details :' + SET_KRI_MASTER.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SET_KRI_MASTER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_KRI_MASTER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution end. : Error details : ' + SET_KRI_MASTER.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const KRI_MASTER_DATA_RESPONSE = await formatGetKriMasterData(userIdFromToken,SET_KRI_MASTER, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_MASTER_DATA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_MASTER_DATA_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMasterData : Execution end. : KRI_MASTER_DATA_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution end. :  KRI master details saved successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, KRI_MASTER_DATA_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Kri self-scoring info from Database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKriInfo(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution started.');

            const KRI_SCORING_INFO = await kriDbObject.getKriInfo(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_SCORING_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_SCORING_INFO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution end. : KRI_SCORING_INFO is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_SCORING_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution end. : Error details :' + KRI_SCORING_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_SCORING_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_SCORING_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution end. : Error details : ' + KRI_SCORING_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const KRI_INFO_RESPONSE = await formatKriInfoResponse(userIdFromToken, KRI_SCORING_INFO, accountGUIDFromToken);
            
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_INFO_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_INFO_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution end. : KRI_INFO_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution end. : Get KRI info details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, KRI_INFO_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * set Kri data to Database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setKri(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var senderEmailTo       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmailCc       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setKRIResponse       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
            // userIdFromToken     = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
            // userNameFromToken   = 'naganandan.p@secureyes.net';
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution started.');

            const SET_KRI_RESPONSE = await kriDbObject.setKri(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKri : SET_KRI_RESPONSE: ' + JSON.stringify(SET_KRI_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_KRI_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_KRI_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : SET_KRI_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SET_KRI_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : Error details :' + SET_KRI_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (SET_KRI_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SET_KRI_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : Error details : ' + SET_KRI_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //formating Set kri data
            const SET_KRI = await formatGetKriResponse(userIdFromToken, SET_KRI_RESPONSE, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SET_KRI || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SET_KRI) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : SET_KRI is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }            
            const kriData = SET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            kriData["RISKTRAC_WEB_URL"]     = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            kriData["KRICode"]              = SET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].KRICode;
           
            if (data.kriCode == null) {
                let emailListTo     = SET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                let emailListCc     = SET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                var senderEmailTo   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                var senderEmailCc   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                senderEmailTo       = await filterEmailIds(userIdFromToken, emailListTo);   
                senderEmailCc       = await filterEmailIds(userIdFromToken, emailListCc);           
                
                let EmailDataTo = [
                    {
                        EmailID: senderEmailTo
                        // EmailID: 'naganandan.p@secureyes.net',
                        // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                    }
                ];
                let EmailDataCC = [
                    {
                        EmailID: senderEmailCc
                        // EmailID: 'naganandan.p@secureyes.net',
                        // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                    }
                ];
                let emailTemplateObj = {
                    "Subject": "KRI - [[KRICode]] defined for your unit",
                    "Body": `<!DOCTYPE html>
                            <html>
                                <body>
                                <head>
                                    <meta charset="UTF-8">  
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                </head>
                                <div>
                                    <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                                    <p style="margin-top:0;margin-bottom:0;">Dear,<br> 
                                    A KRI [[KRICode]] has been defined for your unit.<br>
                                    Requesting you to provide the KRI Measurement for the current Quarter.<br><br>
                                    Title: [[Description]]<br>
                                    From the Unit - [[UnitName]]<br><br>
                                    <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                  
                                    <p style="margin-top:0;margin-bottom:0;">
                                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                                    </p>
                                    </div>
                                </div>
                                </body>
                            </html>`
                }
        
                /**
                 * Sending email notification : START
                 */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataCC || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataCC || EmailDataCC.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : Execution end. : EmailData is undefined or null.');
                    } else {
                        var toEmailIDs  = await filterEmailIds(userIdFromToken, EmailDataTo);
                        var ccEmailIDs  = await filterEmailIds(userIdFromToken, EmailDataCC);
                        let toccEmails  = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": ccEmailIDs
                        }

                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, kriData, toccEmails);

                        emailListTo = emailListTo.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );
                         
                        const emailListToNew  = emailListTo.map(obj => {
                            const routeLink   = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_MEASUREMENT_PAGE;
                            return { ...obj, routeLink };
                        });     
                        const emailListCcNew  = emailListCc.map(obj => {
                            const routeLink   = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_DEFINITION_PAGE;
                            return { ...obj, routeLink };
                        });                                           
                                                      
                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);

                        logger.log('info', 'User Id : ' + userIdFromToken + ': KriBl : setKri : ToCcList: ' + JSON.stringify(ToCcList));

                        ToCcList.forEach(async obj => {                         
                            let messageData = 'KRI - (' + kriData["KRICode"] + ') defined for your unit';
                            let inappDetails = {
                                inAppContent : messageData + "link:" + obj.routeLink,
                                recepientUserID : obj.UserGUID,
                                subModuleID : 4
                            }
                            setKRIResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);                            
                        });

                        logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : setKRIResponse : ' + JSON.stringify(setKRIResponse || null));
                        // Inapp notification add for schdule new assessment : end
                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri-EmailNotification : Notification error ' + error);
                }
            } 

            if(data.kriCode != null) {
                let emailListTo     = SET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                let emailListCc     = SET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                var senderEmailTo     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                var senderEmailCc     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                senderEmailTo = await filterEmailIds(userIdFromToken, emailListTo);   
                senderEmailCc = await filterEmailIds(userIdFromToken, emailListCc);           
              
                let EmailDataTo = [
                    {
                        EmailID: senderEmailTo
                        // EmailID: 'naganandan.p@secureyes.net',
                        // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                    }
                ];
                let EmailDataCC = [
                    {
                        EmailID: senderEmailCc
                        // EmailID: 'naganandan.p@secureyes.net',
                        // UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                    }
                ];
                // if(data.kriCode = null){
                let emailTemplateObj = {
                    "Subject": "KRI - ([[KRICode]]) modified for your unit",
                    "Body": `<!DOCTYPE html>
                    <html>
                        <body>
                        <head>
                            <meta charset="UTF-8">  
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;">Dear,<br> 
                            A KRI ([[KRICode]]) has been modified for your unit. Request you to review and Submit the details<br>
                            Title: [[Description]]<br>
                            From the Unit - [[UnitName]]<br><br>
                            <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                  
                            <p style="margin-top:0;margin-bottom:0;">
                                <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                            </p>
                            </div>
                        </div>
                        </body>
                    </html>`
                }
            
                /**
                 * Sending email notification : START
                 */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataCC || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataCC || EmailDataCC.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : Execution end. : EmailData is undefined or null.');
                    } else {
                        var toEmailIDs = await filterEmailIds(userIdFromToken, EmailDataTo);
                        var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCC);
                        let toccEmails = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": ccEmailIDs
                        }
                        // logger.log('info', 'Email_Template_Subject : ' + emailTemplateObj.Subject + ' : Email_Template_Body : ' + emailTemplateObj.Body);
                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, kriData, toccEmails);
                        
                        emailListTo = emailListTo.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );
                        
                        const emailListToNew = emailListTo.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_REVIEW_PAGE;
                            return { ...obj, routeLink };
                        });  
                           
                        const emailListCcNew = emailListCc.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_MEASUREMENT_PAGE;;
                            return { ...obj, routeLink };
                        });
                        
                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));                                                             
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);       

                        ToCcList.forEach(async obj => {                         
                            let messageData = 'KRI - (' + kriData["KRICode"] + ') modified for your unit';
                            let inappDetails = {
                                inAppContent: messageData + "link:" + obj.routeLink,
                                recepientUserID: obj.UserGUID,
                                subModuleID: 4
                            }
                            setKRIResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);                            
                        });

                        logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : setRAResponse : ' + JSON.stringify(setKRIResponse || null));
                        // Inapp notification add for schdule new assessment : end
                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri-EmailNotification : Notification error ' + error);
                }
            }
            /**
            * Sending email notification : END
            */
            //formating kri info data
            const KRI_SCORING_INFO = await kriDbObject.getKriInfo(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_SCORING_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_SCORING_INFO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : KRI_SCORING_INFO is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (KRI_SCORING_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : Error details :' + KRI_SCORING_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (KRI_SCORING_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_SCORING_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : Error details : ' + KRI_SCORING_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            const KRI_INFO_RESPONSE = await formatKriInfoResponse(userIdFromToken, KRI_SCORING_INFO, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_INFO_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_INFO_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : KRI_INFO_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            //Merging get kri and kri info details
            const FORMAT_SET_KRI= {...SET_KRI,...KRI_INFO_RESPONSE};
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SET_KRI || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SET_KRI) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : FORMAT_SET_KRI is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (data.kriCode != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || data.kriCode != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) {
                logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : KRI Metrics updated successfully.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EDITED_DATA, FORMAT_SET_KRI));
            }else {
                logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : KRI Metrics added successfully.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_SET_KRI));
            }    
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKri : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Kri data from Database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKri(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution started.');

            const GET_KRI_RESPONSE = await kriDbObject.getKri(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'KriBl : getKri : ' + JSON.stringify(GET_KRI_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_KRI_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_KRI_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : GET_KRI_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_KRI_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : Error details :' + GET_KRI_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_KRI_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_KRI_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : Error details : ' + GET_KRI_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //formating get kri data
            const GET_KRI = await formatGetKriResponse(userIdFromToken, GET_KRI_RESPONSE, accountGUIDFromToken);
            logger.log('info', 'KriBl : getKri : formatted_response : ' + JSON.stringify(GET_KRI));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_KRI || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_KRI) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : FORMAT_GET_KRI is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //formating kri info data
            const KRI_SCORING_INFO = await kriDbObject.getKriInfo(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'KriBl : getKri : kri_info_response : ' + JSON.stringify(KRI_SCORING_INFO));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_SCORING_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_SCORING_INFO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : KRI_SCORING_INFO is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_SCORING_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : Error details :' + KRI_SCORING_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_SCORING_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_SCORING_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : Error details : ' + KRI_SCORING_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const KRI_INFO_RESPONSE = await formatKriInfoResponse(userIdFromToken, KRI_SCORING_INFO, accountGUIDFromToken);
            logger.log('info', 'KriBl : getKri : formatted_kri_info_response : ' + JSON.stringify(KRI_INFO_RESPONSE));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_INFO_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_INFO_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : KRI_INFO_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //Merging get kri and kri info details
            const FORMAT_GET_KRI= {...GET_KRI,...KRI_INFO_RESPONSE};
            logger.log('info', 'KriBl : getKri : merged_kri_data : ' + JSON.stringify(FORMAT_GET_KRI));
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_KRI || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_KRI) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : FORMAT_GET_KRI is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : Get KRI  details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_KRI));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKri : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * delete Kri data from Database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteKri(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let metricID                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution started.');

            metricID  =  data.metricID;
            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricID ) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution end. : metricID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_KRI_RESPONSE = await kriDbObject.deleteKri(userIdFromToken,userNameFromToken,data,accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_KRI_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_KRI_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution end. : DELETE_KRI_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_KRI_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution end. : Error details :' + DELETE_KRI_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_KRI_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_KRI_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution end. : Error details : ' + DELETE_KRI_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution end. : kri deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : deleteKri : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get self-scoring data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKriMetricsScoring(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
			var IsOwnUnitData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
			IsOwnUnitData       = request.body.IsOwnUnitData;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'naganandan.p@secureyes.net'

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution started.');

            const GET_SELF_SCORING = await kriDbObject.getKriMetricsScoring(userIdFromToken,userNameFromToken,IsOwnUnitData, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : GET_SELF_SCORING : '+JSON.stringify(GET_SELF_SCORING || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : GET_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SELF_SCORING.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : Error details :' + GET_SELF_SCORING.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SELF_SCORING.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SELF_SCORING.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : Error details : ' + GET_SELF_SCORING.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SELF_SCORING = await formatGetKriSelfScoring(userIdFromToken,GET_SELF_SCORING, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : FORMAT_SELF_SCORING : '+JSON.stringify(FORMAT_SELF_SCORING || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : FORMAT_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : Get KRI self-scoring details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_SELF_SCORING));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Save self-scoring data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setKriMetricScoring(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : Invalid Request,missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const SAVE_SELF_SCORING = await kriDbObject.setKriMetricScoring(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : SAVE_SELF_SCORING : '+JSON.stringify(SAVE_SELF_SCORING || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SAVE_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SAVE_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : SAVE_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_SELF_SCORING.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : Error details :' + SAVE_SELF_SCORING.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SAVE_SELF_SCORING.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SAVE_SELF_SCORING.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : Error details : ' + SAVE_SELF_SCORING.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SELF_SCORING = await formatGetKriSelfScoring(userIdFromToken,SAVE_SELF_SCORING, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : FORMAT_SELF_SCORING : '+JSON.stringify(FORMAT_SELF_SCORING || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : FORMAT_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : Kri self-scoring saved successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SELF_SCORING));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricScoring : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Submit self-scoring data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async setKriMetricsReport(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmail             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmailCc           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setKRIResponse          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : Execution started.');
            const SUMBIT_SELF_SCORING = await kriDbObject.setKriMetricsReport(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : SUMBIT_SELF_SCORING.' + JSON.stringify(SUMBIT_SELF_SCORING));

            const FORMAT_SELF_SCORING = await formatGetKriSelfScoring(userIdFromToken,SUMBIT_SELF_SCORING, accountGUIDFromToken);
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == SUMBIT_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == SUMBIT_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : Execution end. : SUMBIT_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SUMBIT_SELF_SCORING.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : Execution end. : Error details :' + SUMBIT_SELF_SCORING.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (SUMBIT_SELF_SCORING.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && SUMBIT_SELF_SCORING.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : Execution end. : Error details : ' + SUMBIT_SELF_SCORING.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            const metricReportData              = SUMBIT_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            const metricReport                  = SUMBIT_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]
            metricReport["RISKTRAC_WEB_URL"]    = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            const metricKRICode                 = SUMBIT_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];
            
            let uniqueUnitNamesArray    = [];
            let unitNameKRICodeMap      = {};
            if (metricKRICode && metricKRICode.length > 0 ) {              
                metricKRICode.forEach(async (metric) => {
                    const { UnitName, KRICode,  } = metric;
                    if (!unitNameKRICodeMap[UnitName]) { 
                        unitNameKRICodeMap[UnitName] = {
                            KRICodeCsv: KRICode,               
                        RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],                        
                    };
                    } else {
                        unitNameKRICodeMap[UnitName].KRICodeCsv += `, ${KRICode}`;
                    }
                });
                uniqueUnitNamesArray = Object.keys(unitNameKRICodeMap).map((UnitName) => ({UnitName,...unitNameKRICodeMap[UnitName],}));                
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : setKriMetricsReport : uniqueUnitNamesArray : ' + JSON.stringify(uniqueUnitNamesArray || null));
            
            let templateMaster  = [];           
            for (const item of uniqueUnitNamesArray) {                
                templateMaster = {                     
                        Unit_Name:           item.UnitName,
                        RISKTRAC_WEB_URL:    item.RISKTRAC_WEB_URL,
                        KRI_CODE:            item.KRICodeCsv,
                    };

                let emailList       = SUMBIT_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];            
                senderEmail         = await filterEmailIds(userIdFromToken, emailList);     
                let emailListCc     = SUMBIT_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];            
                senderEmailCc       = await filterEmailIds(userIdFromToken, emailListCc);             
            
                let EmailData = [
                    {
                        EmailID: senderEmail
                        //   EmailID: 'naganandan.p@secureyes.net',
                        //   UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                    }
                ]; 
                let EmailDataCc = [
                    {
                        EmailID: senderEmailCc
                        //   EmailID: 'naganandan.p@secureyes.net',
                        //   UserGUID: '89972466-D3C7-ED11-AF38-000C296CF4F3'
                    }
                ]; 
                let emailTemplateObj = {
                    "Subject": " Submission of KRI for [[Unit_Name]] unit ",
                    "Body": `<!DOCTYPE html>
                    <html>
                        <body>
                        <head>
                            <meta charset="UTF-8">  
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <div>
                            <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                            <p style="margin-top:0;margin-bottom:0;">Dear Reviewer,<br> 
                            The KRIs ([[KRI_CODE]])  has been submitted for Review. Request you to review the same.<br>
                            <p style="margin-top:0;margin-bottom:0;">
                            From the Unit - [[Unit_Name]]<br><br>
                            <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                  
                            <p style="margin-top:0;margin-bottom:0;">
                                <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                            </p>
                            </div>
                        </div>
                        </body>
                    </html>`
                } 
                /**
                * Sending email notification : START
                */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailData || EmailData.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKriMetricsReport : Execution end. : EmailData is undefined or null.');
                    } else {
                        var toEmailIDs = await filterEmailIds(userIdFromToken, EmailData);
                        var ccEmailIDs = await filterEmailIds(userIdFromToken, EmailDataCc);
                        let toccEmails = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": ccEmailIDs
                        }
                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails);

                        // Inapp notification add for schdule new assessment : start                        
                        emailList = emailList.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );
                        
                        const emailListToNew = emailList.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_REVIEW_PAGE;
                            return { ...obj, routeLink };
                        });  
                           
                        const emailListCcNew = emailListCc.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_MEASUREMENT_PAGE;;
                            return { ...obj, routeLink };
                        });
                        
                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));                                                             
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);       

                        logger.log('info', ': KriBl : setKri : ToCcList: ' + JSON.stringify(ToCcList));

                        for(const obj of ToCcList)  {                       
                            let inappDetails = {
                                inAppContent    : 'KRI - ('+ item.KRICodeCsv +') has been submitted for Review.' + "link:" + obj.routeLink,
                                recepientUserID : obj.UserGUID,
                                subModuleID     : 4
                            }
                            setKRIResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);                            
                        }
                        // Inapp notification add for schdule new assessment : end
                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKriMetricsReport-EmailNotification : Notification error ' + error);
                }
            /**
                * Sending email notification : END
            */
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : Execution end. : Kri self-scoring submitted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_SELF_SCORING));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : setKriMetricsReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

     /**
     * Get Kri report data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKriReport(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution started.');

            const GET_KRI_REPORT = await kriDbObject.getKriReport(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : GET_KRI_REPORT.' + JSON.stringify(GET_KRI_REPORT));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_KRI_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_KRI_REPORT) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : GET_KRI_REPORT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_KRI_REPORT.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : Error details :' + GET_KRI_REPORT.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_KRI_REPORT.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_KRI_REPORT.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : Error details : ' + GET_KRI_REPORT.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_REPORT = await formatKriReport(userIdFromToken,GET_KRI_REPORT, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REPORT) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : FORMAT_REPORT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : Get KRI self-scoring details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_REPORT));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get KRI Historical scoring data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKriHistoricalScoring(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution started.');

            const HISTORIC_SCORING = await kriDbObject.getKriHistoricalScoring(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == HISTORIC_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == HISTORIC_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution end. : HISTORIC_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (HISTORIC_SCORING.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution end. : Error details :' + HISTORIC_SCORING.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (HISTORIC_SCORING.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && HISTORIC_SCORING.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution end. : Error details : ' + HISTORIC_SCORING.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SCORING_DATA = await formatKriHistoricData(userIdFromToken,HISTORIC_SCORING, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SCORING_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SCORING_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution end. : FORMAT_SCORING_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution end. : Get KRI historical scoring details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_SCORING_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalScoring : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get KRI Historical scoring data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKriHistoricalReport(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution started.');

            const HISTORIC_REPORT = await kriDbObject.getKriHistoricalReport(userIdFromToken,userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport :  HISTORIC_REPORT.' + JSON.stringify(HISTORIC_REPORT));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == HISTORIC_REPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == HISTORIC_REPORT) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution end. : HISTORIC_REPORT is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (HISTORIC_REPORT.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution end. : Error details :' + HISTORIC_REPORT.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (HISTORIC_REPORT.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && HISTORIC_REPORT.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution end. : Error details : ' + HISTORIC_REPORT.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_REPORT_DATA = await formatKriHistoricalReportData(userIdFromToken,HISTORIC_REPORT, accountGUIDFromToken);
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport  : FORMAT_REPORT_DATA.' + JSON.stringify(FORMAT_REPORT_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REPORT_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REPORT_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution end. : FORMAT_REPORT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution end. : Get KRI historical report data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_REPORT_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriHistoricalReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    async uploadKriScoringEvidence(request, response) {
        try {
    
            response.setTimeout(1200000);
    
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var remarks             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var destinationPath     = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {
                fileName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remarks             = request.body.remarks;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
    
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution started.');
    
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
    
                            kriDbObject.uploadKriScoringEvidence(userIdFromToken, userNameFromToken, data, remarks, accountGUIDFromToken, async function (ADD_KRISCORING_EVIDENCE) {
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_KRISCORING_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_KRISCORING_EVIDENCE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : Upload RAT response is undefined or null.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                                }
                                if (ADD_KRISCORING_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : Error details : ' + ADD_KRISCORING_EVIDENCE.errorMsg);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                                }
                                if (ADD_KRISCORING_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_KRISCORING_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : Error details : ' + ADD_KRISCORING_EVIDENCE.procedureMessage);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                                }
    
                                /**
                                 * Formating resultset provided by DB : START.
                                 */
                                const FORMAT_DATA_RESULT = await formatEvidencelist(userIdFromToken, ADD_KRISCORING_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], accountGUIDFromToken);
                                /**
                                 * Formating resultset provided by DB : END.
                                 */
    
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DATA_RESULT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DATA_RESULT) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : FORMAT_DATA_RESULT is undefined or null.');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                                }
    
                                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : KRISCORING evidence uploaded successfully.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_DATA_RESULT));
                            });
                        } else {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : Error on dumping file into server. : Error detail : ' + fileUploadResponseObject.errorMessage);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                        }
                    });
            } else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : uploadKriScoringEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }
    
    /**
     * To delete Kri Scoring evidence
     * @param {*} request
     * @param {*} response
     * @returns
     */
    async deleteKriScoringEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let EvidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            EvidenceID = data.EvidenceID;

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EvidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EvidenceID || appValidatorObject.isStringEmpty(EvidenceID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : EvidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await kriDbObject.deleteKriScoringEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : DELETE_RESPONSE of Incident is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : Incident evidence deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : deleteKriScoringEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To download Kri Scoring evidence
     * @param {*} request
     * @param {*} response
     * @returns
     */
     /**
     * To download Kri Scoring evidence
     * @param {*} request
     * @param {*} response
     * @returns
     */
    async downloadKriScoringEvidence(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let EvidenceID              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            data                = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            EvidenceID = data.EvidenceID;

            /**
             * Validating input parameters : START
             */
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EvidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EvidenceID || appValidatorObject.isStringEmpty(EvidenceID.trim())) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : EvidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DOWNLOAD__RESPONSE = await kriDbObject.downloadKriScoringEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD__RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD__RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : DOWNLOAD__RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD__RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            //Formating DB response
            const KRISCORING_DOWNLOAD_RESPONSE = await formatDownloadResponse(userIdFromToken, DOWNLOAD__RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRISCORING_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRISCORING_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : GET_IKRISCORING_FORMAT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : KriScoring evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, KRISCORING_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : downloadKriScoringEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    }  

        /**
     * Add Kri Master details 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addkrimaster(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = {
                type                    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                measurementFrequency    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                reportingFrequency      : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                status                  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                threshold               : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;           

            refreshedToken              = request.body.refreshedToken;
            userIdFromToken             = request.body.userIdFromToken;
            userNameFromToken           = request.body.userNameFromToken;
            data.type                   = request.body.type;
            data.measurementFrequency   = request.body.measurementFrequency;
            data.reportingFrequency     = request.body.reportingFrequency;
            data.status                 = request.body.status; 
            data.threshold              = request.body.thresholdValue;
            accountGUIDFromToken        = request.body.accountGUIDFromToken;
            

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution started.');

            /**
             * Validating input parameters for status master data : START
             */
            if (data.status != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || data.status != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                if (data.status[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].statusID == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || data.status[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].statusID == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. : StatusID is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.STATUS_ID_NULL_EMPTY));
                }
            }
            /**
            * Validating input parameters for status master data : END
            */

            const ADD_KRI_MASTER = await kriDbObject.setKriMasterData(userIdFromToken,userNameFromToken,data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_KRI_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_KRI_MASTER) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. : ADD_KRI_MASTER is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (ADD_KRI_MASTER.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. : Error details :' + ADD_KRI_MASTER.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (ADD_KRI_MASTER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_KRI_MASTER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. : Error details : ' + ADD_KRI_MASTER.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            const ADD_KRI_MASTER_DATA_RESPONSE = await formatGetKriMasterData(userIdFromToken,ADD_KRI_MASTER, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_KRI_MASTER_DATA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_KRI_MASTER_DATA_RESPONSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. : ADD_KRI_MASTER_DATA_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. :  KRI master details saved successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, ADD_KRI_MASTER_DATA_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : addkrimaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    // to send bulk email reminder
    async sendEmailReminder(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var senderEmailTo       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmailCc       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let setKRIResponse      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;            
            let unitNameKRICodeMap  = {};
            let templateMaster      = [];
            accountGUIDFromToken = request.body.accountGUIDFromToken;  
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : sendEmailReminder : Execution started.');

            let KRI_BULK_DB_RESPONSE = await kriDbObject.sendEmailReminder(userIdFromToken, userNameFromToken, accountGUIDFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : KRI_BULK_DB_RESPONSE ' + JSON.stringify(KRI_BULK_DB_RESPONSE || null));
                       
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_BULK_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_BULK_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_BULK_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : Execution end. : Error details :' + KRI_BULK_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (KRI_BULK_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_BULK_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : Execution end. : Error details : ' + KRI_BULK_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
                            
            KRI_BULK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].forEach(async (obj) => {
                // console.log("obj",obj)
                const { UnitName, KRICode, Period, KRIType, MetricID,UnitID,MeasurementFrequency } = obj;
                if (!unitNameKRICodeMap[UnitName]) { 
                    unitNameKRICodeMap[UnitName] = {
                    KRICodeCSV: KRICode,
                    Period,                                   
                    MetricID,
                    UnitID,
                    MeasurementFrequency,
                    RISKTRAC_WEB_URL: APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],                        
                    };
                } else {
                    unitNameKRICodeMap[UnitName].KRICodeCSV += `, ${KRICode}`;
                }
            });

            let uniqueUnitNamesArray= Object.keys(unitNameKRICodeMap).map((UnitName) => ({UnitName,...unitNameKRICodeMap[UnitName],}));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : uniqueUnitNamesArray     : ' + JSON.stringify(uniqueUnitNamesArray || null));
            
            // for each unit sending indivisual email with KRI code as CSV 
            for (const item of uniqueUnitNamesArray) {             
                // console.log("item",item)   
                templateMaster = {                     
                    Unit_Name          : item.UnitName,
                    RISKTRAC_WEB_URL   : item.RISKTRAC_WEB_URL,
                    KRI_CODE           : item.KRICodeCSV,
                    Period             : item.Period,
                    UnitID             : item.UnitID,
                    MeasurementFrequency : item.MeasurementFrequency
                };

                let EmailTo = KRI_BULK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(obj=> obj.UnitID == item.UnitID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : EmailTo  ---1   : ' + JSON.stringify(EmailTo));
                // If there are no users for particular unit in the user management module in that case email will be triggeed to risk unit users(CC List)
                if (EmailTo.length === 0) {
                    EmailTo = KRI_BULK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                }
                 
                senderEmailTo   = await filterEmailIds(userIdFromToken,EmailTo);   
                senderEmailCc   = await filterEmailIds(userIdFromToken,KRI_BULK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]);             
                 
                let emailTemplateObj = {
                    "Subject": "KRIs pending to be Reported for unit ([[Unit_Name]]) in reporting frequency [[MeasurementFrequency]] for [[Period]]",
                    "Body": `<!DOCTYPE html>  <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0" >  </head><body>  <div> <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">  <p style="margin-top:0;margin-bottom:0;">Dear,<br>  KRIs ([[KRI_CODE]]) for your unit - [[Unit_Name]]  are pending to be reported for the reporting frequency [[MeasurementFrequency]] for [[Period]].  <br>  Kindly take the measurements and report the same. <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br><p style="margin-top:0;margin-bottom:0;"> <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br> </p></div></div></body></html>`
                } 
                // console.log("emailTemplateObj",emailTemplateObj)
                /**
                * Sending email notification : START
                */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == senderEmailTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == senderEmailTo || senderEmailTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || 
                        CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == senderEmailCc || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == senderEmailCc || senderEmailCc.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder : Execution end. : EmailData is undefined or null.');
                    } else {
                        let toccEmails = {
                            "TOEmail": senderEmailTo,
                            "CCEmail": senderEmailCc
                        }
                        
                        let emailData       = await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails);
                        let emailList       = KRI_BULK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]
                        let emailListCc     = KRI_BULK_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]

                        emailList = emailList.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );
                        
                        const emailListToNew = emailList.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_REVIEW_PAGE;
                            return { ...obj, routeLink };
                        });  
                           
                        const emailListCcNew = emailListCc.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_MEASUREMENT_PAGE;;
                            return { ...obj, routeLink };
                        });
                        
                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));                                                             
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);       

                        logger.log('info', ': KriBl : setKri : ToCcList: ' + JSON.stringify(ToCcList));

                        ToCcList.forEach(async obj => {                         
                            let inappDetails    = {
                                inAppContent     : 'KRIs (' + item.KRICodeCSV + ') pending to be Reported in [[MeasurementFrequency]] - '+ item.Period + "link:" + 'kri-measurement-review',
                                recepientUserID  : obj.UserGUID,
                                subModuleID      : 4
                            }
                            setKRIResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);                            
                        });

                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendEmailReminder-EmailNotification : Notification error ' + error);
                }
                /**
                    * Sending email notification : END
                */
            }
            
            KRI_BULK_DB_RESPONSE = [];
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : sendEmailReminder : Execution end. : Email Alert entered successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_SUCCESSFUL, KRI_BULK_DB_RESPONSE));
          
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : sendEmailReminder : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     // to send indivisually email reminder
    async sendKRIReminder(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var senderEmailTo       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmailCc       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;  
            let templateMaster      = [];
            accountGUIDFromToken    = request.body.accountGUIDFromToken;  
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : sendKRIReminder : Execution started.');

            let Metric_DB_RESPONSE = await kriDbObject.sendKRIReminder(userIdFromToken, userNameFromToken,data, accountGUIDFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : sendKRIReminder : Metric_DB_RESPONSE ' + JSON.stringify(Metric_DB_RESPONSE || null));
                        
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == Metric_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == Metric_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendKRIReminder : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (Metric_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendKRIReminder : Execution end. : Error details :' + Metric_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (Metric_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && Metric_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendKRIReminder : Execution end. : Error details : ' + Metric_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            let MetricDetails = Metric_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : MetricDetails     : ' + JSON.stringify(MetricDetails));
            if (MetricDetails.length) {
                senderEmailTo       = await filterEmailIds(userIdFromToken, Metric_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]);   
                senderEmailCc       = await filterEmailIds(userIdFromToken, Metric_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]);  

                // logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : senderEmailTo     : ' + senderEmailTo);
                // logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : senderEmailCc     : ' + senderEmailCc);

                templateMaster = {                     
                    Unit_Name               : MetricDetails[0].UnitName,
                    RISKTRAC_WEB_URL        : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                    KRI_CODE                : MetricDetails[0].KRICode,
                    Period                  : MetricDetails[0].Period,
                    MeasurementFrequency    : MetricDetails[0].MeasurementFrequency
                };

                let curDate = new Date();
                let currMonth = curDate.getMonth() + 1; // Months are 0-indexed in JavaScript

                // Define an array of month abbreviations
                const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                let currentQuarter;
                if (currMonth >= 1 && currMonth <= 3) {
                    currentQuarter = `${monthAbbreviations[0]}-${monthAbbreviations[2]}`; // Jan-Mar
                } else if (currMonth >= 4 && currMonth <= 6) {
                    currentQuarter = `${monthAbbreviations[3]}-${monthAbbreviations[5]}`; // Apr-Jun
                } else if (currMonth >= 7 && currMonth <= 9) {
                    currentQuarter = `${monthAbbreviations[6]}-${monthAbbreviations[8]}`; // Jul-Sep
                } else {
                    currentQuarter = `${monthAbbreviations[9]}-${monthAbbreviations[11]}`; // Oct-Dec
                }
                templateMaster.Period =  templateMaster.Period != undefined ? templateMaster.Period : currentQuarter
                let emailTemplateObj = {
                    "Subject": "KRIs pending to be Reported in reporting frequency [[MeasurementFrequency]] for [[Period]]",
                    "Body": `<!DOCTYPE html> <html><head><meta charset="UTF-8">  <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head>  <body><div> <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"> <p style="margin-top:0;margin-bottom:0;">Dear User,<br><br> KRI - [[KRI_CODE]] for your unit - [[Unit_Name]]  is pending for submission for the Current Reporting Frequency [[Period]]. <br>Kindly take the measurement and report the same. <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                   <p style="margin-top:0;margin-bottom:0;"> <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br> </p></div></div></body></html>`
                }
        
                /**
                 * Sending email notification : START
                 */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == senderEmailTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == senderEmailTo || senderEmailTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || 
                        CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == senderEmailCc || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == senderEmailCc || senderEmailCc.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : sendKRIReminder : Execution end. : EmailData is undefined or null.');
                    } else {
                        let toccEmails = {
                            "TOEmail": senderEmailTo,
                            "CCEmail": senderEmailCc
                        }
                        // logger.log('info', 'Email_Template_Subject : ' + emailTemplateObj.Subject + ' : Email_Template_Body : ' + emailTemplateObj.Body);
                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails);
                        
                        let emailList       = Metric_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                        let emailListCc     = Metric_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];

                        emailList = emailList.filter((obj, index, self) =>
                            index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                        );
                        
                        const emailListToNew = emailList.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_MEASUREMENT_PAGE;
                            return { ...obj, routeLink };
                        });  
                           
                        const emailListCcNew = emailListCc.map(obj => {
                            const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_REVIEW_PAGE;;
                            return { ...obj, routeLink };
                        });
                        
                        const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                        const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));                                                             
                        const ToCcList              = emailListToNew.concat(filteredListCcNew);       

                        logger.log('info', ': KriBl : setKri : ToCcList: ' + JSON.stringify(ToCcList));

                        ToCcList.forEach(async obj => {                         
                            let inappDetails     = {
                                inAppContent     : 'KRIs (' + MetricDetails[0].KRICode + ') pending to be Reported in current Quarter - '+ MetricDetails[0].Period  + "link:" + obj.routeLink,
                                recepientUserID  : obj.UserGUID,
                                subModuleID      : 4
                            }
                            let setKRIResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);                            
                        });                 
                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri-EmailNotification : Notification error ' + error);
                }
            } 
            
            Metric_DB_RESPONSE = [];
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : sendKRIReminder : Execution end. : Email Alert entered successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_SUCCESSFUL, Metric_DB_RESPONSE));
          
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : sendKRIReminder : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     // to review - save data as a reviewer
    async reviewReportedKRIData(request, response) {
        try {        
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'mo_bank_23@secureyes.net'
            var binds = {  
                data   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            };  
            binds.data  = request.body.data;  
            binds.UserGUID       = request.body.UserGUID;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : Execution started.');
    
            const KRI_REVIEW_DB_RESP = await kriDbObject.reviewReportedKRIData(userIdFromToken, userNameFromToken, binds, accountGUIDFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : KRI_REVIEW_DB_RESP ' + JSON.stringify(KRI_REVIEW_DB_RESP || null));
  
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_REVIEW_DB_RESP || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_REVIEW_DB_RESP) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (KRI_REVIEW_DB_RESP.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : Execution end. : Error details :' + KRI_REVIEW_DB_RESP.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (KRI_REVIEW_DB_RESP.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_REVIEW_DB_RESP.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : Execution end. : Error details : ' + KRI_REVIEW_DB_RESP.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
           
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : Execution end. : Get RiskAppetite Dashboard List successfully.');
            // KRI_REVIEW_DB_RESP.recordset =[];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : KRI_REVIEW_DB_RESP ' + JSON.stringify(KRI_REVIEW_DB_RESP.recordset || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, KRI_REVIEW_DB_RESP.recordset));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : reviewReportedKRIData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */

    // to submit data as a reviewer
    async submitKRIReview(request, response) {
        try {        
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let emailTemplateObj    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;      
            let templateMaster      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            var senderEmailTo       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var senderEmailCc       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;    
            let messageData         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            let unitNameKRICodeMap  = {};
            let emailListTo         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            let emailListCc         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            let submitKRIResponse   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            let filteredUnitToList  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            let filteredUnitCcList  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let inappDetails        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'mo_bank_23@secureyes.net'
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution started.');
    
            const KRI_SUBMIT_DB_RESP = await kriDbObject.submitKRIReview(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);  
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : KRI_SUBMIT_DB_RESP ' + JSON.stringify(KRI_SUBMIT_DB_RESP || null));
  
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_SUBMIT_DB_RESP || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_SUBMIT_DB_RESP) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (KRI_SUBMIT_DB_RESP.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution end. : Error details :' + KRI_SUBMIT_DB_RESP.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (KRI_SUBMIT_DB_RESP.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_SUBMIT_DB_RESP.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution end. : Error details : ' + KRI_SUBMIT_DB_RESP.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            emailListTo = KRI_SUBMIT_DB_RESP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]
            emailListCc = KRI_SUBMIT_DB_RESP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]

            KRI_SUBMIT_DB_RESP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].forEach(async (obj) => {
                const { UnitName, KRICode, Period, MetricID, UnitID, StatusID } = obj;
                if (!unitNameKRICodeMap[UnitName]) {
                    unitNameKRICodeMap[UnitName] = {
                        ApprovedKRIs: [],
                        RejectedKRIs: [],
                        Period,
                        MetricID,
                        UnitID,
                        KRICodeCSV: [],
                    };
                }
                unitNameKRICodeMap[UnitName].KRICodeCSV.push(KRICode);
                if (StatusID === 3)  unitNameKRICodeMap[UnitName].ApprovedKRIs.push(KRICode);       
                if (StatusID === 2)  unitNameKRICodeMap[UnitName].RejectedKRIs.push(KRICode);
            });
                
            let uniqueUnitNamesArray = Object.keys(unitNameKRICodeMap).map((UnitName) => ({
                UnitName,
                ...unitNameKRICodeMap[UnitName],
                ApprovedKRIs: unitNameKRICodeMap[UnitName].ApprovedKRIs.join(', '),
                RejectedKRIs: unitNameKRICodeMap[UnitName].RejectedKRIs.join(', '),
                KRICodeCSV: unitNameKRICodeMap[UnitName].KRICodeCSV.join(', '),
            }));
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : uniqueUnitNamesArray     : ' + JSON.stringify(uniqueUnitNamesArray || null));

            if (uniqueUnitNamesArray.length) {
                for (const item of uniqueUnitNamesArray) {                
                    templateMaster = {                     
                        Unit_Name          : item.UnitName,
                        RISKTRAC_WEB_URL   : APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME],
                        KRI_CODE           : item.KRICodeCSV,
                        Period             : item.Period,
                        ApprovedKRIs       : item.ApprovedKRIs != '' ?   item.ApprovedKRIs : 'No KRIs' ,
                        RejectedKRIs       : item.RejectedKRIs != '' ?   item.RejectedKRIs : 'No KRIs' 
                    };
                    filteredUnitToList  = KRI_SUBMIT_DB_RESP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(ob => ob.UnitID == item.UnitID);
                    filteredUnitCcList  = KRI_SUBMIT_DB_RESP.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                    senderEmailTo       = await filterEmailIds(userIdFromToken, filteredUnitToList);   
                    senderEmailCc       = await filterEmailIds(userIdFromToken, filteredUnitCcList);             

                    messageData         = 'KRI has been reviewed for your department: ' + item.UnitName + ', Approved KRIs - (' + (item.ApprovedKRIs != '' ? item.ApprovedKRIs : 'No - KRIs') + '), Rejected KRIs - (' + (item.RejectedKRIs != '' ? item.RejectedKRIs : 'No - KRIs') + ')';

                    emailTemplateObj    = {
                        "Subject": "KRI has been reviewed for your department : [[Unit_Name]]",
                        "Body":`<!DOCTYPE html>  <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"   </head><body>  <div> <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;"> <p style="margin-top:0;margin-bottom:0;">Dear,<br> Below List of KRIs has been Reviewed by the Reviewer.<br> <br>Approved KRI's list - ([[ApprovedKRIs]]) <br>Rejected KRI's list - ([[RejectedKRIs]]) <br> For your unit - [[Unit_Name]] <br>For the Quarter: [[Period]]. <br>   <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br> <p style="margin-top:0;margin-bottom:0;"> <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br> </p></div></div></body></html>`
                    }

                    /**
                    * Sending email notification : START
                    */
                    try {
                        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == senderEmailTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == senderEmailTo || senderEmailTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || 
                            CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == senderEmailCc || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == senderEmailCc || senderEmailCc.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution end. : EmailData is undefined or null.');
                        } else {
                            let toccEmails = {
                                "TOEmail": senderEmailTo,
                                "CCEmail": senderEmailCc
                            }
                            let emailData       = await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, templateMaster, toccEmails);
                            
                            filteredUnitToList  = filteredUnitToList.filter((obj, index, self) =>
                                index === self.findIndex((t) => t.UserGUID === obj.UserGUID)
                            );
                            
                            const emailListToNew = filteredUnitToList.map(obj => {
                                const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_REVIEW_PAGE;
                                return { ...obj, routeLink };
                            });  
                            
                            const emailListCcNew = emailListCc.map(obj => {
                                const routeLink  = ROUTE_LIST_OBJ.KRI_ROUTES.KRI_MEASUREMENT_PAGE;;
                                return { ...obj, routeLink };
                            });
                            
                            const toUserGUIDs           = new Set(emailListToNew.map(obj => obj.UserGUID));
                            const filteredListCcNew     = emailListCcNew.filter(obj => !toUserGUIDs.has(obj.UserGUID));                                                             
                            const ToCcList              = emailListToNew.concat(filteredListCcNew);       

                            logger.log('info', ': KriBl : setKri : ToCcList: ' + JSON.stringify(ToCcList));
                            ToCcList.forEach(async obj => {                         
                                let inappDetails    = {
                                    inAppContent     : messageData + "link:" + 'kri-measurement-review',
                                    recepientUserID  : obj.UserGUID,
                                    subModuleID      : 4
                                }
                                submitKRIResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails, accountGUIDFromToken);                            
                            });
                        }
                    } catch (error) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview-EmailNotification : Notification error ' + error);
                    }
                    /**
                        * Sending email notification : END
                    */
                }
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution end. : Get RiskAppetite Dashboard List successfully.');
            // KRI_SUBMIT_DB_RESP.recordset =[];
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, KRI_SUBMIT_DB_RESP.recordset));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : submitKRIReview : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get self-scoring data 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getKRIReportedData(request, response) {
        try {
            var refreshedToken              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
			var IsOwnUnitData               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
			IsOwnUnitData       = request.body.IsOwnUnitData;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'mo_bank_2@secureyesdev.com'

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution started.');

            const GET_REPORTED_DATA = await kriDbObject.getKRIReportedData(userIdFromToken,userNameFromToken, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : GET_REPORTED_DATA : '+JSON.stringify(GET_REPORTED_DATA || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_REPORTED_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_REPORTED_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution end. : GET_REPORTED_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REPORTED_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution end. : Error details :' + GET_REPORTED_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_REPORTED_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_REPORTED_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution end. : Error details : ' + GET_REPORTED_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_REPORTED_DATA = await formatGetKriReportedData(userIdFromToken,GET_REPORTED_DATA, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : FORMAT_REPORTED_DATA : '+JSON.stringify(FORMAT_REPORTED_DATA || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_REPORTED_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_REPORTED_DATA) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution end. : FORMAT_REPORTED_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const GET_SELF_SCORING = await kriDbObject.getKriMetricsScoring(userIdFromToken,userNameFromToken,IsOwnUnitData, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : GET_SELF_SCORING : '+JSON.stringify(GET_SELF_SCORING || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : GET_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SELF_SCORING.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : Error details :' + GET_SELF_SCORING.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_SELF_SCORING.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SELF_SCORING.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : Error details : ' + GET_SELF_SCORING.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_SELF_SCORING = await formatSelfScoringForReporting(userIdFromToken,GET_SELF_SCORING, accountGUIDFromToken);

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : FORMAT_SELF_SCORING : '+JSON.stringify(FORMAT_SELF_SCORING || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_SELF_SCORING || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_SELF_SCORING) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : Execution end. : FORMAT_SELF_SCORING is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            let MERGED_DATA = {...FORMAT_REPORTED_DATA,...FORMAT_SELF_SCORING};
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKriMetricsScoring : MERGED_DATA : '+JSON.stringify(MERGED_DATA || null));

            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution end. : Get KRI self-scoring details successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, MERGED_DATA));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : getKRIReportedData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async bulkUploadKRIMetrics(request, response) {   
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {        
     
            let BULK_UPLOAD_INFO        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            let data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  

            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.bulkKRIData;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data){
                logger.log('error', 'User Id : '+ userIdFromToken +' : KRIBl : bulkUploadKRIMetrics : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(validationErrorResponse(refreshedToken, 'Invalid request: Missing mandatory parameter (bulkKRIData).', null, 'bulkKRIData', 'Parameter is null or undefined'));
            }
       
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution started.');

            BULK_UPLOAD_INFO = await kriDbObject.getKriMasterData(userIdFromToken, userNameFromToken, accountGUIDFromToken); 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : BULK_UPLOAD_INFO : ' +JSON.stringify(BULK_UPLOAD_INFO));

            if (BULK_UPLOAD_INFO.status !== CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || BULK_UPLOAD_INFO.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE || BULK_UPLOAD_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                const errorMsg = BULK_UPLOAD_INFO && BULK_UPLOAD_INFO.errorMsg ? BULK_UPLOAD_INFO.errorMsg : 'Unable to fetch master data';
                logger.log('error', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end. : Master data fetch failed : ' + errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(databaseErrorResponse(refreshedToken, 'Unable to fetch master data. Please try again or contact support.', errorMsg));
            } 

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : BULK_UPLOAD_INFO : '+ JSON.stringify(BULK_UPLOAD_INFO));
      
            const BULK_UPLOAD_PAYLOAD = await formatPayloadBulkKRIData(userIdFromToken, data, BULK_UPLOAD_INFO, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : BULK_UPLOAD_PAYLOAD : '+ JSON.stringify(BULK_UPLOAD_PAYLOAD));
			
            let validCount      = BULK_UPLOAD_PAYLOAD.validData.length;
            let inValidCount    = BULK_UPLOAD_PAYLOAD.inValidData.length;
            let outputMessage   = 'Number of Records successfully added : ' + validCount + ", Number of records failed to add : " + inValidCount
            
            if(validCount > 0) {

                const KRI_BULK_UPLOAD_DB_RESPONSE = await kriDbObject.bulkUploadKRIMetrics(userIdFromToken, userNameFromToken, accountGUIDFromToken, BULK_UPLOAD_PAYLOAD.validData);        
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : KRI_BULK_UPLOAD_DB_RESPONSE ' + JSON.stringify(KRI_BULK_UPLOAD_DB_RESPONSE || null));
    
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == KRI_BULK_UPLOAD_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == KRI_BULK_UPLOAD_DB_RESPONSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end. :  RiskAppetite list db response is undefined or null.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                if (KRI_BULK_UPLOAD_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end. : Error details :' + KRI_BULK_UPLOAD_DB_RESPONSE.errorMsg);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                if (KRI_BULK_UPLOAD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_BULK_UPLOAD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end. : Error details : ' + KRI_BULK_UPLOAD_DB_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                }
                 // No Record found in database.
                 if (KRI_BULK_UPLOAD_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && KRI_BULK_UPLOAD_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && KRI_BULK_UPLOAD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end. : No Record in data base');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND,KRI_BULK_UPLOAD_DB_RESPONSE));
                }
                const kriData                   = KRI_BULK_UPLOAD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                kriData["uniqueUnitNames"]      = [...new Set(KRI_BULK_UPLOAD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].map(n => n.UnitName))].join(',')
                kriData["RISKTRAC_WEB_URL"]     = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                
                logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : kriData : '+ JSON.stringify(kriData));
                
                let emailListTo     = KRI_BULK_UPLOAD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                let emailListCc     = KRI_BULK_UPLOAD_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                var senderEmailTo   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                var senderEmailCc   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                senderEmailTo       = await filterEmailIds(userIdFromToken, emailListTo);   
                senderEmailCc       = await filterEmailIds(userIdFromToken, emailListCc);           
                
                let EmailDataTo = [
                    {
                        EmailID: senderEmailTo
                    }
                ];
                let EmailDataCC = [
                    {
                        EmailID: senderEmailCc
                    }
                ];
                let emailTemplateObj = {
                    "Subject": "KRI has been defined for your unit(s)",
                    "Body": `<!DOCTYPE html>
                            <html>
                                <body>
                                <head>
                                    <meta charset="UTF-8">  
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                </head>
                                <div>
                                    <div style="width: 650pt;margin: auto;padding: 25pt;font-size: 15pt;font-family: Calibri;line-height: 1.5;">
                                    <p style="margin-top:0;margin-bottom:0;">Dear,<br> <br>
                                    KRI has been defined for your unit(s) - [[uniqueUnitNames]]<br><br>
                                    Requesting you to provide the KRI Measurement for the current reporting frequency.<br><br>
                                    <p style="margin-top:0;margin-bottom:0;"><i>You can review the details through this link <a href="[[RISKTRAC_WEB_URL]]">RISKTRAC_WEB_URL</a></i></p><br>                  
                                    <p style="margin-top:0;margin-bottom:0;">
                                        <p style="margin-top:0;margin-bottom:0;">Kindly discuss with the relevant parties in case of any clarifications.</p><br>
                                    </p>
                                    </div>
                                </div>
                                </body>
                            </html>`
                }
        
                /**
                 * Sending email notification : START
                 */
                try {
                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataTo || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataTo || EmailDataTo.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO || CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == EmailDataCC || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == EmailDataCC || EmailDataCC.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri : Execution end. : EmailData is undefined or null.');
                    } else {
                        var toEmailIDs  = await filterEmailIds(userIdFromToken, EmailDataTo);
                        var ccEmailIDs  = await filterEmailIds(userIdFromToken, EmailDataCC);
                        let toccEmails  = {
                            "TOEmail": toEmailIDs,
                            "CCEmail": ccEmailIDs
                        }

                        await notificationObject.formatDataForSendEmail(userIdFromToken, userNameFromToken, emailTemplateObj, kriData, toccEmails);

                    }
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : KriBl : setKri-EmailNotification : Notification error ' + error);
                }
            }
            

            logger.log('info', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end.');
   
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, outputMessage, BULK_UPLOAD_PAYLOAD));
        } catch (error) {
            const errorMsg = error.message || String(error);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : KRIBl : bulkUploadKRIMetrics : Execution end. : Got unhandled error. : Error Detail : ' + errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(databaseErrorResponse(refreshedToken, 'An unexpected error occurred. Please try again or contact support.', errorMsg));
        }
    }


    stop() {
    }
}


/**
 * This is function will format DB response of upload incident .
 */
async function formatEvidencelist(userIdFromToken,dbRecordSet, accountGUIDFromToken) { 

    try {
        // logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsBl : formatEvidencelist : Execution started.' +JSON.stringify(dbRecordSet[0])); 

        let evidences = []; 

        // forming uploadedincident evidence data for UI.  
        evidences.push({
            "EvidenceID":       dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EvidenceID,
            "FileName":         dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileName,
            "Remark":           dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Remark,
            "FileType":         dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
            "FileContentID":    dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContentID,
        });

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
 * This is function will format DB response of download incident evidence .
 */
async function formatDownloadResponse(userIdFromToken,dbRecordSet, accountGUIDFromToken) { 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatDownloadResponse : Execution started.'); 

        let evidences = []; 
        // forming uploadedincident evidence data for UI.  
        evidences.push({
            "FileName"          : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileName,
            "FileType"          : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
            "FileContent"       : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContent
        });

        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatDownloadResponse : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatDownloadResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of KRI master data .
 */
async function formatGetKriMasterData(userIdFromToken,KriData, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriMasterData : Execution started.');
        let measurementFrequencies  = []; 
        let types                   = [];
        let reportingFrequencies    = [];
        let status                  = [];
        let thresholdValue          = [];
        let emailData               = [];
        let reviewFrequencies       = [];
        let userList                = [];
        let reportingFrequency      = [];
        let inherentRisks           = [];

        // forming measurement frequency data for UI.
        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                  measurementFrequencies.push({
                    "FrequencyID" : obj.FrequencyID,
                    "Name"        : obj.Name,
                    "Description" : obj.Description,
                    "IsActive"    : obj.IsActive
                    });                             
            }
        }       

        // forming type data for UI.
        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {                
                    types.push({
                        "TypeID"    : obj.TypeID,
                        "Name"      : obj.Name,
                        "IsActive"  : obj.IsActive
                    });                
            }
        }

         // forming  Review Frequencies data for UI.
         if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {               
                    reviewFrequencies.push({
                    "ReviewerID"  : obj.ReviewerID,
                    "FullName"    : obj.FullName,
                    "UserGUID"    : obj.UserGUID,
                    "IsDeleted"   : obj.IsDeleted,
                    "IsActive"    : obj.IsActive
                    });                
            }
        }


        // forming  reporting Frequencies data for UI.
        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {               
                    reportingFrequencies.push({
                    "FrequencyID"       : obj.FrequencyID,
                    "Name"              : obj.Name,
                    "Description"       : obj.Description,
                    "InUse"             : obj.InUse,
                    "IsActive"          : obj.IsActive,
                    "GracePeriodDays"   : obj.BufferDays,
                    "LastUpdatedDate"   : obj.LastUpdatedDate,
                    "reminderdays"      : obj.ReminderOffsetDays
                    });                
            }
        }

        // forming status data for UI.
        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])) {
                status.push({
                    "StatusID"      : obj.StatusID,
                    "Name"          : obj.Name
                });
            }
        }

        // forming threshold value data for UI.
        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])) {               
                    thresholdValue.push({
                        "ThresholdID"   : obj.ThresholdID,
                        "Value"         : obj.Value,
                        "ColorCode"     : obj.ColorCode,
                        "IsActive"      : obj.IsActive,
                        "Name"          : obj.Name
                    });
            }
        }

          // forming email data for UI.
          if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {               
                emailData.push({
                    "EmailFrequencyID"         : obj.EmailFrequencyID,
                    "ReportingFrequencyID"     : obj.ReportingFrequencyID,
                    "Month"                    : obj.Month,
                    "InUse"                    : obj.InUse,
                    "IsActive"                 : obj.IsActive,
                    "Day"                      : obj.Day,
                    "Description"              : obj.InUse,
                    "IsDeleted"                : obj.IsDeleted
                    });                
            }
        }

         // forming User data for UI.
        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN])) {
                userList.push({
                    "UserGUID"      : obj.UserGUID,
                    "FullName"      : obj.FullName,
                    "RoleID"        : obj.RoleID,
                    "UserName"      : obj.UserName
                });
            }
        }

        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            reportingFrequency =  KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN]
        }

        if (KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            inherentRisks = KriData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN]
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriMasterData : Execution ended.');

        // Forming final data to send UI.
        return {
            "measurementFrequencies"    : measurementFrequencies,
            "types"                     : types,
            "reportingFrequencies"      : reportingFrequencies,
            "status"                    : status,
            "thresholdValue"            : thresholdValue,
            "emailData"                 : emailData,
            "reviewFrequencies"         : reviewFrequencies,
            "userList"                  : userList,
            "updatedFrequency"          : reportingFrequency,
            "inherentRisks"             : inherentRisks
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of KRI info data .
 */
async function formatKriInfoResponse(userIdFromToken, KRI_SCORING_INFO, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriInfoResponse : Execution started.');
        let groups                  = [];
        let units                   = [];
        let measurementFrequencies  = []; 
        let types                   = [];
        let reportingFrequencies    = [];
        let status                  = [];
        let thresholdValue          = [];
        let users                   = [];

        // forming group data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                groups.push({
                    "GroupID"   : obj.GroupID,
                    "GroupName" : obj.Name
                });
            }
        }

        // forming unit data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
                units.push({
                    "UnitID"    : obj.UnitID,
                    "GroupID"   : obj.GroupID,
                    "UnitName"      : obj.Name
                });
            }
        }

        // forming measurement frequency data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                if (obj.IsActive == true)
                {
                    measurementFrequencies.push({
                        "FrequencyID" : obj.FrequencyID,
                        "Name"        : obj.Name,
                        "Description" : obj.Description,
                        "IsActive"    : obj.IsActive
                    });
                }
            }
        }       

        // forming type data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
                if (obj.IsActive == true)
                {
                    types.push({
                        "TypeID"    : obj.TypeID,
                        "Name"      : obj.Name,
                        "IsActive"  : obj.IsActive
                    });
                }               
            }
        }

        // forming  reporting Frequencies data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {
                if (obj.IsActive == true && obj.InUse == true)
                {
                    reportingFrequencies.push({
                    "FrequencyID"       : obj.FrequencyID,
                    "Name"              : obj.Name,
                    "Description"       : obj.Description,
                    "InUse"             : obj.InUse,
                    "IsActive"          : obj.IsActive,
                    "GracePeriodDays"   : obj.BufferDays,
                    "LastUpdatedDate"   : obj.LastUpdatedDate,
                    "reminderdays"      : obj.ReminderOffsetDays
                    });
                }                
            }
        }

        // forming status data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])) {
                if (obj.IsActive == true)
                {
                    status.push({
                        "StatusID"      : obj.StatusID,
                        "Name"          : obj.Name,
                        "IsActive"      : obj.IsActive
                    });
                }               
            }
        }

        // forming threshold value data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])) {
                if (obj.IsActive == true)
                {
                    thresholdValue.push({
                        "ThresholdID"   : obj.ThresholdID,
                        "Value"         : obj.Value,
                        "ColorCode"     : obj.ColorCode,
                        "IsActive"      : obj.IsActive,
                        "Name"          : obj.Name
                    });
                }               
            }
        }

        // forming user data for UI.
        if (KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(KRI_SCORING_INFO.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN])) {
                let midName = (obj.MiddleName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? obj.MiddleName : CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY;
                users.push({
                    "UserGUID"  : obj.UserGUID,
                    "FullName"  : obj.FirstName + midName + obj.LastName
                });
            }
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriInfoResponse : Execution end.');

        // Forming final data to send UI.
        return{
            "groups"                    : groups,
            "units"                     : units,
            "measurementFrequencies"    : measurementFrequencies,
            "types"                     : types,
            "reportingFrequencies"      : reportingFrequencies,
            "status"                    : status,
            "thresholdValue"            : thresholdValue,
            "usersList"                 : users
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatKriInfoResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of KRI info data .
 */
async function formatGetKriResponse(userIdFromToken, GET_KRI_RESPONSE, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriResponse : Execution started.');
        let kriData                  = [];
        let kriDefinations           = []
    
        // forming kri metrics data for UI.
        if (GET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            //sorting for latest record on the top based on Created Date
            kriDefinations = GET_KRI_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];       
            kriDefinations = kriDefinations.sort((a,b)=> Date.parse(b.CreatedDate) - Date.parse(a.CreatedDate));
            
            for(const obj of Object.values(kriDefinations)) {
                kriData.push({
                    "KriCode"                   : obj.KRICode,
                    "MetricID"                  : obj.MetricID,
                    "GroupID"                   : obj.GroupID,
                    "GroupName"                 : obj.GroupName,
                    "UnitID"                    : obj.UnitID,
                    "UnitName"                  : obj.UnitName,
                    "KeyRiskIndicator"          : obj.Description,
                    "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                    "MeasurementFrequencyName"  : obj.MeasurementFrequency,
                    "ReportingFrequencyID"      : obj.ReportingFrequencyID,
                    "ReportingFrequencyName"    : obj.ReportingFrequency,
                    "Target"                    : obj.ThresholdValue5,
                    "KriTypeID"                 : obj.KRITypeID,
                    "KriTypeName"               : obj.KRIType,
                    "ThresholdValue1"           : obj.ThresholdValue1,
                    "ThresholdValue2"           : obj.ThresholdValue2,
                    "ThresholdValue3"           : obj.ThresholdValue3,
                    "ThresholdValue4"           : obj.ThresholdValue4,
                    "ThresholdValue5"           : obj.ThresholdValue5,
                    "ThresholdType"             : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : 'PERCENTAGE',
                    "InherentRiskID"            : obj.InherentRiskID,
                    "InherentRisk"              : obj.InherentRisk
                });
            }
        }
        //sorting for latest record on the top
       // kriData = kriData.sort((a,b)=> (b.KriCode.localeCompare(a.KriCode)));

        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriResponse : Execution end.');

        // Forming final data to send UI.
        return{
            "kriData" : kriData,
        };

    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


async function formatGetKriReportedData(userIdFromToken, REPORTED_DATA, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriReportedData : Execution started.');
        let reportingPeriod        = [];
        let reportingFrequency     = [];
        let groupsData             = [];
        let metricData             = [];
        let reportedData           = [];
        let evidenceList           = [];
        let kriMetricData          = [];
        let prevScoring            = [];
        let reviwer                = [];
        let riskUnitUser           = [];
        let uniqueGroupsArray      = [];
        let uniqueUnitsArray       = [];
        let emailTrigger           = [];
        let reportingFrequencyData = [];
       

       //fetching current scoring data of kri
        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            groupsData  = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        }
        //unique groups and unit names
        if ( REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            let uniqueGroups = {};
            let grps = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]
            for (let i = 0; i < grps.length; i++) {
                const group = grps[i];                
                if (!uniqueGroups[group.GroupID]) {
                    uniqueGroups[group.GroupID] = {
                        GroupID: group.GroupID,
                        GroupName: group.GroupName
                    };
                }
            }            
            uniqueGroupsArray = Object.values(uniqueGroups);
            if (grps !== null) {
                const uniqueUnits = {};            
                grps.forEach(obj => {
                    const unitKey = `${obj.GroupID}_${obj.UnitID}`;   
                    if (!uniqueUnits[unitKey]) {
                        uniqueUnits[unitKey] = {
                            "GroupID": obj.GroupID,
                            "UnitID": obj.UnitID,
                            "UnitName": obj.UnitName
                        };
                    }
                });
                uniqueUnitsArray = Object.values(uniqueUnits);            
            }
        }

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            reportingPeriod  = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        }

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            reportingFrequency  = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
        }

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            metricData = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];                    
        }

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            reportedData = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
        }  
        
        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            evidenceList = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
        } 
        
        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            prevScoring = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
        }   
        
        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            reviwer = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
        }   

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            riskUnitUser = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];
        }   

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {

                let prevScoringArr      = prevScoring.filter(ele => ele.MetricID == obj.MetricID);
                let PreviousScoring     = prevScoringArr.length ? JSON.parse(prevScoringArr[0].PreviousData) : [];
                let groupArr            = groupsData.find(itr=> itr.UnitID == obj.UnitID);    
                let scoringObj          = reportedData.filter(ele => ele.MetricID == obj.MetricID);
                let CommentData         = scoringObj.length ? JSON.parse(scoringObj[0].CommentData) : '';   
                let CommentArr          = (scoringObj.length && JSON.parse(scoringObj[0].CommentData) || [])[0] || {};
                obj['MeasurementID']    = scoringObj.length ? scoringObj[0].MeasurementID : '';
                obj['CommentBody']      = CommentArr.CommentBody || '';
                obj['IsVisible']        = CommentArr.IsVisible;
                let evidencesArry       = evidenceList.filter(ele => Number(ele.MetricID) == Number(obj.MetricID));

                kriMetricData.push({
                    "KriCode"                   : obj.KRICode,
                    "MetricID"                  : obj.MetricID,  
                    "UnitID"                    : obj.UnitID,
                    "Unit_Name"                 : obj.UnitName,
                    "Indicator"                 : obj.Description,
                    "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                    "MeasurementFrequency"      : obj.MeasurementFrequency,
                    "Target"                    : obj.ThresholdValue5,
                    "KriTypeID"                 : obj.KRITypeID,
                    "KriType"                   : obj.KRIType,                   
                    "ThresholdValue1"           : obj.ThresholdValue1,
                    "ThresholdValue2"           : obj.ThresholdValue2,
                    "ThresholdValue3"           : obj.ThresholdValue3,
                    "ThresholdValue4"           : obj.ThresholdValue4,
"ThresholdValue5"           : obj.ThresholdValue5,
                    "ThresholdType"             : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : (obj.ThresholdValue5 > 100 ? 'NUMBER' : 'PERCENTAGE'),
                    "IsVisible"                 : obj.IsVisible,
                    "IsSaved"                   : scoringObj.length ? scoringObj[0].IsSaved          : null,
                    "ReportID"                  : scoringObj.length ? scoringObj[0].ReportID         : null,
                    "Period"                    : scoringObj.length ? scoringObj[0].Period           : null,
                    "Date"                      : scoringObj.length ? scoringObj[0].Date             : null,
                    "Measurement"               : scoringObj.length ? scoringObj[0].Measurement      : null,
                    "ThresholdID"               : scoringObj.length ? scoringObj[0].ThresholdID      : null,
                    "ThresholdValue"            : scoringObj.length ? scoringObj[0].Value            : null,
                    "ColorCode"                 : scoringObj.length ? scoringObj[0].ColorCode        : null,
                    "Remarks"                   : scoringObj.length ? scoringObj[0].Remark           : null,
                    "IsReported"                : scoringObj.length ? scoringObj[0].IsReported       : null,
                    "KRI_Status"                : scoringObj.length ? scoringObj[0].KRI_Status       : null,
                    "IsReviewed"                : scoringObj.length ? scoringObj[0].IsReviewed       : null,
                    "ReviewerGUID"              : scoringObj.length ? scoringObj[0].ReviewerGUID     : null,
                    "KRI_EmailStatus"           : scoringObj.length ? scoringObj[0].KRI_EmailStatus  : null,
                    "ReportStatusID"            : scoringObj.length ? scoringObj[0].ReportStatusID   : null,
                    "ReportStatusName"          : scoringObj.length ? scoringObj[0].ReportStatusName : null,
                    "CommentBody"               : obj.CommentBody,   
                    "MeasurementID"             : obj.MeasurementID,  
                    "evidences"                 : evidencesArry || [],  
                    "GroupID"                   : groupArr.GroupID,
                    "GroupName"                 : groupArr.GroupName,   
                    "PreviousScoring"           : PreviousScoring,  
                    "CommentData"               : CommentData,       
                });   
            }
        }

       //fetching current scoring data of kri
        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            emailTrigger  = REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];
        }

        if (REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORTED_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN])) {
                reportingFrequencyData.push({
                    "FrequencyID"           : obj.FrequencyID,
                    "Name"                  : obj.Name,
                    "Description"           : obj.Description,
                    "InUse"                 : obj.InUse,
                    "BufferDays"            : obj.BufferDays,
                    "IsWithinBufferDays"    : obj.IsWithinBufferDays,
                    "Period"                : obj.Period,
                    "PeriodStartDate"       : obj.PeriodStartDate,
                    "PeriodEndDate"         : obj.PeriodEndDate
                });
            }
        }        


 


       logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriReportedData : Execution end.');

       // Forming final data to send UI.
       return{
           "groupsData"             : uniqueGroupsArray,
           "uniqueUnits"            : uniqueUnitsArray,
           "reportingPeriod"        : reportingPeriod,
           "reportingFrequency"     : reportingFrequency,
           "reportedData"           : reportedData,
           "metricData"             : metricData,
           "evidenceList"           : evidenceList,
           "kriMetricData"          : kriMetricData,
           "reviwer"                : reviwer,
           "riskUnitUser"           : riskUnitUser,
           "emailTrigger"           : emailTrigger,
           "reportingFrequencyData" : reportingFrequencyData
       };

   } catch (error) {
       logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatGetKriReportedData : Execution end. : Got unhandled error. : Error Detail : ' + error);
       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
}



 /**
 * This is function will format DB response of KRI self scoring data .
 */

 async function formatGetKriSelfScoring(userIdFromToken, GET_SELF_SCORING, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriSelfScoring : Execution started.');
        let reportingFrequency     = [];
        let groups                 = [];
        let groupsData             = [];
        let units                  = [];
        let threshold              = [];
        let kriMetricData          = [];
        let scoringData            = [];
        let previousScoringData    = [];
        let evidences              = [];
        let RiskUnitPowerUser      = [];
        let unitData               = [];
        let reportingFrequencyData = [];

        // forming reporting frequency data for UI.
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
               reportingFrequency.push({
                   "ReportingFrequency" : obj.Name,
                   "Description"        : obj.Description,
                   "CycleEndDate"       : obj.CycleEndDate
               })
           }
       }

       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
               RiskUnitPowerUser.push({
                   "RiskUnitPowerUser": obj.RiskUnitPowerUser
               })
           }
       }

       //fetching current scoring data of kri
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           scoringData  = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
       }

       //fetching previous scoring data of kri
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           previousScoringData  = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
       }

       // forming group and unit data for UI.
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
               groupsData.push({
                   "GroupID"   : obj.GroupID,
                   "GroupName" : obj.GroupName
               });
               units.push({
                   "UnitID"    : obj.UnitID,
                   "UnitName"  : obj.UnitName,
                   "GroupID"   : obj.GroupID,
               });
           }
       }


       // Evidences Data
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
               evidences = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
                 
       }

       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        unitData = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];
          
        }

       /**
        * Removing duplicate groups value from groupsData : START
        */
       if (groupsData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && groupsData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
           groups = groupsData.filter((groupsArray, index, self) =>
               index === self.findIndex((t) => (
                   t.GroupID === groupsArray.GroupID && t.GroupName === groupsArray.GroupName
               ))
           );
       }
       /**
        * Removing duplicate groups value from groupsData : END
        */

       // forming threshold data for UI.
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
               threshold.push({
                   "ThresholdID"       : obj.ThresholdID,
                   "Value"             : obj.Value,
                   "ColorCode"         : obj.ColorCode,
                   "Name"              : obj.Name,
                   "IsActive"          : obj.IsActive,
                   "IsDeleted"         : obj.IsDeleted,
                   "CreatedDate"       : obj.CreatedDate,
                   "CreatedBy"         : obj.CreatedBy,
                   "LastUpdatedDate"   : obj.LastUpdatedDate,
                   "LastUpdatedBy"     : obj.LastUpdatedBy
               });
           }
       }

       // forming Kri Metric data for UI.
      if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {
                let StatusName      = CONSTANT_FILE_OBJ.APP_CONSTANT.NOT_MEASURED 
                let currentscores   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let previousScores  = [];

                let groupData = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(ele => ele.UnitID == obj.UnitID);

                // forming current scoring data for UI.
                let scoringObj = scoringData.filter(ele => ele.MetricID == obj.MetricID);
                if (scoringObj && scoringObj.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    currentscores   =  scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    obj['ReportStatusID'] = scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReportStatusID
                    obj['ReportStatusName'] = scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReportStatusName
                    // obj['StatusName'] = scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].KRI_Status
                }
                // logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriSelfScoring : scoringObj : ' + JSON.stringify(scoringObj || null));

                //Adding Status name for kri based on measurement
                // Existing UI implementation - DO NOT REMOVE
                if (currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    StatusName = currentscores.KRI_Status
                }


                    // forming previous scoring data for UI.
                let previousScoringObj = previousScoringData.filter(ele => ele.MetricID == obj.MetricID);
                for(const obj of Object.values(previousScoringObj)) {
                    let prevScoresObj = [];
                    if (obj.PreviousData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let data = JSON.parse(obj.PreviousData);
                        
                        for(const obj of Object.values(data)) {
                            prevScoresObj.push({
                                "MeasurementID"     : obj.MeasurementID,
                                "Date"              : obj.Date,
                                "Period"            : obj.Period,
                                "Measurement"       : obj.Measurement,
                                "ThresholdID"       : obj.ThresholdID,
                                "ColorCode"         : obj.ColorCode,
                                "ThresholdValue"    : obj.ThresholdValue,
                                "KRI_Status"        : obj.KRI_Status,
                            })   
                        }
                    }
                        //prevScoresObj = prevScoresObj.sort((a,b)=> (a.Period.localeCompare(b.Period)));
                        prevScoresObj = prevScoresObj.sort((a,b)=> (a.Date - b.Date));
                        previousScores.push({
                            "MetricID": obj.MetricID,
                            "PreviousData" : prevScoresObj
                        })
                    }
                let evidencesArry = evidences.filter(ele => Number(ele.MetricID) == Number(obj.MetricID));
                obj['PreviousScoring'] = previousScores && previousScores.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? previousScores : [];
                let checkerData = scoringObj;                
                obj['CommentData']   = checkerData.length ? JSON.parse(checkerData[0].CommentData) : '';               
                obj['MeasurementID'] = checkerData.length ? checkerData[0].MeasurementID : '';
                    //    let CommentBodyArr   = checkerData.length ? JSON.parse(checkerData[0].CommentData) : '';
                    //    let CommentArr       = CommentBodyArr != null ? CommentBodyArr[CommentBodyArr.length-1] : '' 
                    //    obj['CommentBody']   = CommentArr != null ? CommentArr.CommentBody : ''
                let CommentArr = (checkerData.length && JSON.parse(checkerData[0].CommentData) || [])[0] || {};
                obj['CommentBody'] = CommentArr.CommentBody || '';

                kriMetricData.push({
                    "KriCode"                   : obj.KRICode,
                    "MetricID"                  : obj.MetricID,  
                    "UnitID"                    : obj.UnitID,
                    "Unit_Name"                 : obj.UnitName,
                    "GroupID"                   : groupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "GroupName"                 : groupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Indicator"                 : obj.Description,
                    "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                    "MeasurementFrequency"      : obj.MeasurementFrequency,
                    "Target"                    : obj.ThresholdValue5,
                    "KriTypeID"                 : obj.KRITypeID,
                    "KriType"                   : obj.KRIType,
                    "IsReported"                : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.IsReported : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ThresholdValue1"           : obj.ThresholdValue1,
                    "ThresholdValue2"           : obj.ThresholdValue2,
                    "ThresholdValue3"           : obj.ThresholdValue3,
                    "ThresholdValue4"           : obj.ThresholdValue4,
                    "ThresholdValue5"           : obj.ThresholdValue5,
                    "ThresholdType"             : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : 'PERCENTAGE',
                    "Period"                    : ( StatusName == "Not Measured" || StatusName == "Measured") ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL : obj.Period,
                    "Date"                      : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Date : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Measurement"               : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Measurement : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ThresholdID"               : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ThresholdID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ThresholdValue"            : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ThresholdValue : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ColorCode"                 : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ColorCode : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Remarks"                   : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Remark : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "StatusName"                : StatusName,
                    "PreviousScoring"           : obj.PreviousScoring,
                    "evidences"                 : evidencesArry,
                    "checkerData"               : checkerData,
                    "CommentData"               : obj.CommentData,
                    "MeasurementIDData"         : obj.MeasurementID,
                    "IsReviewedData"            : obj.IsReviewed, 
                    "CommentBody"               : obj.CommentBody,
                    "ReportStatusID"            : obj.ReportStatusID,
                    "ReportStatusName"          : obj.ReportStatusName,
                    "MeasurementPeriod"         : obj.Period
                });         
            }
        }


       // forming threshold data for UI.
        if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT])) {
                reportingFrequencyData.push({
                    "FrequencyID"           : obj.FrequencyID,
                    "Name"                  : obj.Name,
                    "Description"           : obj.Description,
                    "InUse"                 : obj.InUse,
                    "BufferDays"            : obj.BufferDays,
                    "IsWithinBufferDays"    : obj.IsWithinBufferDays,
                    "Period"                : obj.Period,
                    "PeriodStartDate"       : obj.PeriodStartDate,
                    "PeriodEndDate"         : obj.PeriodEndDate
                });
            }
        }        

       logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriSelfScoring : Execution end.');

       // Forming final data to send UI.
       return{
           "units"                  : units,
           "groups"                 : groups,
           "reportingFrequency"     : reportingFrequency,
           "thresholds"             : threshold,
           "kriMetricData"          : kriMetricData,
           "RiskUnitPowerUser"      : RiskUnitPowerUser,
           "scoringData"            : scoringData,
           "reportingFrequencyData" : reportingFrequencyData
       };

   } catch (error) {
       logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatKriSelfScoring : Execution end. : Got unhandled error. : Error Detail : ' + error);
       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
 }

 async function formatSelfScoringForReporting(userIdFromToken, GET_SELF_SCORING, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatSelfScoringForReporting : Execution started.');
        let reportingFrequency     = [];
        let groups                 = [];
        let groupsData             = [];
        let units                  = [];
        let threshold              = [];
        let kriMetricData          = [];
        let scoringData            = [];
        let previousScoringData    = [];
        let evidences              = [];
        let RiskUnitPowerUser      = [];
        let unitData               = [];
        // forming reporting frequency data for UI.
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
               reportingFrequency.push({
                   "ReportingFrequency": obj.Name
               })
           }
       }

       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
               RiskUnitPowerUser.push({
                   "RiskUnitPowerUser": obj.RiskUnitPowerUser
               })
           }
       }

       //fetching current scoring data of kri
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           scoringData  = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
       }

       //fetching previous scoring data of kri
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           previousScoringData  = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
       }

       // forming group and unit data for UI.
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
               groupsData.push({
                   "GroupID"   : obj.GroupID,
                   "GroupName" : obj.GroupName
               });
               units.push({
                   "UnitID"    : obj.UnitID,
                   "UnitName"  : obj.UnitName,
                   "GroupID"   : obj.GroupID,
               });
           }
       }


       // Evidences Data
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
               evidences = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
                 
       }

       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        unitData = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];
          
        }


       /**
        * Removing duplicate groups value from groupsData : START
        */
       if (groupsData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && groupsData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
           groups = groupsData.filter((groupsArray, index, self) =>
               index === self.findIndex((t) => (
                   t.GroupID === groupsArray.GroupID && t.GroupName === groupsArray.GroupName
               ))
           );
       }
       /**
        * Removing duplicate groups value from groupsData : END
        */

       // forming threshold data for UI.
       if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
               threshold.push({
                   "ThresholdID"       : obj.ThresholdID,
                   "Value"             : obj.Value,
                   "ColorCode"         : obj.ColorCode,
                   "Name"              : obj.Name,
                   "IsActive"          : obj.IsActive,
                   "IsDeleted"         : obj.IsDeleted,
                   "CreatedDate"       : obj.CreatedDate,
                   "CreatedBy"         : obj.CreatedBy,
                   "LastUpdatedDate"   : obj.LastUpdatedDate,
                   "LastUpdatedBy"     : obj.LastUpdatedBy
               });
           }
       }

       // forming Kri Metric data for UI.
      if (GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])) {
                let StatusName      = CONSTANT_FILE_OBJ.APP_CONSTANT.NOT_MEASURED 
                let currentscores   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let previousScores  = [];

                let groupData = GET_SELF_SCORING.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(ele => ele.UnitID == obj.UnitID);

                // forming current scoring data for UI.
                let scoringObj = scoringData.filter(ele => ele.MetricID == obj.MetricID);
                if (scoringObj && scoringObj.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    currentscores   =  scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    obj['ReportStatusID'] = scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReportStatusID
                    obj['ReportStatusName'] = scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReportStatusName
                }
                // logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatSelfScoringForReporting : scoringObj : ' + JSON.stringify(scoringObj || null));

                //Adding Status name for kri based on measurement
                if (currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    StatusName = currentscores.IsReported ? 'Reported' : currentscores.Measurement != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? CONSTANT_FILE_OBJ.APP_CONSTANT.MEASURED : CONSTANT_FILE_OBJ.APP_CONSTANT.NOT_MEASURED;
                }


                    // forming previous scoring data for UI.
                let previousScoringObj = previousScoringData.filter(ele => ele.MetricID == obj.MetricID);
                for(const obj of Object.values(previousScoringObj)) {
                    let prevScoresObj = [];
                    if (obj.PreviousData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                        let data = JSON.parse(obj.PreviousData);
                        
                        for(const obj of Object.values(data)) {
                            prevScoresObj.push({
                                "MeasurementID"     : obj.MeasurementID,
                                "Date"              : obj.Date,
                                "Period"            : obj.Period,
                                "Measurement"       : obj.Measurement,
                                "ThresholdID"       : obj.ThresholdID,
                                "ColorCode"         : obj.ColorCode,
                                "ThresholdValue"    : obj.ThresholdValue,
                                "KRI_Status"        : obj.KRI_Status
                            })   
                        }
                    }
                        //prevScoresObj = prevScoresObj.sort((a,b)=> (a.Period.localeCompare(b.Period)));
                        prevScoresObj = prevScoresObj.sort((a,b)=> (a.Date - b.Date));
                        previousScores.push({
                            "MetricID": obj.MetricID,
                            "PreviousData" : prevScoresObj
                        })
                    }
                let evidencesArry = evidences.filter(ele => Number(ele.MetricID) == Number(obj.MetricID));
                obj['PreviousScoring'] = previousScores && previousScores.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? previousScores : [];
                let checkerData = scoringObj;                
                obj['CommentData']   = checkerData.length ? JSON.parse(checkerData[0].CommentData) : [];               
                obj['MeasurementID'] = checkerData.length ? checkerData[0].MeasurementID : '';
                    //    let CommentBodyArr   = checkerData.length ? JSON.parse(checkerData[0].CommentData) : '';
                    //    let CommentArr       = CommentBodyArr != null ? CommentBodyArr[CommentBodyArr.length-1] : '' 
                    //    obj['CommentBody']   = CommentArr != null ? CommentArr.CommentBody : ''
                let CommentArr = (checkerData.length && JSON.parse(checkerData[0].CommentData) || [])[0] || {};
                obj['CommentBody'] = CommentArr.CommentBody || '';

                kriMetricData.push({
                    "KriCode"                   : obj.KRICode,
                    "MetricID"                  : obj.MetricID,  
                    "UnitID"                    : obj.UnitID,
                    "Unit_Name"                 : obj.UnitName,
                    "GroupID"                   : groupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "GroupName"                 : groupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Indicator"                 : obj.Description,
                    "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                    "MeasurementFrequency"      : obj.MeasurementFrequency,
                    "Target"                    : obj.ThresholdValue5,
                    "KriTypeID"                 : obj.KRITypeID,
                    "KriType"                   : obj.KRIType,
                    "IsReported"                : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.IsReported : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ThresholdValue1"           : obj.ThresholdValue1,
                    "ThresholdValue2"           : obj.ThresholdValue2,
                    "ThresholdValue3"           : obj.ThresholdValue3,
                    "ThresholdValue4"           : obj.ThresholdValue4,
                    "ThresholdValue5"           : obj.ThresholdValue5,
                    "ThresholdType"             : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : 'PERCENTAGE',
                    "Period"                    : ( StatusName == "Not Measured" || StatusName == "Measured") ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL : obj.Period,
                    "Date"                      : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Date : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Measurement"               : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Measurement : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ThresholdID"               : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ThresholdID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ThresholdValue"            : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ThresholdValue : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "ColorCode"                 : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ColorCode : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "Remarks"                   : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Remark : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    "StatusName"                : StatusName,
                    "PreviousScoring"           : obj.PreviousScoring,
                    "evidences"                 : evidencesArry,
                    "checkerData"               : checkerData,
                    "CommentData"               : (obj.CommentData != null || obj.CommentData != undefined ) ? obj.CommentData :  [],
                    "MeasurementIDData"         : obj.MeasurementID,
                    "IsReviewedData"            : obj.IsReviewed, 
                    "CommentBody"               : obj.CommentBody,
                    "ReportStatusID"            : obj.ReportStatusID,
                    "ReportStatusName"          : obj.ReportStatusName
                });         
            }
        }

       logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatSelfScoringForReporting : Execution end.');

       // Forming final data to send UI.
       return{
           "unitsSelfScoring"                 : units,
           "groupsSelfScoring"                : groups,
           "reportingFrequencySelfScoring"    : reportingFrequency,
           "threshold"                        : threshold,
           "kriMetricDataSelfScoring"         : kriMetricData,
           "RiskUnitPowerUserSelfScoring"     : RiskUnitPowerUser,
           "scoringDataSelfScoring"           : scoringData,
       };

   } catch (error) {
       logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatSelfScoringForReporting : Execution end. : Got unhandled error. : Error Detail : ' + error);
       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
 }



/**
 * This is function will format DB response of KRI report data .
 */
 async function formatKriReport(userIdFromToken, REPORT_DATA, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriReport : Execution started.');
        let reportingFrequency     = [];
        let reportingPeriod        = [];
        let groups                 = [];
        let uniqueGroups           = [];
        let units                  = [];
        let kriMetricData          = [];
        let scoringData            = [];
        let reportingFrequencyData = [];

        // forming group and unit data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                groups.push({
                    "GroupID"   : obj.GroupID,
                    "GroupName" : obj.GroupName
                });
                units.push({
                    "UnitID"    : obj.UnitID,
                    "UnitName"  : obj.UnitName,
                    "GroupID"   : obj.GroupID,
                });
            }
        }
        
         // forming reporting period data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])) {
                reportingPeriod.push({
                    "ReportingPeriod": obj.ReportingPeriod
                })
            }
        }

         // forming reporting frequency data for UI.
       if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
               reportingFrequency.push({
                   "ReportingFrequency": obj.ReportingFrequency
               })
           }
       }

        // fetching scores data for KRI.
       if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           scoringData  = REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
       }

        // forming Kri Metric  data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
               let currentscores   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
               let ReportStatusName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
               let KRI_Status = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
               let StatusName      = CONSTANT_FILE_OBJ.APP_CONSTANT.NOT_MEASURED;
               let groupData       = REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].filter(ele => ele.UnitID == obj.UnitID);
               obj['GroupData']    = groupData && groupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupData : []
 
                // forming current scoring data for UI.
               let scoringObj = scoringData.filter(ele => ele.MetricID == obj.MetricID);
               if (scoringObj && scoringObj.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                   currentscores   = scoringObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];       
               }
            
            //    if (currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            //       StatusName = currentscores.Measurement != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? CONSTANT_FILE_OBJ.APP_CONSTANT.MEASURED : CONSTANT_FILE_OBJ.APP_CONSTANT.NOT_MEASURED;
            //    }
                //Adding Status name for kri based on measurement
                if (currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                    StatusName = currentscores.IsReported ? 'Reported' : currentscores.Measurement != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? CONSTANT_FILE_OBJ.APP_CONSTANT.MEASURED : CONSTANT_FILE_OBJ.APP_CONSTANT.NOT_MEASURED;
                    ReportStatusName = currentscores.ReportStatusName
                    KRI_Status = currentscores.KRI_Status
                }
               kriMetricData.push({
                   "KriCode"                   : obj.KRICode,
                   "MetricID"                  : obj.MetricID, 
                   "ReportID"                  : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ReportID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "MeasurementID"             : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.MeasurementID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, 
                   "UnitID"                    : obj.UnitID,
                   "UnitName"                  : obj.UnitName,
                   "GroupID"                   : obj.GroupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? obj.GroupData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "GroupName"                 : obj.GroupData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? obj.GroupData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "Indicator"                 : obj.Description,
                   "IsReported"                : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.IsReported : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                   "MeasurementFrequency"      : obj.MeasurementFrequency,
                   "Target"                    : obj.ThresholdValue5,
                   "KriTypeID"                 : obj.KRITypeID,
                   "KriType"                   : obj.KRIType,
                   "ThresholdValue1"           : obj.ThresholdValue1,
                   "ThresholdValue2"           : obj.ThresholdValue2,
                   "ThresholdValue3"           : obj.ThresholdValue3,
                   "ThresholdValue4"           : obj.ThresholdValue4,
                   "ThresholdValue5"           : obj.ThresholdValue5,
                   "ThresholdType"             : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : 'PERCENTAGE',
                   "Period"                    : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Period : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "Date"                      : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Date : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "Measurement"               : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Measurement : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "ThresholdID"               : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ThresholdID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "ThresholdValue"            : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Value : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "ColorCode"                 : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.ColorCode : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "Remarks"                   : currentscores != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentscores.Remark : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "StatusName"                : StatusName,
                   "KRI_Status"                : KRI_Status,
                   "ReportStatusName"          : ReportStatusName
               });
           }
       }

         /**
         * Removing duplicate groups value from groups : START
         */
        if (groups != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && groups.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            uniqueGroups = groups.filter((groupsArray, index, self) =>
                index === self.findIndex((t) => (
                    t.GroupID === groupsArray.GroupID && t.GroupName === groupsArray.GroupName
                ))
            );
        }

		        // forming threshold data for UI.
        if (REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for (const obj of Object.values(REPORT_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])) {
                reportingFrequencyData.push({
                    "FrequencyID"           : obj.FrequencyID,
                    "Name"                  : obj.Name,
                    "Description"           : obj.Description,
                    "InUse"                 : obj.InUse,
                    "BufferDays"            : obj.BufferDays,
                    "IsWithinBufferDays"    : obj.IsWithinBufferDays,
                    "Period"                : obj.Period,
                    "PeriodStartDate"       : obj.PeriodStartDate,
                    "PeriodEndDate"         : obj.PeriodEndDate                   
                });
            }
        }         
        /**
         * Removing duplicate groups value from groups : END
         */
      
       logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriReport : Execution end.');

       // Forming final data to send UI.
       return{
            "units"                     : units,
            "groups"                    : uniqueGroups,
            "reportingPeriod"           : reportingPeriod,
            "reportingFrequency"        : reportingFrequency,
            "kriMetricData"             : kriMetricData,
            "reportingFrequencyData"    : reportingFrequencyData
       };

   } catch (error) {
       logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatKriReport : Execution end. : Got unhandled error. : Error Detail : ' + error);
       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
}

/**
 * This is function will format DB response of KRI historic scoring data .
 */
async function formatKriHistoricData(userIdFromToken, getScoringData, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriHistoricData : Execution started.');

        let groups        = [];
        let units         = [];
        let uniqueGroups  = [];
        let years         = [];
        let kriMetricData = [];
       
        if (getScoringData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            for(const obj of Object.values(getScoringData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                // forming unit data for UI.
                units.push({
                    "GroupID"   : obj.GroupID,
                    "UnitID"    : obj.UnitID,
                    "UnitName"  : obj.UnitName
                });
                // forming group data for UI.
                groups.push({
                    "GroupID"   : obj.GroupID,
                    "GroupName" : obj.GroupName
                });
            }
        }

        /**
         * Removing duplicate groups value from groups : START
         */
        if (groups != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && groups.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            uniqueGroups = groups.filter((groupsArray, index, self) =>
                index === self.findIndex((t) => (
                    t.GroupID === groupsArray.GroupID && t.GroupName === groupsArray.GroupName
                ))
            );
        }
        /**
         * Removing duplicate groups value from groups : END
         */
      
         // fetching years data for UI.
        if (getScoringData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            years = getScoringData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        }
  
        // forming Kri data for UI.
        if (getScoringData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(getScoringData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
                let previousData = [];
                 // forming previous scoring data for UI.
                if (obj.PreviousData && obj.PreviousData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    let data = JSON.parse(obj.PreviousData);                  

                    for(const obj of Object.values(data)) {
                        previousData.push({    
                            "MeasurementID"     : obj.MeasurementID,
                            "Period"            : obj.Period,
                            "Date"              : obj.Date,
                            "Measurement"       : (obj.Measurement == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL : obj.Measurement,
                            "ThresholdID"       : obj.ThresholdID,
                            "ColorCode"         : obj.ColorCode,
                            "ThresholdValue"    : obj.ThresholdValue ? obj.ThresholdValue : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "Year"              : obj.Year 
                        })
                    }
                }
                
                //sorting for latest record on the top based on date
                previousData = previousData.sort((a,b)=> (b.Date.localeCompare(a.Date)));
                /**
                 * Removing duplicate period value from previousData : START
                 */
                let uniquePreviousData = [];
                if (previousData && previousData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
                    uniquePreviousData = previousData.filter((previousDataArray, index, self) =>
                        index === self.findIndex((t) => (
                            t.Period === previousDataArray.Period 
                        ))
                    );
                }

                /**
                 * Removing duplicate period value from previousData : END
                 */

               kriMetricData.push({
                   "KriCode"                   : obj.KRICode,
                   "MetricID"                  : obj.MetricID, 
                   "GroupID"                   : obj.GroupID,
                   "GroupName"                 : obj.GroupName,
                   "UnitID"                    : obj.UnitID,
                   "UnitName"                  : obj.UnitName,
                   "Description"               : obj.Description,
                   "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                   "MeasurementFrequency"      : obj.MeasurementFrequency,
                   "scoring"                   : previousData && previousData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? uniquePreviousData : []
               });
           }
       }

       logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriHistoricData : Execution end.');

       // Forming final data to send UI.
       return{
           "units"         : units,
           "groups"        : uniqueGroups,
           "years"         : years,
           "kriMetricData" : kriMetricData,
       };

   } catch (error) {
       logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatKriHistoricData : Execution end. : Got unhandled error. : Error Detail : ' + error);
       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
}

/**
 * This is function will format DB response of KRI historic reporting data .
 */
 async function formatKriHistoricalReportData(userIdFromToken, ReportData, accountGUIDFromToken) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriHistoricalReportData : Execution started.');

        let groups              = [];
        let uniqueGroups        = [];
        let units               = [];
        let years               = [];
        let reportingFrequency  = [];
        let kriMetricData       = [];
        let groupUnitData       = [];       
        let threshold           = [];
       
        if (ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            groupUnitData = ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            for(const obj of Object.values(ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
                // forming unit data for UI.
                units.push({
                    "GroupID"   : obj.GroupID,
                    "UnitID"    : obj.UnitID,
                    "UnitName"  : obj.UnitName
                });
                // forming group data for UI.
                groups.push({
                    "GroupID"   : obj.GroupID,
                    "GroupName" : obj.GroupName
                });
            }
        }

         /**
         * Removing duplicate groups value from groups : START
         */
         if (groups != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && groups.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            uniqueGroups = groups.filter((groupsArray, index, self) =>
                index === self.findIndex((t) => (
                    t.GroupID === groupsArray.GroupID && t.GroupName === groupsArray.GroupName
                ))
            );
        }
        /**
         * Removing duplicate groups value from groups : END
         */

         // forming years data for UI.
        if (ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            years = ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
        }
      
         // forming reporting frequency data for UI.
        if (ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {           
           for(const obj of Object.values(ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
            reportingFrequency.push({
                    "Name"   : obj.Name
                });
            }
        }
    
        // forming Kri data for UI.
        if (ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
           for(const obj of Object.values(ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])) {
            
                let groupObj     = groupUnitData.filter(ele => ele.UnitID == obj.UnitID);   
                let previousData = [];

                 // forming previous scoring data for UI.
                if (obj.PreviousData && obj.PreviousData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    let data = JSON.parse(obj.PreviousData);
                    for(const obj of Object.values(data)) {
                        previousData.push({    
                            "ReportID"           : obj.ReportID,
                            "Period"             : obj.Period,
                            "Date"               : obj.ThresholdValue != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.Date : '',
                            "Measurement"        : (obj.Measurement == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ? CONSTANT_FILE_OBJ.APP_CONSTANT.NULL : obj.Measurement,
                            "ThresholdID"        : obj.ThresholdID,
                            "ColorCode"          : obj.ColorCode,
                            "ThresholdValue"     : obj.ThresholdValue ? obj.ThresholdValue : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            "Year"               : obj.Year,
                            "Remark"             : obj.ThresholdValue != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.Remark : '',
                            "KRI_Status"         : obj.KRI_Status,
                            "IsActive"           : obj.IsActive,
                            "IsDeleted"          : obj.IsDeleted,
                            "KRIDeletedDate"     : obj.KRIDeletedDate,
                            "KRI_Deleted_Quater" : obj.KRI_Deleted_Quater,
                        })
                    }
                }     
                 //sorting for latest record on the top 
                 previousData = previousData.sort((a,b)=> (b.Date.localeCompare(a.Date)));
                 /**
                  * Removing duplicate period value from previousData : START
                  */
                 let uniquePreviousData = [];
                 if (previousData && previousData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
                     uniquePreviousData = previousData.filter((previousDataArray, index, self) =>
                         index === self.findIndex((t) => (
                             t.Period === previousDataArray.Period 
                         ))
                     );
                 }
                 /**
                  * Removing duplicate period value from previousData : END
                  */
 
               // Normalize Target to number for UI (strip % if present); infer ThresholdType when missing
               let targetNum = obj.Target;
               if (typeof targetNum !== 'number') {
                   const s = String(targetNum || '').replace(/%/g, '').trim();
                   targetNum = (s === '' || isNaN(Number(s))) ? 0 : Number(s);
               }
               const thresholdType = (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE'))
                   ? obj.ThresholdType
                   : (targetNum > 100 ? 'NUMBER' : 'PERCENTAGE');

               kriMetricData.push({
                   "KriCode"                   : obj.KRICode,
                   "MetricID"                  : obj.MetricID, 
                   "GroupID"                   : groupObj && groupObj.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupID : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "GroupName"                 : groupObj && groupObj.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? groupObj[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].GroupName : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                   "UnitID"                    : obj.UnitID,
                   "UnitName"                  : obj.UnitName,
                   "Description"               : obj.Description,
                   "MeasurementFrequencyID"    : obj.MeasurementFrequencyID,
                   "MeasurementFrequency"      : obj.MeasurementFrequency,
                   "Target"                    : targetNum,
                   "ThresholdType"             : thresholdType,
                   "KRITypeID"                 : obj.KRITypeID,
                   "KRIType"                   : obj.KRIType,
                   "KRI_Defined_Quater"        : obj.KRI_Defined_Quater,
                   "previousData"              : previousData &&  previousData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? uniquePreviousData : []
               });
           }
       }

       if (ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        threshold = ReportData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
    }
       
       logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : formatKriHistoricalReportData : Execution end.');

       // Forming final data to send UI.
       return{
           "groups"             : uniqueGroups,
           "units"              : units,   
           "years"              : years,
           "reportingFrequency" : reportingFrequency,
           "kriMetricData"      : kriMetricData,
           "threshold"          : threshold
       };

   } catch (error) {
       logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : formatKriHistoricalReportData : Execution end. : Got unhandled error. : Error Detail : ' + error);
       return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   }
}

/**
 * This is function will filter UserGUID from  DB response object .
 */
async function filterUserGUIDs(userIdFromToken,emailList) { 
    try {
       // console.log("emailList",emailList);
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : filterUserGUIDs : Execution started.');
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : filterUserGUIDs :emailList.' + JSON.stringify(emailList));
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
            logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : filterUserGUIDs :senderGUID.' + JSON.stringify(senderGUID));
        return senderGUID;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : filterUserGUIDs : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will filter emailid from  DB response object .
 */
async function filterEmailIds(userIdFromToken,emailList) { 
    try {
       // console.log("emailList",emailList);
        logger.log('info', 'User Id : '+ userIdFromToken +' : KriBl : filterEmailIds : Execution started.');
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
                senderEmail = allEmail.join(", ");
            } 
       
        return senderEmail;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : KriBl : filterEmailIds : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

async function formatPayloadBulkKRIData(userIdFromToken, payloadData, bulkInfoData) {
    try {
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData: Execution started.');        
        let parsedData   = JSON.parse(payloadData);
        let metricData   = [];
        let validData    = [];
        let inValidData  = [];
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: payloadData: '  + JSON.stringify(payloadData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: bulkInfoData: ' + JSON.stringify(bulkInfoData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: parsedData : '  + JSON.stringify(parsedData || null));

        parsedData.forEach(obj => {         
            metricData.push({
                "GroupName"            : obj['GroupName'],
                "UnitName"             : obj['UnitName'],
                "Description"          : obj['Description'],  
                "InherentRisk"         : obj['Inherent Risk'],                 
                "MeasurementFrequency" : obj['Measurement Frequency'],
                "KRIType"              : obj['KRI Type'],
                "ThresholdValue1"      : obj['Threshold Value1'],  
                "ThresholdValue2"      : obj['Threshold Value2'],  
                "ThresholdValue3"      : obj['Threshold Value3'],  
                "ThresholdValue4"      : obj['Threshold Value4'],   
                "ThresholdValue5"      : obj['Threshold Value5'],               
            });
        })
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: metricData: ' + JSON.stringify(metricData || null));
        
        const cleanedData = metricData.map((item) => {
            for (const key in item) {
              if (typeof item[key] === "string") {
                item[key] = item[key].trim();
              }
            }
            return item;
        });
          
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: cleanedData: ' + JSON.stringify(cleanedData || null)); 
        
        cleanedData.forEach((obj, index) => {
            const rowNumber = index + 2; // +2 because Excel row 1 is header, so data starts at row 2
            const thresholdValues   = [obj.ThresholdValue1, obj.ThresholdValue2, obj.ThresholdValue3, obj.ThresholdValue4, obj.ThresholdValue5];
            const isAscending       = thresholdValues.every((value, index, arr) => index === 0 || value > arr[index - 1]);
            const isDescending      = thresholdValues.every((value, index, arr) => index === 0 || value < arr[index - 1]);

            const measurementFrequency  = bulkInfoData.recordset[0].filter(nn => nn.IsActive).find(itr => itr.Name.trim() == obj.MeasurementFrequency);
            const KRIType               = bulkInfoData.recordset[1].filter(nn => nn.IsActive).find(itr => itr.Name.trim() == obj.KRIType);
            const group                 = bulkInfoData?.recordset?.[8] ?.filter(nn => nn?.IsActive) ?.find(itr => itr?.Name?.trim() === obj?.GroupName);
            const unit                  = bulkInfoData?.recordset?.[9] ?.filter(nn => nn?.IsActive) ?.find(itr => itr?.Name?.trim() === obj?.UnitName && itr?.GroupID === group?.GroupID);
            // logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: cleanedData-recordset[11]: ' + JSON.stringify(bulkInfoData.recordset[11] || [])); 
            const InherentRisk = bulkInfoData.recordset[11]?.find(ir => ir?.Risk?.trim() === obj.InherentRisk && ir?.UnitID === unit?.UnitID );
            // logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: cleanedData-InherentRisk: ' + JSON.stringify(InherentRisk || null)); 
            const isValidInherentRisk = !obj.InherentRisk || obj.InherentRisk.trim() === "" ? true : InherentRisk?.Risk ? true : false;
            // logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: cleanedData-isValidInherentRisk: ' + isValidInherentRisk); 

            if (group && unit && measurementFrequency && isValidInherentRisk && KRIType && (isAscending || isDescending) && obj.ThresholdValue5 <= 100) {
                validData.push({
                    "GroupName"            : obj.GroupName,            
                    "UnitName"             : obj.UnitName,             
                    "Description"          : obj.Description, 
                    "InherentRisk"         : InherentRisk?.Risk ?? null,                 
                    "MeasurementFrequency" : obj.MeasurementFrequency,
                    "KRIType"              : obj.KRIType,         
                    "ThresholdValue1"      : obj.ThresholdValue1,    
                    "ThresholdValue2"      : obj.ThresholdValue2,  
                    "ThresholdValue3"      : obj.ThresholdValue3,     
                    "ThresholdValue4"      : obj.ThresholdValue4,      
                    "ThresholdValue5"      : obj.ThresholdValue5,
                    "ThresholdType"       : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : 'PERCENTAGE'
                });
            }  else {
                let failureReasons = [];        
                if (!group)                             failureReasons.push(`Group Name '${obj.GroupName || ''}'`);
                if (!unit)                              failureReasons.push(`Unit Name '${obj.UnitName || ''}'`);
                if (!measurementFrequency)              failureReasons.push(`Measurement Frequency '${obj.MeasurementFrequency || ''}'`);
                if (!KRIType)                           failureReasons.push(`KRI Type '${obj.KRIType || ''}'`); 
                if (!isValidInherentRisk && obj.InherentRisk) failureReasons.push(`Inherent Risk '${obj.InherentRisk}'`);
                if (!isAscending && !isDescending)      failureReasons.push("Threshold Values should be either in Ascending or Descending Order");  
                if (obj.ThresholdValue5 > 100)          failureReasons.push("Threshold Value5 must be less than or equal to 100");  

                const failureReason = `Row ${rowNumber}: Invalid reference(s) - ${failureReasons.join(', ')} not found in master data or validation failed`;
                inValidData.push({
                    "GroupName"            : obj.GroupName,            
                    "UnitName"             : obj.UnitName,             
                    "Description"          : obj.Description,
                    "InherentRisk"         : InherentRisk?.Risk ?? null,                   
                    "MeasurementFrequency" : obj.MeasurementFrequency,
                    "KRIType"              : obj.KRIType,         
                    "ThresholdValue1"      : obj.ThresholdValue1,    
                    "ThresholdValue2"      : obj.ThresholdValue2,  
                    "ThresholdValue3"      : obj.ThresholdValue3,     
                    "ThresholdValue4"      : obj.ThresholdValue4,      
                    "ThresholdValue5"      : obj.ThresholdValue5,
                    "ThresholdType"       : (obj.ThresholdType && (obj.ThresholdType === 'NUMBER' || obj.ThresholdType === 'PERCENTAGE')) ? obj.ThresholdType : 'PERCENTAGE',
                    "Row Number"           : rowNumber,
                    "Failure reason"       : failureReason
                });
            }
        });
        
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: validData: '   + JSON.stringify(validData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData:  :: inValidData: ' + JSON.stringify(inValidData || null));

        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData: Execution end.');
        return  {
            "validData"     : validData,
            "inValidData"   : inValidData,
        };
    } catch (error) {
        logger.log('error', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkKRIData: Execution end. : Got an unhandled error. : Error Detail: ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


/**
 * This is function will be used to return single instance of class.
 */
function getKriBLClassInstance() {
    if (kriBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        kriBLClassInstance = new KriBl();
    }
    return kriBLClassInstance;
}

async function getUnique(arr, comp) {
    const unique = arr.map(e => e[comp])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);
    return unique;
}


exports.getKriBLClassInstance = getKriBLClassInstance;