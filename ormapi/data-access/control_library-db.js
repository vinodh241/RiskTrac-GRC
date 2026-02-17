const MSSQL = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js')
const MESSAGE_FILE_OBJ = require('../utility/message/message-constant.js');

module.exports = class ControlLibraryDB {
    constructor() { }

    start() { }

    /**
     * @param {*} binds
     * @returns {Promise<object>}
     */
    async getAllControlLibraryData(binds) {
        logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Execution started.`);

        /**
         * dbResponseObj.status values
         * 1 - Successful operation
         * 0 - Error while connecting database
         * 2 - Error while executing procedure
         */
        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            const request = new MSSQL.Request(poolConnectionObject);

            request.input('ControlID', MSSQL.Int, binds.id);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Input parameters value of ORM.RCSA_GetAllControlData procedure.`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : ControlID        = ${binds.id}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : CreatedBy        = ${binds.createdBy}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : AccountGUID      = ${binds.accountGUIDFromToken}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Parameters ready to execute.`);

            try {
                const result = await request.execute('[ORM].[RCSA_GetAllControlData]');

                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Output parameters value of ORM.RCSA_GetAllControlData procedure.`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Success          = ${result.output.Success}`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : OutMessage       = ${result.output.OutMessage}`);
                // logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : RecordSet        = ${JSON.stringify(result.recordset)}`);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Execution end.`);
                return dbResponseObj;
            } catch (error) {
                // Procedure execution error
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Input parameters value of ORM.RCSA_GetAllControlData procedure.`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : ControlID        = ${binds.id}`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : CreatedBy        = ${binds.createdBy}`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : AccountGUID      = ${binds.accountGUIDFromToken}`);
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Execution end. : Error details : ${error}`);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            }
        } catch (error) {
            // Connection / unexpected error
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Input parameters value of ORM.RCSA_GetAllControlData procedure.`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : ControlID        = ${binds.id}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : CreatedBy        = ${binds.createdBy}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : AccountGUID      = ${binds.accountGUIDFromToken}`);
            logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : getAllControlLibraryData : Execution end. : Error details : ${error}`);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    /**
     * Calls [ORM].[RCSA_GetInfoForAddControls] to fetch master data needed
     * for adding controls (groups, units, processes, categories, etc.).
     *
     * dbResponseObj.status values:
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     *
     * @param {Object} binds
     * @param {string} binds.createdBy                // e.g., username from token
     * @param {string} binds.accountGUIDFromToken     // GUID string
     * @param {string|number} [binds.userId]          // for logging only
     * @returns {Promise<{
     *   status: number,
     *   recordset: any,
     *   errorMsg: string|null,
     *   procedureSuccess: boolean,
     *   procedureMessage: string|null
     * }>}
     */
    async getControlMasterData(binds) {
        logger.log(
            'info',
            `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Execution started.`
        );

        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            const request = new MSSQL.Request(poolConnectionObject);

            // Inputs expected by the proc
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);

            // Outputs from the proc
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Input parameters value of ORM.RCSA_GetInfoForAddControls procedure.`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : CreatedBy        = ${binds.createdBy}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : AccountGUID      = ${binds.accountGUIDFromToken}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Parameters ready to execute.`);

            try {
                const result = await request.execute('[ORM].[RCSA_GetInfoForAddControls]');

                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Output parameters value of ORM.RCSA_GetInfoForAddControls procedure.`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Success          = ${result.output.Success}`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : OutMessage       = ${result.output.OutMessage}`);
                // logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : RecordSet        = ${JSON.stringify(result.recordset)}`);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Execution end.`);
                return dbResponseObj;
            } catch (error) {
                // Procedure execution error
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Input parameters value of ORM.RCSA_GetInfoForAddControls procedure.`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : CreatedBy        = ${binds.createdBy}`);
                logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : AccountGUID      = ${binds.accountGUIDFromToken}`);
                logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Execution end. : Error details : ${error}`);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            }
        } catch (error) {
            // Connection / unexpected error
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Input parameters value of ORM.RCSA_GetInfoForAddControls procedure.`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : CreatedBy        = ${binds.createdBy}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : AccountGUID      = ${binds.accountGUIDFromToken}`);
            logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : getControlMasterData : Execution end. : Error details : ${error}`);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    async addControlData(binds) {
        logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Execution started.`);

        /**
         * dbResponseObj.status:
         * 1 - Successful operation
         * 0 - Error while connecting database
         * 2 - Error while executing procedure
         */
        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            const request = new MSSQL.Request(poolConnectionObject);

            // Inputs expected by [ORM].[RCSA_AddUpdateControlData]
            request.input('UnitID', MSSQL.Int, binds.unitID);
            request.input('GroupID', MSSQL.Int, binds.groupID);
            request.input('ControlID', MSSQL.Int, binds.controlID); // can be null
            request.input('ControlTypeID', MSSQL.Int, binds.controlTypeID);
            request.input('ControlDescription', MSSQL.VarChar(512), binds.controlDescription);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);

            // Outputs
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Input parameters for ORM.RCSA_AddUpdateControlData.`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : UnitID             = ${binds.unitID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : GroupID            = ${binds.groupID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlID          = ${binds.controlID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlTypeID      = ${binds.controlTypeID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlDescription = ${binds.controlDescription}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : AccountGUID        = ${binds.accountGUIDFromToken}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : CreatedBy          = ${binds.createdBy}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Parameters defined; executing proc.`);

            return request
                .execute('[ORM].[RCSA_AddUpdateControlData]')
                .then(function (result) {
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Output values from ORM.RCSA_AddUpdateControlData.`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Success    = ${result.output.Success}`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : OutMessage = ${result.output.OutMessage}`);
                    // logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : RecordSet  = ${JSON.stringify(result.recordset)}`);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;

                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Execution end.`);
                    return dbResponseObj;
                })
                .catch(function (error) {
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Input parameters for ORM.RCSA_AddUpdateControlData (on catch).`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : UnitID             = ${binds.unitID}`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : GroupID            = ${binds.groupID}`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlTypeID      = ${binds.controlTypeID}`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlDescription = ${binds.controlDescription}`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : CreatedBy          = ${binds.createdBy}`);
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : AccountGUID        = ${binds.accountGUIDFromToken}`);
                    logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Execution end. : Error details : ${error}`);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    return dbResponseObj;
                });

        } catch (error) {
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Input parameters for ORM.RCSA_AddUpdateControlData (outer catch).`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : UnitID             = ${binds.unitID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : GroupID            = ${binds.groupID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlID          = ${binds.controlID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlTypeID      = ${binds.controlTypeID}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : ControlDescription = ${binds.controlDescription}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : CreatedBy          = ${binds.createdBy}`);
            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : AccountGUID        = ${binds.accountGUIDFromToken}`);
            logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : addControlData : Execution end. : Error details : ${error}`);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    async updateControlData(binds) {
        logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : Execution started.`);

        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            const request = new MSSQL.Request(poolConnectionObject);

            // Inputs for [ORM].[RCSA_AddUpdateControlData]
            request.input('UnitID', MSSQL.Int, binds.unitID);
            request.input('GroupID', MSSQL.Int, binds.groupID);
            request.input('ControlID', MSSQL.Int, binds.controlID);
            request.input('ControlTypeID', MSSQL.Int, binds.controlTypeID);
            request.input('ControlDescription', MSSQL.VarChar(512), binds.controlDescription);
            request.input('IsActive', MSSQL.Bit, binds.isActive);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, binds.accountGUIDFromToken);
            request.input('CreatedBy', MSSQL.NVarChar, binds.createdBy);

            // Outputs
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : Params ready; executing proc.`);

            return request.execute('[ORM].[RCSA_AddUpdateControlData]')
                .then(function (result) {
                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : Success=${result.output.Success} OutMessage=${result.output.OutMessage}`);
                    // logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : RecordSet=${JSON.stringify(result.recordset)}`);

                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;

                    logger.log('info', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : Execution end.`);
                    return dbResponseObj;
                })
                .catch(function (error) {
                    logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : Proc execution failed : ${error}`);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    return dbResponseObj;
                });

        } catch (error) {
            logger.log('error', `User Id : ${binds.userId} : ControlLibraryDB : updateControlData : Unhandled error : ${error}`);
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    async addBulkControlData(data) {
        // data: { ControlsData: Array<Object>, CreatedBy: string, accountGUIDFromToken: string }
        logger.log('info', `User Id : ${data.CreatedBy} : ControlLibraryDB : addBulkControlData : start`);
        const dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        try {
            const request = new MSSQL.Request(poolConnectionObject);

            request.input('ControlsData', MSSQL.NVarChar, JSON.stringify(data.ControlsData));
            request.input('AccountGUID', MSSQL.UniqueIdentifier, data.accountGUIDFromToken);
            request.input('CreatedBy', MSSQL.NVarChar, data.CreatedBy);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar(512));

            logger.log('info', `User Id : ${data.CreatedBy} : ControlLibraryDB : addBulkControlData : executing [ORM].[RCSA_AddBulkControls]`);

            return request.execute('[ORM].[RCSA_AddBulkControls]')
                .then(result => {
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset = result.recordsets;
                    logger.log('info', `User Id : ${data.CreatedBy} : ControlLibraryDB : addBulkControlData : end`);
                    return dbResponseObj;
                })
                .catch(error => {
                    logger.log('error', `User Id : ${data.CreatedBy} : ControlLibraryDB : addBulkControlData : error: ${error}`);
                    dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    return dbResponseObj;
                });
        } catch (error) {
            logger.log('error', `User Id : ${data.CreatedBy} : ControlLibraryDB : addBulkControlData : unhandled: ${error}`);
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }


    stop() { }
};
