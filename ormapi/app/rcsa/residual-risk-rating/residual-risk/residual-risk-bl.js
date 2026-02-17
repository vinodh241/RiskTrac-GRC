const VALIDATOR_OBJECT      = require('validator');
const APP_VALIATOR          = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../../utility/constants/constant.js');
const RESIDUAL_RISK_DB    = require('../../../../data-access/residual-risk-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ResidualRiskDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ResidualRiskBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ResidualRiskBl {   
    constructor() {
        appValidatorObject  = new APP_VALIATOR();
        ResidualRiskDbObject = new RESIDUAL_RISK_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Residual Risk from database server either by AllActive/All/ByID.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllResidualRisk(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
       
        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.isActive = request.body.isActive || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllResidualRisk : Execution started.');

            const result = await ResidualRiskDbObject.getAllResidualRisk(binds);

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllResidualRisk : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllResidualRisk : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllResidualRisk : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllResidualRisk : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllResidualRisk : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ResidualRiskBl : getAllResidualRisk : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Active Residual Risk from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllActiveResidualRisk(request, response){
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
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllActiveResidualRisk : Execution started.');

            const result = await ResidualRiskDbObject.getAllActiveResidualRisk(binds);

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllActiveResidualRisk : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllActiveResidualRisk : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllActiveResidualRisk : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllActiveResidualRisk : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getAllActiveResidualRisk : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ResidualRiskBl : getAllActiveResidualRisk : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Residual Risk from database server By ID
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getResidualRiskByID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
       
        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getResidualRiskByID : Execution started.');

            const result = await ResidualRiskDbObject.getResidualRiskByID(binds);

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getResidualRiskByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getResidualRiskByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : getResidualRiskByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getResidualRiskByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : getResidualRiskByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ResidualRiskBl : getResidualRiskByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will add Residual Risk to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addResidualRisk(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.risk = request.body.risk || "";
            binds.colourCode = request.body.colourCode || "";
            binds.colourName = request.body.colourName || "";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.risk) || appValidatorObject.isStringNull(request.body.risk) || appValidatorObject.isStringEmpty(request.body.risk)){
                validationMessage.push('Risk');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourCode) || appValidatorObject.isStringNull(request.body.colourCode) || appValidatorObject.isStringEmpty(request.body.colourCode)){
                validationMessage.push('Colour Code');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourName) || appValidatorObject.isStringNull(request.body.colourName) || appValidatorObject.isStringEmpty(request.body.colourName)){
                request.body.colourName=request.body.colourCode;
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : AddResidualRisk : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : AddResidualRisk : Execution started.');

            const result = await ResidualRiskDbObject.addResidualRisk(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : addOverallControlEnvironmentRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : addResidualRisk : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : addResidualRisk : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : addResidualRisk : Execution end. : Data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ResidualRiskBl : addResidualRisk : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Residual Risk to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateResidualRisk(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.risk = request.body.risk || "";
            binds.colourCode = request.body.colourCode || "";
            binds.colourName = request.body.colourName || "";
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.risk) || appValidatorObject.isStringNull(request.body.risk) || appValidatorObject.isStringEmpty(request.body.risk)){
                validationMessage.push('Risk');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourCode) || appValidatorObject.isStringNull(request.body.colourCode) || appValidatorObject.isStringEmpty(request.body.colourCode)){
                validationMessage.push('Colour Code');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourName) || appValidatorObject.isStringNull(request.body.colourName) || appValidatorObject.isStringEmpty(request.body.colourName)){
                request.body.colourName=request.body.colourCode;
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : UpdateResidualRisk : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : UpdateResidualRisk : Execution started.');

            const result = await ResidualRiskDbObject.updateResidualRisk(binds);
           
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRisk : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRisk : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRisk : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRisk : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ResidualRiskBl : updateResidualRisk : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Residual Risk Status to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateResidualRiskStatus(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

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

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRiskStatus : Execution started.');

            const result = await ResidualRiskDbObject.updateResidualRiskStatus(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRiskStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRiskStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRiskStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ResidualRiskBl : updateResidualRiskStatus : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ResidualRiskBl : updateResidualRiskStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
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
function getResidualRiskBLClassInstance() {
    if (ResidualRiskBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        ResidualRiskBlClassInstance = new ResidualRiskBl();
    }
    return ResidualRiskBlClassInstance;
}

exports.getResidualRiskBLClassInstance = getResidualRiskBLClassInstance;