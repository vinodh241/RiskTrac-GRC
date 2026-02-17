const MESSAGE_FILE_OBJ      = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ     = require("../../../utility/constants/constant.js");
const VENDOR_DB             = require("../../../data-access/masters/vendors-db.js");
const { logger }            = require("../../../utility/log-manager/log-manager.js");
const APP_VALIDATOR         = require("../../../utility/app-validator.js");

var VendorBLClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var vendorDB                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class VendorBl {
  constructor() {
    vendorDB = new VENDOR_DB();
    appValidatorObject  =  new APP_VALIDATOR();
  }

  start() {}

  // This function will fetch all the vendors master list
  async getVendorDetails(request, response) {
    try {
        var refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution started.');

        const VENDOR_DB_RESPONSE = await vendorDB.getVendorDetails(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : VENDOR_DB_RESPONSE ' + JSON.stringify(VENDOR_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == VENDOR_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == VENDOR_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (VENDOR_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : Error details :' + VENDOR_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (VENDOR_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && VENDOR_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : Error details : ' + VENDOR_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (VENDOR_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && VENDOR_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && VENDOR_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, VENDOR_DB_RESPONSE));
        }

        const FORMAT_VENDOR_MASTER = await formatVendorDetails(userIdFromToken,VENDOR_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_VENDOR_MASTER || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_VENDOR_MASTER) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : : Execution end. :  FORMAT_VENDOR_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        const APPLICATION_SUPPORT_DB_RESPONSE = await vendorDB.getApplicationSupportDetails(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : APPLICATION_SUPPORT_DB_RESPONSE ' + JSON.stringify(APPLICATION_SUPPORT_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == APPLICATION_SUPPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == APPLICATION_SUPPORT_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (APPLICATION_SUPPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : Error details :' + APPLICATION_SUPPORT_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (APPLICATION_SUPPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && APPLICATION_SUPPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : Error details : ' + APPLICATION_SUPPORT_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (APPLICATION_SUPPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && APPLICATION_SUPPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && APPLICATION_SUPPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, APPLICATION_SUPPORT_DB_RESPONSE));
        }
        

        const APPLICATION_SUPPORT = await formatApplicationSupportList(userIdFromToken,APPLICATION_SUPPORT_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == APPLICATION_SUPPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == APPLICATION_SUPPORT) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : : Execution end. :  FORMAT_VENDOR_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        let MERGRE_RESP         = {...FORMAT_VENDOR_MASTER,...  APPLICATION_SUPPORT };
        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : MERGRE_RESP ' + JSON.stringify(MERGRE_RESP || null));

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, MERGRE_RESP));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getVendorDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  // This function will add a new Vendor master data to the database
  async addVendorMaster(request, response) {
    try {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let vendorMasterData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        vendorMasterData          = request.body.data;
        accountGUIDFromToken = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : addVendorMaster : Execution started.');

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == vendorMasterData.VendorName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == vendorMasterData.VendorName || appValidatorObject.isStringEmpty((vendorMasterData.VendorName).trim())) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : addVendorMaster : Execution end. : VendorName is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.VENDOR_NAME_ID_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == vendorMasterData.SupportTeams || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == vendorMasterData.SupportTeams || (vendorMasterData.SupportTeams).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : addVendorMaster : Execution end. : SupportTeams is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_TEAMS_ID_NULL_EMPTY));
        }

        const ADD_VENDOR_MASTER_DB_RESPONSE = await vendorDB.addVendorMaster(userIdFromToken, userNameFromToken,vendorMasterData, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : addVendorMaster : ADD_VENDOR_MASTER_DB_RESPONSE ' + JSON.stringify(ADD_VENDOR_MASTER_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_VENDOR_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_VENDOR_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : addVendorMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (ADD_VENDOR_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : addVendorMaster : Execution end. : Error details :' + ADD_VENDOR_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (ADD_VENDOR_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_VENDOR_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : addVendorMaster : Execution end. : Error details : ' + ADD_VENDOR_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, ADD_VENDOR_MASTER_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : addVendorMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }

  // This function will update Vendor master data into the database
  async updateVendorMaster(request, response) {
    try {
        let refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let vendorMasterData      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        vendorMasterData          = request.body.data;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : updateVendorMaster : Execution started.');

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == vendorMasterData.VendorID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == vendorMasterData.VendorID) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : updateVendorMaster : Execution end. : VendorID is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.VENDOR_ID_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == vendorMasterData.VendorName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == vendorMasterData.VendorName || appValidatorObject.isStringEmpty((vendorMasterData.VendorName).trim())) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : updateVendorMaster : Execution end. : VendorName is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.VENDOR_NAME_ID_NULL_EMPTY));
        }
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == vendorMasterData.SupportTeams || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == vendorMasterData.SupportTeams || (vendorMasterData.SupportTeams).length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ) {
          logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : updateVendorMaster : Execution end. : SupportTeams is undefined or null or empty.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUPPORT_TEAMS_ID_NULL_EMPTY));
        }

        const UPDATE_VENDOR_MASTER_DB_RESPONSE = await vendorDB.updateVendorMaster(userIdFromToken, userNameFromToken,vendorMasterData, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : updateVendorMaster : UPDATE_VENDOR_MASTER_DB_RESPONSE ' + JSON.stringify(UPDATE_VENDOR_MASTER_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == UPDATE_VENDOR_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == UPDATE_VENDOR_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : updateVendorMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (UPDATE_VENDOR_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : updateVendorMaster : Execution end. : Error details :' + UPDATE_VENDOR_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (UPDATE_VENDOR_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_VENDOR_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : updateVendorMaster : Execution end. : Error details : ' + UPDATE_VENDOR_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, UPDATE_VENDOR_MASTER_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : updateVendorMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }

  // This function will fetch the infor details for creating a new Vendor
  async getApplicationSupportDetails(request, response) {
    try {
        var refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : Execution started.');

        const APPLICATION_SUPPORT_DB_RESPONSE = await vendorDB.getApplicationSupportDetails(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : APPLICATION_SUPPORT_DB_RESPONSE ' + JSON.stringify(APPLICATION_SUPPORT_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == APPLICATION_SUPPORT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == APPLICATION_SUPPORT_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (APPLICATION_SUPPORT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : Execution end. : Error details :' + APPLICATION_SUPPORT_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (APPLICATION_SUPPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && APPLICATION_SUPPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : Execution end. : Error details : ' + APPLICATION_SUPPORT_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (APPLICATION_SUPPORT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && APPLICATION_SUPPORT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && APPLICATION_SUPPORT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, APPLICATION_SUPPORT_DB_RESPONSE));
        }       

        const APPLICATION_SUPPORT = await formatApplicationSupportList(userIdFromToken,APPLICATION_SUPPORT_DB_RESPONSE, accountGUIDFromToken);
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == APPLICATION_SUPPORT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == APPLICATION_SUPPORT) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : : Execution end. :  FORMAT_VENDOR_MASTER response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, APPLICATION_SUPPORT));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : VendorBl : getApplicationSupportDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  stop() {}
}


async function formatVendorDetails(userIdFromToken,masterData, accountGUIDFromToken) {
  try {
    logger.log('info', 'User Id : '+ userIdFromToken +' : VendorBl : formatVendorDetails : Execution started. :: masterData : '+ JSON.stringify(masterData || null));
    let vendorsServiceProvidersList = [];
   
    if (masterData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
      for(const item of Object.values(masterData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {        
        const applications      = JSON.parse(item.ApplicationSupports) || [];
        for(const appl of Object.values(applications)) {
          const ContactInfo     = appl.SPAS1[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
          const ServiceList     = {
            "Vendor_Id"                     : Number(item.VendorID),
            "Vendor_Name"                   : item.VendorName,
            "ApplicationID"                 : Number(appl.ApplicationID),
            "ApplicationName"               : appl.ApplicationName,
            "PrimaryContact"                : [{ "Name": ContactInfo.PrimaryContactFullName,   "MobNo": ContactInfo.PrimaryContactMobileNumber,   "OfficeNo": ContactInfo.PrimaryContactOfficePhone,   "EmailID": ContactInfo.PrimaryContactEmailID }],
            "AlternateContact"              : [{ "Name": ContactInfo.AlternateContactFullName, "MobNo": ContactInfo.AlternateContactMobileNumber, "OfficeNo": ContactInfo.AlternateContactOfficePhone, "EmailID": ContactInfo.AlternateContactEmailID }],
            "ContractTAT"                   : Number(ContactInfo.TATTime),
            "TATTimeUnit"                   : ContactInfo.TATTimeUnit == 1 ? 'Hours' : 'Days',      
            "TATTimeUnitID"                 : ContactInfo.TATTimeUnit,  
            "PrimaryContactFullName"        : ContactInfo.PrimaryContactFullName,
            "PrimaryContactMobileNumber"    : ContactInfo.PrimaryContactMobileNumber,
            "PrimaryContactOfficePhone"     : ContactInfo.PrimaryContactOfficePhone,
            "PrimaryContactEmailID"         : ContactInfo.PrimaryContactEmailID,
            "AlternateContactFullName"      : ContactInfo.AlternateContactFullName,
            "AlternateContactMobileNumber"  : ContactInfo.AlternateContactMobileNumber,
            "AlternateContactOfficePhone"   : ContactInfo.AlternateContactOfficePhone,
            "AlternateContactEmailID"       : ContactInfo.AlternateContactEmailID  
          };
          vendorsServiceProvidersList.push(ServiceList); 
        }          
      }
    }
     
    let respData = {
        "vendorsServiceProvidersList"   : vendorsServiceProvidersList,
    }
 
    logger.log('info', 'User Id : '+ userIdFromToken +' : VendorBl : formatVendorDetails : Execution end. :: respData : '+ JSON.stringify(respData || null));
     
    return respData;
  } catch (error) {
      logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : formatVendorDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
  }
}

async function formatApplicationSupportList(userIdFromToken,applicationSupport, accountGUIDFromToken) {
  try {
    logger.log('info', 'User Id : '+ userIdFromToken +' : VendorBl : formatVendorDetails : Execution started. :: applicationSupport : '+ JSON.stringify(applicationSupport || null));
    const ApplicationSupportList = [];
    if (applicationSupport.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
      applicationSupport.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].forEach(x => {
        ApplicationSupportList.push({"ApplicationID" : Number(x.ApplicationID), "ApplicationName" : x.ApplicationName})
      })
    } 
      
    let respData = {
        "ApplicationSupportList"   : ApplicationSupportList,
    }

    logger.log('info', 'User Id : '+ userIdFromToken +' : VendorBl : formatVendorDetails : Execution end. :: respData : '+ JSON.stringify(respData || null));
      
    return respData;
  } catch (error) {
      logger.log('error', 'User Id : '+ userIdFromToken +' : VendorBl : formatVendorDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
  }
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
   



/**
 * This is function will be used to return single instance of class.
 */
function getVendorBLClassInstance() {
  if (VendorBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    VendorBLClassInstance = new VendorBl();
  }
  return VendorBLClassInstance;
}

exports.getVendorBLClassInstance = getVendorBLClassInstance;
