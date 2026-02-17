const MESSAGE_FILE_OBJ  = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ = require("../../../utility/constants/constant.js");
const APP_VALIDATOR     = require("../../../utility/app-validator.js");
const CRISIS_COMMS_DB   = require("../../../data-access/masters/crisis-comms-template-db.js");
const { logger }        = require("../../../utility/log-manager/log-manager.js");

var CrisisCommsBLClassInstance  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var crisisCommsDB               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class CrisisCommsBl {
  constructor() {
    crisisCommsDB       = new CRISIS_COMMS_DB();
    appValidatorObject  = new APP_VALIDATOR();
  }

  start() {}

  /** 
    * This function will fetch the crisis comms template master data from the dataBase 
    */
  async getCrisisCommsMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken      = request.body.accountGUIDFromToken;
    try {

      logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMaster : Execution started.');

      const GET_CRISIS_COMMS_MASTER_DB_RESPONSE = await crisisCommsDB.getCrisisCommsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_CRISIS_COMMS_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_CRISIS_COMMS_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMaster : Execution end. :  GET_CRISIS_COMMS_MASTER_DB_RESPONSE is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (GET_CRISIS_COMMS_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMaster : Execution end. : Error details :' + GET_CRISIS_COMMS_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (GET_CRISIS_COMMS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMaster : Execution end. : Error details : ' + GET_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      const FORMAT_GET_CRISIS_COMMS_MASTER = await getFormatCrisisCommsMaster(userIdFromToken,GET_CRISIS_COMMS_MASTER_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CRISIS_COMMS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CRISIS_COMMS_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMaster : Execution end. :  FORMAT_GET_CRISIS_COMMS_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
  
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_CRISIS_COMMS_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will fetch info for add/update crisis comms template master data from database
   */
  async getCrisisCommsMasterInfo(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken = request.body.accountGUIDFromToken;
    try {

        logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMasterInfo : Execution started.');

        const GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE = await crisisCommsDB.getCrisisCommsMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
       
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMasterInfo : Execution end. :  get crisis comms template master info db response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMasterInfo : Execution end. : Error details :' + GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE.errorMsg);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMasterInfo : Execution end. : Error details : ' + GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE.procedureMessage);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
 
        const FORMAT_GET_CRISIS_COMMS_MASTER_INFO = await getFormatCrisisCommsMasterInfo(userIdFromToken,GET_CRISIS_COMMS_MASTER_INFO_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CRISIS_COMMS_MASTER_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CRISIS_COMMS_MASTER_INFO) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMasterInfo : Execution end. :  FORMAT_GET_CRISIS_COMMS_MASTER_INFO response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_CRISIS_COMMS_MASTER_INFO));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getCrisisCommsMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will add crisis comms template master to the database
   */
  async addCrisisCommsMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let crisisCommsMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken = request.body.accountGUIDFromToken;
    try {
      crisisCommsMasterData     = request.body.data;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : crisisCommsMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : addCrisisCommsMaster : Execution started.');

      /**
       * Input Validation : Start
       */


      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailTemplateName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailTemplateName || appValidatorObject.isStringEmpty((crisisCommsMasterData.emailTemplateName).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : emailTemplateName is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TEMPLATE_NAME_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailTitle || appValidatorObject.isStringEmpty((crisisCommsMasterData.emailTitle).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : emailTitle is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TITLE_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailContent || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailContent || appValidatorObject.isStringEmpty((crisisCommsMasterData.emailContent).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : emailContent is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_CONTENT_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.actionLinkId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.actionLinkId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : actionLinkId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_LINK_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.criticalityId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.criticalityId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : criticalityId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CRITICALITY_ID_NULL_EMPTY));
      }

        /**
       * Input Validation : End
       */

      const ADD_CRISIS_COMMS_MASTER_DB_RESPONSE = await crisisCommsDB.addCrisisCommsMaster(userIdFromToken, userNameFromToken,crisisCommsMasterData, accountGUIDFromToken);
      
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_CRISIS_COMMS_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_CRISIS_COMMS_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : addCrisisCommsMaster : Execution end. :  add crisis comms master db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      if (ADD_CRISIS_COMMS_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : Error details :' + ADD_CRISIS_COMMS_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      if (ADD_CRISIS_COMMS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : Error details : ' + ADD_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }

      const FORMAT_GET_CRISIS_COMMS_MASTER = await getFormatCrisisCommsMaster(userIdFromToken,ADD_CRISIS_COMMS_MASTER_DB_RESPONSE, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CRISIS_COMMS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CRISIS_COMMS_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : addCrisisCommsMaster : Execution end. :  FORMAT_GET_CRISIS_COMMS_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_GET_CRISIS_COMMS_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : addCrisisCommsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }

    /**
     * This function will update particular crisis comms template master in the database
     */
    async updateCrisisCommsMaster(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let crisisCommsMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {
          crisisCommsMasterData     = request.body.data;

          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : crisisCommsMasterData is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
          }
          logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : updateCrisisCommsMaster : Execution started.');

          /**
           * Input Validation : Start
           */
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailTemplateID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailTemplateID) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : emailTemplateID is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ID_NULL_EMPTY));
          }
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailTemplateName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailTemplateName || appValidatorObject.isStringEmpty((crisisCommsMasterData.emailTemplateName).trim())) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : emailTemplateName is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TEMPLATE_NAME_NULL_EMPTY));
          }
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailTitle || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailTitle || appValidatorObject.isStringEmpty((crisisCommsMasterData.emailTitle).trim())) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : emailTitle is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TITLE_NULL_EMPTY));
          }
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailContent || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailContent || appValidatorObject.isStringEmpty((crisisCommsMasterData.emailContent).trim())) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : emailContent is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_CONTENT_NULL_EMPTY));
          }
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.actionLinkId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.actionLinkId) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : actionLinkId is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACTION_LINK_ID_NULL_EMPTY));
          }
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.criticalityId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.criticalityId) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : criticalityId is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CRITICALITY_ID_NULL_EMPTY));
          }

          /**
           * Input Validation : End
           */

          const UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE = await crisisCommsDB.updateCrisisCommsMaster(userIdFromToken, userNameFromToken,crisisCommsMasterData, accountGUIDFromToken);
      
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. :  update crisis comms master db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
          }
          if (UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : Error details :' + UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
          }
          if (UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : Error details : ' + UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
          }


          const FORMAT_GET_CRISIS_COMMS_MASTER = await getFormatCrisisCommsMaster(userIdFromToken,UPDATE_CRISIS_COMMS_MASTER_DB_RESPONSE, accountGUIDFromToken);

          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CRISIS_COMMS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CRISIS_COMMS_MASTER) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. :  FORMAT_GET_CRISIS_COMMS_MASTER response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
          }

          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_CRISIS_COMMS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : updateCrisisCommsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
   * This function will delete particular crisis comms template master in the database
   */
    async deleteCrisisCommsMaster(request, response) {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let crisisCommsMasterData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken = request.body.accountGUIDFromToken;
        try {
        
          crisisCommsMasterData     = request.body.data;

          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. : crisisCommsMasterData is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
          }
  
          logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : deleteCrisisCommsMaster : Execution started.');
  
          /**
          * Input Validation : Start
          */
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == crisisCommsMasterData.emailTemplateID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == crisisCommsMasterData.emailTemplateID) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. : emailTemplateID is undefined or null or empty.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_TEMPLATE_ID_NULL_EMPTY));
          }
  
          /**
           * Input Validation : End
           */
  
          const DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE = await crisisCommsDB.deleteCrisisCommsMaster(userIdFromToken, userNameFromToken,crisisCommsMasterData, accountGUIDFromToken);
          
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. :  delete crisis comms master db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
          }
          if (DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. : Error details :' + DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
          }
          if (DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. : Error details : ' + DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
          }
          

          const FORMAT_GET_CRISIS_COMMS_MASTER = await getFormatCrisisCommsMaster(userIdFromToken,DELETE_CRISIS_COMMS_MASTER_DB_RESPONSE, accountGUIDFromToken);
          if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_CRISIS_COMMS_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_CRISIS_COMMS_MASTER) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. :  FORMAT_GET_CRISIS_COMMS_MASTER response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
          }
  
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, FORMAT_GET_CRISIS_COMMS_MASTER));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : deleteCrisisCommsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
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

async function getFormatCrisisCommsMaster(userIdFromToken,getDBResponse, accountGUIDFromToken){
  try{
    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getFormatCrisisCommsMaster : Execution Started.');

    let crisisEmailTemplateDetails = [];
    crisisEmailTemplateDetails     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getFormatCrisisCommsMaster : Execution End.');

    return {
      "CrisisEmailTemplateList" : crisisEmailTemplateDetails
    }
  }catch(error){
      logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getFormatCrisisCommsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
  }
}


async function getFormatCrisisCommsMasterInfo(userIdFromToken,getDBResponse, accountGUIDFromToken){
  try{
    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getFormatCrisisCommsMasterInfo : Execution Started.');

    let actionLinksMasterList     = [];
    let criticalityMasterList     = [];
    let referenceVariableList     = [];

    actionLinksMasterList   = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
    criticalityMasterList   = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
    referenceVariableList   = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
    
    logger.log('info', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getFormatCrisisCommsMasterInfo : Execution End.');

    return {
      "ActionLinksList"       : actionLinksMasterList,
      "CriticalityList"       : criticalityMasterList,
      "ReferenceVariableList" : referenceVariableList
    }
  }catch(error){
      logger.log('error', 'User Id : ' + userIdFromToken + ' : CrisisCommsBl : getFormatCrisisCommsMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
  }
}
   



/**
 * This is function will be used to return single instance of class.
 */
function getCrisisCommsBLClassInstance() {
  if (CrisisCommsBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    CrisisCommsBLClassInstance     = new CrisisCommsBl();
  }
  return CrisisCommsBLClassInstance;
}

exports.getCrisisCommsBLClassInstance = getCrisisCommsBLClassInstance;
