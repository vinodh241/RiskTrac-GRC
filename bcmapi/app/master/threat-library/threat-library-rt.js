
const THREAT_LIBRARY_BL         = require('./threat-library-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ThreatLibraryRT {
    constructor(app) {
        this.app = app;
        this.threatLibraryBlObject = THREAT_LIBRARY_BL.getThreatLibraryBLClassInstance();
        this.threatLibraryBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/master/threat-library/get-threat-master',         TOKEN_UPDATE_MIDDELWARE,this.threatLibraryBlObject.getThreatMaster);
        this.app.post('/business-continuity-management/master/threat-library/get-threat-master-info',    TOKEN_UPDATE_MIDDELWARE,this.threatLibraryBlObject.getThreatMasterInfo);
        this.app.post('/business-continuity-management/master/threat-library/add-threat-master',         TOKEN_UPDATE_MIDDELWARE,this.threatLibraryBlObject.addThreatMaster);
        this.app.post('/business-continuity-management/master/threat-library/update-threat-master',      TOKEN_UPDATE_MIDDELWARE,this.threatLibraryBlObject.updateThreatMaster);
        this.app.post('/business-continuity-management/master/threat-library/delete-threat-master',      TOKEN_UPDATE_MIDDELWARE,this.threatLibraryBlObject.deleteThreatMaster);
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
        thisInstance = new ThreatLibraryRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;