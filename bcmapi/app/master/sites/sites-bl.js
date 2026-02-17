const MESSAGE_FILE_OBJ  = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ = require("../../../utility/constants/constant.js");
const APP_VALIDATOR     = require("../../../utility/app-validator.js");
const SITES_DB          = require("../../../data-access/masters/sites-db.js");
const { logger }        = require("../../../utility/log-manager/log-manager.js");

var SiteBLClassInstance  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var siteDB               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class SitesBl {
  constructor() {
    siteDB = new SITES_DB();
    appValidatorObject = new APP_VALIDATOR();
  }

  start() {}

  /** 
   * This function will fetch the site master data from the dataBase 
  */
  async getSiteMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken      = request.body.accountGUIDFromToken;
    try {

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMaster : Execution started.');

        const GET_SITE_MASTER_DB_RESPONSE = await siteDB.getSiteMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SITE_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SITE_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMaster : Execution end. :  GET_SITE_MASTER_DB_RESPONSE is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_SITE_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMaster : Execution end. : Error details :' + GET_SITE_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_SITE_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMaster : Execution end. : Error details : ' + GET_SITE_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        const FORMAT_GET_SITE_MASTER = await getFormatSiteMaster(userIdFromToken,GET_SITE_MASTER_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_MASTER) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMaster : Execution end. :  FORMAT_GET_SITE_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_SITE_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will fetch info for add/update site master data from database
   */
  async getSiteMasterInfo(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken      = request.body.accountGUIDFromToken;
    try {

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMasterInfo : Execution started.');

        const GET_SITE_MASTER_INFO_DB_RESPONSE = await siteDB.getSiteMasterInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
       
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_SITE_MASTER_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_SITE_MASTER_INFO_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMasterInfo : Execution end. :  get site master info db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_SITE_MASTER_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMasterInfo : Execution end. : Error details :' + GET_SITE_MASTER_INFO_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_SITE_MASTER_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_SITE_MASTER_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMasterInfo : Execution end. : Error details : ' + GET_SITE_MASTER_INFO_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
 
        const FORMAT_GET_SITE_MASTER_INFO = await getFormatSiteMasterInfo(userIdFromToken,GET_SITE_MASTER_INFO_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_MASTER_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_MASTER_INFO) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMasterInfo : Execution end. :  FORMAT_GET_SITE_MASTER_INFO response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_SITE_MASTER_INFO));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getSiteMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will add site master to the database
   */
  async addSiteMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let siteMasterData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken = request.body.accountGUIDFromToken;

    try {
      siteMasterData        = request.body.data;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : siteMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : addSiteMaster : Execution started.');

      /**
       * Input Validation : Start
       */

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteName || appValidatorObject.isStringEmpty((siteMasterData.siteName).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : siteName is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_NAME_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteShortCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteShortCode || appValidatorObject.isStringEmpty((siteMasterData.siteShortCode).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : siteShortCode is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SHORT_CODE_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteAddress || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteAddress || appValidatorObject.isStringEmpty((siteMasterData.siteAddress).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : siteAddress is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ADDRESS_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.cityId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.cityId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : cityId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CITY_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.bcChampionGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.bcChampionGUID) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : bcChampionGUID is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_BCC_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteAdminId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteAdminId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : addSiteMaster : Execution end. : siteAdminId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADMIN_HEAD_ID_NULL_EMPTY));
      }

      /**
      * Input Validation : End
      */

      const ADD_SITE_MASTER_DB_RESPONSE = await siteDB.addSiteMaster(userIdFromToken, userNameFromToken,siteMasterData, accountGUIDFromToken);
      
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_SITE_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_SITE_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : addSiteMaster : Execution end. :  add site master db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      if (ADD_SITE_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : addSiteMaster : Execution end. : Error details :' + ADD_SITE_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      if (ADD_SITE_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_SITE_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : addSiteMaster : Execution end. : Error details : ' + ADD_SITE_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }

      const FORMAT_GET_SITE_MASTER = await getFormatSiteMaster(userIdFromToken,ADD_SITE_MASTER_DB_RESPONSE, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : addSiteMaster : Execution end. :  FORMAT_GET_SITE_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_GET_SITE_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : addSiteMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will update particular site master in the database
   */
  async updateSiteMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let siteMasterData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken = request.body.accountGUIDFromToken;

    try {
      siteMasterData        = request.body.data;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : siteMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : updateSiteMaster : Execution started.');

      /**
      * Input Validation : Start
      */
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : siteId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteName || appValidatorObject.isStringEmpty((siteMasterData.siteName).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : siteName is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_NAME_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteShortCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteShortCode || appValidatorObject.isStringEmpty((siteMasterData.siteShortCode).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : siteShortCode is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SHORT_CODE_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteAddress || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteAddress || appValidatorObject.isStringEmpty((siteMasterData.siteAddress).trim())) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : siteAddress is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ADDRESS_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.cityId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.cityId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : cityId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.CITY_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.bcChampionGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.bcChampionGUID) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : bcChampionGUID is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_BCC_ID_NULL_EMPTY));
      }
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteAdminId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteAdminId) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : updateSiteMaster : Execution end. : siteAdminId is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADMIN_HEAD_ID_NULL_EMPTY));
      }

      /**
       * Input Validation : End
       */

      const UPDATE_SITE_MASTER_DB_RESPONSE = await siteDB.updateSiteMaster(userIdFromToken, userNameFromToken,siteMasterData, accountGUIDFromToken);
      
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_SITE_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_SITE_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : updateSiteMaster : Execution end. :  update site master db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      if (UPDATE_SITE_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : updateSiteMaster : Execution end. : Error details :' + UPDATE_SITE_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      if (UPDATE_SITE_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_SITE_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : updateSiteMaster : Execution end. : Error details : ' + UPDATE_SITE_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }

      const FORMAT_GET_SITE_MASTER = await getFormatSiteMaster(userIdFromToken,UPDATE_SITE_MASTER_DB_RESPONSE, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : updateSiteMaster : Execution end. :  FORMAT_GET_SITE_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_GET_SITE_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : updateSiteMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will delete particular site master in the database
   */
  async deleteSiteMaster(request, response) {
    let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
    let siteMasterData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
    refreshedToken            = request.body.refreshedToken;
    userIdFromToken           = request.body.userIdFromToken;
    userNameFromToken         = request.body.userNameFromToken;
    accountGUIDFromToken = request.body.accountGUIDFromToken;
    try {

        siteMasterData            = request.body.data;

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : deleteSiteMaster : Execution end. : siteMasterData is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : deleteSiteMaster : Execution started.');

        /**
         * Input Validation : Start
        */
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == siteMasterData.siteId || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == siteMasterData.siteId) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : SitesBl : deleteSiteMaster : Execution end. : siteId is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SITE_ID_NULL_EMPTY));
        }

        /**
         * Input Validation : End
        */

        const DELETE_SITE_MASTER_DB_RESPONSE = await siteDB.deleteSiteMaster(userIdFromToken, userNameFromToken,siteMasterData, accountGUIDFromToken);
        
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_SITE_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_SITE_MASTER_DB_RESPONSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : deleteSiteMaster : Execution end. :  delete site master db response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
        if (DELETE_SITE_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : deleteSiteMaster : Execution end. : Error details :' + DELETE_SITE_MASTER_DB_RESPONSE.errorMsg);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
        if (DELETE_SITE_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_SITE_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : deleteSiteMaster : Execution end. : Error details : ' + DELETE_SITE_MASTER_DB_RESPONSE.procedureMessage);
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
        

        const FORMAT_GET_SITE_MASTER = await getFormatSiteMaster(userIdFromToken,DELETE_SITE_MASTER_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_SITE_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_SITE_MASTER) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : deleteSiteMaster : Execution end. :  FORMAT_GET_SITE_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, FORMAT_GET_SITE_MASTER));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : deleteSiteMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
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

async function getFormatSiteMaster(userIdFromToken,getDBResponse, accountGUIDFromToken){
  try{
    logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : getFormatSiteMaster : Execution Started.');

    let siteMasterDetails = [];
    siteMasterDetails     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] &&  getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

    logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : getFormatSiteMaster : Execution End.');

    return {
      "SiteMasterDetails" : siteMasterDetails
    }
  }catch(error){
      logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getFormatSiteMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
  }
}


async function getFormatSiteMasterInfo(userIdFromToken,getDBResponse, accountGUIDFromToken){
  try{
    logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : getFormatSiteMasterInfo : Execution Started.');

    let countryList     = [];
    let stateList       = [];
    let cityList        = [];
    let bcChampionList  = [];
    let adminHeadList   = [];
    countryList     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
    stateList       = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
    cityList        = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
    bcChampionList  = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
    adminHeadList   = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];

    //Sorting country list
    const SORTED_COUNTRY_LIST = countryList.sort((a, b) => {
      return a.Country.localeCompare(b.Country);
    });

    //Sorting state list
    const SORTED_STATE_LIST = stateList.sort((a, b) => {
      return a.State.localeCompare(b.State);
    });

    //Sorting city list
    const SORTED_CITY_LIST = cityList.sort((a, b) => {
      return a.City.localeCompare(b.City);
    });
    
    logger.log('info', 'User Id : ' + userIdFromToken + ' : SitesBl : getFormatSiteMasterInfo : Execution End.');

    return {
      "CityList"        : SORTED_CITY_LIST,
      "StateList"       : SORTED_STATE_LIST,
      "CountryList"     : SORTED_COUNTRY_LIST,
      "BCChampionList"  : bcChampionList,
      "SiteAdminList"   : adminHeadList,
    }
  }catch(error){
      logger.log('error', 'User Id : ' + userIdFromToken + ' : SitesBl : getFormatSiteMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   
  }
}
   



/**
 * This is function will be used to return single instance of class.
 */
function getSiteBLClassInstance() {
  if (SiteBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    SiteBLClassInstance     = new SitesBl();
  }
  return SiteBLClassInstance;
}

exports.getSiteBLClassInstance = getSiteBLClassInstance;
