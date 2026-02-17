const VALIDATOR_OBJECT      = require('validator');
const APP_VALIATOR          = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../../utility/constants/constant.js');
const OVERALL_RESIDUAL_RISK_RATING_DB    = require('../../../../data-access/overall-residual-risk-rating-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var OverallResidualRiskRatingDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var OverallResidualRiskRatingBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class OverallResidualRiskRatingBl {
    constructor() {
        appValidatorObject  = new APP_VALIATOR();
        OverallResidualRiskRatingDbObject = new OVERALL_RESIDUAL_RISK_RATING_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Overall Residual Risk Rating from database server either by AllActive/All/ByID.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllOverallResidualRiskRating(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution started.');

            const result = await OverallResidualRiskRatingDbObject.getAllOverallResidualRiskRating(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            
            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            //if proc failed

            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));  
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallResidualRiskRatingBl : getAllOverallResidualRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Active Overall Residual Risk Rating from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getAllActiveOverallResidualRiskRating(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution started.');

            const result = await OverallResidualRiskRatingDbObject.getAllActiveOverallResidualRiskRating(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallResidualRiskRatingBl : getAllActiveOverallResidualRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Overall Residual Risk Rating from database server By ID
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getOverallResidualRiskRatingByID(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution started.');

            const result = await OverallResidualRiskRatingDbObject.getOverallResidualRiskRatingByID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallResidualRiskRatingBl : getOverallResidualRiskRatingByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will add Overall Residual Risk Rating to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addOverallResidualRiskRating(request, response){
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

            binds.overallInherentRiskRatingID = request.body.overallInherentRiskRatingID || 0;
  	        binds.overallControlEnvironmentRatingID = request.body.overallControlEnvironmentRatingID || 0;
            binds.residualRiskID = request.body.residualRiskID || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(request.body.overallInherentRiskRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.overallInherentRiskRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Overall Inherent Risk Rating ID');
            }

            if(request.body.overallControlEnvironmentRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.overallControlEnvironmentRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Overall Control Environment Rating ID');
            }

            if(request.body.residualRiskID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.residualRiskID ==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Residual Rating ID');
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : AddOverallResidualRiskRating : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, "Required parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : AddOverallResidualRiskRating : Execution started.');

            const result = await OverallResidualRiskRatingDbObject.addOverallResidualRiskRating(binds);           
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : addOverallResidualRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : addOverallResidualRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : addOverallResidualRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : addOverallResidualRiskRating : Execution end. : Data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallResidualRiskRatingBl : addOverallResidualRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Overall Residual Risk Rating to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateOverallResidualRiskRating(request, response){
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
            binds.overallInherentRiskRatingID = request.body.overallInherentRiskRatingID || 0;
            binds.overallControlEnvironmentRatingID = request.body.overallControlEnvironmentRatingID || 0;
            binds.residualRiskID = request.body.residualRiskID || 0;
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.accountGUIDFromToken = accountGUIDFromToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(request.body.overallInherentRiskRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.overallInherentRiskRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Overall Inherent Risk Rating ID');
            }

            if(request.body.overallControlEnvironmentRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.overallControlEnvironmentRatingID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Overall Control Environment Rating ID');
            }

            if(request.body.residualRiskID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.residualRiskID ==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Residual Rating ID');
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : UpdateOverallResidualRiskRating : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, "Required parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : UpdateOverallResidualRiskRating : Execution started.');

            const result = await OverallResidualRiskRatingDbObject.updateOverallResidualRiskRating(binds);    

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRating : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRating : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRating : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRating : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update Overall Residual Risk Rating Status to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateOverallResidualRiskRatingStatus(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRatingStatus : Execution started.');

            const result = await OverallResidualRiskRatingDbObject.updateOverallResidualRiskRatingStatus(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRatingStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRatingStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRatingStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRatingStatus : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : OverallResidualRiskRatingBl : updateOverallResidualRiskRatingStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
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
function getOverallResidualRiskRatingBLClassInstance() {
    if (OverallResidualRiskRatingBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        OverallResidualRiskRatingBlClassInstance = new OverallResidualRiskRatingBl();
    }
    return OverallResidualRiskRatingBlClassInstance;
}

exports.getOverallResidualRiskRatingBLClassInstance = getOverallResidualRiskRatingBLClassInstance;