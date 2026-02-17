const dynamicMasterManagement   = require('./dynamic-master-bl.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = null;

class MemberController {
    constructor(app) {
        this.app = app;
        this.dynamicMasterManagementObject = dynamicMasterManagement.getDynamicMasterManagementClassInstance();
        this.dynamicMasterManagementObject.start();
    }

    start() {
        this.app.post('/bcm/dynamic-master/addWebPageConfiguration',        TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.addWebPageConfiguration);
        this.app.post('/bcm/dynamic-master/getWebPageConfiguration',        TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.getWebPageConfiguration);  
        this.app.post('/bcm/dynamic-master/execProcedure',                  TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.execProcedure); 
        this.app.post('/bcm/dynamic-master/addData',                        TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.addData);
        this.app.post('/bcm/dynamic-master/getInfoMasterFields',            TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.getInfoMasterFields); 
        this.app.post('/bcm/dynamic-master/addWebPageControlConfiguration', TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.addWebPageControlConfiguration);
        this.app.post('/bcm/dynamic-master/getWebPageControlConfiguration', TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.getWebPageControlConfiguration);
        this.app.post('/bcm/dynamic-master/getPageDetails',                 TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.getPageDetails);       
        this.app.post('/bcm/dynamic-master/editData',                       TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.editData);
        this.app.post('/bcm/dynamic-master/getEditControlInfo',             TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.getEditControlInfo);  
        this.app.post('/bcm/dynamic-master/editRecordStatus',               TOKEN_UPDATE_MIDDELWARE,    this.dynamicMasterManagementObject.editRecordStatus);
        this.app.post('/bcm/dynamic-master/getUpdatedToken',                    this.dynamicMasterManagementObject.getUpdatedToken); 
        
        // this.app.post('/bcm/dynamic-master/getIsDisableData',                   this.dynamicMasterManagementObject.getIsDisableData);      
        
        
    }

    stop() {
        // Add any necessary cleanup logic here
    }
}

function getInstance(app) {
    if (thisInstance === null) {
        thisInstance = new MemberController(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;
