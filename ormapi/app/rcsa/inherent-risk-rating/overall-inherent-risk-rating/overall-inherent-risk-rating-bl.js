const VALIDATOR_OBJECT      = require('validator');
const APP_VALIATOR          = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../../utility/constants/constant.js');
const OVERALL_INHERENT_RISK_RATING_DB    = require('../../../../data-access/overall-inherent-risk-rating-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var OverallInherentRiskRatingDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var OverallInherentRiskRatingBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class OverallInherentRiskRatingBl {
    constructor() {
        appValidatorObject  = new APP_VALIATOR();
        OverallInherentRiskRatingDbObject = new OVERALL_INHERENT_RISK_RATING_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Overall Inherent Risk Rating from database server either by AllActive/All/ByID.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllOverallInherentRiskRating(request, response){
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
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution started.');

            const result = await OverallInherentRiskRatingDbObject.getAllOverallInherentRiskRating(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallInherentRiskRatingBl : getAllOverallInherentRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Active Overall Inherent Risk Rating from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllActiveOverallInherentRiskRating(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution started.');

            const result = await OverallInherentRiskRatingDbObject.getAllActiveOverallInherentRiskRating(binds);

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallInherentRiskRatingBl : getAllActiveOverallInherentRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Overall Inherent Risk Rating from database server By ID
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getOverallInherentRiskRatingByID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
       
        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            binds.id = request.body.id || 0;
            binds.isActive = request.body.isActive || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution started.');

            const result = await OverallInherentRiskRatingDbObject.getOverallInherentRiskRatingByID(binds);

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallInherentRiskRatingBl : getOverallInherentRiskRatingByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will add Overall Inherent Risk Rating to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addOverallInherentRiskRating(request, response){
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

            binds.riskRating = request.body.riskRating || "";
  	        binds.computation = request.body.computation || "";
            binds.computationCode = request.body.computationCode || "";
            binds.colourName = request.body.colourName || "";
            binds.colourCode = request.body.colourCode || "";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.riskRating) || appValidatorObject.isStringNull(request.body.riskRating) || appValidatorObject.isStringEmpty(request.body.riskRating)){
                validationMessage.push('Risk rating');
            }

            if(appValidatorObject.isStringUndefined(request.body.computation) || appValidatorObject.isStringNull(request.body.computation) || appValidatorObject.isStringEmpty(request.body.computation)){
                validationMessage.push('Computation');
            }

            if(appValidatorObject.isStringUndefined(request.body.computationCode) || appValidatorObject.isStringNull(request.body.computationCode) || appValidatorObject.isStringEmpty(request.body.computationCode)){
                validationMessage.push('Computation Code');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourCode) || appValidatorObject.isStringNull(request.body.colourCode) || appValidatorObject.isStringEmpty(request.body.colourCode)){
                validationMessage.push('Colour Code');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourName) || appValidatorObject.isStringNull(request.body.colourName) || appValidatorObject.isStringEmpty(request.body.colourName)){
                request.body.colourName=request.body.colourCode;
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : AddOverallInherentRiskRating : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : AddOverallInherentRiskRating : Execution started.');

            const result = await OverallInherentRiskRatingDbObject.addOverallInherentRiskRating(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : addOverallInherentRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : addOverallInherentRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : addOverallInherentRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : addOverallInherentRiskRating : Execution end. : Data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallInherentRiskRatingBl : addOverallInherentRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Overall Inherent Risk Rating to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateOverallInherentRiskRating(request, response){
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
            binds.riskRating = request.body.riskRating || "";
            binds.computation = request.body.computation || "";
            binds.computationCode = request.body.computationCode || "";
            binds.colourName = request.body.colourName || "";
 	        binds.colourCode = request.body.colourCode || "";
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.riskRating) || appValidatorObject.isStringNull(request.body.riskRating) || appValidatorObject.isStringEmpty(request.body.riskRating)){
                validationMessage.push('Risk rating');
            }

            if(appValidatorObject.isStringUndefined(request.body.computation) || appValidatorObject.isStringNull(request.body.computation) || appValidatorObject.isStringEmpty(request.body.computation)){
                validationMessage.push('Computation');
            }

            if(appValidatorObject.isStringUndefined(request.body.computationCode) || appValidatorObject.isStringNull(request.body.computationCode) || appValidatorObject.isStringEmpty(request.body.computationCode)){
                validationMessage.push('Computation Code');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourCode) || appValidatorObject.isStringNull(request.body.colourCode) || appValidatorObject.isStringEmpty(request.body.colourCode)){
                validationMessage.push('Colour Code');
            }

            if(appValidatorObject.isStringUndefined(request.body.colourName) || appValidatorObject.isStringNull(request.body.colourName) || appValidatorObject.isStringEmpty(request.body.colourName)){
                request.body.colourName=request.body.colourCode;
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : UpdateOverallInherentRiskRating : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : UpdateOverallInherentRiskRating : Execution started.');

            const result = await OverallInherentRiskRatingDbObject.updateOverallInherentRiskRating(binds);

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRating : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Overall Inherent Risk Rating Status to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateOverallInherentRiskRatingStatus(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRatingStatus : Execution started.');

            const result = await OverallInherentRiskRatingDbObject.updateOverallInherentRiskRatingStatus(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRatingStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRatingStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRatingStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRatingStatus : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallInherentRiskRatingBl : updateOverallInherentRiskRatingStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
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
function getOverallInherentRiskRatingBLClassInstance() {
    if (OverallInherentRiskRatingBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        OverallInherentRiskRatingBlClassInstance = new OverallInherentRiskRatingBl();
    }
    return OverallInherentRiskRatingBlClassInstance;
}

exports.getOverallInherentRiskRatingBLClassInstance = getOverallInherentRiskRatingBLClassInstance;