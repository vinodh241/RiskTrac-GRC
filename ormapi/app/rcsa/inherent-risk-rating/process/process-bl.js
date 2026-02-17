const APP_VALIATOR          = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../../utility/constants/constant.js');
const PROCESS_DB      = require('../../../../data-access/process-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ProcessDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ProcessBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ProcessBl{
    constructor() {
        appValidatorObject  = new APP_VALIATOR();
        ProcessDbObject = new PROCESS_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Process from database server either by AllActive/All/ByID.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllProcess(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken

            binds.id = request.body.id || 0;
            binds.isActive = request.body.isActive || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getAllProcess : Execution started.');

            const result = await ProcessDbObject.getAllProcess(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getAllProcess : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getAllProcess : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getAllProcess : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getAllProcess : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getAllProcess : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ProcessBl : getAllProcess : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

     /**
     * This function will fetch details of Active Process from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
      async getAllActiveProcess(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getAllActiveProcess : Execution started.');

            const result = await ProcessDbObject.getAllActiveProcess(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getAllActiveProcess : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getAllActiveProcess : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getAllActiveProcess : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getAllActiveProcess : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getAllActiveProcess : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));   
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ProcessBl : getAllActiveProcess : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Process from database server By ID
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getProcessByID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getProcessByID : Execution started.');
            
            const result = await ProcessDbObject.getProcessByID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getProcessByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getProcessByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : getProcessByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getProcessByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : getProcessByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));   
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ProcessBl : getProcessByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will add Process to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addProcess(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken

            binds.name = request.body.name || "";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.name) || appValidatorObject.isStringNull(request.body.name) || appValidatorObject.isStringEmpty(request.body.name)){
                validationMessage.push('Name');
            }

            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : AddProcess : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : AddProcess : Execution started.');

            const result = await ProcessDbObject.addProcess(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : addProcess : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : addProcess : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : addProcess : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : addProcess : Execution end. : Data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ProcessBl : addProcess : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Process to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateProcess(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken

            binds.id = request.body.id || 0;
            binds.name = request.body.name || "";
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.name) || appValidatorObject.isStringNull(request.body.name) || appValidatorObject.isStringEmpty(request.body.name)){
                validationMessage.push('Name');
            }

            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : UpdateProcess : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : UpdateProcess : Execution started.');

            const result = await ProcessDbObject.updateProcess(binds);
            
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : updateProcess : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : updateProcess : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : updateProcess : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : updateProcess : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ProcessBl : updateProcess : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Process Status to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateProcessStatus(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.isActive = request.body.isActive || 0;
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : updateProcessStatus : Execution started.');

            const result = await ProcessDbObject.updateProcessStatus(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : updateProcessStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : updateProcessStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ProcessBl : updateProcessStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ProcessBl : updateProcessStatus : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ProcessBl : updateProcessStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
    }

}

function validateAndReturnData(response, result, userId, refreshedToken, methodName ){

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
 * This is function will be used to return single instance of class.
 */
 function getProcessBLClassInstance() {
    if (ProcessBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        ProcessBlClassInstance = new ProcessBl();
    }
    return ProcessBlClassInstance;
}

exports.getProcessBLClassInstance = getProcessBLClassInstance;