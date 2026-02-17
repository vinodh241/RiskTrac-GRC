const INCIDENTS_BL              = require('./incidents-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class IncidentsRT {
    constructor(app) {
        this.app = app;
        this.incidentsBlObject = INCIDENTS_BL.getIncidentsBLClassInstance();
        this.incidentsBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {

        this.app.post('/operational-risk-management/incidents/get-incident-master-data',            TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.getIncidentMasterData);
        this.app.post('/operational-risk-management/incidents/set-incident-master-data',            TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.setIncidentMasterData);
        this.app.post('/operational-risk-management/incidents/get-incidents',                       TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.getIncidents);
        this.app.post('/operational-risk-management/incidents/get-incident-info',                   TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.getIncidentInfo);
        this.app.post('/operational-risk-management/incidents/set-incident',                        TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.setIncident);
        this.app.post('/operational-risk-management/incidents/get-incident',                        TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.getIncidentDetails);
        this.app.post('/operational-risk-management/incidents/upload-incident-evidence',            TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.uploadIncidentEvidence);
        this.app.post('/operational-risk-management/incidents/download-incident-evidence',          TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.downloadIncidentEvidence);   
        this.app.post('/operational-risk-management/incidents/delete-incident-evidence',            TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.deleteIncidentEvidence);    
        this.app.post('/operational-risk-management/incidents/upload-rca-evidence',                 TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.uploadRcaEvidence);
        this.app.post('/operational-risk-management/incidents/download-rca-evidence',               TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.downloadRcaEvidence);
        this.app.post('/operational-risk-management/incidents/delete-rca-evidence',                 TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.deleteRcaEvidence);
        this.app.post('/operational-risk-management/incidents/upload-recommendation-evidence',      TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.uploadRecomendationEvidence);
        this.app.post('/operational-risk-management/incidents/download-recommendation-evidence',    TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.downloadRecomendationEvidence);
        this.app.post('/operational-risk-management/incidents/delete-recommendation-evidence',      TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.deleteRecomendationEvidence);
        this.app.post('/operational-risk-management/incidents/set-incident-status',                 TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.setIncidentStatus);
        this.app.post('/operational-risk-management/incidents/set-incident-review',                 TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.setIncidentReview);
        this.app.post('/operational-risk-management/incidents/set-recommendation-action',           TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.setRecommendationAction);
        this.app.post('/operational-risk-management/incidents/set-recommendation-status',           TOKEN_UPDATE_MIDDELWARE, this.incidentsBlObject.setRecommendationStatus);
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
        thisInstance = new IncidentsRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;