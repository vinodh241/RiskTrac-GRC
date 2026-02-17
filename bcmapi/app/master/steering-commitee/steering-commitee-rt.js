const STEERING_COMMITEE_Bl      = require('./steering-commitee-bl.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class SteeringCommiteeRT {
    constructor(app) {
        this.app = app;
        this.steeringCommiteeBlObject = STEERING_COMMITEE_Bl.getSteeringCommiteeBLClassInstance();
        this.steeringCommiteeBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {        
        this.app.post('/business-continuity-management/master/steering-commitee/get-steering-commitee-master',          TOKEN_UPDATE_MIDDELWARE,    this.steeringCommiteeBlObject.getSteeringCommiteeMaster);
        this.app.post('/business-continuity-management/master/steering-commitee/get-steering-commitee-master-info',     TOKEN_UPDATE_MIDDELWARE,    this.steeringCommiteeBlObject.getSteeringCommiteeMasterInfo); 
        this.app.post('/business-continuity-management/master/steering-commitee/add-steering-commitee-master',          TOKEN_UPDATE_MIDDELWARE,    this.steeringCommiteeBlObject.addSteeringCommiteeMaster);
       
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
        thisInstance = new SteeringCommiteeRT(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;