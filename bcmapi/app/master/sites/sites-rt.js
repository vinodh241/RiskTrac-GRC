
const SITE_BL                   = require('./sites-bl');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class SiteRT {
    constructor(app) {
        this.app = app;
        this.siteBlObject = SITE_BL.getSiteBLClassInstance();
        this.siteBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/master/sites/get-site-master',         TOKEN_UPDATE_MIDDELWARE,this.siteBlObject.getSiteMaster);
        this.app.post('/business-continuity-management/master/sites/get-site-master-info',    TOKEN_UPDATE_MIDDELWARE,this.siteBlObject.getSiteMasterInfo);
        this.app.post('/business-continuity-management/master/sites/add-site-master',         TOKEN_UPDATE_MIDDELWARE,this.siteBlObject.addSiteMaster);
        this.app.post('/business-continuity-management/master/sites/update-site-master',      TOKEN_UPDATE_MIDDELWARE,this.siteBlObject.updateSiteMaster);
        this.app.post('/business-continuity-management/master/sites/delete-site-master',      TOKEN_UPDATE_MIDDELWARE,this.siteBlObject.deleteSiteMaster);
    }

    /**
     * This function will be used to stop service of controller in case any.
     */
    stop() {

    }
}

/**
 * This is function will be used to return single instance of class.
 * @param {*} app 
 */
function getInstance(app) {
    if (thisInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        thisInstance = new SiteRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;