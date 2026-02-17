const MESSAGE_FILE_OBJ      = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ     = require("../../../utility/constants/constant.js");
const STEERING_COMMITEE_DB  = require("../../../data-access/masters/steering-commitee-db.js");
const { logger }            = require("../../../utility/log-manager/log-manager.js");

var SteeringCommiteeBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var steeringCommiteeDB                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class SteeringCommiteeBl {
  constructor() {
    steeringCommiteeDB     = new STEERING_COMMITEE_DB();
  }

  start() {}

  async getSteeringCommiteeMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {     

        refreshedToken        = request.body.refreshedToken;
        userIdFromToken       = request.body.userIdFromToken;
        userNameFromToken     = request.body.userNameFromToken;
        accountGUIDFromToken  = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution started.');

        const STEERING_COMMITEE_DB_RESPONSE = await steeringCommiteeDB.getSteeringCommiteeMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : STEERING_COMMITEE_DB_RESPONSE ' + JSON.stringify(STEERING_COMMITEE_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == STEERING_COMMITEE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == STEERING_COMMITEE_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (STEERING_COMMITEE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution end. : Error details :' + STEERING_COMMITEE_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (STEERING_COMMITEE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && STEERING_COMMITEE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution end. : Error details : ' + STEERING_COMMITEE_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (STEERING_COMMITEE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && STEERING_COMMITEE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && STEERING_COMMITEE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, STEERING_COMMITEE_DB_RESPONSE));
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution end.');

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, STEERING_COMMITEE_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  async getSteeringCommiteeMasterInfo(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {     

        refreshedToken        = request.body.refreshedToken;
        userIdFromToken       = request.body.userIdFromToken;
        userNameFromToken     = request.body.userNameFromToken;
        accountGUIDFromToken  = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution started.');

        const STEERING_COMMITEE_DB_RESPONSE = await steeringCommiteeDB.getSteeringCommiteeMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : STEERING_COMMITEE_DB_RESPONSE ' + JSON.stringify(STEERING_COMMITEE_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == STEERING_COMMITEE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == STEERING_COMMITEE_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (STEERING_COMMITEE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution end. : Error details :' + STEERING_COMMITEE_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (STEERING_COMMITEE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && STEERING_COMMITEE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution end. : Error details : ' + STEERING_COMMITEE_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (STEERING_COMMITEE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && STEERING_COMMITEE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && STEERING_COMMITEE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, STEERING_COMMITEE_DB_RESPONSE));
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution end.');

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, STEERING_COMMITEE_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : getSteeringCommiteeMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  async addSteeringCommiteeMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let data                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    try {     
        refreshedToken        = request.body.refreshedToken;
        userIdFromToken       = request.body.userIdFromToken;
        userNameFromToken     = request.body.userNameFromToken;
        accountGUIDFromToken  = request.body.accountGUIDFromToken;
        data                  = request.body.data;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : Execution started.');

        const STEERING_COMMITEE_DB_RESPONSE = await steeringCommiteeDB.addSteeringCommiteeMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken, data);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : STEERING_COMMITEE_DB_RESPONSE ' + JSON.stringify(STEERING_COMMITEE_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == STEERING_COMMITEE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == STEERING_COMMITEE_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (STEERING_COMMITEE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : Execution end. : Error details :' + STEERING_COMMITEE_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (STEERING_COMMITEE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && STEERING_COMMITEE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : Execution end. : Error details : ' + STEERING_COMMITEE_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : Execution end.');

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, STEERING_COMMITEE_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SteeringCommiteeBl : addSteeringCommiteeMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
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
function getSteeringCommiteeBLClassInstance() {
  if (SteeringCommiteeBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    SteeringCommiteeBLClassInstance = new SteeringCommiteeBl();
  }
  return SteeringCommiteeBLClassInstance;
}

exports.getSteeringCommiteeBLClassInstance = getSteeringCommiteeBLClassInstance;
