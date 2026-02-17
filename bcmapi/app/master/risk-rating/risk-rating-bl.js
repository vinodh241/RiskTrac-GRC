const MESSAGE_FILE_OBJ      = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ     = require("../../../utility/constants/constant.js");
const RISK_RATING_DB        = require("../../../data-access/masters/risk-rating-db.js");
const { logger }            = require("../../../utility/log-manager/log-manager.js");

var RiskRatingBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskRatingDB                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class RiskRatingBl {
  constructor() {
    riskRatingDB     = new RISK_RATING_DB();
  }

  start() {}
  
  async getDataForOverallRiskRating(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    refreshedToken        = request.body.refreshedToken;
    userIdFromToken       = request.body.userIdFromToken;
    userNameFromToken     = request.body.userNameFromToken;
    accountGUIDFromToken  = request.body.accountGUIDFromToken;

    try {     

        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution started.');

        const RISK_RATING_DB_RESPONSE = await riskRatingDB.getDataForOverallRiskRating(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : RISK_RATING_DB_RESPONSE ' + JSON.stringify(RISK_RATING_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RISK_RATING_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RISK_RATING_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (RISK_RATING_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : Error details :' + RISK_RATING_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (RISK_RATING_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RISK_RATING_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : Error details : ' + RISK_RATING_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (RISK_RATING_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RISK_RATING_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, RISK_RATING_DB_RESPONSE));
        }

        //Formatting all the recordset            
        let resultResponse = {
          LikelihoodRatingData      : [],
          ImpactRatingData          : [], 
          ComputeRiskFormula        : [], 
          ComputeRiskRatingFormula  : [],
          ConfigRiskScores          : [],
          ConfigRiskRatingScores    : []
        }

        resultResponse.LikelihoodRatingData       = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] || [];
        resultResponse.ImpactRatingData           = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] || []; 
        resultResponse.ComputeRiskFormula         = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] || [];
        resultResponse.ComputeRiskRatingFormula   = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] || [];
        resultResponse.ConfigRiskScores           = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] || [];
        resultResponse.ConfigRiskRatingScores     = RISK_RATING_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] || [];
 
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, resultResponse));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : getDataForOverallRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  async manageOverallRiskRating(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let riskRatingData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    refreshedToken        = request.body.refreshedToken;
    userIdFromToken       = request.body.userIdFromToken;
    userNameFromToken     = request.body.userNameFromToken;
    accountGUIDFromToken  = request.body.accountGUIDFromToken;
    riskRatingData        = request.body.data;

    try {     

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == riskRatingData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == riskRatingData) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution end. : riskRatingData is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution started.');

      const RISK_RATING_DB_RESPONSE = await riskRatingDB.manageOverallRiskRating(userIdFromToken, userNameFromToken, accountGUIDFromToken, riskRatingData);
      logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : RISK_RATING_DB_RESPONSE ' + JSON.stringify(RISK_RATING_DB_RESPONSE || null));

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RISK_RATING_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RISK_RATING_DB_RESPONSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution end. :  RiskAppetite list db response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (RISK_RATING_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution end. : Error details :' + RISK_RATING_DB_RESPONSE.errorMsg);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (RISK_RATING_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RISK_RATING_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution end. : Error details : ' + RISK_RATING_DB_RESPONSE.procedureMessage);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution end.');

      RISK_RATING_DB_RESPONSE.recordset = []

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, RISK_RATING_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskRatingBl : manageOverallRiskRating : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  stop() {}
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
      success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      token   : refreshedToken,
      error: {
        errorCode     : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMessage  : errorMessage,
      },
    };
  }
  
function successfulResponse(refreshedToken, successMessage, result) {
  return {
    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
    message : successMessage,
    result  : result,
    token   : refreshedToken,
    error: {
      errorCode     : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    },
  };
}


/**
 * This is function will be used to return single instance of class.
 */
function getRiskRatingBLClassInstance() {
  if (RiskRatingBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    RiskRatingBLClassInstance = new RiskRatingBl();
  }
  return RiskRatingBLClassInstance;
}

exports.getRiskRatingBLClassInstance = getRiskRatingBLClassInstance;
