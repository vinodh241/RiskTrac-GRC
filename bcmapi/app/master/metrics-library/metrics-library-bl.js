const MESSAGE_FILE_OBJ      = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ     = require("../../../utility/constants/constant.js");
const METRICS_LIBRARY_DB    = require("../../../data-access/masters/metrics-library-db.js");
const { logger }            = require("../../../utility/log-manager/log-manager.js");

var MetricsLibraryBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var metricsLibraryDB                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class MetricsLibraryBl {
  constructor() {
    metricsLibraryDB = new METRICS_LIBRARY_DB();
  }

  start() { }

  /**
   * This function will fetch metric library master data from database
   */
  async getMetricsMaster(request, response) {
    let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken        = request.body.refreshedToken;
      userIdFromToken       = request.body.userIdFromToken;
      userNameFromToken     = request.body.userNameFromToken;
      accountGUIDFromToken  = request.body.accountGUIDFromToken;

      logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution started.');

      const GET_METRICS_MASTER_DB_RESPONSE = await metricsLibraryDB.getMetricsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_METRICS_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_METRICS_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (GET_METRICS_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. : Error details :' + GET_METRICS_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (GET_METRICS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_METRICS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. : Error details : ' + GET_METRICS_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (GET_METRICS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_METRICS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_METRICS_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_METRICS_MASTER_DB_RESPONSE));
      }

      const FORMAT_GET_METRICS_LIBRARY_MASTER = await getFormatMetricsLibraryMaster(userIdFromToken, GET_METRICS_MASTER_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_METRICS_LIBRARY_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_METRICS_LIBRARY_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. :  FORMAT_GET_METRICS_LIBRARY_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_METRICS_LIBRARY_MASTER));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will fetch info data for add/update metric library master data from database
   */
  async getMetricsMasterInfo(request, response) {
    let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let metricMasterData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken        = request.body.refreshedToken;
      userIdFromToken       = request.body.userIdFromToken;
      userNameFromToken     = request.body.userNameFromToken;
      metricMasterData      = request.body;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. : metricMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution started.');

      /**
       * Input Validation : Start
       */

      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.currentDate || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.currentDate) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. : currentDate is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRICS_CURRENT_DATE_NULL_EMPTY));
      // }

      /**
       * Input Validation :End
       */


      const GET_METRICS_MASTER_INFO_DB_RESPONSE = await metricsLibraryDB.getMetricsMasterInfo(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_METRICS_MASTER_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_METRICS_MASTER_INFO_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (GET_METRICS_MASTER_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. : Error details :' + GET_METRICS_MASTER_INFO_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (GET_METRICS_MASTER_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_METRICS_MASTER_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. : Error details : ' + GET_METRICS_MASTER_INFO_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (GET_METRICS_MASTER_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_METRICS_MASTER_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_METRICS_MASTER_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_METRICS_MASTER_INFO_DB_RESPONSE));
      }

      const FORMAT_GET_METRICS_LIBRARY_MASTER_INFO = await getFormatMetricsLibraryMasterInfo(userIdFromToken, GET_METRICS_MASTER_INFO_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_METRICS_LIBRARY_MASTER_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_METRICS_LIBRARY_MASTER_INFO) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMaster : Execution end. :  FORMAT_GET_METRICS_LIBRARY_MASTER_INFO response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_METRICS_LIBRARY_MASTER_INFO));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getMetricsMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  /**
    * This function will add metric library master data into database
    */
  async addMetricMaster(request, response) {
    let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let metricMasterData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken        = request.body.refreshedToken;
      userIdFromToken       = request.body.userIdFromToken;
      userNameFromToken     = request.body.userNameFromToken;
      metricMasterData      = request.body.data;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. : metricMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution started.');

      /**
       * Input Validation : Start
       */

      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_Code || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_Code || appValidatorObject.isStringEmpty((metricMasterData.Metric_Code).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Metric_Code is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_CODE_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_Title || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_Title || appValidatorObject.isStringEmpty((metricMasterData.Metric_Title).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Metric_Title is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_TITLE_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_Description || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_Description || appValidatorObject.isStringEmpty((metricMasterData.Metric_Description).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Metric_Description is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_DESCRIPTION_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Target_Value || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Target_Value || appValidatorObject.isStringEmpty((metricMasterData.Target_Value).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Target_Value is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TARGET_VALUE_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Datapoint_Numerator || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Datapoint_Numerator || appValidatorObject.isStringEmpty((metricMasterData.Datapoint_Numerator).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Datapoint_Numerator is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_NUMERATOR_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Datapoint_Denominator || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Datapoint_Denominator || appValidatorObject.isStringEmpty((metricMasterData.Datapoint_Denominator).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Datapoint_Denominator is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_DENOMINATOR_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_TypeID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_TypeID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Metric_TypeID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_TYPE_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Target_Type_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Target_Type_ID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Target_Type_ID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TARGET_TYPE_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Threshold_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Threshold_ID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Threshold_ID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THRESHOLD_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Frequency_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Frequency_ID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Frequency_ID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FREQUENCY_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Framework_Controls || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Framework_Controls || (metricMasterData.Framework_Controls).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : addMetricMaster : Execution end. : Framework_Controls is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FRAMEWORK_CONTROLS_NULL_EMPTY));
      // }

      /**
     * Input Validation : End
     */

      const ADD_METRIC_MASTER_DB_RESPONSE = await metricsLibraryDB.addMetricMaster(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_METRIC_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_METRIC_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      if (ADD_METRIC_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. : Error details :' + ADD_METRIC_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      if (ADD_METRIC_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_METRIC_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. : Error details : ' + ADD_METRIC_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (ADD_METRIC_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_METRIC_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && ADD_METRIC_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, ADD_METRIC_MASTER_DB_RESPONSE));
      }

      const FORMAT_ADD_METRICS_LIBRARY_MASTER = await getFormatMetricsLibraryMaster(userIdFromToken, ADD_METRIC_MASTER_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_ADD_METRICS_LIBRARY_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_ADD_METRICS_LIBRARY_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. :  FORMAT_ADD_METRICS_LIBRARY_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, FORMAT_ADD_METRICS_LIBRARY_MASTER));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }

  /**
    * This function will update particular metric library master data in database
    */
  async updateMetricMaster(request, response) {
    let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let metricMasterData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken        = request.body.refreshedToken;
      userIdFromToken       = request.body.userIdFromToken;
      userNameFromToken     = request.body.userNameFromToken;
      metricMasterData      = request.body.data;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. : metricMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution started.');

      /**
       * Input Validation : Start
       */

      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_Code || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_Code || appValidatorObject.isStringEmpty((metricMasterData.Metric_Code).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Metric_Code is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_CODE_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_Title || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_Title || appValidatorObject.isStringEmpty((metricMasterData.Metric_Title).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Metric_Title is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_TITLE_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_Description || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_Description || appValidatorObject.isStringEmpty((metricMasterData.Metric_Description).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Metric_Description is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_DESCRIPTION_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Target_Value || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Target_Value || appValidatorObject.isStringEmpty((metricMasterData.Target_Value).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Target_Value is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TARGET_VALUE_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Datapoint_Numerator || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Datapoint_Numerator || appValidatorObject.isStringEmpty((metricMasterData.Datapoint_Numerator).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Datapoint_Numerator is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_NUMERATOR_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Datapoint_Denominator || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Datapoint_Denominator || appValidatorObject.isStringEmpty((metricMasterData.Datapoint_Denominator).trim())) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Datapoint_Denominator is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_DENOMINATOR_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.MetricID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.MetricID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : MetricID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Metric_TypeID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Metric_TypeID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Metric_TypeID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_TYPE_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Target_Type_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Target_Type_ID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Target_Type_ID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TARGET_TYPE_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Threshold_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Threshold_ID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Threshold_ID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.THRESHOLD_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Frequency_ID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Frequency_ID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Frequency_ID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FREQUENCY_ID_NULL_EMPTY));
      // }
      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.Framework_Controls || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.Framework_Controls || (metricMasterData.Framework_Controls).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : updateMetricMaster : Execution end. : Framework_Controls is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FRAMEWORK_CONTROLS_NULL_EMPTY));
      // }

      /**
     * Input Validation : End
     */

      const UPDATE_METRIC_MASTER_DB_RESPONSE = await metricsLibraryDB.updateMetricMaster(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_METRIC_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_METRIC_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      if (UPDATE_METRIC_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. : Error details :' + UPDATE_METRIC_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      if (UPDATE_METRIC_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_METRIC_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. : Error details : ' + UPDATE_METRIC_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (UPDATE_METRIC_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_METRIC_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && UPDATE_METRIC_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, UPDATE_METRIC_MASTER_DB_RESPONSE));
      }

      const FORMAT_UPDATE_METRICS_LIBRARY_MASTER = await getFormatMetricsLibraryMaster(userIdFromToken, UPDATE_METRIC_MASTER_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_UPDATE_METRICS_LIBRARY_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_UPDATE_METRICS_LIBRARY_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. :  FORMAT_UPDATE_METRICS_LIBRARY_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, FORMAT_UPDATE_METRICS_LIBRARY_MASTER));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : updateMetricMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
    }
  }

  /**
   * This function will delete particular metric library master data from database
   */
  async deleteMetricMaster(request, response) {
    let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let metricMasterData    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    try {
      refreshedToken        = request.body.refreshedToken;
      userIdFromToken       = request.body.userIdFromToken;
      userNameFromToken     = request.body.userNameFromToken;
      metricMasterData      = request.body.data;
      accountGUIDFromToken = request.body.accountGUIDFromToken;

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution end. : metricMasterData is undefined or null or empty.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
      }

      logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution started.');

      /**
       * Input validation : Start
       */

      // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == metricMasterData.MetricID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == metricMasterData.MetricID) {
      //     logger.log('error', 'User Id : '+ userIdFromToken +' : MetricsLibraryBl : deleteMetricMaster : Execution end. : MetricID is undefined or null or empty.');
      //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.METRIC_ID_NULL_EMPTY));
      // }

      /**
       * Input validation : End
       */

      const DELETE_METRIC_MASTER_DB_RESPONSE = await metricsLibraryDB.deleteMetricMaster(userIdFromToken, userNameFromToken, metricMasterData, accountGUIDFromToken);

      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_METRIC_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_METRIC_MASTER_DB_RESPONSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (DELETE_METRIC_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution end. : Error details :' + DELETE_METRIC_MASTER_DB_RESPONSE.errorMsg);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      if (DELETE_METRIC_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_METRIC_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution end. : Error details : ' + DELETE_METRIC_MASTER_DB_RESPONSE.procedureMessage);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }
      // No Record found in database.
      if (DELETE_METRIC_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_METRIC_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && DELETE_METRIC_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution end. : No Record in data base');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, DELETE_METRIC_MASTER_DB_RESPONSE));
      }

      const FORMAT_DELETE_METRICS_LIBRARY_MASTER = await getFormatMetricsLibraryMaster(userIdFromToken, DELETE_METRIC_MASTER_DB_RESPONSE, accountGUIDFromToken);
      if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DELETE_METRICS_LIBRARY_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DELETE_METRICS_LIBRARY_MASTER) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : addMetricMaster : Execution end. :  FORMAT_DELETE_METRICS_LIBRARY_MASTER response is undefined or null.');
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
      }

      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_DELETE_METRICS_LIBRARY_MASTER));
    } catch (error) {
      logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : deleteMetricMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }


  stop() { }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
  return {
    success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
    message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    token: refreshedToken,
    error: {
      errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMessage: errorMessage,
    },
  };
}

function successfulResponse(refreshedToken, successMessage, result) {
  return {
    success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
    message: successMessage,
    result: result,
    token: refreshedToken,
    error: {
      errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    },
  };
}

async function getFormatMetricsLibraryMaster(userIdFromToken, getDBResponse, accountGUIDFromToken) {
  try {
    logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getFormatMetricsLibraryMaster : Execution Started.');

    let metricsLibraryMasterList = [];

    metricsLibraryMasterList = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];

    // Result Set 1 - Metrics Library List along with related Framework Controls
    metricsLibraryMasterList = metricsLibraryMasterList.map((e) => {

      let { MetricsLibraryControls } = e;

      if (MetricsLibraryControls) {

        MetricsLibraryControls = JSON.parse(MetricsLibraryControls);
        MetricsLibraryControls = MetricsLibraryControls.map((val) => {

          let frameWork = val.FW[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
          let domain    = frameWork.NMD[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
          let control   = domain.NMC[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

          return {
            "FrameworkID"     : frameWork.FWID,
            "FrameworkName"   : frameWork.FrameworkName,
            "DomainID"        : domain.DomainID,
            "DomainName"      : domain.DomainName,
            "ControlID"       : control.ControlID,
            "ControlName"     : control.ControlName,
          }

        })
        // code for removing duplicate objects from the MetricsLibraryControls - *DO NOT REMOVE*
        let parsedMetricsLibraryControls = new Set(MetricsLibraryControls.map(JSON.stringify));
        let uniqueMetricsLibraryControls = Array.from(parsedMetricsLibraryControls, JSON.parse)

        return {
          ...e,
          "Linked_Framework_Controls": uniqueMetricsLibraryControls
        };
      } else {
        return {
          ...e,
          "Linked_Framework_Controls": []
        }
      }

    })

    logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getFormatMetricsLibraryMaster : Execution End.');

    return {
      "MetricsLibraryMasterList": metricsLibraryMasterList,
    }
  } catch (error) {
    logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getFormatMetricsLibraryMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
    return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

  }
}

async function getFormatMetricsLibraryMasterInfo(userIdFromToken, getDBResponse, accountGUIDFromToken) {
  try {
    logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getFormatMetricsLibraryMasterInfo : Execution Started.');

    let metricTypesList     = [];
    let metricOwnersList    = [];
    let targetTypeslist     = [];
    let thresholdsList      = [];
    let frequenciesList     = [];
    let newMetricCode       = [];
    let frameworks          = [];
    let domains             = [];
    let frameworkControls   = [];

    metricTypesList       = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
    targetTypeslist       = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
    thresholdsList        = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
    frequenciesList       = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
    metricOwnersList      = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
    newMetricCode         = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
    frameworks            = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
    domains               = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
    frameworkControls     = getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] && getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? getDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] : [];

    // modify the Domains list ids
    domains.forEach((item) => {
      item.DomainID = Number(item.DomainID);
    })

    // modify the FrameworkControls list ids
    frameworkControls.forEach((item) => {
      item.DomainID = Number(item.DomainID);
      item.ControlID = Number(item.ControlID);
    })

    logger.log('info', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getFormatMetricsLibraryMasterInfo : Execution End.');

    return {
      "MetricTypesList"   : metricTypesList,
      "MetricOwnersList"  : metricOwnersList,
      "TargetTypeslist"   : targetTypeslist,
      "ThresholdsList"    : thresholdsList,
      "FrequenciesList"   : frequenciesList,
      "NewMetricCode"     : newMetricCode,
      "Frameworks"        : frameworks,
      "Domains"           : domains,
      "FrameworkControls" : frameworkControls
    }
  } catch (error) {
    logger.log('error', 'User Id : ' + userIdFromToken + ' : MetricsLibraryBl : getFormatMetricsLibraryMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
    return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

  }
}


/**
 * This is function will be used to return single instance of class.
 */
function getMetricsLibraryBLClassInstance() {
  if (MetricsLibraryBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    MetricsLibraryBLClassInstance = new MetricsLibraryBl();
  }
  return MetricsLibraryBLClassInstance;
}

exports.getMetricsLibraryBLClassInstance = getMetricsLibraryBLClassInstance;
