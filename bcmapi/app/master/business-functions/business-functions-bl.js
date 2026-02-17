const MESSAGE_FILE_OBJ          = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ         = require("../../../utility/constants/constant.js");
const BUSINESS_FUNCTIONS_DB     = require("../../../data-access/masters/business-functions-db.js");
const { logger }                = require("../../../utility/log-manager/log-manager.js");

var BusinessFunctionsBLClassInstance    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var BusinessFunctionsdb                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class BusinessFunctionsBl {
  constructor() {
    BusinessFunctionsdb = new BUSINESS_FUNCTIONS_DB();
  }

  start() {}

  // This function fetches business functions for listing page
  async getBusinessFunctionsMaster(request, response) {
    try {
        var refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken;
        accountGUIDFromToken      = request.body.accountGUIDFromToken;
     

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution started.');

        const BUSINESS_FUNCTIONS_DB_RESPONSE = await BusinessFunctionsdb.getBusinessFunctionsMaster(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : BUSINESS_FUNCTIONS_DB_RESPONSE ' + JSON.stringify(BUSINESS_FUNCTIONS_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == BUSINESS_FUNCTIONS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == BUSINESS_FUNCTIONS_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (BUSINESS_FUNCTIONS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : Error details :' + BUSINESS_FUNCTIONS_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (BUSINESS_FUNCTIONS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_FUNCTIONS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : Error details : ' + BUSINESS_FUNCTIONS_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (BUSINESS_FUNCTIONS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && BUSINESS_FUNCTIONS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && BUSINESS_FUNCTIONS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, BUSINESS_FUNCTIONS_DB_RESPONSE));
        }

        const FORMAT_BUSINESS_FUNCTIONS = await formatBusinessFunctionsMaster(userIdFromToken,BUSINESS_FUNCTIONS_DB_RESPONSE, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : FORMAT_BUSINESS_FUNCTIONS ' + JSON.stringify(FORMAT_BUSINESS_FUNCTIONS || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_BUSINESS_FUNCTIONS || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_BUSINESS_FUNCTIONS) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. :  FORMAT_BUSINESS_FUNCTIONS response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        const GET_GROUP_INFO_DB_RESPONSE = await BusinessFunctionsdb.getGroupInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : GET_GROUP_INFO_DB_RESPONSE ' + JSON.stringify(GET_GROUP_INFO_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_GROUP_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_GROUP_INFO_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_GROUP_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : Error details :' + GET_GROUP_INFO_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_GROUP_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_GROUP_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : Error details : ' + GET_GROUP_INFO_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (GET_GROUP_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_GROUP_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_GROUP_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_GROUP_INFO_DB_RESPONSE));
        }      
        const FORMAT_GROUP_INFO = await formatGetGroupInfo(userIdFromToken,GET_GROUP_INFO_DB_RESPONSE, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : FORMAT_GROUP_INFO ' + JSON.stringify(FORMAT_GROUP_INFO || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GROUP_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GROUP_INFO) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. :  FORMAT_GROUP_INFO response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

       const MERGRE_RESP = {...FORMAT_GROUP_INFO, ...FORMAT_BUSINESS_FUNCTIONS}

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : MERGRE_RESP ' + JSON.stringify(MERGRE_RESP || null));

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, MERGRE_RESP));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  // This function creates a new Business Function in the master record
  async addBusinessFunctionsMaster(request, response) {
    try {
        let refreshedToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let businessFunctionsMaster   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var accountGUIDFromToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken                = request.body.refreshedToken;
        userIdFromToken               = request.body.userIdFromToken;
        userNameFromToken             = request.body.userNameFromToken;
        businessFunctionsMaster       = request.body.data;
        accountGUIDFromToken          = request.body.accountGUIDFromToken;

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : addBusinessFunctionsMaster : Execution started.');

        const ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE = await BusinessFunctionsdb.addBusinessFunctionsMaster(userIdFromToken, userNameFromToken,businessFunctionsMaster, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : addBusinessFunctionsMaster : ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE ' + JSON.stringify(ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : addBusinessFunctionsMaster : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : addBusinessFunctionsMaster : Execution end. : Error details :' + ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        if (ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : addBusinessFunctionsMaster : Execution end. : Error details : ' + ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
        
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, ADD_BUSINESS_FUNCTIONS_MASTER_DB_RESPONSE));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : addBusinessFunctionsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
    }
  }  

  // This function fetches info details for creating new Business Function
  async getBusinessFunctionMasterInfo(request, response) {
    try {
        var refreshedToken        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 

        refreshedToken            = request.body.refreshedToken;
        userIdFromToken           = request.body.userIdFromToken;
        userNameFromToken         = request.body.userNameFromToken; 
        accountGUIDFromToken = request.body.accountGUIDFromToken;    

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution started.');        

        const GET_GROUP_INFO_DB_RESPONSE = await BusinessFunctionsdb.getGroupInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : GET_GROUP_INFO_DB_RESPONSE ' + JSON.stringify(GET_GROUP_INFO_DB_RESPONSE || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_GROUP_INFO_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_GROUP_INFO_DB_RESPONSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution end. :  RiskAppetite list db response is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_GROUP_INFO_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution end. : Error details :' + GET_GROUP_INFO_DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        if (GET_GROUP_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_GROUP_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution end. : Error details : ' + GET_GROUP_INFO_DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
        // No Record found in database.
        if (GET_GROUP_INFO_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_GROUP_INFO_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_GROUP_INFO_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution end. : No Record in data base');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, GET_GROUP_INFO_DB_RESPONSE));
        }      
        const FORMAT_GROUP_INFO = await formatGetGroupInfo(userIdFromToken,GET_GROUP_INFO_DB_RESPONSE, accountGUIDFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : FORMAT_GROUP_INFO ' + JSON.stringify(FORMAT_GROUP_INFO || null));

        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GROUP_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GROUP_INFO) {
          logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution end. :  FORMAT_GROUP_INFO response is undefined or null.');
          return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

        logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : MERGRE_RESP ' + JSON.stringify(FORMAT_GROUP_INFO || null));

        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GROUP_INFO));
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : getBusinessFunctionMasterInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
    }
  }

  stop() {}
}

async function formatBusinessFunctionsMaster(userIdFromToken,MasterData, accountGUIDFromToken){
  try {
    logger.log('info', 'User Id : '+ userIdFromToken +' : BusinessFunctionsBl : formatBusinessFunctionsMaster : Execution started. :: MasterData : '+ JSON.stringify(MasterData || null));
    
    let businessFunctionList  = [];    

    if (MasterData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
      for (const obj of Object.values(MasterData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])) {
        const sites         = JSON.parse(obj.Sites);
        const SiteNameCSV   = [];
        let siteList        = [];

        if (sites != null && sites != undefined && sites != []) {
          siteList      = sites.map(ob => {
            return {
                "SiteID"    : ob.SiteID,
                "SiteName"  : ob.SS[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SiteName 
            };
          });                
          siteList.forEach(m => { SiteNameCSV.push(m.SiteName); });
        } else {
          siteList = []
        }       

        businessFunctionList.push({
          "ShortCode"             : obj.BusinessFunctionShortCode,
          "Name"                  : obj.BusinessFunctionName,
          "BusinessFunctionID"    : Number(obj.BusinessFunctionID),
          "UnitID"                : Number(obj.UnitID),
          "BusinessGroup"         : obj.BusinessFunctionGroupName,
          "FBCC_Name"             : obj.BusinessFunctionFBCCIDName,
          "HeadCount"             : obj.HeadCount,
          "BusinessGroupID"       : obj.BusinessFunctionGroupID,
          "IsActive"              : obj.IsActive,
          "FBCC_ID"               : obj.BusinessFunctionFBCCID,
          "SiteNameCSV"           : SiteNameCSV.join(', '),          
          "SiteList"              : siteList
        });
      }
    }

    let respData = {
        "businessFunctionList"  : businessFunctionList,
    }
    logger.log('info', 'User Id : '+ userIdFromToken +' :  BusinessFunctionsBl : formatBusinessFunctionsMaster : Execution end. :: respData : '+ JSON.stringify(respData || null));
  
    return respData;
  } catch (error) {
      logger.log('error', 'User Id : '+ userIdFromToken +' :  BusinessFunctionsBl : formatBusinessFunctionsMaster : Execution end. : Got unhandled error. : Error Detail : ' + error);
      return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
  }
}

async function formatGetGroupInfo (userIdFromToken,groupInfo, accountGUIDFromToken) {
  try{
    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : groupInfo : Execution Started.');

    let groupInfoList = [];
    let FBCCList      = [];
    let siteList      = [];
    let unitInfoList  = []
    groupInfoList     = groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]  &&  groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length   ? groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]  : [];
    FBCCList          = groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]   &&  groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length    ? groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]   : [];
    unitInfoList      = groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] &&  groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length  ? groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];

    if (groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
      for(const obj of Object.values(groupInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])) {
        siteList.push({
              "SiteID"          : Number(obj.SiteID),
              "SiteName"        : obj.SiteName, 
          });   
      }
    }

    let uniqueSite = Array.from(new Set(siteList.map(ob => ob.SiteID))).map(SiteID => siteList.find(ob => ob.SiteID === SiteID));
    logger.log('info', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : groupInfo : Execution End.');

    return {
      "groupInfo" : groupInfoList,
      "FBCCList"  : FBCCList,
      "siteList"  : uniqueSite,
      "unitInfo"  : unitInfoList
    }
  } catch(error){
      logger.log('error', 'User Id : ' + userIdFromToken + ' : BusinessFunctionsBl : groupInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
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
function getBusinessFunctionsBLClassInstance() {
  if (BusinessFunctionsBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
    BusinessFunctionsBLClassInstance = new BusinessFunctionsBl();
  }
  return BusinessFunctionsBLClassInstance;
}

exports.getBusinessFunctionsBLClassInstance = getBusinessFunctionsBLClassInstance;
