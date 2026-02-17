const MESSAGE_FILE_OBJ  = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ = require("../../../utility/constants/constant.js");
const THREAT_LIBRARY_DB = require("../../../data-access/masters/threat-library-db.js");
const APP_VALIDATOR     = require("../../../utility/app-validator.js");
const { logger }        = require("../../../utility/log-manager/log-manager.js");

var ThreatLibraryBLClassInstance    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var threatLibraryDB                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ThreatLibraryBl {
  constructor() {
    threatLibraryDB     = new THREAT_LIBRARY_DB();
    appValidatorObject  = new APP_VALIDATOR();
  }

  start() {}

   /**
    * This function will fetch threat master data from database
    */
   async getThreatMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

    try {
        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMaster : Execution started.');

        const GET_THREAT_MASTER_DB_RESPONSE = await threatLibraryDB.getThreatMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_THREAT_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_THREAT_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMaster : Execution end. :  get threat master response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_THREAT_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMaster : Execution end. : Error details :' + GET_THREAT_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_THREAT_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_THREAT_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMaster : Execution end. : Error details : ' + GET_THREAT_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        const FORMAT_GET_THREAT_MASTER = await getFormatThreatMaster(userIdFromToken,GET_THREAT_MASTER_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_THREAT_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_THREAT_MASTER) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMaster : Execution end. :  FORMAT_GET_THREAT_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_THREAT_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will fetch info data for add/update threat master data from database
   */
  async getThreatMasterInfo(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let threatMasterData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        threatMasterData          = request.body.data;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMasterInfo : Execution started.');
        /**
         * Input Validation : Start
         */

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.currentDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.currentDate) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : getThreatMasterInfo : Execution end. : currentDate is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CURRENT_DATE_NULL_EMPTY));
        }

        /**
         * Input Validation :End
         */

        const GET_THREAT_MASTER_INFO_DB_RESPONSE = await threatLibraryDB.getThreatMasterInfo(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken);
        
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_THREAT_MASTER_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_THREAT_MASTER_INFO_DB_RESPONSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMasterInfo : Execution end. :  RiskAppetite list db response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_THREAT_MASTER_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMasterInfo : Execution end. : Error details :' + GET_THREAT_MASTER_INFO_DB_RESPONSE.errorMsg);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_THREAT_MASTER_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_THREAT_MASTER_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMasterInfo : Execution end. : Error details : ' + GET_THREAT_MASTER_INFO_DB_RESPONSE.procedureMessage);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
       
        const FORMAT_GET_THREAT_MASTER_INFO = await getFormatThreatMasterInfo(userIdFromToken,GET_THREAT_MASTER_INFO_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_THREAT_MASTER_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_THREAT_MASTER_INFO) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMasterInfo : Execution end. :  FORMAT_GET_THREAT_MASTER_INFO response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_THREAT_MASTER_INFO));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getThreatMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
    * This function will add threat master data into database
    */
  async addThreatMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let threatMasterData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        threatMasterData          = request.body.data;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : addThreatMaster : Execution started.');

        /**
         * Input Validation : Start
         */

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskTitle || appValidatorObject.isStringEmpty((threatMasterData.riskTitle).trim())) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : addThreatMaster : Execution end. : riskTitle is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_TITLE_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskDescription || appValidatorObject.isStringEmpty((threatMasterData.riskDescription).trim())) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : addThreatMaster : Execution end. : riskDescription is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_DESCRIPTION_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.threatCategoryId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.threatCategoryId) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : addThreatMaster : Execution end. : threat CategoryID is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_CATEGORY_ID_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.impacts || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.impacts || (threatMasterData.impacts).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : addThreatMaster : Execution end. : impacts is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IMPACTS_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskOwnerId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskOwnerId) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : addThreatMaster : Execution end. : riskOwnerId is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_OWNER_ID_NULL_EMPTY));
        }
        if (threatMasterData.controls.length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.controlEffectivenessId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.controlEffectivenessId)) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : addThreatMaster : Execution end. : controlEffectivenessId is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CONTROL_EFFECTIVENESS_ID_NULL_EMPTY));
        }

        /**
         * Input Validation : End
        */

        const ADD_THREAT_MASTER_DB_RESPONSE = await threatLibraryDB.addThreatMaster(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken);
        
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_THREAT_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_THREAT_MASTER_DB_RESPONSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : addThreatMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (ADD_THREAT_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : addThreatMaster : Execution end. : Error details :' + ADD_THREAT_MASTER_DB_RESPONSE.errorMsg);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (ADD_THREAT_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_THREAT_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : addThreatMaster : Execution end. : Error details : ' + ADD_THREAT_MASTER_DB_RESPONSE.procedureMessage);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
       
        const FORMAT_GET_THREAT_MASTER = await getFormatThreatMaster(userIdFromToken,ADD_THREAT_MASTER_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_THREAT_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_THREAT_MASTER) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : addThreatMaster : Execution end. :  FORMAT_GET_THREAT_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
      
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_GET_THREAT_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : addThreatMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }

  /**
    * This function will update particular threat master data in database
    */
  async updateThreatMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let threatMasterData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken            = request.body.refreshedToken;
      userIdFromToken           = request.body.userIdFromToken;
      userNameFromToken         = request.body.userNameFromToken;
      threatMasterData          = request.body.data;
      accountGUIDFromToken      = request.body.accountGUIDFromToken;

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution started.');

      /**
      * Input Validation : Start
      */

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskId ) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : riskId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskTitle || appValidatorObject.isStringEmpty((threatMasterData.riskTitle).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : riskTitle is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_TITLE_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskDescription || appValidatorObject.isStringEmpty((threatMasterData.riskDescription).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : riskDescription is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_DESCRIPTION_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskCode || appValidatorObject.isStringEmpty((threatMasterData.riskCode).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : riskCode is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_CODE_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.threatCategoryId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.threatCategoryId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : threat CategoryID is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THREAT_CATEGORY_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.impacts || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.impacts || (threatMasterData.impacts).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : impacts is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IMPACTS_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.riskOwnerId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.riskOwnerId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : riskOwnerId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_OWNER_ID_NULL_EMPTY));
      }
      if (threatMasterData.controls.length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == threatMasterData.controlEffectivenessId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == threatMasterData.controlEffectivenessId)) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ThreatLibraryBl : updateThreatMaster : Execution end. : controlEffectivenessId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CONTROL_EFFECTIVENESS_ID_NULL_EMPTY));
      }

      /**
       * Input Validation : End
      */

      const UPDATE_THREAT_MASTER_DB_RESPONSE = await threatLibraryDB.updateThreatMaster(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_THREAT_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_THREAT_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution end. :  update threat master db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      if (UPDATE_THREAT_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution end. : Error details :' + UPDATE_THREAT_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      if (UPDATE_THREAT_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_THREAT_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution end. : Error details : ' + UPDATE_THREAT_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }

      const FORMAT_GET_THREAT_MASTER = await getFormatThreatMaster(userIdFromToken,UPDATE_THREAT_MASTER_DB_RESPONSE,accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_THREAT_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_THREAT_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution end. :  FORMAT_GET_THREAT_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
    
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_THREAT_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
    }
  }

   /**
    * This function will delete particular threat master data from database
    */
   async deleteThreatMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let threatMasterData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken            = request.body.refreshedToken;
      userIdFromToken           = request.body.userIdFromToken;
      userNameFromToken         = request.body.userNameFromToken;
      threatMasterData          = request.body.data;
      accountGUIDFromToken      = request.body.accountGUIDFromToken;

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : deleteThreatMaster : Execution started.');

      const DELETE_THREAT_MASTER_DB_RESPONSE = await threatLibraryDB.deleteThreatMaster(userIdFromToken, userNameFromToken,threatMasterData, accountGUIDFromToken);
      
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_THREAT_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_THREAT_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : deleteThreatMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
      }
      if (DELETE_THREAT_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : deleteThreatMaster : Execution end. : Error details :' + DELETE_THREAT_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
      }
      if (DELETE_THREAT_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_THREAT_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : deleteThreatMaster : Execution end. : Error details : ' + DELETE_THREAT_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
      }
      
      const FORMAT_GET_THREAT_MASTER = await getFormatThreatMaster(userIdFromToken,DELETE_THREAT_MASTER_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_THREAT_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_THREAT_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : updateThreatMaster : Execution end. :  FORMAT_GET_THREAT_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
      }

  
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, FORMAT_GET_THREAT_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : deleteThreatMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
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

  async function getFormatThreatMaster(userIdFromToken,getDBResponse, accountGUIDFromToken){
    try{
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getFormatThreatMaster : Execution Started.');
  
      let threatMasterList           = [];
      let assessmentLinkedThreatIds  = [];
      
      if(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
        for(let obj of Object.values(getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
          //Fetching all threatRiskID if it is linked to assessment with status Scheduled & Inprogress
          if([1,2].includes(obj.SiteRiskAssessmentStatusID)){
            assessmentLinkedThreatIds.push(obj.ThreatRiskID);
          }
        }
      }

      threatMasterList     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
   
      for(let threatObj of Object.values(threatMasterList)){
        threatObj['isThreatLinkedToAssessment'] = assessmentLinkedThreatIds.includes(threatObj.RiskID) ? CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getFormatThreatMaster : Execution End.');
  
      return {
        "ThreatMasterList" : threatMasterList
      }
    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getFormatThreatMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
     
    }
  }
  
  
  async function getFormatThreatMasterInfo(userIdFromToken, getDBResponse, accountGUIDFromToken){
    try{
      logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getFormatThreatMasterInfo : Execution Started.');
  
      let threatCategoryList        = [];
      let threatImpactList          = [];
      let riskOwnerList             = [];
      let riskCodeDetails           = [];
      let controlEffectivenessList  = [];
      let threatCount         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      let riskCode            = '';
      threatCategoryList      = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
      threatImpactList        = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
      riskOwnerList           = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
      riskCodeDetails         = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
      controlEffectivenessList= getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];

      // Manupulating the risk code in the format : 2024-Q1-01
      
      if(riskCodeDetails.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
        threatCount = String(Number(riskCodeDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ThreatsCount)+1)
        riskCode    = riskCodeDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Year + '-Q'+ riskCodeDetails[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Quater +'-'+ (threatCount.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ? '0' : '') + threatCount;
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getFormatThreatMasterInfo : Execution End.');
  
      return {
        "ThreatCategoryMaster"      : threatCategoryList,
        "ThreatImpactMaster"        : threatImpactList,
        "RiskOwnersList"            : riskOwnerList,
        "RiskCodeDetails"           : riskCode,
        "ControlEffectivenessList"  : controlEffectivenessList
      }
    }catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : ThreatLibraryBl : getFormatThreatMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
     
    }
  }

/**
 * This is function will be used to return single instance of class.
 */
function getThreatLibraryBLClassInstance() {
  if (ThreatLibraryBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    ThreatLibraryBLClassInstance = new ThreatLibraryBl();
  }
  return ThreatLibraryBLClassInstance;
}

exports.getThreatLibraryBLClassInstance = getThreatLibraryBLClassInstance;
