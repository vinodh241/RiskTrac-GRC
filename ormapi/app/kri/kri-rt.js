const KRI_BL                    = require('./kri-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class KriRT {
    constructor(app) {
        this.app = app;
        this.kriBlObject = KRI_BL.getKriBLClassInstance();
        this.kriBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/operational-risk-management/kri/get-kri-master-data',               TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKriMasterData);
        this.app.post('/operational-risk-management/kri/set-kri-master-data',               TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.setKriMasterData);
        this.app.post('/operational-risk-management/kri/get-kri-info',                      TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKriInfo);
        this.app.post('/operational-risk-management/kri/get-kri-definitions',               TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKri);
        this.app.post('/operational-risk-management/kri/set-kri-definition',                TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.setKri);
        this.app.post('/operational-risk-management/kri/delete-kri-definition',             TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.deleteKri);
        this.app.post('/operational-risk-management/kri/get-kri-metrics-scoring',           TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKriMetricsScoring);
        this.app.post('/operational-risk-management/kri/set-kri-metrics-scoring',           TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.setKriMetricScoring);
        this.app.post('/operational-risk-management/kri/set-kri-metrics-report',            TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.setKriMetricsReport);
        this.app.post('/operational-risk-management/kri/get-kri-report',                    TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKriReport);
        this.app.post('/operational-risk-management/kri/get-kri-historical-scoring',        TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKriHistoricalScoring);
        this.app.post('/operational-risk-management/kri/get-kri-historical-report',         TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKriHistoricalReport);
        this.app.post('/operational-risk-management/kri/upload-KriScoring-evidence',        TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.uploadKriScoringEvidence);
        this.app.post('/operational-risk-management/kri/delete-KriScoring-evidence',        TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.deleteKriScoringEvidence);  
        this.app.post('/operational-risk-management/kri/download-KriScoring-evidence',      TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.downloadKriScoringEvidence);
        this.app.post('/operational-risk-management/kri/add-kri-master',                    TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.addkrimaster);                   
        this.app.post('/operational-risk-management/kri/send-bulk-email-reminder',          TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.sendEmailReminder);  
        this.app.post('/operational-risk-management/kri/send-metric-kri-reminder',          TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.sendKRIReminder);  
        this.app.post('/operational-risk-management/kri/save-review-reported-kri-data',     TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.reviewReportedKRIData);              
        this.app.post('/operational-risk-management/kri/submit-kri-review',                 TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.submitKRIReview); 
        this.app.post('/operational-risk-management/kri/get-kri-reported-data',             TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.getKRIReportedData);     
        this.app.post('/operational-risk-management/kri/bulk-upload-kri-metrics',           TOKEN_UPDATE_MIDDELWARE, this.kriBlObject.bulkUploadKRIMetrics);           
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
        thisInstance = new KriRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;