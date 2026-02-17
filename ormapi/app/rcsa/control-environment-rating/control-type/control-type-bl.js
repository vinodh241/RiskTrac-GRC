const VALIDATOR_OBJECT = require('validator');
const APP_VALIATOR = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ = require('../../../../utility/constants/constant.js');
const CONTROL_TYPE_DB = require('../../../../data-access/control-type-db.js');

let appValidatorObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let ControlTypeDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
let ControlTypeBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ControlTypeBl {
    constructor() {
        appValidatorObject = new APP_VALIATOR();
        ControlTypeDbObject = new CONTROL_TYPE_DB();
    }

    start() { }

    async getAllControlType(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken; userIdFromToken = request.body.userIdFromToken; userNameFromToken = request.body.userNameFromToken; accountGUIDFromToken = request.body.accountGUIDFromToken;
            binds.id = request.body.id || 0; binds.isActive = request.body.isActive || 0; binds.createdBy = userIdFromToken || ""; binds.userId = userIdFromToken; binds.userName = userNameFromToken; binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeBl : getAllControlType : Execution started.');
            const result = await ControlTypeDbObject.getAllControlType(binds, accountGUIDFromToken);

            if (!result) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : getAllControlType : result is undefined or null.'); return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL)); }
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : getAllControlType : Error : ' + result.errorMsg); return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL)); }
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : getAllControlType : Proc error : ' + result.procedureMessage); return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage)); }
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) { logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeBl : getAllControlType : No Record in DB'); return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result)); }

            result.recordset = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeBl : getAllControlType : Success.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ControlTypeBl : getAllControlType : Unhandled : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
 

    // Add (bulk JSON) -> [ORM].[RCSA_AddControlType]
    async addControlType(request, response) {
        const A = CONSTANT_FILE_OBJ.APP_CONSTANT;
        let refreshedToken = A.NULL, userIdFromToken = A.NULL, userNameFromToken = A.NULL, accountGUIDFromToken = A.NULL;

        try {
            const binds = {};
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
            const controlTypesIn = request.body.controlTypes;  

            binds.createdBy = userIdFromToken || ""; 
            binds.userId = userIdFromToken; 
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            const validationMessage = [];
            if (!Array.isArray(controlTypesIn) || controlTypesIn.length === 0) validationMessage.push('controlTypes');

            if (validationMessage.length > 0) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : ' + validationMessage.join(', ') + ' parameter(s) missing/invalid'); return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + ' parameter(s) missing/invalid.')); }

            // Coerce for ADD: ControlTypeID must be null; normalize isActive to 0/1
            const controlTypes = controlTypesIn.map(item => {
                if (!item || typeof item.ControlType !== 'string') return null;
                const isActiveBit = item.isActive === true || item.isActive === 1 ? 1 : 0;
                return { ControlTypeID: null, ControlType: item.ControlType, isActive: isActiveBit };
            }).filter(Boolean);

            if (controlTypes.length === 0) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : no valid items after coercion'); return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Invalid item(s) in controlTypes. Expect { ControlTypeID?: null, ControlType:string, isActive:boolean|0|1 }')); }

            binds.controlTypeDataJson = JSON.stringify(controlTypes);

            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : Execution started.');
            const result = await ControlTypeDbObject.addControlType(binds, accountGUIDFromToken); // same proc

            if (!result) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : result is undefined or null.'); return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL)); }
            if (result.status != A.ONE) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : Error : ' + result.errorMsg); return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL)); }
            if (result.status === A.ONE && result.procedureSuccess === A.FALSE) { logger.log('error', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : Proc error : ' + result.procedureMessage); return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage)); }

            if (Array.isArray(result.recordsets) && result.recordsets.length > 0) result.recordset = result.recordsets[A.ZERO];
            logger.log('info', 'User Id : ' + binds.userId + ' : ControlTypeBl : addControlType : Success.');
            return response.status(A.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ControlTypeBl : addControlType : Unhandled : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    async updateControlType(request, response) {
        const A = CONSTANT_FILE_OBJ.APP_CONSTANT;

        let refreshedToken = A.NULL, userIdFromToken = A.NULL, userNameFromToken = A.NULL, accountGUIDFromToken = A.NULL;

        try {
            const binds = {};
            // meta
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            // payload
            const controlTypesIn = request.body.controlTypes;

            // auditing
            binds.createdBy = userIdFromToken || "";     // proc expects CreatedBy
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken;
            binds.refreshedToken = refreshedToken;

            // ---------- validation ----------
            const validationMessage = [];
            if (!Array.isArray(controlTypesIn) || controlTypesIn.length === 0) validationMessage.push('controlTypes');

            if (validationMessage.length > 0) {
                logger.log('error', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : ${validationMessage.join(', ')} parameter(s) missing/invalid`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, `${validationMessage.join(', ')} parameter(s) missing/invalid.`));
            }

            // Each item must have: ControlTypeID (int > 0), ControlType (string), isActive (0/1|boolean)
            const normalized = [];
            for (const item of controlTypesIn) {
                if (!item || typeof item.ControlType !== 'string') {
                    logger.log('error', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : Invalid item (missing ControlType).`);
                    return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'Invalid item in controlTypes. Expect { ControlTypeID:int>0, ControlType:string, isActive:boolean|0|1 }'));
                }
                const idInt = parseInt(item.ControlTypeID, 10);
                if (!Number.isInteger(idInt) || idInt <= 0) {
                    logger.log('error', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : Invalid ControlTypeID (${item.ControlTypeID}).`);
                    return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, 'ControlTypeID must be a positive integer for update.'));
                }
                const isActiveBit = (item.isActive === true || item.isActive === 1) ? 1 : 0;
                normalized.push({ ControlTypeID: idInt, ControlType: item.ControlType, isActive: isActiveBit });
            }

            binds.controlTypeDataJson = JSON.stringify(normalized);

            logger.log('info', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : Execution started.`);

            // Same proc handles add/update (null vs int). For update we send int IDs.
            const result = await ControlTypeDbObject.addControlType(binds, accountGUIDFromToken);

            // ---------- checks ----------
            if (!result) {
                logger.log('error', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : result is undefined or null.`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (result.status != A.ONE) {
                logger.log('error', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : Error : ${result.errorMsg}`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }
            if (result.status === A.ONE && result.procedureSuccess === A.FALSE) {
                logger.log('error', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : Proc error : ${result.procedureMessage}`);
                return response.status(A.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            if (Array.isArray(result.recordsets) && result.recordsets.length > 0) result.recordset = result.recordsets[A.ZERO];

            logger.log('info', `User Id : ${binds.userId} : ControlTypeBl : updateControlType : Success.`);
            return response.status(A.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result));

        } catch (error) {
            logger.log('error', `User Id : ${userIdFromToken} : ControlTypeBl : updateControlType : Unhandled : ${error}`);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    } 

    stop() { }
}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return { success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, token: refreshedToken, error: { errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, errorMessage } };
}
function successfulResponse(refreshedToken, successMessage, result) {
    return { success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE, message: successMessage, result, token: refreshedToken, error: { errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL } };
}
function getControlTypeBLClassInstance() {
    if (ControlTypeBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) ControlTypeBlClassInstance = new ControlTypeBl();
    return ControlTypeBlClassInstance;
}
exports.getControlTypeBLClassInstance = getControlTypeBLClassInstance;
