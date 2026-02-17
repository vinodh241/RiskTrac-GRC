
const MESSAGE_FILE_OBJ          = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const INAPP_NOTIFICATION_DB     = require('../../data-access/inApp-notification-db.js');
const ENUMS_OBJ                 = require("../../utility/enums/enums.js");


var inAppNotificationDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inappNotificationBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InAppNotificationBl {
    constructor() {       
        inAppNotificationDbObject  = new INAPP_NOTIFICATION_DB();
    }

    start() {

    }
    /**
     * Get User Alerts from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getUserAlerts(request, response) {
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;           
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;       
        accountGUIDFromToken    = request.body.accountGUIDFromToken; 

        try {
            data     = request.body.data; 
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution started.');

            const GET_USER_ALERTS = await inAppNotificationDbObject.getUserAlerts(userIdFromToken,userNameFromToken, accountGUIDFromToken);  
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : GET_USER_ALERTS : ' + JSON.stringify(GET_USER_ALERTS)); 

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_USER_ALERTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_USER_ALERTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : GET_USER_ALERTS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_USER_ALERTS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : Error details :' + GET_USER_ALERTS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_USER_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_USER_ALERTS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : Error details : ' + GET_USER_ALERTS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            const USER_ALERTS_DATA = await formatUserAlertData(userIdFromToken,GET_USER_ALERTS.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO], accountGUIDFromToken);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : USER_ALERTS_DATA : ' + JSON.stringify(USER_ALERTS_DATA));

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : UserAlerts data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, USER_ALERTS_DATA));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : getUserAlerts : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Update User Alerts 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateUserAlerts(request, response) {
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;           
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;       
        accountGUIDFromToken    = request.body.accountGUIDFromToken; 

        try {
            data     = request.body.data; 

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : updateUserAlerts : Execution started.');

            const UPDATE_USER_ALERTS = await inAppNotificationDbObject.updateUserAlerts(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);   

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_USER_ALERTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_USER_ALERTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : updateUserAlerts : Execution end. : UPDATE_USER_ALERTS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_USER_ALERTS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : updateUserAlerts : Execution end. : Error details :' + UPDATE_USER_ALERTS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (UPDATE_USER_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_ALERTS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : updateUserAlerts : Execution end. : Error details : ' + UPDATE_USER_ALERTS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : updateUserAlerts : Execution end. : Alerts Updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, UPDATE_USER_ALERTS));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : updateUserAlerts : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

      /**
     * Update User Alerts 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
       async deleteUserAlerts(request, response) {
            
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var data                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken          = request.body.refreshedToken;           
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;       
        accountGUIDFromToken    = request.body.accountGUIDFromToken; 

        try {
            data     = request.body.data; 

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : deleteUserAlerts : Execution started.');

            const DELETE_USER_ALERTS = await inAppNotificationDbObject.deleteUserAlerts(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);   

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_USER_ALERTS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_USER_ALERTS) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : deleteUserAlerts : Execution end. : DELETE_USER_ALERTS is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_USER_ALERTS.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : deleteUserAlerts : Execution end. : Error details :' + DELETE_USER_ALERTS.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DELETE_USER_ALERTS.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_USER_ALERTS.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : deleteUserAlerts : Execution end. : Error details : ' + DELETE_USER_ALERTS.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : deleteUserAlerts : Execution end. : Alerts deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, DELETE_USER_ALERTS));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationBl : deleteUserAlerts : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
 
    stop() {
    }
}

function unsuccessfulResponse(refreshedToken, errorMessage){
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

function successfulResponse(refreshedToken, successMessage, result){
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
 * This is function will return required userAlerts data .
 */
 async function formatUserAlertData(userIdFromToken,userAlsertsData, accountGUIDFromToken){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : Execution started.');
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : userAlsertsData  :: ' +JSON.stringify(userAlsertsData || null))
        let userAlerts = [];
        for(const obj of Object.values(userAlsertsData)){                   
            userAlerts.push({
                AlertID                 : obj.AlertID,
                AlertDate               : obj.AlertDate,
                ToUserGUID              : obj.ToUserGUID,
                InAppMessage            : obj.InAppMessage, 
                IsRead                  : obj.IsRead,
                IsInAppNotification     : obj.IsInAppNotification,
                TotalCount              : obj.TotalCount,              
                UnReadCount             : obj.UnReadCount,
                SubModuleID             : obj.SubModuleID, 
            })        
        };      
        userAlerts.map(item => {
            const inAppMessage = item.InAppMessage;
            const splitText    = inAppMessage.split("link:");
            item.message       = splitText[0];
            item.link          = splitText[1];
        });

        userAlerts              = userAlerts.filter(nn => !nn.IsRead)
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : userAlerts  :: ' +JSON.stringify(userAlerts || null));

        let SRAInAppData        = userAlerts.filter(obj=> obj.SubModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[0].SubModuleID);
        let BCPInAppData        = userAlerts.filter(obj=> obj.SubModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[1].SubModuleID);
        let CompInAppData       = userAlerts.filter(obj=> obj.SubModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[2].SubModuleID);
        let BCMSInAppData       = userAlerts.filter(obj=> obj.SubModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[3].SubModuleID);
        let CriIncInAppData     = userAlerts.filter(obj=> obj.SubModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[4].SubModuleID);
        let RMTInAppData        = userAlerts.filter(obj=> obj.SubModuleID == ENUMS_OBJ.IN_APP_ALERTS_INFO_DATA[5].SubModuleID);

        let userAlertsResp = {
            "SRAInAppData"     : SRAInAppData,
            "BCPInAppData"     : BCPInAppData,
            "BCMSInAppData"    : BCMSInAppData,
            "CrisisInAppData"  : CriIncInAppData,
            "RMTInAppData"     : RMTInAppData
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : Execution end. userAlertsResp : ' + JSON.stringify(userAlertsResp) );
    return userAlertsResp;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : InAppNotificationBl : formatUserAlertData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getInAppNotificationBLClassInstance() {
    if (inappNotificationBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        inappNotificationBlClassInstance = new InAppNotificationBl();
    }
    return inappNotificationBlClassInstance;
}

exports.getInAppNotificationBLClassInstance = getInAppNotificationBLClassInstance;