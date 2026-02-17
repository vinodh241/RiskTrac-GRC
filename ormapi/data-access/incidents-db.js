const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class IncidentsDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch incident master data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getIncidentMasterData(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : getIncidentMasterData : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Input parameters value for ORM.INC_GetIncidentMasterData procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetIncidentMasterData').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Output parameters value of ORM.INC_GetIncidentMasterData procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Input parameters value for ORM.INC_GetIncidentMasterData procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Input parameters value for ORM.INC_GetIncidentMasterData procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentMasterData : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will set incident master data
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @param {*} data 
     * @returns 
     */
    async setIncidentMasterData(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : setIncidentMasterData : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
            
            request.input('Types',              MSSQL.NVarChar,    JSON.stringify(data.types));
            request.input('Source',             MSSQL.NVarChar,    JSON.stringify(data.source));
            request.input('Criticality',        MSSQL.NVarChar,    JSON.stringify(data.criticality));
            request.input('RiskLossCategory',   MSSQL.NVarChar,    JSON.stringify(data.riskLossCategory));
            request.input('Reviewers',          MSSQL.NVarChar,    JSON.stringify( data.reviewers));
            request.input('Approvers',          MSSQL.NVarChar,    JSON.stringify(data.approvers));
            request.input('Checkers',           MSSQL.NVarChar,    JSON.stringify(data.checkers));
            request.input('UserName',           MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Input parameters value for ORM.INC_AddIncidentMasterData procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : types             = ' + JSON.stringify(data.types));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : source            = ' + JSON.stringify(data.source));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : criticality       = ' + JSON.stringify(data.criticality));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : riskLossCategory  = ' + JSON.stringify(data.riskLossCategory));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : reviewers         = ' + JSON.stringify( data.reviewers));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : approvers         = ' + JSON.stringify(data.approvers));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : checkers         = ' + JSON.stringify(data.checkers));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : UserName          = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : AccountGUID          = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_AddIncidentMasterData').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Output parameters value of ORM.INC_AddIncidentMasterData procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Input parameters value for ORM.INC_AddIncidentMasterData procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : types             = ' + JSON.stringify(data.types));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : source            = ' + JSON.stringify(data.source));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : criticality       = ' + JSON.stringify(data.criticality));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : riskLossCategory  = ' + JSON.stringify(data.riskLossCategory));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : reviewers         = ' + JSON.stringify(data.reviewers));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : approvers         = ' + JSON.stringify(data.approvers));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : UserName          = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : AccountGUID          = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Input parameters value for ORM.INC_AddIncidentMasterData procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : types             = ' + JSON.stringify(data.types));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : source            = ' + JSON.stringify(data.source));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : criticality       = ' + JSON.stringify(data.criticality));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : riskLossCategory  = ' + JSON.stringify(data.riskLossCategory));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : reviewers         = ' + JSON.stringify(data.reviewers));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : approvers         = ' + JSON.stringify(data.approvers));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : UserName          = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentMasterData : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch incident list from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getIncidents(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : getIncidents : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Input parameters value for ORM.INC_GetIncidents procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetIncidents').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Output parameters value of ORM.INC_GetIncidents procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Input parameters value for ORM.INC_GetIncidents procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Input parameters value for ORM.INC_GetIncidents procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidents : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch info for add new incident reporting from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getIncidentInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : getIncidentInfo : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',    MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Input parameters value for ORM.INC_GetInfoForAddIncident procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : AccountGUID       = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetInfoForAddIncident').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Output parameters value of ORM.INC_GetInfoForAddIncident procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Input parameters value for ORM.INC_GetInfoForAddIncident procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : AccountGUID       = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Input parameters value for ORM.INC_GetInfoForAddIncident procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : AccountGUID       = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentInfo : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will save incidents data
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @param {*} data
     * @returns 
     */
    async setIncident(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : incidentsDb : setIncident : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

            try {
                // Fetching poolConnectionObject from global object of application
                var request = new MSSQL.Request(poolConnectionObject);
                   

                request.input('IncidentCode',           MSSQL.NVarChar,         data.incidentCode);
                request.input('IncidentTitle',          MSSQL.NVarChar,         data.incidentTitle);
                request.input('UnitID',                 MSSQL.BigInt,           data.unitID);
                request.input('UserGUID',               MSSQL.UniqueIdentifier, data.userGUID);
                request.input('LocationTypeID',         MSSQL.BigInt,           data.locationTypeID);
                request.input('IncidentTeam',           MSSQL.NVarChar,         data.incidentTeam);
                request.input('IncidentDate',           MSSQL.NVarChar,         data.incidentDate);
                request.input('MobileNumber',           MSSQL.NVarChar,         data.mobileNumber);
                request.input('EmailID',                MSSQL.NVarChar,         data.emailID);
                request.input('Description',            MSSQL.NVarChar,         data.description);
                request.input('Recommendation',         MSSQL.NVarChar,         data.recommendation);
                request.input('Action',                 MSSQL.NVarChar,         data.action);
                request.input('MakerRCA',               MSSQL.NVarChar,         data.rca);
                request.input('IncidentTypeIDs',        MSSQL.NVarChar,         data.incidentTypeIDs);
                request.input('IncidentSourceID',       MSSQL.BigInt,           data.incidentSourceID);
                request.input('DirectLoss',             MSSQL.Money,            data.DirectLoss);
                request.input('IndirectLoss',           MSSQL.Money,            data.IndirectLoss);
                request.input('Recoveries',             MSSQL.Money,            data.Recoveries);
                request.input('LossAmount',             MSSQL.Money,            data.lossAmount);
                request.input('ReportingDate',          MSSQL.NVarChar,         data.identificationDate);
                request.input('AggPartyDetails',        MSSQL.NVarChar,         data.aggPartyDetails);
                request.input('CriticalityID',          MSSQL.BigInt,           data.criticalityID);
                request.input('ImpactedUnits',          MSSQL.NVarChar,         JSON.stringify(data.impactedUnits));
                request.input('RiskLossCategoryIDs',    MSSQL.NVarChar,         data.riskLossCategoryIDs);
                request.input('EvidenceIDs',            MSSQL.NVarChar,         data.evidenceIDs);
                request.input('UserName',               MSSQL.NVarChar,         userNameFromToken);
                request.input('AccountGUID',            MSSQL.UniqueIdentifier, accountGUIDFromToken);
                request.output('Success',               MSSQL.Bit);
                request.output('OutMessage',            MSSQL.NVarChar);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Input parameters value for ORM.INC_AddIncident procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : UserName            = ' + userNameFromToken);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentCode        = ' + data.incidentCode);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTitle       = ' + data.incidentTitle);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : unitID              = ' + data.unitID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : userGUID            = ' + data.userGUID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : locationTypeID      = ' + data.locationTypeID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTeam        = ' + data.incidentTeam);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentDate        = ' + data.incidentDate);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : mobileNumber        = ' + data.mobileNumber);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : emailID             = ' + data.emailID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : description         = ' + data.description);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : recommendation      = ' + data.recommendation);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : Action              = ' + data.action);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : RCA                 = ' + data.rca);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTypeIDs     = ' + data.incidentTypeIDs);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentSourceID    = ' + data.incidentSourceID);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : DirectLoss          = ' + data.DirectLoss);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : IndirectLoss        = ' + data.IndirectLoss);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : Recoveries          = ' + data.Recoveries);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : lossAmount          = ' + data.lossAmount);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : reportingDate       = ' + data.identificationDate);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : aggPartyDetails     = ' + data.aggPartyDetails);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : criticalityID       = ' + data.criticalityID);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : impactedUnits       = ' + JSON.stringify(data.impactedUnits));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : riskLossCategoryIDs = ' + data.riskLossCategoryIDs);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : evidenceIDs         = ' + data.evidenceIDs);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : AccountGUID         = ' + accountGUIDFromToken);
                

                return request.execute('ORM.INC_AddIncident').then(function (result) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Output parameters value of ORM.INC_AddIncident procedure.');
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Success       = ' + result.output.Success);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : OutMessage    = ' + result.output.OutMessage);

                    dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                    dbResponseObj.procedureSuccess = result.output.Success;
                    dbResponseObj.procedureMessage = result.output.OutMessage;
                    dbResponseObj.recordset        = result.recordsets;

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Execution end.');

                    return dbResponseObj;
                })
                .catch(function (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Input parameters value for ORM.INC_AddIncident procedure.');
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : UserName            = ' + userNameFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentCode        = ' + data.incidentCode);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTitle       = ' + data.incidentTitle);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : unitID              = ' + data.unitID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : userGUID            = ' + data.userGUID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : locationTypeID      = ' + data.locationTypeID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTeam        = ' + data.incidentTeam);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentDate        = ' + data.incidentDate);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : mobileNumber        = ' + data.mobileNumber);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : emailID             = ' + data.emailID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : description         = ' + data.description);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : recommendation      = ' + data.recommendation);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : Action              = ' + data.action);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTypeIDs     = ' + data.incidentTypeIDs);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentSourceID    = ' + data.incidentSourceID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : DirectLoss          = ' + data.DirectLoss);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : IndirectLoss        = ' + data.IndirectLoss);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : Recoveries          = ' + data.Recoveries);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : lossAmount          = ' + data.lossAmount);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : reportingDate       = ' + data.identificationDate);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : aggPartyDetails     = ' + data.aggPartyDetails);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : criticalityID       = ' + data.criticalityID);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : impactedUnits       = ' + JSON.stringify(data.impactedUnits));
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : riskLossCategoryIDs = ' + data.riskLossCategoryIDs);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : evidenceIDs         = ' + data.evidenceIDs);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : AccountGUID         = ' + accountGUIDFromToken);
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Execution end. : Error details : ' + error);
                    
                    dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                    dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                    
                    return dbResponseObj;
                });
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Input parameters value for ORM.INC_AddIncident procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : UserName            = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentCode        = ' + data.incidentCode);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : unitID              = ' + data.unitID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : userGUID            = ' + data.userGUID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : locationTypeID      = ' + data.locationTypeID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTeam        = ' + data.incidentTeam);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentDate        = ' + data.incidentDate);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : mobileNumber        = ' + data.mobileNumber);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : emailID             = ' + data.emailID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : description         = ' + data.description);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : recommendation      = ' + data.recommendation);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : Action              = ' + data.action);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentTypeIDs     = ' + data.incidentTypeIDs);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : incidentSourceID    = ' + data.incidentSourceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : DirectLoss          = ' + data.DirectLoss);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : IndirectLoss        = ' + data.IndirectLoss);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : Recoveries          = ' + data.Recoveries);                
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : lossAmount          = ' + data.lossAmount);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : reportingDate       = ' + data.identificationDate);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : aggPartyDetails     = ' + data.aggPartyDetails);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : criticalityID       = ' + data.criticalityID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : impactedUnits       = ' + JSON.stringify(data.impactedUnits));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : riskLossCategoryIDs = ' + data.riskLossCategoryIDs);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : evidenceIDs         = ' + data.evidenceIDs);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncident : AccountGUID         = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : setIncident : Execution end. : Error details : ' + error);

                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
                
                return dbResponseObj;
            }
    } 
    
    /**
     * This function will fetch incident details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @param {*} data
     * @returns 
     */
    async getIncidentDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : incidentsDb : getIncidentDetails : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('IncidentID',  MSSQL.BigInt,      data.incidentID);
            request.input('UserName',    MSSQL.NVarChar,    userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Input parameters value for ORM.INC_GetIncidentDetails procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : IncidentID  = ' + data.incidentID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : UserName  = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : AccountGUID  = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetIncidentDetails').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Output parameters value of ORM.INC_GetIncidentDetails procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Input parameters value for ORM.INC_GetIncidentDetails procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : IncidentID  = ' + data.incidentID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : UserName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : AccountGUID  = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Input parameters value for ORM.INC_GetIncidentDetails procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : IncidentID  = ' + data.incidentID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : UserName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getIncidentDetails : AccountGUID  = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : incidentsDb : getIncidentDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will upload Incident evidence file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} remarks
     * @param {*} callback
     * @param {*} accountGUIDFromToken
     */
    uploadIncidentEvidence(userIdFromToken, userNameFromToken, data, remarks, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : uploadIncidentEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('OriginalFileName',   MSSQL.NVarChar,     data.fileName);
            request.input('FileType',           MSSQL.NVarChar,     data.fileType)
            request.input('FileContent',        MSSQL.VarBinary,    data.fileContent);
            request.input('Remark',             MSSQL.NVarChar,     remarks)
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Input parameters value for ORM.INC_UploadIncidentEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : UserName             = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : OriginalFileName     = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : FileType             = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Remarks              = ' + remarks);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : AccounGUID             = ' + accountGUIDFromToken);

            request.execute('ORM.INC_UploadIncidentEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Output parameters value of ORM.INC_UploadIncidentEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Input parameters value for ORM.INC_UploadIncidentEvidence procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : OriginalFileName     = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : FileType             = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Remarks              = ' + remarks);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : AccounGUID             = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Input parameters value for ORM.INC_UploadIncidentEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : OriginalFileName     = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : FileType             = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Remarks              = ' + remarks);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : AccounGUID             = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadIncidentEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }

    /**
     * This function get incident evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken    
     * @returns 
     */
    async downloadIncidentEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : downloadIncidentEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EvidenceID',         MSSQL.BigInt, data.evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Input parameters value for ORM.INC_GetIncidentEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetIncidentEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Output parameters value of ORM.INC_GetIncidentEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Input parameters value for ORM.INC_GetIncidentEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : EvidenceID  = ' + data.evidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Input parameters value for ORM.INC_GetIncidentEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : EvidenceID  = ' + data.evidenceID); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadIncidentEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function delete Incident evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data 
     * @param {*} accountGUIDFromToken    
     * @returns 
     */
    async deleteIncidentEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : deleteIncidentEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EvidenceID',         MSSQL.BigInt, data.evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Input parameters value for ORM.INC_DeleteIncidentEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_DeleteIncidentEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Output parameters value of ORM.INC_DeleteIncidentEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Input parameters value for ORM.INC_DeleteIncidentEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : EvidenceID  = ' + data.evidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : AccountGUID    = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Input parameters value for ORM.INC_DeleteIncidentEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : AccountGUID    = ' + accountGUIDFromToken); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteIncidentEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will upload RCA evidence file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} remarks
     * @param {*} accountGUIDFromToken
     * @param {*} callback 
     */
    uploadRcaEvidence(userIdFromToken, userNameFromToken, data,remarks, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : uploadRcaEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('OriginalFileName',   MSSQL.NVarChar,     data.fileName);
            request.input('FileType',           MSSQL.NVarChar,     data.fileType)
            request.input('FileContent',        MSSQL.VarBinary,    data.fileContent);
            request.input('Remark',             MSSQL.NVarChar,     remarks)
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.VarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Input parameters value for ORM.INC_UploadRCAEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : UserName             = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : OriginalFileName     = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : FileType             = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Remarks              = ' + remarks);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : AccountGUID             = ' + accountGUIDFromToken);

            request.execute('ORM.INC_UploadRCAEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Output parameters value of ORM.INC_UploadRCAEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Input parameters value for ORM.INC_UploadRCAEvidence procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : OriginalFileName     = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : FileType             = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Remarks              = ' + remarks);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : AccountGUID             = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Input parameters value for ORM.INC_UploadRCAEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : OriginalFileName     = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : FileType             = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Remarks              = ' + remarks);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : AccountGUID             = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRcaEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }
    
    /**
     * This function get RCA evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data 
     * @param {*} accountGUIDFromToken    
     * @returns 
     */
    async downloadRcaEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : downloadRcaEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EvidenceID',         MSSQL.BigInt, data.evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Input parameters value for ORM.INC_GetRCAEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetRCAEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Output parameters value of ORM.INC_GetRCAEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Input parameters value for ORM.INC_GetRCAEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : EvidenceID  = ' + data.evidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : AccountGUID    = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Input parameters value for ORM.INC_GetRCAEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRcaEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function delete RCA evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken     
     * @returns 
     */
    async deleteRcaEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : deleteRcaEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EvidenceID',         MSSQL.BigInt, data.evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccounGUID',         MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Input parameters value for ORM.INC_DeleteRCAEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_DeleteRCAEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Output parameters value of ORM.INC_DeleteRCAEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Input parameters value for ORM.INC_DeleteRCAEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : EvidenceID  = ' + data.evidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : AccountGUID    = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Input parameters value for ORM.INC_DeleteRCAEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : AccountGUID    = ' + accountGUIDFromToken); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRcaEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will upload Recommendation evidence file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} remarks
     * @param {*} callback
     * @param {*} accountGUIDFromToken
     */
    uploadRecomendationEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : uploadRecomendationEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('OriginalFileName',   MSSQL.NVarChar,     data.fileName);
            request.input('FileType',           MSSQL.NVarChar,     data.fileType)
            request.input('FileContent',        MSSQL.VarBinary,    data.fileContent);
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.VarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Input parameters value for ORM.INC_UploadRecommendationEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : UserName             = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : OriginalFileName     = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : FileType             = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : AccountGUID             = ' + accountGUIDFromToken);

            request.execute('ORM.INC_UploadRecommendationEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Output parameters value of ORM.INC_UploadRecommendationEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Input parameters value for ORM.INC_UploadRecommendationEvidence procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : OriginalFileName     = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : FileType             = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : AccountGUID             = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Input parameters value for ORM.INC_UploadRecommendationEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : OriginalFileName     = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : FileType             = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : AccountGUID             = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : uploadRecomendationEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }
 
    /**
     * This function get Recommendation evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken     
     * @returns 
     */
    async downloadRecomendationEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : downloadRecomendationEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EvidenceID',         MSSQL.BigInt, data.evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Input parameters value for ORM.INC_GetRecommendationEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetRecommendationEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Output parameters value of ORM.INC_GetRecommendationEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Input parameters value for ORM.INC_GetRecommendationEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : EvidenceID  = ' + data.evidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : AccountGUID    = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Input parameters value for ORM.INC_GetRecommendationEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : downloadRecomendationEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }
    
    /**
     * This function delete Recommendation evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken     
     * @returns 
     */
    async deleteRecomendationEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : deleteRecomendationEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('EvidenceID',         MSSQL.BigInt, data.evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Input parameters value for ORM.INC_DeleteRecommendationEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : EvidenceID  = ' + data.evidenceID);

            return request.execute('ORM.INC_DeleteRecommendationEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Output parameters value of ORM.INC_DeleteRecommendationEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Input parameters value for ORM.INC_DeleteRecommendationEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : EvidenceID  = ' + data.evidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : AccountGUID    = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Input parameters value for ORM.INC_DeleteRecommendationEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : EvidenceID  = ' + data.evidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : AccountGUID    = ' + accountGUIDFromToken); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : deleteRecomendationEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add Incident Status to the incidents
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setIncidentStatus(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : setIncidentStatus : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);
       
            request.input('IncidentID',         MSSQL.BigInt,   data.incidentID);
            request.input('Comment',            MSSQL.NVarChar, data.comment);
            request.input('CurrentStatusCode',  MSSQL.BigInt,   data.currentStatusCode);
            request.input('NextStatusCode',     MSSQL.BigInt,   data.nextStatusCode);
            request.input('IsApproved',         MSSQL.Bit,      data.isApproved);
            request.input('IsReviewed',         MSSQL.Bit,      data.isReviewed);
            request.input('IsChecked',         MSSQL.Bit,       data.IsChecked);
            request.input('IsFinancialLoss',    MSSQL.NVarChar, data.IsFinancialLoss);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Input parameters value for ORM.INC_UpdateIncident procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : incidentID        = ' + data.incidentID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : comment           = ' + data.comment);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : currentStatusCode = ' + data.currentStatusCode);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : nextStatusCode    = ' + data.nextStatusCode);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : isApproved        = ' + data.isApproved);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : isReviewed        = ' + data.isReviewed);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : IsChecked         = ' + data.IsChecked);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : IsFinancialLoss   = ' + data.IsFinancialLoss);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : UserName          = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : AccountGUID          = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_UpdateIncident').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Output parameters value of ORM.INC_UpdateIncident procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Input parameters value for ORM.INC_UpdateIncident procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : incidentID        = ' + data.incidentID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : comment           = ' + data.comment);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : currentStatusCode = ' + data.currentStatusCode);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : nextStatusCode    = ' + data.nextStatusCode);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : isApproved        = ' + data.isApproved);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : isReviewed        = ' + data.isReviewed);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : UserName          = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : AccountGUID          = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Input parameters value for ORM.INC_UpdateIncident procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : incidentID        = ' + data.incidentID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : comment           = ' + data.comment);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : currentStatusCode = ' + data.currentStatusCode);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : nextStatusCode    = ' + data.nextStatusCode);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : isApproved        = ' + data.isApproved);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : isReviewed        = ' + data.isReviewed);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : UserName          = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add Incident Review to the incidents
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setIncidentReview(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : setIncidentReview : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);           

            request.input('IncidentID',         MSSQL.BigInt,   data.incidentID);
            request.input('Comments',           MSSQL.NVarChar, data.comments);
            request.input('RCA',                MSSQL.NVarChar, data.rca);
            request.input('FileIDs',            MSSQL.NVarChar, data.fileIDs);
            request.input('Recommendations',    MSSQL.NVarChar, JSON.stringify(data.recommendationData));
            request.input('IsFinancialLoss',                MSSQL.NVarChar, data.IsFinancialLoss);
            request.input('FinancialLossComment',            MSSQL.NVarChar, data.FinancialLossComment);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Input parameters value for ORM.INC_ReviewIncident procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : incidentID            = ' + data.incidentID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : comments              = ' + data.comments);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : rca                   = ' + data.rca);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : fileIDs               = ' + data.fileIDs);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : IsFinancialLoss                   = ' + data.IsFinancialLoss);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : financialLossComment               = ' + data.financialLossComment);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : recommendationData    = ' + JSON.stringify(data.recommendationData));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : UserName              = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : AccountGUID              = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_ReviewIncident').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Output parameters value of ORM.INC_ReviewIncident procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Input parameters value for ORM.INC_ReviewIncident procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : incidentID            = ' + data.incidentID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : comments              = ' + data.comments);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : rca                   = ' + data.rca);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : fileIDs               = ' + data.fileIDs);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : recommendationData    = ' + JSON.stringify(data.recommendationData));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : UserName              = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : AccountGUID              = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Input parameters value for ORM.INC_ReviewIncident procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : incidentID            = ' + data.incidentID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : comments              = ' + data.comments);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : rca                   = ' + data.rca);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : fileIDs               = ' + data.fileIDs);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : recommendationData    = ' + JSON.stringify(data.recommendationData));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : UserName              = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : AccountGUID              = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setIncidentReview : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add recommendation Action to the incidents
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setRecommendationAction(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : setRecommendationAction : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
        status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
        procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
        // Fetching poolConnectionObject from global object of application
        var request = new MSSQL.Request(poolConnectionObject);
       
        request.input('RecommendationID',   MSSQL.BigInt,           data.recommendationID);
        request.input('Action',             MSSQL.NVarChar,         data.action);
        request.input('LessonLearnt',       MSSQL.NVarChar,         data.LessonLearnt ?? '');
        request.input('FileIDs',            MSSQL.NVarChar,         data.fileIDs);
        request.input('UserName',           MSSQL.NVarChar,         userNameFromToken);
        request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
        request.output('Success',           MSSQL.Bit);
        request.output('OutMessage',        MSSQL.VarChar);

        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Input parameters value for ORM.INC_UpdateRecommendation procedure.');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : recommendationID    = ' + data.recommendationID);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : action              = ' + data.action);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : LessonLearnt        = ' + data.LessonLearnt ?? '');
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : fileIDs             = ' + data.fileIDs);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : UserName            = ' + userNameFromToken);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : AccountGUID         = ' + accountGUIDFromToken);

        return request.execute('ORM.INC_UpdateRecommendation').then(function (result) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Output parameters value of ORM.INC_UpdateRecommendation procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Success       = ' + result.output.Success);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : OutMessage    = ' + result.output.OutMessage);

            dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
            dbResponseObj.procedureSuccess = result.output.Success;
            dbResponseObj.procedureMessage = result.output.OutMessage;
            dbResponseObj.recordset        = result.recordsets;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Execution end.');
            

            return dbResponseObj;
        })
        .catch(function (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Input parameters value for ORM.INC_UpdateRecommendation procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : recommendationID       = ' + data.recommendationID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : action                 = ' + data.action);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : LessonLearnt           = ' + data.LessonLearnt ?? '');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : fileIDs                = ' + data.fileIDs);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : UserName               = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : AccountGUID            = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Execution end. : Error details : ' + error);
            
            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
            
            return dbResponseObj;
        });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Input parameters value for ORM.INC_UpdateRecommendation procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : recommendationID       = ' + data.recommendationID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : action                 = ' + data.action);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : LessonLearnt           = ' + data.LessonLearnt ?? '');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : fileIDs                = ' + data.fileIDs);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : UserName               = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : AccountGUID            = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationAction : Execution end. : Error details : ' + error);

        dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

        return dbResponseObj;
        }
    }

    /**
     * This function will add recommendation status to the incidents
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setRecommendationStatus(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : setRecommendationStatus : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('RecommendationID',   MSSQL.BigInt,   data.recommendationID);
            request.input('Comment',            MSSQL.NVarChar, data.comment);
            request.input('CurrentStatusCode',  MSSQL.BigInt,   data.currentStatusCode);
            request.input('NextStatusCode',     MSSQL.BigInt,   data.nextStatusCode);
            request.input('IsApproved',         MSSQL.Bit,      data.isApproved);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Input parameters value for ORM.INC_UpdateRecommendationStatus procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : recommendationID    = ' + data.recommendationID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : comment             = ' + data.comment);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : currentStatusCode   = ' + data.currentStatusCode);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : nextStatusCode      = ' + data.nextStatusCode);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : isApproved          = ' + data.isApproved);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : UserName            = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : AccountGUID         = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_UpdateRecommendationStatus').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Output parameters value of ORM.INC_UpdateRecommendationStatus procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Input parameters value for ORM.INC_UpdateRecommendationStatus procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : recommendationID    = ' + data.recommendationID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : comment             = ' + data.comment);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : currentStatusCode   = ' + data.currentStatusCode);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : nextStatusCode      = ' + data.nextStatusCode);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : isApproved          = ' + data.isApproved);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : UserName            = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : AccountGUID         = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Input parameters value for ORM.INC_UpdateRecommendationStatus procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : recommendationID    = ' + data.recommendationID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : comment             = ' + data.comment);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : currentStatusCode   = ' + data.currentStatusCode);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : nextStatusCode      = ' + data.nextStatusCode);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : isApproved          = ' + data.isApproved);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : UserName            = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : AccountGUID         = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : setRecommendationStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will get all mailer email ids
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getMailerList(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : IncidentsDb : getMailerList : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('IncidentID',         MSSQL.BigInt,   data.incidentID);           
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Input parameters value for ORM.INC_GetMailerList procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : incidentID    = ' + data.incidentID);           
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : UserName      = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : AccountGUID   = ' + accountGUIDFromToken);

            return request.execute('ORM.INC_GetMailerList').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Output parameters value of ORM.INC_GetMailerList procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Input parameters value for ORM.INC_GetMailerList procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : incidentID    = ' + data.incidentID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : UserName      = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : AccountGUID   = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Input parameters value for ORM.INC_GetMailerList procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : incidentID    = ' + data.incidentID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : UserName      = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : AccountGUID   = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : IncidentsDb : getMailerList : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}