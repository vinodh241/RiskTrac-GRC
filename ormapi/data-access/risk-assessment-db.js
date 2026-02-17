const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class RiskAssessmentDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch framework,users and units details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async getInfoForScheduleRiskAssessment(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : Execution started.');
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
            request.input('CollectionScheduleID',    MSSQL.NVarChar, data.CollectionScheduleID);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : CollectionScheduleID:'+ data.CollectionScheduleID); 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : No Input parameters value for ORM.GetInfoForScheduleRAAssessment procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.GetInfoForScheduleRAAssessment').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : Output parameters value of ORM.GetInfoForScheduleRAAssessment procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : No Input parameters value for ORM.GetInfoForScheduleRAAssessment procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : No Input parameters value for ORM.GetInfoForScheduleRAAssessment procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getInfoForScheduleRiskAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will save assessment details to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data 
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setRiskAssessment(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : setRiskAssessment : Execution started.');
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

            request.input('FWID' ,                  MSSQL.Int ,             data.fwid);
            request.input('StartDate' ,             MSSQL.NVarChar,         data.startDate);
            request.input('EndDate' ,               MSSQL.NVarChar,         data.endDate);
            request.input('IsReviewedByUnit' ,      MSSQL.Bit ,             data.isReviewerUnit);
            request.input('UnitID' ,                MSSQL.Int ,             data.unitId);
            request.input('ReviewerGUID' ,          MSSQL.UniqueIdentifier, data.reviewerGUID);
            request.input('Reminderdate' ,          MSSQL.NVarChar,         data.remainderdate);
            request.input('UserName',               MSSQL.NVarChar,         userNameFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',               MSSQL.Bit);
            request.output('OutMessage',            MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Input parameters value for ORM.AddRAAssessment procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : FWID                     = ' + data.fwid);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : StartDate                = ' + data.startDate);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : EndDate                  = ' + data.endDate);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : IsReviewedByUnit         = ' + data.isReviewerUnit);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : UnitID                   = ' + data.unitId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : ReviewerGUID             = ' + data.reviewerGUID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : UserName                 = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : AccountGUID              = ' + accountGUIDFromToken);

            return request.execute('ORM.AddRAAssessment').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Output parameters value of ORM.AddRAAssessment procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Execution end.');

                return dbResponseObj;
                logger.log('info', 'dbResponseObj : ', + dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Input parameters value for ORM.AddRAAssessment procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : FWID                     = ' + data.fwid);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : StartDate                = ' + data.startDate);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : EndDate                  = ' + data.endDate);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : IsReviewedByUnit         = ' + data.isReviewerUnit);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : UnitID                   = ' + data.unitId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : ReviewerGUID             = ' + data.reviewerGUID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : UserName                 = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : AccountGUID              = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Input parameters value for ORM.AddRAAssessment procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : FWID                     = ' + data.fwid);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : StartDate                = ' + data.startDate);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : EndDate                  = ' + data.endDate);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : IsReviewedByUnit         = ' + data.isReviewerUnit);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : UnitID                   = ' + data.unitId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : ReviewerGUID             = ' + data.reviewerGUID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : UserName                 = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : AccountGUID              = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update assessment details to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async updateRiskAssessment(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : updateRiskAssessment : Execution started.');
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

            request.input('CollectionScheduleID' ,                  MSSQL.Int ,             data.collectionScheduleID);
            request.input('FWID' ,                                  MSSQL.Int ,             data.fwid);
            request.input('QuaterID',                               MSSQL.Int ,             data.quaterID)
            request.input('StartDate' ,                             MSSQL.NVarChar,         data.startDate);
            request.input('EndDate' ,                               MSSQL.NVarChar,         data.endDate);
            request.input('IsReviewedByUnit' ,                      MSSQL.Bit ,             data.isReviewerUnit);
            request.input('UnitID' ,                                MSSQL.Int ,             data.unitId);
            request.input('ReviewerGUID' ,                          MSSQL.UniqueIdentifier, data.reviewerGUID);
            request.input('Reminderdate' ,                          MSSQL.NVarChar,         data.remainderdate);
            request.input('UserName',                               MSSQL.NVarChar,         userNameFromToken);
            request.input('AccountGUID',                            MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',                               MSSQL.Bit);
            request.output('OutMessage',                            MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Input parameters value for ORM.UpdateRAAssessment procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : FWID                     = ' + data.fwid);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : QuaterID                 = ' + data.quaterID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : StartDate                = ' + data.startDate);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : EndDate                  = ' + data.endDate);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : IsReviewedByUnit         = ' + data.isReviewerUnit);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : UnitID                   = ' + data.unitId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : ReviewerGUID             = ' + data.reviewerGUID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : UserName                 = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : AccountGUID              = ' + accountGUIDFromToken);

            return request.execute('ORM.UpdateRAAssessment').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Output parameters value of ORM.UpdateRAAssessment procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Input parameters value for ORM.UpdateRAAssessment procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : FWID                     = ' + data.fwid);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : QuaterID                 = ' + data.quaterID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : StartDate                = ' + data.startDate);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : EndDate                  = ' + data.endDate);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : IsReviewedByUnit         = ' + data.isReviewerUnit);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : UnitID                   = ' + data.unitId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : ReviewerGUID             = ' + data.reviewerGUID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : UserName                 = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : AccountGUID              = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Input parameters value for ORM.UpdateRAAssessment procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : FWID                     = ' + data.fwid);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : QuaterID                 = ' + data.quaterID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : StartDate                = ' + data.startDate);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : EndDate                  = ' + data.endDate);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : IsReviewedByUnit         = ' + data.isReviewerUnit);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : UnitID                   = ' + data.unitId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : ReviewerGUID             = ' + data.reviewerGUID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : UserName                 = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : AccountGUID              = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : updateRiskAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch risk assessment details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getRiskAssessment(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : getRiskAssessment : Execution started.');
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
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment :  No Input parameters value for ORM.GetRASchedules procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment :  UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment :  AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('ORM.GetRASchedules').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : Output parameters value of ORM.GetRASchedules procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : No Input parameters value for ORM.GetRASchedules procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : No Input parameters value for ORM.GetRASchedules procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch risk assessment details from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getRiskAssessmentViewSubmitted(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : Execution started.');
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
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted :  No Input parameters value for [ORM].[GetRASubmitted] procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted :  UserName       = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted :  AccountGUID    = ' + accountGUIDFromToken);

            return request.execute('[ORM].[GetRASubmitted]').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : Output parameters value of [ORM].[GetRASubmitted] procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : No Input parameters value for [ORM].[GetRASubmitted] procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : UserName       = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : AccountGUID    = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : No Input parameters value for [ORM].[GetRASubmitted] procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : UserName       = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : AccountGUID    = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAssessmentViewSubmitted : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch risk metrics from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getRiskMetrics(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : getRiskMetrics : Execution started.');
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
 
            request.input('UserGUID',    MSSQL.UniqueIdentifier, userIdFromToken);
            request.input('UserName',    MSSQL.NVarChar,         userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Input parameters value for ORM.GetRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : UserGUID      = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : UserName      = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : AccountGUID   = ' + accountGUIDFromToken);

            return request.execute('ORM.GetRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Output parameters value of ORM.GetRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Input parameters value for ORM.GetRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : UserGUID      = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : UserName      = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : AccountGUID   = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Input parameters value for ORM.GetRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : UserGUID      = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : UserName      = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : AccountGUID   = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetrics : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch risk metrics from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async getRiskMetricsMaker(userIdFromToken,userNameFromToken, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : getRiskMetricsMaker : Execution started.');
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
 
            request.input('UserGUID',    MSSQL.UniqueIdentifier, userIdFromToken);
            request.input('UserName',    MSSQL.NVarChar,         userNameFromToken);
            request.input('AccountGUID', MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Input parameters value for ORM.GetMakerRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : UserGUID      = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : UserName      = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : AccountGUID   = ' + accountGUIDFromToken);

            return request.execute('ORM.GetMakerRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Output parameters value of ORM.GetMakerRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Input parameters value for ORM.GetMakerRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : UserGUID      = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : UserName      = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : AccountGUID   = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Input parameters value for ORM.GetMakerRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : UserGUID      = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : UserName      = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : AccountGUID   = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskMetricsMaker : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will save self scoring assessment details to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async setRiskMetricsDraft(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : setRiskMetricsDraft : Execution started.');
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
 
            request.input('CollectionDraftData',    MSSQL.NVarChar ,            JSON.stringify(data));
            request.input('UserGUID',               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input('UserName',               MSSQL.NVarChar,             userNameFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier,     accountGUIDFromToken);
            request.output('Success',               MSSQL.Bit);
            request.output('OutMessage',            MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Input parameters value for ORM.DraftRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : CollectionDraftData        = ' + JSON.stringify(data));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : UserName                   = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : UserGUID                   = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : AccountGUID                = ' + accountGUIDFromToken);

            return request.execute('ORM.DraftRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Output parameters value of ORM.DraftRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Input parameters value for ORM.DraftRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : CollectionDraftData        = ' + JSON.stringify(data));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : UserName                   = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : UserGUID                   = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : AccountGUID                = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Input parameters value for ORM.DraftRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : CollectionDraftData        = ' + JSON.stringify(data));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : UserName                   = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : UserGUID                   = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : AccountGUID                = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsDraft : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add reviewed self scoring assessment details to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async setRiskMetricsSubmit(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : setRiskMetricsSubmit : Execution started.');
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
 
            request.input('unitId' ,                MSSQL.Int ,                 data.unitId);
            request.input('collectionScheduleId',   MSSQL.BigInt ,              data.collectionScheduleId);
            request.input('UserGUID',               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input('UserName',               MSSQL.NVarChar,             userNameFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier,     accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Input parameters value for ORM.SubmitRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : collectionScheduleId     = ' + data.collectionScheduleId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : unitId                   = ' + data.unitId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : UserName                 = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : UserGUID                 = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : AccountGUID              = ' + accountGUIDFromToken);

            return request.execute('ORM.SubmitRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Output parameters value of ORM.SubmitRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Input parameters value for ORM.SubmitRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : collectionScheduleId     = ' + data.collectionScheduleId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : unitId                   = ' + data.unitId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : UserName                 = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : UserGUID                 = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : AccountGUID              = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Input parameters value for ORM.SubmitRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : collectionScheduleId     = ' + data.collectionScheduleId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : unitId                   = ' + data.unitId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : UserName                 = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : UserGUID                 = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : AccountGUID              = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsSubmit : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will  Approve or Reject a single or multiple risk metric
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async setRiskMetricReview(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : setRiskMetricReview : Execution started.');
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
            request.input('CollectionReviewData' ,    MSSQL.NVarChar ,          JSON.stringify(data));
            request.input('UserName',                 MSSQL.NVarChar,           userNameFromToken);
            request.input('UserGUID',                 MSSQL.UniqueIdentifier,   userIdFromToken);
            request.input('AccountGUID',              MSSQL.UniqueIdentifier,   accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Input parameters value for ORM.ReviewRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : CollectionReviewData        = ' + JSON.stringify(data));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : UserName                    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : UserGUID                    = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : AccountGUID                 = ' + accountGUIDFromToken);

            return request.execute('ORM.ReviewRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Output parameters value of ORM.ReviewRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Input parameters value for ORM.ReviewRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : CollectionReviewData       = ' + JSON.stringify(data));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : UserName                   = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : UserGUID                   = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : AccountGUID                = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Input parameters value for ORM.ReviewRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : CollectionReviewData       = ' + JSON.stringify(data));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : UserName                   = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : UserGUID                   = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : AccountGUID                = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricReview : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will  Submit risk metrics for a unit once reviewed to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
    async setRiskMetricsReview(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : setRiskMetricsReview : Execution started.');
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
 
            request.input('unitId' ,                MSSQL.Int ,                 data.unitId);
            request.input('collectionScheduleId',   MSSQL.BigInt ,              data.collectionScheduleId);
            request.input('UserName',               MSSQL.NVarChar,             userNameFromToken);
            request.input('UserGUID',               MSSQL.UniqueIdentifier,     userIdFromToken);
            request.input('AccountGUID',            MSSQL.UniqueIdentifier,     accountGUIDFromToken);
            request.output('Success',               MSSQL.Bit);
            request.output('OutMessage',            MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Input parameters value for ORM.SubmitReviewRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : collectionScheduleId     = ' + data.collectionScheduleId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : unitId                   = ' + data.unitId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : UserName                 = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : UserGUID                 = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : AccountGUID              = ' + accountGUIDFromToken);

            return request.execute('ORM.SubmitReviewRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Output parameters value of ORM.SubmitReviewRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Input parameters value for ORM.SubmitReviewRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : collectionScheduleId     = ' + data.collectionScheduleId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : unitId                   = ' + data.unitId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : UserName                 = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : UserGUID                 = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : AccountGUID              = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Input parameters value for ORM.SubmitReviewRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : collectionScheduleId     = ' + data.collectionScheduleId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : unitId                   = ' + data.unitId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : UserName                 = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : UserGUID                 = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : AccountGUID              = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : setRiskMetricsReview : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

     /**
     * This function will fetch risk metrics from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns 
     */
    async getRiskAsessmentDetails(userIdFromToken,userNameFromToken,data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : getRiskAsessmentDetails : Execution started.');
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
 
            request.input('CollectionScheduleID',  MSSQL.Int,               data.collectionScheduleId)
            request.input('UserGUID',              MSSQL.UniqueIdentifier,  userIdFromToken);
            request.input('UserName',              MSSQL.NVarChar,          userNameFromToken);
            request.input('AccountGUID',           MSSQL.UniqueIdentifier,  accountGUIDFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Input parameters value for ORM.GetHistoricalRACollections procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : CollectionScheduleID      = ' + data.collectionScheduleId);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : UserGUID                  = ' + userIdFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : UserName                  = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : AccountGUID               = ' + accountGUIDFromToken);

            return request.execute('ORM.GetHistoricalRACollections').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Output parameters value of ORM.GetHistoricalRACollections procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Input parameters value for ORM.GetHistoricalRACollections procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : CollectionScheduleID   = ' + data.collectionScheduleId);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : UserGUID               = ' + userIdFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : UserName               = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : AccountGUID            = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Input parameters value for ORM.GetHistoricalRACollections procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : CollectionScheduleID      = ' + data.collectionScheduleId);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : UserGUID                  = ' + userIdFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : UserName                  = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : AccountGUID               = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : getRiskAsessmentDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will upload Risk Unit Maker evidence file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} remarks
     * @param {*} accountGUIDFromToken
     * @param {*} callback 
     */
    uploadRiskUnitMakerEvidence(userIdFromToken, userNameFromToken, data, remarks, accountGUIDFromToken, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Execution started.');
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

            request.input('CollectionID',       MSSQL.BigInt,        data.CollectionID);
            request.input('EvidenceID',         MSSQL.BigInt,       (data.EvidenceID || null));
            request.input('FileName',           MSSQL.NVarChar,     data.fileName);
            request.input('FileType',           MSSQL.NVarChar,     data.fileType)
            request.input('FileContent',        MSSQL.VarBinary,    data.fileContent);
            request.input('Remark',             MSSQL.NVarChar,     remarks)
            request.input('UserName',           MSSQL.NVarChar,     userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Input parameters value for ORM.RA_UploadActionPlanEvidences procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : UserName               = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : CollectionID           = ' + data.CollectionID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : EvidenceID             = ' + (data.EvidenceID || null));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : FileName               = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : FileType               = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Remarks                = ' + remarks);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : AccountGUID            = ' + accountGUIDFromToken);

            request.execute('ORM.RA_UploadActionPlanEvidences').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Output parameters value of ORM.RA_UploadActionPlanEvidences procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Input parameters value for ORM.RA_UploadActionPlanEvidences procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : CollectionID         = ' + data.CollectionID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : EvidenceID           = ' + (data.EvidenceID || null));
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : FileName             = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : FileType             = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Remarks              = ' + remarks);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : AccountGUID          = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Input parameters value for ORM.RA_UploadActionPlanEvidences procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : CollectionID         = ' + data.CollectionID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : EvidenceID           = ' + (data.EvidenceID || null));
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : FileName             = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : FileType             = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Remarks              = ' + remarks);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : AccountGUID          = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : uploadRiskUnitMakerEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }    

    /**
     * This function delete Risk Unit Maker evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data 
     * @param {*} accountGUIDFromToken   
     * @returns 
     */
    async deleteRiskUnitMakerEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Execution started.');
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

            request.input('EvidenceID',         MSSQL.BigInt,   data.EvidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',        MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Input parameters value for ORM.RA_DeleteActionPlanEvidences procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : EvidenceID  = ' + data.EvidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : AccountGUID = ' + accountGUIDFromToken);

            return request.execute('ORM.RA_DeleteActionPlanEvidences').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Output parameters value of ORM.RA_DeleteActionPlanEvidences procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Input parameters value for ORM.RA_DeleteActionPlanEvidences procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : EvidenceID  = ' + data.EvidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : AccountGUID = ' + accountGUIDFromToken); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Input parameters value for ORM.RA_DeleteActionPlanEvidences procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : EvidenceID  = ' + data.EvidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : AccountGUID = ' + accountGUIDFromToken); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : deleteRiskUnitMakerEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }  
    
    /**
     * This function get Risk Unit Maker evidence data from database
     * @param {*} userIdFromToken
     * @param {*} userNameFromToken
     * @param {*} data
     * @param {*} accountGUIDFromToken
     * @returns
     */
    async downloadRiskUnitMakerEvidence(userIdFromToken, userNameFromToken, data, accountGUIDFromToken) {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('CollectionID',   MSSQL.BigInt,   data.CollectionID);
            request.input('FileContentID',  MSSQL.BigInt,   data.FileContentID);
            request.input('EvidenceID',     MSSQL.BigInt,   data.EvidenceID);
            request.input('UserName',       MSSQL.NVarChar, userNameFromToken);
            request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output('Success', MSSQL.Bit);
            request.output('OutMessage', MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Input parameters value for ORM.RA_DownloadActionPlanEvidences procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : userName         = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : CollectionID     = ' + data.CollectionID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : FileContentID    = ' + data.FileContentID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : EvidenceID       = ' + data.EvidenceID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : AccountGUID      = ' + accountGUIDFromToken);

            return request.execute('ORM.RA_DownloadActionPlanEvidences').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Output parameters value of ORM.RA_DownloadActionPlanEvidences procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Input parameters value for ORM.RA_DownloadActionPlanEvidences procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : EvidenceID  = ' + data.EvidenceID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : AccountGUID = ' + accountGUIDFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Execution end. : Error details : ' + error);

                dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;

                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Input parameters value for ORM.RA_DownloadActionPlanEvidences procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : EvidenceID  = ' + data.EvidenceID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : AccountGUID = ' + accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAssessmentDb : downloadRiskUnitMakerEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

            return dbResponseObj;
        }
    }    

       /**
     * 
     * @param {*} request 
     * @param {*} response
     * @param {*} accountGUIDFromToken 
     * @returns 
     */
        async getEmailReminderDataRA(userIdFromToken, userNameFromToken,data, accountGUIDFromToken) {
            logger.log("info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Execution started.");
            /**
             *   dbResponseObj.status values
             *   1 - Successful operation
             *   0 - Error while connecting database
             *   2 - Error while executing procedure
             */
            var dbResponseObj = {
                status:             CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                recordset:          CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                errorMsg:           CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                procedureSuccess:   CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                procedureMessage:   CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            };
    
            try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input("CollectionScheduleId",    MSSQL.NVarChar, data.collectionScheduleId);
            request.input("AccountGUID",             MSSQL.UniqueIdentifier, accountGUIDFromToken);
            request.output("Success",                MSSQL.Bit);
            request.output("OutMessage",             MSSQL.VarChar);
    
            logger.log("info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Input parameters value for ORM.RCSA_getEmailReminderDataRA procedure.");
            logger.log("info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : CollectionID   = " + data.collectionScheduleId);
            logger.log("info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : AccountGUID    = " + accountGUIDFromToken);
    
            return request.execute("ORM.RA_GetDataforReminderEmail").then(function (result) {
                logger.log("info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Output parameters value of ORM.RCSA_getEmailReminderDataRA procedure.");
                logger.log( "info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Success       = " + result.output.Success );
                logger.log( "info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : OutMessage    = " + result.output.OutMessage );
    
                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;
    
                logger.log( "info", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Execution end. dbResponseObj : " + JSON.stringify(dbResponseObj || null) );
    
                return dbResponseObj;
                })
                .catch(function (error) {
                logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
                logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : UserName       = " + userNameFromToken );
                logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : AccountGUID    = " + accountGUIDFromToken);
                logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Execution end. : Error details : " + error );
    
                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
                });
            } catch (error) {
            logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
            logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : UserName       = " + userNameFromToken );
            logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : AccountGUID    = " + accountGUIDFromToken);
            logger.log( "error", "User Id : " + userIdFromToken + " : RiskAssessmentDb : getEmailReminderDataRA : Execution end. : Error details : " + error );
    
            dbResponseObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
    
            return dbResponseObj;
            }
        }

    stop() {
    }
}